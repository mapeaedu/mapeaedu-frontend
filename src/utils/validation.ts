/**
 * Form validation utilities
 */

export type ValidationRule = (value: unknown) => string | undefined;

/**
 * Creates a required field validation rule
 * @param message Custom error message
 * @returns Validation rule function
 */
export const required = (message = 'This field is required'): ValidationRule => {
  return (value: unknown) => {
    if (value === undefined || value === null || value === '') {
      return message;
    }
    
    if (Array.isArray(value) && value.length === 0) {
      return message;
    }
    
    return undefined;
  };
};

/**
 * Creates a minimum length validation rule
 * @param min Minimum length
 * @param message Custom error message
 * @returns Validation rule function
 */
export const minLength = (min: number, message?: string): ValidationRule => {
  return (value: unknown) => {
    if (value === undefined || value === null || value === '') {
      return undefined; // Let required handle empty values
    }
    
    if (typeof value === 'string' && value.length < min) {
      return message || `Must be at least ${min} characters`;
    }
    
    return undefined;
  };
};

/**
 * Creates a maximum length validation rule
 * @param max Maximum length
 * @param message Custom error message
 * @returns Validation rule function
 */
export const maxLength = (max: number, message?: string): ValidationRule => {
  return (value: unknown) => {
    if (value === undefined || value === null || value === '') {
      return undefined; // Let required handle empty values
    }
    
    if (typeof value === 'string' && value.length > max) {
      return message || `Must be at most ${max} characters`;
    }
    
    return undefined;
  };
};

/**
 * Creates a pattern validation rule
 * @param pattern Regular expression pattern
 * @param message Custom error message
 * @returns Validation rule function
 */
export const pattern = (pattern: RegExp, message = 'Invalid format'): ValidationRule => {
  return (value: unknown) => {
    if (value === undefined || value === null || value === '') {
      return undefined; // Let required handle empty values
    }
    
    if (typeof value === 'string' && !pattern.test(value)) {
      return message;
    }
    
    return undefined;
  };
};

/**
 * Validates a value against multiple rules
 * @param value Value to validate
 * @param rules Array of validation rules
 * @returns First error message or undefined if valid
 */
export const validate = (value: unknown, rules: ValidationRule[]): string | undefined => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) {
      return error;
    }
  }
  
  return undefined;
};

/**
 * Validates an object against a validation schema
 * @param values Object with values to validate
 * @param schema Validation schema mapping fields to rules
 * @returns Object with error messages
 */
export const validateForm = (
  values: Record<string, unknown>,
  schema: Record<string, ValidationRule[]>
): Record<string, string | undefined> => {
  const errors: Record<string, string | undefined> = {};
  
  for (const field in schema) {
    if (Object.prototype.hasOwnProperty.call(schema, field)) {
      const rules = schema[field];
      const value = values[field];
      
      errors[field] = validate(value, rules);
    }
  }
  
  return errors;
};