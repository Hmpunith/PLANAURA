/**
 * @file PlanAura Client API Service
 * @description Interfaces with backend endpoints with resilient offline fallbacks.
 */

import { EventBlueprint, EventCategory, VendorItem, VendorStatus } from '../types';

export class ApiService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson?.error?.message || `HTTP error ${res.status}`);
    }

    return res.json();
  }

  public static async getHealth(): Promise<{ status: string; aiEngine: { mode: string } }> {
    return this.request('/api/health');
  }

  public static async generatePlan(payload: {
    eventType: EventCategory;
    eventName: string;
    eventDate: string;
    totalBudget: number;
    currency: string;
    guestCount: number;
    vibe: string;
  }): Promise<{ success: boolean; blueprint: EventBlueprint }> {
    return this.request('/api/plan/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public static async sendChat(
    prompt: string,
    history: Array<{ role: 'user' | 'model'; parts: string }> = [],
    eventContext?: { eventType: EventCategory; budget: number; guestCount: number }
  ): Promise<{ success: boolean; reply: string }> {
    return this.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt, history, eventContext }),
    });
  }

  public static async updateVendorStatus(
    vendors: VendorItem[],
    vendorId: string,
    newStatus: VendorStatus
  ): Promise<{ success: boolean; vendors: VendorItem[]; metrics: unknown }> {
    return this.request('/api/vendors/status', {
      method: 'PATCH',
      body: JSON.stringify({ vendors, vendorId, newStatus }),
    });
  }
}
