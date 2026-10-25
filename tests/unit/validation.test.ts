/**
 * @file PlanAura Data Validation Test Suite
 * @description Verifies Zod schema validation rules, default injections, and boundary constraint checks.
 */

import { describe, it, expect } from 'vitest';
import {
  PlanGenerateSchema,
  ChatRequestSchema,
  BudgetAnalyzeSchema,
  TimelineGenerateSchema,
  VendorStatusUpdateSchema,
} from '../../server/modules/validation/schemas.js';

describe('Data Validation Logic: Zod Schemas', () => {
  describe('PlanGenerateSchema', () => {
    it('accepts valid plan generation inputs and applies defaults', () => {
      const valid = {
        eventType: 'wedding',
        eventName: 'Royal Gala',
        totalBudget: 40000,
        currency: 'USD',
        guestCount: 150,
      };
      const result = PlanGenerateSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.eventName).toBe('Royal Gala');
        expect(result.data.guestCount).toBe(150);
        expect(result.data.vibe).toBe('Elegant and warm'); // default
      }
    });

    it('rejects invalid event category types', () => {
      const invalid = { eventType: 'alien_convention' };
      const result = PlanGenerateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects negative budgets below minimum limit', () => {
      const invalid = { totalBudget: 50 }; // min is 100
      const result = PlanGenerateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects non-integer or zero guest counts', () => {
      const invalid = { guestCount: 0 };
      const result = PlanGenerateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('ChatRequestSchema', () => {
    it('accepts valid non-empty prompt and parses history', () => {
      const valid = {
        prompt: 'What are essential bridal floral arrangements?',
        history: [{ role: 'user', parts: 'Hello' }],
        eventContext: {
          eventType: 'wedding',
          budget: 20000,
          guestCount: 80,
        },
      };
      const result = ChatRequestSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects empty or whitespace-only prompts', () => {
      const invalid = { prompt: '' };
      const result = ChatRequestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects prompts exceeding maximum length', () => {
      const invalid = { prompt: 'a'.repeat(2500) };
      const result = ChatRequestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('BudgetAnalyzeSchema', () => {
    it('validates budget line items and currency correctly', () => {
      const valid = {
        totalBudget: 15000,
        currency: 'EUR',
        items: [
          {
            id: 'item-1',
            category: 'Venue',
            name: 'Main Hall',
            allocatedAmount: 6000,
            actualAmount: 5500,
            status: 'committed',
          },
        ],
      };
      const result = BudgetAnalyzeSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects negative allocated amounts', () => {
      const invalid = {
        totalBudget: 10000,
        items: [
          {
            id: 'item-1',
            category: 'Venue',
            name: 'Hall',
            allocatedAmount: -500,
          },
        ],
      };
      const result = BudgetAnalyzeSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('TimelineGenerateSchema', () => {
    it('accepts valid category and optional date', () => {
      const valid = { eventType: 'community', eventDate: '2026-11-20' };
      const result = TimelineGenerateSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });

  describe('VendorStatusUpdateSchema', () => {
    it('validates vendor transition and rejects missing vendor ID', () => {
      const invalid = { newStatus: 'booked' };
      const result = VendorStatusUpdateSchema.safeParse(invalid);
      expect(result.success).toBe(false);

      const valid = { vendorId: 'vdr-1', newStatus: 'booked', vendors: [] };
      const validResult = VendorStatusUpdateSchema.safeParse(valid);
      expect(validResult.success).toBe(true);
    });
  });
});
