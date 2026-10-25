/**
 * @file PlanAura Birthday Bash View
 * @description Milestone birthday suite offering automated cake tier calculators and curated milestone themes.
 * @module src/components/BirthdayBash
 */

import React, { useState } from 'react';
import { Cake, Sparkles, PartyPopper } from 'lucide-react';
import { EventBlueprint } from '../types';

/**
 * Properties for BirthdayBash component.
 */
export interface BirthdayBashProps {
  /** Active event blueprint providing guest counts and celebration metadata */
  blueprint: EventBlueprint;
}

type MilestoneAge = '1st' | '18th' | '21st' | '30th' | '50th' | 'custom';

/**
 * BirthdayBash presents milestone age presets, dynamic cake tier geometry, and group icebreaker games.
 */
export const BirthdayBash: React.FC<BirthdayBashProps> = ({ blueprint }) => {
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneAge>('30th');
  const customAge = 30;
  const guestCount = blueprint.guestCount;

  // Cake calculation logic
  const getCakeRecommendation = (guests: number) => {
    if (guests <= 25) {
      return { tiers: '1-Tier (8-inch round)', servings: '24-28 servings', sheetCakeNeeded: false };
    }
    if (guests <= 60) {
      return {
        tiers: '2-Tier (10" + 6" rounds)',
        servings: '50-64 servings',
        sheetCakeNeeded: false,
      };
    }
    if (guests <= 120) {
      return {
        tiers: '3-Tier (12" + 9" + 6")',
        servings: '100-120 servings',
        sheetCakeNeeded: false,
      };
    }
    return {
      tiers: '3-Tier Showpiece + Kitchen Sheet Cake',
      servings: `${guests} servings`,
      sheetCakeNeeded: true,
    };
  };

  const cakeInfo = getCakeRecommendation(guestCount);

  const MILESTONES: Array<{ id: MilestoneAge; label: string; theme: string; vibe: string }> = [
    {
      id: '1st',
      label: '1st Birthday',
      theme: 'Wild One & Pastel Jungle',
      vibe: 'Smash cake, baby photo gallery, sensory play zone',
    },
    {
      id: '18th',
      label: '18th Milestone',
      theme: 'Neon Festival & Glow Arcade',
      vibe: 'Silent disco, mocktail bar, retro video games',
    },
    {
      id: '21st',
      label: '21st Bash',
      theme: 'Vegas Royale & Velvet Lounge',
      vibe: 'Flair bartenders, casino gaming tables, DJ stage',
    },
    {
      id: '30th',
      label: '30th Milestone',
      theme: 'Dirty 30 Disco & Glamour Loft',
      vibe: 'Espresso martini tower, gourmet slider flight, vinyl DJ',
    },
    {
      id: '50th',
      label: '50th Golden Jubilee',
      theme: 'Vintage Wine Country Gala',
      vibe: 'Acoustic jazz quartet, cellar tasting, legacy tribute video',
    },
  ];

  return (
    <div
      role="tabpanel"
      id="panel-birthday"
      aria-labelledby="tab-birthday"
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/20 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Cake className="w-4 h-4" aria-hidden="true" />
              <span>Milestone Birthday Planning Suite</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              {blueprint.eventName || 'Birthday Celebration'}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Curate milestone birthdays with automated cake tier sizing, age-specific themes,
              interactive group games, and unforgettable celebration playlists.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/80 px-4 py-3 rounded-xl border border-slate-800">
            <PartyPopper className="w-5 h-5 text-rose-400" aria-hidden="true" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Selected Milestone</p>
              <p className="text-lg font-bold text-white">
                {selectedMilestone === 'custom'
                  ? `${customAge}th Birthday`
                  : `${selectedMilestone} Celebration`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Age Selector */}
      <div className="bg-[#111726]/80 rounded-2xl border border-slate-800 p-6 backdrop-blur-md">
        <h3 className="text-base font-bold text-white mb-3">Choose Milestone Preset:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {MILESTONES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMilestone(m.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedMilestone === m.id
                  ? 'bg-rose-950/30 border-rose-500/50 text-white shadow-lg ring-1 ring-rose-500/30'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <p className="text-sm font-bold text-rose-400">{m.label}</p>
              <p className="text-xs font-semibold text-slate-200 mt-1">{m.theme}</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">{m.vibe}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cake & Dessert Calculator */}
        <div className="bg-[#111726]/80 rounded-2xl border border-slate-800 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Cake className="w-4 h-4 text-rose-400" aria-hidden="true" />
              <span>Cake & Confection Sizing Matrix</span>
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 font-semibold border border-rose-500/20">
              For {guestCount} Guests
            </span>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Recommended Cake Format:</span>
              <span className="text-sm font-bold text-white">{cakeInfo.tiers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Total Portion Capacity:</span>
              <span className="text-xs font-mono font-bold text-rose-400">{cakeInfo.servings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Sheet Cake Backup:</span>
              <span className="text-xs font-medium text-slate-300">
                {cakeInfo.sheetCakeNeeded ? 'Required for overflow portions' : 'Not required'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-300">
              Curated Flavor Palette Recommendations:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <p className="font-bold text-amber-300">Salted Caramel Bourbon</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Vanilla bean sponge with espresso buttercream.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <p className="font-bold text-rose-300">Raspberry Champagne Velvet</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  White chocolate mousse and fresh berry compote.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Group Games & Entertainment Generator */}
        <div className="bg-[#111726]/80 rounded-2xl border border-slate-800 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>Interactive Party Games & Icebreakers</span>
            </h3>
            <span className="text-xs text-slate-400">Crowd Engaging</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-300">The "Roast & Toast" Rapid Fire</h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  20 Mins
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Close friends draw prompt cards ("Most likely to...", "Best memory with the birthday
                VIP") for lighthearted laughs before the cake cutting.
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-rose-300">Digital Milestone Trivia Live</h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  15 Mins
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Guests scan a QR code on table tent cards to participate in a 10-question mobile
                trivia game about the celebrant’s favorite travels and childhood memories.
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-violet-300">Polaroid Guestbook & Capsule</h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  Continuous
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Instant film cameras placed with metallic pens and gold washi tape for guests to
                leave photos and handwritten predictions for the next decade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
