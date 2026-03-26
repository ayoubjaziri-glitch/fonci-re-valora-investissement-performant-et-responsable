import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Pencil, Trash2, X, Save, Eye, EyeOff, Sparkles, PenLine,
  Home, TrendingUp, Briefcase, Users, Globe, Leaf, Building2, GripVertical
} from 'lucide-react';
import SectionChoiceModal from './SectionChoiceModal';
import AISectionModal from './AISectionModal';
import ManualSectionModal from './ManualSectionModal';

const PAGES = [
  { id: 'accueil',     label: 'Accueil',         icon: Home },
  { id: 'strategie',   label: 'Stratégie',        icon: TrendingUp },
  { id: 'missions',    label: 'Nos Missions',      icon: Briefcase },
  { id: 'equipe',      label: 'Notre Histoire',    icon: Users },
  { id: 'ecosysteme',  label: 'Écosystème',        icon: Globe },
  { id: 'durabilite',  label: 'Durabilité',        icon: Leaf },
  { id: 'nos_biens',   label: 'Nos Biens',         icon: Building2 },
];

const TYPES_LABELS = {
  texte: 'Texte centré', texte_image: 'Texte + Image',
  chiffres: 'Chiffres clés', cta: 'Call-to-action',
  temoignage: 'Témoignage', liste: 'Liste',
};

