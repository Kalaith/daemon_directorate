// utils/standardErrorHandling.ts - Standardized error handling across all layers
import {
  GameError,
  ValidationError,
  BusinessRuleError,
  SystemError,
} from './errorHandling';

// Error categories for consistent handling
export const ErrorCategory = {
  VALIDATION: 'validation',
  BUSINESS_RULE: 'business_rule',
  SYSTEM: 'system',
  NETWORK: 'network',
  PERMISSION: 'permission',
} as const;

export type ErrorCategory = (typeof ErrorCategory)[keyof typeof ErrorCategory];

// Standardized error handler wrapper
export const withErrorHandling = <Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
  context: string,
  category: ErrorCategory = ErrorCategory.SYSTEM
): ((...args: Args) => Return) => {
  return (...args: Args): Return => {
    try {
      const result = fn(...args) as Return;

      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error: unknown) => {
          handleError(error, context, category);
          throw error;
        }) as Return;
      }

      return result;
    } catch (error: unknown) {
      handleError(error, context, category);
      throw error;
    }
  };
};

// Centralized error handling logic
export const handleError = (
  error: unknown,
  context: string,
  category: ErrorCategory
): void => {
  const gameError = normalizeError(error, context, category);

  // Log error for debugging
  logError(gameError, context, category);

  // Report to monitoring service in production
  reportError(gameError, context, category);

  // Show user notification if appropriate
  notifyUser(gameError, category);
};

// Convert any error to GameError
const normalizeError = (
  error: unknown,
  context: string,
  category: ErrorCategory
): GameError => {
  if (error instanceof GameError) {
    return error;
  }

  if (error instanceof Error) {
    switch (category) {
      case ErrorCategory.VALIDATION:
        return new ValidationError(error.message);
      case ErrorCategory.BUSINESS_RULE:
        return new BusinessRuleError(error.message);
      default:
        return new SystemError(error.message, error);
    }
  }

  return new SystemError(`Unknown error in ${context}: ${String(error)}`);
};

// Structured logging
const logError = (
  error: GameError,
  context: string,
  category: ErrorCategory
): void => {
  const logData = {
    context,
    category,
    type: error.type,
    message: error.message,
    userMessage: error.userMessage,
    details: error.details,
    timestamp: new Date().toISOString(),
    stack: error.stack,
  };

  if (import.meta.env.MODE === 'development') {
    console.group(`🚨 ${category.toUpperCase()} Error in ${context}`);
    console.error('Error:', error.message);
    console.error('User Message:', error.userMessage);
    if (error.details) {
      console.error('Details:', error.details);
    }
    console.error('Stack:', error.stack);
    console.groupEnd();
  } else {
    // In production, send to logging service
    console.error(JSON.stringify(logData));
  }
};

// Error reporting (would integrate with services like Sentry)
const reportError = (
  error: GameError,
  context: string,
  category: ErrorCategory
): void => {
  // Suppress unused parameter warnings - these will be used when error reporting is implemented
  void error;
  void context;
  void category;

  if (import.meta.env.PROD) {
    // In production, would send to error tracking service
    // Sentry.captureException(error, {
    //   tags: { context, category },
    //   extra: error.details,
    // });
  }
};

// User notification based on error category
const notifyUser = (error: GameError, category: ErrorCategory): void => {
  // This would integrate with the notification system
  // For now, we'll use console to demonstrate the pattern

  const shouldNotify = shouldNotifyUser(category);
  if (!shouldNotify) return;

  const notificationType = getNotificationType(category);

  // In a real implementation, this would call the notification context
  console.log(`Notification: ${notificationType} - ${error.userMessage}`);
};

const shouldNotifyUser = (category: ErrorCategory): boolean => {
  switch (category) {
    case ErrorCategory.VALIDATION:
    case ErrorCategory.BUSINESS_RULE:
    case ErrorCategory.PERMISSION:
      return true;
    case ErrorCategory.SYSTEM:
    case ErrorCategory.NETWORK:
      return false; // Handle silently or with generic message
    default:
      return false;
  }
};

const getNotificationType = (category: ErrorCategory): string => {
  switch (category) {
    case ErrorCategory.VALIDATION:
      return 'warning';
    case ErrorCategory.BUSINESS_RULE:
      return 'info';
    case ErrorCategory.PERMISSION:
      return 'error';
    default:
      return 'error';
  }
};

// Store action wrapper for consistent error handling
export const withGameActionErrorHandling = <
  Args extends unknown[],
  Return,
>(
  action: (...args: Args) => Return,
  actionName: string
): ((...args: Args) => Return) => {
  return withErrorHandling(
    action,
    `Game Action: ${actionName}`,
    ErrorCategory.BUSINESS_RULE
  );
};

// Validation wrapper
export const withValidation = <Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
  validationName: string
): ((...args: Args) => Return) => {
  return withErrorHandling(
    fn,
    `Validation: ${validationName}`,
    ErrorCategory.VALIDATION
  );
};

// Network operation wrapper
export const withNetworkErrorHandling = <
  Args extends unknown[],
  Return,
>(
  fn: (...args: Args) => Return,
  operationName: string
): ((...args: Args) => Return) => {
  return withErrorHandling(
    fn,
    `Network: ${operationName}`,
    ErrorCategory.NETWORK
  );
};

// Component error handler
export const withComponentErrorHandling = <
  Args extends unknown[],
  Return,
>(
  fn: (...args: Args) => Return,
  componentName: string
): ((...args: Args) => Return) => {
  return withErrorHandling(
    fn,
    `Component: ${componentName}`,
    ErrorCategory.SYSTEM
  );
};

// Retry wrapper with exponential backoff
export const withRetry = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  context: string = 'Unknown Operation'
): T => {
  return (async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return (await fn(...args)) as Awaited<ReturnType<T>>;
      } catch (error) {
        lastError = error;

        if (attempt === maxRetries) {
          break; // Don't wait after the last attempt
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.warn(
          `${context} failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`
        );

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    handleError(
      lastError,
      `${context} (after ${maxRetries} attempts)`,
      ErrorCategory.SYSTEM
    );
    throw lastError;
  }) as T;
};

// Error boundary integration
export const createErrorBoundaryHandler = (context: string) => {
  return (error: Error) => {
    const gameError = new SystemError(
      `Component error in ${context}: ${error.message}`,
      error
    );

    handleError(gameError, `Error Boundary: ${context}`, ErrorCategory.SYSTEM);
  };
};
