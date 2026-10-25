import React from 'react';
import {
  Bot,
  HeartHandshake,
  Cake,
  Users,
  Wallet,
  Clock,
  ClipboardList,
  Lightbulb,
} from 'lucide-react';

export type ActiveTab =
  | 'copilot'
  | 'wedding'
  | 'birthday'
  | 'community'
  | 'budget'
  | 'timeline'
  | 'vendors'
  | 'ideas';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'copilot', label: 'Aura Copilot', icon: Bot, tag: 'AI' },
  { id: 'wedding', label: 'Wedding Studio', icon: HeartHandshake },
  { id: 'birthday', label: 'Birthday Bash', icon: Cake },
  { id: 'community', label: 'Community Hub', icon: Users },
  { id: 'budget', label: 'Budgets', icon: Wallet },
  { id: 'timeline', label: 'Timelines & Run-of-Show', icon: Clock },
  { id: 'vendors', label: 'Vendor Checklists', icon: ClipboardList },
  { id: 'ideas', label: 'Personalized Ideas', icon: Lightbulb },
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav
      aria-label="Planning Workspace Navigation"
      className="border-b border-slate-800/80 bg-[#0c101b]/80 backdrop-blur-md sticky top-16 z-30 overflow-x-auto scrollbar-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div role="tablist" aria-orientation="horizontal" className="flex space-x-1 sm:space-x-2 py-2.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;

            return (
              <button
                key={item.id}
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-${item.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  isSelected
                    ? 'bg-slate-800 text-amber-400 font-semibold shadow-inner border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
                {item.tag && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                    {item.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
