import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Calendar, User, Flag, MoreHorizontal, Trash2, CheckSquare } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';

const PRIORITE_DOT = {
  'Urgente': 'bg-red-500',
  'Haute': 'bg-orange-500',
  'Moyenne': 'bg-yellow-400',
  'Basse': 'bg-slate-300',
};

const STATUT_COLORS = {
  'A faire': 'bg-slate-100 text-slate-600',
  'En cours': 'bg-blue-100 text-blue-700',
  'En révision': 'bg-purple-100 text-purple-700',
  'Terminé': 'bg-emerald-100 text-emerald-700',
  'Bloqué': 'bg-red-100 text-red-700',
};

function parseJSON(str) {
  try { return JSON.parse(str || '[]'); } catch { return []; }
}

function TacheLigne({ tache, onClick, onDelete, level = 0 }) {
  const qc = useQueryClient();
  const sousTaches = parseJSON(tache.sous_taches);
  const faitCount = sousTaches.filter(s => s.fait).length;
  const isOverdue = tache.date_echeance && new Date(tache.date_echeance) < new Date() && tache.statut !== 'Terminé';

  const toggleTermine = async (e) => {
    e.stopPropagation();
    await base44.entities.Tache.update(tache.id, { statut: tache.statut === 'Terminé' ? 'A faire' : 'Terminé' });
    qc.invalidateQueries({ queryKey: ['taches'] });
  };

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer group border-b border-slate-100 transition-colors"
      style={{ paddingLeft: level * 24 + 16 }}
      onClick={onClick}
    >
      {/* Checkbox */}
      <button onClick={toggleTermine}
        className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${tache.statut === 'Terminé' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-emerald-400'}`}
        style={{ minWidth: 16 }}>
        {tache.statut === 'Terminé' && <span className="text-[10px]">✓</span>}
      </button>

      {/* Jalon */}
      {tache.est_jalon && <span className="text-amber-500 text-xs flex-shrink-0">◆</span>}

      {/* Titre */}
      <span className={`flex-1 text-sm font-medium truncate ${tache.statut === 'Terminé' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
        {tache.titre}
      </span>

      {/* Sous-tâches count */}
      {sousTaches.length > 0 && (
        <span className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0">
          <CheckSquare className="h-3 w-3" />{faitCount}/{sousTaches.length}
        </span>
      )}

      {/* Assigné */}
      {tache.assigne_a && (
        <div className="w-6 h-6 rounded-full bg-[#1A3A52] text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0">
          {tache.assigne_a.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Priorité */}
      {tache.priorite && (
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITE_DOT[tache.priorite]}`} />
      )}

      {/* Statut */}
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 hidden md:inline ${STATUT_COLORS[tache.statut]}`}>
        {tache.statut}
      </span>

      {/* Échéance */}
      {tache.date_echeance && (
        <span className={`text-xs flex-shrink-0 flex items-center gap-1 ${isOverdue ? 'text-red-500 font-semibold' : 'text-slate-400'}`}>
          <Calendar className="h-3 w-3" />
          {new Date(tache.date_echeance).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
        </span>
      )}

      {/* Delete */}
      <button onClick={(e) => { e.stopPropagation(); onDelete(tache.id); }}
        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all flex-shrink-0">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function SectionGroup({ titre, taches, onTacheClick, onDelete }) {
  const [open, setOpen] = useState(true);
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [newTitre, setNewTitre] = useState('');

  const handleAdd = async () => {
    if (!newTitre.trim()) return;
    await base44.entities.Tache.create({ titre: newTitre.trim(), statut: 'A faire', section: titre });
    qc.invalidateQueries({ queryKey: ['taches'] });
    setNewTitre('');
    setAdding(false);
  };

  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-slate-50 border-b border-slate-200 group"
        onClick={() => setOpen(o => !o)}>
        {open ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
        <span className="text-sm font-bold text-slate-700">{titre}</span>
        <span className="text-xs text-slate-400">{taches.length}</span>
      </div>
      {open && (
        <>
          {taches.map(t => (
            <TacheLigne key={t.id} tache={t} onClick={() => onTacheClick(t)} onDelete={onDelete} />
          ))}
          {adding ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-b border-slate-100">
              <div className="w-4 h-4 rounded border-2 border-slate-300 flex-shrink-0" />
              <input autoFocus
                className="flex-1 text-sm border-0 focus:outline-none bg-transparent"
                placeholder="Nom de la tâche…"
                value={newTitre}
                onChange={e => setNewTitre(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false); }}
              />
              <button onClick={handleAdd} className="text-xs bg-[#1A3A52] text-white px-3 py-1 rounded-lg">Ajouter</button>
              <button onClick={() => setAdding(false)} className="text-xs text-slate-400">✕</button>
            </div>
          ) : (
            <button onClick={() => setAdding(true)}
              className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-600 text-sm hover:bg-slate-50 w-full text-left transition-colors">
              <Plus className="h-3.5 w-3.5" /> Ajouter une tâche
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default function ListView({ taches, onTacheClick, onDelete }) {
  const qc = useQueryClient();
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');

  const sections = {};
  taches.forEach(t => {
    const s = t.section || 'Sans section';
    if (!sections[s]) sections[s] = [];
    sections[s].push(t);
  });

  const handleAddSection = async () => {
    const name = newSectionName.trim();
    if (!name) return;
    // Créer une tâche placeholder dans la nouvelle section pour l'initialiser
    await base44.entities.Tache.create({ titre: 'Nouvelle tâche', statut: 'A faire', section: name });
    qc.invalidateQueries({ queryKey: ['taches'] });
    setNewSectionName('');
    setAddingSection(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header colonnes */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wide">
        <span className="flex-1">Tâche</span>
        <span className="hidden md:block w-20 text-center">Assigné</span>
        <span className="hidden md:block w-20 text-center">Priorité</span>
        <span className="hidden md:block w-24 text-center">Statut</span>
        <span className="hidden md:block w-24 text-center">Échéance</span>
        <span className="w-6" />
      </div>

      {Object.entries(sections).map(([s, st]) => (
        <SectionGroup key={s} titre={s} taches={st} onTacheClick={onTacheClick} onDelete={onDelete} />
      ))}

      {taches.length === 0 && (
        <div className="py-10 text-center text-slate-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium">Aucune tâche pour le moment</p>
          <p className="text-sm mt-1">Créez votre première tâche ou ajoutez une section</p>
        </div>
      )}

      {/* Ajouter une section */}
      <div className="border-t border-slate-100 px-4 py-2">
        {addingSection ? (
          <div className="flex items-center gap-2">
            <input autoFocus
              className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#C9A961]"
              placeholder="Nom de la section…"
              value={newSectionName}
              onChange={e => setNewSectionName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddSection(); if (e.key === 'Escape') { setAddingSection(false); setNewSectionName(''); } }}
            />
            <button onClick={handleAddSection} className="text-xs bg-[#1A3A52] text-white px-3 py-1.5 rounded-lg">Créer</button>
            <button onClick={() => { setAddingSection(false); setNewSectionName(''); }} className="text-xs text-slate-400">✕</button>
          </div>
        ) : (
          <button onClick={() => setAddingSection(true)}
            className="flex items-center gap-2 text-slate-400 hover:text-[#1A3A52] text-sm py-1 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Ajouter une section
          </button>
        )}
      </div>
    </div>
  );
}