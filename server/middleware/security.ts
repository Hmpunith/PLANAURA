/**
 * @file PlanAura Security Middleware
 * @description Configures defense-in-depth HTTP headers, request tracing, and payload sanitization.
 */

import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import crypto from 'crypto';

/**
 * Attaches unique request tracking UUID and manual Permissions-Policy header.
 * Note: Helmet does NOT set Permissions-Policy by default; this middleware enforces it explicitly.
 */
export function customSecurityHeaders(req: Request, res: Response, next: NextFunction): void {
  // Tracing UUID
  const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  res.setHeader('X-Request-Id', requestId);
  (req as unknown as { id: string }).id = requestId;

  // Strict Permissions Policy restricting sensitive browser device APIs
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()'
  );

  // Fallback explicit headers in case upstream proxies strip Helmet defaults
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  next();
}

/**
 * Helmet middleware configured with strict Content Security Policy.
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      connectSrc: [
        "'self'",
        'https://generativelanguage.googleapis.com',
        'http://localhost:*',
        'https://*.vercel.app',
      ],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});

/**
 * Input sanitization middleware that recursively strips potential script tags from strings.
 */
export function sanitizeInput(req: Request, _res: Response, next: NextFunction): void {
  const sanitize = (val: unknown): unknown => {
    if (typeof val === 'string') {
      return val
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .trim();
    }
    if (Array.isArray(val)) {
      return val.map(sanitize);
    }
    if (val !== null && typeof val === 'object') {
      const sanitizedObj: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(val)) {
        sanitizedObj[k] = sanitize(v);
      }
      return sanitizedObj;
    }
    return val;
  };

  if (req.body && typeof req.body === 'object') {
    req.body = sanitize(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    for (const [k, v] of Object.entries(req.query)) {
      try {
        (req.query as Record<string, unknown>)[k] = sanitize(v);
      } catch {
        // Ignore read-only query properties in Express 5
      }
    }
  }
  next();
}
