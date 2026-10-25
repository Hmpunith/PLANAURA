/**
 * @file PlanAura Primary REST API Router
 * @description Exposes clean, typed endpoints for plan generation, budgeting, timelines, vendors, and AI copilot.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { BudgetEngine, EventCategory } from '../modules/budget/budgetEngine.js';
import { TimelineEngine } from '../modules/timeline/timelineEngine.js';
import { VendorEngine, VendorStatus } from '../modules/vendors/vendorEngine.js';
import { IdeaSynthesizer } from '../modules/ideas/ideaSynthesizer.js';
import { geminiService } from '../services/geminiService.js';
import { planCache } from '../services/cacheService.js';
import { BudgetValidationFault } from '../errors/PlannerError.js';

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
    const {
      eventType = 'wedding',
      eventName = 'Celebration of Joy',
      eventDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      totalBudget = 25000,
      currency = 'USD',
      guestCount = 100,
      vibe = 'Elegant and warm',
    } = req.body;

    const validTypes: EventCategory[] = ['wedding', 'birthday', 'community'];
    const sanitizedType: EventCategory = validTypes.includes(eventType) ? eventType : 'wedding';

    // 1. Budget Intelligence
    const budgetAnalysis = BudgetEngine.generateInitialBudget(
      Number(totalBudget) || 10000,
      sanitizedType,
      currency
    );

    // 2. Multi-phase Timeline & Day-of Itinerary
    const timeline = TimelineEngine.generateTimeline(sanitizedType, eventDate);

    // 3. Vendor Procurement Checklist
    const vendors = VendorEngine.getInitialChecklist(sanitizedType);
    const vendorMetrics = VendorEngine.computeMetrics(vendors);

    // 4. Personalized Creative Ideas
    const ideas = IdeaSynthesizer.getConcepts(sanitizedType);
    const bespokeConcept = IdeaSynthesizer.synthesizePersonalizedConcept(
      sanitizedType,
      vibe,
      Number(guestCount) || 50
    );

    res.json({
      success: true,
      blueprint: {
        eventName,
        eventType: sanitizedType,
        eventDate,
        guestCount: Number(guestCount) || 50,
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
    const { prompt, history = [], eventContext } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      throw new BudgetValidationFault('A valid, non-empty text prompt is required.');
    }

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
    const { totalBudget, items, currency = 'USD' } = req.body;
    const analysis = BudgetEngine.analyzeBudget(Number(totalBudget) || 10000, items || [], currency);
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
    const { eventType = 'wedding', eventDate } = req.body;
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
  const eventType = (req.query.eventType as EventCategory) || 'wedding';
  const vendors = VendorEngine.getInitialChecklist(eventType);
  const metrics = VendorEngine.computeMetrics(vendors);
  res.json({ success: true, vendors, metrics });
});

/**
 * Update an existing vendor's lifecycle status
 */
apiRouter.patch('/vendors/status', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendors, vendorId, newStatus, updatedValues } = req.body;
    const updated = VendorEngine.updateVendorStatus(
      vendors || [],
      vendorId,
      newStatus as VendorStatus,
      updatedValues
    );
    const metrics = VendorEngine.computeMetrics(updated);
    res.json({ success: true, vendors: updated, metrics });
  } catch (err) {
    next(err);
  }
});

/**
 * Synthesize personalized creative ideas
 */
apiRouter.post('/ideas/synthesize', (req: Request, res: Response) => {
  const { eventType = 'wedding', vibe = 'Bespoke celebratory', guestCount = 50 } = req.body;
  const bespokeConcept = IdeaSynthesizer.synthesizePersonalizedConcept(
    eventType,
    vibe,
    Number(guestCount) || 50
  );
  const vault = IdeaSynthesizer.getConcepts(eventType);
  res.json({ success: true, bespokeConcept, vault });
});
