import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { AuraCopilot } from './components/AuraCopilot';
import { WeddingStudio } from './components/WeddingStudio';
import { BirthdayBash } from './components/BirthdayBash';
import { CommunityHub } from './components/CommunityHub';
import { BudgetEngineView } from './components/BudgetEngineView';
import { TimelineView } from './components/TimelineView';
import { VendorChecklistView } from './components/VendorChecklistView';
import { PersonalizedIdeasView } from './components/PersonalizedIdeasView';
import { Footer } from './components/Footer';
import { EventConfigModal } from './components/EventConfigModal';
import { ApiService } from './services/apiService';
import { EventBlueprint, EventCategory, VendorStatus } from './types';

// Initial resilient fallback blueprint
const INITIAL_BLUEPRINT: EventBlueprint = {
  eventName: 'The Grand Celebration',
  eventType: 'wedding',
  eventDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
  guestCount: 100,
  currency: 'USD',
  budget: {
    currency: 'USD',
    totalBudget: 25000,
    totalAllocated: 25000,
    totalActual: 11000,
    remainingBudget: 14000,
    isOverBudget: false,
    variancePercentage: 0,
    allocationsByCategory: {
      'Venue & Catering': { allocated: 11250, actual: 8500, percentOfTotal: 45 },
      'Photography & Video': { allocated: 3000, actual: 2500, percentOfTotal: 12 },
      'Music & Entertainment': { allocated: 2500, actual: 0, percentOfTotal: 10 },
      'Floral & Decor': { allocated: 2500, actual: 0, percentOfTotal: 10 },
      'Attire & Beauty': { allocated: 2000, actual: 0, percentOfTotal: 8 },
      'Planner & Coordination': { allocated: 1750, actual: 0, percentOfTotal: 7 },
      'Contingency Buffer': { allocated: 1250, actual: 0, percentOfTotal: 5 },
      'Stationery & Favors': { allocated: 750, actual: 0, percentOfTotal: 3 },
    },
    alerts: [],
    costOptimizationTips: [
      'Lock vendor early-booking discounts by committing contracts at least 6 months prior to event date.',
      'Consider buffet-style or family-style service to trim per-guest catering costs by 18-25%.',
    ],
    items: [
      { id: 'b-1', category: 'Venue & Catering', name: 'Reception Ballroom & Dinner', allocatedAmount: 11250, actualAmount: 8500, status: 'committed' },
      { id: 'b-2', category: 'Photography & Video', name: '8-Hour Photo & Cinema', allocatedAmount: 3000, actualAmount: 2500, status: 'committed' },
      { id: 'b-3', category: 'Music & Entertainment', name: 'Ceremony PA & Reception DJ', allocatedAmount: 2500, actualAmount: 0, status: 'quoted' },
      { id: 'b-4', category: 'Floral & Decor', name: 'Centerpieces & Arch', allocatedAmount: 2500, actualAmount: 0, status: 'quoted' },
      { id: 'b-5', category: 'Contingency Buffer', name: 'Emergency Overtime Reserve', allocatedAmount: 1250, actualAmount: 0, status: 'pending' },
    ],
  },
  timeline: {
    eventType: 'wedding',
    eventDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    daysRemaining: 180,
    milestones: [
      { id: 'm-1', phase: '6_months_plus', timeframeLabel: '6+ Months Prior', title: 'Lock Primary Venue & Ceremony Grounds', description: 'Sign contracts for ballroom and backup weather plan.', completed: true, category: 'logistics' },
      { id: 'm-2', phase: '6_months_plus', timeframeLabel: '6+ Months Prior', title: 'Retain Core Photographer & Videographer', description: 'Schedule engagement shoot and verify portfolio.', completed: true, category: 'vendor' },
      { id: 'm-3', phase: '3_to_6_months', timeframeLabel: '3 to 6 Months Prior', title: 'Send Save-the-Dates & Finalize Guest List', description: 'Mail formal save-the-dates and launch wedding website.', completed: false, category: 'guest' },
      { id: 'm-4', phase: '1_to_2_months', timeframeLabel: '1 to 2 Months Prior', title: 'RSVP Cutoff & Menu Finalization', description: 'Submit dietary numbers to executive chef.', completed: false, category: 'guest' },
      { id: 'm-5', phase: 'final_weeks', timeframeLabel: '2 Weeks Prior', title: 'Final Seating Chart & Vendor Call Sheets', description: 'Distribute timeline to coordinator and DJ.', completed: false, category: 'logistics' },
    ],
    dayOfRunOfShow: [
      { id: 'ros-1', time: '09:00 AM', activity: 'Bridal Suite Load-In & Hair/Makeup', leadPerson: 'Lead Stylist', location: 'Bridal Suite', notes: 'Mimosa brunch provided.' },
      { id: 'ros-2', time: '01:30 PM', activity: 'First Look Photo Session', leadPerson: 'Photographer', location: 'Rose Garden', notes: 'Couple and wedding party portraits.' },
      { id: 'ros-3', time: '04:30 PM', activity: 'Wedding Ceremony & Vows', leadPerson: 'Officiant', location: 'Main Lawn', notes: 'Processional music, vows exchange.' },
      { id: 'ros-4', time: '05:30 PM', activity: 'Cocktail Hour & Hors d’oeuvres', leadPerson: 'Catering Lead', location: 'Terrace', notes: 'Signature Aperol Spritz.' },
      { id: 'ros-5', time: '06:45 PM', activity: 'Grand Entrance & First Dance', leadPerson: 'Reception DJ', location: 'Grand Ballroom', notes: 'Toasts and dinner service.' },
    ],
  },
  vendors: {
    items: [
      { id: 'v-1', category: 'Venue', name: 'Grand Oak Manor', serviceDescription: 'Ballroom and garden ceremony grounds.', status: 'booked', quoteAmount: 8500, depositPaid: true, depositAmount: 2500, balanceRemaining: 6000, contractSigned: true, notes: 'Final headcount due 14 days prior.' },
      { id: 'v-2', category: 'Photography', name: 'Aura Lens Studio', serviceDescription: 'Full-day photo and 4K cinema coverage.', status: 'booked', quoteAmount: 3500, depositPaid: true, depositAmount: 1000, balanceRemaining: 2500, contractSigned: true, notes: 'Drone permit verified.' },
      { id: 'v-3', category: 'Catering', name: 'Savory Haven Cuisine', serviceDescription: 'Plated 3-course dinner and open bar.', status: 'contract_pending', quoteAmount: 7200, depositPaid: false, depositAmount: 1800, balanceRemaining: 7200, contractSigned: false, notes: 'Tasting scheduled next week.' },
      { id: 'v-4', category: 'Music & DJ', name: 'Groove Collective DJs', serviceDescription: 'Ceremony PA and reception party lighting.', status: 'quoted', quoteAmount: 1800, depositPaid: false, depositAmount: 400, balanceRemaining: 1800, contractSigned: false, notes: 'Do not play list submitted.' },
    ],
    metrics: {
      totalVendors: 4,
      bookedCount: 2,
      pendingCount: 2,
      percentReady: 50,
      totalCommittedAmount: 21000,
      totalDepositsPaid: 3500,
      remainingLiability: 17500,
    },
  },
  personalizedIdeas: {
    curatedVault: [
      {
        id: 'vault-1',
        themeTitle: 'Ethereal Tuscan Vineyard & Olive Grove',
        tagline: 'Under the golden sun, surrounded by vines and eternal devotion.',
        aestheticDescription: 'Sun-bleached limestone textures, sprawling olive branch garlands, and warm candlelight.',
        colorPalette: [
          { name: 'Olive Leaf', hex: '#556B2F' },
          { name: 'Warm Terracotta', hex: '#E2725B' },
          { name: 'Champagne Shimmer', hex: '#F7E7CE' },
          { name: 'Deep Cypress', hex: '#1C3124' },
        ],
        signatureMenu: {
          cocktailOrBeverage: 'Rosemary Aperol Spritz with blood orange slice',
          appetizer: 'Burrata with charred mission figs and aged balsamic glaze',
          mainCourse: 'Pan-seared Chilean sea bass with saffron risotto',
          dessert: 'Mille-feuille with mascarpone cream and fresh raspberries',
        },
        highlightActivities: [
          'Acoustic cello & guitar arrangements during cocktail hour',
          'Interactive olive oil tasting bar with artisan focaccia',
          'Polaroid memory guestbook framed on rustic reclaimed timber easel',
        ],
        invitationWordingDraft: 'Together with their families, [Names] invite you to celebrate love, wine, and forever beneath the Tuscan canopy.',
      },
    ],
    bespokeConcept: {
      id: 'bespoke-1',
      themeTitle: 'Ethereal Tuscan Vineyard & Olive Grove',
      tagline: 'Under the golden sun, surrounded by vines and eternal devotion.',
      aestheticDescription: 'Specially calibrated for an intimate and joyful celebration.',
      colorPalette: [
        { name: 'Olive Leaf', hex: '#556B2F' },
        { name: 'Warm Terracotta', hex: '#E2725B' },
        { name: 'Champagne Shimmer', hex: '#F7E7CE' },
        { name: 'Deep Cypress', hex: '#1C3124' },
      ],
      signatureMenu: {
        cocktailOrBeverage: 'Rosemary Aperol Spritz with blood orange slice',
        appetizer: 'Burrata with charred mission figs and aged balsamic glaze',
        mainCourse: 'Pan-seared Chilean sea bass with saffron risotto',
        dessert: 'Mille-feuille with mascarpone cream and fresh raspberries',
      },
      highlightActivities: [
        'Acoustic cello & guitar arrangements during cocktail hour',
        'Interactive olive oil tasting bar with artisan focaccia',
        'Polaroid memory guestbook framed on rustic reclaimed timber easel',
      ],
      invitationWordingDraft: 'Together with their families, [Names] invite you to celebrate love, wine, and forever beneath the Tuscan canopy.',
    },
  },
};

