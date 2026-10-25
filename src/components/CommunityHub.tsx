import React, { useState } from 'react';
import { Users, FileCheck, ShieldAlert, HeartHandshake, CheckCircle2, Clock } from 'lucide-react';
import { EventBlueprint } from '../types';

interface CommunityHubProps {
  blueprint: EventBlueprint;
}

interface PermitItem {
  id: string;
  name: string;
  jurisdiction: string;
  status: 'approved' | 'in_review' | 'required';
  deadline: string;
  notes: string;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({ blueprint }) => {
  const [permits, setPermits] = useState<PermitItem[]>([
    {
      id: 'prm-1',
      name: 'Public Park Assembly & Event Permit',
      jurisdiction: 'Municipal Parks Dept',
      status: 'approved',
      deadline: '30 Days Prior',
      notes: 'Approved for 500 max concurrent capacity.',
    },
    {
      id: 'prm-2',
      name: 'Amplified Sound & Acoustic Variance',
      jurisdiction: 'City Environmental Services',
      status: 'approved',
      deadline: '21 Days Prior',
      notes: 'Valid 10:00 AM to 08:30 PM (max 85 dBA at perimeter).',
    },
    {
      id: 'prm-3',
      name: 'Temporary Street Closure & Traffic Control',
      jurisdiction: 'Dept of Transportation & Police',
      status: 'in_review',
      deadline: '14 Days Prior',
      notes: 'Requires 4 certified off-duty traffic marshals.',
    },
    {
      id: 'prm-4',
      name: 'Mobile Food Vendor & Health Safety Inspection',
      jurisdiction: 'County Public Health Board',
      status: 'required',
      deadline: '7 Days Prior',
      notes: 'Inspections scheduled day-of at 08:30 AM.',
    },
  ]);

  const [fundraiserTarget] = useState<number>(25000);
  const [fundsRaised] = useState<number>(18750);
  const percentFunded = Math.round((fundsRaised / fundraiserTarget) * 100);

  const togglePermit = (id: string) => {
    setPermits((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'approved' ? 'in_review' : 'approved' }
          : p
      )
    );
  };

  // Standard municipal formula: 1 portable toilet per 80 attendees for 4+ hour events
  const attendees = Math.max(blueprint.guestCount, 250);
  const toiletsNeeded = Math.ceil(attendees / 80);
  const handwashNeeded = Math.ceil(toiletsNeeded / 4);

  return (
    <div
      role="tabpanel"
      id="panel-community"
      aria-labelledby="tab-community"
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/20 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-4 h-4" aria-hidden="true" />
              <span>Civic & Community Operations Command</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              {blueprint.eventName || 'Community Gathering & Festival'}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Coordinating civic permits, safety marshals, volunteer shifts, sanitation logistics, and
              sponsorship funding for community celebrations.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/80 px-4 py-3 rounded-xl border border-slate-800">
            <HeartHandshake className="w-5 h-5 text-teal-400" aria-hidden="true" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Campaign Target</p>
              <p className="text-lg font-bold text-white">
                ${fundsRaised.toLocaleString()} / ${fundraiserTarget.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fundraiser & Sponsorship Progress Bar */}
      <div className="bg-[#111726]/80 rounded-2xl border border-slate-800 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-white">Sponsorship & Community Goal Progress</span>
          <span className="text-xs font-mono font-bold text-teal-400">{percentFunded}% Funded</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-500 to-emerald-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentFunded}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
          <span>Target: ${fundraiserTarget.toLocaleString()}</span>
          <span>14 Community Sponsors Committed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Permits & Legal Approvals */}
        <div className="bg-[#111726]/80 rounded-2xl border border-slate-800 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-teal-400" aria-hidden="true" />
              <span>Municipal Permits & Approvals</span>
            </h3>
            <span className="text-xs text-slate-400">Click to toggle state</span>
          </div>

          <div className="space-y-3">
            {permits.map((p) => {
              const isApproved = p.status === 'approved';
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePermit(p.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isApproved
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{p.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                        isApproved
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {isApproved ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approved</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>In Review</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                    <span>{p.jurisdiction}</span>
                    <span>Due: {p.deadline}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 italic">{p.notes}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Volunteer Rosters & Crowd Logistics */}
        <div className="bg-[#111726]/80 rounded-2xl border border-slate-800 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>Crowd Safety & Sanitation Ratios</span>
            </h3>
            <span className="text-xs text-slate-400">Standard Municipal Guidelines</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400 font-medium">Portable Restrooms</p>
              <p className="text-xl font-bold text-white mt-1">{toiletsNeeded} Units</p>
              <p className="text-[10px] text-slate-500 mt-1">1 ADA accessible unit</p>
            </div>
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400 font-medium">Handwash Stations</p>
              <p className="text-xl font-bold text-teal-400 mt-1">{handwashNeeded} Units</p>
              <p className="text-[10px] text-slate-500 mt-1">Dual-basin dispensers</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-300 mb-2">Volunteer Zone Assignments:</p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200">Zone A: Main Entrance & Welcome Tent</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Wristband check, festival maps, lost & found.</p>
                </div>
                <span className="text-[11px] font-mono text-teal-400 font-semibold">6 Volunteers</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200">Zone B: Stage & Performer Hospitality</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Green room security, audio cables, hydration station.</p>
                </div>
                <span className="text-[11px] font-mono text-teal-400 font-semibold">4 Volunteers</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200">Zone C: Eco-Green Waste & Recycling Sweep</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Continuous sorting, compost bin monitoring.</p>
                </div>
                <span className="text-[11px] font-mono text-teal-400 font-semibold">8 Volunteers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
