/**
 * @file PlanAura Configuration Environment
 * @description Loads and validates environment variables with sensible defaults.
 */

import dotenv from 'dotenv';
dotenv.config();

export interface PlanAuraConfig {
  port: number;
  nodeEnv: string;
  geminiApiKey?: string;
  allowedOrigins: string[];
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  cacheTtlMs: number;
}

export const config: PlanAuraConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173')
    .split(',')
    .map((o) => o.trim()),
  rateLimitWindowMs: 60 * 1000, // 1 minute
  rateLimitMaxRequests: 60, // 60 requests per minute
  cacheTtlMs: 15 * 60 * 1000, // 15 minutes TTL
};
