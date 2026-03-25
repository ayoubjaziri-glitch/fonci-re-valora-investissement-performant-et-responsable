import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Save, Eye } from 'lucide-react';
import SectionStylePicker from './SectionStylePicker';
import SectionPreview from './SectionPreview';

const UNSPLASH_SUGGESTIONS = {
  accueil: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80'],
  strategie: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'],
  missions: ['https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80'],
  equipe: ['https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80'],
  ecosysteme: ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80', 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80'],
  durabilite: ['https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80'],
  nos_biens: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80', 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800&q=80'],
};

const EMPTY = { titre: '', sous_titre: '', contenu: '', image_url: '', type_section: 'texte', ordre: 50, actif: true };

const PAGE_LABELS = {
  accueil: 'Accueil', strategie: 'Stratégie', missions: 'Nos Missions',
  equipe: 'Notre Histoire', ecosysteme: 'Écosystème', durabilite: 'Durabilité', nos_biens: 'Nos Biens',
};

const CONTENT_HINTS = {
  texte: 'Rédigez votre texte principal (plusieurs paragraphes acceptés).',
  texte_image: 'Rédigez votre texte. Choisissez ou collez une URL d\'image à droite.',
  chiffres: 'Format : une valeur par ligne, séparée par "|"\nEx:\n10%|TRI net visé\n5 ans|Horizon recommandé\n0 €|Frais d\'entrée',
  cta: 'Décrivez votre appel à l\'action. Le bouton "Entrer en relation" sera ajouté automatiquement.',
  temoignage: 'Collez le témoignage dans "Contenu". Mettez le nom de l\'auteur dans "Titre" et son rôle dans "Sous-titre".',
  liste: 'Un point par ligne, commençant par "- " ou directement le texte.\nEx:\n- Portefeuille diversifié\n- Gestion déléguée\n- Éligibilité PEA-PME',
};

export default function ManualSectionModal({ page, existingSections, onSave, onCancel, isLoading }) {
  const [form, setForm] = useState(EMPTY);
  const [showPreview, setShowPreview] = useState(true);

  const pageLabel = PAGE_LABELS[page] || page;
  const imageSuggestions = UNSPLASH_SUGGESTIONS[page] || [];
  const contentHint = CONTENT_HINTS[form.type_section] || '';

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    if (!form.titre.trim()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[93vh] overflow-hidden shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h3 className="font-semibold text-[#1A3A52] text-lg">Créer une section manuellement</h3>
            <p className="text-xs text-slate-400">Page : {pageLabel}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${showPreview ? 'bg-slate-100 border-slate-200 text-slate-700' : 'border-slate-200 text-slate-400 hover:text-slate-600'}`}>
              <Eye className="h-3.5 w-3.5" /> Aperçu
            </button>
            <button onClick={onCancel} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className={`grid gap-0 h-full ${showPreview ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {/* Formulaire */}
            <div className="p-6 space-y-5 overflow-y-auto border-r border-slate-100">
              {/* Style picker */}
              <SectionStylePicker value={form.type_section} onChange={val => update('type_section', val)} />

              {/* Titre */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  {form.type_section === 'temoignage' ? 'Nom de l\'auteur *' : 'Titre *'}
                </label>
                <Input value={form.titre} onChange={e => update('titre', e.target.value)}
                  placeholder={form.type_section === 'temoignage' ? 'François B.' : 'Ex: Notre approche de sélection'} />
              </div>

              {/* Sous-titre */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  {form.type_section === 'temoignage' ? 'Rôle / Contexte' : 'Sous-titre / Accroche'}
                </label>
                <Input value={form.sous_titre} onChange={e => update('sous_titre', e.target.value)}
                  placeholder={form.type_section === 'temoignage' ? 'Chef d\'entreprise — Associé depuis 2024' : 'Une phrase d\'accroche courte'} />
              </div>

              {/* Contenu */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Contenu</label>
                <Textarea rows={5} value={form.contenu} onChange={e => update('contenu', e.target.value)}
                  placeholder={contentHint} className="resize-none text-sm" />
              </div>

              {/* Image (si pertinent) */}
              {(form.type_section === 'texte_image') && (
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Image</label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {imageSuggestions.map((url, i) => (
                      <button key={i} type="button" onClick={() => update('image_url', url)}
                        className={`rounded-lg overflow-hidden border-2 transition-all ${form.image_url === url ? 'border-[#C9A961] shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
                        <img src={url} alt="" className="w-20 h-14 object-cover" />
                        {form.image_url === url && <div className="text-center text-[9px] text-[#C9A961] font-bold py-0.5 bg-[#C9A961]/10">Sélectionnée</div>}
                      </button>
                    ))}
                  </div>
                  <Input value={form.image_url} onChange={e => update('image_url', e.target.value)}
                    placeholder="Ou collez une URL d'image personnalisée…" className="text-xs" />
                </div>
              )}

              {/* Ordre */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Ordre d'affichage</label>
                <Input type="number" value={form.ordre} onChange={e => update('ordre', parseInt(e.target.value) || 0)}
                  className="w-24" />
                <p className="text-xs text-slate-400 mt-1">Les sections existantes sont à {existingSections.map(s => s.ordre).join(', ') || '—'}</p>
              </div>

              {/* Visibilité */}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="actif-m" checked={form.actif} onChange={e => update('actif', e.target.checked)}
                  className="rounded" />
                <label htmlFor="actif-m" className="text-sm text-slate-700">Section visible sur le site</label>
              </div>
            </div>

            {/* Aperçu */}
            {showPreview && (
              <div className="p-6 bg-slate-50 overflow-y-auto">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Aperçu en temps réel</p>
                {form.titre || form.contenu ? (
                  <SectionPreview section={form} />
                ) : (
                  <div className="h-40 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                    <p className="text-sm text-slate-300">Remplissez le formulaire pour voir l'aperçu</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0">
          <Button onClick={handleSave} disabled={isLoading || !form.titre.trim()}
            className="flex-1 bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Sauvegarde…' : 'Ajouter cette section au site'}
          </Button>
          <Button variant="outline" onClick={onCancel}>Annuler</Button>
        </div>
      </div>
    </div>
  );
}