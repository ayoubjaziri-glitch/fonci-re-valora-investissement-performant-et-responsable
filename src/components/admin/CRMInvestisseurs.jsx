import React, { useState, useMemo } from 'react';
import { db } from '@/lib/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Plus, Search, X, Save, Trash2, Edit2, Phone, Mail, Building2,
  TrendingUp, Users, Euro, Star, Calendar, MessageSquare, Filter,
  ChevronDown, ChevronRight, Clock, CheckCircle2, AlertCircle,
  Download, FileText, Tag, BarChart3
} from 'lucide-react';

const STATUTS = ["Prospect", "Contact", "Qualifié", "En discussion", "Engagé", "Associé actif", "Inactif", "Perdu"];
const SOURCES = ["Réseau", "LinkedIn", "Recommandation", "Site web", "Événement", "Partenaire", "Autre"];
const PROFILS = ["Particulier", "Professionnel", "Institutionnel", "Family Office", "Business Angel"];
const HORIZONS = ["< 3 ans", "3-5 ans", "5-10 ans", "> 10 ans", "Non défini"];
const RISQUES = ["Faible", "Modérée", "Élevée"];
const INTERACTION_TYPES = ["Appel", "Email", "Réunion", "Visio", "Présentation", "Relance", "Signature", "Autre"];

const STATUT_COLORS = {
  "Prospect": "bg-slate-100 text-slate-600",
  "Contact": "bg-blue-100 text-blue-700",
  "Qualifié": "bg-indigo-100 text-indigo-700",
  "En discussion": "bg-amber-100 text-amber-700",
  "Engagé": "bg-orange-100 text-orange-700",
  "Associé actif": "bg-emerald-100 text-emerald-700",
  "Inactif": "bg-slate-100 text-slate-500",
  "Perdu": "bg-red-100 text-red-600",
};

const STATUT_PIPELINE = ["Prospect", "Contact", "Qualifié", "En discussion", "Engagé", "Associé actif"];

function ScoreBadge({ score }) {
  const color = score >= 70 ? 'text-emerald-600 bg-emerald-50' : score >= 40 ? 'text-amber-600 bg-amber-50' : 'text-slate-500 bg-slate-100';
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>
      ★ {score}
    </span>
  );
}

