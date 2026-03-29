import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus, Trash2, Edit2, Save, X, Upload, Download, FileText,
  TrendingUp, Building2, Newspaper, Map, Rocket, Settings,
  CheckCircle2, Clock, AlertCircle, BarChart3, Euro, Users
} from 'lucide-react';
import CRMInvestisseurs from '../components/admin/CRMInvestisseurs';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toast = (msg) => alert(msg);

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, onAdd, addLabel }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-[#C9A961]" />
        <h2 className="text-xl font-semibold text-[#1A3A52]">{title}</h2>
      </div>
      {onAdd && (
        <Button onClick={onAdd} className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
          <Plus className="h-4 w-4 mr-2" /> {addLabel || 'Ajouter'}
        </Button>
      )}
    </div>
  );
}

// ─── KPIs & Métriques ─────────────────────────────────────────────────────────
function KpisSection() {
  const qc = useQueryClient();
  const { data: configs = [] } = useQuery({
    queryKey: ['ea-config'],
    queryFn: () => base44.entities.EspaceAssocieConfig.list(),
  });

  // Default config structure
  const defaultConfig = {
    levee_fonds: { titre: 'Série A — Levée de Fonds Inaugurale', description: 'Levée de fonds pour le financement de nos premières acquisitions résidentielles en zones tendues.', objectif: 250000, collecte: 187500, souscripteurs: 12, dateCloture: '31 Mars 2026', ticketMinimum: '10 000 €', typeTitre: 'Actions ordinaires PEA-PME' },
    valorisation: { valeurActuelle: 3200000, evolution: '+8.5%', nombreActions: 32000, valeurAction: 100, plusValueAction: '+8.5%', dateValo: '31 Déc 2025', plusValueTotal: 250000 },
    kpis: [
      { label: 'Valeur du Patrimoine', value: '3 200 000 €', change: '+8,5%', positive: true, detail: 'Gross Asset Value réactualisée' },
      { label: 'Rendement Net Annuel', value: '10,2%', change: '+0,7 pts', positive: true, detail: 'TRI net de frais' },
      { label: 'Ratio LTC', value: '68%', change: '-2%', positive: true, detail: 'Loan To Cost' },
      { label: 'Loyers Annuels', value: '185 000 €', change: '+12%', positive: true, detail: 'Revenus locatifs bruts' },
    ],
    indicateurs: { occupation: '93,5%', delaiLocation: '18 jours', dette: '2 180 000 €', nbActifs: '4 immeubles', totalLots: '42 lots', couvertureLoyers: '~1,4x', ltv: '68%' },
    energie: { co2: '-450t', conso: '-42%' },
    resultats: { loyers: '185 000 €', tauxOccupation: '93,5%', resultatNet: '32 500 €', datePub: '15 janvier 2026', prochainResultat: '≈ 28 000 €', dateProchaineResult: '15 avril 2026' },
    gouvernance: { texte: "Accès réservé aux associés élus par les catégories B et C pour les décisions stratégiques (acquisitions, arbitrages, emprunts).", stratégieDette: "Amortissement progressif sur 20 ans. Effet de levier maîtrisé avec LTV cible ≤ 80% à l'acquisition." },
  };

  const getSection = (key) => {
    const found = configs.find(c => c.cle === key);
    if (found) {
      try { return JSON.parse(found.donnees); } catch { return defaultConfig[key]; }
    }
    return defaultConfig[key];
  };

  const saveSection = useMutation({
    mutationFn: async ({ key, section, data }) => {
      const existing = configs.find(c => c.cle === key);
      const payload = { cle: key, section, donnees: JSON.stringify(data) };
      if (existing) return base44.entities.EspaceAssocieConfig.update(existing.id, payload);
      return base44.entities.EspaceAssocieConfig.create(payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ea-config'] }); toast('Sauvegardé !'); },
  });

  const [levee, setLevee] = useState(null);
  const [valo, setValo] = useState(null);
  const [kpiList, setKpiList] = useState(null);
  const [indic, setIndic] = useState(null);
  const [energie, setEnergie] = useState(null);
  const [resultats, setResultats] = useState(null);
  const [gouvernance, setGouvernance] = useState(null);

  const lv = levee ?? getSection('levee_fonds');
  const va = valo ?? getSection('valorisation');
  const kp = kpiList ?? getSection('kpis');
  const ind = indic ?? getSection('indicateurs');
  const en = energie ?? getSection('energie');
  const res = resultats ?? getSection('resultats');

  return (
    <div className="space-y-8">
      {/* Levée de fonds */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-[#C9A961]" /> Levée de Fonds en Cours</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { key: 'titre', label: 'Titre de la levée', type: 'text' },
            { key: 'description', label: 'Description', type: 'text' },
            { key: 'objectif', label: 'Objectif (€)', type: 'number' },
            { key: 'collecte', label: 'Collecté (€)', type: 'number' },
            { key: 'souscripteurs', label: 'Souscripteurs', type: 'number' },
            { key: 'dateCloture', label: 'Date de clôture', type: 'text' },
            { key: 'ticketMinimum', label: 'Ticket minimum', type: 'text' },
            { key: 'typeTitre', label: 'Type de titre', type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <Label className="text-sm">{f.label}</Label>
              <Input
                type={f.type}
                value={lv[f.key]}
                onChange={e => setLevee({ ...lv, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                className="mt-1"
              />
            </div>
          ))}
        </div>
        <Button onClick={() => saveSection.mutate({ key: 'levee_fonds', section: 'levee_fonds', data: lv })}
          className="mt-4 bg-[#1A3A52] hover:bg-[#2A4A6F] text-white"><Save className="h-4 w-4 mr-2" /> Sauvegarder</Button>
      </div>

      {/* Valorisation */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2"><Euro className="h-5 w-5 text-[#C9A961]" /> Valorisation de la Société</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { key: 'valeurActuelle', label: 'Valorisation globale (€)', type: 'number' },
            { key: 'evolution', label: 'Évolution', type: 'text' },
            { key: 'nombreActions', label: 'Nombre d\'actions', type: 'number' },
            { key: 'valeurAction', label: 'Valeur action (€)', type: 'number' },
            { key: 'plusValueAction', label: 'Plus-value action', type: 'text' },
            { key: 'dateValo', label: 'Date valorisation', type: 'text' },
            { key: 'plusValueTotal', label: 'Plus-value totale (€)', type: 'number' },
          ].map(f => (
            <div key={f.key}>
              <Label className="text-sm">{f.label}</Label>
              <Input
                type={f.type}
                value={va[f.key]}
                onChange={e => setValo({ ...va, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                className="mt-1"
              />
            </div>
          ))}
        </div>
        <Button onClick={() => saveSection.mutate({ key: 'valorisation', section: 'valorisation', data: va })}
          className="mt-4 bg-[#1A3A52] hover:bg-[#2A4A6F] text-white"><Save className="h-4 w-4 mr-2" /> Sauvegarder</Button>
      </div>

      {/* KPIs */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-[#C9A961]" /> KPIs Principaux</h3>
        <div className="space-y-4">
          {kp.map((kpi, i) => (
            <div key={i} className="grid grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl">
              <div><Label className="text-xs">Valeur</Label><Input value={kpi.value} onChange={e => { const n=[...kp]; n[i]={...n[i],value:e.target.value}; setKpiList(n); }} className="mt-1 h-8 text-sm" /></div>
              <div><Label className="text-xs">Variation</Label><Input value={kpi.change} onChange={e => { const n=[...kp]; n[i]={...n[i],change:e.target.value}; setKpiList(n); }} className="mt-1 h-8 text-sm" /></div>
              <div><Label className="text-xs">Détail</Label><Input value={kpi.detail} onChange={e => { const n=[...kp]; n[i]={...n[i],detail:e.target.value}; setKpiList(n); }} className="mt-1 h-8 text-sm" /></div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" checked={kpi.positive} onChange={e => { const n=[...kp]; n[i]={...n[i],positive:e.target.checked}; setKpiList(n); }} />
                  Positif
                </label>
              </div>
              <div className="col-span-4"><Label className="text-xs">Libellé</Label><Input value={kpi.label} onChange={e => { const n=[...kp]; n[i]={...n[i],label:e.target.value}; setKpiList(n); }} className="mt-1 h-8 text-sm" /></div>
            </div>
          ))}
        </div>
        <Button onClick={() => saveSection.mutate({ key: 'kpis', section: 'kpis', data: kp })}
          className="mt-4 bg-[#1A3A52] hover:bg-[#2A4A6F] text-white"><Save className="h-4 w-4 mr-2" /> Sauvegarder</Button>
      </div>

      {/* Indicateurs */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-semibold text-[#1A3A52] mb-4">Indicateurs Clés</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { key: 'occupation', label: 'Taux d\'occupation' },
            { key: 'delaiLocation', label: 'Délai moyen de location' },
            { key: 'dette', label: 'Dette résiduelle' },
            { key: 'nbActifs', label: 'Nombre d\'actifs' },
            { key: 'totalLots', label: 'Total lots' },
            { key: 'couvertureLoyers', label: 'Couverture loyers/dette' },
            { key: 'ltv', label: 'LTV (Loan to Value)' },
          ].map(f => (
            <div key={f.key}>
              <Label className="text-sm">{f.label}</Label>
              <Input value={ind[f.key]} onChange={e => setIndic({ ...ind, [f.key]: e.target.value })} className="mt-1" />
            </div>
          ))}
        </div>
        <Button onClick={() => saveSection.mutate({ key: 'indicateurs', section: 'indicateurs', data: ind })}
          className="mt-4 bg-[#1A3A52] hover:bg-[#2A4A6F] text-white"><Save className="h-4 w-4 mr-2" /> Sauvegarder</Button>
      </div>

      {/* Énergie */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-semibold text-[#1A3A52] mb-4">Performance Énergétique</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>CO₂ économisées/an</Label><Input value={en.co2} onChange={e => setEnergie({...en, co2: e.target.value})} className="mt-1" /></div>
          <div><Label>Réduction conso énergétique</Label><Input value={en.conso} onChange={e => setEnergie({...en, conso: e.target.value})} className="mt-1" /></div>
        </div>
        <Button onClick={() => saveSection.mutate({ key: 'energie', section: 'energie', data: en })}
          className="mt-4 bg-[#1A3A52] hover:bg-[#2A4A6F] text-white"><Save className="h-4 w-4 mr-2" /> Sauvegarder</Button>
      </div>

      {/* Résultats */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-semibold text-[#1A3A52] mb-4">Revenus & Résultats</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { key: 'loyers', label: 'Revenus locatifs annuels' },
            { key: 'tauxOccupation', label: 'Taux d\'occupation moyen' },
            { key: 'resultatNet', label: 'Résultat Net (dernier trimestre)' },
            { key: 'datePub', label: 'Date de publication' },
            { key: 'prochainResultat', label: 'Prochain résultat net (estimé)' },
            { key: 'dateProchaineResult', label: 'Date prochain résultat' },
          ].map(f => (
            <div key={f.key}>
              <Label className="text-sm">{f.label}</Label>
              <Input value={res[f.key]} onChange={e => setResultats({...res, [f.key]: e.target.value})} className="mt-1" />
            </div>
          ))}
        </div>
        <Button onClick={() => saveSection.mutate({ key: 'resultats', section: 'resultats', data: res })}
          className="mt-4 bg-[#1A3A52] hover:bg-[#2A4A6F] text-white"><Save className="h-4 w-4 mr-2" /> Sauvegarder</Button>
      </div>

      {/* Gouvernance */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2">🏛️ Gouvernance & Textes</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-sm">Texte Comité Opérationnel</Label>
            <textarea
              value={(gouvernance ?? getSection('gouvernance'))?.texte || ''}
              onChange={e => setGouvernance({ ...(gouvernance ?? getSection('gouvernance')), texte: e.target.value })}
              className="mt-1 w-full border border-slate-200 rounded-lg p-3 text-sm resize-none h-24"
            />
          </div>
          <div>
            <Label className="text-sm">Stratégie de la Dette (encart)</Label>
            <textarea
              value={(gouvernance ?? getSection('gouvernance'))?.stratégieDette || ''}
              onChange={e => setGouvernance({ ...(gouvernance ?? getSection('gouvernance')), stratégieDette: e.target.value })}
              className="mt-1 w-full border border-slate-200 rounded-lg p-3 text-sm resize-none h-20"
            />
          </div>
        </div>
        <Button onClick={() => saveSection.mutate({ key: 'gouvernance', section: 'resultats', data: gouvernance ?? getSection('gouvernance') })}
          className="mt-4 bg-[#1A3A52] hover:bg-[#2A4A6F] text-white"><Save className="h-4 w-4 mr-2" /> Sauvegarder</Button>
      </div>
    </div>
  );
}

// ─── Documents ────────────────────────────────────────────────────────────────
function DocumentsSection() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nom: '', categorie: 'Juridique', type_acces: 'privé', date_document: '', file_url: '' });
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState(null);

  const { data: docs = [] } = useQuery({
    queryKey: ['docs-associe'],
    queryFn: () => base44.entities.DocumentAssocie.list('-date_document'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => editId ? base44.entities.DocumentAssocie.update(editId, data) : base44.entities.DocumentAssocie.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['docs-associe'] }); setModal(false); setEditId(null); setForm({ nom: '', categorie: 'Juridique', type_acces: 'privé', date_document: '', file_url: '' }); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.DocumentAssocie.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['docs-associe'] }),
  });

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const taille = (file.size / 1024 / 1024).toFixed(1) + ' MB';
    setForm(f => ({ ...f, file_url, taille }));
    setUploading(false);
  };

  const openEdit = (doc) => {
    setEditId(doc.id);
    setForm({ nom: doc.nom, categorie: doc.categorie, type_acces: doc.type_acces, date_document: doc.date_document || '', file_url: doc.file_url || '', taille: doc.taille || '' });
    setModal(true);
  };

  return (
    <div>
      <SectionHeader icon={FileText} title="Gestion des Documents" onAdd={() => { setEditId(null); setForm({ nom: '', categorie: 'Juridique', type_acces: 'privé', date_document: '', file_url: '' }); setModal(true); }} addLabel="Ajouter un document" />

      <div className="space-y-2">
        {docs.map(doc => (
          <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:shadow-sm transition-shadow">
            <div className="flex-1">
              <p className="font-medium text-slate-900">{doc.nom}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{doc.categorie}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${doc.type_acces === 'public' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{doc.type_acces}</span>
                {doc.date_document && <span className="text-xs text-slate-500">{doc.date_document}</span>}
                {doc.taille && <span className="text-xs text-slate-400">{doc.taille}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {doc.file_url && <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-[#C9A961] hover:text-[#B8994F]"><Download className="h-5 w-5" /></a>}
              <button onClick={() => openEdit(doc)} className="text-slate-400 hover:text-[#1A3A52]"><Edit2 className="h-5 w-5" /></button>
              <button onClick={() => { if (confirm('Supprimer ce document ?')) deleteMutation.mutate(doc.id); }} className="text-slate-400 hover:text-red-500"><Trash2 className="h-5 w-5" /></button>
            </div>
          </div>
        ))}
        {docs.length === 0 && <p className="text-center text-slate-400 py-8">Aucun document. Ajoutez-en un.</p>}
      </div>

      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editId ? 'Modifier' : 'Ajouter'} un document</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nom du document</Label><Input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Catégorie</Label>
                <Select value={form.categorie} onValueChange={v => setForm({...form, categorie: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{['Juridique','Financier','Fiscal','ESG','Gouvernance','Investissement','Autre'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Accès</Label>
                <Select value={form.type_acces} onValueChange={v => setForm({...form, type_acces: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="privé">Privé</SelectItem><SelectItem value="public">Public</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Date du document</Label><Input type="date" value={form.date_document} onChange={e => setForm({...form, date_document: e.target.value})} className="mt-1" /></div>
            <div>
              <Label>Fichier</Label>
              <label className="mt-1 flex items-center gap-3 p-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-[#C9A961] transition-colors">
                <Upload className="h-5 w-5 text-slate-400" />
                <span className="text-sm text-slate-600">{uploading ? 'Upload en cours...' : form.file_url ? '✓ Fichier uploadé' : 'Choisir un fichier'}</span>
                <input type="file" className="hidden" onChange={handleFile} />
              </label>
              {form.file_url && <p className="text-xs text-emerald-600 mt-1 truncate">{form.file_url}</p>}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => createMutation.mutate(form)} className="flex-1 bg-[#1A3A52] text-white" disabled={!form.nom}>
                <Save className="h-4 w-4 mr-2" /> {editId ? 'Mettre à jour' : 'Créer'}
              </Button>
              <Button variant="outline" onClick={() => setModal(false)}><X className="h-4 w-4" /></Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Actualités ───────────────────────────────────────────────────────────────
function ActualitesSection() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ titre: '', description: '', type: 'note', date_publication: new Date().toISOString().split('T')[0] });
  const [editId, setEditId] = useState(null);

  const { data: actu = [] } = useQuery({
    queryKey: ['actu-associe'],
    queryFn: () => base44.entities.ActualiteAssocie.list('-date_publication'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => editId ? base44.entities.ActualiteAssocie.update(editId, data) : base44.entities.ActualiteAssocie.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['actu-associe'] }); setModal(false); setEditId(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ActualiteAssocie.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['actu-associe'] }),
  });

  const typeColors = { acquisition: 'bg-amber-100 text-amber-700', travaux: 'bg-blue-100 text-blue-700', note: 'bg-slate-100 text-slate-700', levee_fonds: 'bg-emerald-100 text-emerald-700', gouvernance: 'bg-purple-100 text-purple-700', autre: 'bg-gray-100 text-gray-700' };

  const openEdit = (a) => { setEditId(a.id); setForm({ titre: a.titre, description: a.description, type: a.type, date_publication: a.date_publication }); setModal(true); };

  return (
    <div>
      <SectionHeader icon={Newspaper} title="Actualités Associés" onAdd={() => { setEditId(null); setForm({ titre: '', description: '', type: 'note', date_publication: new Date().toISOString().split('T')[0] }); setModal(true); }} addLabel="Ajouter une actualité" />

      <div className="space-y-3">
        {actu.map(a => (
          <div key={a.id} className="flex items-start justify-between p-4 bg-white rounded-xl border border-slate-200">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[a.type] || typeColors.autre}`}>{a.type}</span>
                <span className="text-xs text-slate-500">{a.date_publication}</span>
              </div>
              <h4 className="font-semibold text-slate-900">{a.titre}</h4>
              <p className="text-sm text-slate-600 mt-1">{a.description}</p>
            </div>
            <div className="flex gap-2 ml-4 flex-shrink-0">
              <button onClick={() => openEdit(a)} className="text-slate-400 hover:text-[#1A3A52]"><Edit2 className="h-4 w-4" /></button>
              <button onClick={() => { if (confirm('Supprimer ?')) deleteMutation.mutate(a.id); }} className="text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {actu.length === 0 && <p className="text-center text-slate-400 py-8">Aucune actualité.</p>}
      </div>

      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editId ? 'Modifier' : 'Ajouter'} une actualité</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Titre</Label><Input value={form.titre} onChange={e => setForm({...form, titre: e.target.value})} className="mt-1" /></div>
            <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{['acquisition','travaux','note','levee_fonds','gouvernance','autre'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Date</Label><Input type="date" value={form.date_publication} onChange={e => setForm({...form, date_publication: e.target.value})} className="mt-1" /></div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => createMutation.mutate(form)} className="flex-1 bg-[#1A3A52] text-white" disabled={!form.titre}><Save className="h-4 w-4 mr-2" />{editId ? 'Mettre à jour' : 'Créer'}</Button>
              <Button variant="outline" onClick={() => setModal(false)}><X className="h-4 w-4" /></Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Acquisitions & Patrimoine ────────────────────────────────────────────────
function AcquisitionsSection() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const emptyForm = { ville: '', prix: '', lots: 0, dpe: '', statut: 'Négociation', avancement: 0, livraison: '', type: 'acquisition_en_cours', valeur: '', occupation: '' };
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const { data: items = [] } = useQuery({
    queryKey: ['acq-associe'],
    queryFn: () => base44.entities.AcquisitionAssocie.list(),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editId ? base44.entities.AcquisitionAssocie.update(editId, data) : base44.entities.AcquisitionAssocie.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['acq-associe'] }); setModal(false); setEditId(null); setForm(emptyForm); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AcquisitionAssocie.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['acq-associe'] }),
  });

  const openEdit = (item) => { setEditId(item.id); setForm({ ville: item.ville, prix: item.prix||'', lots: item.lots||0, dpe: item.dpe||'', statut: item.statut, avancement: item.avancement||0, livraison: item.livraison||'', type: item.type||'acquisition_en_cours', valeur: item.valeur||'', occupation: item.occupation||'' }); setModal(true); };

  const statutColors = { 'Négociation': 'bg-amber-100 text-amber-700', 'Due Diligence': 'bg-blue-100 text-blue-700', 'Compromis': 'bg-indigo-100 text-indigo-700', 'Acte': 'bg-purple-100 text-purple-700', 'Travaux': 'bg-orange-100 text-orange-700', 'Livré': 'bg-emerald-100 text-emerald-700' };
  const typeLabels = { acquisition_en_cours: 'Acquisition en cours', patrimoine: 'Patrimoine', chantier: 'Chantier' };

  return (
    <div>
      <SectionHeader icon={Building2} title="Acquisitions & Patrimoine" onAdd={() => { setEditId(null); setForm(emptyForm); setModal(true); }} addLabel="Ajouter" />

      {['acquisition_en_cours','patrimoine','chantier'].map(type => {
        const filtered = items.filter(i => i.type === type);
        if (filtered.length === 0 && type !== 'acquisition_en_cours') return null;
        return (
          <div key={type} className="mb-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">{typeLabels[type]}</h3>
            <div className="space-y-2">
              {filtered.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">{item.ville}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statutColors[item.statut] || 'bg-slate-100 text-slate-700'}`}>{item.statut}</span>
                    </div>
                    <p className="text-sm text-slate-600">{item.lots ? `${item.lots} lots` : ''} {item.dpe ? `• ${item.dpe}` : ''} {item.prix ? `• ${item.prix}` : ''} {item.valeur ? `• ${item.valeur}` : ''}</p>
                    {item.avancement > 0 && (
                      <div className="mt-2 h-1.5 bg-slate-100 rounded-full w-48"><div className="h-full bg-[#C9A961] rounded-full" style={{width:`${item.avancement}%`}} /></div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="text-slate-400 hover:text-[#1A3A52]"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => { if (confirm('Supprimer ?')) deleteMutation.mutate(item.id); }} className="text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <p className="text-sm text-slate-400 italic">Aucun élément</p>}
            </div>
          </div>
        );
      })}

      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? 'Modifier' : 'Ajouter'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(typeLabels).map(([v,l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Ville / Adresse</Label><Input value={form.ville} onChange={e => setForm({...form, ville: e.target.value})} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Prix</Label><Input value={form.prix} onChange={e => setForm({...form, prix: e.target.value})} placeholder="1 850 000 €" className="mt-1" /></div>
              <div><Label>Lots</Label><Input type="number" value={form.lots} onChange={e => setForm({...form, lots: Number(e.target.value)})} className="mt-1" /></div>
              <div><Label>DPE</Label><Input value={form.dpe} onChange={e => setForm({...form, dpe: e.target.value})} placeholder="F → B" className="mt-1" /></div>
              <div>
                <Label>Statut</Label>
                <Select value={form.statut} onValueChange={v => setForm({...form, statut: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{['Négociation','Due Diligence','Compromis','Acte','Travaux','Livré'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Avancement (%)</Label><Input type="number" min={0} max={100} value={form.avancement} onChange={e => setForm({...form, avancement: Number(e.target.value)})} className="mt-1" /></div>
              <div><Label>Livraison prévue</Label><Input value={form.livraison} onChange={e => setForm({...form, livraison: e.target.value})} placeholder="Juin 2026" className="mt-1" /></div>
              <div><Label>Valeur (patrimoine)</Label><Input value={form.valeur} onChange={e => setForm({...form, valeur: e.target.value})} placeholder="980 000 €" className="mt-1" /></div>
              <div><Label>Occupation</Label><Input value={form.occupation} onChange={e => setForm({...form, occupation: e.target.value})} placeholder="87%" className="mt-1" /></div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => saveMutation.mutate(form)} className="flex-1 bg-[#1A3A52] text-white" disabled={!form.ville}><Save className="h-4 w-4 mr-2" />{editId ? 'Mettre à jour' : 'Créer'}</Button>
              <Button variant="outline" onClick={() => setModal(false)}><X className="h-4 w-4" /></Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Roadmap ──────────────────────────────────────────────────────────────────
function RoadmapSection() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const emptyForm = { etape: '', date_prevue: '', statut: 'planifie', avancement: 0, ordre: 0 };
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const { data: items = [] } = useQuery({
    queryKey: ['roadmap-associe'],
    queryFn: () => base44.entities.RoadmapAssocie.list('ordre'),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editId ? base44.entities.RoadmapAssocie.update(editId, data) : base44.entities.RoadmapAssocie.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['roadmap-associe'] }); setModal(false); setEditId(null); setForm(emptyForm); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.RoadmapAssocie.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roadmap-associe'] }),
  });

  const openEdit = (item) => { setEditId(item.id); setForm({ etape: item.etape, date_prevue: item.date_prevue, statut: item.statut, avancement: item.avancement||0, ordre: item.ordre||0 }); setModal(true); };

  const statutIcon = { planifie: <Clock className="h-5 w-5 text-slate-400" />, en_cours: <CheckCircle2 className="h-5 w-5 text-[#C9A961]" />, termine: <CheckCircle2 className="h-5 w-5 text-emerald-500" /> };

  return (
    <div>
      <SectionHeader icon={Rocket} title="Roadmap" onAdd={() => { setEditId(null); setForm({...emptyForm, ordre: items.length}); setModal(true); }} addLabel="Ajouter une étape" />

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200">
            <div className="flex-shrink-0">{statutIcon[item.statut] || statutIcon.planifie}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-slate-900">{item.etape}</h4>
                <span className="text-xs text-slate-500">{item.date_prevue}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${item.statut==='en_cours' ? 'bg-amber-100 text-amber-700' : item.statut==='termine' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{item.statut}</span>
              </div>
              {item.avancement > 0 && (
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1.5 bg-slate-100 rounded-full w-32"><div className="h-full bg-[#C9A961] rounded-full" style={{width:`${item.avancement}%`}} /></div>
                  <span className="text-xs text-slate-500">{item.avancement}%</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(item)} className="text-slate-400 hover:text-[#1A3A52]"><Edit2 className="h-4 w-4" /></button>
              <button onClick={() => { if (confirm('Supprimer ?')) deleteMutation.mutate(item.id); }} className="text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-slate-400 py-8">Aucune étape.</p>}
      </div>

      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editId ? 'Modifier' : 'Ajouter'} une étape</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Étape</Label><Input value={form.etape} onChange={e => setForm({...form, etape: e.target.value})} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Date prévue</Label><Input value={form.date_prevue} onChange={e => setForm({...form, date_prevue: e.target.value})} placeholder="Q1 2026" className="mt-1" /></div>
              <div>
                <Label>Statut</Label>
                <Select value={form.statut} onValueChange={v => setForm({...form, statut: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planifie">Planifié</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="termine">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Avancement (%)</Label><Input type="number" min={0} max={100} value={form.avancement} onChange={e => setForm({...form, avancement: Number(e.target.value)})} className="mt-1" /></div>
              <div><Label>Ordre</Label><Input type="number" value={form.ordre} onChange={e => setForm({...form, ordre: Number(e.target.value)})} className="mt-1" /></div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => saveMutation.mutate(form)} className="flex-1 bg-[#1A3A52] text-white" disabled={!form.etape}><Save className="h-4 w-4 mr-2" />{editId ? 'Mettre à jour' : 'Créer'}</Button>
              <Button variant="outline" onClick={() => setModal(false)}><X className="h-4 w-4" /></Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminEspaceAssocie({ defaultTab = 'kpis', embedded = false }) {
  const tabMap = {
    kpis: 'kpis',
    docs_actu: 'docs',
    acq: 'acq',
    roadmap: 'roadmap',
    crm: 'crm',
  };
  const resolvedTab = tabMap[defaultTab] || defaultTab;

  const content = (
    <Tabs defaultValue={resolvedTab}>
      {!embedded && (
        <TabsList className="flex flex-wrap gap-1 h-auto mb-8 bg-white border border-slate-200 p-2 rounded-xl">
          <TabsTrigger value="kpis" className="text-sm">📊 KPIs & Métriques</TabsTrigger>
          <TabsTrigger value="docs" className="text-sm">📄 Documents</TabsTrigger>
          <TabsTrigger value="actu" className="text-sm">📰 Actualités</TabsTrigger>
          <TabsTrigger value="acq" className="text-sm">🏢 Biens & Acquisitions</TabsTrigger>
          <TabsTrigger value="roadmap" className="text-sm">🚀 Roadmap</TabsTrigger>
          <TabsTrigger value="crm" className="text-sm">👥 CRM Investisseurs</TabsTrigger>
        </TabsList>
      )}
      <TabsContent value="kpis"><KpisSection /></TabsContent>
      <TabsContent value="docs">
        <div className="space-y-8">
          <DocumentsSection />
          <ActualitesSection />
        </div>
      </TabsContent>
      <TabsContent value="actu"><ActualitesSection /></TabsContent>
      <TabsContent value="acq"><AcquisitionsSection /></TabsContent>
      <TabsContent value="roadmap"><RoadmapSection /></TabsContent>
      <TabsContent value="crm"><CRMInvestisseurs /></TabsContent>
    </Tabs>
  );

  if (embedded) return content;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#1A3A52] py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <Settings className="h-8 w-8 text-[#C9A961]" />
            <div>
              <h1 className="text-2xl font-serif text-white">Back-office — Espace Associés</h1>
              <p className="text-white/60 text-sm">Gérez tous les contenus affichés dans l'espace associé</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Tabs defaultValue="kpis">
          <TabsList className="flex flex-wrap gap-1 h-auto mb-8 bg-white border border-slate-200 p-2 rounded-xl">
            <TabsTrigger value="kpis" className="text-sm">📊 KPIs & Métriques</TabsTrigger>
            <TabsTrigger value="docs" className="text-sm">📄 Documents</TabsTrigger>
            <TabsTrigger value="actu" className="text-sm">📰 Actualités</TabsTrigger>
            <TabsTrigger value="acq" className="text-sm">🏢 Biens & Acquisitions</TabsTrigger>
            <TabsTrigger value="roadmap" className="text-sm">🚀 Roadmap</TabsTrigger>
            <TabsTrigger value="crm" className="text-sm">👥 CRM Investisseurs</TabsTrigger>
            </TabsList>
            <TabsContent value="kpis"><KpisSection /></TabsContent>
            <TabsContent value="docs"><DocumentsSection /></TabsContent>
            <TabsContent value="actu"><ActualitesSection /></TabsContent>
            <TabsContent value="acq"><AcquisitionsSection /></TabsContent>
            <TabsContent value="roadmap"><RoadmapSection /></TabsContent>
            <TabsContent value="crm"><CRMInvestisseurs /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}