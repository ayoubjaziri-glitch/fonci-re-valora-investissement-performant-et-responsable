import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Building2, Percent, Euro, Calculator, BarChart3,
  RefreshCw, Info, ChevronDown, ChevronUp, AlertCircle, CheckCircle2,
  Target, Layers, PieChart, ArrowRight, Download
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n, decimals = 0) =>
  isNaN(n) ? '—' : new Intl.NumberFormat('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
const pct = (n, decimals = 1) => isNaN(n) || !isFinite(n) ? '—' : `${fmt(n * 100, decimals)} %`;
const eur = (n, decimals = 0) => `${fmt(n, decimals)} €`;

// ─── Calcul du tableau d'amortissement d'un prêt ────────────────────────────
function amortissement(montant, taux, duree) {
  if (montant <= 0 || duree <= 0) return { annuite: 0, tableau: [] };
  const annuite = montant * (taux * Math.pow(1 + taux, duree)) / (Math.pow(1 + taux, duree) - 1);
  let reste = montant;
  const tableau = [];
  for (let i = 0; i < duree; i++) {
    const interet = reste * taux;
    const capital = annuite - interet;
    reste = Math.max(0, reste - capital);
    tableau.push({ interet, capital, annuite, resteDu: reste });
  }
  return { annuite, tableau };
}

// ─── Moteur de calcul principal ──────────────────────────────────────────────
function calculerBP(inputs) {
  const {
    valeurParcInitial, tauxRevalorisation,
    tauxRendementLocatif, tauxChargesNonRecup,
    tauxIS, tauxRemunDirection, hurdle,
    investissementTotal, detteInitiale, tauxDette, dureeDette,
    nbActions, tauxActualisationDCF,
    nbAnnees,
    acquisitionsSupp // [{annee, montant, dette}]
  } = inputs;

  const pret1 = amortissement(detteInitiale, tauxDette, dureeDette);
  const annees = [];

  let valeurParcBrut = valeurParcInitial;
  let detteTotale = detteInitiale;
  let tresorerieCumulee = 0;

  // Prêts supplémentaires par acquisition
  const pretsSupp = (acquisitionsSupp || []).map(a => ({
    ...a,
    amort: amortissement(a.dette, tauxDette, dureeDette)
  }));

  for (let i = 0; i < nbAnnees; i++) {
    const annee = i + 1;

    // Acquisitions supplémentaires cette année
    const acqAnnee = (acquisitionsSupp || []).filter(a => a.annee === annee);
    acqAnnee.forEach(a => { valeurParcBrut += a.montant; });

    // Revalorisation annuelle du parc
    valeurParcBrut *= (1 + tauxRevalorisation);

    // Service de la dette total pour cette année
    let serviceDette = 0;
    let amortCapital = 0;

    // Prêt 1
    if (i < pret1.tableau.length) {
      serviceDette += pret1.annuite;
      amortCapital += pret1.tableau[i].capital;
    }
    // Prêts supplémentaires
    pretsSupp.forEach(p => {
      const anneePret = annee - p.annee;
      if (anneePret > 0 && anneePret <= p.amort.tableau.length) {
        const idx = anneePret - 1;
        serviceDette += p.amort.annuite;
        amortCapital += p.amort.tableau[idx].capital;
      }
    });

    // Mise à jour dette résiduelle
    detteTotale = Math.max(0, detteTotale - amortCapital);

    const valeurNetteParc = valeurParcBrut - detteTotale;
    const revenusLocatifsB = valeurParcBrut * tauxRendementLocatif;
    const chargesNonRecup = revenusLocatifsB * tauxChargesNonRecup;
    const remuDirection = annee > 1 ? revenusLocatifsB * tauxRemunDirection : 0;

    const EBE = revenusLocatifsB - chargesNonRecup - remuDirection - serviceDette;
    const IS = Math.max(0, EBE * tauxIS);
    const tresorerieAnnuelle = EBE - IS;
    tresorerieCumulee += tresorerieAnnuelle;

    // LTC
    const ltc = valeurParcBrut > 0 ? detteTotale / valeurParcBrut : 0;
    // DSCR
    const dscr = serviceDette > 0 ? revenusLocatifsB / serviceDette : 0;

    // Valeur de la société (DCF simplifié : VAN des flux futurs + valeur terminale)
    const fluxActualise = tresorerieAnnuelle / Math.pow(1 + tauxActualisationDCF, annee);
    const valeurTerminale = annee === nbAnnees
      ? (tresorerieAnnuelle / tauxActualisationDCF) / Math.pow(1 + tauxActualisationDCF, annee)
      : 0;

    // Valeur société DCF cumulée
    const valeurSociete = valeurNetteParc + tresorerieCumulee;

    // Valeur action
    const valeurAction = nbActions > 0 ? valeurSociete / nbActions : 0;

    annees.push({
      annee,
      valeurParcBrut: Math.round(valeurParcBrut),
      valeurNetteParc: Math.round(valeurNetteParc),
      detteTotale: Math.round(detteTotale),
      revenusLocatifsB: Math.round(revenusLocatifsB),
      chargesNonRecup: Math.round(chargesNonRecup),
      remuDirection: Math.round(remuDirection),
      serviceDette: Math.round(serviceDette),
      EBE: Math.round(EBE),
      IS: Math.round(IS),
      tresorerieAnnuelle: Math.round(tresorerieAnnuelle),
      tresorerieCumulee: Math.round(tresorerieCumulee),
      ltc,
      dscr,
      valeurSociete: Math.round(valeurSociete),
      valeurAction: Math.round(valeurAction * 100) / 100,
    });
  }

  // ── TRI par scénario de sortie ──
  const investissement = investissementTotal;
  const triScenarios = [];
  for (let sortie = 5; sortie <= Math.min(nbAnnees, 10); sortie++) {
    const flux = [-investissement];
    for (let i = 0; i < sortie - 1; i++) {
      // Dividendes = trésorerie annuelle * part investisseurs (approximation)
      flux.push(annees[i].tresorerieAnnuelle * 0.78);
    }
    // Dernière année : dividende + valeur résiduelle de la part
    const valFinale = annees[sortie - 1].valeurSociete * 0.78;
    const dividende = annees[sortie - 1].tresorerieAnnuelle * 0.78;
    // Carried interest
    const plusValueInvest = valFinale - investissement;
    const hurdleTotal = investissement * Math.pow(1 + hurdle, sortie) - investissement;
    const carriedBase = Math.max(0, plusValueInvest - hurdleTotal);
    const carried = carriedBase * 0.2;
    flux.push(dividende + valFinale - carried);

    const tri = calculerTRI(flux);
    triScenarios.push({ sortie, tri, valFinale: Math.round(valFinale), carried: Math.round(carried) });
  }

  return { annees, triScenarios };
}

function calculerTRI(flux) {
  // Newton-Raphson
  let taux = 0.1;
  for (let iter = 0; iter < 1000; iter++) {
    let van = 0, dvan = 0;
    for (let t = 0; t < flux.length; t++) {
      van += flux[t] / Math.pow(1 + taux, t);
      dvan -= t * flux[t] / Math.pow(1 + taux, t + 1);
    }
    if (Math.abs(dvan) < 1e-12) break;
    const newTaux = taux - van / dvan;
    if (Math.abs(newTaux - taux) < 1e-8) { taux = newTaux; break; }
    taux = newTaux;
  }
  return isFinite(taux) ? taux : NaN;
}

// ─── Composant InputField ────────────────────────────────────────────────────
function InputField({ label, value, onChange, suffix = '', prefix = '', type = 'number', min, max, step, tooltip, highlight }) {
  return (
    <div className={`p-3 rounded-xl border transition-all ${highlight ? 'border-[#C9A961] bg-[#C9A961]/5' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
      <div className="flex items-center gap-1 mb-1">
        <label className="text-xs font-medium text-slate-600">{label}</label>
        {tooltip && (
          <div className="relative group">
            <Info className="h-3 w-3 text-slate-400 cursor-help" />
            <div className="absolute bottom-5 left-0 bg-slate-800 text-white text-xs rounded-lg p-2 w-48 hidden group-hover:block z-10 shadow-xl">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        {prefix && <span className="text-sm text-slate-500 font-medium">{prefix}</span>}
        <Input
          type={type}
          value={value}
          onChange={e => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
          min={min} max={max} step={step || 'any'}
          className="h-8 text-sm font-semibold border-0 p-0 focus-visible:ring-0 bg-transparent"
        />
        {suffix && <span className="text-sm text-slate-500 font-medium whitespace-nowrap">{suffix}</span>}
      </div>
    </div>
  );
}

// ─── Composant KPI Card ──────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color = 'blue', icon: Icon }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    gold: 'bg-amber-50 text-amber-700 border-amber-200',
    navy: 'bg-slate-800 text-white border-slate-700',
    red: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-2 opacity-70">
        {Icon && <Icon className="h-4 w-4" />}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs opacity-70 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Page principale ─────────────────────────────────────────────────────────
export default function AdminBusinessPlan() {
  const [inputs, setInputs] = useState({
    valeurParcInitial: 1250000,
    tauxRevalorisation: 0.015,
    tauxRendementLocatif: 0.10,
    tauxChargesNonRecup: 0.10,
    tauxIS: 0.15,
    tauxRemunDirection: 0.15,
    hurdle: 0.065,
    investissementTotal: 275000,
    detteInitiale: 1025000,
    tauxDette: 0.033,
    dureeDette: 15,
    nbActions: 200000,
    tauxActualisationDCF: 0.04,
    nbAnnees: 10,
    acquisitionsSupp: [
      { annee: 6, montant: 350000, dette: 280000 },
      { annee: 8, montant: 420000, dette: 336000 },
    ]
  });

  const set = (key, val) => setInputs(prev => ({ ...prev, [key]: val }));
  const setAcqSupp = (idx, key, val) => {
    const arr = [...inputs.acquisitionsSupp];
    arr[idx] = { ...arr[idx], [key]: val };
    set('acquisitionsSupp', arr);
  };
  const addAcq = () => set('acquisitionsSupp', [...inputs.acquisitionsSupp, { annee: 3, montant: 300000, dette: 240000 }]);
  const removeAcq = (idx) => set('acquisitionsSupp', inputs.acquisitionsSupp.filter((_, i) => i !== idx));

  const [activeTab, setActiveTab] = useState('synthese');

  const { annees, triScenarios } = useMemo(() => calculerBP(inputs), [inputs]);

  const derniere = annees[annees.length - 1] || {};
  const an5 = annees[4] || {};
  const triAn5 = triScenarios.find(t => t.sortie === 5);
  const triAn10 = triScenarios.find(t => t.sortie === inputs.nbAnnees) || triScenarios[triScenarios.length - 1];

  const chartData = annees.map(a => ({
    name: `An ${a.annee}`,
    'Parc Brut': a.valeurParcBrut,
    'Valeur Nette': a.valeurNetteParc,
    'Trésorerie Cumulée': a.tresorerieCumulee,
    'Revenus Locatifs': a.revenusLocatifsB,
    'Service Dette': a.serviceDette,
    'LTC (%)': Math.round(a.ltc * 100),
    'DSCR': Math.round(a.dscr * 100) / 100,
  }));

  const tabs = [
    { id: 'synthese', label: 'Synthèse' },
    { id: 'exploitation', label: 'Exploitation' },
    { id: 'dette', label: 'Dette & Financement' },
    { id: 'investisseur', label: 'Retour Investisseur' },
    { id: 'parametres', label: 'Paramètres' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif text-[#1A3A52] mb-1">Business Plan Interactif</h1>
            <p className="text-slate-500 text-sm">Modifiez les paramètres — tous les résultats se recalculent automatiquement</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Calcul en temps réel
            </div>
          </div>
        </div>

        {/* KPIs principaux */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <KpiCard icon={Building2} label="Valeur Parc An 1" value={eur(annees[0]?.valeurParcBrut)} sub="Brut" color="navy" />
          <KpiCard icon={TrendingUp} label={`TRI Net (sortie An 5)`} value={pct(triAn5?.tri)} sub="Hurdle 6.5% respecté" color="green" />
          <KpiCard icon={TrendingUp} label={`TRI Net (sortie An ${inputs.nbAnnees})`} value={pct(triAn10?.tri)} sub="Meilleur scénario" color="green" />
          <KpiCard icon={Euro} label={`Valeur Société An ${inputs.nbAnnees}`} value={eur(derniere.valeurSociete)} sub={`Action : ${eur(derniere.valeurAction, 2)}`} color="gold" />
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === t.id
                    ? 'text-[#1A3A52] border-b-2 border-[#C9A961] bg-[#C9A961]/5'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* ── SYNTHÈSE ── */}
            {activeTab === 'synthese' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Graphe valorisation */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Évolution du Parc & Valeur Nette (€)</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(v) => eur(v)} />
                        <Legend />
                        <Line type="monotone" dataKey="Parc Brut" stroke="#1A3A52" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="Valeur Nette" stroke="#C9A961" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="Trésorerie Cumulée" stroke="#10b981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* TRI par scénario */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">TRI Net par Scénario de Sortie</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={triScenarios.map(t => ({ name: `An ${t.sortie}`, TRI: Math.round(t.tri * 1000) / 10 }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
                        <Tooltip formatter={v => `${v} %`} />
                        <ReferenceLine y={inputs.hurdle * 100} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Hurdle', position: 'right', fontSize: 10 }} />
                        <Bar dataKey="TRI" fill="#C9A961" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Tableau récap annuel */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Récapitulatif Annuel</h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[#1A3A52] text-white">
                          <th className="px-3 py-2.5 text-left font-medium">Indicateur</th>
                          {annees.map(a => <th key={a.annee} className="px-3 py-2.5 text-right font-medium">An {a.annee}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { label: 'Valeur Parc Brut', key: 'valeurParcBrut', fmt: v => eur(v) },
                          { label: 'Revenus Locatifs', key: 'revenusLocatifsB', fmt: v => eur(v) },
                          { label: 'Service Dette', key: 'serviceDette', fmt: v => eur(v) },
                          { label: 'Trésorerie Annuelle', key: 'tresorerieAnnuelle', fmt: v => eur(v), highlight: true },
                          { label: 'Trésorerie Cumulée', key: 'tresorerieCumulee', fmt: v => eur(v) },
                          { label: 'Valeur Nette Parc', key: 'valeurNetteParc', fmt: v => eur(v) },
                          { label: 'LTC', key: 'ltc', fmt: v => pct(v) },
                          { label: 'DSCR', key: 'dscr', fmt: v => fmt(v, 2) },
                          { label: 'Valeur Société', key: 'valeurSociete', fmt: v => eur(v), highlight: true },
                        ].map((row, ri) => (
                          <tr key={ri} className={row.highlight ? 'bg-[#C9A961]/10 font-semibold' : ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="px-3 py-2 text-slate-700">{row.label}</td>
                            {annees.map(a => (
                              <td key={a.annee} className="px-3 py-2 text-right text-slate-800">{row.fmt(a[row.key])}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── EXPLOITATION ── */}
            {activeTab === 'exploitation' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Revenus vs Charges (€)</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={v => eur(v)} />
                        <Legend />
                        <Bar dataKey="Revenus Locatifs" fill="#1A3A52" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Service Dette" fill="#C9A961" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Ratios de Couverture</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <ReferenceLine y={1.2} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Min DSCR 1.2x', fontSize: 10 }} />
                        <Line type="monotone" dataKey="DSCR" stroke="#C9A961" strokeWidth={2} />
                        <Line type="monotone" dataKey="LTC (%)" stroke="#1A3A52" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-700 text-white">
                        <th className="px-3 py-2.5 text-left">Poste</th>
                        {annees.map(a => <th key={a.annee} className="px-3 py-2.5 text-right">An {a.annee}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { label: 'Revenus Locatifs Bruts', key: 'revenusLocatifsB', fmt: v => eur(v), c: 'green' },
                        { label: 'Charges non récupérables', key: 'chargesNonRecup', fmt: v => eur(v), c: 'red' },
                        { label: 'Rémunération direction', key: 'remuDirection', fmt: v => eur(v), c: 'red' },
                        { label: 'Service de la dette', key: 'serviceDette', fmt: v => eur(v), c: 'red' },
                        { label: 'EBE (avant IS)', key: 'EBE', fmt: v => eur(v), c: 'bold' },
                        { label: 'IS', key: 'IS', fmt: v => eur(v), c: 'red' },
                        { label: 'Trésorerie nette', key: 'tresorerieAnnuelle', fmt: v => eur(v), c: 'highlight' },
                      ].map((row, ri) => (
                        <tr key={ri} className={row.c === 'highlight' ? 'bg-emerald-50 font-semibold' : ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className={`px-3 py-2 ${row.c === 'red' ? 'text-red-700' : row.c === 'green' ? 'text-emerald-700' : 'text-slate-700'}`}>{row.label}</td>
                          {annees.map(a => (
                            <td key={a.annee} className={`px-3 py-2 text-right ${row.c === 'red' ? 'text-red-700' : row.c === 'green' ? 'text-emerald-700' : 'text-slate-800'}`}>
                              {row.fmt(a[row.key])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── DETTE ── */}
            {activeTab === 'dette' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <KpiCard icon={Euro} label="Dette initiale" value={eur(inputs.detteInitiale)} sub={`Taux ${pct(inputs.tauxDette)} sur ${inputs.dureeDette} ans`} color="navy" />
                  <KpiCard icon={Percent} label="Annuité Prêt 1" value={eur(amortissement(inputs.detteInitiale, inputs.tauxDette, inputs.dureeDette).annuite)} sub="Remboursement annuel" color="blue" />
                  <KpiCard icon={BarChart3} label="LTC An 1" value={pct(annees[0]?.ltc)} sub={`Cible <= 80%`} color={annees[0]?.ltc > 0.8 ? 'red' : 'green'} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Évolution de la Dette Résiduelle (€)</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={v => eur(v)} />
                      <Legend />
                      <Line type="monotone" dataKey="Parc Brut" stroke="#1A3A52" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Dette Résiduelle & LTC par Année</h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[#1A3A52] text-white">
                          <th className="px-3 py-2.5 text-left">Indicateur</th>
                          {annees.map(a => <th key={a.annee} className="px-3 py-2.5 text-right">An {a.annee}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { label: 'Valeur Parc Brut', key: 'valeurParcBrut', fmt: v => eur(v) },
                          { label: 'Dette Résiduelle', key: 'detteTotale', fmt: v => eur(v) },
                          { label: 'Service de la Dette', key: 'serviceDette', fmt: v => eur(v) },
                          { label: 'LTC', key: 'ltc', fmt: v => pct(v), highlight: true },
                          { label: 'DSCR', key: 'dscr', fmt: v => fmt(v, 2), highlight: true },
                        ].map((row, ri) => (
                          <tr key={ri} className={row.highlight ? 'bg-[#C9A961]/10 font-semibold' : ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="px-3 py-2 text-slate-700">{row.label}</td>
                            {annees.map(a => (
                              <td key={a.annee} className="px-3 py-2 text-right text-slate-800">{row.fmt(a[row.key])}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── RETOUR INVESTISSEUR ── */}
            {activeTab === 'investisseur' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-slate-800">Scénarios de Sortie</h3>
                    {triScenarios.map(s => (
                      <div key={s.sortie} className={`rounded-xl border p-4 ${s.tri >= inputs.hurdle ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <p className="font-semibold text-slate-800">Sortie à l'Année {s.sortie}</p>
                            <p className="text-xs text-slate-500">Valeur finale investisseurs : {eur(s.valeurFinale)}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${s.tri >= inputs.hurdle ? 'text-emerald-600' : 'text-red-600'}`}>
                              {pct(s.tri)}
                            </p>
                            <p className="text-xs text-slate-500">TRI Net</p>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-600">
                          <span>Carried interest : {eur(s.carried)}</span>
                          <span className={`font-medium flex items-center gap-1 ${s.tri >= inputs.hurdle ? 'text-emerald-600' : 'text-red-600'}`}>
                            {s.tri >= inputs.hurdle ? <><CheckCircle2 className="h-3 w-3" /> Hurdle atteint</> : <><AlertCircle className="h-3 w-3" /> Hurdle non atteint</>}
                          </span>
                        </div>
                        {/* Barre de progression TRI */}
                        <div className="mt-2 h-1.5 bg-white rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${s.tri >= inputs.hurdle ? 'bg-emerald-500' : 'bg-red-400'}`}
                            style={{ width: `${Math.min(100, (s.tri / 0.15) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-4">Valeur de l'Action (€)</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={annees.map(a => ({ name: `An ${a.annee}`, 'Valeur Action': a.valeurAction }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v} €`} />
                        <Tooltip formatter={v => eur(v, 2)} />
                        <Line type="monotone" dataKey="Valeur Action" stroke="#C9A961" strokeWidth={3} dot={{ fill: '#C9A961', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>

                    <div className="mt-4 bg-[#1A3A52] rounded-xl p-4 text-white">
                      <p className="text-sm font-medium text-white/70 mb-1">Investissement initial</p>
                      <p className="text-xl font-bold">{eur(inputs.investissementTotal)}</p>
                      <p className="text-xs text-white/50 mt-1">
                        {inputs.nbActions > 0 ? `${fmt(inputs.investissementTotal / (inputs.valeurParcInitial / inputs.nbActions * 100) * 100, 1)} actions équivalentes` : ''}
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="bg-white/10 rounded-lg p-2">
                          <p className="text-xs text-white/60">Valeur An 1</p>
                          <p className="font-semibold">{eur(annees[0]?.valeurAction || 0, 2)} / action</p>
                        </div>
                        <div className="bg-[#C9A961]/20 rounded-lg p-2">
                          <p className="text-xs text-white/60">Valeur An {inputs.nbAnnees}</p>
                          <p className="font-semibold text-[#C9A961]">{eur(derniere.valeurAction || 0, 2)} / action</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── PARAMÈTRES ── */}
            {activeTab === 'parametres' && (
              <div className="space-y-8">
                {/* Actif immobilier */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#C9A961]" /> Actif Immobilier
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <InputField
                      label="Valeur parc initial" value={inputs.valeurParcInitial}
                      onChange={v => set('valeurParcInitial', v)}
                      suffix="€" tooltip="Valeur brute d'acquisition du parc au démarrage" highlight
                    />
                    <InputField
                      label="Revalorisation annuelle" value={inputs.tauxRevalorisation * 100}
                      onChange={v => set('tauxRevalorisation', v / 100)}
                      suffix="%" tooltip="Hausse annuelle de la valeur du parc immobilier" min={0} max={20}
                    />
                    <InputField
                      label="Rendement locatif brut" value={inputs.tauxRendementLocatif * 100}
                      onChange={v => set('tauxRendementLocatif', v / 100)}
                      suffix="%" tooltip="Revenus locatifs annuels / Valeur du parc" min={0} max={30} highlight
                    />
                    <InputField
                      label="Charges non récupérables" value={inputs.tauxChargesNonRecup * 100}
                      onChange={v => set('tauxChargesNonRecup', v / 100)}
                      suffix="%" tooltip="% des loyers consacrés aux charges non récupérables" min={0} max={50}
                    />
                  </div>
                </div>

                {/* Financement */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Euro className="h-4 w-4 text-[#C9A961]" /> Financement
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <InputField
                      label="Dette initiale (Prêt 1)" value={inputs.detteInitiale}
                      onChange={v => set('detteInitiale', v)}
                      suffix="€" tooltip="Montant total du prêt bancaire initial" highlight
                    />
                    <InputField
                      label="Taux d'intérêt" value={inputs.tauxDette * 100}
                      onChange={v => set('tauxDette', v / 100)}
                      suffix="%" tooltip="Taux annuel du crédit immobilier" min={0} max={15}
                    />
                    <InputField
                      label="Durée du prêt" value={inputs.dureeDette}
                      onChange={v => set('dureeDette', Math.round(v))}
                      suffix="ans" tooltip="Durée d'amortissement du prêt" min={5} max={25}
                    />
                    <InputField
                      label="Investissement apporteurs" value={inputs.investissementTotal}
                      onChange={v => set('investissementTotal', v)}
                      suffix="€" tooltip="Capital total apporté par les investisseurs" highlight
                    />
                  </div>
                </div>

                {/* Gouvernance & fiscalité */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Percent className="h-4 w-4 text-[#C9A961]" /> Gouvernance & Fiscalité
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <InputField
                      label="Rémunération direction" value={inputs.tauxRemunDirection * 100}
                      onChange={v => set('tauxRemunDirection', v / 100)}
                      suffix="%" tooltip="% des loyers versés à la direction (hors carried)" min={0} max={30}
                    />
                    <InputField
                      label="Hurdle Rate" value={inputs.hurdle * 100}
                      onChange={v => set('hurdle', v / 100)}
                      suffix="%" tooltip="Rendement minimum garanti aux investisseurs avant carried" min={0} max={20} highlight
                    />
                    <InputField
                      label="Taux IS" value={inputs.tauxIS * 100}
                      onChange={v => set('tauxIS', v / 100)}
                      suffix="%" tooltip="Impôt sur les sociétés" min={0} max={33}
                    />
                    <InputField
                      label="Taux actualisation DCF" value={inputs.tauxActualisationDCF * 100}
                      onChange={v => set('tauxActualisationDCF', v / 100)}
                      suffix="%" tooltip="Taux d'actualisation pour le calcul DCF (CMPC)" min={0} max={20}
                    />
                  </div>
                </div>

                {/* Structure */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#C9A961]" /> Structure & Durée
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <InputField
                      label="Nombre d'actions" value={inputs.nbActions}
                      onChange={v => set('nbActions', Math.round(v))}
                      tooltip="Nombre total d'actions émises" min={1000}
                    />
                    <InputField
                      label="Horizon (années)" value={inputs.nbAnnees}
                      onChange={v => set('nbAnnees', Math.min(15, Math.max(5, Math.round(v))))}
                      suffix="ans" tooltip="Durée du business plan" min={5} max={15}
                    />
                  </div>
                </div>

                {/* Acquisitions supplémentaires */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <Target className="h-4 w-4 text-[#C9A961]" /> Acquisitions Supplémentaires
                    </h3>
                    <Button size="sm" onClick={addAcq} className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white text-xs h-8">
                      + Ajouter
                    </Button>
                  </div>
                  {inputs.acquisitionsSupp.length === 0 && (
                    <p className="text-sm text-slate-400 italic">Aucune acquisition supplémentaire planifiée.</p>
                  )}
                  {inputs.acquisitionsSupp.map((acq, idx) => (
                    <div key={idx} className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <InputField
                        label="Année d'acquisition" value={acq.annee}
                        onChange={v => setAcqSupp(idx, 'annee', Math.round(v))}
                        min={1} max={inputs.nbAnnees}
                      />
                      <InputField
                        label="Montant (€)" value={acq.montant}
                        onChange={v => setAcqSupp(idx, 'montant', v)}
                        suffix="€"
                      />
                      <InputField
                        label="Dette associée (€)" value={acq.dette}
                        onChange={v => setAcqSupp(idx, 'dette', v)}
                        suffix="€"
                      />
                      <div className="flex items-end">
                        <button
                          onClick={() => removeAcq(idx)}
                          className="w-full h-8 text-xs text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Résumé des hypothèses */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <p className="text-sm font-semibold text-amber-800">Résumé des Hypothèses Clés</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-amber-700">
                    <div>LTC initial : <strong>{pct(inputs.detteInitiale / inputs.valeurParcInitial)}</strong></div>
                    <div>Effet de levier : <strong>x{fmt(inputs.valeurParcInitial / inputs.investissementTotal, 1)}</strong></div>
                    <div>Rendement net an1 : <strong>{pct((annees[0]?.tresorerieAnnuelle || 0) / inputs.investissementTotal)}</strong></div>
                    <div>Hurdle rate : <strong>{pct(inputs.hurdle)}</strong></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}