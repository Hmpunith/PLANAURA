/**
 * @file PlanAura Client Application Error Hierarchy
 * @description Typed error subclasses for client-side API, network, and validation errors.
 * @module src/errors/AppError
 */

/**
 * Base error class for all PlanAura client operations.
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly isOperational: boolean;

  /**
   * Constructs an AppError instance.
   * @param message - User-friendly error message
   * @param code - Machine-readable error code string
   * @param statusCode - Optional HTTP status code
   */
  constructor(message: string, code: string = 'CLIENT_ERROR', statusCode?: number) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

/** Error thrown when an API request fails with a 4xx or 5xx status code. */
export class ApiNetworkError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, 'API_NETWORK_ERROR', statusCode);
  }
}

/** Error thrown when client-side data validation fails before sending. */
export class ClientValidationError extends AppError {
  constructor(message: string) {
    super(message, 'CLIENT_VALIDATION_ERROR', 400);
  }
}
