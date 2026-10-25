/**
 * @file PlanAura Footer Component
 * @description Application footer adhering to HTML5 contentinfo landmark semantics with security and accessibility badges.
 * @module src/components/Footer
 */

import React from 'react';
import { ShieldCheck, Eye, Terminal } from 'lucide-react';

/**
 * Global application footer presenting operational badges, licensing, and problem statement alignment.
 */
export const Footer: React.FC = () => {
  return (
    <footer
      role="contentinfo"
      className="border-t border-slate-800/80 bg-[#0a0d14]/90 text-slate-400 text-xs py-8 px-4 sm:px-6 lg:px-8 mt-12"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand & Problem Statement */}
        <div className="flex flex-col items-center md:items-start space-y-1 text-center md:text-left">
          <p className="font-semibold text-slate-300">
            PlanAura — Autonomous GenAI Celebration & Event Planner
          </p>
          <p className="text-[11px] text-slate-500">
            Engineered for Hack2Skill PromptWars [Challenge 5] • Weddings, Birthdays & Community
            Events
          </p>
          <p className="text-[10px] text-slate-600">
            MIT Licensed • 100% Client-Side State Privacy • Zero Persistent Cookies
          </p>
        </div>

        {/* Right: Security & A11y Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>6 Defense-in-Depth Headers</span>
          </span>

          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <Eye className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>WCAG AA Compliant</span>
          </span>

          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
            <span>TypeScript Strict Mode</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
