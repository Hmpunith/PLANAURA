import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Header } from '../../src/components/Header';
import { Navigation } from '../../src/components/Navigation';
import { Footer } from '../../src/components/Footer';
import { WeddingStudio } from '../../src/components/WeddingStudio';
import { BirthdayBash } from '../../src/components/BirthdayBash';
import { CommunityHub } from '../../src/components/CommunityHub';
import { BudgetEngineView } from '../../src/components/BudgetEngineView';
import { TimelineView } from '../../src/components/TimelineView';
import { VendorChecklistView } from '../../src/components/VendorChecklistView';
import { PersonalizedIdeasView } from '../../src/components/PersonalizedIdeasView';
import { EventBlueprint } from '../../src/types';

const MOCK_BLUEPRINT: EventBlueprint = {
  eventName: 'Test Jubilee',
  eventType: 'wedding',
  eventDate: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString(),
  guestCount: 80,
  currency: 'USD',
  budget: {
    currency: 'USD',
    totalBudget: 20000,
    totalAllocated: 20000,
    totalActual: 5000,
    remainingBudget: 15000,
    isOverBudget: false,
    variancePercentage: 0,
    allocationsByCategory: {
      'Venue & Catering': { allocated: 9000, actual: 5000, percentOfTotal: 45 },
    },
    alerts: [],
    costOptimizationTips: ['Lock vendor contracts early to save 10%.'],
    items: [
      { id: '1', category: 'Venue & Catering', name: 'Ballroom', allocatedAmount: 9000, actualAmount: 5000, status: 'committed' },
    ],
  },
  timeline: {
    eventType: 'wedding',
    eventDate: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString(),
    daysRemaining: 100,
    milestones: [
      { id: 'm-1', phase: '6_months_plus', timeframeLabel: '6+ Months', title: 'Tour Venues', description: 'Inspect locations', completed: false, category: 'logistics' },
    ],
    dayOfRunOfShow: [
      { id: 'r-1', time: '10:00 AM', activity: 'Load-in', leadPerson: 'Coordinator', location: 'Hall', notes: 'Arrival' },
    ],
  },
  vendors: {
    items: [
      { id: 'v-1', category: 'Venue', name: 'Manor Hall', serviceDescription: 'Rental space', status: 'booked', quoteAmount: 5000, depositPaid: true, depositAmount: 1500, balanceRemaining: 3500, contractSigned: true, notes: 'Signed' },
    ],
    metrics: {
      totalVendors: 1,
      bookedCount: 1,
      pendingCount: 0,
      percentReady: 100,
      totalCommittedAmount: 5000,
      totalDepositsPaid: 1500,
      remainingLiability: 3500,
    },
  },
  personalizedIdeas: {
    curatedVault: [
      {
        id: 'c-1',
        themeTitle: 'Olive & Gold Elegance',
        tagline: 'Timeless romance',
        aestheticDescription: 'Lush greenery and gold',
        colorPalette: [
          { name: 'Olive', hex: '#556B2F' },
          { name: 'Gold', hex: '#D4AF37' },
        ],
        signatureMenu: {
          cocktailOrBeverage: 'Aperol Spritz',
          appetizer: 'Burrata',
          mainCourse: 'Sea Bass',
          dessert: 'Mille-feuille',
        },
        highlightActivities: ['Acoustic cello'],
        invitationWordingDraft: 'Join us for celebration.',
      },
    ],
    bespokeConcept: {
      id: 'b-1',
      themeTitle: 'Olive & Gold Elegance',
      tagline: 'Timeless romance',
      aestheticDescription: 'Custom calibrated',
      colorPalette: [
        { name: 'Olive', hex: '#556B2F' },
        { name: 'Gold', hex: '#D4AF37' },
      ],
      signatureMenu: {
        cocktailOrBeverage: 'Aperol Spritz',
        appetizer: 'Burrata',
        mainCourse: 'Sea Bass',
        dessert: 'Mille-feuille',
      },
      highlightActivities: ['Acoustic cello'],
      invitationWordingDraft: 'Join us for celebration.',
    },
  },
};

