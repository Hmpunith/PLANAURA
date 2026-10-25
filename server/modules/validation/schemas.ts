/**
 * @file PlanAura Request Validation Schemas
 * @description Defines strict, type-safe Zod validation schemas for all inbound API payloads.
 * @module server/modules/validation/schemas
 */

import { z } from 'zod';

/**
 * Event category enum validation schema.
 */
export const EventCategorySchema = z.enum(['wedding', 'birthday', 'community']);

/**
 * Currency code validation schema.
 */
export const CurrencySchema = z.enum(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']);

/**
 * Plan Generation payload validation schema.
 */
export const PlanGenerateSchema = z.object({
  eventType: EventCategorySchema.default('wedding'),
  eventName: z
    .string()
    .min(1, 'Celebration title cannot be empty')
    .max(120)
    .default('The Grand Celebration'),
  eventDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}/))
    .optional(),
  totalBudget: z
    .number()
    .min(100, 'Budget must be at least 100')
    .max(10_000_000, 'Budget exceeds limit')
    .default(25000),
  currency: CurrencySchema.default('USD'),
  guestCount: z
    .number()
    .int()
    .min(1, 'At least 1 guest required')
    .max(10000, 'Guest count exceeds maximum limit')
    .default(100),
  vibe: z.string().max(200).default('Elegant and warm'),
});

/**
 * Inbound conversational chat request validation schema.
 */
export const ChatRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(2000, 'Prompt exceeds 2000 character limit'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        parts: z.string(),
      })
    )
    .optional()
    .default([]),
  eventContext: z
    .object({
      eventType: EventCategorySchema,
      budget: z.number().nonnegative(),
      guestCount: z.number().positive(),
    })
    .optional(),
});

/**
 * Budget item validation schema.
 */
export const BudgetItemSchema = z.object({
  id: z.string().min(1),
  category: z.string().min(1),
  name: z.string().min(1),
  allocatedAmount: z.number().nonnegative(),
  actualAmount: z.number().nonnegative().default(0),
  status: z.enum(['pending', 'quoted', 'committed', 'paid']).default('pending'),
  notes: z.string().optional(),
});

/**
 * Budget analysis payload validation schema.
 */
export const BudgetAnalyzeSchema = z.object({
  totalBudget: z.number().min(100).max(10_000_000),
  items: z.array(BudgetItemSchema).default([]),
  currency: CurrencySchema.default('USD'),
});

/**
 * Timeline generation payload validation schema.
 */
export const TimelineGenerateSchema = z.object({
  eventType: EventCategorySchema.default('wedding'),
  eventDate: z.string().optional(),
});

/**
 * Vendor status update payload validation schema.
 */
export const VendorStatusUpdateSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  newStatus: z.enum(['contacted', 'quoted', 'contract_pending', 'booked', 'paid']),
  vendors: z.array(z.any()).default([]),
  updatedValues: z
    .object({
      depositPaid: z.boolean().optional(),
      contractSigned: z.boolean().optional(),
      quoteAmount: z.number().nonnegative().optional(),
      depositAmount: z.number().nonnegative().optional(),
    })
    .optional(),
});

/**
 * Ideas synthesis payload validation schema.
 */
export const IdeaSynthesizeSchema = z.object({
  eventType: EventCategorySchema.default('wedding'),
  vibe: z.string().max(200).default('Bespoke celebratory'),
  guestCount: z.number().int().min(1).default(50),
});
