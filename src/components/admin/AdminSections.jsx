import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Pencil, Trash2, X, Save, Eye, EyeOff, Sparkles, PenLine,
  Home, TrendingUp, Briefcase, Users, Globe, Leaf, Building2, GripVertical,
  CheckCircle2, Quote, ArrowRight, ChevronDown, ChevronUp
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

// ─── Aperçu miniature fidèle à la charte ───────────────────────────────────
function SectionPreviewMini({ section }) {
  const { type_section, titre, sous_titre, contenu, image_url } = section;
  const lignes = contenu ? contenu.split('\n').filter(l => l.trim()) : [];

  switch (type_section) {
    case 'texte':
      return (
        <div className="bg-white px-8 py-6 text-center rounded-xl border border-slate-100 pointer-events-none select-none">
          {sous_titre && (
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-6 h-0.5 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-xs">{sous_titre}</span>
              <div className="w-6 h-0.5 bg-[#C9A961]" />
            </div>
          )}
          {titre && <h3 className="font-serif text-[#1A3A52] text-base font-semibold mb-2">{titre}</h3>}
          {lignes[0] && <p className="text-slate-500 text-xs line-clamp-2">{lignes[0]}</p>}
        </div>
      );

    case 'texte_image':
      return (
        <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden pointer-events-none select-none">
          <div className="grid grid-cols-2 gap-0">
            <div className="px-5 py-5">
              {sous_titre && <p className="text-[#C9A961] text-xs font-medium uppercase tracking-wider mb-1">{sous_titre}</p>}
              {titre && <h3 className="font-serif text-[#1A3A52] text-sm font-semibold mb-2">{titre}</h3>}
              {lignes[0] && <p className="text-slate-500 text-xs line-clamp-2">{lignes[0]}</p>}
            </div>
            <div className="h-28">
              {image_url
                ? <img src={image_url} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                : <div className="w-full h-full bg-gradient-to-br from-[#1A3A52] to-[#2A4A6F] flex items-center justify-center">
                    <div className="w-8 h-0.5 bg-[#C9A961]" />
                  </div>
              }
            </div>
          </div>
        </div>
      );

    case 'chiffres': {
      const chiffres = lignes.map(l => {
        const p = l.split('|');
        return { valeur: p[0]?.trim(), libelle: p[1]?.trim() || '' };
      }).filter(c => c.valeur).slice(0, 4);
      return (
        <div className="bg-slate-900 rounded-xl border border-slate-700 px-5 py-5 pointer-events-none select-none">
          {titre && <h3 className="font-serif text-white text-sm text-center mb-3">{titre}</h3>}
          <div className="grid grid-cols-4 gap-2">
            {chiffres.length > 0 ? chiffres.map((c, i) => (
              <div key={i} className="bg-white/10 rounded-lg p-2 text-center">
                <p className="text-[#C9A961] font-bold text-sm">{c.valeur}</p>
                <p className="text-white/60 text-xs line-clamp-1">{c.libelle}</p>
              </div>
            )) : (
              <div className="col-span-4 text-center text-white/30 text-xs py-2">Format : valeur | libellé</div>
            )}
          </div>
        </div>
      );
    }

    case 'cta':
      return (
        <div className="bg-[#C9A961] rounded-xl px-6 py-5 text-center pointer-events-none select-none">
          {titre && <h3 className="font-serif text-[#1A3A52] text-sm font-bold mb-1">{titre}</h3>}
          {sous_titre && <p className="text-[#1A3A52]/70 text-xs mb-3">{sous_titre}</p>}
          <span className="inline-flex items-center gap-1 bg-[#1A3A52] text-white text-xs font-semibold px-4 py-1.5 rounded-lg">
            Entrer en relation <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      );

    case 'temoignage':
      return (
        <div className="bg-slate-50 rounded-xl border border-slate-100 px-6 py-5 relative pointer-events-none select-none">
          <Quote className="h-8 w-8 text-[#C9A961]/20 absolute top-3 right-4" />
          {contenu && <p className="text-slate-600 text-xs italic mb-3 line-clamp-2">"{contenu}"</p>}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1A3A52] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-[#C9A961] font-bold text-xs">{titre?.charAt(0) || 'A'}</span>
            </div>
            <div>
              {titre && <p className="font-semibold text-[#1A3A52] text-xs">{titre}</p>}
              {sous_titre && <p className="text-slate-400 text-xs">{sous_titre}</p>}
            </div>
          </div>
        </div>
      );

    case 'liste':
      return (
        <div className="bg-white rounded-xl border border-slate-100 px-5 py-4 pointer-events-none select-none">
          {titre && <h3 className="font-serif text-[#1A3A52] text-sm font-semibold mb-3">{titre}</h3>}
          <div className="space-y-1.5">
            {lignes.slice(0, 3).map((l, i) => (
              <div key={i} className="flex items-start gap-2 p-1.5 bg-slate-50 rounded-lg">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#C9A961] flex-shrink-0 mt-0.5" />
                <span className="text-slate-600 text-xs line-clamp-1">{l.replace(/^[-•*]\s*/, '')}</span>
              </div>
            ))}
            {lignes.length > 3 && <p className="text-xs text-slate-300 pl-2">+{lignes.length - 3} éléments…</p>}
          </div>
        </div>
      );

    default:
      return <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 px-5 py-4 text-slate-400 text-xs text-center">Aperçu non disponible</div>;
  }
}

