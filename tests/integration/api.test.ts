import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../server/index.js';

describe('PlanAura REST API Integration Tests', () => {
  it('GET /api/health returns healthy operational status and cache metrics', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toContain('PlanAura');
    expect(res.body.version).toBe('1.0.0');
    expect(res.body.aiEngine).toBeDefined();
    expect(res.body.cacheMetrics).toBeDefined();
  });

  it('POST /api/plan/generate generates full end-to-end wedding blueprint', async () => {
    const res = await request(app).post('/api/plan/generate').send({
      eventType: 'wedding',
      eventName: 'Savannah & Liam Wedding',
      totalBudget: 35000,
      currency: 'USD',
      guestCount: 120,
      vibe: 'Romantic Southern Garden',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const bp = res.body.blueprint;
    expect(bp.eventType).toBe('wedding');
    expect(bp.guestCount).toBe(120);
    expect(bp.budget.totalBudget).toBe(35000);
    expect(bp.timeline.milestones.length).toBeGreaterThan(0);
    expect(bp.vendors.items.length).toBeGreaterThan(0);
    expect(bp.personalizedIdeas.curatedVault.length).toBeGreaterThan(0);
  });

  it('POST /api/plan/generate generates birthday blueprints with custom currency', async () => {
    const res = await request(app).post('/api/plan/generate').send({
      eventType: 'birthday',
      eventName: 'Marcus 30th Birthday',
      totalBudget: 7500,
      currency: 'EUR',
      guestCount: 45,
      vibe: 'Retro Neon Lounge',
    });

    expect(res.status).toBe(200);
    expect(res.body.blueprint.eventType).toBe('birthday');
    expect(res.body.blueprint.currency).toBe('EUR');
    expect(res.body.blueprint.budget.totalBudget).toBe(7500);
  });

  it('POST /api/plan/generate generates community event blueprints with civic permits', async () => {
    const res = await request(app).post('/api/plan/generate').send({
      eventType: 'community',
      eventName: 'Oakridge Summer Block Festival',
      totalBudget: 18000,
      currency: 'GBP',
      guestCount: 350,
    });

    expect(res.status).toBe(200);
    expect(res.body.blueprint.eventType).toBe('community');
    expect(
      res.body.blueprint.timeline.milestones.some((m: { title: string }) =>
        m.title.includes('Permits')
      )
    ).toBe(true);
  });

  it('POST /api/chat responds with structured conversational planning advice', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({
        prompt: 'How should I allocate budget for my 40-person birthday party?',
        history: [],
        eventContext: { eventType: 'birthday', budget: 5000, guestCount: 40 },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.reply).toBeDefined();
    expect(typeof res.body.reply).toBe('string');
  });

  it('POST /api/chat rejects empty or whitespace prompts with 400 error', async () => {
    const res = await request(app).post('/api/chat').send({ prompt: '   ' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('BUDGET_VALIDATION_FAULT');
  });

  it('POST /api/budget/analyze calculates live allocations and variance', async () => {
    const res = await request(app)
      .post('/api/budget/analyze')
      .send({
        totalBudget: 15000,
        items: [
          {
            id: '1',
            category: 'Venue',
            name: 'Barn',
            allocatedAmount: 6000,
            actualAmount: 5500,
            status: 'committed',
          },
        ],
        currency: 'USD',
      });

    expect(res.status).toBe(200);
    expect(res.body.analysis.remainingBudget).toBe(9500);
    expect(res.body.analysis.isOverBudget).toBe(false);
  });

  it('POST /api/timeline/generate returns milestones and run-of-show', async () => {
    const res = await request(app).post('/api/timeline/generate').send({ eventType: 'wedding' });

    expect(res.status).toBe(200);
    expect(res.body.timeline.milestones.length).toBeGreaterThan(0);
    expect(res.body.timeline.dayOfRunOfShow.length).toBeGreaterThan(0);
  });

  it('GET /api/vendors/checklist retrieves category-filtered vendors', async () => {
    const res = await request(app).get('/api/vendors/checklist?eventType=birthday');
    expect(res.status).toBe(200);
    expect(res.body.vendors.length).toBeGreaterThan(0);
    expect(res.body.metrics.totalVendors).toBe(res.body.vendors.length);
  });

  it('PATCH /api/vendors/status updates vendor status and metrics', async () => {
    const getRes = await request(app).get('/api/vendors/checklist?eventType=wedding');
    const firstVendor = getRes.body.vendors[0];

    const patchRes = await request(app).patch('/api/vendors/status').send({
      vendors: getRes.body.vendors,
      vendorId: firstVendor.id,
      newStatus: 'paid',
    });

    expect(patchRes.status).toBe(200);
    const updated = patchRes.body.vendors.find((v: { id: string }) => v.id === firstVendor.id);
    expect(updated.status).toBe('paid');
    expect(updated.balanceRemaining).toBe(0);
  });

  it('POST /api/ideas/synthesize generates personalized concept', async () => {
    const res = await request(app).post('/api/ideas/synthesize').send({
      eventType: 'birthday',
      vibe: 'Retro 80s Neon Arcade',
      guestCount: 60,
    });

    expect(res.status).toBe(200);
    expect(res.body.bespokeConcept.themeTitle).toContain('Retro 80s Neon Arcade');
    expect(res.body.bespokeConcept.colorPalette.length).toBe(4);
  });
});
