// utils/errorHandling.ts - Centralized error handling utilities
import type { NotificationType } from '../types/game';

export class GameError extends Error {
  public readonly type: 'validation' | 'business' | 'system';
  public readonly userMessage: string;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    type: 'validation' | 'business' | 'system' = 'system',
    userMessage?: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'GameError';
    this.type = type;
    this.userMessage = userMessage || message;
    this.details = details;
  }
}

export class ValidationError extends GameError {
  constructor(message: string, field?: string, value?: unknown) {
    super(
      message,
      'validation',
      `Invalid input: ${message}`,
      { field, value }
    );
    this.name = 'ValidationError';
  }
}

export class BusinessRuleError extends GameError {
  constructor(message: string, userMessage?: string) {
    super(message, 'business', userMessage || message);
    this.name = 'BusinessRuleError';
  }
}

export class SystemError extends GameError {
  constructor(message: string, originalError?: Error) {
    super(
      message,
      'system',
      'An unexpected error occurred. Please try again.',
      { originalError: originalError?.message }
    );
    this.name = 'SystemError';
  }
}

// Error handler that maps errors to user notifications
export const handleGameError = (
  error: unknown,
  addNotification: (message: string, type?: NotificationType) => void,
  context?: string
): void => {
  console.error(`Game error ${context ? `in ${context}` : ''}:`, error);

  if (error instanceof GameError) {
    const notificationType: NotificationType =
      error.type === 'validation' ? 'warning' :
      error.type === 'business' ? 'info' : 'error';

    addNotification(error.userMessage, notificationType);
  } else if (error instanceof Error) {
    addNotification(
      'An unexpected error occurred. Please try again.',
      'error'
    );
  } else {
    addNotification(
      'Something went wrong. Please refresh the page.',
      'error'
    );
  }
};

// Async error wrapper for better error handling in async operations
export const withErrorHandling = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  addNotification: (message: string, type?: NotificationType) => void,
  context?: string
): T => {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args);

      // Handle promise rejections
      if (result instanceof Promise) {
        return result.catch(error => {
          handleGameError(error, addNotification, context);
          throw error;
        });
      }

      return result;
    } catch (error) {
      handleGameError(error, addNotification, context);
      throw error;
    }
  }) as T;
};

// Input validation helpers
export const validateRequired = (value: unknown, fieldName: string): void => {
  if (value === null || value === undefined || value === '') {
    throw new ValidationError(`${fieldName} is required`, fieldName, value);
  }
};

export const validateString = (value: unknown, fieldName: string, minLength = 0): string => {
  validateRequired(value, fieldName);

  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`, fieldName, value);
  }

  if (value.length < minLength) {
    throw new ValidationError(
      `${fieldName} must be at least ${minLength} characters`,
      fieldName,
      value
    );
  }

  return value;
};

export const validateNumber = (
  value: unknown,
  fieldName: string,
  min?: number,
  max?: number
): number => {
  validateRequired(value, fieldName);

  if (typeof value !== 'number' || !isFinite(value)) {
    throw new ValidationError(`${fieldName} must be a valid number`, fieldName, value);
  }

  if (min !== undefined && value < min) {
    throw new ValidationError(
      `${fieldName} must be at least ${min}`,
      fieldName,
      value
    );
  }

  if (max !== undefined && value > max) {
    throw new ValidationError(
      `${fieldName} must be at most ${max}`,
      fieldName,
      value
    );
  }

  return value;
};

export const validatePositiveNumber = (value: unknown, fieldName: string): number => {
  return validateNumber(value, fieldName, 0);
};

export const validatePercentage = (value: unknown, fieldName: string): number => {
  return validateNumber(value, fieldName, 0, 100);
};

export const validateArrayNotEmpty = <T>(
  value: unknown,
  fieldName: string
): T[] => {
  validateRequired(value, fieldName);

  if (!Array.isArray(value)) {
    throw new ValidationError(`${fieldName} must be an array`, fieldName, value);
  }

  if (value.length === 0) {
    throw new ValidationError(`${fieldName} cannot be empty`, fieldName, value);
  }

  return value;
};

// Business rule validation helpers
export const validateDaemonCanBeRecruited = (
  daemon: { cost?: number; isActive?: boolean },
  currentCredits: number
): void => {
  if (!daemon.cost) {
    throw new BusinessRuleError('This daemon cannot be recruited');
  }

  if (currentCredits < daemon.cost) {
    throw new BusinessRuleError(
      `Insufficient credits. Need ${daemon.cost}, have ${currentCredits}`,
      `You need ${daemon.cost} credits to recruit this daemon`
    );
  }

  if (daemon.isActive) {
    throw new BusinessRuleError('This daemon is already active');
  }
};

export const validateMissionCanBeStarted = (
  selectedDaemons: Set<string>,
  planet: { conquered?: boolean } | null
): void => {
  if (selectedDaemons.size === 0) {
    throw new BusinessRuleError(
      'No team selected',
      'Please select at least one daemon for the mission'
    );
  }

  if (!planet) {
    throw new BusinessRuleError(
      'No planet selected',
      'Please select a planet for the mission'
    );
  }

  if (planet.conquered) {
    throw new BusinessRuleError(
      'Planet already conquered',
      'This planet has already been conquered'
    );
  }
};

export const validateRoomCanBeUpgraded = (
  room: { level: number; upgrade_cost: number } | null,
  currentCredits: number
): void => {
  if (!room) {
    throw new BusinessRuleError('Room not found');
  }

  if (currentCredits < room.upgrade_cost) {
    throw new BusinessRuleError(
      `Insufficient credits for upgrade. Need ${room.upgrade_cost}, have ${currentCredits}`,
      `You need ${room.upgrade_cost} credits to upgrade this room`
    );
  }
};