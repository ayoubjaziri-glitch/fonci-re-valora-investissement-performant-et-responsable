import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, X, Check, ChevronDown, ChevronRight, FileText, Search } from 'lucide-react';

const PAGE_LABELS = {
  accueil: { label: 'Accueil', emoji: '🏠' },
  strategie: { label: 'Stratégie', emoji: '📈' },
  missions: { label: 'Nos Missions', emoji: '🎯' },
  equipe: { label: 'Notre Histoire', emoji: '👥' },
  ecosysteme: { label: 'Écosystème', emoji: '🤝' },
  durabilite: { label: 'Durabilité', emoji: '🌿' },
  nos_biens: { label: 'Nos Biens', emoji: '🏢' },
  global: { label: 'Global / Footer', emoji: '🌐' },
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
            className="text-sm border-[#C9A961] focus:ring-[#C9A961]"
            autoFocus
          />
        ) : (
          <Input
            value={value}
            onChange={e => setValue(e.target.value)}
            className="text-sm border-[#C9A961] focus:ring-[#C9A961]"
            autoFocus
          />
        )}
        {content.type_champ === 'liste' && (
          <p className="text-xs text-slate-400 italic">Un élément par ligne</p>
        )}
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} className="bg-[#C9A961] text-[#1A3A52] hover:bg-[#B8994F] h-7 px-3 text-xs font-semibold">
            <Check className="h-3 w-3 mr-1" /> Enregistrer
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancel} className="h-7 px-3 text-xs">
            <X className="h-3 w-3 mr-1" /> Annuler
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 group cursor-default" onClick={() => setEditing(true)}>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-700 whitespace-pre-wrap line-clamp-2 group-hover:text-slate-900 transition-colors">
          {content.valeur || <span className="italic text-slate-400">— vide —</span>}
        </p>
      </div>
      <button
        onClick={e => { e.stopPropagation(); setEditing(true); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 w-7 h-7 rounded-md bg-[#C9A961]/10 hover:bg-[#C9A961]/20 flex items-center justify-center"
      >
        <Edit2 className="h-3 w-3 text-[#C9A961]" />
      </button>
    </div>
  );
}

function PageSection({ page, contents, onSave, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const pageContents = contents.filter(c => c.page === page);
  if (pageContents.length === 0) return null;

  const { label, emoji } = PAGE_LABELS[page] || { label: page, emoji: '📄' };

  // Groupe les champs par préfixe logique (ex: home_hero_, home_atouts_...)
  const groups = pageContents.reduce((acc, c) => {
    const parts = c.cle.split('_');
    // Prend les 2 premiers segments comme groupe (ex: home_hero)
    const groupKey = parts.slice(0, 2).join('_');
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(c);
    return acc;
  }, {});

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{emoji}</span>
          <span className="font-semibold text-[#1A3A52] text-base">{label}</span>
          <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5 font-medium">
            {pageContents.length} champ{pageContents.length > 1 ? 's' : ''}
          </span>
        </div>
        {open
          ? <ChevronDown className="h-4 w-4 text-slate-400" />
          : <ChevronRight className="h-4 w-4 text-slate-400" />
        }
      </button>

      {open && (
        <div className="border-t border-slate-100">
          {Object.entries(groups).map(([groupKey, items]) => (
            <div key={groupKey} className="border-b border-slate-50 last:border-0">
              {/* Sous-groupe header si plus d'un groupe */}
              {Object.keys(groups).length > 1 && (
                <div className="px-5 py-2 bg-slate-50 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {groupKey.replace(/_/g, ' ')}
                  </p>
                </div>
              )}
              <div className="divide-y divide-slate-50">
                {items.map(content => (
                  <div key={content.id} className="px-5 py-3 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start gap-3">
                      {/* Label */}
                      <div className="w-48 flex-shrink-0 pt-0.5">
                        <p className="text-xs font-semibold text-[#1A3A52] leading-tight">{content.label}</p>
                        <p className="text-xs text-slate-300 mt-0.5 font-mono">{content.cle}</p>
                      </div>
                      {/* Valeur */}
                      <div className="flex-1 min-w-0">
                        <EditableField content={content} onSave={onSave} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminContenu() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: contents = [], isLoading } = useQuery({
    queryKey: ['site-content'],
    queryFn: () => base44.entities.SiteContent.list(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, valeur }) => base44.entities.SiteContent.update(id, { valeur }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['site-content'] }),
  });

  const handleSave = (id, valeur) => updateMutation.mutate({ id, valeur });

  const pages = ['accueil', 'strategie', 'missions', 'equipe', 'ecosysteme', 'durabilite', 'nos_biens', 'global'];

  const filteredContents = search.trim()
    ? contents.filter(c =>
        c.label?.toLowerCase().includes(search.toLowerCase()) ||
        c.valeur?.toLowerCase().includes(search.toLowerCase()) ||
        c.cle?.toLowerCase().includes(search.toLowerCase())
      )
    : contents;

  if (isLoading) {
    return <div className="flex items-center justify-center py-16 text-slate-400 text-sm">Chargement...</div>;
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 font-semibold mb-1">Aucun contenu synchronisé</p>
        <p className="text-xs text-slate-400">Rechargez après avoir lancé la synchronisation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Rechercher un champ ou un texte..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 text-sm border-slate-200"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600" />
          </button>
        )}
      </div>

      {/* Résultats filtrés */}
      {search.trim() ? (
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500">{filteredContents.length} résultat{filteredContents.length > 1 ? 's' : ''} pour « {search} »</p>
          </div>
          <div className="divide-y divide-slate-50">
            {filteredContents.map(content => (
              <div key={content.id} className="px-5 py-3 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-48 flex-shrink-0 pt-0.5">
                    <p className="text-xs font-semibold text-[#1A3A52] leading-tight">{content.label}</p>
                    <p className="text-xs text-slate-300 mt-0.5 font-mono">{content.cle}</p>
                    <span className="text-xs text-[#C9A961] font-medium">{PAGE_LABELS[content.page]?.label || content.page}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <EditableField content={content} onSave={handleSave} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        pages.map((page, i) => (
          <PageSection
            key={page}
            page={page}
            contents={filteredContents}
            onSave={handleSave}
            defaultOpen={i === 0}
          />
        ))
      )}
    </div>
  );
}