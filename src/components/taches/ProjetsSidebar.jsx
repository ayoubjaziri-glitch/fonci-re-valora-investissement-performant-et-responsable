import React, { useState } from 'react';
import { Plus, Folder, MoreHorizontal, Trash2, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';

const COULEURS = ['#C9A961', '#1A3A52', '#3b82f6', '#10b981', '#a855f7', '#ef4444', '#f59e0b', '#06b6d4'];

export default function ProjetsSidebar({ projets, projetActif, onSelectProjet, taches }) {
  const qc = useQueryClient();
  const [showNew, setShowNew] = useState(false);
  const [newNom, setNewNom] = useState('');
  const [newCouleur, setNewCouleur] = useState('#C9A961');

  const handleCreate = async () => {
    if (!newNom.trim()) return;
    await base44.entities.Projet.create({
      nom: newNom.trim(),
      couleur: newCouleur,
      statut: 'Actif',
      sections: JSON.stringify(['A faire', 'En cours', 'Terminé'])
    });
    qc.invalidateQueries({ queryKey: ['projets'] });
    setNewNom('');
    setShowNew(false);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Supprimer ce projet ?')) return;
    await base44.entities.Projet.delete(id);
    qc.invalidateQueries({ queryKey: ['projets'] });
    onSelectProjet(null);
  };

  return (
    <div className="w-56 flex-shrink-0 bg-[#0F2537] rounded-2xl p-3 flex flex-col gap-1 self-start min-h-[400px]">
      <div className="flex items-center justify-between px-2 py-1 mb-2">
        <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Projets</p>
        <button onClick={() => setShowNew(v => !v)} className="text-white/50 hover:text-white transition-colors">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Toutes les tâches */}
      <button
        onClick={() => onSelectProjet(null)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${projetActif === null ? 'bg-[#C9A961] text-[#1A3A52]' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
      >
        <span className="text-base">📋</span>
        <span className="flex-1 text-left truncate">Toutes les tâches</span>
        <span className="text-xs opacity-60">{taches.length}</span>
      </button>

      {/* Projets */}
      {projets.map(p => {
        const count = taches.filter(t => t.projet === p.nom).length;
        const isActive = projetActif === p.nom;
        return (
          <button key={p.id}
            onClick={() => onSelectProjet(p.nom)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all group ${isActive ? 'bg-[#C9A961] text-[#1A3A52]' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
          >
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.couleur || '#C9A961' }} />
            <span className="flex-1 text-left truncate">{p.nom}</span>
            <span className="text-xs opacity-60">{count}</span>
            <button onClick={(e) => handleDelete(e, p.id)} className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all ml-1">
              <Trash2 className="h-3 w-3" />
            </button>
          </button>
        );
      })}

      {/* Nouveau projet */}
      {showNew && (
        <div className="mt-2 bg-white/10 rounded-xl p-3 space-y-2">
          <input autoFocus
            className="w-full bg-white/20 text-white text-sm px-3 py-1.5 rounded-lg border border-white/20 focus:outline-none focus:border-[#C9A961] placeholder-white/40"
            placeholder="Nom du projet…"
            value={newNom}
            onChange={e => setNewNom(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setShowNew(false); }}
          />
          <div className="flex gap-1.5 flex-wrap">
            {COULEURS.map(c => (
              <button key={c} onClick={() => setNewCouleur(c)}
                className={`w-5 h-5 rounded-full border-2 transition-all ${newCouleur === c ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="flex-1 bg-[#C9A961] text-[#1A3A52] text-xs py-1.5 rounded-lg font-bold">
              Créer
            </button>
            <button onClick={() => setShowNew(false)} className="text-white/50 text-xs px-2 py-1.5 rounded-lg hover:bg-white/10">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}