// ─── Formulaire d'édition inline ────────────────────────────────────────────
function InlineEditForm({ form, setForm, onSave, onCancel, isLoading }) {
  return (
    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1">Titre *</label>
          <Input value={form.titre || ''} onChange={e => setForm({ ...form, titre: e.target.value })} className="text-sm h-8" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1">Sous-titre</label>
          <Input value={form.sous_titre || ''} onChange={e => setForm({ ...form, sous_titre: e.target.value })} className="text-sm h-8" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1">Type</label>
          <select value={form.type_section || 'texte'} onChange={e => setForm({ ...form, type_section: e.target.value })}
            className="w-full px-2 py-1.5 border border-input rounded-md text-xs bg-white h-8">
            {Object.entries(TYPES_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1">Ordre</label>
          <Input type="number" value={form.ordre ?? 0} onChange={e => setForm({ ...form, ordre: parseInt(e.target.value) || 0 })} className="text-sm h-8 w-20" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500 block mb-1">Contenu</label>
        <Textarea rows={4} value={form.contenu || ''} onChange={e => setForm({ ...form, contenu: e.target.value })} className="text-sm resize-none" />
        {form.type_section === 'chiffres' && (
          <p className="text-xs text-slate-400 mt-1">Format : <code className="bg-slate-100 px-1 rounded">valeur | libellé</code> — une ligne par chiffre</p>
        )}
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500 block mb-1">URL image</label>
        <Input value={form.image_url || ''} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="text-sm h-8" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
          <input type="checkbox" checked={!!form.actif} onChange={e => setForm({ ...form, actif: e.target.checked })} className="rounded" />
          Visible sur le site
        </label>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCancel} className="h-7 text-xs">Annuler</Button>
          <Button size="sm" disabled={isLoading || !form.titre?.trim()} onClick={onSave}
            className="h-7 text-xs bg-[#1A3A52] hover:bg-[#2A4A6F] text-white">
            <Save className="h-3 w-3 mr-1" />{isLoading ? 'Sauvegarde…' : 'Sauvegarder'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Carte d'une section ────────────────────────────────────────────────────
function SectionCard({ section, onToggle, onDelete, onUpdate, isUpdating }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const startEdit = () => { setForm({ ...section }); setEditing(true); };
  const cancelEdit = () => setEditing(false);
  const saveEdit = () => onUpdate(form, () => setEditing(false));

  return (
    <div className={`bg-white rounded-2xl border transition-all ${section.actif ? 'border-slate-200 shadow-sm' : 'border-slate-100 opacity-60'}`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <GripVertical className="h-4 w-4 text-slate-200 cursor-grab flex-shrink-0" />
        <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-[#1A3A52] text-sm">{section.titre}</span>
          <span className="text-xs bg-[#C9A961]/10 text-[#C9A961] px-2 py-0.5 rounded-full font-medium">{TYPES_LABELS[section.type_section] || section.type_section}</span>
          <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">#{section.ordre}</span>
          {!section.actif && <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Masqué</span>}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onToggle(section)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            title={section.actif ? 'Masquer du site' : 'Afficher sur le site'}>
            {section.actif ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <button onClick={editing ? cancelEdit : startEdit}
            className={`p-1.5 rounded-lg transition-colors ${editing ? 'text-[#1A3A52] bg-[#1A3A52]/10' : 'text-slate-400 hover:text-[#1A3A52] hover:bg-slate-100'}`}
            title="Modifier">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => { if (confirm('Supprimer cette section ?')) onDelete(section.id); }}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Supprimer">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Aperçu visuel */}
      <div className="px-4 pb-4">
        <SectionPreviewMini section={editing ? form : section} />
      </div>

      {/* Formulaire inline */}
      {editing && (
        <div className="px-4 pb-4">
          <InlineEditForm form={form} setForm={setForm} onSave={saveEdit} onCancel={cancelEdit} isLoading={isUpdating} />
        </div>
      )}
    </div>
  );
}

// ─── Composant principal ─────────────────────────────────────────────────────
export default function AdminSections() {
  const qc = useQueryClient();
  const [activePage, setActivePage] = useState('accueil');
  const [modal, setModal] = useState(null);

  const { data: sections = [] } = useQuery({
    queryKey: ['site-sections'],
    queryFn: () => base44.entities.SiteSection.list('ordre', 200),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.SiteSection.create({ ...data, page: activePage }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['site-sections'] }); setModal(null); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SiteSection.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['site-sections'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SiteSection.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['site-sections'] }),
  });

  const pageSections = sections.filter(s => s.page === activePage).sort((a, b) => a.ordre - b.ordre);
  const currentPageInfo = PAGES.find(p => p.id === activePage);

  const handleUpdate = (sectionId, formData, onDone) => {
    updateMutation.mutate({ id: sectionId, data: formData }, { onSuccess: () => onDone?.() });
  };

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
            <span className="text-sm text-slate-400">{pageSections.length} section{pageSections.length !== 1 ? 's' : ''}</span>
          </div>
          <Button onClick={() => setModal('choice')} className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
            <Plus className="h-4 w-4 mr-2" /> Ajouter une section
          </Button>
        </div>

        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700 flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" />
          <span>Cliquez sur <strong>✏️</strong> d'une section pour modifier son contenu directement. Les changements sont synchronisés en temps réel sur le site.</span>
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
          <div className="space-y-4">
            {pageSections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                onToggle={(s) => updateMutation.mutate({ id: s.id, data: { actif: !s.actif } })}
                onDelete={(id) => deleteMutation.mutate(id)}
                onUpdate={(formData, onDone) => handleUpdate(section.id, formData, onDone)}
                isUpdating={updateMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {modal === 'choice' && (
        <SectionChoiceModal pageLabel={currentPageInfo?.label} onChooseAI={() => setModal('ai')} onChooseManual={() => setModal('manual')} onCancel={() => setModal(null)} />
      )}
      {modal === 'ai' && (
        <AISectionModal page={activePage} existingSections={pageSections} onSave={(data) => createMutation.mutate(data)} onCancel={() => setModal(null)} />
      )}
      {modal === 'manual' && (
        <ManualSectionModal page={activePage} existingSections={pageSections} onSave={(data) => createMutation.mutate(data)} onCancel={() => setModal(null)} isLoading={createMutation.isPending} />
      )}
    </div>
  );
}