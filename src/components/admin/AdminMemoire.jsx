import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Plus, Trash2, Edit2, Check, X, Power, Tag } from 'lucide-react';

const CATEGORIES = ['Stratégie', 'Patrimoine', 'Finances', 'Équipe', 'Investisseurs', 'Communication', 'Marché', 'Autre'];

const CAT_COLORS = {
  'Stratégie': 'bg-blue-100 text-blue-700',
  'Patrimoine': 'bg-amber-100 text-amber-700',
  'Finances': 'bg-green-100 text-green-700',
  'Équipe': 'bg-purple-100 text-purple-700',
  'Investisseurs': 'bg-orange-100 text-orange-700',
  'Communication': 'bg-pink-100 text-pink-700',
  'Marché': 'bg-teal-100 text-teal-700',
  'Autre': 'bg-slate-100 text-slate-600',
};

const EMPTY = { titre: '', categorie: 'Autre', contenu: '', actif: true };

export default function AdminMemoire() {
  const qc = useQueryClient();
  const [form, setForm] = useState(null); // null = fermé, {} = nouveau, {id,...} = édition
  const [filterCat, setFilterCat] = useState('Toutes');

  const { data: notes = [] } = useQuery({
    queryKey: ['valora-memoire'],
    queryFn: () => base44.entities.ValoraAIMemoire.list('-created_date', 200),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['valora-memoire'] });

  const createMut = useMutation({
    mutationFn: (data) => base44.entities.ValoraAIMemoire.create(data),
    onSuccess: invalidate,
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ValoraAIMemoire.update(id, data),
    onSuccess: invalidate,
  });

  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.ValoraAIMemoire.delete(id),
    onSuccess: invalidate,
  });

  const handleSave = async () => {
    if (!form.titre?.trim() || !form.contenu?.trim()) return;
    if (form.id) {
      await updateMut.mutateAsync({ id: form.id, data: { titre: form.titre, categorie: form.categorie, contenu: form.contenu, actif: form.actif } });
    } else {
      await createMut.mutateAsync({ titre: form.titre, categorie: form.categorie, contenu: form.contenu, actif: form.actif ?? true });
    }
    setForm(null);
  };

  const toggleActif = (note) => {
    updateMut.mutate({ id: note.id, data: { actif: !note.actif } });
  };

  const activeCount = notes.filter(n => n.actif).length;
  const filtered = filterCat === 'Toutes' ? notes : notes.filter(n => n.categorie === filterCat);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F2537] to-[#1A3A52] rounded-2xl p-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#C9A961] rounded-xl flex items-center justify-center flex-shrink-0">
            <Brain className="h-6 w-6 text-[#1A3A52]" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Mémoire de Valora AI</h2>
            <p className="text-white/50 text-sm mt-0.5">
              {activeCount} note{activeCount !== 1 ? 's' : ''} active{activeCount !== 1 ? 's' : ''} injectée{activeCount !== 1 ? 's' : ''} dans le contexte de l'IA
            </p>
          </div>
        </div>
        <Button
          onClick={() => setForm({ ...EMPTY })}
          className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold gap-2 flex-shrink-0"
        >
          <Plus className="h-4 w-4" /> Ajouter une note
        </Button>
      </div>

      {/* Info box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
        <Brain className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-amber-800 text-sm leading-relaxed">
          Les notes <strong>actives</strong> sont automatiquement injectées dans chaque conversation avec Valora AI. L'IA les connaîtra comme si vous les lui aviez communiqués directement. Désactivez une note pour l'exclure temporairement.
        </p>
      </div>

      {/* Filtres catégorie */}
      <div className="flex flex-wrap gap-2">
        {['Toutes', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              filterCat === cat
                ? 'bg-[#1A3A52] text-white border-[#1A3A52]'
                : 'bg-white text-slate-600 border-slate-200 hover:border-[#C9A961] hover:text-[#1A3A52]'
            }`}
          >
            {cat}
            {cat !== 'Toutes' && (
              <span className="ml-1 opacity-60">
                ({notes.filter(n => n.categorie === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Formulaire création/édition */}
      {form && (
        <div className="bg-white rounded-2xl border-2 border-[#C9A961] shadow-lg p-6 space-y-4">
          <h3 className="font-bold text-[#1A3A52] text-base">
            {form.id ? '✏️ Modifier la note' : '➕ Nouvelle note de mémoire'}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Titre</label>
              <Input
                placeholder="Ex: Projet acquisition Lyon 2025"
                value={form.titre}
                onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Catégorie</label>
              <select
                value={form.categorie}
                onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961]"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
              Contenu — informations à mémoriser
            </label>
            <Textarea
              placeholder="Décrivez en détail : chiffres clés, contexte, personnes impliquées, décisions prises, stratégie, informations confidentielles à retenir..."
              value={form.contenu}
              onChange={e => setForm(f => ({ ...f, contenu: e.target.value }))}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-slate-400 mt-1">{form.contenu?.length || 0} caractères</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.actif ?? true}
                onChange={e => setForm(f => ({ ...f, actif: e.target.checked }))}
                className="w-4 h-4 accent-[#C9A961]"
              />
              <span className="text-sm text-slate-600">Activer immédiatement (injecter dans l'IA)</span>
            </label>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setForm(null)} className="gap-2">
                <X className="h-4 w-4" /> Annuler
              </Button>
              <Button
                onClick={handleSave}
                disabled={!form.titre?.trim() || !form.contenu?.trim()}
                className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white gap-2"
              >
                <Check className="h-4 w-4" /> Enregistrer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des notes */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Brain className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">Aucune note de mémoire</p>
          <p className="text-slate-300 text-sm mt-1">Ajoutez du contexte pour enrichir les connaissances de Valora AI</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(note => (
            <div
              key={note.id}
              className={`bg-white rounded-xl border p-4 transition-all ${
                note.actif ? 'border-slate-200 shadow-sm' : 'border-dashed border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleActif(note)}
                    title={note.actif ? 'Désactiver' : 'Activer'}
                    className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      note.actif ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    <Power className="h-3.5 w-3.5" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-[#1A3A52] text-sm">{note.titre}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CAT_COLORS[note.categorie] || CAT_COLORS['Autre']}`}>
                        {note.categorie}
                      </span>
                      {!note.actif && (
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Désactivée</span>
                      )}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{note.contenu}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setForm({ ...note })}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#1A3A52] hover:bg-slate-100 transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => { if (confirm('Supprimer cette note ?')) deleteMut.mutate(note.id); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}