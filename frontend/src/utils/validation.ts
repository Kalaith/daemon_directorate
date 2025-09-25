// utils/validation.ts - Input validation layer with schema validation
import { ValidationError } from './errorHandling';
import { gameConfig } from '../config/gameConfig';

// Validation result type
interface ValidationResult<T = unknown> {
  isValid: boolean;
  data?: T;
  errors: string[];
}

// Schema definition interface
interface Schema {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  properties?: Record<string, Schema>;
  items?: Schema;
  validator?: (value: unknown) => boolean;
  message?: string;
}

// Validation context for better error messages
interface ValidationContext {
  path: string;
  parent?: unknown;
}

// Core validator class
class Validator {
  // Validate value against schema
  validate<T = unknown>(value: unknown, schema: Schema, context: ValidationContext = { path: 'root' }): ValidationResult<T> {
    const errors: string[] = [];

    // Check required
    if (schema.required && (value === undefined || value === null)) {
      errors.push(`${context.path} is required`);
      return { isValid: false, errors };
    }

    // Skip validation if not required and value is empty
    if (!schema.required && (value === undefined || value === null)) {
      return { isValid: true, data: value as T, errors: [] };
    }

    // Type validation
    const typeError = this.validateType(value, schema, context);
    if (typeError) {
      errors.push(typeError);
    }

    // Range validation for numbers
    if (schema.type === 'number' && typeof value === 'number') {
      if (schema.min !== undefined && value < schema.min) {
        errors.push(`${context.path} must be at least ${schema.min}`);
      }
      if (schema.max !== undefined && value > schema.max) {
        errors.push(`${context.path} must be at most ${schema.max}`);
      }
    }

    // Length validation for strings and arrays
    if ((schema.type === 'string' || schema.type === 'array') && (typeof value === 'string' || Array.isArray(value))) {
      if (schema.min !== undefined && value.length < schema.min) {
        errors.push(`${context.path} must have at least ${schema.min} ${schema.type === 'string' ? 'characters' : 'items'}`);
      }
      if (schema.max !== undefined && value.length > schema.max) {
        errors.push(`${context.path} must have at most ${schema.max} ${schema.type === 'string' ? 'characters' : 'items'}`);
      }
    }

    // Pattern validation for strings
    if (schema.type === 'string' && typeof value === 'string' && schema.pattern) {
      if (!schema.pattern.test(value)) {
        errors.push(schema.message || `${context.path} format is invalid`);
      }
    }

    // Object property validation
    if (schema.type === 'object' && typeof value === 'object' && value !== null && schema.properties) {
      const obj = value as Record<string, unknown>;
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        const propResult = this.validate(obj[key], propSchema, {
          path: `${context.path}.${key}`,
          parent: value
        });
        errors.push(...propResult.errors);
      }
    }

    // Array item validation
    if (schema.type === 'array' && Array.isArray(value) && schema.items) {
      value.forEach((item, index) => {
        const itemResult = this.validate(item, schema.items!, {
          path: `${context.path}[${index}]`,
          parent: value
        });
        errors.push(...itemResult.errors);
      });
    }

    // Custom validator
    if (schema.validator && !schema.validator(value)) {
      errors.push(schema.message || `${context.path} failed custom validation`);
    }

    return {
      isValid: errors.length === 0,
      data: errors.length === 0 ? (value as T) : undefined,
      errors,
    };
  }

  private validateType(value: unknown, schema: Schema, context: ValidationContext): string | null {
    const actualType = Array.isArray(value) ? 'array' : typeof value;

    if (actualType !== schema.type) {
      return `${context.path} must be of type ${schema.type}, got ${actualType}`;
    }

    return null;
  }
}

// Global validator instance
const validator = new Validator();

