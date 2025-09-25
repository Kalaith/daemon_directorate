// utils/logger.ts - Structured logging system
import { gameConfig } from '../config/gameConfig';

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

// Log context interface
interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  gameState?: string;
  performance?: {
    duration?: number;
    memory?: number;
  };
  metadata?: Record<string, unknown>;
}

// Log entry interface
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context: LogContext;
  stack?: string;
}

// Logger configuration
interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  maxBufferSize: number;
  flushInterval: number;
}

// Structured logger class
class StructuredLogger {
  private config: LoggerConfig;
  private buffer: LogEntry[] = [];
  private flushTimer?: NodeJS.Timeout;

  constructor(config: LoggerConfig) {
    this.config = config;
    this.startFlushTimer();
  }

  // Core logging method
  private log(level: LogLevel, message: string, context: LogContext = {}): void {
    if (level < this.config.minLevel) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: {
        sessionId: this.getSessionId(),
        gameState: this.getGameState(),
        ...context,
      },
      stack: level >= LogLevel.ERROR ? new Error().stack : undefined,
    };

    // Add to buffer
    this.buffer.push(entry);

    // Console output in development
    if (this.config.enableConsole && gameConfig.isDevelopment()) {
      this.logToConsole(entry);
    }

    // Flush if buffer is full
    if (this.buffer.length >= this.config.maxBufferSize) {
      this.flush();
    }
  }

  // Public logging methods
  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext: LogContext = {
      ...context,
      metadata: {
        ...context?.metadata,
        errorName: error?.name,
        errorMessage: error?.message,
        errorStack: error?.stack,
      },
    };

    this.log(LogLevel.ERROR, message, errorContext);
  }

  fatal(message: string, error?: Error, context?: LogContext): void {
    const errorContext: LogContext = {
      ...context,
      metadata: {
        ...context?.metadata,
        errorName: error?.name,
        errorMessage: error?.message,
        errorStack: error?.stack,
      },
    };

    this.log(LogLevel.FATAL, message, errorContext);
    this.flush(); // Immediately flush fatal errors
  }

  // Performance logging
  logPerformance(operation: string, duration: number, context?: LogContext): void {
    this.info(`Performance: ${operation}`, {
      ...context,
      component: context?.component || 'Performance',
      action: operation,
      performance: {
        duration,
        memory: this.getMemoryUsage(),
      },
    });
  }

  // Game-specific logging methods
  logGameAction(action: string, details: Record<string, unknown>, context?: LogContext): void {
    this.info(`Game Action: ${action}`, {
      ...context,
      component: 'GameAction',
      action,
      metadata: details,
    });
  }

  logMissionEvent(missionId: string, event: string, details: Record<string, unknown>): void {
    this.info(`Mission Event: ${event}`, {
      component: 'Mission',
      action: event,
      metadata: {
        missionId,
        ...details,
      },
    });
  }

  logResourceChange(type: string, amount: number, reason: string): void {
    this.info(`Resource Change: ${type}`, {
      component: 'Resources',
      action: 'ResourceChange',
      metadata: {
        resourceType: type,
        amount,
        reason,
      },
    });
  }

  // Utility methods
  private logToConsole(entry: LogEntry): void {
    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
    const levelColors = ['#888', '#0066cc', '#ff9900', '#cc0000', '#990000'];

    const style = `color: ${levelColors[entry.level]}; font-weight: bold;`;
    const context = Object.keys(entry.context).length > 0 ? entry.context : '';

    console.group(`%c[${levelNames[entry.level]}] ${entry.message}`, style);

    if (context) {
      console.log('Context:', context);
    }

    if (entry.stack && entry.level >= LogLevel.ERROR) {
      console.log('Stack:', entry.stack);
    }

    console.groupEnd();
  }

  private getSessionId(): string {
    // Simple session ID - in real app would be more sophisticated
    let sessionId = sessionStorage.getItem('gameSessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('gameSessionId', sessionId);
    }
    return sessionId;
  }

  private getGameState(): string {
    // Simplified game state indicator
    try {
      const saved = localStorage.getItem('daemon-directorate-v2');
      return saved ? 'has_save' : 'new_game';
    } catch {
      return 'unknown';
    }
  }

  private getMemoryUsage(): number {
    try {
      const memory = (performance as typeof performance & { memory?: { usedJSHeapSize: number } }).memory;
      return memory?.usedJSHeapSize || 0;
    } catch {
      return 0;
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      if (this.buffer.length > 0) {
        this.flush();
      }
    }, this.config.flushInterval);
  }

  private flush(): void {
    if (this.buffer.length === 0) return;

    const entries = [...this.buffer];
    this.buffer = [];

    if (this.config.enableRemote && gameConfig.isProduction()) {
      this.sendToRemote(entries);
    }
  }

  private async sendToRemote(entries: LogEntry[]): Promise<void> {
    // In a real application, would send to logging service like DataDog, LogRocket, etc.
    try {
      const payload = {
        entries,
        environment: gameConfig.isProduction() ? 'production' : 'development',
        buildVersion: gameConfig.get('environment.buildVersion'),
      };

      // Mock remote logging
      console.log('Would send logs to remote service:', payload);

      // Real implementation would be:
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });
    } catch (error) {
      console.error('Failed to send logs to remote service:', error);
    }
  }

  // Cleanup
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

// Default logger configuration
const defaultLoggerConfig: LoggerConfig = {
  minLevel: gameConfig.isDevelopment() ? LogLevel.DEBUG : LogLevel.INFO,
  enableConsole: gameConfig.get('debug.enableConsoleLogging'),
  enableRemote: gameConfig.get('environment.enableErrorReporting'),
  maxBufferSize: 50,
  flushInterval: 10000, // 10 seconds
};

// Global logger instance
export const logger = new StructuredLogger(defaultLoggerConfig);

// Export types
export type { LogContext, LogEntry, LoggerConfig };
export { StructuredLogger };