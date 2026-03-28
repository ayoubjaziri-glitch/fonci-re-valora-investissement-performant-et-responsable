import React, { useState, useMemo } from 'react';
import {
  TrendingUp, Building2, Euro, Plus, Trash2,
  ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Settings, BarChart3
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, RadialBarChart, RadialBar, PieChart, Pie, Cell
} from 'recharts';

// ─── Formatters ───────────────────────────────────────────────────────────────
const f0  = n => (n == null || isNaN(n)) ? '—' : new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n);
const f2  = n => (n == null || isNaN(n)) ? '—' : new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const f4  = n => (n == null || isNaN(n)) ? '—' : new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(n);
const eur  = n => (n == null || isNaN(n)) ? '—' : `${f0(n)} €`;
const eur2 = n => (n == null || isNaN(n)) ? '—' : `${f2(n)} €`;
const pct2 = n => (n == null || isNaN(n) || !isFinite(n)) ? '—' : `${f2(n * 100)} %`;
const keur = n => (n == null || isNaN(n)) ? '—' : `${f0(n / 1000)}k€`;

// ─── Annuité d'un prêt ────────────────────────────────────────────────────────
function calcAnnuite(montant, taux, duree) {
  if (!montant || !taux || !duree) return 0;
  return montant * (taux * Math.pow(1 + taux, duree)) / (Math.pow(1 + taux, duree) - 1);
}

// ─── Newton-Raphson TRI ───────────────────────────────────────────────────────
function calcTRI(flux) {
  let r = 0.1;
  for (let i = 0; i < 1000; i++) {
    let van = 0, dvan = 0;
    flux.forEach((f, t) => { van += f / Math.pow(1 + r, t); dvan -= t * f / Math.pow(1 + r, t + 1); });
    if (Math.abs(dvan) < 1e-12) break;
    const nr = r - van / dvan;
    if (Math.abs(nr - r) < 1e-8) { r = nr; break; }
    r = nr;
  }
  return isFinite(r) ? r : NaN;
}

// ─── PARAMÈTRES PAR DÉFAUT (valeurs Excel) ────────────────────────────────────
const DEFAULT_PARAMS = {
  // Général
  valeurParcInitial: 1250000,
  tauxRevalorisation: 1.5,       // % par an
  tauxRendementLocatif: 10.0,    // % du parc brut
  tauxChargesNonRecup: 10.0,     // % des loyers
  tauxRemuDirection: 15.22,      // % des loyers (sauf An1)
  tauxIS: 15.0,
  investissement: 275000,
  hurdle: 6.5,                   // % annuel
  nbActions: 200000,
  carriedPct: 20.0,              // % du surplus
  cmpc: 4.0,

  // Acquisitions supplémentaires (An, valeur, % financement)
  acquisitions: [
    { id: 1, label: 'Acquisition An 6', annee: 6, valeur: 300000, financement: 80 },
    { id: 2, label: 'Acquisition An 8', annee: 8, valeur: 250000, financement: 80 },
    { id: 3, label: 'Acquisition An 10', annee: 10, valeur: 180000, financement: 80 },
    { id: 4, label: 'Acquisition An 11', annee: 11, valeur: 140000, financement: 80 },
  ],

  // Prêts
  prets: [
    { id: 1, label: 'Prêt 1 (initial)', montant: 1025000, taux: 3.3, duree: 15, anneeDebut: 1 },
    { id: 2, label: 'Prêt 2',           montant: 206884,  taux: 3.3, duree: 15, anneeDebut: 6 },
    { id: 3, label: 'Prêt 3',           montant: 157031,  taux: 3.3, duree: 15, anneeDebut: 8 },
    { id: 4, label: 'Prêt 4',           montant: 107209,  taux: 3.3, duree: 15, anneeDebut: 10 },
    { id: 5, label: 'Prêt 5',           montant: 82393,   taux: 3.3, duree: 15, anneeDebut: 11 },
  ],
};

