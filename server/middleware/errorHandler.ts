/**
 * @file PlanAura Centralized Error Handler Middleware
 * @description Standardizes JSON error payloads and maps custom domain error classes to HTTP status codes.
 */

import { Request, Response, NextFunction } from 'express';
import { PlanAuraFault } from '../errors/PlannerError.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = (req.headers['x-request-id'] as string) || (req as unknown as { id: string }).id || 'unknown';

  if (err instanceof PlanAuraFault) {
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
  console.error(`[UnhandledError] [Req: ${requestId}]`, err);

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
      stack: err.stack,
      statusCode: 500,
      requestId,
    },
  });
}
