import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Edit2, X, Check, ChevronDown, ChevronRight } from 'lucide-react';

const PAGE_LABELS = {
  accueil: 'Accueil',
  strategie: 'Stratégie',
  missions: 'Nos Missions',
  equipe: 'Notre Histoire',
  ecosysteme: 'Écosystème',
  durabilite: 'Durabilité',
  nos_biens: 'Nos Biens',
  global: 'Global / Footer',
};

function EditableField({ content, onSave }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(content.valeur);

  const handleSave = () => {
    onSave(content.id, value);
    setEditing(false);
  };

  const handleCancel = () => {
    setValue(content.valeur);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="space-y-2">
        {content.type_champ === 'textarea' || content.type_champ === 'liste' ? (
          <Textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            rows={content.type_champ === 'liste' ? 6 : 4}
            className="text-sm"
            autoFocus
          />
        ) : (
          <Input
            value={value}
            onChange={e => setValue(e.target.value)}
            className="text-sm"
            autoFocus
          />
        )}
        {content.type_champ === 'liste' && (
          <p className="text-xs text-slate-400">Séparez chaque élément par un retour à la ligne</p>
        )}
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} className="bg-[#C9A961] text-[#1A3A52] hover:bg-[#B8994F] h-7 px-3">
            <Check className="h-3 w-3 mr-1" /> Enregistrer
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancel} className="h-7 px-3">
            <X className="h-3 w-3 mr-1" /> Annuler
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 group">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-700 whitespace-pre-wrap line-clamp-3">{content.valeur}</p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 flex-shrink-0"
      >
        <Edit2 className="h-3 w-3" />
      </Button>
    </div>
  );
}

function PageSection({ page, contents, onSave }) {
  const [open, setOpen] = useState(false);
  const pageContents = contents.filter(c => c.page === page);
  if (pageContents.length === 0) return null;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          {open ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
          <span className="font-semibold text-[#1A3A52]">{PAGE_LABELS[page] || page}</span>
          <span className="text-xs text-slate-400 bg-slate-200 rounded-full px-2 py-0.5">{pageContents.length} champs</span>
        </div>
      </button>
      {open && (
        <div className="divide-y divide-slate-100">
          {pageContents.map(content => (
            <div key={content.id} className="px-5 py-4">
              <p className="text-xs font-semibold text-[#C9A961] uppercase tracking-wider mb-2">{content.label}</p>
              <EditableField content={content} onSave={onSave} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminContenu() {
  const queryClient = useQueryClient();
  const { data: contents = [], isLoading } = useQuery({
    queryKey: ['site-content'],
    queryFn: () => base44.entities.SiteContent.list(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, valeur }) => base44.entities.SiteContent.update(id, { valeur }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['site-content'] }),
  });

  const handleSave = (id, valeur) => {
    updateMutation.mutate({ id, valeur });
  };

  const pages = ['accueil', 'strategie', 'missions', 'equipe', 'ecosysteme', 'durabilite', 'nos_biens', 'global'];

  if (isLoading) {
    return <div className="flex items-center justify-center py-16 text-slate-500">Chargement...</div>;
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        <p className="text-lg font-semibold mb-2">Aucun contenu synchronisé</p>
        <p className="text-sm">Rechargez la page après avoir lancé la synchronisation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pages.map(page => (
        <PageSection key={page} page={page} contents={contents} onSave={handleSave} />
      ))}
    </div>
  );
}