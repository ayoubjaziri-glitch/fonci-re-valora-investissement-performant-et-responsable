import React from 'react';

// Les 6 templates disponibles avec aperçu visuel
export const SECTION_STYLES = [
  {
    id: 'texte',
    label: 'Texte centré',
    description: 'Titre + paragraphe centré, fond blanc',
    preview: (
      <div className="bg-white rounded-lg p-3 border border-slate-100 h-20 flex flex-col items-center justify-center gap-1">
        <div className="h-2 w-16 bg-[#C9A961] rounded mb-1" />
        <div className="h-1.5 w-24 bg-slate-200 rounded" />
        <div className="h-1.5 w-20 bg-slate-200 rounded" />
      </div>
    ),
  },
  {
    id: 'texte_image',
    label: 'Texte + Image',
    description: 'Texte à gauche, image à droite (ou inversé)',
    preview: (
      <div className="bg-white rounded-lg p-3 border border-slate-100 h-20 flex items-center gap-2">
        <div className="flex-1 flex flex-col gap-1">
          <div className="h-1.5 w-14 bg-[#C9A961] rounded" />
          <div className="h-1.5 w-12 bg-slate-200 rounded" />
          <div className="h-1.5 w-10 bg-slate-200 rounded" />
        </div>
        <div className="w-10 h-12 bg-slate-200 rounded" />
      </div>
    ),
  },
  {
    id: 'chiffres',
    label: 'Chiffres clés',
    description: 'Grille de métriques / KPIs sur fond sombre',
    preview: (
      <div className="bg-[#1A3A52] rounded-lg p-3 h-20 flex items-center justify-around gap-1">
        {[1,2,3].map(i => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="h-3 w-7 bg-[#C9A961] rounded" />
            <div className="h-1 w-8 bg-white/30 rounded" />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'cta',
    label: 'Call-to-action',
    description: 'Bande dorée avec titre et bouton',
    preview: (
      <div className="bg-[#C9A961] rounded-lg p-3 h-20 flex flex-col items-center justify-center gap-2">
        <div className="h-2 w-20 bg-[#1A3A52]/60 rounded" />
        <div className="h-5 w-16 bg-[#1A3A52] rounded-full" />
      </div>
    ),
  },
  {
    id: 'temoignage',
    label: 'Témoignage',
    description: 'Citation italique avec auteur et rôle',
    preview: (
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 h-20 flex flex-col justify-center gap-1">
        <div className="h-1 w-5 bg-[#C9A961] rounded mb-1" />
        <div className="h-1.5 w-20 bg-slate-300 rounded" />
        <div className="h-1.5 w-16 bg-slate-300 rounded" />
        <div className="flex items-center gap-1 mt-1">
          <div className="w-4 h-4 rounded-full bg-[#1A3A52]" />
          <div className="h-1 w-12 bg-slate-200 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: 'liste',
    label: 'Liste à puces',
    description: 'Liste de points clés avec icônes dorées',
    preview: (
      <div className="bg-white rounded-lg p-3 border border-slate-100 h-20 flex flex-col justify-center gap-1.5">
        {[1,2,3].map(i => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#C9A961] flex-shrink-0" />
            <div className="h-1.5 bg-slate-200 rounded flex-1" />
          </div>
        ))}
      </div>
    ),
  },
];

export default function SectionStylePicker({ value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 block mb-3">Style de la section</label>
      <div className="grid grid-cols-3 gap-3">
        {SECTION_STYLES.map(style => (
          <button
            key={style.id}
            type="button"
            onClick={() => onChange(style.id)}
            className={`rounded-xl overflow-hidden border-2 transition-all text-left ${
              value === style.id
                ? 'border-[#C9A961] shadow-md shadow-[#C9A961]/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {style.preview}
            <div className="px-2 py-1.5 bg-white border-t border-slate-100">
              <p className="text-xs font-semibold text-[#1A3A52] truncate">{style.label}</p>
              <p className="text-[10px] text-slate-400 truncate">{style.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}