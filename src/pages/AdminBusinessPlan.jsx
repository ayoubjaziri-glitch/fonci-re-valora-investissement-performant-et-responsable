import React, { useState, useMemo } from 'react';
import {
  TrendingUp, Building2, Euro, Plus, Trash2,
  ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Settings, BarChart3
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell
} from 'recharts';

// ─── Formatters ───────────────────────────────────────────────────────────────
const f0  = n => (n == null || isNaN(n)) ? '—' : new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n);
const f2  = n => (n == null || isNaN(n)) ? '—' : new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const f4  = n => (n == null || isNaN(n)) ? '—' : new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(n);
const eur  = n => (n == null || isNaN(n)) ? '—' : `${f0(n)} €`;
const eur2 = n => (n == null || isNaN(n)) ? '—' : `${f2(n)} €`;
const pct2 = n => (n == null || isNaN(n) || !isFinite(n)) ? '—' : `${f2(n * 100)} %`;
const keur = n => (n == null || isNaN(n)) ? '—' : `${f0(n / 1000)}k€`;

// ─── Annuité constante ────────────────────────────────────────────────────────
function annuiteConst(montant, taux, duree) {
  if (!montant || !taux || !duree) return 0;
  return montant * (taux * Math.pow(1 + taux, duree)) / (Math.pow(1 + taux, duree) - 1);
}

// ─── Tableau d'amortissement complet ─────────────────────────────────────────
function tableauAmortissement(montant, taux, duree) {
  const ann = annuiteConst(montant, taux, duree);
  const rows = [];
  let k = montant;
  for (let i = 0; i < duree; i++) {
    const int = k * taux;
    const cap = ann - int;
    k = Math.max(0, k - cap);
    rows.push({ kDebut: rows.length === 0 ? montant : rows[rows.length - 1].kFin + cap - cap + (rows[rows.length-1].kFin), int, cap, ann, kFin: k });
  }
  // recalc propre
  let kk = montant;
  const result = [];
  for (let i = 0; i < duree; i++) {
    const kD = kk;
    const int = kk * taux;
    const cap = ann - int;
    kk = Math.max(0, kk - cap);
    result.push({ kDebut: kD, ann, int, cap, kFin: kk });
  }
  return result;
}

// ─── Capital restant dû après n périodes ─────────────────────────────────────
// (= K fin de la période n-1, 0-indexed)
function capitalRestantApres(montant, taux, duree, n) {
  // n = nombre de périodes écoulées depuis le démarrage du prêt
  if (n <= 0) return montant;
  if (n >= duree) return 0;
  const rows = tableauAmortissement(montant, taux, duree);
  return rows[n - 1].kFin;
}

// ─── Newton-Raphson TRI ───────────────────────────────────────────────────────
function calcTRI(flux) {
  let r = 0.1;
  for (let iter = 0; iter < 2000; iter++) {
    let van = 0, dvan = 0;
    flux.forEach((f, t) => {
      const disc = Math.pow(1 + r, t);
      van  += f / disc;
      dvan -= t * f / (disc * (1 + r));
    });
    if (Math.abs(dvan) < 1e-15) break;
    const nr = r - van / dvan;
    if (Math.abs(nr - r) < 1e-10) { r = nr; break; }
    r = nr;
  }
  return isFinite(r) && r > -1 ? r : NaN;
}

