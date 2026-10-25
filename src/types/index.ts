/**
 * @file PlanAura Client Types & Data Contracts
 * @description Master data models and TypeScript contracts for blueprints, budgets, timelines, and vendors.
 * @module src/types
 */

/** Event classification categories supported by PlanAura */
export type EventCategory = 'wedding' | 'birthday' | 'community';

/**
 * Individual expense line item within the budget ledger.
 */
export interface BudgetItem {
  id: string;
  category: string;
  name: string;
  allocatedAmount: number;
  actualAmount: number;
  status: 'pending' | 'quoted' | 'committed' | 'paid';
  notes?: string;
}

/**
 * Comprehensive financial analysis and category allocation breakdown.
 */
export interface BudgetAnalysis {
  currency: string;
  totalBudget: number;
  totalAllocated: number;
  totalActual: number;
  remainingBudget: number;
  isOverBudget: boolean;
  variancePercentage: number;
  allocationsByCategory: Record<
    string,
    { allocated: number; actual: number; percentOfTotal: number }
  >;
  alerts: string[];
  costOptimizationTips: string[];
  items: BudgetItem[];
}

/**
 * Milestone countdown task checkpoint.
 */
export interface Milestone {
  id: string;
  phase: '6_months_plus' | '3_to_6_months' | '1_to_2_months' | 'final_weeks' | 'day_of';
  timeframeLabel: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  category: 'logistics' | 'vendor' | 'design' | 'guest';
}

/**
 * Minute-by-minute day-of execution itinerary line item.
 */
export interface DayOfScheduleItem {
  id: string;
  time: string;
  activity: string;
  leadPerson: string;
  location: string;
  notes: string;
}

/**
 * Comprehensive milestone countdown and run-of-show schedule package.
 */
export interface TimelinePackage {
  eventType: EventCategory;
  eventDate: string;
  milestones: Milestone[];
  dayOfRunOfShow: DayOfScheduleItem[];
  daysRemaining: number;
}

/** Vendor procurement lifecycle progression status */
export type VendorStatus = 'contacted' | 'quoted' | 'contract_pending' | 'booked' | 'paid';

/**
 * Vendor profile tracking procurement milestones, deposit liabilities, and insurance.
 */
export interface VendorItem {
  id: string;
  category: string;
  name: string;
  serviceDescription: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: VendorStatus;
  quoteAmount: number;
  depositPaid: boolean;
  depositAmount: number;
  balanceRemaining: number;
  contractSigned: boolean;
  notes: string;
}

/**
 * Summary metrics of the active vendor procurement pipeline.
 */
export interface VendorPipelineMetrics {
  totalVendors: number;
  bookedCount: number;
  pendingCount: number;
  percentReady: number;
  totalCommittedAmount: number;
  totalDepositsPaid: number;
  remainingLiability: number;
}

/**
 * Creative concept featuring aesthetic theme, color palette, and culinary pairings.
 */
export interface IdeaConcept {
  id: string;
  themeTitle: string;
  tagline: string;
  aestheticDescription: string;
  colorPalette: Array<{ name: string; hex: string }>;
  signatureMenu: {
    cocktailOrBeverage: string;
    appetizer: string;
    mainCourse: string;
    dessert: string;
  };
  highlightActivities: string[];
  invitationWordingDraft: string;
}

/**
 * Master aggregate data structure representing a complete celebration blueprint.
 */
export interface EventBlueprint {
  eventName: string;
  eventType: EventCategory;
  eventDate: string;
  guestCount: number;
  currency: string;
  budget: BudgetAnalysis;
  timeline: TimelinePackage;
  vendors: {
    items: VendorItem[];
    metrics: VendorPipelineMetrics;
  };
  personalizedIdeas: {
    curatedVault: IdeaConcept[];
    bespokeConcept: IdeaConcept;
  };
}
