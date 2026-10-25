/**
 * @file PlanAura Timeline Execution View
 * @description Milestone progress tracker and minute-by-minute day-of run-of-show call-sheet scheduler.
 * @module src/components/TimelineView
 */

import React, { useState } from 'react';
import { Clock, CheckCircle2, Circle, Printer, Calendar } from 'lucide-react';
import { Milestone, TimelinePackage } from '../types';

/**
 * Properties for TimelineView component.
 */
export interface TimelineViewProps {
  /** Timeline milestones and day-of execution schedule */
  timeline: TimelinePackage;
}

/**
 * TimelineView presents countdown milestones with interactive completion toggles and printable call-sheets.
 */
export const TimelineView: React.FC<TimelineViewProps> = ({ timeline }) => {
  const [milestones, setMilestones] = useState<Milestone[]>(timeline.milestones);

  const toggleMilestone = (id: string) => {
    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)));
  };

  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPercent =
    milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <div
      role="tabpanel"
      id="panel-timeline"
      aria-labelledby="tab-timeline"
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>Milestone Sequencing & Run-of-Show</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Timeline Execution & Day-Of Itinerary
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              From multi-month preparation checkpoints to minute-by-minute day-of schedules.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <div className="bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Countdown
              </span>
              <span className="text-xl font-bold font-mono text-amber-400">
                {timeline.daysRemaining} Days
              </span>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold shadow transition-colors"
              title="Print schedule for staff & vendors"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>Print Call Sheet</span>
            </button>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-slate-300">Milestone Preparedness</span>
            <span className="text-amber-400 font-mono font-bold">
              {completedCount} of {milestones.length} Completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Multi-Phase Milestones */}
      <div className="bg-[#111726]/80 rounded-2xl border border-slate-800 p-6 backdrop-blur-md">
        <h3 className="text-base font-bold text-white flex items-center space-x-2 mb-4">
          <Calendar className="w-4 h-4 text-amber-400" aria-hidden="true" />
          <span>Strategic Countdown Milestones</span>
        </h3>

        <div className="space-y-3">
          {milestones.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => toggleMilestone(m.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-start space-x-3.5 ${
                m.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {m.completed ? (
                <CheckCircle2
                  className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              ) : (
                <Circle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-sm font-bold ${m.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}
                  >
                    {m.title}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-slate-800 text-amber-400 border border-slate-700">
                    {m.timeframeLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{m.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Day-Of Run-of-Show Table */}
      <div className="rounded-2xl bg-[#111726]/80 border border-slate-800 overflow-hidden backdrop-blur-md">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Day-Of Master Run-of-Show</h3>
            <p className="text-xs text-slate-400">
              Hour-by-hour minute-by-minute operational itinerary
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
            Live Synchronized
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <th scope="col" className="px-6 py-3 font-semibold">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Activity & Milestones
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Lead Coordinator
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Zone / Location
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Operational Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {timeline.dayOfRunOfShow.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-6 py-3.5 font-mono font-bold text-amber-400 whitespace-nowrap">
                    {item.time}
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-slate-200">{item.activity}</td>
                  <td className="px-6 py-3.5 text-slate-300">{item.leadPerson}</td>
                  <td className="px-6 py-3.5 text-slate-400 whitespace-nowrap">{item.location}</td>
                  <td className="px-6 py-3.5 text-slate-400 italic">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
