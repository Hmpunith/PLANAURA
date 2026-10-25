/**
 * @file PlanAura AI Prompt Templates & System Personas
 * @description Centralized prompt templates, domain instructions, and heuristic synthesis logic.
 * @module server/modules/ai/promptTemplates
 */

import { EventCategory } from '../budget/budgetEngine.js';
import { IdeaSynthesizer } from '../ideas/ideaSynthesizer.js';

/**
 * System instruction persona for Google Gemini 2.5 Flash.
 */
export const AURA_COPILOT_SYSTEM_PROMPT = `You are Aura, an elite, warm, and highly structured AI Celebration & Event Planning Director.
You specialize in weddings, milestone birthdays, and community gatherings.
Provide organized, actionable advice formatted in Markdown with clear headings, bullet points, budget calculations, and timeline recommendations.
Always maintain an encouraging, celebratory tone.`;

/**
 * Constructs contextual grounding prefix for Gemini prompts.
 * @param eventContext - Active event metadata
 * @returns Grounding string prefix
 */
export function buildGroundingContext(eventContext?: {
  eventType: EventCategory;
  budget: number;
  guestCount: number;
}): string {
  if (!eventContext) {
    return '';
  }
  return `[Current Context: Event=${eventContext.eventType}, Budget=$${eventContext.budget}, Guests=${eventContext.guestCount}]\n\n`;
}

/**
 * High-fidelity fallback heuristic planner when upstream AI API is unreachable or offline.
 * @param prompt - Inbound user question
 * @param eventContext - Active event metadata
 * @returns Deterministic Markdown response formatted with semantic headings and bullets
 */
export function synthesizeHeuristicAdvice(
  prompt: string,
  eventContext?: { eventType: EventCategory; budget: number; guestCount: number }
): string {
  const type: EventCategory = eventContext?.eventType || 'wedding';
  const budget = eventContext?.budget || 10000;
  const guests = eventContext?.guestCount || 50;

  const lower = prompt.toLowerCase();

  if (
    lower.includes('budget') ||
    lower.includes('cost') ||
    lower.includes('save') ||
    lower.includes('money') ||
    lower.includes('allocate')
  ) {
    return `### 💡 Strategic Budget Allocation for Your ${type.toUpperCase()}
With a targeted budget of **$${budget.toLocaleString()}** for **${guests} guests** (~$${Math.round(budget / Math.max(1, guests))} per guest):

- **45% Primary Venue & Catering**: $${Math.round(budget * 0.45).toLocaleString()}
- **15% Creative Production (Photo/Video/AV)**: $${Math.round(budget * 0.15).toLocaleString()}
- **12% Entertainment & Music**: $${Math.round(budget * 0.12).toLocaleString()}
- **10% Decor, Theming & Floral**: $${Math.round(budget * 0.1).toLocaleString()}
- **10% Logistics, Permits & Insurance**: $${Math.round(budget * 0.1).toLocaleString()}
- **8% Contingency Safety Reserve**: $${Math.round(budget * 0.08).toLocaleString()}

> 💡 **Cost-Saving Tip**: Consolidating ceremony and reception spaces can immediately shave 15-20% off transportation and double setup rental fees!`;
  }

  if (
    lower.includes('timeline') ||
    lower.includes('schedule') ||
    lower.includes('when') ||
    lower.includes('time') ||
    lower.includes('checklist')
  ) {
    return `### ⏱️ Phased Milestone Execution Schedule
Here is your strategic countdown roadmap:

1. **Phase 1 (6+ Months Out)**: Secure the venue anchor and establish your guest list cap.
2. **Phase 2 (3-6 Months Out)**: Book critical singular vendors (lead photographer, live DJ, caterer).
3. **Phase 3 (1-2 Months Out)**: Circulate invitations with firm RSVP deadlines and capture dietary needs.
4. **Phase 4 (Final 2 Weeks)**: Finalize the minute-by-minute Day-Of Run-of-Show and distributor call-sheets.

*Check the **Timeline & Run-of-Show** tab for your full interactive day-of schedule!*`;
  }

  if (
    lower.includes('vendor') ||
    lower.includes('hire') ||
    lower.includes('contract') ||
    lower.includes('clause') ||
    lower.includes('sign')
  ) {
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
