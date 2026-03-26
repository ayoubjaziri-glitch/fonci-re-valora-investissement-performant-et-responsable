import React from 'react';

/**
 * Définition des emplacements disponibles par page.
 * Chaque slot correspond à une plage d'ordre dans DynamicSections.
 * L'ordre choisi est le milieu de la plage pour garantir le bon affichage.
 */
export const PAGE_SLOTS = {
  accueil: [
    { label: 'Après le Hero',           ordre: 50,  range: [10, 100] },
    { label: 'Après "Qui sommes-nous"', ordre: 150, range: [100, 200] },
    { label: 'Après Durabilité',        ordre: 270, range: [200, 350] },
    { label: 'Après Atouts',            ordre: 420, range: [350, 500] },
    { label: 'Après Nos Services',      ordre: 550, range: [500, 600] },
    { label: 'Après Équipe',            ordre: 650, range: [600, 700] },
    { label: 'Après Réalisations',      ordre: 750, range: [700, 800] },
    { label: 'Avant le CTA final',      ordre: 850, range: [800, 999] },
  ],
  strategie: [
    { label: 'Après le Hero',    ordre: 50,  range: [10, 100] },
    { label: 'Au milieu',        ordre: 300, range: [100, 500] },
    { label: 'Avant le CTA',     ordre: 700, range: [500, 999] },
  ],
  missions: [
    { label: 'Après le Hero',    ordre: 50,  range: [10, 100] },
    { label: 'Au milieu',        ordre: 300, range: [100, 500] },
    { label: 'Avant le CTA',     ordre: 700, range: [500, 999] },
  ],
  equipe: [
    { label: 'Après le Hero',    ordre: 50,  range: [10, 100] },
    { label: 'Au milieu',        ordre: 300, range: [100, 500] },
    { label: 'Avant le CTA',     ordre: 700, range: [500, 999] },
  ],
  ecosysteme: [
    { label: 'Après le Hero',    ordre: 50,  range: [10, 100] },
    { label: 'Au milieu',        ordre: 300, range: [100, 500] },
    { label: 'Avant le CTA',     ordre: 700, range: [500, 999] },
  ],
  durabilite: [
    { label: 'Après le Hero',    ordre: 50,  range: [10, 100] },
    { label: 'Au milieu',        ordre: 300, range: [100, 500] },
    { label: 'Avant le CTA',     ordre: 700, range: [500, 999] },
  ],
  nos_biens: [
    { label: 'Après le Hero',    ordre: 50,  range: [10, 100] },
    { label: 'Au milieu',        ordre: 300, range: [100, 500] },
    { label: 'Avant le CTA',     ordre: 700, range: [500, 999] },
  ],
};

/**
 * Composant de sélection de position.
 * Affiche des boutons lisibles pour choisir où insérer la section dans la page.
 */
export default function PositionPicker({ page, value, onChange, existingSections = [] }) {
  const slots = PAGE_SLOTS[page] || PAGE_SLOTS.accueil;

  // Compte les sections existantes dans chaque slot
  const countInSlot = (slot) =>
    existingSections.filter(s => s.ordre >= slot.range[0] && s.ordre < slot.range[1]).length;

  return (
    <div>
      <label className="text-sm font-medium text-slate-700 block mb-2">
        Où afficher cette section dans la page ?
      </label>
      <div className="grid grid-cols-1 gap-2">
        {slots.map((slot, i) => {
          const count = countInSlot(slot);
          const isSelected = value >= slot.range[0] && value < slot.range[1];
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(slot.ordre)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                isSelected
                  ? 'border-[#C9A961] bg-[#C9A961]/10 text-[#1A3A52]'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isSelected ? 'bg-[#C9A961]' : 'bg-slate-300'}`} />
                <span className="text-sm font-medium">{slot.label}</span>
              </div>
              {count > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  {count} section{count > 1 ? 's' : ''} déjà là
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-slate-400 mt-2">Ordre interne : {value}</p>
    </div>
  );
}