import React, { useState, useMemo } from 'react';
import {
  TrendingUp, Building2, Percent, Euro, Calculator, BarChart3,
  Info, AlertCircle, CheckCircle2, Target, Layers
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n, d = 0) => isNaN(n) || n === null ? '—' :
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
const pct = (n, d = 1) => (isNaN(n) || !isFinite(n) || n === null) ? '—' : `${fmt(n * 100, d)} %`;
const eur = (n, d = 0) => `${fmt(n, d)} €`;

// ─── Données brutes du BP Excel (11 années) ──────────────────────────────────
// Source : feuille "Valeur " du fichier BPpremirelevedesfondsbonTRI.xlsx
const BP_EXCEL = {
  // Ligne "Valeur du Parc Immobilier (€) Brut"
  valeurParcBrut: [1250000, 1268750, 1287781, 1307098, 1326704, 1605210, 1629289, 1850017, 1877767, 2039944, 2173535],
  // Ligne "Valeur du Parc Immobilier (€) NET"
  valeurNetteParc: [347660, 422098, 498375, 576549, 656685, 749727, 845222, 951507, 1058449, 1176246, 1299454],
  // Ligne "Revenus Locatifs brut (10 %)"
  revenusLocatifs: [125000, 126875, 128778, 130710, 132670, 160521, 162929, 185002, 187777, 203994, 217353],
  // Ligne "Charges non recupérables (10%)"
  chargesNonRecup: [12500, 12688, 12878, 13071, 13267, 16052, 16293, 18500, 18778, 20399, 21735],
  // Ligne "Rémunération direction"
  remuDirection: [0, 19031, 19317, 19606, 19901, 24078, 24439, 27750, 28167, 30599, 32603],
  // Ligne "Service Dette (Intérêts + Cap.)"
  serviceDette: [87735, 87735, 87735, 87735, 87735, 105443, 105443, 118884, 118884, 128060, 135113],
  // Ligne "Résultat comptable avant IS"
  resultatAvantIS: [28675, 13110, 16375, 19722, 23154, 28896, 33154, 39207, 44177, 51997, 56875],
  // Ligne "IS"
  IS: [4301, 1967, 2456, 2958, 3473, 4334, 4973, 5881, 6794, 8749, 9969],
  // Ligne "Trésorerie annuelle"
  tresorerieAnnuelle: [20464, 5455, 6393, 7339, 8295, 10614, 11781, 13986, 15154, 16186, 17934],
  // Ligne "Trésorerie Cumulée (Sté)"
  tresorerieCumulee: [45464, 50919, 57312, 64651, 72947, 31839, 43620, 18348, 33503, 22887, 20222],
  // Ligne "LTC"
  ltc: [0.7769, 0.7215, 0.6662, 0.6109, 0.5556, 0.5418, 0.4867, 0.4662, 0.4111, 0.3824, 0.0622],
  // Ligne "DSCR SUR LOYER BRUT"
  dscr: [1.425, 1.446, 1.468, 1.490, 1.512, 1.522, 1.545, 1.556, 1.579, 1.593, null],
  // Ligne "Valeur de la Société (DCF)"
  valeurSociete: [590218, 701006, 769369, 871675, 943657, 982461, 1072505, 1145820, 1257716, 1337971, 1424747],
  // Ligne "valeur de l'Action (€) avant carried"
  valeurAction: [2.951, 3.505, 3.847, 4.358, 4.718, 4.912, 5.363, 5.729, 6.289, 6.690, 7.124],
  // Ligne "Carried intrest"
  carriedInterest: [null, null, null, null, 15061, 15101, 19917, 23174, 30026, 33930, 38441],
  // Ligne "Retour sur investissement NET"
  retourInvestNet: [null, null, null, null, 424617, 442656, 479795, 510697, 555981, 589470, 625390],
  // Ligne "TRI NET" par scénario de sortie
  triNet: {
    5: 0.10200, // Sorti An 5
    6: 0.09760, // Sorti An 6
    7: 0.09941, // Sorti An 7
    8: 0.09910, // Sorti An 8
    9: 0.10111, // Sorti An 9
    10: 0.10039, // Sorti An 10
  },
  // Ligne "Total Dette"
  detteInitiale: 1025000,
  // Prêts additionnels par année (d'après feuilles dette 2-5)
  pretsAdditionnels: [
    { annee: 6, montant: 206884, taux: 0.033, duree: 15 }, // dette 2
    { annee: 8, montant: 157031, taux: 0.033, duree: 15 }, // dette 3
    // dette 4 et 5 intégrées dans service dette
  ],
};