describe('Component Rendering & ARIA Landmark Tests', () => {
  it('renders Header with role="banner" and brand title', () => {
    render(
      <Header
        currentCategory="wedding"
        onCategoryChange={() => {}}
        onOpenConfigModal={() => {}}
        eventName="Test Event"
      />
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText(/Plan/i)).toBeInTheDocument();
    expect(screen.getByText(/Aura/i)).toBeInTheDocument();
  });

  it('renders Navigation with role="tablist" and 8 functional tabs', () => {
    render(<Navigation activeTab="wedding" onSelectTab={() => {}} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(8);
  });

  it('renders WeddingStudio with seating matrix and guest count', () => {
    render(<WeddingStudio blueprint={MOCK_BLUEPRINT} />);
    expect(screen.getByText(/Wedding Architecture Suite/i)).toBeInTheDocument();
    expect(screen.getByText(/Reception Seating Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/80 Guests/i)).toBeInTheDocument();
  });

  it('renders BirthdayBash with cake sizing and milestone selector', () => {
    render(<BirthdayBash blueprint={MOCK_BLUEPRINT} />);
    expect(screen.getByText(/Milestone Birthday Planning Suite/i)).toBeInTheDocument();
    expect(screen.getByText(/Cake & Confection Sizing Matrix/i)).toBeInTheDocument();
  });

  it('renders CommunityHub with permits and safety ratios', () => {
    render(<CommunityHub blueprint={MOCK_BLUEPRINT} />);
    expect(screen.getByText(/Civic & Community Operations Command/i)).toBeInTheDocument();
    expect(screen.getByText(/Municipal Permits & Approvals/i)).toBeInTheDocument();
  });

  it('renders BudgetEngineView with financial cards and expense table', () => {
    render(<BudgetEngineView budget={MOCK_BLUEPRINT.budget} onUpdateBudget={() => {}} />);
    expect(screen.getByText(/Financial Blueprint & Expense Ledger/i)).toBeInTheDocument();
    expect(screen.getByText(/Target Total Budget/i)).toBeInTheDocument();
  });

  it('renders TimelineView with countdown and run-of-show itinerary', () => {
    render(<TimelineView timeline={MOCK_BLUEPRINT.timeline} />);
    expect(screen.getByText(/Milestone Sequencing & Run-of-Show/i)).toBeInTheDocument();
    expect(screen.getByText(/Day-Of Master Run-of-Show/i)).toBeInTheDocument();
  });

  it('renders VendorChecklistView with readiness status and vendor cards', () => {
    render(
      <VendorChecklistView
        vendors={MOCK_BLUEPRINT.vendors.items}
        metrics={MOCK_BLUEPRINT.vendors.metrics}
        onUpdateVendor={() => {}}
      />
    );
    expect(screen.getByText(/Vendor Checklists & Contract Tracking/i)).toBeInTheDocument();
    expect(screen.getByText(/Manor Hall/i)).toBeInTheDocument();
  });

  it('renders PersonalizedIdeasView with theme concepts and palette swatches', () => {
    render(
      <PersonalizedIdeasView
        ideasVault={MOCK_BLUEPRINT.personalizedIdeas.curatedVault}
        bespokeConcept={MOCK_BLUEPRINT.personalizedIdeas.bespokeConcept}
      />
    );
    expect(screen.getByText(/Personalized Concepts, Palettes & Menus/i)).toBeInTheDocument();
    expect(screen.getByText(/Harmonious Chromatic Palette/i)).toBeInTheDocument();
  });

  it('renders Footer with role="contentinfo" and WCAG AA badge', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText(/WCAG AA Compliant/i)).toBeInTheDocument();
    expect(screen.getByText(/6 Defense-in-Depth Headers/i)).toBeInTheDocument();
  });
});
