import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Mail, User, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GestionResponsables({ onClose }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ nom: '', email: '' });
  const [adding, setAdding] = useState(false);

  const { data: responsables = [] } = useQuery({
    queryKey: ['responsables'],
    queryFn: () => base44.entities.Responsable.list('-created_date'),
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.nom.trim() || !form.email.trim()) return;
    await base44.entities.Responsable.create({ ...form, actif: true });
    qc.invalidateQueries({ queryKey: ['responsables'] });
    setForm({ nom: '', email: '' });
    setAdding(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce responsable ?')) return;
    await base44.entities.Responsable.delete(id);
    qc.invalidateQueries({ queryKey: ['responsables'] });
  };

  const toggleActif = async (r) => {
    await base44.entities.Responsable.update(r.id, { actif: !r.actif });
    qc.invalidateQueries({ queryKey: ['responsables'] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-[#1A3A52]">Gestion des Responsables</h3>
            <p className="text-xs text-slate-400">Les responsables reçoivent des emails lors des assignations et rappels</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {responsables.map(r => (
            <div key={r.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${r.actif !== false ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
              <div className="w-9 h-9 rounded-full bg-[#1A3A52] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {r.nom.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{r.nom}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1 truncate"><Mail className="h-3 w-3" />{r.email}</p>
              </div>
              <button onClick={() => toggleActif(r)} className="text-slate-400 hover:text-[#1A3A52] transition-colors" title={r.actif !== false ? 'Désactiver' : 'Activer'}>
                {r.actif !== false ? <ToggleRight className="h-5 w-5 text-emerald-500" /> : <ToggleLeft className="h-5 w-5" />}
              </button>
              <button onClick={() => handleDelete(r.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {responsables.length === 0 && !adding && (
            <div className="text-center py-8 text-slate-400">
              <User className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucun responsable encore</p>
            </div>
          )}

          {adding ? (
            <form onSubmit={handleAdd} className="border-2 border-[#C9A961]/40 rounded-xl p-4 space-y-3 bg-amber-50">
              <input required autoFocus
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C9A961]"
                placeholder="Nom complet…"
                value={form.nom}
                onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
              />
              <input required type="email"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C9A961]"
                placeholder="Email…"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              <div className="flex gap-2">
                <Button type="submit" className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white flex-1">Ajouter</Button>
                <Button type="button" variant="outline" onClick={() => setAdding(false)}>Annuler</Button>
              </div>
            </form>
          ) : (
            <button onClick={() => setAdding(true)}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-[#1A3A52] hover:border-[#C9A961] transition-all text-sm font-medium">
              <Plus className="h-4 w-4" /> Ajouter un responsable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}