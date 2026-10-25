/**
 * @file PlanAura Gemini Generative AI Service
 * @description Interfaces with Google Gemini 2.5 Flash for conversational planning and bespoke idea generation.
 * @module server/services/geminiService
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';
import { planCache } from './cacheService.js';
import { EventCategory } from '../modules/budget/budgetEngine.js';
import {
  AURA_COPILOT_SYSTEM_PROMPT,
  buildGroundingContext,
  synthesizeHeuristicAdvice,
} from '../modules/ai/promptTemplates.js';
import { Logger } from '../utils/logger.js';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

export interface AIServiceStatus {
  isAvailable: boolean;
  model: string;
  mode: string;
}

/**
 * Service encapsulating Google Gemini 2.5 Flash API calls with caching and deterministic fallbacks.
 */
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
        Logger.warn(
          'Could not initialize GoogleGenerativeAI SDK, offline mode activated',
          undefined,
          { error: err }
        );
        this.isAvailable = false;
      }
    } else {
      this.isAvailable = false;
    }
  }

  /**
   * Health and capability status of the AI layer.
   * @returns Health status object indicating model and operational mode
   */
  public getStatus(): AIServiceStatus {
    return {
      isAvailable: this.isAvailable,
      model: 'gemini-2.5-flash',
      mode: this.isAvailable ? 'Cloud Gemini Live' : 'Offline Heuristic Engine (Active)',
    };
  }

  /**
   * Generates a conversational planning recommendation from user prompt and context.
   * @param prompt - Inbound planning question or command
   * @param history - Conversation message history
   * @param eventContext - Optional event categorization and budget figures
   * @returns Generated Markdown response text
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
          systemInstruction: AURA_COPILOT_SYSTEM_PROMPT,
        });

        const contextPrefix = buildGroundingContext(eventContext);

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
        Logger.warn(
          'Live call failed or timed out, falling back to heuristic assistant',
          undefined,
          { error: err }
        );
      }
    }

    // High-fidelity fallback heuristic planner
    const response = synthesizeHeuristicAdvice(prompt, eventContext);
    planCache.set(cacheKey, response);
    return response;
  }
}

export const geminiService = new GeminiService();
