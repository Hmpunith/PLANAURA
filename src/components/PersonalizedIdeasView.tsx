import React, { useState } from 'react';
import { Lightbulb, Palette, Utensils, Sparkles, Copy, Check, MessageSquare } from 'lucide-react';
import { IdeaConcept } from '../types';

interface PersonalizedIdeasViewProps {
  ideasVault: IdeaConcept[];
  bespokeConcept: IdeaConcept;
}

export const PersonalizedIdeasView: React.FC<PersonalizedIdeasViewProps> = ({
  ideasVault,
  bespokeConcept,
}) => {
  const [selectedConcept, setSelectedConcept] = useState<IdeaConcept>(
    bespokeConcept || ideasVault[0]
  );
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedInvite, setCopiedInvite] = useState<boolean>(false);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(selectedConcept.invitationWordingDraft);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  return (
    <div
      role="tabpanel"
      id="panel-ideas"
      aria-labelledby="tab-ideas"
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Lightbulb className="w-4 h-4" aria-hidden="true" />
              <span>AI Creative Synthesizer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Personalized Concepts, Palettes & Menus
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Bespoke themes, harmonious chromatic color stories, signature dining menus, and invitation drafts.
            </p>
          </div>
        </div>
      </div>

      {/* Concept Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedConcept(bespokeConcept)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            selectedConcept.id === bespokeConcept.id
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Bespoke Synthesis</span>
        </button>

        {ideasVault.map((concept) => (
          <button
            key={concept.id}
            type="button"
            onClick={() => setSelectedConcept(concept)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedConcept.id === concept.id
                ? 'bg-slate-800 text-amber-400 border border-slate-700 shadow-inner'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {concept.themeTitle}
          </button>
        ))}
      </div>

      {/* Selected Concept Hero Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#111726]/80 border border-slate-800 backdrop-blur-md space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
            Featured Celebration Concept
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
            {selectedConcept.themeTitle}
          </h3>
          <p className="text-base text-amber-300/90 italic mt-1 font-serif">
            "{selectedConcept.tagline}"
          </p>
          <p className="text-sm text-slate-300 mt-3 leading-relaxed">
            {selectedConcept.aestheticDescription}
          </p>
        </div>

        {/* Color Palette Swatches */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2 mb-3">
            <Palette className="w-4 h-4 text-amber-400" aria-hidden="true" />
            <span>Harmonious Chromatic Palette</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {selectedConcept.colorPalette.map((color, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleCopyHex(color.hex)}
                className="group p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center space-x-3 text-left hover:border-slate-700 transition-colors"
                title="Click to copy HEX code"
              >
                <div
                  className="w-10 h-10 rounded-lg shadow-inner border border-white/10 shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-200 truncate">{color.name}</p>
                  <p className="text-[11px] font-mono text-slate-400 group-hover:text-amber-400 flex items-center space-x-1">
                    <span>{color.hex}</span>
                    {copiedHex === color.hex ? (
                      <Check className="w-3 h-3 text-emerald-400 inline" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Signature Culinary & Beverage Pairing */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <Utensils className="w-4 h-4 text-rose-400" aria-hidden="true" />
              <span>Signature Culinary Experience</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">Signature Sip</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {selectedConcept.signatureMenu.cocktailOrBeverage}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-rose-400 block">Appetizer Course</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {selectedConcept.signatureMenu.appetizer}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-teal-400 block">Main Entrée</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {selectedConcept.signatureMenu.mainCourse}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-violet-400 block">Confection Dessert</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {selectedConcept.signatureMenu.dessert}
                </span>
              </div>
            </div>
          </div>

          {/* Highlight Guest Activities */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>Immersive Guest Activities</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              {selectedConcept.highlightActivities.map((act, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start space-x-3"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 leading-relaxed">{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Invitation Wording Card */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>Bespoke Invitation Wording Draft</span>
            </h4>
            <button
              type="button"
              onClick={handleCopyInvite}
              className="flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copiedInvite ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-serif italic p-4 bg-slate-900/80 rounded-xl border border-slate-800/80 leading-relaxed">
            "{selectedConcept.invitationWordingDraft}"
          </p>
        </div>
      </div>
    </div>
  );
};
