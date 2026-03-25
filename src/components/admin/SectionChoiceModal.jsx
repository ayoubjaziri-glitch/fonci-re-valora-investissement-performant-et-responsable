import React from 'react';
import { X, Sparkles, PenLine } from 'lucide-react';

export default function SectionChoiceModal({ pageLabel, onChooseAI, onChooseManual, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-[#1A3A52] text-lg">Ajouter une section</h3>
            <p className="text-xs text-slate-400 mt-0.5">Page : {pageLabel}</p>
          </div>
          <button onClick={onCancel} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Choix */}
        <div className="p-6 grid grid-cols-2 gap-4">
          {/* IA */}
          <button
            onClick={onChooseAI}
            className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-[#C9A961]/30 hover:border-[#C9A961] bg-gradient-to-b from-[#C9A961]/5 to-transparent hover:from-[#C9A961]/10 transition-all text-center"
          >
            <div className="w-14 h-14 bg-[#C9A961]/10 group-hover:bg-[#C9A961]/20 rounded-2xl flex items-center justify-center transition-colors">
              <Sparkles className="h-7 w-7 text-[#C9A961]" />
            </div>
            <div>
              <p className="font-semibold text-[#1A3A52] mb-1">Avec l'IA</p>
              <p className="text-xs text-slate-500 leading-relaxed">Décrivez ce que vous voulez, l'IA rédige tout</p>
            </div>
            <span className="absolute top-3 right-3 text-[9px] bg-[#C9A961] text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">Recommandé</span>
          </button>

          {/* Manuel */}
          <button
            onClick={onChooseManual}
            className="group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-slate-200 hover:border-[#1A3A52] bg-gradient-to-b from-slate-50 to-transparent hover:from-slate-100/50 transition-all text-center"
          >
            <div className="w-14 h-14 bg-slate-100 group-hover:bg-[#1A3A52]/10 rounded-2xl flex items-center justify-center transition-colors">
              <PenLine className="h-7 w-7 text-slate-500 group-hover:text-[#1A3A52] transition-colors" />
            </div>
            <div>
              <p className="font-semibold text-[#1A3A52] mb-1">Manuellement</p>
              <p className="text-xs text-slate-500 leading-relaxed">Choisissez un style et rédigez vous-même</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}