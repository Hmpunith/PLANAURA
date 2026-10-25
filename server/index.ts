/**
 * @file PlanAura Express Server Entry Point
 * @description Configures middleware pipeline, security headers, compression, API routing, and error boundaries.
 */

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import {
  customSecurityHeaders,
  helmetMiddleware,
  sanitizeInput,
} from './middleware/security.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiRouter } from './routes/api.js';
import { ResourceNotFoundFault } from './errors/PlannerError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// 1. Response Compression (Efficiency Requirement)
app.use(compression());

// 2. Body Parser with 250KB Security Cap (Security Requirement)
app.use(express.json({ limit: '250kb' }));
app.use(express.urlencoded({ extended: true, limit: '250kb' }));

// 3. CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// 4. Security Headers (Defense-in-Depth + Permissions-Policy)
app.use(helmetMiddleware);
app.use(customSecurityHeaders);

// 5. Input Sanitization
app.use(sanitizeInput);

// 6. Rate Limiting on API endpoints
app.use('/api', apiRateLimiter);

// 7. API Routes
app.use('/api', apiRouter);

// Catch unmatched /api routes and throw structured 404
app.use('/api', (req, _res, next) => {
  next(new ResourceNotFoundFault(`Endpoint ${req.method} ${req.originalUrl}`));
});

// 8. Serve Client in Production
const clientDistPath = path.resolve(__dirname, '../dist');
app.use(express.static(clientDistPath, { maxAge: '1d' }));

// 9. SPA Fallback
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      // In development, dist might not exist yet
      res.status(200).send('PlanAura API Server is active. Access client via Vite development port.');
    }
  });
});

// 10. Centralized Error Boundary (Registered Last)
app.use(errorHandler);

// Start server ONLY if executed directly as main script
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun && process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  app.listen(config.port, () => {
    console.info(`[PlanAura] Engine operational on port ${config.port} (${config.nodeEnv})`);
  });
}
