/**
 * @file PlanAura Event Planner Custom Hook
 * @description Centralized React state controller managing blueprint lifecycle, navigation, and optimistic updates.
 * @module src/hooks/useEventPlanner
 */

import { useState } from 'react';
import { EventBlueprint, EventCategory, VendorStatus } from '../types';
import { ActiveTab } from '../components/Navigation';
import { INITIAL_BLUEPRINT } from '../constants/initialBlueprint';
import { ApiService } from '../services/apiService';

/**
 * Custom React hook encapsulating all event orchestration state and mutation workflows.
 */
export function useEventPlanner() {
  const [blueprint, setBlueprint] = useState<EventBlueprint>(INITIAL_BLUEPRINT);
  const [activeTab, setActiveTab] = useState<ActiveTab>('copilot');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles top-level celebration category switching (wedding, birthday, community).
   * @param category - Selected event category
   */
  const handleCategoryChange = async (category: EventCategory) => {
    setIsLoading(true);
    try {
      const res = await ApiService.generatePlan({
        eventType: category,
        eventName:
          category === 'wedding'
            ? 'Savannah & Liam Wedding'
            : category === 'birthday'
              ? 'Milestone Jubilee Bash'
              : 'Oakridge Community Street Festival',
        eventDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
        totalBudget: category === 'wedding' ? 35000 : category === 'birthday' ? 8000 : 25000,
        currency: blueprint.currency,
        guestCount: category === 'wedding' ? 120 : category === 'birthday' ? 60 : 350,
        vibe:
          category === 'wedding'
            ? 'Classic Romantic & Candlelit'
            : category === 'birthday'
              ? 'High-Energy Neon Velvet'
              : 'Civic Pride & Family Festive',
      });
      setBlueprint(res.blueprint);
    } catch {
      // Graceful optimistic state change
      setBlueprint((prev) => ({
        ...prev,
        eventType: category,
        eventName:
          category === 'wedding'
            ? 'The Royal Matrimonial'
            : category === 'birthday'
              ? 'Milestone Celebration'
              : 'Civic Heritage Festival',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Regenerates entire blueprint based on custom modal configuration.
   * @param params - User-configured event parameters
   */
  const handleRegenerateBlueprint = async (params: {
    eventType: EventCategory;
    eventName: string;
    eventDate: string;
    totalBudget: number;
    currency: string;
    guestCount: number;
    vibe: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await ApiService.generatePlan(params);
      setBlueprint(res.blueprint);
      setIsConfigModalOpen(false);
    } catch {
      setBlueprint((prev) => ({
        ...prev,
        eventName: params.eventName,
        eventType: params.eventType,
        eventDate: params.eventDate,
        guestCount: params.guestCount,
        currency: params.currency,
        budget: {
          ...prev.budget,
          totalBudget: params.totalBudget,
          currency: params.currency,
        },
      }));
      setIsConfigModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Updates budget line items and recalculates totals and variances.
   * @param updatedBudget - Modified budget analysis
   */
  const handleBudgetUpdate = (updatedBudget: EventBlueprint['budget']) => {
    setBlueprint((prev) => ({
      ...prev,
      budget: updatedBudget,
    }));
  };

  /**
   * Advances or updates vendor lifecycle stage and recomputes liabilities.
   * @param vendorId - Target vendor ID
   * @param newStatus - Target status
   */
  const handleVendorStatusChange = async (vendorId: string, newStatus: VendorStatus) => {
    try {
      const res = await ApiService.updateVendorStatus(blueprint.vendors.items, vendorId, newStatus);
      setBlueprint((prev) => ({
        ...prev,
        vendors: {
          items: res.vendors,
          metrics: res.metrics as EventBlueprint['vendors']['metrics'],
        },
      }));
    } catch {
      // Local optimistic fallback
      setBlueprint((prev) => {
        const nextItems = prev.vendors.items.map((v) =>
          v.id === vendorId ? { ...v, status: newStatus } : v
        );
        return {
          ...prev,
          vendors: {
            ...prev.vendors,
            items: nextItems,
          },
        };
      });
    }
  };

  return {
    blueprint,
    activeTab,
    setActiveTab,
    isConfigModalOpen,
    setIsConfigModalOpen,
    isLoading,
    handleCategoryChange,
    handleRegenerateBlueprint,
    handleBudgetUpdate,
    handleVendorStatusChange,
  };
}
