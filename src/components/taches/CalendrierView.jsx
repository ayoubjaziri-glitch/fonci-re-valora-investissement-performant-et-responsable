import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const STATUT_COLORS = {
  'A faire': '#94a3b8',
  'En cours': '#3b82f6',
  'En révision': '#a855f7',
  'Terminé': '#10b981',
  'Bloqué': '#ef4444',
};

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MOIS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export default function CalendrierView({ taches, onTacheClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Lundi = 0
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const totalCells = Math.ceil((startDow + lastDay.getDate()) / 7) * 7;
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const day = i - startDow + 1;
    return day >= 1 && day <= lastDay.getDate() ? new Date(year, month, day) : null;
  });

  const tachesByDate = {};
  taches.forEach(t => {
    if (t.date_echeance) {
      const key = t.date_echeance.slice(0, 10);
      if (!tachesByDate[key]) tachesByDate[key] = [];
      tachesByDate[key].push(t);
    }
  });

  const today = new Date();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-100">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="text-lg font-bold text-[#1A3A52]">{MOIS_FR[month]} {year}</h3>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-100">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Jours header */}
      <div className="grid grid-cols-7 border-b border-slate-200">
        {JOURS.map(j => (
          <div key={j} className="py-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide">
            {j}
          </div>
        ))}
      </div>

      {/* Grille */}
      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="min-h-[100px] bg-slate-50 border-b border-r border-slate-100" />;

          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          const dayTaches = tachesByDate[key] || [];
          const isToday = d.toDateString() === today.toDateString();
          const isWeekend = d.getDay() === 0 || d.getDay() === 6;

          return (
            <div key={i} className={`min-h-[100px] border-b border-r border-slate-100 p-1.5 ${isWeekend ? 'bg-slate-50/60' : 'bg-white'}`}>
              <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold mb-1 ${isToday ? 'bg-[#1A3A52] text-white' : 'text-slate-600'}`}>
                {d.getDate()}
              </div>
              <div className="space-y-0.5">
                {dayTaches.slice(0, 3).map(t => (
                  <div key={t.id}
                    onClick={() => onTacheClick(t)}
                    className="rounded px-1.5 py-0.5 text-[11px] font-medium text-white cursor-pointer hover:opacity-80 truncate transition-opacity"
                    style={{ backgroundColor: STATUT_COLORS[t.statut] || '#C9A961' }}
                  >
                    {t.est_jalon && '◆ '}{t.titre}
                  </div>
                ))}
                {dayTaches.length > 3 && (
                  <div className="text-[10px] text-slate-400 px-1">+{dayTaches.length - 3} autres</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}