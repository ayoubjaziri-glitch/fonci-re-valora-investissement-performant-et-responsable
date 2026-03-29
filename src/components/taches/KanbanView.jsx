import React, { useState } from 'react';
import { Plus, MoreHorizontal, Calendar, User, Flag, CheckSquare } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';

const STATUTS = ['A faire', 'En cours', 'En révision', 'Terminé', 'Bloqué'];

const STATUT_COLORS = {
  'A faire': 'bg-slate-100 border-slate-200',
  'En cours': 'bg-blue-50 border-blue-200',
  'En révision': 'bg-purple-50 border-purple-200',
  'Terminé': 'bg-emerald-50 border-emerald-200',
  'Bloqué': 'bg-red-50 border-red-200',
};

const STATUT_HEADER = {
  'A faire': 'text-slate-600 bg-slate-100',
  'En cours': 'text-blue-700 bg-blue-100',
  'En révision': 'text-purple-700 bg-purple-100',
  'Terminé': 'text-emerald-700 bg-emerald-100',
  'Bloqué': 'text-red-700 bg-red-100',
};

const PRIORITE_DOT = {
  'Urgente': 'bg-red-500',
  'Haute': 'bg-orange-500',
  'Moyenne': 'bg-yellow-400',
  'Basse': 'bg-slate-300',
};

function parseJSON(str) {
  try { return JSON.parse(str || '[]'); } catch { return []; }
}

function TacheCard({ tache, onClick }) {
  const sousTaches = parseJSON(tache.sous_taches);
  const faitCount = sousTaches.filter(s => s.fait).length;
  const tags = (tache.tags || '').split(',').map(t => t.trim()).filter(Boolean);
  const isOverdue = tache.date_echeance && new Date(tache.date_echeance) < new Date() && tache.statut !== 'Terminé';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 p-3.5 cursor-pointer hover:shadow-md hover:border-[#C9A961]/40 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {tache.est_jalon && <span className="text-amber-500 text-xs mt-0.5 flex-shrink-0">◆</span>}
          <p className={`text-sm font-medium leading-snug ${tache.statut === 'Terminé' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
            {tache.titre}
          </p>
        </div>
        {tache.priorite && (
          <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${PRIORITE_DOT[tache.priorite] || 'bg-slate-300'}`} />
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.slice(0, 3).map((t, i) => (
            <span key={i} className="text-[10px] bg-[#C9A961]/10 text-[#8B6F1E] px-1.5 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          {sousTaches.length > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare className="h-3 w-3" />{faitCount}/{sousTaches.length}
            </span>
          )}
          {tache.date_echeance && (
            <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-semibold' : ''}`}>
              <Calendar className="h-3 w-3" />
              {new Date(tache.date_echeance).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
            </span>
          )}
        </div>
        {tache.assigne_a && (
          <div className="w-6 h-6 rounded-full bg-[#1A3A52] text-white text-[10px] flex items-center justify-center font-bold">
            {tache.assigne_a.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {tache.avancement > 0 && sousTaches.length === 0 && (
        <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${tache.avancement}%` }} />
        </div>
      )}
    </div>
  );
}

function AddTacheInline({ statut, projet, onAdd }) {
  const [active, setActive] = useState(false);
  const [titre, setTitre] = useState('');
  const qc = useQueryClient();

  const handleAdd = async () => {
    if (!titre.trim()) return;
    await base44.entities.Tache.create({ titre: titre.trim(), statut, projet: projet || '' });
    qc.invalidateQueries({ queryKey: ['taches'] });
    setTitre('');
    setActive(false);
  };

  if (!active) return (
    <button onClick={() => setActive(true)}
      className="w-full flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm py-2 px-1 rounded-lg hover:bg-slate-50 transition-colors">
      <Plus className="h-4 w-4" /> Ajouter une tâche
    </button>
  );

  return (
    <div className="bg-white rounded-xl border-2 border-[#C9A961] p-3">
      <input autoFocus
        className="w-full text-sm font-medium text-slate-800 border-0 focus:outline-none"
        placeholder="Nom de la tâche…"
        value={titre}
        onChange={e => setTitre(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setActive(false); }}
      />
      <div className="flex gap-2 mt-2">
        <button onClick={handleAdd} className="bg-[#1A3A52] text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-[#2A4A6F]">
          Ajouter
        </button>
        <button onClick={() => setActive(false)} className="text-slate-400 text-xs px-2 py-1.5 rounded-lg hover:bg-slate-100">
          Annuler
        </button>
      </div>
    </div>
  );
}

export default function KanbanView({ taches, projetFiltre, onTacheClick }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 items-start">
      {STATUTS.map(statut => {
        const col = taches.filter(t => t.statut === statut);
        return (
          <div key={statut} className="flex-shrink-0 w-72">
            <div className={`rounded-xl border ${STATUT_COLORS[statut]} p-1`}>
              {/* Header colonne */}
              <div className="flex items-center justify-between px-3 py-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUT_HEADER[statut]}`}>{statut}</span>
                  <span className="text-xs text-slate-400 font-medium">{col.length}</span>
                </div>
              </div>

              {/* Cards */}
              <div className="space-y-2 px-1 min-h-[50px]">
                {col.map(t => (
                  <TacheCard key={t.id} tache={t} onClick={() => onTacheClick(t)} />
                ))}
              </div>

              {/* Ajouter */}
              <div className="px-1 mt-2 pb-1">
                <AddTacheInline statut={statut} projet={projetFiltre} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}