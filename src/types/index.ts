/**
 * @file PlanAura Client Types & Data Contracts
 */

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
  allocationsByCategory: Record<
    string,
    { allocated: number; actual: number; percentOfTotal: number }
  >;
  alerts: string[];
  costOptimizationTips: string[];
  items: BudgetItem[];
}

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

export interface DayOfScheduleItem {
  id: string;
  time: string;
  activity: string;
  leadPerson: string;
  location: string;
  notes: string;
}

export interface TimelinePackage {
  eventType: EventCategory;
  eventDate: string;
  milestones: Milestone[];
  dayOfRunOfShow: DayOfScheduleItem[];
  daysRemaining: number;
}

export type VendorStatus = 'contacted' | 'quoted' | 'contract_pending' | 'booked' | 'paid';

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

export interface VendorPipelineMetrics {
  totalVendors: number;
  bookedCount: number;
  pendingCount: number;
  percentReady: number;
  totalCommittedAmount: number;
  totalDepositsPaid: number;
  remainingLiability: number;
}

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
