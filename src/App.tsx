/**
 * @file PlanAura Root Application Container
 * @description Master view orchestrator routing active tab panels and global layout shells.
 * @module src/App
 */

import React from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
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
import { useEventPlanner } from './hooks/useEventPlanner';

/**
 * Root React component establishing the application layout, skip-link, and tab router.
 */
export const App: React.FC = () => {
  const {
    blueprint,
    activeTab,
    setActiveTab,
    isConfigModalOpen,
    setIsConfigModalOpen,
    isLoading,
    handleCategoryChange,
    handleRegenerateBlueprint,
    handleBudgetUpdate,
    handleVendorStatusChange,
  } = useEventPlanner();

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0d14] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* WCAG AA Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Global Header */}
      <Header
        currentCategory={blueprint.eventType}
        onCategoryChange={handleCategoryChange}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
        eventName={blueprint.eventName}
      />

      {/* Navigation Tab Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentCategory={blueprint.eventType}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2 animate-pulse"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Regenerating tailored event blueprint...</span>
          </div>
        )}

        {/* Dynamic Tab Paneling */}
        {activeTab === 'copilot' && <AuraCopilot blueprint={blueprint} />}

        {activeTab === 'wedding' && (
          <WeddingStudio blueprint={blueprint} onUpdateBudget={handleBudgetUpdate} />
        )}

        {activeTab === 'birthday' && <BirthdayBash blueprint={blueprint} />}

        {activeTab === 'community' && <CommunityHub blueprint={blueprint} />}

        {activeTab === 'budget' && (
          <BudgetEngineView
            budget={blueprint.budget}
            onUpdateBudget={handleBudgetUpdate}
          />
        )}

        {activeTab === 'timeline' && <TimelineView timeline={blueprint.timeline} />}

        {activeTab === 'vendors' && (
          <VendorChecklistView
            vendors={blueprint.vendors.items}
            metrics={blueprint.vendors.metrics}
            currency={blueprint.currency}
            onStatusChange={handleVendorStatusChange}
          />
        )}

        {activeTab === 'ideas' && (
          <PersonalizedIdeasView
            curatedVault={blueprint.personalizedIdeas.curatedVault}
            bespokeConcept={blueprint.personalizedIdeas.bespokeConcept}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Event Configuration Modal */}
      {isConfigModalOpen && (
        <EventConfigModal
          currentConfig={{
            eventName: blueprint.eventName,
            eventType: blueprint.eventType,
            eventDate: blueprint.eventDate,
            guestCount: blueprint.guestCount,
            totalBudget: blueprint.budget.totalBudget,
            currency: blueprint.currency,
            vibe: blueprint.personalizedIdeas.bespokeConcept.tagline,
          }}
          onClose={() => setIsConfigModalOpen(false)}
          onSubmit={handleRegenerateBlueprint}
        />
      )}
    </div>
  );
};
