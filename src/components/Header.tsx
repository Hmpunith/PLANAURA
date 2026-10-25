/**
 * @file PlanAura Header Component
 * @description Master navigation banner with brand emblem, category switcher, and configuration trigger.
 * @module src/components/Header
 */

import React from 'react';
import { Sparkles, HeartHandshake, Cake, Users, ShieldCheck } from 'lucide-react';
import { EventCategory } from '../types';

/**
 * Properties for Header component.
 */
export interface HeaderProps {
  /** Active event celebration category */
  currentCategory: EventCategory;
  /** Callback fired when user clicks a category switcher pill */
  onCategoryChange: (category: EventCategory) => void;
  /** Callback opening the custom event configuration modal */
  onOpenConfigModal: () => void;
  /** Current celebration title */
  eventName: string;
}

/**
 * Global application header adhering to HTML5 banner landmark semantics.
 */
export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onCategoryChange,
  onOpenConfigModal,
  eventName,
}) => {
  return (
    <header
      role="banner"
      className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0a0d14]/90 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Plan<span className="text-amber-400">Aura</span>
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                AI Director
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block truncate max-w-[200px] md:max-w-xs">
              {eventName}
            </p>
          </div>
        </div>

        {/* Quick Category Switcher */}
        <div
          role="group"
          aria-label="Event category selection"
          className="hidden md:flex items-center p-1 bg-slate-900/80 rounded-xl border border-slate-800"
        >
          <button
            type="button"
            onClick={() => onCategoryChange('wedding')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              currentCategory === 'wedding'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            aria-pressed={currentCategory === 'wedding'}
          >
            <HeartHandshake className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Weddings</span>
          </button>

          <button
            type="button"
            onClick={() => onCategoryChange('birthday')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              currentCategory === 'birthday'
                ? 'bg-rose-500 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            aria-pressed={currentCategory === 'birthday'}
          >
            <Cake className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Birthdays</span>
          </button>

          <button
            type="button"
            onClick={() => onCategoryChange('community')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              currentCategory === 'community'
                ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            aria-pressed={currentCategory === 'community'}
          >
            <Users className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Community</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Gemini 2.5 Flash</span>
          </div>

          <button
            type="button"
            onClick={onOpenConfigModal}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all focus:ring-2 focus:ring-amber-400 focus:outline-none"
          >
            <span>Customize Event</span>
          </button>
        </div>
      </div>
    </header>
  );
};
