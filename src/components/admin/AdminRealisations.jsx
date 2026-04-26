import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, X, Save, Building2, ArrowRight } from 'lucide-react';

const DPE_OPTIONS = ['A','B','C','D','E','F','G'];

const EMPTY = {
  titre: '', location: '', annee: new Date().getFullYear().toString(),
  image_avant: '', image_apres: '', surface: '', logements: '',
  investissement: '', dpe_avant: 'F', dpe_apres: 'B',
  description_avant: '', description_apres: '',
  travaux: '', rendement_brut: '', plus_value: '', ordre: 0, actif: true
};

const DPE_COLORS = { A:'bg-emerald-500', B:'bg-green-500', C:'bg-lime-500', D:'bg-yellow-500', E:'bg-orange-500', F:'bg-red-400', G:'bg-red-600' };

export default function AdminRealisations() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const { data: biens = [] } = useQuery({
    queryKey: ['realisations-biens'],
    queryFn: () => db.RealisationBien.list('ordre', 50),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editing === 'new'
      ? db.RealisationBien.create(data)
      : db.RealisationBien.update(editing.id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['realisations-biens'] }); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.RealisationBien.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['realisations-biens'] }),
  });

  const openNew = () => { setForm(EMPTY); setEditing('new'); };
  const openEdit = (b) => { setForm({ ...b }); setEditing(b); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#1A3A52]">Nos Biens & Réalisations</h2>
          <p className="text-slate-500 text-sm">{biens.length} bien{biens.length > 1 ? 's' : ''} — affiché{biens.length > 1 ? 's' : ''} sur la page publique "Nos biens"</p>
        </div>
        <Button onClick={openNew} className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
          <Plus className="h-4 w-4 mr-2" /> Ajouter un bien
        </Button>
      </div>

      {/* Form modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-[#1A3A52]">{editing === 'new' ? 'Nouveau bien' : 'Modifier le bien'}</h3>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Titre *</label>
                  <Input value={form.titre} onChange={e => setForm({...form, titre: e.target.value})} placeholder="Immeuble haussmannien - Lyon 6ème" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Localisation *</label>
                  <Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Lyon, Rhône" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Année</label>
                  <Input value={form.annee} onChange={e => setForm({...form, annee: e.target.value})} placeholder="2024" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Surface</label>
                  <Input value={form.surface} onChange={e => setForm({...form, surface: e.target.value})} placeholder="1 200 m²" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Logements / Lots</label>
                  <Input value={form.logements} onChange={e => setForm({...form, logements: e.target.value})} placeholder="12 lots" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Investissement</label>
                  <Input value={form.investissement} onChange={e => setForm({...form, investissement: e.target.value})} placeholder="1 450 000 €" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Rendement brut</label>
                  <Input value={form.rendement_brut} onChange={e => setForm({...form, rendement_brut: e.target.value})} placeholder="8,2%" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Plus-value</label>
                  <Input value={form.plus_value} onChange={e => setForm({...form, plus_value: e.target.value})} placeholder="+18%" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">DPE Avant</label>
                  <select value={form.dpe_avant} onChange={e => setForm({...form, dpe_avant: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm bg-white">
                    {DPE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">DPE Après</label>
                  <select value={form.dpe_apres} onChange={e => setForm({...form, dpe_apres: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm bg-white">
                    {DPE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Photo AVANT (URL)</label>
                <Input value={form.image_avant} onChange={e => setForm({...form, image_avant: e.target.value})} placeholder="https://..." />
                {form.image_avant && <img src={form.image_avant} alt="avant" className="mt-2 h-24 w-36 object-cover rounded-lg" />}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Photo APRÈS (URL)</label>
                <Input value={form.image_apres} onChange={e => setForm({...form, image_apres: e.target.value})} placeholder="https://..." />
                {form.image_apres && <img src={form.image_apres} alt="après" className="mt-2 h-24 w-36 object-cover rounded-lg" />}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Description avant travaux</label>
                <Textarea rows={2} value={form.description_avant} onChange={e => setForm({...form, description_avant: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Description après travaux</label>
                <Textarea rows={2} value={form.description_apres} onChange={e => setForm({...form, description_apres: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Travaux réalisés (séparés par des virgules)</label>
                <Input value={form.travaux} onChange={e => setForm({...form, travaux: e.target.value})} placeholder="ITE complète, PAC collective, VMC double flux" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Ordre d'affichage</label>
                  <Input type="number" value={form.ordre} onChange={e => setForm({...form, ordre: parseInt(e.target.value)||0})} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.actif} onChange={e => setForm({...form, actif: e.target.checked})} />
                    <span className="text-sm text-slate-700">Afficher sur le site</span>
                  </label>
                </div>
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

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {biens.map(b => (
          <div key={b.id} className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-slate-100 relative">
                {b.image_apres
                  ? <img src={b.image_apres} alt={b.titre} className="w-full h-full object-cover" />
                  : <Building2 className="w-8 h-8 text-slate-300 absolute inset-0 m-auto" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">{b.titre}</p>
                <p className="text-xs text-slate-500">{b.location} — {b.annee}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs text-white px-2 py-0.5 rounded font-bold ${DPE_COLORS[b.dpe_avant] || 'bg-gray-400'}`}>{b.dpe_avant}</span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                  <span className={`text-xs text-white px-2 py-0.5 rounded font-bold ${DPE_COLORS[b.dpe_apres] || 'bg-gray-400'}`}>{b.dpe_apres}</span>
                  {b.rendement_brut && <span className="text-xs text-emerald-600 font-semibold ml-2">{b.rendement_brut}</span>}
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${b.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {b.actif ? 'Visible' : 'Masqué'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(b)}><Pencil className="h-3.5 w-3.5 mr-1" /> Modifier</Button>
              <Button size="sm" variant="outline" onClick={() => { if (confirm(`Supprimer "${b.titre}" ?`)) deleteMutation.mutate(b.id); }}
                className="text-red-500 border-red-200 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
        {biens.length === 0 && (
          <div className="col-span-2 text-center py-16 text-slate-400">
            <Building2 className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>Aucun bien ajouté. Cliquez sur "Ajouter un bien" pour commencer.</p>
          </div>
        )}
      </div>
    </div>
  );
}