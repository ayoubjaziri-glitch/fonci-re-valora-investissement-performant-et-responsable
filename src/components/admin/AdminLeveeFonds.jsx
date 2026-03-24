import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, X, Save, TrendingUp } from 'lucide-react';

const STATUTS = ["Préparation", "Ouverte", "En cours", "Clôturée"];
const EMPTY = {
  nom: '', objectif: '', collecte: '', avancement: 0,
  date_ouverture: '', date_cloture: '', ticket_min: '10 000 €',
  rendement_cible: '10% net', description: '', statut: 'Préparation',
  nb_investisseurs: 0, horizon: '5 ans', effet_levier: 'x5',
  valorisation_an5: '+61%', sous_titre: '', actif: true
};

const STATUT_COLORS = {
  'Préparation': 'bg-slate-100 text-slate-600',
  'Ouverte': 'bg-green-100 text-green-700',
  'En cours': 'bg-blue-100 text-blue-700',
  'Clôturée': 'bg-gray-100 text-gray-500',
};

export default function AdminLeveeFonds() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const { data: levees = [] } = useQuery({
    queryKey: ['levees-fonds'],
    queryFn: () => base44.entities.LeveeFonds.list('-created_date', 50),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editing === 'new'
      ? base44.entities.LeveeFonds.create(data)
      : base44.entities.LeveeFonds.update(editing.id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['levees-fonds'] }); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.LeveeFonds.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['levees-fonds'] }),
  });

  const openNew = () => { setForm(EMPTY); setEditing('new'); };
  const openEdit = (l) => { setForm({ ...l }); setEditing(l); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#1A3A52]">Levées de Fonds</h2>
          <p className="text-slate-500 text-sm">{levees.length} levée{levees.length > 1 ? 's' : ''}</p>
        </div>
        <Button onClick={openNew} className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
          <Plus className="h-4 w-4 mr-2" /> Nouvelle levée
        </Button>
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-[#1A3A52]">{editing === 'new' ? 'Nouvelle levée de fonds' : 'Modifier la levée'}</h3>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Nom *</label>
                  <Input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} placeholder="Levée inaugurale 2026" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Statut</label>
                  <select value={form.statut} onChange={e => setForm({...form, statut: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm bg-white">
                    {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Objectif</label>
                  <Input value={form.objectif} onChange={e => setForm({...form, objectif: e.target.value})} placeholder="1 250 000 €" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Collecté à date</label>
                  <Input value={form.collecte} onChange={e => setForm({...form, collecte: e.target.value})} placeholder="450 000 €" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Avancement ({form.avancement}%)</label>
                <input type="range" min="0" max="100" value={form.avancement}
                  onChange={e => setForm({...form, avancement: parseInt(e.target.value)})}
                  className="w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Date d'ouverture</label>
                  <Input type="date" value={form.date_ouverture} onChange={e => setForm({...form, date_ouverture: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Date de clôture</label>
                  <Input type="date" value={form.date_cloture} onChange={e => setForm({...form, date_cloture: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Ticket minimum</label>
                  <Input value={form.ticket_min} onChange={e => setForm({...form, ticket_min: e.target.value})} placeholder="10 000 €" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Rendement cible</label>
                  <Input value={form.rendement_cible} onChange={e => setForm({...form, rendement_cible: e.target.value})} placeholder="10% net" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Nb investisseurs</label>
                  <Input type="number" value={form.nb_investisseurs} onChange={e => setForm({...form, nb_investisseurs: parseInt(e.target.value)||0})} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
                <Textarea rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Description de la levée, objectifs, utilisation des fonds..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="actif-l" checked={form.actif} onChange={e => setForm({...form, actif: e.target.checked})} />
                <label htmlFor="actif-l" className="text-sm text-slate-700">Afficher dans l'espace associé</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="flex-1 bg-[#1A3A52] hover:bg-[#2A4A6F] text-white">
                <Save className="h-4 w-4 mr-2" /> {saveMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
              <Button variant="outline" onClick={() => setEditing(null)}>Annuler</Button>
            </div>
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="space-y-4">
        {levees.map(l => (
          <div key={l.id} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C9A961]/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-[#C9A961]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A3A52]">{l.nom}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUT_COLORS[l.statut]}`}>{l.statut}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(l)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="outline" onClick={() => { if (confirm('Supprimer ?')) deleteMutation.mutate(l.id); }}
                  className="text-red-500 border-red-200 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div><p className="text-xs text-slate-500">Objectif</p><p className="font-semibold text-[#1A3A52] text-sm">{l.objectif || '—'}</p></div>
              <div><p className="text-xs text-slate-500">Collecté</p><p className="font-semibold text-emerald-600 text-sm">{l.collecte || '—'}</p></div>
              <div><p className="text-xs text-slate-500">Ticket min.</p><p className="font-semibold text-sm">{l.ticket_min || '—'}</p></div>
              <div><p className="text-xs text-slate-500">Investisseurs</p><p className="font-semibold text-sm">{l.nb_investisseurs}</p></div>
            </div>
            {l.avancement > 0 && (
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Avancement</span><span>{l.avancement}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-[#C9A961] h-2 rounded-full transition-all" style={{ width: `${l.avancement}%` }} />
                </div>
              </div>
            )}
            {l.description && <p className="text-xs text-slate-500 mt-3 line-clamp-2">{l.description}</p>}
          </div>
        ))}
        {levees.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <TrendingUp className="h-12 w-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400">Aucune levée de fonds. Cliquez sur "Nouvelle levée" pour commencer.</p>
          </div>
        )}
      </div>
    </div>
  );
}