import React from 'react';
import { ShieldCheck, Eye, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      role="contentinfo"
      className="border-t border-slate-800/80 bg-[#0a0d14]/90 text-slate-400 text-xs py-8 px-4 sm:px-6 lg:px-8 mt-12"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand & Problem Statement */}
        <div className="flex items-center space-x-3 text-center md:text-left">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-slate-200">
              PlanAura — AI-Native Celebration & Event Planning Engine
            </p>
            <p className="text-[11px] text-slate-500">
              PromptWars Challenge 5: Weddings, Birthdays & Community Events with Budgets, Timelines & Vendors.
            </p>
          </div>
        </div>

        {/* Right: Security & A11y Badges */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px]">
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            <span>WCAG AA Compliant</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>6 Defense-in-Depth Headers</span>
          </div>

          <p className="text-[11px] text-slate-600">v1.0.0</p>
        </div>
      </div>
    </footer>
  );
};
