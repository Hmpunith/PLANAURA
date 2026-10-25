import React, { useState } from 'react';
import { ClipboardList, CheckCircle2, ShieldCheck } from 'lucide-react';
import { VendorItem, VendorPipelineMetrics, VendorStatus } from '../types';

interface VendorChecklistViewProps {
  vendors: VendorItem[];
  metrics: VendorPipelineMetrics;
  onUpdateVendor: (vendorId: string, newStatus: VendorStatus) => void;
  currency?: string;
}

const STATUS_CONFIG: Record<VendorStatus, { label: string; bg: string; text: string; border: string }> = {
  contacted: { label: 'Contacted', bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' },
  quoted: { label: 'Quoted', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  contract_pending: {
    label: 'Contract Pending',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  booked: { label: 'Booked', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  paid: { label: 'Paid in Full', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
};

export const VendorChecklistView: React.FC<VendorChecklistViewProps> = ({
  vendors,
  metrics,
  onUpdateVendor,
  currency = 'USD',
}) => {
  const [filter, setFilter] = useState<'all' | VendorStatus>('all');

  const filteredVendors =
    filter === 'all' ? vendors : vendors.filter((v) => v.status === filter);

  return (
    <div
      role="tabpanel"
      id="panel-vendors"
      aria-labelledby="tab-vendors"
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ClipboardList className="w-4 h-4" aria-hidden="true" />
              <span>Procurement & Vendor Lifecycle</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Vendor Checklists & Contract Tracking
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              End-to-end vendor readiness: quotes, deposits, signed agreements, and day-of call sheets.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <div className="bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Readiness</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {metrics.percentReady}% Booked
              </span>
            </div>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Committed</span>
            <span className="text-base font-bold font-mono text-white mt-0.5 block">
              {currency} {metrics.totalCommittedAmount.toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Deposits Paid</span>
            <span className="text-base font-bold font-mono text-amber-400 mt-0.5 block">
              {currency} {metrics.totalDepositsPaid.toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Remaining Liability</span>
            <span className="text-base font-bold font-mono text-rose-400 mt-0.5 block">
              {currency} {metrics.remainingLiability.toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Vendor Count</span>
            <span className="text-base font-bold font-mono text-purple-400 mt-0.5 block">
              {metrics.bookedCount} / {metrics.totalVendors} Locked
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {(['all', 'contacted', 'quoted', 'contract_pending', 'booked', 'paid'] as const).map(
          (statusKey) => (
            <button
              key={statusKey}
              type="button"
              onClick={() => setFilter(statusKey)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold capitalize transition-all ${
                filter === statusKey
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {statusKey === 'all'
                ? `All Vendors (${vendors.length})`
                : `${statusKey.replace('_', ' ')} (${vendors.filter((v) => v.status === statusKey).length})`}
            </button>
          )
        )}
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVendors.map((vendor) => {
          const cfg = STATUS_CONFIG[vendor.status] || STATUS_CONFIG.contacted;
          return (
            <div
              key={vendor.id}
              className="p-5 rounded-2xl bg-[#111726]/80 border border-slate-800 backdrop-blur-md space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/90">
                    {vendor.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{vendor.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{vendor.serviceDescription}</p>
                </div>

                <select
                  value={vendor.status}
                  onChange={(e) => onUpdateVendor(vendor.id, e.target.value as VendorStatus)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold border ${cfg.bg} ${cfg.text} ${cfg.border} focus:outline-none focus:ring-1 focus:ring-amber-400`}
                  aria-label={`Update status for ${vendor.name}`}
                >
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quoted</option>
                  <option value="contract_pending">Contract Pending</option>
                  <option value="booked">Booked</option>
                  <option value="paid">Paid in Full</option>
                </select>
              </div>

              {/* Financial & Contract Checkpoints */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Quote</span>
                  <span className="font-mono font-bold text-slate-200">
                    {currency} {vendor.quoteAmount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Deposit</span>
                  <span className="font-mono font-bold text-amber-400">
                    {vendor.depositPaid ? `${currency} ${vendor.depositAmount.toLocaleString()}` : 'Unpaid'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Balance</span>
                  <span className="font-mono font-bold text-slate-300">
                    {currency} {vendor.balanceRemaining.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Badges: Contract & Insurance */}
              <div className="flex items-center space-x-3 text-xs text-slate-400 pt-1">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      vendor.contractSigned ? 'text-emerald-400' : 'text-slate-600'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{vendor.contractSigned ? 'Contract Executed' : 'Contract Pending'}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span>COI Verified</span>
                </span>
              </div>

              {/* Notes */}
              {vendor.notes && (
                <div className="text-xs text-slate-400 italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                  Note: {vendor.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
