import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const STATUT_COLORS = {
  'A faire': '#94a3b8',
  'En cours': '#3b82f6',
  'En révision': '#a855f7',
  'Terminé': '#10b981',
  'Bloqué': '#ef4444',
};

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function diffDays(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

function fmt(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

export default function GanttChart({ taches }) {
  const [offsetWeeks, setOffsetWeeks] = useState(0);
  const COLS = 28; // 4 semaines visibles

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + offsetWeeks * 7 - 7);
    return d;
  }, [offsetWeeks, today]);

  const days = useMemo(() => Array.from({ length: COLS }, (_, i) => addDays(startDate, i)), [startDate]);

  const tachesAvecDates = taches.filter(t => t.date_debut && t.date_echeance);

  if (tachesAvecDates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-4xl mb-3">📅</div>
        <p className="text-slate-500 font-medium">Aucune tâche avec des dates</p>
        <p className="text-slate-400 text-sm mt-1">Ajoutez des dates de début et d'échéance pour voir le Gantt</p>
      </div>
    );
  }

  const todayOffset = diffDays(startDate, today);

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setOffsetWeeks(o => o - 1)} className="p-2 rounded-lg hover:bg-slate-100 border border-slate-200">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-semibold text-[#1A3A52]">
          {fmt(startDate)} — {fmt(days[COLS - 1])}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setOffsetWeeks(0)} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-medium">
            Aujourd'hui
          </button>
          <button onClick={() => setOffsetWeeks(o => o + 1)} className="p-2 rounded-lg hover:bg-slate-100 border border-slate-200">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <div style={{ minWidth: `${200 + COLS * 36}px` }}>
          {/* Header jours */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            <div className="w-48 flex-shrink-0 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide border-r border-slate-200">
              Tâche
            </div>
            {days.map((d, i) => {
              const isToday = diffDays(d, today) === 0;
              const isWeekStart = d.getDay() === 1;
              const isSun = d.getDay() === 0;
              return (
                <div key={i}
                  style={{ width: 36 }}
                  className={`flex-shrink-0 flex flex-col items-center justify-center py-1 text-xs border-r border-slate-100
                    ${isToday ? 'bg-blue-50' : ''}
                    ${isSun ? 'bg-slate-100' : ''}
                  `}>
                  {isWeekStart && <span className="text-[10px] font-bold text-slate-400 uppercase">{d.toLocaleDateString('fr-FR', { month: 'short' })}</span>}
                  <span className={`font-medium ${isToday ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>{d.getDate()}</span>
                </div>
              );
            })}
          </div>

          {/* Lignes tâches */}
          {tachesAvecDates.map(tache => {
            const tStart = diffDays(startDate, new Date(tache.date_debut));
            const tEnd = diffDays(startDate, new Date(tache.date_echeance));
            const visible = tEnd >= 0 && tStart < COLS;
            const barStart = Math.max(0, tStart);
            const barEnd = Math.min(COLS - 1, tEnd);
            const barWidth = (barEnd - barStart + 1) * 36;
            const color = STATUT_COLORS[tache.statut] || '#C9A961';

            return (
              <div key={tache.id} className="flex items-center border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="w-48 flex-shrink-0 px-4 py-2.5 border-r border-slate-200">
                  <div className="flex items-center gap-2">
                    {tache.est_jalon && <span className="text-amber-500 text-xs">◆</span>}
                    <span className="text-sm text-slate-700 truncate font-medium">{tache.titre}</span>
                  </div>
                  {tache.assigne_a && <p className="text-xs text-slate-400 truncate mt-0.5">{tache.assigne_a}</p>}
                </div>
                <div className="flex relative" style={{ width: COLS * 36 }}>
                  {/* Ligne today */}
                  {todayOffset >= 0 && todayOffset < COLS && (
                    <div className="absolute top-0 bottom-0 w-px bg-blue-400 z-10 opacity-50"
                      style={{ left: todayOffset * 36 + 18 }} />
                  )}
                  {days.map((d, i) => (
                    <div key={i} style={{ width: 36 }}
                      className={`flex-shrink-0 h-10 border-r border-slate-100 ${d.getDay() === 0 ? 'bg-slate-50' : ''}`} />
                  ))}
                  {visible && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 rounded-full flex items-center px-2"
                      style={{
                        left: barStart * 36,
                        width: Math.max(barWidth, 24),
                        height: tache.est_jalon ? 14 : 20,
                        backgroundColor: color,
                        opacity: 0.9,
                      }}
                    >
                      {barWidth > 60 && (
                        <span className="text-white text-[10px] font-bold truncate">{tache.titre}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Légende */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-500 justify-center">
        {Object.entries(STATUT_COLORS).map(([s, c]) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />{s}
          </span>
        ))}
        <span className="flex items-center gap-1.5"><span className="text-amber-500">◆</span> Jalon</span>
      </div>
    </div>
  );
}