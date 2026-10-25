import { describe, it, expect } from 'vitest';
import { BudgetEngine } from '../../server/modules/budget/budgetEngine.js';
import { BudgetValidationFault } from '../../server/errors/PlannerError.js';

describe('BudgetEngine Unit Tests', () => {
  it('generates a valid wedding budget with standard benchmarks', () => {
    const analysis = BudgetEngine.generateInitialBudget(20000, 'wedding', 'USD');
    expect(analysis.totalBudget).toBe(20000);
    expect(analysis.currency).toBe('USD');
    expect(analysis.items.length).toBeGreaterThanOrEqual(5);
    expect(analysis.isOverBudget).toBe(false);
    expect(analysis.allocationsByCategory['Venue & Catering']).toBeDefined();
    expect(analysis.allocationsByCategory['Venue & Catering'].percentOfTotal).toBe(45);
  });

  it('generates a valid birthday budget benchmark', () => {
    const analysis = BudgetEngine.generateInitialBudget(5000, 'birthday', 'EUR');
    expect(analysis.totalBudget).toBe(5000);
    expect(analysis.currency).toBe('EUR');
    expect(analysis.allocationsByCategory['Venue Rental']).toBeDefined();
    expect(analysis.allocationsByCategory['Food, Beverage & Cake']).toBeDefined();
  });

  it('generates a valid community event budget benchmark', () => {
    const analysis = BudgetEngine.generateInitialBudget(15000, 'community', 'GBP');
    expect(analysis.totalBudget).toBe(15000);
    expect(analysis.currency).toBe('GBP');
    expect(analysis.allocationsByCategory['Permits & Venue Licensing']).toBeDefined();
    expect(analysis.allocationsByCategory['Safety, Sanitation & EMS']).toBeDefined();
  });

  it('flags over-budget state when actual expenditures exceed limit', () => {
    const items = [
      { id: '1', category: 'Venue', name: 'Hall', allocatedAmount: 5000, actualAmount: 7000, status: 'paid' as const },
      { id: '2', category: 'Catering', name: 'Food', allocatedAmount: 5000, actualAmount: 4000, status: 'committed' as const },
    ];
    const analysis = BudgetEngine.analyzeBudget(10000, items, 'USD');
    expect(analysis.totalActual).toBe(11000);
    expect(analysis.remainingBudget).toBe(-1000);
    expect(analysis.isOverBudget).toBe(true);
    expect(analysis.alerts.length).toBeGreaterThan(0);
    expect(analysis.alerts[0]).toContain('over budget');
  });

  it('provides proactive warnings when remaining cushion is under 10%', () => {
    const items = [
      { id: '1', category: 'Venue', name: 'Hall', allocatedAmount: 9500, actualAmount: 9500, status: 'paid' as const },
    ];
    const analysis = BudgetEngine.analyzeBudget(10000, items, 'USD');
    expect(analysis.remainingBudget).toBe(500);
    expect(analysis.isOverBudget).toBe(false);
    expect(analysis.alerts.length).toBeGreaterThan(0);
    expect(analysis.alerts[0]).toContain('Remaining cushion is under 10%');
  });

  it('generates relevant cost-saving recommendations', () => {
    const analysis = BudgetEngine.generateInitialBudget(30000, 'wedding', 'USD');
    expect(analysis.costOptimizationTips.length).toBeGreaterThan(0);
  });

  it('throws BudgetValidationFault on negative or zero budget', () => {
    expect(() => BudgetEngine.generateInitialBudget(-500, 'wedding')).toThrow(BudgetValidationFault);
    expect(() => BudgetEngine.generateInitialBudget(0, 'birthday')).toThrow(BudgetValidationFault);
  });

  it('throws BudgetValidationFault on invalid non-array items input', () => {
    // @ts-expect-error testing invalid runtime input
    expect(() => BudgetEngine.analyzeBudget(10000, null)).toThrow(BudgetValidationFault);
  });

  it('throws BudgetValidationFault if item amounts are negative', () => {
    const badItems = [
      { id: '1', category: 'Venue', name: 'Hall', allocatedAmount: -100, actualAmount: 0, status: 'pending' as const },
    ];
    expect(() => BudgetEngine.analyzeBudget(10000, badItems)).toThrow(BudgetValidationFault);
  });

  it('calculates correct variance percentage', () => {
    const items = [
      { id: '1', category: 'Music', name: 'DJ', allocatedAmount: 1000, actualAmount: 1200, status: 'committed' as const },
    ];
    const analysis = BudgetEngine.analyzeBudget(2000, items);
    expect(analysis.variancePercentage).toBe(20);
  });
});
