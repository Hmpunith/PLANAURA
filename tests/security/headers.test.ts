import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../server/index.js';

describe('Security Headers & Defense-in-Depth Middleware Tests', () => {
  it('enforces manual Permissions-Policy header restricting device APIs', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['permissions-policy']).toBeDefined();
    expect(res.headers['permissions-policy']).toContain('camera=()');
    expect(res.headers['permissions-policy']).toContain('microphone=()');
    expect(res.headers['permissions-policy']).toContain('geolocation=()');
    expect(res.headers['permissions-policy']).toContain('interest-cohort=()');
  });

  it('enforces strict Content-Security-Policy header', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['content-security-policy']).toContain("default-src 'self'");
  });

  it('enforces X-Content-Type-Options: nosniff', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('enforces X-Frame-Options: DENY to prevent clickjacking', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-frame-options']).toBe('DENY');
  });

  it('enforces Referrer-Policy: strict-origin-when-cross-origin', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  });

  it('generates unique X-Request-Id distributed tracing header per request', async () => {
    const res1 = await request(app).get('/api/health');
    const res2 = await request(app).get('/api/health');
    expect(res1.headers['x-request-id']).toBeDefined();
    expect(res2.headers['x-request-id']).toBeDefined();
    expect(res1.headers['x-request-id']).not.toBe(res2.headers['x-request-id']);
  });

  it('sanitizes malicious XSS script injections from input payloads', async () => {
    const maliciousPayload = {
      eventType: 'wedding',
      eventName: 'Grand Wedding <script>alert("XSS")</script>',
      totalBudget: 15000,
      vibe: '<script src="evil.js"></script>Tuscan Romance',
    };

    const res = await request(app)
      .post('/api/plan/generate')
      .send(maliciousPayload);

    expect(res.status).toBe(200);
    expect(res.body.blueprint.eventName).not.toContain('<script>');
    expect(res.body.blueprint.eventName).toContain('Grand Wedding');
  });

  it('returns structured 404 when endpoint does not exist', async () => {
    const res = await request(app).get('/api/non-existent-endpoint');
    expect(res.status).toBe(404);
  });
});