// ─── Moteur de calcul ─────────────────────────────────────────────────────────
function calculerBP(p) {
  const N = 11;
  const hurdle = p.hurdle / 100;
  const tauxIS = p.tauxIS / 100;

  // Valeur du parc par année (base + acquisitions)
  const parcBrut = [];
  let parc = p.valeurParcInitial;
  for (let i = 0; i < N; i++) {
    parc *= (1 + p.tauxRevalorisation / 100);
    // Ajouter acquisitions de l'année
    p.acquisitions.forEach(a => { if (a.annee === i + 1) parc += a.valeur; });
    parcBrut.push(parc);
  }

  // Service dette par année (somme des prêts actifs)
  const serviceDetteArr = Array(N).fill(0);
  const debtRestant = Array(N).fill(0); // capital restant dû fin de chaque année
  p.prets.forEach(pret => {
    const ann = calcAnnuite(pret.montant, pret.taux / 100, pret.duree);
    let k = pret.montant;
    for (let i = 0; i < N; i++) {
      const off = (i + 1) - pret.anneeDebut;
      if (off >= 0 && off < pret.duree) {
        serviceDetteArr[i] += ann;
        const int = k * (pret.taux / 100);
        k = Math.max(0, k - (ann - int));
      }
      if (off >= 0 && off < pret.duree) {
        debtRestant[i] += k;
      } else if (off < 0) {
        debtRestant[i] += pret.montant;
      }
    }
  });

  // Recalc propre capital restant
  const capitalRestant = Array(N).fill(0);
  p.prets.forEach(pret => {
    const ann = calcAnnuite(pret.montant, pret.taux / 100, pret.duree);
    let k = pret.montant;
    for (let i = 0; i < N; i++) {
      const off = (i + 1) - pret.anneeDebut;
      if (off < 0) { capitalRestant[i] += pret.montant; continue; }
      if (off >= pret.duree) continue;
      const int = k * (pret.taux / 100);
      k = Math.max(0, k - (ann - int));
      capitalRestant[i] += k;
    }
  });

  const annees = [];
  let tresCum = 0;
  let valeurCreeInvest = p.investissement;

  for (let i = 0; i < N; i++) {
    const loyers    = parcBrut[i] * (p.tauxRendementLocatif / 100);
    const charges   = loyers * (p.tauxChargesNonRecup / 100);
    const remuDir   = i === 0 ? 0 : loyers * (p.tauxRemuDirection / 100);
    const dette     = serviceDetteArr[i];
    const res       = loyers - charges - remuDir - dette;
    const IS        = Math.max(0, res * tauxIS);
    const tresoAnn  = res - IS;
    tresCum += tresoAnn;

    const valNette  = parcBrut[i] - capitalRestant[i];
    const valSoc    = valNette + tresCum;
    const valAction = p.nbActions > 0 ? valSoc / p.nbActions : 0;

    const ltc       = parcBrut[i] > 0 ? capitalRestant[i] / parcBrut[i] : 0;
    const dscrBrut  = dette > 0 ? loyers / dette : null;

    // Investisseur
    valeurCreeInvest = valSoc * (p.investissement / (p.investissement + (valSoc - valNette > 0 ? valSoc - valNette : 0)));
    // Simplification : valeur investisseur = quote-part proportionnelle
    const quotePart = p.investissement / (p.investissement + (capitalRestant[0] || p.prets.reduce((s,x)=>s+x.montant,0)));
    const valInvest = valSoc * quotePart;
    const hurdleCum = p.investissement * Math.pow(1 + hurdle, i + 1);
    const surplus   = Math.max(0, valInvest - hurdleCum);
    const carried   = i >= 4 ? surplus * (p.carriedPct / 100) : null;
    const retourNet = i >= 4 ? valInvest - (carried || 0) : null;
    const fluxTRI   = [
      -p.investissement,
      ...Array.from({ length: i }, (_, j) => annees[j]?.tresoAnn * quotePart || 0),
      (retourNet || valInvest),
    ];
    const tri       = i >= 4 ? calcTRI(fluxTRI) : null;

    annees.push({
      annee: i + 1,
      parcBrut: parcBrut[i],
      valNette,
      loyers, charges, remuDir, dette, res, IS, tresoAnn,
      tresCum,
      valSoc, valAction,
      ltc, dscrBrut,
      valInvest, carried, retourNet, tri,
    });
  }

  return annees;
}

// ─── Tooltip custom ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0F2537] text-white rounded-xl p-3 shadow-2xl text-xs min-w-[160px]">
      <p className="font-bold text-[#C9A961] mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex justify-between gap-4 mb-1">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-semibold">{formatter ? formatter(p.value, p.name) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── BPTable ──────────────────────────────────────────────────────────────────