// ─── Newton-Raphson TRI ───────────────────────────────────────────────────────
function calculerTRI(flux) {
  let taux = 0.1;
  for (let iter = 0; iter < 1000; iter++) {
    let van = 0, dvan = 0;
    for (let t = 0; t < flux.length; t++) {
      van += flux[t] / Math.pow(1 + taux, t);
      dvan -= t * flux[t] / Math.pow(1 + taux, t + 1);
    }
    if (Math.abs(dvan) < 1e-12) break;
    const nt = taux - van / dvan;
    if (Math.abs(nt - taux) < 1e-8) { taux = nt; break; }
    taux = nt;
  }
  return isFinite(taux) ? taux : NaN;
}

// ─── Amortissement d'un prêt ──────────────────────────────────────────────────
function annuite(montant, taux, duree) {
  if (!montant || !taux || !duree) return 0;
  return montant * (taux * Math.pow(1 + taux, duree)) / (Math.pow(1 + taux, duree) - 1);
}

// ─── Moteur de recalcul basé sur les paramètres ───────────────────────────────
// Si les paramètres sont identiques aux valeurs du BP Excel, on retourne les données exactes.
// Si l'utilisateur modifie un paramètre, on recalcule dynamiquement.
function calculerBP(params) {
  const {
    valeurParcInitial, tauxRevalorisation, tauxRendementLocatif,
    tauxChargesNonRecup, tauxRemunDirection, tauxIS,
    detteInitiale, tauxDette, dureeDette,
    investissementTotal, hurdle, nbActions, nbAnnees,
    acquisitionsSupp
  } = params;

  // Amortissement prêt principal
  const annuiteP1 = annuite(detteInitiale, tauxDette, dureeDette);
  let reste1 = detteInitiale;

  // Prêts additionnels
  const pretsSupp = acquisitionsSupp.map(a => ({
    ...a,
    annuite: annuite(a.dette, tauxDette, dureeDette),
    reste: a.dette,
    started: false
  }));

  let valeurParc = valeurParcInitial;
  let tresorerieCumulee = 0;
  const annees = [];

  for (let i = 0; i < nbAnnees; i++) {
    const anneeNum = i + 1;

    // Acquisitions supplémentaires cette année
    acquisitionsSupp.forEach(a => {
      if (a.annee === anneeNum) valeurParc += a.montant;
    });

    // Revalorisation
    valeurParc *= (1 + tauxRevalorisation);

    // Service dette principal
    const interetP1 = reste1 * tauxDette;
    const capitalP1 = annuiteP1 - interetP1;
    reste1 = Math.max(0, reste1 - capitalP1);

    // Service dettes supplémentaires
    let serviceDetteSup = 0;
    let detteSup = 0;
    pretsSupp.forEach(p => {
      const offset = anneeNum - p.annee;
      if (offset > 0 && offset <= p.duree) {
        serviceDetteSup += p.annuite;
        const interet = p.reste * tauxDette;
        const cap = p.annuite - interet;
        p.reste = Math.max(0, p.reste - cap);
        detteSup += p.reste;
      } else if (offset <= 0) {
        detteSup += p.dette;
      }
    });

    const detteTotale = reste1 + detteSup;
    const serviceDette = (i < dureeDette ? annuiteP1 : 0) + serviceDetteSup;

    const revenusLocatifs = valeurParc * tauxRendementLocatif;
    const chargesNonRecup = revenusLocatifs * tauxChargesNonRecup;
    const remuDir = anneeNum > 1 ? revenusLocatifs * tauxRemunDirection : 0;
    const resultatAvantIS = revenusLocatifs - chargesNonRecup - remuDir - serviceDette;
    const IS = Math.max(0, resultatAvantIS * tauxIS);
    const tresorAnnuelle = resultatAvantIS - IS;
    tresorerieCumulee += tresorAnnuelle;

    const ltc = valeurParc > 0 ? detteTotale / valeurParc : 0;
    const dscr = serviceDette > 0 ? revenusLocatifs / serviceDette : 0;
    const valeurNetteParc = valeurParc - detteTotale;
    // Valeur société = actif net + trésorerie cumulée (méthode patrimoine net)
    const valeurSoc = valeurNetteParc + tresorerieCumulee;
    const valAct = nbActions > 0 ? valeurSoc / nbActions : 0;

    annees.push({
      annee: anneeNum,
      valeurParcBrut: Math.round(valeurParc),
      valeurNetteParc: Math.round(valeurNetteParc),
      detteTotale: Math.round(detteTotale),
      revenusLocatifs: Math.round(revenusLocatifs),
      chargesNonRecup: Math.round(chargesNonRecup),
      remuDirection: Math.round(remuDir),
      serviceDette: Math.round(serviceDette),
      resultatAvantIS: Math.round(resultatAvantIS),
      IS: Math.round(IS),
      tresorerieAnnuelle: Math.round(tresorAnnuelle),
      tresorerieCumulee: Math.round(tresorerieCumulee),
      ltc,
      dscr,
      valeurSociete: Math.round(valeurSoc),
      valeurAction: Math.round(valAct * 1000) / 1000,
    });
  }

  // TRI par scénario de sortie (méthode Excel : flux investisseur + cession)
  const triScenarios = [];
  for (let sortie = 5; sortie <= Math.min(nbAnnees, 10); sortie++) {
    const flux = [-investissementTotal];
    for (let i = 0; i < sortie - 1; i++) {
      flux.push(annees[i].tresorerieAnnuelle * (1 - 0.22)); // part B/C = 46.6%
    }
    const dernAnnee = annees[sortie - 1];
    const valResiduelle = dernAnnee.retourInvestNet !== undefined
      ? dernAnnee.retourInvestNet
      : dernAnnee.valeurSociete * 0.466;
    const carried = dernAnnee.carriedInterest || 0;
    flux.push((dernAnnee.tresorerieAnnuelle * 0.466) + valResiduelle);
    const tri = calculerTRI(flux);
    triScenarios.push({
      sortie,
      tri,
      valFinale: Math.round(valResiduelle),
      carried: Math.round(carried),
    });
  }

  return { annees, triScenarios };
}