// ── Formulaire Interaction ────────────────────────────────────────────────────
function InteractionForm({ investisseur, onClose }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ type: 'Appel', date: new Date().toISOString().split('T')[0], note: '', auteur: '' });

  const save = async () => {
    const existing = investisseur.interactions ? JSON.parse(investisseur.interactions) : [];
    const updated = [{ ...form, id: Date.now() }, ...existing];
    await db.InvestisseurCRM.update(investisseur.id, { interactions: JSON.stringify(updated) });
    qc.invalidateQueries({ queryKey: ['crm-investisseurs'] });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Type d'interaction</Label>
          <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>{INTERACTION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="mt-1" />
        </div>
      </div>
      <div>
        <Label>Auteur / Intervenant</Label>
        <Input value={form.auteur} onChange={e => setForm({ ...form, auteur: e.target.value })} placeholder="Ayoub Jaziri" className="mt-1" />
      </div>
      <div>
        <Label>Note / Compte-rendu</Label>
        <Textarea rows={3} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="Résumé de l'échange…" className="mt-1" />
      </div>
      <div className="flex gap-2">
        <Button onClick={save} className="flex-1 bg-[#1A3A52] text-white"><Save className="h-4 w-4 mr-2" /> Enregistrer</Button>
        <Button variant="outline" onClick={onClose}><X className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

// ── Fiche Investisseur (détail) ───────────────────────────────────────────────
function FicheInvestisseur({ inv, onClose, onEdit }) {
  const [tab, setTab] = useState('profil');
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const interactions = inv.interactions ? JSON.parse(inv.interactions) : [];

  return (
    <div className="flex flex-col h-full">
      {/* Header fiche */}
      <div className="bg-[#0F2537] px-6 py-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C9A961] to-[#8B6F1E] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {inv.prenom?.[0] || inv.nom[0]}{inv.nom?.[1] || ''}
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">{inv.prenom} {inv.nom}</h2>
              <p className="text-white/60 text-sm">{inv.societe || inv.profil_investisseur} {inv.ville ? `• ${inv.ville}` : ''}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUT_COLORS[inv.statut]}`}>{inv.statut}</span>
                {inv.scoring > 0 && <ScoreBadge score={inv.scoring} />}
                {inv.montant_investi > 0 && (
                  <span className="text-xs bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                    {inv.montant_investi.toLocaleString('fr-FR')} € investi
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(inv)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
              <Edit2 className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Contact rapide */}
        <div className="flex gap-3 mt-4">
          {inv.email && (
            <a href={`mailto:${inv.email}`} className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1.5 rounded-lg transition-colors">
              <Mail className="h-3.5 w-3.5" /> {inv.email}
            </a>
          )}
          {inv.telephone && (
            <a href={`tel:${inv.telephone}`} className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1.5 rounded-lg transition-colors">
              <Phone className="h-3.5 w-3.5" /> {inv.telephone}
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white">
        {[['profil', 'Profil'], ['financier', 'Financier'], ['interactions', `Interactions (${interactions.length})`], ['notes', 'Notes']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === id ? 'border-[#C9A961] text-[#1A3A52]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Contenu tabs */}
      <div className="flex-1 overflow-y-auto p-6">
        {tab === 'profil' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Source', value: inv.source },
                { label: 'Profil', value: inv.profil_investisseur },
                { label: 'Horizon', value: inv.horizon_placement },
                { label: 'Tolérance risque', value: inv.tolerance_risque },
                { label: 'Responsable suivi', value: inv.responsable_suivi },
                { label: 'Prochain contact', value: inv.date_prochain_contact },
              ].filter(f => f.value).map(f => (
                <div key={f.label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">{f.label}</p>
                  <p className="text-sm font-semibold text-slate-800">{f.value}</p>
                </div>
              ))}
            </div>
            {inv.objectifs_investissement && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Objectifs d'investissement</p>
                <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3">{inv.objectifs_investissement}</p>
              </div>
            )}
            {inv.tags && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {inv.tags.split(',').map(tag => (
                    <span key={tag.trim()} className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-2.5 py-1 rounded-full">{tag.trim()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'financier' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Capacité d\'investissement', value: inv.capacite_investissement, icon: TrendingUp },
                { label: 'Ticket visé', value: inv.ticket_vise, icon: Euro },
                { label: 'Montant investi', value: inv.montant_investi > 0 ? `${inv.montant_investi.toLocaleString('fr-FR')} €` : null, icon: Euro },
                { label: 'Nombre de parts', value: inv.nb_parts > 0 ? inv.nb_parts : null, icon: BarChart3 },
                { label: 'Date d\'entrée', value: inv.date_entree, icon: Calendar },
              ].filter(f => f.value).map(f => (
                <div key={f.label} className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <f.icon className="h-4 w-4 text-[#C9A961]" />
                    <p className="text-xs text-slate-400">{f.label}</p>
                  </div>
                  <p className="text-base font-bold text-[#1A3A52]">{f.value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className={`h-4 w-4 ${inv.rgpd_consent ? 'text-emerald-500' : 'text-slate-300'}`} />
                Consentement RGPD
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className={`h-4 w-4 ${inv.newsletter ? 'text-emerald-500' : 'text-slate-300'}`} />
                Newsletter
              </div>
            </div>
          </div>
        )}

        {tab === 'interactions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">{interactions.length} interaction{interactions.length > 1 ? 's' : ''}</p>
              <Button size="sm" onClick={() => setShowInteractionForm(v => !v)} className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter
              </Button>
            </div>
            {showInteractionForm && (
              <div className="border border-[#C9A961]/30 rounded-xl p-4 bg-amber-50">
                <InteractionForm investisseur={inv} onClose={() => setShowInteractionForm(false)} />
              </div>
            )}
            <div className="space-y-2">
              {interactions.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">Aucune interaction enregistrée</p>
              ) : (
                interactions.map((inter, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{inter.type}</span>
                      <span className="text-xs text-slate-400">{inter.date}</span>
                      {inter.auteur && <span className="text-xs text-slate-400">• {inter.auteur}</span>}
                    </div>
                    <p className="text-sm text-slate-700">{inter.note}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'notes' && (
          <div>
            <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 rounded-xl p-4 min-h-[200px]">
              {inv.notes || <span className="text-slate-400 italic">Aucune note</span>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Formulaire Investisseur ───────────────────────────────────────────────────
const EMPTY_FORM = {
  prenom: '', nom: '', email: '', telephone: '', societe: '', ville: '', pays: 'France',
  statut: 'Prospect', source: 'Réseau', profil_investisseur: 'Particulier',
  capacite_investissement: '', ticket_vise: '', montant_investi: 0, nb_parts: 0,
  date_entree: '', objectifs_investissement: '', horizon_placement: 'Non défini',
  tolerance_risque: 'Modérée', notes: '', date_prochain_contact: '', responsable_suivi: '',
  scoring: 0, newsletter: true, rgpd_consent: false, tags: ''
};

function FormulaireInvestisseur({ form, setForm, onSave, onCancel, editId }) {
  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
      {/* Identité */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Identité</p>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-sm">Prénom</Label><Input value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} className="mt-1" /></div>
          <div><Label className="text-sm">Nom *</Label><Input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} className="mt-1" /></div>
          <div><Label className="text-sm">Email *</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1" /></div>
          <div><Label className="text-sm">Téléphone</Label><Input value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} className="mt-1" /></div>
          <div><Label className="text-sm">Société</Label><Input value={form.societe} onChange={e => setForm({ ...form, societe: e.target.value })} className="mt-1" /></div>
          <div><Label className="text-sm">Ville</Label><Input value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} className="mt-1" /></div>
        </div>
      </div>

      {/* Qualification CRM */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Qualification CRM</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm">Statut</Label>
            <Select value={form.statut} onValueChange={v => setForm({ ...form, statut: v })}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{STATUTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm">Source</Label>
            <Select value={form.source} onValueChange={v => setForm({ ...form, source: v })}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm">Profil investisseur</Label>
            <Select value={form.profil_investisseur} onValueChange={v => setForm({ ...form, profil_investisseur: v })}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{PROFILS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm">Score (0-100)</Label>
            <Input type="number" min={0} max={100} value={form.scoring} onChange={e => setForm({ ...form, scoring: Number(e.target.value) })} className="mt-1" />
          </div>
          <div><Label className="text-sm">Responsable suivi</Label><Input value={form.responsable_suivi} onChange={e => setForm({ ...form, responsable_suivi: e.target.value })} className="mt-1" /></div>
          <div><Label className="text-sm">Prochain contact</Label><Input type="date" value={form.date_prochain_contact} onChange={e => setForm({ ...form, date_prochain_contact: e.target.value })} className="mt-1" /></div>
        </div>
        <div className="mt-3">
          <Label className="text-sm">Tags (séparés par virgule)</Label>
          <Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="VIP, Réseau Ayoub, Immobilier..." className="mt-1" />
        </div>
      </div>

      {/* Profil financier */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Profil Financier</p>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-sm">Capacité d'investissement</Label><Input value={form.capacite_investissement} onChange={e => setForm({ ...form, capacite_investissement: e.target.value })} placeholder="50 000 €" className="mt-1" /></div>
          <div><Label className="text-sm">Ticket visé</Label><Input value={form.ticket_vise} onChange={e => setForm({ ...form, ticket_vise: e.target.value })} placeholder="25 000 €" className="mt-1" /></div>
          <div><Label className="text-sm">Montant investi (€)</Label><Input type="number" value={form.montant_investi} onChange={e => setForm({ ...form, montant_investi: Number(e.target.value) })} className="mt-1" /></div>
          <div><Label className="text-sm">Nombre de parts</Label><Input type="number" value={form.nb_parts} onChange={e => setForm({ ...form, nb_parts: Number(e.target.value) })} className="mt-1" /></div>
          <div><Label className="text-sm">Date d'entrée au capital</Label><Input type="date" value={form.date_entree} onChange={e => setForm({ ...form, date_entree: e.target.value })} className="mt-1" /></div>
          <div>
            <Label className="text-sm">Horizon de placement</Label>
            <Select value={form.horizon_placement} onValueChange={v => setForm({ ...form, horizon_placement: v })}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{HORIZONS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label className="text-sm">Tolérance au risque</Label>
            <Select value={form.tolerance_risque} onValueChange={v => setForm({ ...form, tolerance_risque: v })}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{RISQUES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-3">
          <Label className="text-sm">Objectifs d'investissement</Label>
          <Textarea rows={2} value={form.objectifs_investissement} onChange={e => setForm({ ...form, objectifs_investissement: e.target.value })} placeholder="Rendement, transmission patrimoniale, défiscalisation..." className="mt-1" />
        </div>
      </div>

      {/* Notes + RGPD */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Notes & Consentements</p>
        <Textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Notes libres…" className="mb-3" />
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.rgpd_consent} onChange={e => setForm({ ...form, rgpd_consent: e.target.checked })} className="w-4 h-4 accent-[#C9A961]" />
            Consentement RGPD
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.newsletter} onChange={e => setForm({ ...form, newsletter: e.target.checked })} className="w-4 h-4 accent-[#C9A961]" />
            Abonné newsletter
          </label>
        </div>
      </div>

      <div className="flex gap-2 pt-2 sticky bottom-0 bg-white pb-2">
        <Button onClick={onSave} className="flex-1 bg-[#1A3A52] hover:bg-[#2A4A6F] text-white" disabled={!form.nom || !form.email}>
          <Save className="h-4 w-4 mr-2" /> {editId ? 'Mettre à jour' : 'Créer l\'investisseur'}
        </Button>
        <Button variant="outline" onClick={onCancel}><X className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

// ── Vue Pipeline ──────────────────────────────────────────────────────────────
function PipelineView({ investisseurs, onSelect }) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {STATUT_PIPELINE.map(statut => {
          const items = investisseurs.filter(i => i.statut === statut);
          const totalMontant = items.reduce((s, i) => s + (i.montant_investi || 0), 0);
          return (
            <div key={statut} className="w-60 flex-shrink-0">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${STATUT_COLORS[statut].includes('emerald') ? 'bg-emerald-500' : STATUT_COLORS[statut].includes('amber') ? 'bg-amber-500' : STATUT_COLORS[statut].includes('blue') ? 'bg-blue-500' : 'bg-slate-400'}`} />
                  <span className="text-xs font-bold text-slate-700">{statut}</span>
                </div>
                <span className="text-xs text-slate-400">{items.length}</span>
              </div>
              <div className="space-y-2 bg-slate-100/70 rounded-xl p-2 min-h-[120px]">
                {totalMontant > 0 && (
                  <div className="text-xs text-center text-slate-500 bg-white rounded-lg px-2 py-1">
                    {totalMontant.toLocaleString('fr-FR')} €
                  </div>
                )}
                {items.map(inv => (
                  <div key={inv.id} onClick={() => onSelect(inv)}
                    className="bg-white rounded-xl p-3 shadow-sm border border-slate-200 hover:border-[#C9A961] cursor-pointer transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-lg bg-[#1A3A52] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {(inv.prenom?.[0] || inv.nom[0])}{inv.nom?.[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{inv.prenom} {inv.nom}</p>
                        {inv.societe && <p className="text-[10px] text-slate-400 truncate">{inv.societe}</p>}
                      </div>
                    </div>
                    {inv.ticket_vise && <p className="text-xs text-[#C9A961] font-semibold">{inv.ticket_vise}</p>}
                    {inv.scoring > 0 && <ScoreBadge score={inv.scoring} />}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Composant Principal ───────────────────────────────────────────────────────
export default function CRMInvestisseurs() {
  const qc = useQueryClient();
  const [view, setView] = useState('liste');
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedInv, setSelectedInv] = useState(null);

  const { data: investisseurs = [] } = useQuery({
    queryKey: ['crm-investisseurs'],
    queryFn: () => db.InvestisseurCRM.list('-created_date', 500),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editId
      ? db.InvestisseurCRM.update(editId, data)
      : db.InvestisseurCRM.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crm-investisseurs'] });
      setShowModal(false);
      setEditId(null);
      setForm(EMPTY_FORM);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.InvestisseurCRM.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crm-investisseurs'] }),
  });

  const openEdit = (inv) => {
    setEditId(inv.id);
    setForm({ ...EMPTY_FORM, ...inv });
    setShowModal(true);
  };

  const filtered = useMemo(() => {
    return investisseurs.filter(inv => {
      if (filterStatut && inv.statut !== filterStatut) return false;
      if (filterSource && inv.source !== filterSource) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          `${inv.prenom} ${inv.nom}`.toLowerCase().includes(q) ||
          (inv.email || '').toLowerCase().includes(q) ||
          (inv.societe || '').toLowerCase().includes(q) ||
          (inv.tags || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [investisseurs, search, filterStatut, filterSource]);

  // Stats
  const stats = {
    total: investisseurs.length,
    associes: investisseurs.filter(i => i.statut === 'Associé actif').length,
    totalInvesti: investisseurs.reduce((s, i) => s + (i.montant_investi || 0), 0),
    enDiscussion: investisseurs.filter(i => ['En discussion', 'Engagé'].includes(i.statut)).length,
    aRelancer: investisseurs.filter(i => i.date_prochain_contact && new Date(i.date_prochain_contact) <= new Date() && i.statut !== 'Associé actif').length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1A3A52]">CRM Investisseurs</h2>
          <p className="text-slate-400 text-sm">{stats.total} contacts · {stats.associes} associés · {stats.totalInvesti.toLocaleString('fr-FR')} € investis</p>
        </div>
        <Button onClick={() => { setEditId(null); setForm(EMPTY_FORM); setShowModal(true); }}
          className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-bold gap-2">
          <Plus className="h-4 w-4" /> Nouvel investisseur
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total contacts', value: stats.total, color: 'text-slate-600', bg: 'bg-slate-50', icon: Users },
          { label: 'Associés actifs', value: stats.associes, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
          { label: 'Capital collecté', value: `${(stats.totalInvesti / 1000).toFixed(0)}k €`, color: 'text-[#C9A961]', bg: 'bg-amber-50', icon: Euro },
          { label: 'En discussion', value: stats.enDiscussion, color: 'text-amber-600', bg: 'bg-amber-50', icon: MessageSquare },
          { label: 'À relancer', value: stats.aRelancer, color: stats.aRelancer > 0 ? 'text-red-600' : 'text-slate-400', bg: stats.aRelancer > 0 ? 'bg-red-50' : 'bg-slate-50', icon: AlertCircle },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-xl p-4 border border-white`}>
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className="text-xs text-slate-500">{s.label}</span>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-0.5">
          {[['liste', 'Liste'], ['pipeline', 'Pipeline']].map(([v, l]) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === v ? 'bg-[#1A3A52] text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A961]"
            placeholder="Rechercher…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <select className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#C9A961]"
          value={filterStatut} onChange={e => setFilterStatut(e.target.value)}>
          <option value="">Tous les statuts</option>
          {STATUTS.map(s => <option key={s}>{s}</option>)}
        </select>

        <select className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#C9A961]"
          value={filterSource} onChange={e => setFilterSource(e.target.value)}>
          <option value="">Toutes les sources</option>
          {SOURCES.map(s => <option key={s}>{s}</option>)}
        </select>

        {(filterStatut || filterSource) && (
          <button onClick={() => { setFilterStatut(''); setFilterSource(''); }}
            className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1">
            <X className="h-3.5 w-3.5" /> Reset
          </button>
        )}
      </div>

      {/* Vue Pipeline */}
      {view === 'pipeline' && (
        <PipelineView investisseurs={filtered} onSelect={setSelectedInv} />
      )}

      {/* Vue Liste */}
      {view === 'liste' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Investisseur</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Source</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Ticket / Investi</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Score</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Prochain contact</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">Aucun investisseur trouvé</td></tr>
              )}
              {filtered.map(inv => {
                const prochainContact = inv.date_prochain_contact ? new Date(inv.date_prochain_contact) : null;
                const isOverdue = prochainContact && prochainContact <= new Date() && inv.statut !== 'Associé actif';
                return (
                  <tr key={inv.id} onClick={() => setSelectedInv(inv)}
                    className="hover:bg-amber-50 cursor-pointer transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#1A3A52] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {(inv.prenom?.[0] || inv.nom[0])}{inv.nom?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{inv.prenom} {inv.nom}</p>
                          <p className="text-xs text-slate-400">{inv.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUT_COLORS[inv.statut]}`}>{inv.statut}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-500">{inv.source}</td>
                    <td className="px-4 py-3 text-right hidden lg:table-cell">
                      {inv.montant_investi > 0 ? (
                        <span className="text-sm font-bold text-emerald-600">{inv.montant_investi.toLocaleString('fr-FR')} €</span>
                      ) : inv.ticket_vise ? (
                        <span className="text-sm text-[#C9A961] font-medium">{inv.ticket_vise}</span>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      {inv.scoring > 0 ? <ScoreBadge score={inv.scoring} /> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      {inv.date_prochain_contact ? (
                        <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-500 font-semibold' : 'text-slate-500'}`}>
                          {isOverdue && <AlertCircle className="h-3 w-3" />}
                          {inv.date_prochain_contact}
                        </span>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <button onClick={() => openEdit(inv)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#1A3A52]">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => { if (confirm('Supprimer cet investisseur ?')) deleteMutation.mutate(inv.id); }}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal création/édition */}
      <Dialog open={showModal} onOpenChange={v => { setShowModal(v); if (!v) { setEditId(null); setForm(EMPTY_FORM); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editId ? 'Modifier l\'investisseur' : 'Nouvel investisseur'}</DialogTitle>
          </DialogHeader>
          <FormulaireInvestisseur
            form={form} setForm={setForm}
            onSave={() => saveMutation.mutate(form)}
            onCancel={() => setShowModal(false)}
            editId={editId}
          />
        </DialogContent>
      </Dialog>

      {/* Panneau fiche investisseur */}
      {selectedInv && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedInv(null)}>
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <FicheInvestisseur
              inv={selectedInv}
              onClose={() => setSelectedInv(null)}
              onEdit={(inv) => { setSelectedInv(null); openEdit(inv); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}