function BPTable({ rows, annees = 11 }) {
  const cols = Array.from({ length: annees }, (_, i) => i);
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-[#1A3A52] text-white">
            <th className="px-3 py-2.5 text-left font-medium min-w-[220px]">Indicateur</th>
            {cols.map(i => <th key={i} className="px-3 py-2.5 text-right font-medium whitespace-nowrap">An {i + 1}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, ri) => (
            <tr key={ri} className={
              row.section ? 'bg-[#1A3A52]/8 font-bold' :
              row.hl === 'gold' ? 'bg-[#C9A961]/10 font-semibold' :
              row.hl === 'green' ? 'bg-emerald-50 font-semibold' :
              row.hl === 'red' ? 'bg-red-50/60' :
              ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'
            }>
              <td className={`px-3 py-2 ${row.section ? 'text-[#1A3A52] font-bold text-xs uppercase tracking-wider' : row.hl === 'red' ? 'text-red-700' : row.hl === 'green' ? 'text-emerald-700' : 'text-slate-700'}`}>
                {row.section ? `▸ ${row.label}` : row.label}
              </td>
              {cols.map(i => (
                <td key={i} className={`px-3 py-2 text-right font-mono ${row.section ? '' : row.hl === 'red' ? 'text-red-700' : row.hl === 'green' ? 'text-emerald-700' : 'text-slate-800'}`}>
                  {row.section ? '' : (row.fmt ? row.fmt(row.data[i]) : '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── InputParam ───────────────────────────────────────────────────────────────
function InputParam({ label, value, onChange, suffix, min, step = "0.01" }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 hover:border-[#C9A961] transition-colors">
      <label className="text-xs text-slate-500 block mb-1">{label}</label>
      <div className="flex items-center gap-1">
        <input type="number" value={value} step={step} min={min}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="flex-1 text-sm font-bold text-[#1A3A52] border-0 focus:outline-none bg-transparent w-0" />
        {suffix && <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{suffix}</span>}
      </div>
    </div>
  );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────
export default function AdminBusinessPlan() {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [detteOuverte, setDetteOuverte] = useState(null);

  const set = (k, v) => setParams(p => ({ ...p, [k]: v }));

  // Acquisitions
  const addAcq = () => set('acquisitions', [...params.acquisitions, { id: Date.now(), label: 'Nouvelle acquisition', annee: 5, valeur: 200000, financement: 80 }]);
  const removeAcq = id => set('acquisitions', params.acquisitions.filter(a => a.id !== id));
  const updateAcq = (id, k, v) => set('acquisitions', params.acquisitions.map(a => a.id === id ? { ...a, [k]: v } : a));

  // Prêts
  const addPret = () => set('prets', [...params.prets, { id: Date.now(), label: `Prêt ${params.prets.length + 1}`, montant: 150000, taux: 3.3, duree: 15, anneeDebut: 5 }]);
  const removePret = id => set('prets', params.prets.filter(p => p.id !== id));
  const updatePret = (id, k, v) => set('prets', params.prets.map(p => p.id === id ? { ...p, [k]: v } : p));

  // Calcul BP live
  const annees = useMemo(() => calculerBP(params), [params]);
  const derniere = annees[annees.length - 1] || {};

  const labels = annees.map(a => `An ${a.annee}`);

  // Data graphiques
  const chartPatrimoine = annees.map((a, i) => ({
    name: labels[i],
    'Parc Brut': Math.round(a.parcBrut),
    'Valeur Nette': Math.round(a.valNette),
    'Valeur Société': Math.round(a.valSoc),
    'Tréso Cumulée': Math.round(a.tresCum),
  }));

  const chartFlux = annees.map((a, i) => ({
    name: labels[i],
    'Revenus Locatifs': Math.round(a.loyers),
    'Service Dette': Math.round(a.dette),
    'Tréso Annuelle': Math.round(a.tresoAnn),
    'IS': Math.round(a.IS),
  }));

  const chartTRI = annees.filter(a => a.tri != null).map(a => ({
    name: `An ${a.annee}`,
    'TRI %': +(a.tri * 100).toFixed(2),
    'Retour Net': Math.round(a.retourNet || 0),
  }));

  const chartRatios = annees.map((a, i) => ({
    name: labels[i],
    'LTC %': +(a.ltc * 100).toFixed(1),
    'DSCR': a.dscrBrut != null ? +a.dscrBrut.toFixed(3) : null,
  }));

  const chartAction = annees.map((a, i) => ({
    name: labels[i],
    'Valeur Action €': +a.valAction.toFixed(3),
  }));

  const totalDetteInitiale = params.prets.reduce((s, p) => s + p.montant, 0);
  const triAn5 = annees[4]?.tri;
  const triAn10 = annees[9]?.tri;

  const COLORS_PIE = ['#1A3A52', '#C9A961', '#10b981', '#6366f1', '#f59e0b'];

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', icon: BarChart3 },
    { id: 'complet', label: 'BP Complet' },
    { id: 'investisseur', label: 'Investisseur' },
    { id: 'dettes', label: 'Dettes' },
    { id: 'parametres', label: '⚙️ Paramètres', icon: Settings },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-[#0F2537] to-[#1A3A52] px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif text-white mb-1">Business Plan — Foncière Valora</h1>
            <p className="text-white/50 text-xs">Simulation dynamique · {params.prets.length} prêts · {params.acquisitions.length} acquisitions · 11 années</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setParams(DEFAULT_PARAMS)} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-colors">
              ↩ Reset
            </button>
          </div>
        </div>

        {/* KPIs header */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
          {[
            { label: 'Parc An 1', val: eur(annees[0]?.parcBrut), sub: 'Valeur brute' },
            { label: 'Parc An 11', val: eur(derniere.parcBrut), sub: `+${((derniere.parcBrut / (annees[0]?.parcBrut || 1) - 1) * 100).toFixed(0)}%` },
            { label: 'TRI Net An 5', val: triAn5 ? `${(triAn5 * 100).toFixed(2)}%` : '—', sub: 'Hurdle 6,5%', ok: triAn5 >= 0.065 },
            { label: 'TRI Net An 10', val: triAn10 ? `${(triAn10 * 100).toFixed(2)}%` : '—', sub: 'Hurdle 6,5%', ok: triAn10 >= 0.065 },
            { label: 'Valeur Société An 11', val: eur(derniere.valSoc), sub: `Action : ${derniere.valAction ? eur2(derniere.valAction) : '—'}` },
          ].map((k, i) => (
            <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-3">
              <p className="text-white/50 text-xs mb-1">{k.label}</p>
              <p className={`text-lg font-bold ${k.ok === true ? 'text-emerald-400' : k.ok === false ? 'text-orange-400' : 'text-white'}`}>{k.val}</p>
              <p className="text-white/40 text-xs">{k.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Onglets ── */}
      <div className="border-b border-slate-200 bg-white px-6 flex overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === t.id ? 'text-[#1A3A52] border-[#C9A961]' : 'text-slate-500 border-transparent hover:text-slate-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6">

        {/* ═══════════════════════════════════════════════════════
            ONGLET DASHBOARD (graphiques uniquement)
        ═══════════════════════════════════════════════════════ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">

            {/* Ligne 1 : Patrimoine + TRI */}
            <div className="grid md:grid-cols-3 gap-4">

              {/* Graphe patrimonial — pleine largeur */}
              <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-[#1A3A52]">Croissance Patrimoniale</h3>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">+{((derniere.parcBrut / (annees[0]?.parcBrut || 1) - 1) * 100).toFixed(0)}% sur 11 ans</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">Évolution du parc brut, valeur nette et valeur société (DCF)</p>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={chartPatrimoine}>
                    <defs>
                      <linearGradient id="gParcBrut" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1A3A52" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#1A3A52" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gValSoc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A961" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#C9A961" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gNette" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => keur(v)} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip formatter={v => eur(v)} />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="Parc Brut" stroke="#1A3A52" strokeWidth={2} fill="url(#gParcBrut)" />
                    <Area type="monotone" dataKey="Valeur Société" stroke="#C9A961" strokeWidth={2.5} fill="url(#gValSoc)" strokeDasharray="0" />
                    <Area type="monotone" dataKey="Valeur Nette" stroke="#10b981" strokeWidth={2} fill="url(#gNette)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* TRI radial */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col">
                <h3 className="font-semibold text-[#1A3A52] mb-1">TRI Net par Sortie</h3>
                <p className="text-xs text-slate-400 mb-4">Hurdle investisseur : 6,5 %/an</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartTRI} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} domain={[0, 14]} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={55} />
                    <Tooltip content={<CustomTooltip formatter={(v, n) => n === 'TRI %' ? `${v}%` : eur(v)} />} />
                    <ReferenceLine x={6.5} stroke="#ef4444" strokeDasharray="4 4" />
                    <Bar dataKey="TRI %" radius={[0, 6, 6, 0]}
                      fill="#C9A961"
                      label={{ position: 'right', fontSize: 10, fill: '#1A3A52', formatter: v => `${v}%` }} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span className="text-xs text-slate-500">Hurdle minimum : 6,5 %</span>
                </div>
              </div>
            </div>

            {/* Ligne 2 : Flux + Ratios */}
            <div className="grid md:grid-cols-2 gap-4">

              {/* Revenus vs Dette */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-[#1A3A52]">Revenus Locatifs vs Service de la Dette</h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">Capacité de remboursement annuelle (€)</p>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartFlux}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => keur(v)} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip formatter={v => eur(v)} />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Revenus Locatifs" fill="#1A3A52" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Service Dette" fill="#C9A961" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Tréso Annuelle" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Trésorerie cumulée */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-semibold text-[#1A3A52] mb-1">Trésorerie Cumulée Société</h3>
                <p className="text-xs text-slate-400 mb-4">Accumulation nette après IS et service de la dette (€)</p>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={chartPatrimoine}>
                    <defs>
                      <linearGradient id="gTres" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => keur(v)} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip formatter={v => eur(v)} />} />
                    <Area type="monotone" dataKey="Tréso Cumulée" stroke="#6366f1" strokeWidth={2.5} fill="url(#gTres)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ligne 3 : Ratios + Action + Pie */}
            <div className="grid md:grid-cols-3 gap-4">

              {/* DSCR & LTC */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-semibold text-[#1A3A52] mb-1">DSCR & LTC</h3>
                <p className="text-xs text-slate-400 mb-4">Ratios de couverture et d'endettement</p>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartRatios}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <ReferenceLine y={1.2} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'DSCR min 1.2x', fontSize: 9, fill: '#ef4444' }} />
                    <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'LTC max 80%', fontSize: 9, fill: '#f59e0b' }} />
                    <Line type="monotone" dataKey="DSCR" stroke="#C9A961" strokeWidth={2.5} dot={{ fill: '#C9A961', r: 3 }} />
                    <Line type="monotone" dataKey="LTC %" stroke="#1A3A52" strokeWidth={2.5} dot={{ fill: '#1A3A52', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Valeur Action */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-semibold text-[#1A3A52] mb-1">Valeur de l'Action</h3>
                <p className="text-xs text-slate-400 mb-2">Progression par année (€/action)</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#C9A961]/10 rounded-lg p-2 text-center flex-1">
                    <p className="text-xs text-slate-500">An 1</p>
                    <p className="font-bold text-[#C9A961] text-sm">{eur2(annees[0]?.valAction)}</p>
                  </div>
                  <div className="text-[#C9A961] font-bold">→</div>
                  <div className="bg-[#1A3A52] rounded-lg p-2 text-center flex-1">
                    <p className="text-xs text-white/60">An 11</p>
                    <p className="font-bold text-white text-sm">{eur2(derniere.valAction)}</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={175}>
                  <AreaChart data={chartAction}>
                    <defs>
                      <linearGradient id="gAction" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A961" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#C9A961" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickFormatter={v => `${v}€`} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip formatter={v => `${v} €`} />} />
                    <Area type="monotone" dataKey="Valeur Action €" stroke="#C9A961" strokeWidth={2.5} fill="url(#gAction)" dot={{ fill: '#C9A961', r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Répartition structure financement */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col">
                <h3 className="font-semibold text-[#1A3A52] mb-1">Structure de Financement</h3>
                <p className="text-xs text-slate-400 mb-3">Répartition fonds propres / dette</p>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={[
                        { name: 'Fonds Propres', value: params.investissement },
                        { name: 'Total Dettes', value: totalDetteInitiale },
                      ]} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                        <Cell fill="#1A3A52" />
                        <Cell fill="#C9A961" />
                      </Pie>
                      <Tooltip content={<CustomTooltip formatter={v => eur(v)} />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 w-full mt-2">
                    <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-[#1A3A52] flex-shrink-0"></div><span className="text-slate-600">Fonds propres<br /><strong>{eur(params.investissement)}</strong></span></div>
                    <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-[#C9A961] flex-shrink-0"></div><span className="text-slate-600">Dettes<br /><strong>{eur(totalDetteInitiale)}</strong></span></div>
                  </div>
                </div>
                <div className="mt-3 bg-slate-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-slate-500">LTC initial</p>
                  <p className="font-bold text-[#1A3A52] text-lg">{annees[0]?.ltc != null ? `${(annees[0].ltc * 100).toFixed(1)}%` : '—'}</p>
                </div>
              </div>
            </div>

            {/* Barre de performance bottom */}
            <div className="bg-gradient-to-r from-[#0F2537] to-[#1A4A6A] rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'CMPC', val: `${params.cmpc} %`, sub: 'Coût moyen pondéré du capital' },
                { label: 'Effet de levier', val: `×${(totalDetteInitiale / params.investissement).toFixed(1)}`, sub: `${eur(totalDetteInitiale)} dettes / ${eur(params.investissement)} fonds propres` },
                { label: 'Total intérêts payés', val: eur(params.prets.reduce((s, p) => {
                    const ann = calcAnnuite(p.montant, p.taux / 100, p.duree);
                    return s + ann * p.duree - p.montant;
                  }, 0)), sub: 'Sur durée complète des prêts' },
                { label: 'Rendement locatif', val: `${params.tauxRendementLocatif} %`, sub: `Loyers : ${eur(annees[0]?.loyers)} en An 1` },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-white/50 text-xs mb-1">{s.label}</p>
                  <p className="text-white font-bold text-xl">{s.val}</p>
                  <p className="text-white/30 text-xs mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            ONGLET BP COMPLET
        ═══════════════════════════════════════════════════════ */}
        {activeTab === 'complet' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <BPTable annees={11} rows={[
              { label: 'I. EXPLOITATION DU PARC', section: true },
              { label: 'Valeur Parc Brut (€)', data: annees.map(a => a.parcBrut), fmt: eur, hl: 'gold' },
              { label: 'Valeur Nette Parc (€)', data: annees.map(a => a.valNette), fmt: eur },
              { label: 'Revenus Locatifs brut', data: annees.map(a => a.loyers), fmt: eur, hl: 'green' },
              { label: 'Charges non récupérables', data: annees.map(a => a.charges), fmt: eur, hl: 'red' },
              { label: 'Rémunération direction', data: annees.map(a => a.remuDir), fmt: eur, hl: 'red' },
              { label: 'II. FLUX & DÉSENDETTEMENT', section: true },
              { label: 'Service de la dette', data: annees.map(a => a.dette), fmt: eur, hl: 'red' },
              { label: 'Résultat avant IS', data: annees.map(a => a.res), fmt: eur, hl: 'gold' },
              { label: 'IS', data: annees.map(a => a.IS), fmt: eur, hl: 'red' },
              { label: 'Trésorerie Annuelle', data: annees.map(a => a.tresoAnn), fmt: eur, hl: 'green' },
              { label: 'Trésorerie Cumulée', data: annees.map(a => a.tresCum), fmt: eur },
              { label: 'III. VALORISATION', section: true },
              { label: 'Valeur de la Société', data: annees.map(a => a.valSoc), fmt: eur, hl: 'gold' },
              { label: "Valeur de l'Action (€)", data: annees.map(a => a.valAction), fmt: v => eur2(v) },
              { label: 'IV. RATIOS', section: true },
              { label: 'LTC', data: annees.map(a => a.ltc), fmt: pct2, hl: 'gold' },
              { label: 'DSCR (loyer brut)', data: annees.map(a => a.dscrBrut), fmt: v => v == null ? '—' : f4(v) },
              { label: 'V. INVESTISSEUR', section: true },
              { label: 'Carried Interest', data: annees.map(a => a.carried), fmt: v => v == null ? '—' : eur(v) },
              { label: 'Retour NET', data: annees.map(a => a.retourNet), fmt: v => v == null ? '—' : eur(v), hl: 'green' },
              { label: 'TRI NET', data: annees.map(a => a.tri), fmt: v => v == null ? '—' : pct2(v), hl: 'gold' },
            ]} />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            ONGLET INVESTISSEUR
        ═══════════════════════════════════════════════════════ */}
        {activeTab === 'investisseur' && (
          <div className="space-y-4">
            <div className="bg-[#0F2537] rounded-2xl p-4 text-white text-sm flex flex-wrap gap-6">
              <div><span className="text-white/50">Investissement</span><br /><strong className="text-[#C9A961] text-lg">{eur(params.investissement)}</strong></div>
              <div><span className="text-white/50">Hurdle</span><br /><strong className="text-lg">{params.hurdle} %/an</strong></div>
              <div><span className="text-white/50">Carried Interest</span><br /><strong className="text-lg">{params.carriedPct} %</strong></div>
              <div><span className="text-white/50">Nb actions</span><br /><strong className="text-lg">{f0(params.nbActions)}</strong></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {annees.filter(a => a.tri != null).map(a => (
                <div key={a.annee} className={`rounded-2xl border p-5 ${a.tri >= 0.065 ? 'border-emerald-200 bg-emerald-50' : 'border-orange-200 bg-orange-50'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-800 text-base">Sortie Année {a.annee}</p>
                      <p className="text-sm text-slate-500 mt-0.5">Retour net : <strong>{eur(a.retourNet)}</strong></p>
                      {a.carried != null && <p className="text-xs text-slate-400">Carried : {eur(a.carried)}</p>}
                    </div>
                    <div className="text-right">
                      <p className={`text-4xl font-bold ${a.tri >= 0.065 ? 'text-emerald-600' : 'text-orange-600'}`}>{(a.tri * 100).toFixed(2)}%</p>
                      <p className="text-xs text-slate-400">TRI Net</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-2.5 bg-white rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${a.tri >= 0.065 ? 'bg-emerald-500' : 'bg-orange-400'}`} style={{ width: `${Math.min(100, (a.tri / 0.15) * 100)}%` }} />
                    </div>
                    <span className={`text-xs font-semibold flex items-center gap-1 ${a.tri >= 0.065 ? 'text-emerald-600' : 'text-orange-600'}`}>
                      {a.tri >= 0.065 ? <><CheckCircle2 className="h-3.5 w-3.5" /> Hurdle OK</> : <><AlertCircle className="h-3.5 w-3.5" /> Sous hurdle</>}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            ONGLET DETTES
        ═══════════════════════════════════════════════════════ */}
        {activeTab === 'dettes' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Service de la Dette par Prêt et par Année (€)</h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#1A3A52] text-white">
                      <th className="px-3 py-2.5 text-left min-w-[140px]">Prêt</th>
                      <th className="px-3 py-2.5 text-right">Montant</th>
                      <th className="px-3 py-2.5 text-right">Annuité</th>
                      <th className="px-3 py-2.5 text-right">Début</th>
                      {Array.from({ length: 11 }, (_, i) => <th key={i} className="px-3 py-2.5 text-right">An {i+1}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {params.prets.map((p, pi) => {
                      const ann = calcAnnuite(p.montant, p.taux / 100, p.duree);
                      return (
                        <tr key={p.id} className={pi % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="px-3 py-2 font-medium text-slate-700">{p.label}</td>
                          <td className="px-3 py-2 text-right font-mono">{eur(p.montant)}</td>
                          <td className="px-3 py-2 text-right font-mono font-semibold text-[#1A3A52]">{eur(ann)}</td>
                          <td className="px-3 py-2 text-right">An {p.anneeDebut}</td>
                          {Array.from({ length: 11 }, (_, i) => {
                            const off = (i + 1) - p.anneeDebut;
                            const actif = off >= 0 && off < p.duree;
                            return <td key={i} className={`px-3 py-2 text-right font-mono ${actif ? 'text-red-700' : 'text-slate-300'}`}>{actif ? eur(ann) : '—'}</td>;
                          })}
                        </tr>
                      );
                    })}
                    <tr className="bg-[#C9A961]/10 font-bold">
                      <td className="px-3 py-2">TOTAL</td>
                      <td className="px-3 py-2 text-right font-mono">{eur(params.prets.reduce((s,p)=>s+p.montant,0))}</td>
                      <td></td><td></td>
                      {annees.map(a => <td key={a.annee} className="px-3 py-2 text-right font-mono text-[#1A3A52]">{eur(a.dette)}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tableaux d'amortissement accordéon */}
            <div className="space-y-2">
              {params.prets.map(p => {
                const ann = calcAnnuite(p.montant, p.taux / 100, p.duree);
                const isOpen = detteOuverte === p.id;
                let k = p.montant, rows = [];
                for (let i = 0; i < p.duree; i++) {
                  const int = k * (p.taux / 100);
                  const cap = ann - int;
                  k = Math.max(0, k - cap);
                  rows.push([p.montant - (rows.length > 0 ? p.montant - (rows[rows.length-1][0] - rows[rows.length-1][3]) : 0), ann, int, cap, k]);
                }
                // Recalc propre
                let kk = p.montant; rows = [];
                for (let i = 0; i < p.duree; i++) {
                  const kD = kk; const int = kk * (p.taux/100); const cap = ann - int; kk = Math.max(0, kk - cap);
                  rows.push([kD, ann, int, cap, kk]);
                }
                return (
                  <div key={p.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <button onClick={() => setDetteOuverte(isOpen ? null : p.id)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="font-bold text-[#1A3A52]">{p.label}</span>
                        <span className="text-slate-500">Montant : <strong>{eur(p.montant)}</strong></span>
                        <span className="text-slate-500">Annuité : <strong className="text-[#1A3A52]">{eur(ann)}/an</strong></span>
                        <span className="text-slate-500">Taux : <strong>{p.taux}%</strong></span>
                        <span className="text-slate-500">Durée : <strong>{p.duree} ans</strong></span>
                      </div>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                    </button>
                    {isOpen && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead><tr className="bg-slate-700 text-white">
                            <th className="px-3 py-2 text-left">Année</th>
                            <th className="px-3 py-2 text-right">K Début</th>
                            <th className="px-3 py-2 text-right">Annuité</th>
                            <th className="px-3 py-2 text-right">Intérêts</th>
                            <th className="px-3 py-2 text-right">Capital</th>
                            <th className="px-3 py-2 text-right">K Fin</th>
                          </tr></thead>
                          <tbody className="divide-y divide-slate-100">
                            {rows.map((r, ri) => (
                              <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                <td className="px-3 py-1.5 font-medium">{2026 + p.anneeDebut + ri}</td>
                                <td className="px-3 py-1.5 text-right font-mono">{eur(r[0])}</td>
                                <td className="px-3 py-1.5 text-right font-mono font-semibold text-[#1A3A52]">{eur(r[1])}</td>
                                <td className="px-3 py-1.5 text-right font-mono text-red-700">{eur(r[2])}</td>
                                <td className="px-3 py-1.5 text-right font-mono text-emerald-700">{eur(r[3])}</td>
                                <td className="px-3 py-1.5 text-right font-mono">{eur(r[4])}</td>
                              </tr>
                            ))}
                            <tr className="bg-[#C9A961]/10 font-bold">
                              <td className="px-3 py-1.5">TOTAL</td><td></td>
                              <td className="px-3 py-1.5 text-right font-mono">{eur(ann * p.duree)}</td>
                              <td className="px-3 py-1.5 text-right font-mono text-red-700">{eur(ann * p.duree - p.montant)}</td>
                              <td className="px-3 py-1.5 text-right font-mono text-emerald-700">{eur(p.montant)}</td>
                              <td className="px-3 py-1.5 text-right font-mono">0 €</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            ONGLET PARAMÈTRES
        ═══════════════════════════════════════════════════════ */}
        {activeTab === 'parametres' && (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
              Tous les paramètres ci-dessous sont interconnectés. Chaque modification recalcule instantanément l'ensemble du BP (tableaux, graphiques, TRI...).
            </div>

            {/* Paramètres généraux */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2"><Building2 className="h-4 w-4 text-[#C9A961]" /> Paramètres Généraux</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <InputParam label="Valeur parc initial (€)" value={params.valeurParcInitial} onChange={v => set('valeurParcInitial', v)} suffix="€" step="1000" />
                <InputParam label="Revalorisation annuelle" value={params.tauxRevalorisation} onChange={v => set('tauxRevalorisation', v)} suffix="%" />
                <InputParam label="Rendement locatif brut" value={params.tauxRendementLocatif} onChange={v => set('tauxRendementLocatif', v)} suffix="%" />
                <InputParam label="Charges non récupérables" value={params.tauxChargesNonRecup} onChange={v => set('tauxChargesNonRecup', v)} suffix="%" />
                <InputParam label="Rémunération direction" value={params.tauxRemuDirection} onChange={v => set('tauxRemuDirection', v)} suffix="%" />
                <InputParam label="Taux IS" value={params.tauxIS} onChange={v => set('tauxIS', v)} suffix="%" />
                <InputParam label="CMPC" value={params.cmpc} onChange={v => set('cmpc', v)} suffix="%" />
                <InputParam label="Nombre d'actions" value={params.nbActions} onChange={v => set('nbActions', Math.round(v))} step="1000" />
              </div>
            </div>

            {/* Paramètres investisseur */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-[#C9A961]" /> Investisseur</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <InputParam label="Investissement initial (€)" value={params.investissement} onChange={v => set('investissement', v)} suffix="€" step="1000" />
                <InputParam label="Hurdle Rate" value={params.hurdle} onChange={v => set('hurdle', v)} suffix="%" />
                <InputParam label="Carried Interest" value={params.carriedPct} onChange={v => set('carriedPct', v)} suffix="%" />
              </div>
            </div>

            {/* Acquisitions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1A3A52] flex items-center gap-2"><Building2 className="h-4 w-4 text-[#C9A961]" /> Acquisitions ({params.acquisitions.length})</h3>
                <Button size="sm" onClick={addAcq} className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white h-8 text-xs gap-1">
                  <Plus className="h-3.5 w-3.5" /> Ajouter
                </Button>
              </div>
              {params.acquisitions.length === 0 && <p className="text-slate-400 text-sm italic">Aucune acquisition. Cliquez sur Ajouter.</p>}
              <div className="space-y-3">
                {params.acquisitions.map(a => (
                  <div key={a.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <input type="text" value={a.label} onChange={e => updateAcq(a.id, 'label', e.target.value)}
                        className="text-sm font-semibold text-[#1A3A52] bg-transparent border-b border-dashed border-slate-300 focus:outline-none" />
                      <button onClick={() => removeAcq(a.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-200"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <InputParam label="Année d'acquisition" value={a.annee} onChange={v => updateAcq(a.id, 'annee', Math.round(v))} min={1} step="1" />
                      <InputParam label="Valeur (€)" value={a.valeur} onChange={v => updateAcq(a.id, 'valeur', v)} suffix="€" step="1000" />
                      <InputParam label="Financement (%)" value={a.financement} onChange={v => updateAcq(a.id, 'financement', v)} suffix="%" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prêts */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1A3A52] flex items-center gap-2"><Euro className="h-4 w-4 text-[#C9A961]" /> Prêts Bancaires ({params.prets.length})</h3>
                <Button size="sm" onClick={addPret} className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white h-8 text-xs gap-1">
                  <Plus className="h-3.5 w-3.5" /> Ajouter
                </Button>
              </div>
              <div className="space-y-3">
                {params.prets.map(p => {
                  const ann = calcAnnuite(p.montant, p.taux / 100, p.duree);
                  return (
                    <div key={p.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <input type="text" value={p.label} onChange={e => updatePret(p.id, 'label', e.target.value)}
                            className="text-sm font-semibold text-[#1A3A52] bg-transparent border-b border-dashed border-slate-300 focus:outline-none" />
                          <span className="text-xs bg-[#C9A961]/20 text-amber-800 px-2 py-0.5 rounded-full font-medium">{eur(ann)}/an</span>
                        </div>
                        <button onClick={() => removePret(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-200"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <InputParam label="Montant (€)" value={p.montant} onChange={v => updatePret(p.id, 'montant', v)} suffix="€" step="1000" />
                        <InputParam label="Taux (%)" value={p.taux} onChange={v => updatePret(p.id, 'taux', v)} suffix="%" />
                        <InputParam label="Durée (ans)" value={p.duree} onChange={v => updatePret(p.id, 'duree', Math.round(v))} step="1" />
                        <InputParam label="Année début" value={p.anneeDebut} onChange={v => updatePret(p.id, 'anneeDebut', Math.round(v))} step="1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}