// Game-specific validation schemas
export const GameSchemas = {
  // Daemon validation
  daemon: {
    type: 'object' as const,
    required: true,
    properties: {
      id: { type: 'string' as const, required: true, min: 1 },
      name: { type: 'string' as const, required: true, min: 1, max: 50 },
      type: { type: 'string' as const, required: true },
      tier: { type: 'number' as const, required: true, min: 1, max: 5 },
      health: { type: 'number' as const, required: true, min: 0, max: 100 },
      morale: { type: 'number' as const, required: true, min: 0, max: 100 },
      experience: { type: 'number' as const, required: true, min: 0 },
    },
  },

  // Resource validation
  resources: {
    type: 'object' as const,
    required: true,
    properties: {
      credits: { type: 'number' as const, required: true, min: 0 },
      soulEssence: { type: 'number' as const, required: true, min: 0 },
      bureaucraticLeverage: { type: 'number' as const, required: true, min: 0 },
      rawMaterials: { type: 'number' as const, required: true, min: 0 },
    },
  },

  // Mission validation
  mission: {
    type: 'object' as const,
    required: true,
    properties: {
      id: { type: 'string' as const, required: true, min: 1 },
      planetId: { type: 'string' as const, required: true, min: 1 },
      teamIds: {
        type: 'array' as const,
        required: true,
        min: 1,
        max: gameConfig.get('balance.maxDaemonsActive'),
        items: { type: 'string' as const, min: 1 }
      },
      type: { type: 'string' as const, required: true },
    },
  },

  // Planet validation
  planet: {
    type: 'object' as const,
    required: true,
    properties: {
      id: { type: 'string' as const, required: true, min: 1 },
      name: { type: 'string' as const, required: true, min: 1, max: 50 },
      type: { type: 'string' as const, required: true },
      difficulty: { type: 'string' as const, required: true },
      resistance: { type: 'number' as const, required: true, min: 0, max: 100 },
      conquered: { type: 'boolean' as const, required: true },
    },
  },

  // User input validation
  userInput: {
    daemonName: {
      type: 'string' as const,
      required: true,
      min: 1,
      max: 30,
      pattern: /^[a-zA-Z0-9\s\-_']+$/,
      message: 'Daemon name can only contain letters, numbers, spaces, hyphens, underscores, and apostrophes',
    },

    planetName: {
      type: 'string' as const,
      required: true,
      min: 1,
      max: 50,
      pattern: /^[a-zA-Z0-9\s\-_']+$/,
      message: 'Planet name can only contain letters, numbers, spaces, hyphens, underscores, and apostrophes',
    },

    resourceAmount: {
      type: 'number' as const,
      required: true,
      min: 0,
      max: 999999999,
      validator: (value: unknown) => typeof value === 'number' && Number.isInteger(value),
      message: 'Resource amount must be a positive integer',
    },

    teamSize: {
      type: 'number' as const,
      required: true,
      min: 1,
      max: gameConfig.get('balance.maxDaemonsActive'),
      validator: (value: unknown) => typeof value === 'number' && Number.isInteger(value),
      message: `Team size must be between 1 and ${gameConfig.get('balance.maxDaemonsActive')} daemons`,
    },
  },
};

// Validation utility functions
export const validateInput = <T = unknown>(value: unknown, schema: Schema): T => {
  const result = validator.validate<T>(value, schema);

  if (!result.isValid) {
    throw new ValidationError(`Validation failed: ${result.errors.join(', ')}`);
  }

  return result.data!;
};

export const validateInputSafe = <T = unknown>(value: unknown, schema: Schema): ValidationResult<T> => {
  return validator.validate<T>(value, schema);
};

// Game-specific validation functions
export const GameValidators = {
  validateDaemon: (daemon: unknown) => validateInput(daemon, GameSchemas.daemon),
  validateResources: (resources: unknown) => validateInput(resources, GameSchemas.resources),
  validateMission: (mission: unknown) => validateInput(mission, GameSchemas.mission),
  validatePlanet: (planet: unknown) => validateInput(planet, GameSchemas.planet),

  // Safe versions that return validation results
  validateDaemonSafe: (daemon: unknown) => validateInputSafe(daemon, GameSchemas.daemon),
  validateResourcesSafe: (resources: unknown) => validateInputSafe(resources, GameSchemas.resources),
  validateMissionSafe: (mission: unknown) => validateInputSafe(mission, GameSchemas.mission),
  validatePlanetSafe: (planet: unknown) => validateInputSafe(planet, GameSchemas.planet),

  // User input validators
  validateDaemonName: (name: unknown) => validateInput(name, GameSchemas.userInput.daemonName),
  validatePlanetName: (name: unknown) => validateInput(name, GameSchemas.userInput.planetName),
  validateResourceAmount: (amount: unknown) => validateInput(amount, GameSchemas.userInput.resourceAmount),
  validateTeamSize: (size: unknown) => validateInput(size, GameSchemas.userInput.teamSize),
};

// React hook for validation
export const useValidation = () => {
  return {
    validate: validateInput,
    validateSafe: validateInputSafe,
    ...GameValidators,
  };
};

// Export types
export type { ValidationResult, Schema, ValidationContext };
export { Validator };