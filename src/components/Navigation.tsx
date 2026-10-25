/**
 * @file PlanAura Navigation Component
 * @description Accessible tab bar with ARIA tablist semantics and keyboard navigation.
 * @module src/components/Navigation
 */

import React from 'react';
import {
  Sparkles,
  HeartHandshake,
  Cake,
  Users,
  DollarSign,
  Clock,
  Briefcase,
  Palette,
} from 'lucide-react';
import { EventCategory } from '../types';

export type ActiveTab =
  | 'copilot'
  | 'wedding'
  | 'birthday'
  | 'community'
  | 'budget'
  | 'timeline'
  | 'vendors'
  | 'ideas';

/**
 * Properties for Navigation component.
 */
export interface NavigationProps {
  /** Currently active tab identifier */
  activeTab: ActiveTab;
  /** Callback fired when user selects a tab */
  onTabChange?: (tab: ActiveTab) => void;
  /** Alias callback fired when user selects a tab */
  onSelectTab?: (tab: ActiveTab) => void;
  /** Active category for contextual highlight */
  currentCategory?: EventCategory;
}

interface TabItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabItem[] = [
  { id: 'copilot', label: 'Aura Copilot', icon: Sparkles },
  { id: 'wedding', label: 'Wedding Studio', icon: HeartHandshake },
  { id: 'birthday', label: 'Birthday Bash', icon: Cake },
  { id: 'community', label: 'Community Hub', icon: Users },
  { id: 'budget', label: 'Budget Engine', icon: DollarSign },
  { id: 'timeline', label: 'Timeline & Run-of-Show', icon: Clock },
  { id: 'vendors', label: 'Vendor Checklists', icon: Briefcase },
  { id: 'ideas', label: 'Personalized Ideas', icon: Palette },
];

/**
 * Accessible tab navigation adhering to WAI-ARIA tablist standards.
 */
export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  onSelectTab,
}) => {
  const handleSelect = (tab: ActiveTab) => {
    if (onTabChange) onTabChange(tab);
    if (onSelectTab) onSelectTab(tab);
  };

  return (
    <nav
      aria-label="Event Planning Modules"
      className="border-b border-slate-800/80 bg-[#0c101b]/80 backdrop-blur-md sticky top-16 z-30 overflow-x-auto scrollbar-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div role="tablist" className="flex space-x-1 sm:space-x-2 py-2.5 min-w-max">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => handleSelect(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`}
                  aria-hidden="true"
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
