/**
 * @file PlanAura Client API Service
 * @description Interfaces with backend endpoints with resilient offline fallbacks and typed error boundaries.
 * @module src/services/apiService
 */

import { EventBlueprint, EventCategory, VendorItem, VendorStatus } from '../types';
import { ApiNetworkError } from '../errors/AppError';

/**
 * Client service layer mediating all HTTP communications with the PlanAura API server.
 */
export class ApiService {
  /**
   * Internal generic HTTP fetch wrapper with JSON serialization and typed error handling.
   * @param endpoint - Relative API route URL
   * @param options - Fetch options object
   * @returns Deserialized response payload
   * @throws {ApiNetworkError} When response status is non-2xx
   */
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
      const message = errorJson?.error?.message || `HTTP error ${res.status}`;
      throw new ApiNetworkError(message, res.status);
    }

    return res.json();
  }

  /**
   * Retrieves server health telemetry and operational AI status.
   * @returns Health status object
   */
  public static async getHealth(): Promise<{ status: string; aiEngine: { mode: string } }> {
    return this.request('/api/health');
  }

  /**
   * Dispatches event parameters to generate a complete event blueprint.
   * @param payload - Event configuration parameters
   * @returns Generated event blueprint
   */
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

  /**
   * Sends user prompt to Aura Copilot with conversation history and context grounding.
   * @param prompt - User question or command
   * @param history - Prior chat messages
   * @param eventContext - Active blueprint metadata
   * @returns Copilot response text
   */
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

  /**
   * Updates vendor lifecycle stage and recomputes balance liabilities.
   * @param vendors - Current vendor items array
   * @param vendorId - Target vendor ID
   * @param newStatus - Target vendor lifecycle state
   * @returns Updated vendor list and pipeline metrics
   */
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
