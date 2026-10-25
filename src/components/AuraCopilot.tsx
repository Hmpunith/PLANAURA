import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, RefreshCw } from 'lucide-react';
import { ApiService } from '../services/apiService';
import { EventBlueprint } from '../types';

interface AuraCopilotProps {
  blueprint: EventBlueprint;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

const STARTER_PROMPTS = [
  'How should I allocate my budget between catering and photography?',
  'Generate an hour-by-hour day-of timeline for my celebration',
  'What contracts and vendor clauses must I insist on before signing?',
  'Suggest 3 creative signature cocktail and appetizer pairings',
];

export const AuraCopilot: React.FC<AuraCopilotProps> = ({ blueprint }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'model',
      content: `Hello! I am **Aura**, your GenAI Planning Director. I am actively analyzing your **${blueprint.eventType.toUpperCase()}** (${blueprint.eventName}) with an allocated budget of **${blueprint.currency} ${blueprint.budget.totalBudget.toLocaleString()}** for **${blueprint.guestCount} guests**.\n\nAsk me anything about budgets, timeline sequencing, vendor negotiations, or creative themes!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || isLoading) {
      return;
    }

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        parts: m.content,
      }));

      const res = await ApiService.sendChat(prompt, history, {
        eventType: blueprint.eventType,
        budget: blueprint.budget.totalBudget,
        guestCount: blueprint.guestCount,
      });

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'model',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Please check your connection and try again.';
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          content: `⚠️ **Unable to complete request**: ${errorMessage}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="tabpanel"
      id="panel-copilot"
      aria-labelledby="tab-copilot"
      className="flex flex-col h-[calc(100vh-12rem)] max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-[#111726]/70 shadow-2xl overflow-hidden backdrop-blur-xl"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Bot className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Aura GenAI Copilot</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Grounding Active
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Context: {blueprint.eventType.toUpperCase()} • {blueprint.guestCount} Guests •{' '}
              {blueprint.currency} {blueprint.budget.totalBudget.toLocaleString()}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setMessages([
              {
                id: `reset-${Date.now()}`,
                role: 'model',
                content: `Chat session refreshed. How can I assist with your **${blueprint.eventType}**?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors"
          title="Reset conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Message Stream */}
      <div
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((m) => {
          const isAi = m.role === 'model';
          return (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-1">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md ${
                  isAi
                    ? 'bg-slate-900/90 text-slate-200 border border-slate-800 prose-invert'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <div
                  className={`text-[10px] mt-1.5 flex ${
                    isAi ? 'text-slate-500' : 'text-slate-800 justify-end'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>

              {!isAi && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                  <User className="w-4 h-4" aria-hidden="true" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="bg-slate-900/80 rounded-2xl px-4 py-3 text-xs text-amber-300 border border-slate-800 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Aura is calculating recommendations...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Prompt Suggestions */}
      <div className="px-4 sm:px-6 py-2 border-t border-slate-800/80 bg-slate-900/40">
        <p className="text-[11px] font-semibold text-slate-400 mb-1.5">Suggested Prompts:</p>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {STARTER_PROMPTS.map((promptText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(promptText)}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700/60 whitespace-nowrap transition-colors"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center space-x-3"
      >
        <label htmlFor="copilot-input" className="sr-only">
          Ask Aura a planning question
        </label>
        <input
          id="copilot-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${blueprint.eventType} budgets, vendor contracts, timelines...`}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2 transition-all"
          aria-label="Send message"
        >
          <span>Send</span>
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
};
