/**
 * @file PlanAura Budget Intelligence Engine
 * @description Manages budget allocations, variances, currency normalization, and automated cost optimization.
 */

import { BudgetValidationFault } from '../../errors/PlannerError.js';

export type EventCategory = 'wedding' | 'birthday' | 'community';

export interface BudgetItem {
  id: string;
  category: string;
  name: string;
  allocatedAmount: number;
  actualAmount: number;
  status: 'pending' | 'quoted' | 'committed' | 'paid';
  notes?: string;
}

export interface BudgetAnalysis {
  currency: string;
  totalBudget: number;
  totalAllocated: number;
  totalActual: number;
  remainingBudget: number;
  isOverBudget: boolean;
  variancePercentage: number;
  allocationsByCategory: Record<string, { allocated: number; actual: number; percentOfTotal: number }>;
  alerts: string[];
  costOptimizationTips: string[];
  items: BudgetItem[];
}

// Recommended percentage baselines derived from industry planning benchmarks
const BENCHMARK_PERCENTAGES: Record<EventCategory, Record<string, number>> = {
  wedding: {
    'Venue & Catering': 45,
    'Photography & Video': 12,
    'Attire & Beauty': 8,
    'Music & Entertainment': 10,
    'Floral & Decor': 10,
    'Stationery & Favors': 3,
    'Planner & Coordination': 7,
    'Contingency Buffer': 5,
  },
  birthday: {
    'Venue Rental': 30,
    'Food, Beverage & Cake': 35,
    'Entertainment & DJ': 15,
    'Decor & Theming': 10,
    'Party Favors & Games': 5,
    'Contingency Buffer': 5,
  },
  community: {
    'Permits & Venue Licensing': 15,
    'Audio/Visual & Stage': 25,
    'Safety, Sanitation & EMS': 20,
    'Marketing & Signage': 15,
    'Refreshments & Volunteer Hospitality': 15,
    'Contingency Reserve': 10,
  },
};

export class BudgetEngine {
  /**
   * Initializes baseline budget allocations customized by event type and total amount.
   */
  public static generateInitialBudget(
    totalBudget: number,
    eventType: EventCategory,
    currency: string = 'USD'
  ): BudgetAnalysis {
    if (typeof totalBudget !== 'number' || isNaN(totalBudget) || totalBudget <= 0) {
      throw new BudgetValidationFault('Total budget must be a positive numeric value.', {
        totalBudget,
      });
    }

    const benchmarks = BENCHMARK_PERCENTAGES[eventType] || BENCHMARK_PERCENTAGES.community;
    const items: BudgetItem[] = [];
    let _allocatedSum = 0;

    Object.entries(benchmarks).forEach(([catName, percent], idx) => {
      const itemAlloc = Math.round((totalBudget * percent) / 100);
      _allocatedSum += itemAlloc;
      items.push({
        id: `bud-${idx + 1}`,
        category: catName,
        name: `${catName} Allocation`,
        allocatedAmount: itemAlloc,
        actualAmount: 0,
        status: 'pending',
        notes: `Recommended benchmark: ${percent}% of total budget`,
      });
    });

    return this.analyzeBudget(totalBudget, items, currency);
  }

  /**
   * Evaluates line items against total budget, generating variance analytics and optimization tips.
   */
  public static analyzeBudget(
    totalBudget: number,
    items: BudgetItem[],
    currency: string = 'USD'
  ): BudgetAnalysis {
    if (typeof totalBudget !== 'number' || isNaN(totalBudget) || totalBudget <= 0) {
      throw new BudgetValidationFault('Total budget must be a positive number.', { totalBudget });
    }

    if (!Array.isArray(items)) {
      throw new BudgetValidationFault('Budget items must be an array.', { items });
    }

    let totalAllocated = 0;
    let totalActual = 0;
    const allocationsByCategory: Record<
      string,
      { allocated: number; actual: number; percentOfTotal: number }
    > = {};

    for (const item of items) {
      if (item.allocatedAmount < 0 || item.actualAmount < 0) {
        throw new BudgetValidationFault('Item amounts cannot be negative.', item);
      }
      totalAllocated += item.allocatedAmount;
      totalActual += item.actualAmount;

      if (!allocationsByCategory[item.category]) {
        allocationsByCategory[item.category] = {
          allocated: 0,
          actual: 0,
          percentOfTotal: 0,
        };
      }
      allocationsByCategory[item.category].allocated += item.allocatedAmount;
      allocationsByCategory[item.category].actual += item.actualAmount;
    }

    // Compute category percentages
    for (const cat of Object.keys(allocationsByCategory)) {
      allocationsByCategory[cat].percentOfTotal =
        totalBudget > 0
          ? Math.round((allocationsByCategory[cat].allocated / totalBudget) * 100)
          : 0;
    }

    const remainingBudget = totalBudget - (totalActual > 0 ? totalActual : totalAllocated);
    const isOverBudget = remainingBudget < 0;
    const variancePercentage =
      totalAllocated > 0 ? Math.round(((totalActual - totalAllocated) / totalAllocated) * 100) : 0;

    const alerts: string[] = [];
    if (isOverBudget) {
      alerts.push(
        `Critical: Currently over budget by ${currency} ${Math.abs(remainingBudget).toLocaleString()}!`
      );
    } else if (remainingBudget < totalBudget * 0.1) {
      alerts.push(
        `Warning: Remaining cushion is under 10% (${currency} ${remainingBudget.toLocaleString()}).`
      );
    }

    // Cost optimization intelligence
    const costOptimizationTips: string[] = [];
    if (allocationsByCategory['Venue & Catering'] && allocationsByCategory['Venue & Catering'].percentOfTotal > 50) {
      costOptimizationTips.push(
        'Venue & Catering exceeds 50% of your budget. Consider buffet-style or brunch service to trim per-guest costs by 18-25%.'
      );
    }
    if (allocationsByCategory['Contingency Buffer'] && allocationsByCategory['Contingency Buffer'].allocated === 0) {
      costOptimizationTips.push(
        'Recommended: Reserve at least 5-10% of total budget as an unallocated contingency buffer for emergency overtime and delivery fees.'
      );
    }
    if (isOverBudget) {
      costOptimizationTips.push(
        'Trim non-essential floral arrangements and digitalize paper invitations to recover up to 8% in savings.'
      );
    } else {
      costOptimizationTips.push(
        'Lock vendor early-booking discounts (typically 5-10%) by committing contracts at least 6 months prior to event date.'
      );
    }

    return {
      currency,
      totalBudget,
      totalAllocated,
      totalActual,
      remainingBudget,
      isOverBudget,
      variancePercentage,
      allocationsByCategory,
      alerts,
      costOptimizationTips,
      items,
    };
  }
}