// Formulaire d'édition d'une section existante
function EditSectionForm({ form, setForm, onSave, onCancel, isLoading }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-[#1A3A52]">Modifier la section</h3>
          <button onClick={onCancel}><X className="h-5 w-5 text-slate-400" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Titre *</label>
            <Input value={form.titre || ''} onChange={e => setForm({ ...form, titre: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Sous-titre</label>
            <Input value={form.sous_titre || ''} onChange={e => setForm({ ...form, sous_titre: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Type</label>
            <select value={form.type_section} onChange={e => setForm({ ...form, type_section: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md text-sm bg-white">
              {Object.entries(TYPES_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Contenu</label>
            <Textarea rows={5} value={form.contenu || ''} onChange={e => setForm({ ...form, contenu: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">URL image (optionnel)</label>
            <Input value={form.image_url || ''} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            {form.image_url && <img src={form.image_url} alt="" className="mt-2 h-24 w-full object-cover rounded-lg" onError={e => e.target.style.display='none'} />}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Position dans la page (ordre)</label>
            <div className="flex items-center gap-3">
              <Input type="number" value={form.ordre || 0} onChange={e => setForm({ ...form, ordre: parseInt(e.target.value) || 0 })} className="w-28" />
              <div className="text-xs text-slate-400 leading-relaxed">
                <span className="font-medium text-slate-600">10–50</span> = haut de page<br />
                <span className="font-medium text-slate-600">100–500</span> = milieu<br />
                <span className="font-medium text-slate-600">900+</span> = bas de page
              </div>
            </div>
            <div className="mt-2 flex gap-2 flex-wrap">
              {[{label:'Début de page', val: 10}, {label:'Après hero', val: 50}, {label:'Milieu', val: 200}, {label:'Avant CTA', val: 800}, {label:'Fin de page', val: 950}].map(p => (
                <button key={p.val} type="button" onClick={() => setForm({...form, ordre: p.val})}
                  className={`text-xs px-2 py-1 rounded-lg border transition-colors ${form.ordre === p.val ? 'border-[#C9A961] bg-[#C9A961]/10 text-[#1A3A52] font-medium' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="actif-edit" checked={form.actif} onChange={e => setForm({ ...form, actif: e.target.checked })} />
            <label htmlFor="actif-edit" className="text-sm text-slate-700">Visible sur le site</label>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={onSave} disabled={isLoading || !form.titre?.trim()} className="flex-1 bg-[#1A3A52] hover:bg-[#2A4A6F] text-white">
            <Save className="h-4 w-4 mr-2" /> {isLoading ? 'Sauvegarde…' : 'Sauvegarder'}
          </Button>
          <Button variant="outline" onClick={onCancel}>Annuler</Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSections() {
  const qc = useQueryClient();
  const [activePage, setActivePage] = useState('accueil');
  const [modal, setModal] = useState(null); // null | 'choice' | 'ai' | 'manual'
  const [editingSection, setEditingSection] = useState(null);
  const [editForm, setEditForm] = useState({});

  const { data: sections = [] } = useQuery({
    queryKey: ['site-sections'],
    queryFn: () => base44.entities.SiteSection.list('ordre', 200),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.SiteSection.create({ ...data, page: activePage }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['site-sections'] }); setModal(null); },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.SiteSection.update(editingSection.id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['site-sections'] }); setEditingSection(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SiteSection.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['site-sections'] }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, actif }) => base44.entities.SiteSection.update(id, { actif }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['site-sections'] }),
  });

  const pageSections = sections.filter(s => s.page === activePage).sort((a, b) => a.ordre - b.ordre);
  const currentPageInfo = PAGES.find(p => p.id === activePage);

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <aside className="w-52 flex-shrink-0">
        <nav className="space-y-1 bg-white rounded-2xl border border-slate-200 p-3 sticky top-4">
          {PAGES.map(page => {
            const count = sections.filter(s => s.page === page.id).length;
            const isActive = activePage === page.id;
            const Icon = page.icon;
            return (
              <button key={page.id} onClick={() => setActivePage(page.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${isActive ? 'bg-[#1A3A52] text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">{page.label}</span>
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-[#C9A961]/20 text-[#C9A961]'}`}>{count}</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            {currentPageInfo && <currentPageInfo.icon className="h-5 w-5 text-[#C9A961]" />}
            <h2 className="text-lg font-semibold text-[#1A3A52]">{currentPageInfo?.label}</h2>
            <span className="text-sm text-slate-400">{pageSections.length} section{pageSections.length !== 1 ? 's' : ''} personnalisée{pageSections.length !== 1 ? 's' : ''}</span>
          </div>
          <Button onClick={() => setModal('choice')} className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
            <Plus className="h-4 w-4 mr-2" /> Ajouter une section
          </Button>
        </div>

        {/* Info synchronisation */}
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700 flex items-start gap-2">
          <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" />
          <span>Les sections s'affichent sur la page <strong>{currentPageInfo?.label}</strong> dans l'ordre défini par le numéro <strong>#ordre</strong>. Un ordre <strong>faible (ex: 10)</strong> = début de page, <strong>élevé (ex: 900)</strong> = fin de page. Réorganisez-les en modifiant le numéro d'ordre.</span>
        </div>

        {pageSections.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center py-20 text-center cursor-pointer hover:border-[#C9A961] transition-colors group"
            onClick={() => setModal('choice')}>
            <div className="w-14 h-14 bg-slate-50 group-hover:bg-[#C9A961]/10 rounded-2xl flex items-center justify-center mb-3 transition-colors">
              <Plus className="h-6 w-6 text-slate-300 group-hover:text-[#C9A961] transition-colors" />
            </div>
            <p className="text-slate-400 text-sm font-medium">Aucune section personnalisée</p>
            <p className="text-slate-300 text-xs mt-1">Cliquez pour ajouter votre première section</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pageSections.map((section) => (
              <div key={section.id} className={`bg-white rounded-2xl border p-5 transition-all ${section.actif ? 'border-slate-200 shadow-sm' : 'border-slate-100 opacity-60'}`}>
                <div className="flex items-start gap-4">
                  <div className="text-slate-200 mt-1 cursor-grab">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-[#1A3A52]">{section.titre}</h3>
                      <span className="text-xs bg-[#C9A961]/10 text-[#C9A961] px-2 py-0.5 rounded-full font-medium">{TYPES_LABELS[section.type_section] || section.type_section}</span>
                      <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full cursor-pointer hover:bg-slate-100" title="Ordre d'affichage — modifiez via ✏️">
                        ordre: {section.ordre}
                      </span>
                      {!section.actif && <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Masqué</span>}
                    </div>
                    {section.sous_titre && <p className="text-sm text-slate-500 mb-1">{section.sous_titre}</p>}
                    {section.contenu && <p className="text-sm text-slate-400 line-clamp-2 mt-1">{section.contenu}</p>}
                    {section.image_url && (
                      <img src={section.image_url} alt="" className="mt-2 h-14 w-24 object-cover rounded-lg border border-slate-100"
                        onError={e => e.target.style.display = 'none'} />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => toggleMutation.mutate({ id: section.id, actif: !section.actif })}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title={section.actif ? 'Masquer du site' : 'Afficher sur le site'}>
                      {section.actif ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <Button size="sm" variant="outline" onClick={() => { setEditForm({ ...section }); setEditingSection(section); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline"
                      onClick={() => { if (confirm('Supprimer cette section du site ?')) deleteMutation.mutate(section.id); }}
                      className="text-red-500 border-red-200 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modale de choix */}
      {modal === 'choice' && (
        <SectionChoiceModal
          pageLabel={currentPageInfo?.label}
          onChooseAI={() => setModal('ai')}
          onChooseManual={() => setModal('manual')}
          onCancel={() => setModal(null)}
        />
      )}

      {/* Modale IA */}
      {modal === 'ai' && (
        <AISectionModal
          page={activePage}
          existingSections={pageSections}
          onSave={(data) => createMutation.mutate(data)}
          onCancel={() => setModal(null)}
        />
      )}

      {/* Modale manuelle */}
      {modal === 'manual' && (
        <ManualSectionModal
          page={activePage}
          existingSections={pageSections}
          onSave={(data) => createMutation.mutate(data)}
          onCancel={() => setModal(null)}
          isLoading={createMutation.isPending}
        />
      )}

      {/* Modale édition */}
      {editingSection && (
        <EditSectionForm
          form={editForm}
          setForm={setEditForm}
          onSave={() => updateMutation.mutate(editForm)}
          onCancel={() => setEditingSection(null)}
          isLoading={updateMutation.isPending}
        />
      )}
    </div>
  );
}