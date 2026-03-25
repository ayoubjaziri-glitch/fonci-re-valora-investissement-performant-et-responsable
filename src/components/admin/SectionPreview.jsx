import React from 'react';
import { CheckCircle2, Quote, ArrowRight } from 'lucide-react';

/**
 * Aperçu fidèle à la charte graphique Valora pour une section
 */
export default function SectionPreview({ section }) {
  const { titre, sous_titre, contenu, type_section, image_url } = section;

  if (!titre && !contenu) return null;

  const lignes = contenu
    ? contenu.split('\n').filter(l => l.trim())
    : [];

  switch (type_section) {
    case 'texte':
      return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-8 py-8 text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-0.5 bg-[#C9A961]" />
              {sous_titre && <span className="text-[#C9A961] text-xs font-medium uppercase tracking-widest">{sous_titre}</span>}
              <div className="w-8 h-0.5 bg-[#C9A961]" />
            </div>
            {titre && <h3 className="text-xl font-serif text-[#1A3A52] mb-3">{titre}</h3>}
            {contenu && <p className="text-sm text-slate-600 leading-relaxed">{contenu}</p>}
          </div>
        </div>
      );

    case 'texte_image':
      return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-2 gap-0">
            <div className="px-6 py-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-0.5 bg-[#C9A961]" />
                {sous_titre && <span className="text-[#C9A961] text-xs font-medium uppercase tracking-widest">{sous_titre}</span>}
              </div>
              {titre && <h3 className="text-lg font-serif text-[#1A3A52] mb-2">{titre}</h3>}
              {contenu && <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">{contenu}</p>}
            </div>
            <div className="bg-slate-100 h-36 overflow-hidden">
              {image_url
                ? <img src={image_url} alt={titre} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                : <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">Image</div>
              }
            </div>
          </div>
        </div>
      );

    case 'chiffres':
      return (
        <div className="bg-[#1A3A52] rounded-xl overflow-hidden">
          <div className="px-6 py-6 text-center">
            {titre && <h3 className="text-base font-serif text-white mb-4">{titre}</h3>}
            <div className="grid grid-cols-3 gap-4">
              {lignes.slice(0, 3).map((l, i) => {
                const parts = l.split('|');
                return (
                  <div key={i} className="bg-white/10 rounded-xl p-3">
                    <p className="text-[#C9A961] text-lg font-bold">{parts[0]?.trim()}</p>
                    <p className="text-white/60 text-xs mt-0.5">{parts[1]?.trim() || ''}</p>
                  </div>
                );
              })}
              {lignes.length === 0 && [1,2,3].map(i => (
                <div key={i} className="bg-white/10 rounded-xl p-3">
                  <p className="text-[#C9A961] text-lg font-bold">—</p>
                  <p className="text-white/60 text-xs mt-0.5">Chiffre {i}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'cta':
      return (
        <div className="bg-[#C9A961] rounded-xl overflow-hidden">
          <div className="px-8 py-6 text-center">
            {titre && <h3 className="text-lg font-serif text-[#1A3A52] mb-2">{titre}</h3>}
            {sous_titre && <p className="text-[#1A3A52]/80 text-sm mb-4">{sous_titre}</p>}
            <button className="bg-[#1A3A52] text-white px-6 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2">
              Entrer en relation <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      );

    case 'temoignage':
      return (
        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-6 relative">
            <Quote className="h-8 w-8 text-[#C9A961]/20 absolute top-4 right-4" />
            {contenu && <p className="text-sm text-slate-700 italic leading-relaxed mb-4">"{contenu}"</p>}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1A3A52] rounded-full flex items-center justify-center">
                <span className="text-[#C9A961] text-sm font-bold">{titre?.charAt(0) || 'A'}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A3A52]">{titre}</p>
                {sous_titre && <p className="text-xs text-slate-500">{sous_titre}</p>}
              </div>
            </div>
          </div>
        </div>
      );

    case 'liste':
      return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-6">
            {titre && <h3 className="text-lg font-serif text-[#1A3A52] mb-2">{titre}</h3>}
            {sous_titre && <p className="text-xs text-slate-500 mb-4">{sous_titre}</p>}
            <ul className="space-y-2">
              {lignes.slice(0, 5).map((l, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#C9A961] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{l.replace(/^[-•*]\s*/, '')}</span>
                </li>
              ))}
              {lignes.length === 0 && (
                <li className="text-xs text-slate-300 italic">Les points s'afficheront ici (un par ligne dans le contenu)</li>
              )}
            </ul>
          </div>
        </div>
      );

    default:
      return null;
  }
}