// ═════════════════════════════════════════════════════════════════════════════
// PARAMÈTRES PAR DÉFAUT
// ═════════════════════════════════════════════════════════════════════════════
const DEFAULT_PARAMS = {
  // Général
  valeurParcAn1: 1250000,
  tauxRevalo: 1.5,        // % revalorisation annuelle du parc (convention)
  tauxLocatif: 10.0,      // % rendement locatif brut
  tauxCharges: 10.0,      // % charges non récupérables
  tauxRemuDir: 15.0,      // % rémunération direction (sauf An1=0)
  tauxIS: 15.0,
  primeSynergie: 5.0,     // % prime de synergie (× 1.05 sur la DCF)

  // CMPC selon l'annexe méthodologique :
  // i = (6.5% × 20%) + (coût_dette × 80%)
  // LTC cible : 80% dette / 20% fonds propres
  ltcDette: 80,           // % part dette dans le financement
  ltcFondsPropres: 20,    // % part fonds propres
  coutFondsPropres: 6.5,  // % rendement attendu investisseurs (hurdle)
  // coût de la dette = taux moyen des prêts (calculé dynamiquement)

  // Investisseur
  investissement: 275000,
  nbActions: 200000,
  hurdle: 6.5,
  carriedPct: 20.0,

  // Répartition (fixe)
  detentionA: 0.5340703962269258,
  detentionBC: 0.4659296037730742,

  // 5 prêts exacts de l'Excel
  prets: [
    { id: 1, label: 'Prêt 1 (initial)',  montant: 1025000,           taux: 3.3, duree: 15, anneeDebut: 1 },
    { id: 2, label: 'Prêt 2 (An 6)',     montant: 206884.39609947032, taux: 3.3, duree: 15, anneeDebut: 6 },
    { id: 3, label: 'Prêt 3 (An 8)',     montant: 157031.13352050213, taux: 3.3, duree: 15, anneeDebut: 8 },
    { id: 4, label: 'Prêt 4 (An 10)',    montant: 107208.58150780172, taux: 3.3, duree: 15, anneeDebut: 10 },
    { id: 5, label: 'Prêt 5 (An 11)',    montant: 82392.81625715252,  taux: 3.3, duree: 15, anneeDebut: 11 },
  ],

  acquisitions: [
    { id: 1, label: 'Acquisition An 6',  annee: 6,  valeur: 278506.10 },
    { id: 2, label: 'Acquisition An 8',  annee: 8,  valeur: 220728.23 },
    { id: 3, label: 'Acquisition An 10', annee: 10, valeur: 162176.97 },
    { id: 4, label: 'Acquisition An 11', annee: 11, valeur: 133590.16 },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// MOTEUR DE CALCUL DCF — Annexe Méthodologie d'Évaluation de la Société
//
// Formule DCF (§2) :
//   Valeur_Société = (Tréso + F1/(1+i)^1 + ... + F5/(1+i)^5 + VT/(1+i)^5) × 1.05
//
//   i (CMPC §2) = (coutFondsPropres × ltcFondsPropres/100) + (coutDette × ltcDette/100)
//   VT = valeur du parc immobilier à l'année de valorisation (dettes supposées soldées)
//   Prime de synergie (§4) = 5% → coefficient × 1.05
//   Horizon glissant de projection = 5 ans (§5)
//   Croissance annuelle actifs & loyers = 1.5%/an (§5)
// ═════════════════════════════════════════════════════════════════════════════
function calculerBP(p) {
  const N = 11;

  // ── Taux moyen pondéré des prêts (coût de la dette) ──────────────────────
  const totalPretsMontant = p.prets.reduce((s, pr) => s + pr.montant, 0);
  const coutDette = totalPretsMontant > 0
    ? p.prets.reduce((s, pr) => s + (pr.taux / 100) * pr.montant, 0) / totalPretsMontant
    : 0.033;

  // ── CMPC selon annexe : i = (coutFP × ltcFP%) + (coutDette × ltcDette%) ─
  const cmpc = (p.coutFondsPropres / 100) * (p.ltcFondsPropres / 100)
             + coutDette * (p.ltcDette / 100);

  const primeSynergie = 1 + (p.primeSynergie / 100); // 1.05

  // ── Parc Brut par année ───────────────────────────────────────────────────
  const parcBrut = [];
  for (let i = 0; i < N; i++) {
    if (i === 0) {
      parcBrut.push(p.valeurParcAn1);
    } else {
      let val = parcBrut[i - 1] * (1 + p.tauxRevalo / 100);
      p.acquisitions.forEach(a => { if (a.annee === i + 1) val += a.valeur; });
      parcBrut.push(val);
    }
  }

  // ── Service de dette et capital restant ───────────────────────────────────
  const serviceDette = Array(N).fill(0);
  const capitalRestant = Array(N).fill(0);
  const amortissement = Array(N).fill(0);

  p.prets.forEach(pret => {
    const taux = pret.taux / 100;
    const rows = tableauAmortissement(pret.montant, taux, pret.duree);
    for (let i = 0; i < N; i++) {
      const periodeLocal = (i + 1) - pret.anneeDebut;
      if (periodeLocal >= 0 && periodeLocal < pret.duree) {
        serviceDette[i]   += rows[periodeLocal].ann;
        capitalRestant[i] += rows[periodeLocal].kFin;
        amortissement[i]  += rows[periodeLocal].cap; // capital remboursé = amortissement
      } else if (periodeLocal < 0) {
        capitalRestant[i] += pret.montant;
      }
    }
  });

  // ── Revenus & Charges ────────────────────────────────────────────────────
  const loyers   = parcBrut.map(pb => pb * (p.tauxLocatif / 100));
  const charges  = loyers.map(l => l * (p.tauxCharges / 100));
  const remuDir  = loyers.map((l, i) => i === 0 ? 0 : loyers[i - 1] * (p.tauxRemuDir / 100));

  // ── Résultat comptable & IS ──────────────────────────────────────────────
  const resultatAvIS = loyers.map((l, i) =>
    l - charges[i] - remuDir[i] - serviceDette[i] + amortissement[i]
  );
  const IS = resultatAvIS.map(r => Math.max(0, r * (p.tauxIS / 100)));

  // ── Trésorerie (cash) annuelle = loyers - charges - remuDir - service dette - IS
  const tresoAnn = loyers.map((l, i) =>
    l - charges[i] - remuDir[i] - serviceDette[i] - IS[i]
  );
  const tresCum = [];
  let cumul = 0;
  for (let i = 0; i < N; i++) { cumul += tresoAnn[i]; tresCum.push(cumul); }

  // ── Valeur Nette comptable = ParcBrut - CapitalRestant ───────────────────
  const valeurNette = parcBrut.map((pb, i) => pb - capitalRestant[i]);

  // ── DCF selon annexe §2 ───────────────────────────────────────────────────
  // Pour chaque année n (position de valorisation), on projette 5 ans en avant :
  //   - Flux Fk = tresoAnn[n + k] (k=1..5) avec croissance 1.5%/an déjà incluse
  //   - VT = valeur du parc à l'an n+5 (dettes supposées soldées)
  //   - Trésorerie = tresCum[n] (solde cumulé au moment de la valorisation)
  // Valeur_Société[n] = (Tréso + Σ Fk/(1+i)^k + VT/(1+i)^5) × 1.05
  //
  // Pour les années sans 5 ans de projection disponibles (n > N-5),
  // on projette les flux restants et complète par extrapolation (croissance 1.5%).

  const valeurSociete = [];
  for (let n = 0; n < N; n++) {
    const treso = tresCum[n];

    // Flux futurs sur 5 ans (à partir de l'année suivante)
    let dcfFlux = 0;
    for (let k = 1; k <= 5; k++) {
      let flux;
      if (n + k < N) {
        flux = tresoAnn[n + k]; // flux réel disponible
      } else {
        // Extrapolation : dernier flux disponible × (1+revalo)^(écart)
        const dernierIdx = N - 1;
        const ecart = (n + k) - dernierIdx;
        flux = tresoAnn[dernierIdx] * Math.pow(1 + p.tauxRevalo / 100, ecart);
      }
      dcfFlux += flux / Math.pow(1 + cmpc, k);
    }

    // Valeur Terminale (§2) : valeur du parc à l'horizon n+5 (dettes soldées = parc brut)
    let parcHorizon;
    if (n + 5 < N) {
      parcHorizon = parcBrut[n + 5];
    } else {
      const ecart = (n + 5) - (N - 1);
      parcHorizon = parcBrut[N - 1] * Math.pow(1 + p.tauxRevalo / 100, ecart);
    }
    const vtActualisee = parcHorizon / Math.pow(1 + cmpc, 5);

    const dcfBrut = treso + dcfFlux + vtActualisee;
    valeurSociete.push(dcfBrut * primeSynergie);
  }

  // ── Valeur action ─────────────────────────────────────────────────────────
  const valeurAction = valeurSociete.map(vs => p.nbActions > 0 ? vs / p.nbActions : 0);

  // ── Ratios ────────────────────────────────────────────────────────────────
  const ltc     = parcBrut.map((pb, i) => pb > 0 ? capitalRestant[i] / pb : 0);
  const dscrBrut = loyers.map((l, i) => serviceDette[i] > 0 ? l / serviceDette[i] : null);
  const dscrNet  = loyers.map((l, i) => serviceDette[i] > 0 ? (l - charges[i]) / serviceDette[i] : null);
  const plusValuePot = parcBrut.map((pb, i) => i >= 4 ? pb - p.valeurParcAn1 : null);

  // ── Investisseur ──────────────────────────────────────────────────────────
  // Détention B/C = investissement / valeurSociete[0]
  const valeurInvest = valeurSociete.map(vs => vs * p.detentionBC);
  const hurdle = p.investissement * (p.hurdle / 100);

  const carriedInterest = valeurInvest.map((vi, i) => {
    if (i < 4) return null;
    const hurdleCumule = p.investissement * Math.pow(1 + p.hurdle / 100, i + 1) - p.investissement;
    const surplus = vi - p.investissement - hurdleCumule;
    return surplus > 0 ? surplus * (p.carriedPct / 100) : 0;
  });

  const retourNet = valeurInvest.map((vi, i) => {
    if (i < 4) return null;
    return vi - (carriedInterest[i] || 0);
  });

  // ── TRI ───────────────────────────────────────────────────────────────────
  const triNet = Array(N).fill(null);
  for (let sortie = 4; sortie < N; sortie++) {
    const flux = [-p.investissement];
    for (let j = 0; j < sortie; j++) flux.push(tresoAnn[j] * p.detentionBC);
    flux.push(retourNet[sortie] || 0);
    triNet[sortie] = calcTRI(flux);
  }

  return Array.from({ length: N }, (_, i) => ({
    annee: i + 1,
    parcBrut: parcBrut[i],
    capitalRestant: capitalRestant[i],
    valeurNette: valeurNette[i],
    loyers: loyers[i],
    charges: charges[i],
    remuDir: remuDir[i],
    serviceDette: serviceDette[i],
    amortissement: amortissement[i],
    resultatAvIS: resultatAvIS[i],
    IS: IS[i],
    tresoAnn: tresoAnn[i],
    tresCum: tresCum[i],
    valeurSociete: valeurSociete[i],
    valeurAction: valeurAction[i],
    ltc: ltc[i],
    dscrBrut: dscrBrut[i],
    dscrNet: dscrNet[i],
    plusValuePot: plusValuePot[i],
    valeurInvest: valeurInvest[i],
    hurdle,
    carriedInterest: carriedInterest[i],
    retourNet: retourNet[i],
    triNet: triNet[i],
    cmpc,
    coutDette,
    primeSynergie: primeSynergie - 1,
  }));
}

// ─── CustomTooltip ────────────────────────────────────────────────────────────
const CTooltip = ({ active, payload, label, fmt }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0F2537] text-white rounded-xl p-3 shadow-2xl text-xs min-w-[160px]">
      <p className="font-bold text-[#C9A961] mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex justify-between gap-4 mb-0.5">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-semibold">{fmt ? fmt(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── BPTable ──────────────────────────────────────────────────────────────────
function BPTable({ rows }) {
  const N = 11;
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-[#1A3A52] text-white">
            <th className="px-3 py-2.5 text-left min-w-[240px] sticky left-0 bg-[#1A3A52]">Indicateur</th>
            {Array.from({ length: N }, (_, i) => <th key={i} className="px-3 py-2.5 text-right whitespace-nowrap">An {i+1}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, ri) => (
            <tr key={ri} className={
              row.section ? 'bg-[#1A3A52]/8' :
              row.hl === 'gold' ? 'bg-[#C9A961]/10 font-semibold' :
              row.hl === 'green' ? 'bg-emerald-50 font-semibold' :
              row.hl === 'red' ? 'bg-red-50/60' :
              ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
            }>
              <td className={`px-3 py-2 sticky left-0 bg-inherit text-xs ${row.section ? 'font-bold text-[#1A3A52] uppercase tracking-wider' : row.hl === 'red' ? 'text-red-700' : row.hl === 'green' ? 'text-emerald-700' : 'text-slate-700'}`}>
                {row.section ? `▸ ${row.label}` : row.label}
              </td>
              {Array.from({ length: N }, (_, i) => (
                <td key={i} className={`px-3 py-2 text-right font-mono text-xs ${row.section ? '' : row.hl === 'red' ? 'text-red-700' : row.hl === 'green' ? 'text-emerald-700' : 'text-slate-800'}`}>
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
function InputParam({ label, value, onChange, suffix, step = "0.01" }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 hover:border-[#C9A961] transition-colors">
      <label className="text-xs text-slate-500 block mb-1">{label}</label>
      <div className="flex items-center gap-1">
        <input type="number" value={value} step={step}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="flex-1 text-sm font-bold text-[#1A3A52] border-0 focus:outline-none bg-transparent w-0 min-w-0" />
        {suffix && <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{suffix}</span>}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ═════════════════════════════════════════════════════════════════════════════
export default function AdminBusinessPlan() {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [detteOuverte, setDetteOuverte] = useState(null);

  const set = (k, v) => setParams(prev => ({ ...prev, [k]: v }));

  // Prêts
  const addPret = () => set('prets', [...params.prets, {
    id: Date.now(), label: `Prêt ${params.prets.length + 1}`,
    montant: 100000, taux: 3.3, duree: 15, anneeDebut: 5
  }]);
  const removePret = id => set('prets', params.prets.filter(p => p.id !== id));
  const updatePret = (id, k, v) => set('prets', params.prets.map(p => p.id === id ? { ...p, [k]: v } : p));

  // Acquisitions
  const addAcq = () => set('acquisitions', [...params.acquisitions, {
    id: Date.now(), label: 'Nouvelle acquisition', annee: 5, valeur: 200000
  }]);
  const removeAcq = id => set('acquisitions', params.acquisitions.filter(a => a.id !== id));
  const updateAcq = (id, k, v) => set('acquisitions', params.acquisitions.map(a => a.id === id ? { ...a, [k]: v } : a));

  // Calcul BP
  const annees = useMemo(() => calculerBP(params), [params]);
  const N = annees.length;
  const labels = annees.map(a => `An ${a.annee}`);

  // KPIs résumés
  const triAn5  = annees[4]?.triNet;
  const triAn10 = annees[9]?.triNet;
  const derniere = annees[N - 1] || {};
  const totalCapitalEmprunte = params.prets.reduce((s, p) => s + p.montant, 0);
  // CMPC affiché (recalculé pour l'affichage)
  const totalMontant = params.prets.reduce((s,p) => s + p.montant, 0);
  const coutDetteAffiche = totalMontant > 0
    ? params.prets.reduce((s,p) => s + (p.taux/100)*p.montant, 0) / totalMontant
    : 0.033;
  const cmpcAffiche = (params.coutFondsPropres/100)*(params.ltcFondsPropres/100) + coutDetteAffiche*(params.ltcDette/100);

  // Données graphiques
  const chartPat = annees.map((a, i) => ({
    name: labels[i],
    'Parc Brut': Math.round(a.parcBrut),
    'Valeur Nette': Math.round(a.valeurNette),
    'Valeur Société': Math.round(a.valeurSociete),
    'Tréso Cumulée': Math.round(a.tresCum),
  }));
  const chartFlux = annees.map((a, i) => ({
    name: labels[i],
    'Revenus Locatifs': Math.round(a.loyers),
    'Service Dette': Math.round(a.serviceDette),
    'Tréso Annuelle': Math.round(a.tresoAnn),
  }));
  const chartTRI = annees.filter(a => a.triNet != null).map(a => ({
    name: `An ${a.annee}`,
    'TRI %': +(a.triNet * 100).toFixed(2),
  }));
  const chartRatios = annees.map((a, i) => ({
    name: labels[i],
    'LTC %': +(a.ltc * 100).toFixed(1),
    'DSCR Brut': a.dscrBrut != null ? +a.dscrBrut.toFixed(3) : null,
  }));
  const chartAction = annees.map((a, i) => ({
    name: labels[i],
    'Valeur Action €': +a.valeurAction.toFixed(4),
  }));

  const TABS = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'complet',   label: 'BP Complet' },
    { id: 'investisseur', label: 'Investisseur' },
    { id: 'dettes',    label: 'Dettes' },
    { id: 'parametres', label: '⚙️ Paramètres' },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#0F2537] to-[#1A3A52] px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-serif text-white mb-0.5">Business Plan — Foncière Valora</h1>
            <p className="text-white/40 text-xs">Simulation dynamique · {params.prets.length} prêts · {params.acquisitions.length} acquisitions · {N} années</p>
          </div>
          <button onClick={() => setParams(DEFAULT_PARAMS)}
            className="text-xs bg-white/10 hover:bg-white/20 text-white/70 px-3 py-1.5 rounded-full transition-colors">
            ↩ Reset Excel
          </button>
        </div>
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Parc An 1',          val: eur(annees[0]?.parcBrut),      sub: 'Valeur brute initiale' },
            { label: 'Parc An 11',         val: eur(derniere.parcBrut),         sub: `+${((derniere.parcBrut / (annees[0]?.parcBrut||1) - 1)*100).toFixed(0)}%` },
            { label: 'TRI Net An 5',        val: triAn5 ? `${(triAn5*100).toFixed(2)}%` : '—',  sub: 'Hurdle 6,5%', ok: triAn5 >= 0.065 },
            { label: 'TRI Net An 10',       val: triAn10 ? `${(triAn10*100).toFixed(2)}%` : '—', sub: 'Hurdle 6,5%', ok: triAn10 >= 0.065 },
            { label: 'Valeur Société An 11',val: eur(derniere.valeurSociete),    sub: `Action : ${derniere.valeurAction ? eur2(derniere.valeurAction) : '—'}` },
          ].map((k, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-3">
              <p className="text-white/40 text-xs mb-1">{k.label}</p>
              <p className={`text-lg font-bold ${k.ok === true ? 'text-emerald-400' : k.ok === false ? 'text-orange-400' : 'text-white'}`}>{k.val}</p>
              <p className="text-white/30 text-xs">{k.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white border-b border-slate-200 px-6 flex overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === t.id ? 'text-[#1A3A52] border-[#C9A961]' : 'text-slate-500 border-transparent hover:text-slate-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6">

        {/* ══════════════════ DASHBOARD ══════════════════ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5">

            {/* Patrimoine + TRI */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-[#1A3A52]">Croissance Patrimoniale</h3>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">+{((derniere.parcBrut / (annees[0]?.parcBrut||1) - 1)*100).toFixed(0)}% sur 11 ans</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">Parc brut, valeur nette et valeur société (€)</p>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={chartPat}>
                    <defs>
                      <linearGradient id="gPB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1A3A52" stopOpacity={0.15}/><stop offset="95%" stopColor="#1A3A52" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gVS" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A961" stopOpacity={0.25}/><stop offset="95%" stopColor="#C9A961" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gVN" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => keur(v)} axisLine={false} tickLine={false} />
                    <Tooltip content={<CTooltip fmt={eur} />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="Parc Brut" stroke="#1A3A52" strokeWidth={2} fill="url(#gPB)" />
                    <Area type="monotone" dataKey="Valeur Société" stroke="#C9A961" strokeWidth={2.5} fill="url(#gVS)" />
                    <Area type="monotone" dataKey="Valeur Nette" stroke="#10b981" strokeWidth={2} fill="url(#gVN)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-semibold text-[#1A3A52] mb-1">TRI Net par Sortie</h3>
                <p className="text-xs text-slate-400 mb-4">Hurdle investisseur : 6,5 %/an</p>
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={chartTRI} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} domain={[0, 14]} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={50} />
                    <Tooltip content={<CTooltip fmt={v => `${v.toFixed(2)}%`} />} />
                    <ReferenceLine x={6.5} stroke="#ef4444" strokeDasharray="4 4" />
                    <Bar dataKey="TRI %" radius={[0,6,6,0]} fill="#C9A961"
                      label={{ position:'right', fontSize:10, fill:'#1A3A52', formatter: v => `${v}%` }} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-2 flex items-center gap-2 pt-2 border-t border-slate-100">
                  <div className="w-3 h-0.5 bg-red-400"></div><span className="text-xs text-slate-500">Hurdle minimum : 6,5 %</span>
                </div>
              </div>
            </div>

            {/* Revenus & Tréso */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-semibold text-[#1A3A52] mb-1">Revenus Locatifs vs Service de la Dette</h3>
                <p className="text-xs text-slate-400 mb-4">Capacité de remboursement annuelle (€)</p>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartFlux}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => keur(v)} axisLine={false} tickLine={false} />
                    <Tooltip content={<CTooltip fmt={eur} />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Revenus Locatifs" fill="#1A3A52" radius={[4,4,0,0]} />
                    <Bar dataKey="Service Dette" fill="#C9A961" radius={[4,4,0,0]} />
                    <Bar dataKey="Tréso Annuelle" fill="#10b981" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-semibold text-[#1A3A52] mb-1">Trésorerie Cumulée Société</h3>
                <p className="text-xs text-slate-400 mb-4">Accumulation nette après IS et service de la dette (€)</p>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={chartPat}>
                    <defs>
                      <linearGradient id="gTC" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => keur(v)} axisLine={false} tickLine={false} />
                    <Tooltip content={<CTooltip fmt={eur} />} />
                    <Area type="monotone" dataKey="Tréso Cumulée" stroke="#6366f1" strokeWidth={2.5} fill="url(#gTC)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ratios + Action + Pie */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-semibold text-[#1A3A52] mb-1">DSCR & LTC</h3>
                <p className="text-xs text-slate-400 mb-4">Ratios de couverture et d'endettement</p>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartRatios}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <ReferenceLine y={1.2} stroke="#ef4444" strokeDasharray="3 3" />
                    <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="DSCR Brut" stroke="#C9A961" strokeWidth={2.5} dot={{ fill:'#C9A961', r:3 }} />
                    <Line type="monotone" dataKey="LTC %" stroke="#1A3A52" strokeWidth={2.5} dot={{ fill:'#1A3A52', r:3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-semibold text-[#1A3A52] mb-2">Valeur de l'Action</h3>
                <div className="flex gap-3 mb-3">
                  <div className="bg-slate-50 rounded-lg p-2 flex-1 text-center">
                    <p className="text-xs text-slate-400">An 1</p>
                    <p className="font-bold text-[#C9A961]">{eur2(annees[0]?.valeurAction)}</p>
                  </div>
                  <div className="bg-[#1A3A52] rounded-lg p-2 flex-1 text-center">
                    <p className="text-xs text-white/40">An 11</p>
                    <p className="font-bold text-white">{eur2(derniere.valeurAction)}</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={chartAction}>
                    <defs>
                      <linearGradient id="gAct" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A961" stopOpacity={0.4}/><stop offset="95%" stopColor="#C9A961" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickFormatter={v => `${v}€`} axisLine={false} tickLine={false} />
                    <Tooltip content={<CTooltip fmt={v => `${v.toFixed(4)} €`} />} />
                    <Area type="monotone" dataKey="Valeur Action €" stroke="#C9A961" strokeWidth={2.5} fill="url(#gAct)" dot={{ fill:'#C9A961', r:3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col">
                <h3 className="font-semibold text-[#1A3A52] mb-1">Structure de Financement</h3>
                <p className="text-xs text-slate-400 mb-3">Fonds propres / dettes</p>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={[
                        { name: 'Fonds Propres', value: params.investissement },
                        { name: 'Dettes', value: totalCapitalEmprunte },
                      ]} cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value">
                        <Cell fill="#1A3A52" /><Cell fill="#C9A961" />
                      </Pie>
                      <Tooltip content={<CTooltip fmt={eur} />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 w-full text-xs">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#1A3A52]"></div><span className="text-slate-600">Fonds propres<br /><strong>{eur(params.investissement)}</strong></span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#C9A961]"></div><span className="text-slate-600">Dettes<br /><strong>{eur(totalCapitalEmprunte)}</strong></span></div>
                  </div>
                </div>
                <div className="mt-3 bg-slate-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-slate-500">LTC An 1</p>
                  <p className="font-bold text-[#1A3A52] text-lg">{annees[0]?.ltc != null ? `${(annees[0].ltc*100).toFixed(1)}%` : '—'}</p>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="bg-gradient-to-r from-[#0F2537] to-[#1A4A6A] rounded-2xl p-5 grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              {[
                { label: 'CMPC (calculé)', val: `${(cmpcAffiche*100).toFixed(3)} %`, sub: `${params.coutFondsPropres}%×${params.ltcFondsPropres}% + ${(coutDetteAffiche*100).toFixed(2)}%×${params.ltcDette}%` },
                { label: 'Coût dette moyen', val: `${(coutDetteAffiche*100).toFixed(2)} %`, sub: 'Taux pondéré des prêts' },
                { label: 'Prime synergie', val: `×${(1 + params.primeSynergie/100).toFixed(2)}`, sub: `+${params.primeSynergie}% DCF` },
                { label: 'Rendement locatif', val: `${params.tauxLocatif} %`, sub: 'Du parc brut' },
                { label: 'Nb actions', val: f0(params.nbActions), sub: 'Actions émises' },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-white/40 text-xs mb-1">{s.label}</p>
                  <p className="text-white font-bold text-lg">{s.val}</p>
                  {s.sub && <p className="text-white/25 text-xs mt-0.5">{s.sub}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════ BP COMPLET ══════════════════ */}
        {activeTab === 'complet' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <BPTable rows={[
              { label: 'I. EXPLOITATION DU PARC', section: true },
              { label: 'Valeur Parc Brut (€)',           data: annees.map(a => a.parcBrut),        fmt: eur, hl: 'gold' },
              { label: 'Capital Restant Dettes (€)',      data: annees.map(a => a.capitalRestant),  fmt: eur },
              { label: 'Valeur Nette Parc (€)',           data: annees.map(a => a.valeurNette),     fmt: eur },
              { label: 'Revenus Locatifs brut (10%)',     data: annees.map(a => a.loyers),          fmt: eur, hl: 'green' },
              { label: 'Charges non récupérables (10%)', data: annees.map(a => a.charges),         fmt: eur, hl: 'red' },
              { label: 'Rémunération direction',          data: annees.map(a => a.remuDir),         fmt: eur, hl: 'red' },
              { label: 'II. FLUX & DÉSENDETTEMENT', section: true },
              { label: 'Service de la Dette',             data: annees.map(a => a.serviceDette),    fmt: eur, hl: 'red' },
              { label: 'Amortissement comptable',        data: annees.map(a => a.amortissement),   fmt: eur },
              { label: 'Résultat comptable avant IS',    data: annees.map(a => a.resultatAvIS),    fmt: eur, hl: 'gold' },
              { label: `IS (${params.tauxIS}%)`,         data: annees.map(a => a.IS),              fmt: eur, hl: 'red' },
              { label: 'Trésorerie Annuelle',             data: annees.map(a => a.tresoAnn),        fmt: eur, hl: 'green' },
              { label: 'Trésorerie Cumulée',              data: annees.map(a => a.tresCum),         fmt: eur },
              { label: 'Plus-value Potentielle',          data: annees.map(a => a.plusValuePot),    fmt: v => v == null ? '—' : eur(v) },
              { label: 'III. VALORISATION', section: true },
              { label: 'Valeur de la Société (DCF)',      data: annees.map(a => a.valeurSociete),   fmt: eur, hl: 'gold' },
              { label: "Valeur de l'Action (€)",          data: annees.map(a => a.valeurAction),    fmt: eur2 },
              { label: 'IV. RÉPARTITION CAPITAL', section: true },
              { label: `% Détention Cat. A (${(params.detentionA*100).toFixed(2)}%)`, data: Array(N).fill(params.detentionA), fmt: pct2 },
              { label: `% Détention Cat. B/C (${(params.detentionBC*100).toFixed(2)}%)`, data: Array(N).fill(params.detentionBC), fmt: pct2 },
              { label: 'V. RATIOS', section: true },
              { label: 'DSCR sur loyer BRUT',             data: annees.map(a => a.dscrBrut),       fmt: v => v == null ? '—' : f4(v) },
              { label: 'DSCR sur loyer NET',              data: annees.map(a => a.dscrNet),         fmt: v => v == null ? '—' : f4(v) },
              { label: 'LTC (Capital Restant / Parc)',    data: annees.map(a => a.ltc),             fmt: pct2, hl: 'gold' },
              { label: 'VI. INVESTISSEUR', section: true },
              { label: 'Valeur créée pour investisseurs', data: annees.map(a => a.valeurInvest),    fmt: eur },
              { label: `Hurdle annuel (${params.hurdle}%)`, data: annees.map(a => a.hurdle),        fmt: eur },
              { label: 'Carried Interest',                 data: annees.map(a => a.carriedInterest),fmt: v => v == null ? '—' : eur(v) },
              { label: 'Retour NET',                       data: annees.map(a => a.retourNet),      fmt: v => v == null ? '—' : eur(v), hl: 'green' },
              { label: 'TRI NET',                          data: annees.map(a => a.triNet),         fmt: v => v == null ? '—' : pct2(v), hl: 'gold' },
            ]} />
          </div>
        )}

        {/* ══════════════════ INVESTISSEUR ══════════════════ */}
        {activeTab === 'investisseur' && (
          <div className="space-y-4">
            <div className="bg-[#0F2537] rounded-2xl p-4 text-white flex flex-wrap gap-6 text-sm">
              <div><span className="text-white/40 text-xs block">Investissement</span><strong className="text-[#C9A961] text-lg">{eur(params.investissement)}</strong></div>
              <div><span className="text-white/40 text-xs block">Hurdle</span><strong className="text-lg">{params.hurdle} %/an</strong></div>
              <div><span className="text-white/40 text-xs block">Carried</span><strong className="text-lg">{params.carriedPct} %</strong></div>
              <div><span className="text-white/40 text-xs block">Détention B/C</span><strong className="text-lg">{(params.detentionBC*100).toFixed(2)} %</strong></div>
              <div><span className="text-white/40 text-xs block">Nb actions</span><strong className="text-lg">{f0(params.nbActions)}</strong></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {annees.filter(a => a.triNet != null).map(a => (
                <div key={a.annee} className={`rounded-2xl border p-5 ${a.triNet >= 0.065 ? 'border-emerald-200 bg-emerald-50' : 'border-orange-200 bg-orange-50'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-slate-800 text-base">Sortie Année {a.annee}</p>
                      <p className="text-sm text-slate-500">Valeur investisseur : <strong>{eur(a.valeurInvest)}</strong></p>
                      {a.carriedInterest != null && <p className="text-xs text-slate-400">Carried : {eur(a.carriedInterest)}</p>}
                      <p className="text-sm font-semibold text-slate-700">Retour NET : {eur(a.retourNet)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-4xl font-bold ${a.triNet >= 0.065 ? 'text-emerald-600' : 'text-orange-600'}`}>{(a.triNet*100).toFixed(2)}%</p>
                      <p className="text-xs text-slate-400">TRI Net</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2.5 bg-white rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${a.triNet >= 0.065 ? 'bg-emerald-500' : 'bg-orange-400'}`} style={{ width:`${Math.min(100,(a.triNet/0.15)*100)}%` }} />
                    </div>
                    <span className={`text-xs font-semibold flex items-center gap-1 ${a.triNet >= 0.065 ? 'text-emerald-600' : 'text-orange-600'}`}>
                      {a.triNet >= 0.065 ? <><CheckCircle2 className="h-3.5 w-3.5"/>OK</> : <><AlertCircle className="h-3.5 w-3.5"/>Sous hurdle</>}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Tableau flux TRI */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Flux TRI par scénario de sortie</h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs">
                  <thead><tr className="bg-[#1A3A52] text-white">
                    <th className="px-3 py-2.5 text-left min-w-[140px]">Scénario</th>
                    <th className="px-3 py-2.5 text-right">An 0</th>
                    {Array.from({length:N},(_,i)=><th key={i} className="px-3 py-2.5 text-right">An {i+1}</th>)}
                    <th className="px-3 py-2.5 text-right bg-[#C9A961] text-[#1A3A52]">TRI</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {annees.filter(a => a.triNet != null).map((a, ri) => {
                      const fluxAffiches = [-params.investissement,
                        ...annees.slice(0, a.annee - 1).map(x => +(x.tresoAnn * params.detentionBC).toFixed(2)),
                        a.retourNet
                      ];
                      return (
                        <tr key={a.annee} className={ri%2===0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="px-3 py-2 font-medium text-slate-700">Sortie An {a.annee}</td>
                          {fluxAffiches.map((v, j) => (
                            <td key={j} className={`px-3 py-2 text-right font-mono ${v < 0 ? 'text-red-700' : j === fluxAffiches.length-1 ? 'text-emerald-700 font-bold' : 'text-slate-700'}`}>{eur(v)}</td>
                          ))}
                          {Array.from({length: N + 1 - fluxAffiches.length}, (_, k) => <td key={`e${k}`} className="px-3 py-2 text-right text-slate-300">—</td>)}
                          <td className="px-3 py-2 text-right font-bold text-emerald-700 bg-emerald-50">{pct2(a.triNet)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════ DETTES ══════════════════ */}
        {activeTab === 'dettes' && (
          <div className="space-y-4">
            {/* Tableau récap service */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Service de la Dette par Prêt (€/an)</h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs">
                  <thead><tr className="bg-[#1A3A52] text-white">
                    <th className="px-3 py-2.5 text-left min-w-[140px]">Prêt</th>
                    <th className="px-3 py-2.5 text-right">Montant</th>
                    <th className="px-3 py-2.5 text-right">Annuité</th>
                    <th className="px-3 py-2.5 text-right">Début</th>
                    {Array.from({length:N},(_,i)=><th key={i} className="px-3 py-2.5 text-right">An {i+1}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {params.prets.map((p, pi) => {
                      const ann = annuiteConst(p.montant, p.taux/100, p.duree);
                      return (
                        <tr key={p.id} className={pi%2===0?'bg-white':'bg-slate-50'}>
                          <td className="px-3 py-2 font-medium text-slate-700">{p.label}</td>
                          <td className="px-3 py-2 text-right font-mono">{eur(p.montant)}</td>
                          <td className="px-3 py-2 text-right font-mono font-semibold text-[#1A3A52]">{eur(ann)}</td>
                          <td className="px-3 py-2 text-right">An {p.anneeDebut}</td>
                          {Array.from({length:N},(_,i)=>{
                            const off=(i+1)-p.anneeDebut;
                            const actif=off>=0&&off<p.duree;
                            return <td key={i} className={`px-3 py-2 text-right font-mono ${actif?'text-red-700':'text-slate-300'}`}>{actif?eur(ann):'—'}</td>;
                          })}
                        </tr>
                      );
                    })}
                    <tr className="bg-[#C9A961]/10 font-bold">
                      <td className="px-3 py-2">TOTAL</td>
                      <td className="px-3 py-2 text-right font-mono">{eur(totalCapitalEmprunte)}</td>
                      <td></td><td></td>
                      {annees.map(a=><td key={a.annee} className="px-3 py-2 text-right font-mono text-[#1A3A52]">{eur(a.serviceDette)}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Accordéon amortissement */}
            <div className="space-y-2">
              {params.prets.map(p => {
                const isOpen = detteOuverte === p.id;
                const taux = p.taux/100;
                const rows = tableauAmortissement(p.montant, taux, p.duree);
                const ann = annuiteConst(p.montant, taux, p.duree);
                const totalInt = rows.reduce((s,r)=>s+r.int,0);
                return (
                  <div key={p.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <button onClick={() => setDetteOuverte(isOpen ? null : p.id)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="font-bold text-[#1A3A52]">{p.label}</span>
                        <span className="text-slate-500">Montant : <strong>{eur(p.montant)}</strong></span>
                        <span className="text-slate-500">Annuité : <strong className="text-[#1A3A52]">{eur(ann)}/an</strong></span>
                        <span className="text-slate-500">Taux : <strong>{p.taux}%</strong> · Durée : <strong>{p.duree} ans</strong></span>
                        <span className="text-slate-400">Total intérêts : <strong className="text-red-600">{eur(totalInt)}</strong></span>
                      </div>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0"/> : <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0"/>}
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
                              <tr key={ri} className={ri%2===0?'bg-white':'bg-slate-50'}>
                                <td className="px-3 py-1.5 font-medium">{2026 + p.anneeDebut + ri}</td>
                                <td className="px-3 py-1.5 text-right font-mono">{eur(r.kDebut)}</td>
                                <td className="px-3 py-1.5 text-right font-mono font-semibold text-[#1A3A52]">{eur(r.ann)}</td>
                                <td className="px-3 py-1.5 text-right font-mono text-red-700">{eur(r.int)}</td>
                                <td className="px-3 py-1.5 text-right font-mono text-emerald-700">{eur(r.cap)}</td>
                                <td className="px-3 py-1.5 text-right font-mono">{eur(r.kFin)}</td>
                              </tr>
                            ))}
                            <tr className="bg-[#C9A961]/10 font-bold">
                              <td className="px-3 py-1.5">TOTAL</td><td></td>
                              <td className="px-3 py-1.5 text-right font-mono">{eur(ann*p.duree)}</td>
                              <td className="px-3 py-1.5 text-right font-mono text-red-700">{eur(totalInt)}</td>
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

        {/* ══════════════════ PARAMÈTRES ══════════════════ */}
        {activeTab === 'parametres' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800 flex items-start gap-2">
              <span>ℹ️</span>
              <span>Toute modification recalcule instantanément l'ensemble du BP. Les valeurs par défaut reproduisent exactement les chiffres du fichier Excel.</span>
            </div>

            {/* Général */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2"><Building2 className="h-4 w-4 text-[#C9A961]"/> Paramètres Généraux du Parc</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <InputParam label="Valeur parc An1 (€)" value={params.valeurParcAn1} onChange={v => set('valeurParcAn1', v)} suffix="€" step="1000"/>
                <InputParam label="Croissance annuelle actifs (§5)" value={params.tauxRevalo} onChange={v => set('tauxRevalo', v)} suffix="%" />
                <InputParam label="Rendement locatif brut" value={params.tauxLocatif} onChange={v => set('tauxLocatif', v)} suffix="%"/>
                <InputParam label="Charges non récupérables" value={params.tauxCharges} onChange={v => set('tauxCharges', v)} suffix="%"/>
                <InputParam label="Rémunération direction" value={params.tauxRemuDir} onChange={v => set('tauxRemuDir', v)} suffix="%"/>
                <InputParam label="Taux IS" value={params.tauxIS} onChange={v => set('tauxIS', v)} suffix="%"/>
                <InputParam label="Prime synergie (§4)" value={params.primeSynergie} onChange={v => set('primeSynergie', v)} suffix="%"/>
              </div>
            </div>

            {/* CMPC selon annexe */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-[#1A3A52] mb-1 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-[#C9A961]"/> CMPC — Coût Moyen Pondéré du Capital (§2 Annexe)</h3>
              <p className="text-xs text-slate-500 mb-4">
                Formule : <strong>i = (Coût FP × Part FP%) + (Coût Dette × Part Dette%)</strong>
                &nbsp;→ CMPC calculé : <strong className="text-[#C9A961]">{(cmpcAffiche*100).toFixed(3)} %</strong>
                &nbsp;· Coût dette pondéré : <strong>{(coutDetteAffiche*100).toFixed(3)} %</strong>
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <InputParam label="Coût fonds propres (hurdle, §2)" value={params.coutFondsPropres} onChange={v => set('coutFondsPropres', v)} suffix="%"/>
                <InputParam label="Part fonds propres (LTC, §2)" value={params.ltcFondsPropres} onChange={v => { set('ltcFondsPropres', v); set('ltcDette', 100 - v); }} suffix="%"/>
                <InputParam label="Part dette bancaire (LTC, §2)" value={params.ltcDette} onChange={v => { set('ltcDette', v); set('ltcFondsPropres', 100 - v); }} suffix="%"/>
                <div className="bg-[#C9A961]/10 rounded-xl border border-[#C9A961]/30 p-3 flex flex-col justify-center">
                  <p className="text-xs text-slate-500 mb-1">CMPC résultant</p>
                  <p className="text-xl font-bold text-[#1A3A52]">{(cmpcAffiche*100).toFixed(3)} %</p>
                  <p className="text-xs text-slate-400 mt-0.5">Taux d'actualisation DCF</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-3 bg-slate-50 rounded-lg p-2">
                ℹ️ Le coût de la dette est calculé automatiquement comme le taux moyen pondéré des prêts renseignés ci-dessous (<strong>{(coutDetteAffiche*100).toFixed(3)}%</strong>). Toute modification des taux de prêts met à jour le CMPC en temps réel.
              </p>
            </div>

            {/* Investisseur */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-[#C9A961]"/> Investisseur</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <InputParam label="Investissement initial (€)" value={params.investissement} onChange={v => set('investissement', v)} suffix="€" step="1000"/>
                <InputParam label="Nb actions" value={params.nbActions} onChange={v => set('nbActions', Math.round(v))} step="1000"/>
                <InputParam label="Hurdle Rate" value={params.hurdle} onChange={v => set('hurdle', v)} suffix="%"/>
                <InputParam label="Carried Interest" value={params.carriedPct} onChange={v => set('carriedPct', v)} suffix="%"/>
                <InputParam label="Détention Cat. A (%)" value={+(params.detentionA*100).toFixed(4)} onChange={v => { set('detentionA', v/100); set('detentionBC', (100-v)/100); }} suffix="%"/>
                <InputParam label="Détention Cat. B/C (%)" value={+(params.detentionBC*100).toFixed(4)} onChange={v => { set('detentionBC', v/100); set('detentionA', (100-v)/100); }} suffix="%"/>
              </div>
            </div>

            {/* Acquisitions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1A3A52] flex items-center gap-2"><Building2 className="h-4 w-4 text-[#C9A961]"/> Acquisitions ({params.acquisitions.length})</h3>
                <Button size="sm" onClick={addAcq} className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white h-8 text-xs gap-1">
                  <Plus className="h-3.5 w-3.5"/> Ajouter
                </Button>
              </div>
              {params.acquisitions.length === 0 && <p className="text-slate-400 text-sm italic">Aucune acquisition.</p>}
              <div className="space-y-3">
                {params.acquisitions.map(a => (
                  <div key={a.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <input type="text" value={a.label} onChange={e => updateAcq(a.id, 'label', e.target.value)}
                        className="text-sm font-semibold text-[#1A3A52] bg-transparent border-b border-dashed border-slate-300 focus:outline-none"/>
                      <button onClick={() => removeAcq(a.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-200"><Trash2 className="h-3.5 w-3.5"/></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <InputParam label="Année" value={a.annee} onChange={v => updateAcq(a.id, 'annee', Math.round(Math.min(11,Math.max(1,v))))} step="1"/>
                      <InputParam label="Valeur ajoutée au parc (€)" value={a.valeur} onChange={v => updateAcq(a.id, 'valeur', v)} suffix="€" step="1000"/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prêts */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1A3A52] flex items-center gap-2"><Euro className="h-4 w-4 text-[#C9A961]"/> Prêts Bancaires ({params.prets.length})</h3>
                <Button size="sm" onClick={addPret} className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white h-8 text-xs gap-1">
                  <Plus className="h-3.5 w-3.5"/> Ajouter
                </Button>
              </div>
              <div className="space-y-3">
                {params.prets.map(p => {
                  const ann = annuiteConst(p.montant, p.taux/100, p.duree);
                  return (
                    <div key={p.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <input type="text" value={p.label} onChange={e => updatePret(p.id, 'label', e.target.value)}
                            className="text-sm font-semibold text-[#1A3A52] bg-transparent border-b border-dashed border-slate-300 focus:outline-none min-w-0 flex-1"/>
                          <span className="text-xs bg-[#C9A961]/20 text-amber-800 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">{eur(ann)}/an</span>
                        </div>
                        <button onClick={() => removePret(p.id)} className="ml-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-200"><Trash2 className="h-3.5 w-3.5"/></button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <InputParam label="Montant (€)" value={p.montant} onChange={v => updatePret(p.id, 'montant', v)} suffix="€" step="1000"/>
                        <InputParam label="Taux (%)" value={p.taux} onChange={v => updatePret(p.id, 'taux', v)} suffix="%"/>
                        <InputParam label="Durée (ans)" value={p.duree} onChange={v => updatePret(p.id, 'duree', Math.round(v))} step="1"/>
                        <InputParam label="Année début" value={p.anneeDebut} onChange={v => updatePret(p.id, 'anneeDebut', Math.round(Math.min(11,Math.max(1,v))))} step="1"/>
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