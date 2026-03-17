import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';

const CATEGORIES = ["Marché", "Investissement", "Fiscalité", "Rénovation", "Gouvernance"];

const EMPTY = {
  titre: '', slug: '', extrait: '', contenu: '', categorie: 'Investissement',
  auteur: 'La Foncière Valora', image_url: '', temps_lecture: '5 min',
  date_publication: new Date().toISOString().split('T')[0], publie: true
};

function slugify(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminBlog() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [view, setView] = useState('list'); // 'list' | 'form'

  const { data: articles = [] } = useQuery({
    queryKey: ['articles-blog-admin'],
    queryFn: () => base44.entities.ArticleBlog.list('-date_publication', 100),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editing === 'new'
      ? base44.entities.ArticleBlog.create(data)
      : base44.entities.ArticleBlog.update(editing.id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['articles-blog-admin'] }); setView('list'); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ArticleBlog.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['articles-blog-admin'] }),
  });

  const togglePublish = (article) => {
    base44.entities.ArticleBlog.update(article.id, { publie: !article.publie })
      .then(() => qc.invalidateQueries({ queryKey: ['articles-blog-admin'] }));
  };

  const openNew = () => { setForm(EMPTY); setEditing('new'); setView('form'); };
  const openEdit = (a) => { setForm({ ...a }); setEditing(a); setView('form'); };

  if (view === 'form') {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#1A3A52]">{editing === 'new' ? 'Nouvel article' : 'Modifier l\'article'}</h2>
          <Button variant="outline" onClick={() => { setView('list'); setEditing(null); }}><X className="h-4 w-4 mr-2" /> Annuler</Button>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Titre *</label>
            <Input value={form.titre} onChange={e => {
              const t = e.target.value;
              setForm({...form, titre: t, slug: editing === 'new' ? slugify(t) : form.slug});
            }} placeholder="Titre de l'article" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Slug (URL) *</label>
              <Input value={form.slug} onChange={e => setForm({...form, slug: slugify(e.target.value)})} placeholder="mon-article-slug" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Catégorie</label>
              <select value={form.categorie} onChange={e => setForm({...form, categorie: e.target.value})}
                className="w-full px-3 py-2 border border-input rounded-md text-sm bg-white">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Auteur</label>
              <Input value={form.auteur} onChange={e => setForm({...form, auteur: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Temps de lecture</label>
              <Input value={form.temps_lecture} onChange={e => setForm({...form, temps_lecture: e.target.value})} placeholder="5 min" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Date publication</label>
              <Input type="date" value={form.date_publication} onChange={e => setForm({...form, date_publication: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Image de couverture (URL)</label>
            <Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://images.unsplash.com/..." />
            {form.image_url && <img src={form.image_url} alt="preview" className="mt-2 h-24 rounded-xl object-cover" />}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Extrait *</label>
            <Textarea rows={2} value={form.extrait} onChange={e => setForm({...form, extrait: e.target.value})} placeholder="Résumé court affiché dans la liste du blog..." />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Contenu (Markdown)</label>
            <Textarea rows={15} value={form.contenu} onChange={e => setForm({...form, contenu: e.target.value})}
              className="font-mono text-xs" placeholder="# Titre&#10;&#10;Contenu en Markdown..." />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="publie" checked={form.publie} onChange={e => setForm({...form, publie: e.target.checked})} />
            <label htmlFor="publie" className="text-sm text-slate-700">Publié (visible sur le site)</label>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white px-8">
            <Save className="h-4 w-4 mr-2" /> {saveMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder l\'article'}
          </Button>
          <Button variant="outline" onClick={() => { setView('list'); setEditing(null); }}>Annuler</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#1A3A52]">Gestion du Blog</h2>
          <p className="text-slate-500 text-sm">{articles.length} article{articles.length > 1 ? 's' : ''} • {articles.filter(a => a.publie).length} publié{articles.filter(a => a.publie).length > 1 ? 's' : ''}</p>
        </div>
        <Button onClick={openNew} className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
          <Plus className="h-4 w-4 mr-2" /> Nouvel article
        </Button>
      </div>

      <div className="space-y-3">
        {articles.map(a => (
          <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-4">
            {a.image_url && <img src={a.image_url} alt={a.titre} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{a.categorie}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${a.publie ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {a.publie ? 'Publié' : 'Brouillon'}
                </span>
              </div>
              <p className="font-semibold text-slate-900 text-sm truncate">{a.titre}</p>
              <p className="text-xs text-slate-500 mt-0.5">{a.auteur} • {a.date_publication} • {a.temps_lecture}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button size="sm" variant="outline" onClick={() => togglePublish(a)} title={a.publie ? 'Masquer' : 'Publier'}>
                {a.publie ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </Button>
              <Button size="sm" variant="outline" onClick={() => openEdit(a)}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button size="sm" variant="outline" onClick={() => { if (confirm('Supprimer cet article ?')) deleteMutation.mutate(a.id); }}
                className="text-red-500 border-red-200 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
        {articles.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-400">Aucun article. Cliquez sur "Nouvel article" pour commencer.</p>
          </div>
        )}
      </div>
    </div>
  );
}