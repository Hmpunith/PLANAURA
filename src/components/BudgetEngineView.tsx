/**
 * @file PlanAura Budget Intelligence Engine View
 * @description Interactive financial ledger with benchmark allocation caps, variance calculations, and over-budget warnings.
 * @module src/components/BudgetEngineView
 */

import React, { useState } from 'react';
import { Wallet, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { BudgetAnalysis, BudgetItem } from '../types';

/**
 * Properties for BudgetEngineView component.
 */
export interface BudgetEngineViewProps {
  /** Active budget ledger and category calculations */
  budget: BudgetAnalysis;
  /** Callback fired when an expense item or allocation changes */
  onUpdateBudget: (updated: BudgetAnalysis) => void;
}

/**
 * BudgetEngineView presents interactive expense tracking, category progress bars, and cost-optimization recommendations.
 */
export const BudgetEngineView: React.FC<BudgetEngineViewProps> = ({ budget, onUpdateBudget }) => {
  const [items, setItems] = useState<BudgetItem[]>(budget.items);
  const [currency, setCurrency] = useState<string>(budget.currency || 'USD');

  const handleActualChange = (id: string, newActual: number) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, actualAmount: Math.max(0, newActual) } : item
    );
    setItems(updatedItems);

    let totalAlloc = 0;
    let totalAct = 0;
    const categoryAllocations: Record<
      string,
      { allocated: number; actual: number; percentOfTotal: number }
    > = {};

    updatedItems.forEach((it) => {
      totalAlloc += it.allocatedAmount;
      totalAct += it.actualAmount;
      if (!categoryAllocations[it.category]) {
        categoryAllocations[it.category] = { allocated: 0, actual: 0, percentOfTotal: 0 };
      }
      categoryAllocations[it.category].allocated += it.allocatedAmount;
      categoryAllocations[it.category].actual += it.actualAmount;
    });

    Object.keys(categoryAllocations).forEach((cat) => {
      categoryAllocations[cat].percentOfTotal =
        budget.totalBudget > 0
          ? Math.round((categoryAllocations[cat].allocated / budget.totalBudget) * 100)
          : 0;
    });

    const remaining = budget.totalBudget - (totalAct > 0 ? totalAct : totalAlloc);
    const isOver = remaining < 0;

    onUpdateBudget({
      ...budget,
      currency,
      totalAllocated: totalAlloc,
      totalActual: totalAct,
      remainingBudget: remaining,
      isOverBudget: isOver,
      allocationsByCategory: categoryAllocations,
      items: updatedItems,
      alerts: isOver
        ? [
            `Critical: Currently over budget by ${currency} ${Math.abs(remaining).toLocaleString()}!`,
          ]
        : [],
    });
  };

  const handleStatusChange = (id: string, status: BudgetItem['status']) => {
    const updatedItems = items.map((item) => (item.id === id ? { ...item, status } : item));
    setItems(updatedItems);
    onUpdateBudget({ ...budget, items: updatedItems });
  };

  return (
    <div
      role="tabpanel"
      id="panel-budget"
      aria-labelledby="tab-budget"
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Wallet className="w-4 h-4" aria-hidden="true" />
              <span>Budget Allocation & Cost Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Financial Blueprint & Expense Ledger
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Real-time variance tracking, category percentage caps, and automated cost-saving
              recommendations.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <label htmlFor="currency-select" className="text-xs text-slate-400">
              Currency:
            </label>
            <select
              id="currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-amber-400 focus:outline-none"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Over-budget alert */}
      {budget.isOverBudget && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 flex items-center space-x-3 text-red-200 animate-pulse"
        >
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" aria-hidden="true" />
          <div className="text-sm font-medium">
            <strong>Warning: Budget Exceeded!</strong> You are currently over total budget by{' '}
            <span className="font-mono font-bold">
              {currency} {Math.abs(budget.remainingBudget).toLocaleString()}
            </span>
            . Review cost optimization advice below to trim expenses.
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#111726]/80 border border-slate-800 backdrop-blur-md">
          <p className="text-xs text-slate-400 font-medium">Target Total Budget</p>
          <p className="text-2xl font-bold text-white mt-1.5 font-mono">
            {currency} {budget.totalBudget.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">100% Target Baseline</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111726]/80 border border-slate-800 backdrop-blur-md">
          <p className="text-xs text-slate-400 font-medium">Allocated Total</p>
          <p className="text-2xl font-bold text-amber-400 mt-1.5 font-mono">
            {currency} {budget.totalAllocated.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Planned across categories</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111726]/80 border border-slate-800 backdrop-blur-md">
          <p className="text-xs text-slate-400 font-medium">Actual Committed</p>
          <p className="text-2xl font-bold text-teal-400 mt-1.5 font-mono">
            {currency} {budget.totalActual.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Signed contracts & payments</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111726]/80 border border-slate-800 backdrop-blur-md">
          <p className="text-xs text-slate-400 font-medium">Remaining Cushion</p>
          <p
            className={`text-2xl font-bold mt-1.5 font-mono ${
              budget.remainingBudget < 0 ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {currency} {budget.remainingBudget.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">
            {budget.remainingBudget < 0 ? 'Deficit!' : 'Available buffer'}
          </p>
        </div>
      </div>

      {/* Category Allocation Progress Bars */}
      <div className="p-6 rounded-2xl bg-[#111726]/80 border border-slate-800 backdrop-blur-md">
        <h3 className="text-base font-bold text-white mb-4">Category Benchmark Distribution</h3>
        <div className="space-y-3">
          {Object.entries(budget.allocationsByCategory).map(([catName, stats]) => (
            <div key={catName} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-300">{catName}</span>
                <span className="text-slate-400 font-mono">
                  {currency} {stats.allocated.toLocaleString()} ({stats.percentOfTotal}%)
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, stats.percentOfTotal)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Expense Line Items Table */}
      <div className="rounded-2xl bg-[#111726]/80 border border-slate-800 overflow-hidden backdrop-blur-md">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Expense Ledger & Payment Milestones</h3>
          <span className="text-xs text-slate-400">Edit actual expenditures live</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <th scope="col" className="px-6 py-3 font-semibold">
                  Category & Description
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Allocated
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Actual Spent
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Variance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {items.map((item) => {
                const variance = item.actualAmount - item.allocatedAmount;
                const isOver = variance > 0 && item.actualAmount > 0;
                return (
                  <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-slate-200">{item.name}</div>
                      <div className="text-[11px] text-slate-400">{item.category}</div>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-300">
                      {currency} {item.allocatedAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-400">{currency}</span>
                        <input
                          type="number"
                          value={item.actualAmount}
                          onChange={(e) => handleActualChange(item.id, Number(e.target.value))}
                          className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                          aria-label={`Actual amount for ${item.name}`}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(item.id, e.target.value as BudgetItem['status'])
                        }
                        className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                        aria-label={`Status for ${item.name}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="quoted">Quoted</option>
                        <option value="committed">Committed</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    <td className="px-6 py-3.5 font-mono">
                      {item.actualAmount === 0 ? (
                        <span className="text-slate-500">—</span>
                      ) : (
                        <span className={isOver ? 'text-red-400' : 'text-emerald-400'}>
                          {isOver ? '+' : ''}
                          {currency} {variance.toLocaleString()}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Cost-Saving Recommendations Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900 border border-amber-500/20 backdrop-blur-md">
        <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-2 mb-3">
          <Lightbulb className="w-4 h-4" aria-hidden="true" />
          <span>Aura AI Cost Optimization Strategies</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
          {budget.costOptimizationTips.map((tip, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start space-x-2"
            >
              <CheckCircle2
                className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
