import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/supabaseClient';
import { Plus, List, Calendar, BarChart2, Search, SlidersHorizontal, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ListView from './ListView';
import GanttChart from './GanttChart';
import CalendrierView from './CalendrierView';
import TacheDetail from './TacheDetail';
import ProjetsSidebar from './ProjetsSidebar';
import GestionResponsables from './GestionResponsables';

const STATUTS = ['A faire', 'En cours', 'En révision', 'Terminé', 'Bloqué'];
const PRIORITES = ['Urgente', 'Haute', 'Moyenne', 'Basse'];

const STATUT_COLORS = {
  'A faire': 'bg-slate-100 text-slate-600',
  'En cours': 'bg-blue-100 text-blue-700',
  'En révision': 'bg-purple-100 text-purple-700',
  'Terminé': 'bg-emerald-100 text-emerald-700',
  'Bloqué': 'bg-red-100 text-red-700',
};

function NouvellesTacheModal({ projets, onClose, onCreate }) {
  const [form, setForm] = useState({ titre: '', statut: 'A faire', priorite: 'Moyenne', projet: '', assigne_a: '', date_echeance: '', description: '', est_jalon: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titre.trim()) return;
    await onCreate(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-[#1A3A52]">Nouvelle tâche</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input required autoFocus
            className="w-full text-base font-semibold border-b-2 border-slate-200 focus:border-[#C9A961] focus:outline-none py-2 placeholder-slate-300"
            placeholder="Nom de la tâche…"
            value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Statut</label>
              <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C9A961]"
                value={form.statut} onChange={e => setForm(f => ({ ...f, statut: e.target.value }))}>
                {STATUTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Priorité</label>
              <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C9A961]"
                value={form.priorite} onChange={e => setForm(f => ({ ...f, priorite: e.target.value }))}>
                {PRIORITES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Projet</label>
              <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C9A961]"
                value={form.projet} onChange={e => setForm(f => ({ ...f, projet: e.target.value }))}>
                <option value="">Sans projet</option>
                {projets.map(p => <option key={p.id} value={p.nom}>{p.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Assigné à</label>
              <input className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C9A961]"
                placeholder="Nom…" value={form.assigne_a} onChange={e => setForm(f => ({ ...f, assigne_a: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Échéance</label>
              <input type="date" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C9A961]"
                value={form.date_echeance} onChange={e => setForm(f => ({ ...f, date_echeance: e.target.value }))} />
            </div>
            <div className="flex items-center gap-2 mt-5">
              <input type="checkbox" id="jalon_new" checked={form.est_jalon} onChange={e => setForm(f => ({ ...f, est_jalon: e.target.checked }))} className="w-4 h-4 accent-[#C9A961]" />
              <label htmlFor="jalon_new" className="text-sm text-slate-600">Jalon</label>
            </div>
          </div>
          <textarea className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C9A961] resize-none"
            placeholder="Description (optionnel)…" rows={3}
            value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white">Créer la tâche</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminTaches() {
  const qc = useQueryClient();
  const [view, setView] = useState('liste');
  const [projetActif, setProjetActif] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterPriorite, setFilterPriorite] = useState('');
  const [showTerminees, setShowTerminees] = useState(false);
  const [tacheDetail, setTacheDetail] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showResponsables, setShowResponsables] = useState(false);

  const { data: taches = [] } = useQuery({
    queryKey: ['taches'],
    queryFn: () => db.Tache.list('-created_date', 500),
  });

  const { data: projets = [] } = useQuery({
    queryKey: ['projets'],
    queryFn: () => db.Projet.list(),
  });

  const filteredTaches = useMemo(() => {
    return taches.filter(t => {
      if (!showTerminees && t.statut === 'Terminé') return false;
      if (projetActif && t.projet !== projetActif) return false;
      if (filterStatut && t.statut !== filterStatut) return false;
      if (filterPriorite && t.priorite !== filterPriorite) return false;
      if (search) {
        const q = search.toLowerCase();
        return t.titre.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q) || (t.assigne_a || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [taches, projetActif, filterStatut, filterPriorite, search, showTerminees]);

  const handleCreate = async (form) => {
    await db.Tache.create(form);
    qc.invalidateQueries({ queryKey: ['taches'] });
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette tâche ?')) return;
    await db.Tache.delete(id);
    qc.invalidateQueries({ queryKey: ['taches'] });
  };

  // Stats rapides
  const stats = {
    total: filteredTaches.length,
    enCours: filteredTaches.filter(t => t.statut === 'En cours').length,
    terminees: filteredTaches.filter(t => t.statut === 'Terminé').length,
    enRetard: filteredTaches.filter(t => t.date_echeance && new Date(t.date_echeance) < new Date() && t.statut !== 'Terminé').length,
  };

  const VIEWS = [
    { id: 'liste', label: 'Liste', icon: List },
    { id: 'calendrier', label: 'Calendrier', icon: Calendar },
    { id: 'gantt', label: 'Gantt', icon: BarChart2 },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1A3A52]">Gestion des tâches</h2>
          <p className="text-slate-400 text-sm">{stats.total} tâche{stats.total > 1 ? 's' : ''} · {stats.enCours} en cours · {stats.terminees} terminées{stats.enRetard > 0 ? ` · ⚠️ ${stats.enRetard} en retard` : ''}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowResponsables(true)} className="gap-2 border-slate-200 text-slate-600">
            <Users className="h-4 w-4" /> Responsables
          </Button>
          <Button onClick={() => setShowNew(true)} className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white gap-2">
            <Plus className="h-4 w-4" /> Nouvelle tâche
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        {/* Sidebar projets */}
        <ProjetsSidebar projets={projets} projetActif={projetActif} onSelectProjet={setProjetActif} taches={taches} />

        {/* Contenu principal */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Toolbar */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Tabs vue */}
            <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-0.5">
              {VIEWS.map(v => (
                <button key={v.id} onClick={() => setView(v.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === v.id ? 'bg-[#1A3A52] text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                  <v.icon className="h-3.5 w-3.5" />{v.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[160px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A961]"
                placeholder="Rechercher…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Toggle tâches terminées */}
            <button onClick={() => setShowTerminees(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${showTerminees ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
              <span className={`w-2 h-2 rounded-full ${showTerminees ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              Terminées {showTerminees ? 'visibles' : 'masquées'}
            </button>

            {/* Filtres */}
            <button onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${showFilters || filterStatut || filterPriorite ? 'bg-[#C9A961]/10 border-[#C9A961] text-[#1A3A52]' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
              <SlidersHorizontal className="h-4 w-4" /> Filtres
              {(filterStatut || filterPriorite) && <span className="bg-[#C9A961] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{(filterStatut ? 1 : 0) + (filterPriorite ? 1 : 0)}</span>}
            </button>
          </div>

          {/* Panel filtres */}
          {showFilters && (
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3">
              <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#C9A961]"
                value={filterStatut} onChange={e => setFilterStatut(e.target.value)}>
                <option value="">Tous les statuts</option>
                {STATUTS.map(s => <option key={s}>{s}</option>)}
              </select>
              <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#C9A961]"
                value={filterPriorite} onChange={e => setFilterPriorite(e.target.value)}>
                <option value="">Toutes les priorités</option>
                {PRIORITES.map(p => <option key={p}>{p}</option>)}
              </select>
              {(filterStatut || filterPriorite) && (
                <button onClick={() => { setFilterStatut(''); setFilterPriorite(''); }}
                  className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1">
                  <X className="h-3.5 w-3.5" /> Réinitialiser
                </button>
              )}
            </div>
          )}

          {/* Vue */}
          {view === 'liste' && <ListView taches={filteredTaches} onTacheClick={setTacheDetail} onDelete={handleDelete} />}
          {view === 'calendrier' && <CalendrierView taches={filteredTaches} onTacheClick={setTacheDetail} />}
          {view === 'gantt' && <GanttChart taches={filteredTaches} />}
        </div>
      </div>

      {/* Modals */}
      {showNew && <NouvellesTacheModal projets={projets} onClose={() => setShowNew(false)} onCreate={handleCreate} />}
      {tacheDetail && <TacheDetail tache={tacheDetail} onClose={() => setTacheDetail(null)} projets={projets} />}
      {showResponsables && <GestionResponsables onClose={() => setShowResponsables(false)} />}
    </div>
  );
}