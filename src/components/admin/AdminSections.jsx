import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Pencil, Trash2, X, Save, Eye, EyeOff, Sparkles,
  Home, TrendingUp, Briefcase, Users, Globe, Leaf, Building2, GripVertical
} from 'lucide-react';
import AISectionModal from './AISectionModal';

const PAGES = [
  { id: 'accueil',     label: 'Accueil',         icon: Home },
  { id: 'strategie',   label: 'Stratégie',        icon: TrendingUp },
  { id: 'missions',    label: 'Nos Missions',      icon: Briefcase },
  { id: 'equipe',      label: 'Notre Histoire',    icon: Users },
  { id: 'ecosysteme',  label: 'Écosystème',        icon: Globe },
  { id: 'durabilite',  label: 'Durabilité',        icon: Leaf },
  { id: 'nos_biens',   label: 'Nos Biens',         icon: Building2 },
];

const TYPES = [
  { id: 'texte',        label: 'Texte simple' },
  { id: 'texte_image',  label: 'Texte + Image' },
  { id: 'chiffres',     label: 'Bloc chiffres clés' },
  { id: 'cta',          label: 'Call-to-action' },
  { id: 'temoignage',   label: 'Témoignage' },
  { id: 'liste',        label: 'Liste à puces' },
];

// Modal d'édition manuelle (pour modification d'une section existante)
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
            <Input value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Sous-titre</label>
            <Input value={form.sous_titre} onChange={e => setForm({ ...form, sous_titre: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Type de section</label>
            <select value={form.type_section} onChange={e => setForm({ ...form, type_section: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md text-sm bg-white">
              {TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Contenu</label>
            <Textarea rows={5} value={form.contenu} onChange={e => setForm({ ...form, contenu: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">URL de l'image (optionnel)</label>
            <Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            {form.image_url && (
              <img src={form.image_url} alt="Preview" className="mt-2 h-24 w-full object-cover rounded-lg"
                onError={e => e.target.style.display = 'none'} />
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Ordre d'affichage</label>
            <Input type="number" value={form.ordre} onChange={e => setForm({ ...form, ordre: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="actif-s" checked={form.actif} onChange={e => setForm({ ...form, actif: e.target.checked })} />
            <label htmlFor="actif-s" className="text-sm text-slate-700">Section visible sur le site</label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={onSave} disabled={isLoading || !form.titre.trim()} className="flex-1 bg-[#1A3A52] hover:bg-[#2A4A6F] text-white">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
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
  const [showAIModal, setShowAIModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null); // null | section object
  const [editForm, setEditForm] = useState({});

  const { data: sections = [] } = useQuery({
    queryKey: ['site-sections'],
    queryFn: () => base44.entities.SiteSection.list('ordre', 200),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.SiteSection.create({ ...data, page: activePage }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['site-sections'] }); setShowAIModal(false); },
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

  const openEdit = (s) => { setEditForm({ ...s }); setEditingSection(s); };

  return (
    <div className="flex gap-6">
      {/* Sidebar pages */}
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
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
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
            <span className="text-sm text-slate-400">{pageSections.length} section{pageSections.length !== 1 ? 's' : ''}</span>
          </div>
          <Button onClick={() => setShowAIModal(true)} className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
            <Sparkles className="h-4 w-4 mr-2" /> Ajouter avec l'IA
          </Button>
        </div>

        {pageSections.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center py-20 text-center cursor-pointer hover:border-[#C9A961] transition-colors"
            onClick={() => setShowAIModal(true)}>
            <Sparkles className="h-10 w-10 text-[#C9A961]/40 mb-3" />
            <p className="text-slate-400 text-sm">Aucune section pour cette page</p>
            <p className="text-slate-300 text-xs mt-1">Cliquez pour ajouter une section avec l'IA</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pageSections.map((section) => {
              const typeInfo = TYPES.find(t => t.id === section.type_section);
              return (
                <div key={section.id} className={`bg-white rounded-2xl border p-5 transition-all ${section.actif ? 'border-slate-200' : 'border-slate-100 opacity-60'}`}>
                  <div className="flex items-start gap-4">
                    <div className="text-slate-300 mt-1 cursor-grab">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-[#1A3A52]">{section.titre}</h3>
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{typeInfo?.label}</span>
                        <span className="text-xs text-slate-400">Ordre #{section.ordre}</span>
                        {!section.actif && <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Masqué</span>}
                      </div>
                      {section.sous_titre && <p className="text-sm text-slate-500 mb-1">{section.sous_titre}</p>}
                      {section.contenu && <p className="text-sm text-slate-400 line-clamp-2">{section.contenu}</p>}
                      {section.image_url && (
                        <img src={section.image_url} alt="" className="mt-2 h-16 w-32 object-cover rounded-lg border border-slate-100"
                          onError={e => e.target.style.display = 'none'} />
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => toggleMutation.mutate({ id: section.id, actif: !section.actif })}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title={section.actif ? 'Masquer' : 'Afficher'}>
                        {section.actif ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <Button size="sm" variant="outline" onClick={() => openEdit(section)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="outline"
                        onClick={() => { if (confirm('Supprimer cette section ?')) deleteMutation.mutate(section.id); }}
                        className="text-red-500 border-red-200 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modale IA */}
      {showAIModal && (
        <AISectionModal
          page={activePage}
          existingSections={pageSections}
          onSave={(data) => createMutation.mutate(data)}
          onCancel={() => setShowAIModal(false)}
        />
      )}

      {/* Modale édition manuelle */}
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