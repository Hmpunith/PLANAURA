/**
 * @file PlanAura Gemini Generative AI Service
 * @description Interfaces with Google Gemini 2.5 Flash for conversational planning and bespoke idea generation.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';
import { planCache } from './cacheService.js';
import { EventCategory } from '../modules/budget/budgetEngine.js';
import { IdeaSynthesizer } from '../modules/ideas/ideaSynthesizer.js';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private isAvailable: boolean = false;

  constructor(customApiKey?: string) {
    const effectiveKey = customApiKey !== undefined ? customApiKey : config.geminiApiKey;
    if (effectiveKey && effectiveKey.length > 5) {
      try {
        this.genAI = new GoogleGenerativeAI(effectiveKey);
        this.isAvailable = true;
      } catch (err) {
        console.warn('[GeminiService] Could not initialize GoogleGenerativeAI SDK:', err);
        this.isAvailable = false;
      }
    } else {
      this.isAvailable = false;
    }
  }

  /**
   * Health and capability status of the AI layer.
   */
  public getStatus(): { isAvailable: boolean; model: string; mode: string } {
    return {
      isAvailable: this.isAvailable,
      model: 'gemini-2.5-flash',
      mode: this.isAvailable ? 'Cloud Gemini Live' : 'Offline Heuristic Engine (Active)',
    };
  }

  /**
   * Generates a conversational planning recommendation from the user's prompt and past dialogue.
   */
  public async chatPlan(
    prompt: string,
    history: ChatMessage[] = [],
    eventContext?: { eventType: EventCategory; budget: number; guestCount: number }
  ): Promise<string> {
    const cacheKey = planCache.generateKey('chat', { prompt, history, eventContext });
    const cached = planCache.get<string>(cacheKey);
    if (cached) {
      return cached;
    }

    if (this.isAvailable && this.genAI && process.env.NODE_ENV !== 'test') {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-2.5-flash',
          systemInstruction: `You are Aura, an elite, warm, and highly structured AI Celebration & Event Planning Director.
You specialize in weddings, milestone birthdays, and community gatherings.
Provide organized, actionable advice formatted in Markdown with clear headings, bullet points, budget calculations, and timeline recommendations.
Always maintain an encouraging, celebratory tone.`,
        });

        const contextPrefix = eventContext
          ? `[Current Context: Event=${eventContext.eventType}, Budget=$${eventContext.budget}, Guests=${eventContext.guestCount}]\n\n`
          : '';

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout calling Gemini API')), 2500)
        );

        const result = (await Promise.race([
          model.generateContent(`${contextPrefix}${prompt}`),
          timeoutPromise,
        ])) as { response: { text: () => string } };

        const responseText = result.response.text();
        planCache.set(cacheKey, responseText);
        return responseText;
      } catch (err) {
        console.warn('[GeminiService] Live call failed or timed out, falling back to heuristic assistant:', err);
      }
    }

    // High-fidelity fallback heuristic planner
    const response = this.synthesizeHeuristicAdvice(prompt, eventContext);
    planCache.set(cacheKey, response);
    return response;
  }

  private synthesizeHeuristicAdvice(
    prompt: string,
    eventContext?: { eventType: EventCategory; budget: number; guestCount: number }
  ): string {
    const type: EventCategory = eventContext?.eventType || 'wedding';
    const budget = eventContext?.budget || 10000;
    const guests = eventContext?.guestCount || 50;

    const lower = prompt.toLowerCase();

    if (lower.includes('budget') || lower.includes('cost') || lower.includes('save') || lower.includes('money')) {
      return `### 💰 Strategic Budget Allocation for Your ${type.toUpperCase()}
With a targeted budget of **$${budget.toLocaleString()}** for **${guests} guests** (~$${Math.round(budget / Math.max(1, guests))} per guest):

- **45% Primary Venue & Catering**: $${Math.round(budget * 0.45).toLocaleString()}
- **15% Creative Production (Photo/Video/AV)**: $${Math.round(budget * 0.15).toLocaleString()}
- **12% Entertainment & Music**: $${Math.round(budget * 0.12).toLocaleString()}
- **10% Decor, Theming & Floral**: $${Math.round(budget * 0.10).toLocaleString()}
- **10% Logistics, Permits & Insurance**: $${Math.round(budget * 0.10).toLocaleString()}
- **8% Contingency Safety Reserve**: $${Math.round(budget * 0.08).toLocaleString()}

> 💡 **Cost-Saving Tip**: Consolidating ceremony and reception spaces can immediately shave 15-20% off transportation and double setup rental fees!`;
    }

    if (lower.includes('timeline') || lower.includes('schedule') || lower.includes('when') || lower.includes('time')) {
      return `### ⏱️ Phased Milestone Execution Schedule
Here is your strategic countdown roadmap:

1. **Phase 1 (6+ Months Out)**: Secure the venue anchor and establish your guest list cap.
2. **Phase 2 (3-6 Months Out)**: Book critical singular vendors (lead photographer, live DJ, caterer).
3. **Phase 3 (1-2 Months Out)**: Circulate invitations with firm RSVP deadlines and capture dietary needs.
4. **Phase 4 (Final 2 Weeks)**: Finalize the minute-by-minute Day-Of Run-of-Show and distributor call-sheets.

*Check the **Timeline & Run-of-Show** tab for your full interactive day-of schedule!*`;
    }

    if (lower.includes('vendor') || lower.includes('hire') || lower.includes('contract')) {
      return `### 📋 Vendor Procurement & Negotiation Playbook
Key guidelines for retaining vendors for your **${type}**:

- **Contract Checklist**: Ensure the agreement includes precise arrival time, breakdown window, overtime hourly rates, and weather contingency clauses.
- **Deposit Milestones**: Standard terms are 25-33% deposit at signing, with remaining balances due 7-14 days prior to event date.
- **Liability Insurance**: Require vendors to furnish a Certificate of Insurance (COI) naming the venue as additional insured.`;
    }

    const baseConcept = IdeaSynthesizer.getConcepts(type)[0];
    return `### ✨ Curated Creative Vision for Your ${type.toUpperCase()}
**Theme Concept**: *${baseConcept.themeTitle}*
*${baseConcept.tagline}*

- **Aesthetic**: ${baseConcept.aestheticDescription}
- **Recommended Signature Sip**: ${baseConcept.signatureMenu.cocktailOrBeverage}
- **Featured Activity**: ${baseConcept.highlightActivities[0]}

Would you like me to refine the budget breakdown, customize the timeline milestones, or craft bespoke invitation wording?`;
  }
}

export const geminiService = new GeminiService();
