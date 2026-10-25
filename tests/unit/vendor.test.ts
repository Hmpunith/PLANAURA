import { describe, it, expect } from 'vitest';
import { VendorEngine } from '../../server/modules/vendors/vendorEngine.js';
import { VendorValidationFault } from '../../server/errors/PlannerError.js';

describe('VendorEngine Unit Tests', () => {
  it('retrieves initial checklist tailored for weddings', () => {
    const list = VendorEngine.getInitialChecklist('wedding');
    expect(list.length).toBeGreaterThanOrEqual(4);
    expect(list.some((v) => v.category.includes('Venue'))).toBe(true);
    expect(list.some((v) => v.category.includes('Photography'))).toBe(true);
  });

  it('retrieves initial checklist tailored for birthdays', () => {
    const list = VendorEngine.getInitialChecklist('birthday');
    expect(list.length).toBeGreaterThanOrEqual(3);
    expect(list.some((v) => v.category.includes('Cake'))).toBe(true);
  });

  it('retrieves initial checklist tailored for community festivals', () => {
    const list = VendorEngine.getInitialChecklist('community');
    expect(list.length).toBeGreaterThanOrEqual(3);
    expect(list.some((v) => v.category.includes('Municipal'))).toBe(true);
    expect(list.some((v) => v.category.includes('Sanitation'))).toBe(true);
  });

  it('updates vendor status to booked and recomputes balance', () => {
    const list = VendorEngine.getInitialChecklist('wedding');
    const firstId = list[0].id;
    const updated = VendorEngine.updateVendorStatus(list, firstId, 'booked');
    const modified = updated.find((v) => v.id === firstId);
    expect(modified?.status).toBe('booked');
  });

  it('zeros out remaining liability when vendor status transitions to paid', () => {
    const list = VendorEngine.getInitialChecklist('wedding');
    const firstId = list[0].id;
    const updated = VendorEngine.updateVendorStatus(list, firstId, 'paid');
    const modified = updated.find((v) => v.id === firstId);
    expect(modified?.status).toBe('paid');
    expect(modified?.depositPaid).toBe(true);
    expect(modified?.balanceRemaining).toBe(0);
  });

  it('computes correct pipeline metrics and readiness percentage', () => {
    const list = VendorEngine.getInitialChecklist('wedding');
    const metrics = VendorEngine.computeMetrics(list);
    expect(metrics.totalVendors).toBe(list.length);
    expect(metrics.percentReady).toBeGreaterThanOrEqual(0);
    expect(metrics.percentReady).toBeLessThanOrEqual(100);
    expect(metrics.totalCommittedAmount).toBeGreaterThan(0);
  });

  it('handles empty vendor array gracefully in metrics computation', () => {
    const metrics = VendorEngine.computeMetrics([]);
    expect(metrics.totalVendors).toBe(0);
    expect(metrics.percentReady).toBe(0);
    expect(metrics.remainingLiability).toBe(0);
  });

  it('throws VendorValidationFault on invalid vendor status', () => {
    const list = VendorEngine.getInitialChecklist('wedding');
    // @ts-expect-error testing invalid status runtime input
    expect(() => VendorEngine.updateVendorStatus(list, list[0].id, 'invalid_status')).toThrow(
      VendorValidationFault
    );
  });

  it('throws VendorValidationFault when vendor ID does not exist', () => {
    const list = VendorEngine.getInitialChecklist('wedding');
    expect(() => VendorEngine.updateVendorStatus(list, 'non-existent-id', 'booked')).toThrow(
      VendorValidationFault
    );
  });
});
