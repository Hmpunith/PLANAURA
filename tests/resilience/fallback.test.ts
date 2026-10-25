import { describe, it, expect, beforeEach } from 'vitest';
import { GeminiService } from '../../server/services/geminiService.js';
import { CacheService } from '../../server/services/cacheService.js';
import {
  PlanAuraFault,
  BudgetValidationFault,
  TimelineConflictFault,
  VendorValidationFault,
  AIServiceFault,
  RateLimitExceededFault,
  ResourceNotFoundFault,
} from '../../server/errors/PlannerError.js';

describe('Resilience, Caching & Domain Error Hierarchy Tests', () => {
  let cache: CacheService;

  beforeEach(() => {
    cache = new CacheService(1000); // 1 second TTL for test
  });

  it('CacheService generates deterministic SHA-256 keys', () => {
    const key1 = cache.generateKey('test', { foo: 'bar', num: 42 });
    const key2 = cache.generateKey('test', { foo: 'bar', num: 42 });
    const key3 = cache.generateKey('test', { foo: 'different' });

    expect(key1).toBe(key2);
    expect(key1).not.toBe(key3);
    expect(key1).toMatch(/^test:[a-f0-9]{64}$/);
  });

  it('CacheService sets, gets, and records hit/miss statistics', () => {
    cache.set('key-1', { data: 'test-value' });

    const val = cache.get<{ data: string }>('key-1');
    expect(val?.data).toBe('test-value');

    const miss = cache.get('non-existent');
    expect(miss).toBeNull();

    const stats = cache.getStats();
    expect(stats.hits).toBe(1);
    expect(stats.misses).toBe(1);
    expect(stats.hitRatio).toBe('50.0%');
  });

  it('CacheService prunes expired entries after TTL expires', async () => {
    cache.set('short-lived', 'hello', 10); // 10ms TTL
    await new Promise((resolve) => setTimeout(resolve, 25));

    const pruned = cache.prune();
    expect(pruned).toBe(1);
    expect(cache.get('short-lived')).toBeNull();
  });

  it('GeminiService operates seamlessly in offline heuristic mode', async () => {
    const service = new GeminiService('');
    const status = service.getStatus();
    expect(status.model).toBe('gemini-2.5-flash');
    expect(status.mode).toContain('Offline');

    const response = await service.chatPlan('How do I manage vendor contracts?', [], {
      eventType: 'wedding',
      budget: 20000,
      guestCount: 80,
    });

    expect(response).toBeDefined();
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(50);
  });

  it('Domain Error classes retain correct status codes and operational flags', () => {
    const base = new PlanAuraFault('General error');
    expect(base.statusCode).toBe(500);
    expect(base.isOperational).toBe(true);

    const budgetErr = new BudgetValidationFault('Negative number');
    expect(budgetErr.statusCode).toBe(400);
    expect(budgetErr.code).toBe('BUDGET_VALIDATION_FAULT');

    const timelineErr = new TimelineConflictFault('Date error');
    expect(timelineErr.statusCode).toBe(400);
    expect(timelineErr.code).toBe('TIMELINE_CONFLICT_FAULT');

    const vendorErr = new VendorValidationFault('Missing name');
    expect(vendorErr.statusCode).toBe(400);
    expect(vendorErr.code).toBe('VENDOR_VALIDATION_FAULT');

    const aiErr = new AIServiceFault('Quota exceeded');
    expect(aiErr.statusCode).toBe(502);
    expect(aiErr.code).toBe('AI_SERVICE_FAULT');

    const rateErr = new RateLimitExceededFault();
    expect(rateErr.statusCode).toBe(429);
    expect(rateErr.code).toBe('RATE_LIMIT_EXCEEDED');

    const notFoundErr = new ResourceNotFoundFault('Event', 'evt-123');
    expect(notFoundErr.statusCode).toBe(404);
    expect(notFoundErr.code).toBe('RESOURCE_NOT_FOUND');
    expect(notFoundErr.message).toContain('evt-123');
  });
});