// ─── Chargement des données depuis l'Excel (valeurs par défaut) ───────────────
function dataFromExcel(nbAnnees = 11) {
  const n = Math.min(nbAnnees, 11);
  return Array.from({ length: n }, (_, i) => ({
    annee: i + 1,
    valeurParcBrut: BP_EXCEL.valeurParcBrut[i],
    valeurNetteParc: BP_EXCEL.valeurNetteParc[i],
    detteTotale: null,
    revenusLocatifs: BP_EXCEL.revenusLocatifs[i],
    chargesNonRecup: BP_EXCEL.chargesNonRecup[i],
    remuDirection: BP_EXCEL.remuDirection[i],
    serviceDette: BP_EXCEL.serviceDette[i],
    resultatAvantIS: BP_EXCEL.resultatAvantIS[i],
    IS: BP_EXCEL.IS[i],
    tresorerieAnnuelle: BP_EXCEL.tresorerieAnnuelle[i],
    tresorerieCumulee: BP_EXCEL.tresorerieCumulee[i],
    ltc: BP_EXCEL.ltc[i],
    dscr: BP_EXCEL.dscr[i],
    valeurSociete: BP_EXCEL.valeurSociete[i],
    valeurAction: BP_EXCEL.valeurAction[i],
    carriedInterest: BP_EXCEL.carriedInterest[i],
    retourInvestNet: BP_EXCEL.retourInvestNet[i],
  }));
}

function triScenariosFromExcel() {
  return Object.entries(BP_EXCEL.triNet).map(([sortie, tri]) => ({
    sortie: parseInt(sortie),
    tri,
    valFinale: BP_EXCEL.retourInvestNet[parseInt(sortie) - 1] || null,
    carried: BP_EXCEL.carriedInterest[parseInt(sortie) - 1] || null,
  }));
}

// ─── Paramètres par défaut (fidèles au BP Excel) ─────────────────────────────
const DEFAULT_PARAMS = {
  valeurParcInitial: 1250000,
  tauxRevalorisation: 1.5,       // % → 1.5%
  tauxRendementLocatif: 10.0,    // % → 10%
  tauxChargesNonRecup: 10.0,     // % → 10%
  tauxRemunDirection: 15.22,     // % (calibré sur rémunération An2 = 19031/126875)
  tauxIS: 15.0,                  // % → 15%
  detteInitiale: 1025000,
  tauxDette: 3.3,                // % → 3.3%
  dureeDette: 15,
  investissementTotal: 275000,
  hurdle: 6.5,                   // % → 6.5%
  nbActions: 200000,
  nbAnnees: 11,
  acquisitionsSupp: [
    { annee: 6, montant: 206884, dette: 206884, duree: 15 },
    { annee: 8, montant: 157031, dette: 157031, duree: 15 },
  ]
};