export const App: React.FC = () => {
  const [blueprint, setBlueprint] = useState<EventBlueprint>(INITIAL_BLUEPRINT);
  const [activeTab, setActiveTab] = useState<ActiveTab>('copilot');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync with live backend plan generator on mount or category change
  const refreshPlan = async (configPayload: {
    eventType: EventCategory;
    eventName: string;
    eventDate: string;
    totalBudget: number;
    currency: string;
    guestCount: number;
    vibe: string;
  }) => {
    try {
      const res = await ApiService.generatePlan(configPayload);
      if (res.success && res.blueprint) {
        setBlueprint(res.blueprint);
      }
    } catch (err) {
      console.warn('Using client-side blueprint fallback:', err);
      // Fallback updates category in client state
      setBlueprint((prev) => ({
        ...prev,
        eventType: configPayload.eventType,
        eventName: configPayload.eventName,
        currency: configPayload.currency,
        guestCount: configPayload.guestCount,
      }));
    }
  };

  const handleCategorySwitch = (newCat: EventCategory) => {
    refreshPlan({
      eventType: newCat,
      eventName:
        newCat === 'wedding'
          ? 'The Wedding Celebration'
          : newCat === 'birthday'
            ? 'Milestone Birthday Gala'
            : 'Annual Community Festival & Faire',
      eventDate: blueprint.eventDate,
      totalBudget: newCat === 'wedding' ? 25000 : newCat === 'birthday' ? 6000 : 15000,
      currency: blueprint.currency,
      guestCount: newCat === 'wedding' ? 100 : newCat === 'birthday' ? 40 : 250,
      vibe:
        newCat === 'wedding'
          ? 'Tuscan Romantic'
          : newCat === 'birthday'
            ? 'Retro Disco'
            : 'Harvest Community Celebration',
    });

    if (newCat === 'wedding') {
      setActiveTab('wedding');
    } else if (newCat === 'birthday') {
      setActiveTab('birthday');
    } else {
      setActiveTab('community');
    }
  };

  const handleUpdateVendor = async (vendorId: string, newStatus: VendorStatus) => {
    try {
      const res = await ApiService.updateVendorStatus(
        blueprint.vendors.items,
        vendorId,
        newStatus
      );
      if (res.success) {
        setBlueprint((prev) => ({
          ...prev,
          vendors: {
            items: res.vendors,
            metrics: res.metrics as typeof prev.vendors.metrics,
          },
        }));
      }
    } catch {
      // Optimistic local update
      setBlueprint((prev) => {
        const updated = prev.vendors.items.map((v) =>
          v.id === vendorId ? { ...v, status: newStatus } : v
        );
        return {
          ...prev,
          vendors: {
            ...prev.vendors,
            items: updated,
          },
        };
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0d14] text-slate-100">
      {/* WCAG AA Visible Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Semantic Banner Header */}
      <Header
        currentCategory={blueprint.eventType}
        onCategoryChange={handleCategorySwitch}
        onOpenConfigModal={() => setIsModalOpen(true)}
        eventName={blueprint.eventName}
      />

      {/* Semantic Tab Navigation */}
      <Navigation activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Primary Semantic Content Area */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 focus:outline-none">
        {activeTab === 'copilot' && <AuraCopilot blueprint={blueprint} />}
        {activeTab === 'wedding' && <WeddingStudio blueprint={blueprint} />}
        {activeTab === 'birthday' && <BirthdayBash blueprint={blueprint} />}
        {activeTab === 'community' && <CommunityHub blueprint={blueprint} />}
        {activeTab === 'budget' && (
          <BudgetEngineView
            budget={blueprint.budget}
            onUpdateBudget={(updated) => setBlueprint((prev) => ({ ...prev, budget: updated }))}
          />
        )}
        {activeTab === 'timeline' && <TimelineView timeline={blueprint.timeline} />}
        {activeTab === 'vendors' && (
          <VendorChecklistView
            vendors={blueprint.vendors.items}
            metrics={blueprint.vendors.metrics}
            onUpdateVendor={handleUpdateVendor}
            currency={blueprint.currency}
          />
        )}
        {activeTab === 'ideas' && (
          <PersonalizedIdeasView
            ideasVault={blueprint.personalizedIdeas.curatedVault}
            bespokeConcept={blueprint.personalizedIdeas.bespokeConcept}
          />
        )}
      </main>

      {/* Semantic Footer */}
      <Footer />

      {/* Configuration Modal */}
      <EventConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newCfg) => {
          refreshPlan(newCfg);
        }}
        initialValues={{
          eventType: blueprint.eventType,
          eventName: blueprint.eventName,
          eventDate: blueprint.eventDate,
          totalBudget: blueprint.budget.totalBudget,
          currency: blueprint.currency,
          guestCount: blueprint.guestCount,
          vibe: 'Festive & Elegant',
        }}
      />
    </div>
  );
};
