/**
 * @file PlanAura Wedding Studio View
 * @description Dedicated matrimonial planning suite featuring dynamic banquet table calculators and tradition checklists.
 * @module src/components/WeddingStudio
 */

import React, { useState } from 'react';
import { HeartHandshake, CheckCircle2, Circle, Users, Sparkles } from 'lucide-react';
import { EventBlueprint } from '../types';

/**
 * Properties for WeddingStudio component.
 */
export interface WeddingStudioProps {
  /** Active event blueprint providing guest counts and currency */
  blueprint: EventBlueprint;
  /** Optional callback when budget modifications occur */
  onUpdateBudget?: (updated: EventBlueprint['budget']) => void;
}

interface WeddingTradition {
  id: string;
  title: string;
  category: 'ceremony' | 'reception' | 'logistics';
  description: string;
  completed: boolean;
}

/**
 * WeddingStudio provides interactive table sizing, floorplan visualizers, and ceremony protocol checklists.
 */
export const WeddingStudio: React.FC<WeddingStudioProps> = ({ blueprint }) => {
  const [tableCapacity, setTableCapacity] = useState<number>(8);
  const [traditions, setTraditions] = useState<WeddingTradition[]>([
    {
      id: 'w-trad-1',
      title: 'Compose Personal Vows & Officiant Outline',
      category: 'ceremony',
      description: 'Review ceremony script, ring exchange vows, and cultural blessings.',
      completed: true,
    },
    {
      id: 'w-trad-2',
      title: 'Finalize Marriage License Requirements',
      category: 'logistics',
      description: 'Acquire county clerk application; identify 2 designated witnesses.',
      completed: false,
    },
    {
      id: 'w-trad-3',
      title: 'Rehearsal Dinner & Bridal Party Walkthrough',
      category: 'ceremony',
      description: 'Conduct 45-minute processional timing rehearsal followed by dinner.',
      completed: false,
    },
    {
      id: 'w-trad-4',
      title: 'First Dance & Parent Dances Song Selection',
      category: 'reception',
      description: 'Select acoustic or studio track cut down to 2.5 minutes.',
      completed: true,
    },
    {
      id: 'w-trad-5',
      title: 'Send-Off Sparkler / Petal Toss Coordination',
      category: 'reception',
      description: 'Verify venue open-flame permissions and distribute safety lighters.',
      completed: false,
    },
  ]);

  const guestCount = blueprint.guestCount;
  const tablesRequired = Math.ceil(guestCount / tableCapacity);

  const toggleTradition = (id: string) => {
    setTraditions((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  return (
    <div
      role="tabpanel"
      id="panel-wedding"
      aria-labelledby="tab-wedding"
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <HeartHandshake className="w-4 h-4" aria-hidden="true" />
              <span>Wedding Architecture Suite</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              {blueprint.eventName || 'The Wedding Celebration'}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Engineered for seamless matrimonial coordination: ceremony processionals, seating
              charts, rehearsal agendas, and cultural traditions.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/80 px-4 py-3 rounded-xl border border-slate-800">
            <Users className="w-5 h-5 text-amber-400" aria-hidden="true" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Guest Count</p>
              <p className="text-lg font-bold text-white">{guestCount} Guests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Seating Chart & Table Estimator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Seating Calculator */}
          <div className="bg-[#111726]/80 rounded-2xl border border-slate-800 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Reception Seating Matrix</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                  Auto-Calculated
                </span>
              </h3>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400">Seats per table:</span>
                <select
                  value={tableCapacity}
                  onChange={(e) => setTableCapacity(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-amber-400"
                  aria-label="Table capacity selector"
                >
                  <option value={6}>6 Guests (Intimate Round)</option>
                  <option value={8}>8 Guests (Classic Banquet)</option>
                  <option value={10}>10 Guests (Grand Round)</option>
                  <option value={12}>12 Guests (Long King Table)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800/80">
                <p className="text-xs text-slate-400 font-medium">Headcount</p>
                <p className="text-2xl font-bold text-white mt-1">{guestCount}</p>
                <p className="text-[10px] text-slate-500 mt-1">Confirmed RSVPs</p>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800/80">
                <p className="text-xs text-slate-400 font-medium">Tables Needed</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">{tablesRequired}</p>
                <p className="text-[10px] text-slate-500 mt-1">@ {tableCapacity} per table</p>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800/80">
                <p className="text-xs text-slate-400 font-medium">Catering Estimate</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {blueprint.currency}{' '}
                  {Math.round(
                    blueprint.budget.allocationsByCategory['Venue & Catering']?.allocated || 11250
                  ).toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  ~{blueprint.currency}{' '}
                  {Math.round(
                    (blueprint.budget.allocationsByCategory['Venue & Catering']?.allocated ||
                      11250) / guestCount
                  )}
                  /plate
                </p>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800/80">
                <p className="text-xs text-slate-400 font-medium">Table Linens</p>
                <p className="text-2xl font-bold text-violet-400 mt-1">{tablesRequired + 2}</p>
                <p className="text-[10px] text-slate-500 mt-1">Incl. Head & Cake</p>
              </div>
            </div>

            {/* Visual Floorplan Representation */}
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-3">
                Interactive Table Floorplan Preview:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800/60 max-h-56 overflow-y-auto">
                {Array.from({ length: tablesRequired }).map((_, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center hover:border-amber-500/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full border border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-xs">
                      #{idx + 1}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-300 mt-1.5">
                      {idx === 0 ? 'Head Table' : `Table ${idx + 1}`}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {idx === tablesRequired - 1 && guestCount % tableCapacity !== 0
                        ? `${guestCount % tableCapacity} Guests`
                        : `${tableCapacity} Guests`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ceremony Run-of-Show Snapshot */}
          <div className="bg-[#111726]/80 rounded-2xl border border-slate-800 p-6 backdrop-blur-md">
            <h3 className="text-base font-bold text-white mb-3">
              Ceremony & Processional Protocol
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start space-x-3">
                <span className="text-xs font-mono text-amber-400 font-bold mt-0.5">04:00 PM</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    Seating of Grandparents & Parents
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Prelude string quartet (Canon in D); lead ushers seat mothers and light the
                    unity candle.
                  </p>
                </div>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start space-x-3">
                <span className="text-xs font-mono text-amber-400 font-bold mt-0.5">04:15 PM</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    Processional of Bridal Party & Ring Bearer
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Officiant takes position; bridal party processional down the center aisle.
                  </p>
                </div>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start space-x-3">
                <span className="text-xs font-mono text-amber-400 font-bold mt-0.5">04:20 PM</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    Bridal Entrance & Processional
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Doors open; bride escorted down aisle accompanied by live acoustic
                    instrumentation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Traditions & Legal Checkpoints */}
        <div className="space-y-6">
          <div className="bg-[#111726]/80 rounded-2xl border border-slate-800 p-6 backdrop-blur-md">
            <h3 className="text-base font-bold text-white mb-1">Traditions & Milestones</h3>
            <p className="text-xs text-slate-400 mb-4">
              Check off ceremonial and regulatory duties:
            </p>

            <div className="space-y-3">
              {traditions.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTradition(t.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start space-x-3 ${
                    t.completed
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {t.completed ? (
                    <CheckCircle2
                      className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div>
                    <h4
                      className={`text-xs font-bold ${t.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}
                    >
                      {t.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{t.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Wedding Advice Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold mb-2">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Aura Wedding Insight</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Never forget a designated{' '}
              <strong className="text-amber-300 font-semibold">Emergency Bridal Kit</strong> (sewing
              kit, stain remover, safety pins, clear umbrella, and electrolyte hydration) entrusted
              to your Maid of Honor!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
