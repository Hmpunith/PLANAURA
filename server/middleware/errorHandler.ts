/**
 * @file PlanAura Centralized Error Handler Middleware
 * @description Standardizes JSON error payloads and maps custom domain error classes to HTTP status codes.
 * @module server/middleware/errorHandler
 */

import { Request, Response, NextFunction } from 'express';
import { PlanAuraFault } from '../errors/PlannerError.js';
import { Logger } from '../utils/logger.js';

/**
 * Global operational error boundary for Express server.
 * Registered as the final middleware in the request handling chain.
 * @param err - Caught error instance
 * @param req - Express request
 * @param res - Express response
 * @param _next - Express next function
 */
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  const requestId =
    (req.headers['x-request-id'] as string) || (req as unknown as { id: string }).id || 'unknown';

  if (err instanceof PlanAuraFault) {
    Logger.warn(`Operational fault: ${err.message}`, requestId, { code: err.code });
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        statusCode: err.statusCode,
        requestId,
        details: err.details,
      },
    });
    return;
  }

  // Handle generic uncaught exceptions
  Logger.error('Unhandled internal server error', err, requestId);

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
      statusCode: 500,
      requestId,
    },
  });
}
