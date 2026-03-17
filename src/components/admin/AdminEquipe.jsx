import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, X, Save, Users } from 'lucide-react';

const EMPTY = { nom: '', role: '', focus: '', description: '', experience: '', image_url: '', type: 'membre', ordre: 0, actif: true };

export default function AdminEquipe() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null); // null | 'new' | {id,...}
  const [form, setForm] = useState(EMPTY);

  const { data: membres = [] } = useQuery({
    queryKey: ['membres-equipe'],
    queryFn: () => base44.entities.MembreEquipe.list('ordre', 100),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editing === 'new'
      ? base44.entities.MembreEquipe.create(data)
      : base44.entities.MembreEquipe.update(editing.id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['membres-equipe'] }); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.MembreEquipe.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['membres-equipe'] }),
  });

  const openNew = () => { setForm(EMPTY); setEditing('new'); };
  const openEdit = (m) => { setForm({ ...m }); setEditing(m); };
  const handleSave = () => saveMutation.mutate(form);

  const fondateurs = membres.filter(m => m.type === 'fondateur');
  const equipe = membres.filter(m => m.type === 'membre');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#1A3A52]">Gestion de l'Équipe</h2>
          <p className="text-slate-500 text-sm">{membres.length} membre{membres.length > 1 ? 's' : ''} au total</p>
        </div>
        <Button onClick={openNew} className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
          <Plus className="h-4 w-4 mr-2" /> Ajouter un membre
        </Button>
      </div>

      {/* Form modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-[#1A3A52]">{editing === 'new' ? 'Nouveau membre' : 'Modifier le membre'}</h3>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Nom *</label>
                  <Input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} placeholder="Prénom Nom" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Rôle *</label>
                  <Input value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="Cofondateur, Chargé de..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm bg-white">
                    <option value="fondateur">Fondateur</option>
                    <option value="membre">Membre équipe</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Ordre d'affichage</label>
                  <Input type="number" value={form.ordre} onChange={e => setForm({...form, ordre: parseInt(e.target.value)||0})} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Focus / Expertise</label>
                <Input value={form.focus} onChange={e => setForm({...form, focus: e.target.value})} placeholder="Structuration bancaire, BBC..." />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Photo URL</label>
                <Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://..." />
                {form.image_url && <img src={form.image_url} alt="preview" className="mt-2 h-20 w-20 object-cover rounded-xl" />}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Description courte</label>
                <Textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Expérience détaillée (fondateurs)</label>
                <Textarea rows={3} value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.actif} onChange={e => setForm({...form, actif: e.target.checked})} id="actif-m" />
                <label htmlFor="actif-m" className="text-sm text-slate-700">Afficher sur le site</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleSave} disabled={saveMutation.isPending} className="flex-1 bg-[#1A3A52] hover:bg-[#2A4A6F] text-white">
                <Save className="h-4 w-4 mr-2" /> {saveMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
              <Button variant="outline" onClick={() => setEditing(null)}>Annuler</Button>
            </div>
          </div>
        </div>
      )}

      {/* Liste fondateurs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-[#C9A961]" /> Fondateurs ({fondateurs.length})
        </h3>
        <div className="space-y-3">
          {fondateurs.map(m => (
            <MemberRow key={m.id} m={m} onEdit={openEdit} onDelete={() => { if (confirm(`Supprimer ${m.nom} ?`)) deleteMutation.mutate(m.id); }} />
          ))}
          {fondateurs.length === 0 && <p className="text-slate-400 text-sm text-center py-4">Aucun fondateur</p>}
        </div>
      </div>

      {/* Liste équipe */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-[#C9A961]" /> Membres de l'équipe ({equipe.length})
        </h3>
        <div className="space-y-3">
          {equipe.map(m => (
            <MemberRow key={m.id} m={m} onEdit={openEdit} onDelete={() => { if (confirm(`Supprimer ${m.nom} ?`)) deleteMutation.mutate(m.id); }} />
          ))}
          {equipe.length === 0 && <p className="text-slate-400 text-sm text-center py-4">Aucun membre</p>}
        </div>
      </div>
    </div>
  );
}

function MemberRow({ m, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
      {m.image_url
        ? <img src={m.image_url} alt={m.nom} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        : <div className="w-10 h-10 rounded-full bg-[#1A3A52] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">{m.nom?.[0]}</div>
      }
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 text-sm">{m.nom}</p>
        <p className="text-xs text-slate-500">{m.role} {m.focus && `• ${m.focus}`}</p>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full ${m.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
        {m.actif ? 'Visible' : 'Masqué'}
      </span>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(m)}><Pencil className="h-3.5 w-3.5" /></Button>
        <Button size="sm" variant="outline" onClick={onDelete} className="text-red-500 border-red-200 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></Button>
      </div>
    </div>
  );
}