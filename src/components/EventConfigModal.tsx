import React, { useState } from 'react';
import { X, Sparkles, HeartHandshake, Cake, Users } from 'lucide-react';
import { EventCategory } from '../types';

interface EventConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: {
    eventType: EventCategory;
    eventName: string;
    eventDate: string;
    totalBudget: number;
    currency: string;
    guestCount: number;
    vibe: string;
  }) => void;
  initialValues: {
    eventType: EventCategory;
    eventName: string;
    eventDate: string;
    totalBudget: number;
    currency: string;
    guestCount: number;
    vibe: string;
  };
}

export const EventConfigModal: React.FC<EventConfigModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialValues,
}) => {
  const [eventType, setEventType] = useState<EventCategory>(initialValues.eventType);
  const [eventName, setEventName] = useState(initialValues.eventName);
  const [eventDate, setEventDate] = useState(initialValues.eventDate.split('T')[0]);
  const [totalBudget, setTotalBudget] = useState(initialValues.totalBudget);
  const [currency, setCurrency] = useState(initialValues.currency);
  const [guestCount, setGuestCount] = useState(initialValues.guestCount);
  const [vibe, setVibe] = useState(initialValues.vibe);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      eventType,
      eventName,
      eventDate: new Date(eventDate).toISOString(),
      totalBudget: Number(totalBudget),
      currency,
      guestCount: Number(guestCount),
      vibe,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-[#111726] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" aria-hidden="true" />
            <h2 id="modal-title" className="text-lg font-bold text-white">
              Configure Celebration Blueprint
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close configuration modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Category Selector */}
          <div>
            <label className="block font-semibold text-slate-300 mb-2">Event Category:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEventType('wedding')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                  eventType === 'wedding'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Wedding</span>
              </button>

              <button
                type="button"
                onClick={() => setEventType('birthday')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                  eventType === 'birthday'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cake className="w-4 h-4" />
                <span>Birthday</span>
              </button>

              <button
                type="button"
                onClick={() => setEventType('community')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                  eventType === 'community'
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Community</span>
              </button>
            </div>
          </div>

          {/* Event Title */}
          <div>
            <label htmlFor="cfg-name" className="block font-semibold text-slate-300 mb-1">
              Celebration Name:
            </label>
            <input
              id="cfg-name"
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="cfg-date" className="block font-semibold text-slate-300 mb-1">
                Event Date:
              </label>
              <input
                id="cfg-date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label htmlFor="cfg-guests" className="block font-semibold text-slate-300 mb-1">
                Target Guest Count:
              </label>
              <input
                id="cfg-guests"
                type="number"
                min={1}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="cfg-budget" className="block font-semibold text-slate-300 mb-1">
                Total Budget:
              </label>
              <input
                id="cfg-budget"
                type="number"
                min={100}
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label htmlFor="cfg-currency" className="block font-semibold text-slate-300 mb-1">
                Currency:
              </label>
              <select
                id="cfg-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
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

          <div>
            <label htmlFor="cfg-vibe" className="block font-semibold text-slate-300 mb-1">
              Atmosphere / Aesthetic Vibe:
            </label>
            <input
              id="cfg-vibe"
              type="text"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              placeholder="e.g. Modern Tuscan, Vintage Disco, Harvest Faire..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 border border-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
            >
              Regenerate Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
