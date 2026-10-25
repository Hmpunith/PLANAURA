/**
 * @file PlanAura Rate Limiter Middleware
 * @description Prevents API denial of service and enforces fair usage quotas per client IP.
 */

import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP. Please try again after 1 minute.',
      statusCode: 429,
    },
  },
});