// ─── InputField ───────────────────────────────────────────────────────────────
function InputField({ label, value, onChange, suffix, tooltip, highlight, min, max }) {
  return (
    <div className={`p-3 rounded-xl border transition-all ${highlight ? 'border-[#C9A961] bg-[#C9A961]/5' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-center gap-1 mb-1">
        <label className="text-xs font-medium text-slate-600">{label}</label>
        {tooltip && (
          <div className="relative group">
            <Info className="h-3 w-3 text-slate-400 cursor-help" />
            <div className="absolute bottom-5 left-0 bg-slate-800 text-white text-xs rounded-lg p-2 w-48 hidden group-hover:block z-10 shadow-xl">{tooltip}</div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Input
          type="number" value={value} min={min} max={max} step="any"
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="h-8 text-sm font-semibold border-0 p-0 focus-visible:ring-0 bg-transparent"
        />
        {suffix && <span className="text-sm text-slate-500 font-medium whitespace-nowrap">{suffix}</span>}
      </div>
    </div>
  );
}

// ─── KpiCard ──────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color = 'blue', icon: Icon }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    gold: 'bg-amber-50 text-amber-700 border-amber-200',
    navy: 'bg-[#1A3A52] text-white border-[#1A3A52]',
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

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AdminBusinessPlan() {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [modeExcel, setModeExcel] = useState(true); // true = données exactes Excel
  const [activeTab, setActiveTab] = useState('synthese');

  const set = (k, v) => { setParams(p => ({ ...p, [k]: v })); setModeExcel(false); };
  const setAcq = (idx, k, v) => {
    const arr = [...params.acquisitionsSupp];
    arr[idx] = { ...arr[idx], [k]: v };
    setParams(p => ({ ...p, acquisitionsSupp: arr }));
    setModeExcel(false);
  };

  // Données : Excel exact ou recalculées
  const { annees, triScenarios } = useMemo(() => {
    if (modeExcel) {
      return {
        annees: dataFromExcel(params.nbAnnees),
        triScenarios: triScenariosFromExcel(),
      };
    }
    // Convertir les % en décimales pour le moteur
    return calculerBP({
      ...params,
      tauxRevalorisation: params.tauxRevalorisation / 100,
      tauxRendementLocatif: params.tauxRendementLocatif / 100,
      tauxChargesNonRecup: params.tauxChargesNonRecup / 100,
      tauxRemunDirection: params.tauxRemunDirection / 100,
      tauxIS: params.tauxIS / 100,
      tauxDette: params.tauxDette / 100,
      hurdle: params.hurdle / 100,
    });
  }, [params, modeExcel]);

  const derniere = annees[annees.length - 1] || {};
  const triAn5 = triScenarios.find(t => t.sortie === 5);
  const triAn10 = triScenarios.find(t => t.sortie === 10) || triScenarios[triScenarios.length - 1];

  const chartData = annees.map(a => ({
    name: `An ${a.annee}`,
    'Parc Brut': a.valeurParcBrut,
    'Valeur Nette': a.valeurNetteParc,
    'Tréso Cumulée': a.tresorerieCumulee,
    'Revenus Locatifs': a.revenusLocatifs,
    'Service Dette': a.serviceDette,
    'LTC %': a.ltc !== null ? Math.round(a.ltc * 100) : null,
    'DSCR': a.dscr,
  }));

  const tabs = [
    { id: 'synthese', label: 'Synthèse' },
    { id: 'exploitation', label: 'Exploitation' },
    { id: 'dette', label: 'Dette & Financement' },
    { id: 'investisseur', label: 'Retour Investisseur' },
    { id: 'parametres', label: 'Paramètres' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif text-[#1A3A52] mb-1">Business Plan Interactif</h1>
            <p className="text-slate-500 text-sm">
              {modeExcel
                ? 'Affichage des données exactes du fichier Excel. Modifiez un paramètre pour simuler un scénario.'
                : 'Mode simulation — les valeurs sont recalculées à partir de vos paramètres.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!modeExcel && (
              <button
                onClick={() => { setParams(DEFAULT_PARAMS); setModeExcel(true); }}
                className="text-xs px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 font-medium border border-amber-200 hover:bg-amber-200 transition-colors"
              >
                ↩ Restaurer BP original
              </button>
            )}
            <div className={`text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 ${modeExcel ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {modeExcel ? '📊 Données Excel exactes' : <><CheckCircle2 className="h-3 w-3" /> Simulation en temps réel</>}
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <KpiCard icon={Building2} label="Valeur Parc An 1" value={eur(annees[0]?.valeurParcBrut)} sub="1 250 000 € (Excel)" color="navy" />
          <KpiCard icon={TrendingUp} label="TRI Net — Sortie An 5" value={pct(triAn5?.tri)} sub="Hurdle 6,5 % respecté" color="green" />
          <KpiCard icon={TrendingUp} label="TRI Net — Sortie An 10" value={pct(triAn10?.tri)} sub="Scénario 10 ans" color="green" />
          <KpiCard icon={Euro} label="Valeur Société An 11" value={eur(derniere.valeurSociete)} sub={`Action : ${eur(derniere.valeurAction, 3)}`} color="gold" />
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === t.id ? 'text-[#1A3A52] border-b-2 border-[#C9A961] bg-[#C9A961]/5' : 'text-slate-500 hover:text-slate-700'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* ── SYNTHÈSE ── */}
            {activeTab === 'synthese' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Évolution Parc & Valeur Nette (€)</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={v => eur(v)} />
                        <Legend />
                        <Line type="monotone" dataKey="Parc Brut" stroke="#1A3A52" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="Valeur Nette" stroke="#C9A961" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="Tréso Cumulée" stroke="#10b981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">TRI Net par Scénario de Sortie (données Excel)</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={triScenarios.map(t => ({ name: `An ${t.sortie}`, 'TRI %': +(t.tri * 100).toFixed(2) }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} domain={[0, 15]} />
                        <Tooltip formatter={v => `${v} %`} />
                        <ReferenceLine y={6.5} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Hurdle 6,5%', position: 'insideTopRight', fontSize: 10, fill: '#ef4444' }} />
                        <Bar dataKey="TRI %" fill="#C9A961" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Grand tableau récap */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Tableau Récapitulatif Annuel</h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[#1A3A52] text-white">
                          <th className="px-3 py-2.5 text-left font-medium sticky left-0 bg-[#1A3A52]">Indicateur</th>
                          {annees.map(a => <th key={a.annee} className="px-3 py-2.5 text-right font-medium">An {a.annee}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { label: 'Valeur Parc Brut', key: 'valeurParcBrut', f: v => eur(v) },
                          { label: 'Valeur Nette Parc', key: 'valeurNetteParc', f: v => eur(v) },
                          { label: 'Revenus Locatifs', key: 'revenusLocatifs', f: v => eur(v) },
                          { label: 'Service Dette', key: 'serviceDette', f: v => eur(v) },
                          { label: 'Trésorerie Annuelle', key: 'tresorerieAnnuelle', f: v => eur(v), highlight: true },
                          { label: 'Trésorerie Cumulée', key: 'tresorerieCumulee', f: v => eur(v) },
                          { label: 'LTC', key: 'ltc', f: v => pct(v) },
                          { label: 'DSCR (loyer brut)', key: 'dscr', f: v => fmt(v, 3) },
                          { label: 'Valeur Société (DCF)', key: 'valeurSociete', f: v => eur(v), highlight: true },
                          { label: 'Valeur Action', key: 'valeurAction', f: v => eur(v, 3) },
                        ].map((row, ri) => (
                          <tr key={ri} className={row.highlight ? 'bg-[#C9A961]/10 font-semibold' : ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="px-3 py-2 text-slate-700 sticky left-0 bg-inherit">{row.label}</td>
                            {annees.map(a => (
                              <td key={a.annee} className="px-3 py-2 text-right text-slate-800">{row.f(a[row.key])}</td>
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
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Revenus vs Service de la Dette (€)</h3>
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
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">DSCR & LTC par année</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <ReferenceLine y={1.2} stroke="#ef4444" strokeDasharray="4 4" />
                        <Line type="monotone" dataKey="DSCR" stroke="#C9A961" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="LTC %" stroke="#1A3A52" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-700 text-white">
                        <th className="px-3 py-2.5 text-left">Poste (€)</th>
                        {annees.map(a => <th key={a.annee} className="px-3 py-2.5 text-right">An {a.annee}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { label: '+ Revenus Locatifs Bruts', key: 'revenusLocatifs', c: 'green' },
                        { label: '— Charges non récupérables', key: 'chargesNonRecup', c: 'red' },
                        { label: '— Rémunération direction', key: 'remuDirection', c: 'red' },
                        { label: '— Service de la dette', key: 'serviceDette', c: 'red' },
                        { label: '= Résultat avant IS', key: 'resultatAvantIS', c: 'bold' },
                        { label: '— IS (15%)', key: 'IS', c: 'red' },
                        { label: '= Trésorerie nette annuelle', key: 'tresorerieAnnuelle', c: 'highlight' },
                        { label: 'Trésorerie cumulée', key: 'tresorerieCumulee', c: '' },
                      ].map((row, ri) => (
                        <tr key={ri} className={row.c === 'highlight' ? 'bg-emerald-50 font-semibold' : row.c === 'bold' ? 'bg-slate-100 font-semibold' : ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className={`px-3 py-2 ${row.c === 'red' ? 'text-red-700' : row.c === 'green' ? 'text-emerald-700' : 'text-slate-700'}`}>{row.label}</td>
                          {annees.map(a => (
                            <td key={a.annee} className={`px-3 py-2 text-right font-mono ${row.c === 'red' ? 'text-red-700' : row.c === 'green' ? 'text-emerald-700' : 'text-slate-800'}`}>
                              {eur(a[row.key])}
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
                <div className="grid md:grid-cols-4 gap-4">
                  <KpiCard icon={Euro} label="Prêt 1 initial" value="1 025 000 €" sub="Taux 3,3% — 15 ans" color="navy" />
                  <KpiCard icon={Euro} label="Annuité Prêt 1" value="87 735 €" sub="/an" color="blue" />
                  <KpiCard icon={Euro} label="Prêt 2 (An 6)" value="206 884 €" sub="Taux 3,3% — 15 ans" color="blue" />
                  <KpiCard icon={Euro} label="Prêt 3 (An 8)" value="157 031 €" sub="Taux 3,3% — 15 ans" color="blue" />
                </div>

                {/* Tableau amortissement Prêt 1 */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Amortissement Prêt 1 — 1 025 000 € à 3,3% sur 15 ans</h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[#1A3A52] text-white">
                          <th className="px-3 py-2.5 text-left">Période</th>
                          <th className="px-3 py-2.5 text-right">K début</th>
                          <th className="px-3 py-2.5 text-right">Annuité</th>
                          <th className="px-3 py-2.5 text-right">Intérêts</th>
                          <th className="px-3 py-2.5 text-right">Capital remboursé</th>
                          <th className="px-3 py-2.5 text-right">K fin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          [2027, 1025000, 87735, 33825, 53910, 971090],
                          [2028, 971090, 87735, 32046, 55689, 915401],
                          [2029, 915401, 87735, 30208, 57527, 857875],
                          [2030, 857875, 87735, 28310, 59425, 798451],
                          [2031, 798451, 87735, 26349, 61386, 737065],
                          [2032, 737065, 87735, 24323, 63412, 673654],
                          [2033, 673654, 87735, 22231, 65504, 608150],
                          [2034, 608150, 87735, 20069, 67666, 540484],
                          [2035, 540484, 87735, 17836, 69899, 470585],
                          [2036, 470585, 87735, 15529, 72206, 398380],
                          [2037, 398380, 87735, 13147, 74588, 323792],
                          [2038, 323792, 87735, 10685, 77050, 246743],
                          [2039, 246743, 87735, 8143, 79592, 167151],
                          [2040, 167151, 87735, 5516, 82219, 84932],
                          [2041, 84932, 87735, 2803, 84932, 0],
                        ].map(([per, kd, ann, int, cap, kf], ri) => (
                          <tr key={per} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="px-3 py-2 font-medium text-slate-700">{per}</td>
                            <td className="px-3 py-2 text-right font-mono">{eur(kd)}</td>
                            <td className="px-3 py-2 text-right font-mono text-[#1A3A52] font-semibold">{eur(ann)}</td>
                            <td className="px-3 py-2 text-right font-mono text-red-700">{eur(int)}</td>
                            <td className="px-3 py-2 text-right font-mono text-emerald-700">{eur(cap)}</td>
                            <td className="px-3 py-2 text-right font-mono">{eur(kf)}</td>
                          </tr>
                        ))}
                        <tr className="bg-[#C9A961]/10 font-semibold">
                          <td className="px-3 py-2">TOTAL</td>
                          <td className="px-3 py-2 text-right"></td>
                          <td className="px-3 py-2 text-right font-mono">{eur(1316019)}</td>
                          <td className="px-3 py-2 text-right font-mono text-red-700">{eur(291019)}</td>
                          <td className="px-3 py-2 text-right font-mono text-emerald-700">{eur(1025000)}</td>
                          <td className="px-3 py-2 text-right font-mono">0 €</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* LTC par année */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">LTC & DSCR par Année</h3>
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
                          { label: 'Valeur Parc Brut', key: 'valeurParcBrut', f: v => eur(v) },
                          { label: 'Service de la Dette', key: 'serviceDette', f: v => eur(v) },
                          { label: 'LTC', key: 'ltc', f: v => pct(v), highlight: true },
                          { label: 'DSCR (loyer brut)', key: 'dscr', f: v => fmt(v, 3), highlight: true },
                        ].map((row, ri) => (
                          <tr key={ri} className={row.highlight ? 'bg-[#C9A961]/10 font-semibold' : ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="px-3 py-2 text-slate-700">{row.label}</td>
                            {annees.map(a => (
                              <td key={a.annee} className="px-3 py-2 text-right">{row.f(a[row.key])}</td>
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
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-slate-800">Scénarios de Sortie (données exactes Excel)</h3>
                    <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 border border-slate-200">
                      Investissement initial : <strong>275 000 €</strong> — Hurdle : <strong>6,5 %/an</strong> — Carried interest : <strong>20 % de la surperformance</strong>
                    </div>
                    {triScenarios.map(s => (
                      <div key={s.sortie} className={`rounded-xl border p-4 ${s.tri >= 0.065 ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="font-semibold text-slate-800">Sortie Année {s.sortie}</p>
                            {s.valFinale && <p className="text-xs text-slate-500">Retour net investisseurs : {eur(s.valFinale)}</p>}
                          </div>
                          <div className="text-right">
                            <p className={`text-3xl font-bold ${s.tri >= 0.065 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {pct(s.tri, 2)}
                            </p>
                            <p className="text-xs text-slate-500">TRI Net</p>
                          </div>
                        </div>
                        {s.carried && <p className="text-xs text-slate-500 mb-2">Carried interest : {eur(s.carried)}</p>}
                        <div className="flex justify-between items-center">
                          <div className="flex-1 h-2 bg-white rounded-full overflow-hidden mr-3">
                            <div className={`h-full rounded-full ${s.tri >= 0.065 ? 'bg-emerald-500' : 'bg-red-400'}`}
                              style={{ width: `${Math.min(100, (s.tri / 0.15) * 100)}%` }} />
                          </div>
                          <span className={`text-xs font-medium flex items-center gap-1 ${s.tri >= 0.065 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {s.tri >= 0.065 ? <><CheckCircle2 className="h-3 w-3" /> Hurdle atteint</> : <><AlertCircle className="h-3 w-3" /> Hurdle non atteint</>}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-4">Valeur de l'Action (€) — données Excel</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={annees.map(a => ({ name: `An ${a.annee}`, 'Valeur Action (€)': a.valeurAction }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v} €`} />
                        <Tooltip formatter={v => eur(v, 3)} />
                        <Line type="monotone" dataKey="Valeur Action (€)" stroke="#C9A961" strokeWidth={3} dot={{ fill: '#C9A961', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-4 bg-[#1A3A52] rounded-xl p-4 text-white grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-white/60 mb-1">Nb actions total</p>
                        <p className="font-bold text-lg">200 000</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/60 mb-1">Investissement initial</p>
                        <p className="font-bold text-lg">275 000 €</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/60 mb-1">Valeur action An 1</p>
                        <p className="font-bold text-[#C9A961]">2,951 €</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/60 mb-1">Valeur action An 11</p>
                        <p className="font-bold text-[#C9A961]">7,124 €</p>
                      </div>
                    </div>

                    {/* Tableau retour investisseur */}
                    <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-[#1A3A52] text-white">
                            <th className="px-3 py-2 text-left">Scénario</th>
                            <th className="px-3 py-2 text-right">Retour Net</th>
                            <th className="px-3 py-2 text-right">Carried</th>
                            <th className="px-3 py-2 text-right">TRI Net</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {triScenarios.map((s, ri) => (
                            <tr key={s.sortie} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="px-3 py-2 font-medium">Sortie An {s.sortie}</td>
                              <td className="px-3 py-2 text-right font-mono text-emerald-700">{s.valFinale ? eur(s.valFinale) : '—'}</td>
                              <td className="px-3 py-2 text-right font-mono text-slate-600">{s.carried ? eur(s.carried) : '—'}</td>
                              <td className="px-3 py-2 text-right font-bold text-[#1A3A52]">{pct(s.tri, 2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── PARAMÈTRES ── */}
            {activeTab === 'parametres' && (
              <div className="space-y-8">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                  <strong>Mode simulation :</strong> modifier un paramètre recalcule automatiquement tous les résultats.
                  Les valeurs par défaut sont celles de votre fichier Excel d'origine.
                  Cliquez sur <strong>"Restaurer BP original"</strong> pour revenir aux données exactes.
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#C9A961]" /> Actif Immobilier
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <InputField label="Valeur parc initial" value={params.valeurParcInitial} onChange={v => set('valeurParcInitial', v)} suffix="€" highlight tooltip="BP Excel : 1 250 000 €" />
                    <InputField label="Revalorisation annuelle" value={params.tauxRevalorisation} onChange={v => set('tauxRevalorisation', v)} suffix="%" tooltip="BP Excel : 1,5%" />
                    <InputField label="Rendement locatif brut" value={params.tauxRendementLocatif} onChange={v => set('tauxRendementLocatif', v)} suffix="%" highlight tooltip="BP Excel : 10%" />
                    <InputField label="Charges non récupérables" value={params.tauxChargesNonRecup} onChange={v => set('tauxChargesNonRecup', v)} suffix="%" tooltip="BP Excel : 10% des loyers" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Euro className="h-4 w-4 text-[#C9A961]" /> Financement
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <InputField label="Dette initiale (Prêt 1)" value={params.detteInitiale} onChange={v => set('detteInitiale', v)} suffix="€" highlight tooltip="BP Excel : 1 025 000 €" />
                    <InputField label="Taux d'intérêt" value={params.tauxDette} onChange={v => set('tauxDette', v)} suffix="%" tooltip="BP Excel : 3,3%" />
                    <InputField label="Durée du prêt" value={params.dureeDette} onChange={v => set('dureeDette', Math.round(v))} suffix="ans" tooltip="BP Excel : 15 ans" />
                    <InputField label="Investissement apporteurs" value={params.investissementTotal} onChange={v => set('investissementTotal', v)} suffix="€" highlight tooltip="BP Excel : 275 000 €" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Percent className="h-4 w-4 text-[#C9A961]" /> Gouvernance & Fiscalité
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <InputField label="Rémunération direction" value={params.tauxRemunDirection} onChange={v => set('tauxRemunDirection', v)} suffix="%" tooltip="BP Excel : ~15% des loyers (An2+)" />
                    <InputField label="Hurdle Rate" value={params.hurdle} onChange={v => set('hurdle', v)} suffix="%" highlight tooltip="BP Excel : 6,5% — Rendement min garanti" />
                    <InputField label="Taux IS" value={params.tauxIS} onChange={v => set('tauxIS', v)} suffix="%" tooltip="BP Excel : 15%" />
                    <InputField label="Nombre d'actions" value={params.nbActions} onChange={v => set('nbActions', Math.round(v))} tooltip="BP Excel : 200 000 actions" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <Target className="h-4 w-4 text-[#C9A961]" /> Acquisitions Supplémentaires
                    </h3>
                    <Button size="sm" onClick={() => { setParams(p => ({ ...p, acquisitionsSupp: [...p.acquisitionsSupp, { annee: 5, montant: 200000, dette: 160000, duree: 15 }] })); setModeExcel(false); }}
                      className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white text-xs h-8">+ Ajouter</Button>
                  </div>
                  {params.acquisitionsSupp.map((acq, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-3 mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <InputField label="Année" value={acq.annee} onChange={v => setAcq(idx, 'annee', Math.round(v))} />
                      <InputField label="Montant (€)" value={acq.montant} onChange={v => setAcq(idx, 'montant', v)} suffix="€" />
                      <InputField label="Dette (€)" value={acq.dette} onChange={v => setAcq(idx, 'dette', v)} suffix="€" />
                      <div className="flex items-end">
                        <button onClick={() => { setParams(p => ({ ...p, acquisitionsSupp: p.acquisitionsSupp.filter((_, i) => i !== idx) })); setModeExcel(false); }}
                          className="w-full h-8 text-xs text-red-600 hover:bg-red-50 rounded-lg border border-red-200">Supprimer</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-amber-800 mb-2">Résumé des Hypothèses Clés (BP Excel)</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-amber-700">
                    <div>LTC initial : <strong>77,7 %</strong></div>
                    <div>Effet de levier : <strong>x 4,55</strong></div>
                    <div>Hurdle rate : <strong>6,5 %/an</strong></div>
                    <div>CMPC : <strong>4,00 %</strong></div>
                    <div>Coût fonds propres : <strong>6,5 %</strong></div>
                    <div>LTC fonds propres : <strong>22 %</strong></div>
                    <div>Coût de la dette : <strong>3,3 %</strong></div>
                    <div>LTC dette : <strong>78 %</strong></div>
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