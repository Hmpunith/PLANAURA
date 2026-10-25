/**
 * @file PlanAura Primary REST API Router
 * @description Exposes clean, typed endpoints with strict Zod schema validation and error boundaries.
 * @module server/routes/api
 */

import { Router, Request, Response, NextFunction } from 'express';
import { BudgetEngine } from '../modules/budget/budgetEngine.js';
import { TimelineEngine } from '../modules/timeline/timelineEngine.js';
import { VendorEngine } from '../modules/vendors/vendorEngine.js';
import { IdeaSynthesizer } from '../modules/ideas/ideaSynthesizer.js';
import { geminiService } from '../services/geminiService.js';
import { planCache } from '../services/cacheService.js';
import { BudgetValidationFault } from '../errors/PlannerError.js';
import {
  PlanGenerateSchema,
  ChatRequestSchema,
  BudgetAnalyzeSchema,
  TimelineGenerateSchema,
  VendorStatusUpdateSchema,
  IdeaSynthesizeSchema,
} from '../modules/validation/schemas.js';
import { Logger } from '../utils/logger.js';

export const apiRouter = Router();

/**
 * Health check & telemetry endpoint
 */
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'PlanAura AI Celebration & Event Planner',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    aiEngine: geminiService.getStatus(),
    cacheMetrics: planCache.getStats(),
  });
});

/**
 * Generates an end-to-end event blueprint spanning budgets, timelines, vendors, and personalized ideas.
 */
apiRouter.post('/plan/generate', (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = PlanGenerateSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new BudgetValidationFault(
        'Invalid plan generation payload',
        parseResult.error.flatten()
      );
    }

    const { eventType, eventName, eventDate, totalBudget, currency, guestCount, vibe } =
      parseResult.data;
    const effectiveDate =
      eventDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString();

    // 1. Budget Intelligence Engine
    const budgetAnalysis = BudgetEngine.generateInitialBudget(totalBudget, eventType, currency);

    // 2. Multi-phase Timeline & Day-of Itinerary
    const timeline = TimelineEngine.generateTimeline(eventType, effectiveDate);

    // 3. Vendor Procurement Checklist
    const vendors = VendorEngine.getInitialChecklist(eventType);
    const vendorMetrics = VendorEngine.computeMetrics(vendors);

    // 4. Personalized Creative Ideas
    const ideas = IdeaSynthesizer.getConcepts(eventType);
    const bespokeConcept = IdeaSynthesizer.synthesizePersonalizedConcept(
      eventType,
      vibe,
      guestCount
    );

    Logger.info(
      `Generated blueprint for '${eventName}' (${eventType})`,
      (req as unknown as { id: string }).id
    );

    res.json({
      success: true,
      blueprint: {
        eventName,
        eventType,
        eventDate: effectiveDate,
        guestCount,
        currency,
        budget: budgetAnalysis,
        timeline,
        vendors: {
          items: vendors,
          metrics: vendorMetrics,
        },
        personalizedIdeas: {
          curatedVault: ideas,
          bespokeConcept,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Aura Copilot conversational planning assistant
 */
apiRouter.post('/chat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = ChatRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new BudgetValidationFault(
        'Invalid chat request parameters',
        parseResult.error.flatten()
      );
    }

    const { prompt, history, eventContext } = parseResult.data;
    const reply = await geminiService.chatPlan(prompt.trim(), history, eventContext);

    res.json({
      success: true,
      reply,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Analyze budget line items and return updated allocations and optimization advice
 */
apiRouter.post('/budget/analyze', (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = BudgetAnalyzeSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new BudgetValidationFault(
        'Invalid budget analysis payload',
        parseResult.error.flatten()
      );
    }

    const { totalBudget, items, currency } = parseResult.data;
    const analysis = BudgetEngine.analyzeBudget(totalBudget, items, currency);
    res.json({ success: true, analysis });
  } catch (err) {
    next(err);
  }
});

/**
 * Generate timeline milestones and day-of run-of-show
 */
apiRouter.post('/timeline/generate', (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = TimelineGenerateSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new BudgetValidationFault(
        'Invalid timeline generation payload',
        parseResult.error.flatten()
      );
    }

    const { eventType, eventDate } = parseResult.data;
    const targetDate = eventDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
    const timeline = TimelineEngine.generateTimeline(eventType, targetDate);
    res.json({ success: true, timeline });
  } catch (err) {
    next(err);
  }
});

/**
 * Retrieve initial vendor checklist for an event category
 */
apiRouter.get('/vendors/checklist', (req: Request, res: Response) => {
  const eventType = (req.query.eventType as 'wedding' | 'birthday' | 'community') || 'wedding';
  const vendors = VendorEngine.getInitialChecklist(eventType);
  const metrics = VendorEngine.computeMetrics(vendors);
  res.json({ success: true, vendors, metrics });
});

/**
 * Update an existing vendor's lifecycle status
 */
apiRouter.patch('/vendors/status', (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = VendorStatusUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new BudgetValidationFault('Invalid vendor status payload', parseResult.error.flatten());
    }

    const { vendors, vendorId, newStatus, updatedValues } = parseResult.data;
    const updated = VendorEngine.updateVendorStatus(vendors, vendorId, newStatus, updatedValues);
    const metrics = VendorEngine.computeMetrics(updated);
    res.json({ success: true, vendors: updated, metrics });
  } catch (err) {
    next(err);
  }
});

/**
 * Synthesize personalized creative ideas
 */
apiRouter.post('/ideas/synthesize', (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = IdeaSynthesizeSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new BudgetValidationFault(
        'Invalid idea synthesis payload',
        parseResult.error.flatten()
      );
    }

    const { eventType, vibe, guestCount } = parseResult.data;
    const bespokeConcept = IdeaSynthesizer.synthesizePersonalizedConcept(
      eventType,
      vibe,
      guestCount
    );
    const vault = IdeaSynthesizer.getConcepts(eventType);
    res.json({ success: true, bespokeConcept, vault });
  } catch (err) {
    next(err);
  }
});
