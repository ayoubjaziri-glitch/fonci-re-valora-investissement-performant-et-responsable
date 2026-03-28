import React, { useState, useMemo } from 'react';
import {
  TrendingUp, Building2, Percent, Euro, BarChart3,
  Info, AlertCircle, CheckCircle2, Target, Plus, Trash2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n, d = 0) => (n === null || n === undefined || isNaN(n)) ? '—' :
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
const pct = (n, d = 2) => (n === null || n === undefined || isNaN(n) || !isFinite(n)) ? '—' : `${fmt(n * 100, d)} %`;
const eur = (n, d = 0) => (n === null || n === undefined || isNaN(n)) ? '—' : `${fmt(n, d)} €`;

// ─── Calcul annuité d'un prêt ─────────────────────────────────────────────────
function annuite(montant, taux, duree) {
  if (!montant || !taux || !duree) return 0;
  return montant * (taux * Math.pow(1 + taux, duree)) / (Math.pow(1 + taux, duree) - 1);
}

// ─── Tableau d'amortissement complet d'un prêt ───────────────────────────────
function tableauAmortissement(montant, taux, duree) {
  const ann = annuite(montant, taux, duree);
  let reste = montant;
  const rows = [];
  for (let i = 0; i < duree; i++) {
    const interet = reste * taux;
    const capital = ann - interet;
    reste = Math.max(0, reste - capital);
    rows.push({ periode: i + 1, kDebut: montant - (i === 0 ? 0 : rows[i-1]?.kFin ? montant - rows[i-1].kFin : 0), loyer: ann, interet, capital, kFin: reste });
  }
  // Recalcul propre kDebut
  let k = montant;
  return rows.map((r, i) => {
    const kD = k;
    const int = k * taux;
    const cap = ann - int;
    k = Math.max(0, k - cap);
    return { periode: i + 1, kDebut: kD, loyer: ann, interet: int, capital: cap, kFin: k };
  });
}

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

// ─── DONNÉES EXACTES DE L'EXCEL (feuille "Valeur") ───────────────────────────
const EXCEL_VALEUR = {
  valeurParcBrut:     [1250000,1268750,1287781,1307098,1326704,1605210,1629289,1850017,1877767,2039944,2173535],
  valeurNetteParc:    [347660,422098,498375,576549,656685,749727,845222,951507,1058449,1176246,1299454],
  revenusLocatifs:    [125000,126875,128778,130710,132670,160521,162929,185002,187777,203994,217353],
  chargesNonRecup:    [12500,12688,12878,13071,13267,16052,16293,18500,18778,20399,21735],
  remuDirection:      [0,19031,19317,19606,19901,24078,24439,27750,28167,30599,32603],
  serviceDette:       [87735,87735,87735,87735,87735,105443,105443,118884,118884,128060,135113],
  resultatAvantIS:    [28675,13110,16375,19722,23154,28896,33154,39207,44177,51997,56875],
  IS:                 [4301,1967,2456,2958,3473,4334,4973,5881,6794,8749,9969],
  tresorerieAnnuelle: [20464,5455,6393,7339,8295,10614,11781,13986,15154,16186,17934],
  tresorerieCumulee:  [45464,50919,57312,64651,72947,31839,43620,18348,33503,22887,20222],
  ltc:                [0.7769,0.7215,0.6662,0.6109,0.5556,0.5418,0.4867,0.4662,0.4111,0.3824,0.0622],
  dscrBrut:           [1.4248,1.4461,1.4678,1.4898,1.5122,1.5224,1.5452,1.5562,1.5795,1.5930,null],
  dscrNet:            [1.2823,1.0846,1.1009,1.1174,1.1341,1.1418,1.1589,1.1671,1.1846,1.1947,null],
  valeurSociete:      [590218,701006,769369,871675,943657,982461,1072505,1145820,1257716,1337971,1424747],
  valeurAction:       [2.951,3.505,3.847,4.358,4.718,4.912,5.363,5.729,6.289,6.690,7.124],
  carriedInterest:    [null,null,null,null,15061,15101,19917,23174,30026,33930,38441],
  retourInvestNet:    [null,null,null,null,424617,442656,479795,510697,555981,589470,625390],
  // TRI exacts de l'Excel
  triNet: { 5:0.10200481602489919, 6:0.09759587692547123, 7:0.09940707792953374, 8:0.09910289710992282, 9:0.10110663991128765, 10:0.10038541277665747 },
  // Flux investisseur par année (depuis lignes 45-50 de l'Excel)
  fluxInvestisseur: [20464.16, 5455.12, 6392.70, 7339.39, 8295.15, 10613.55, 11780.78, 13986.33, 15154.38, 16186.36, 17933.51],
};

// ─── 5 PRÊTS EXACTS DE L'EXCEL ───────────────────────────────────────────────
// Prêt 1 : démarrage An 1 (2027)
// Prêt 2 : démarrage An 6 (lié à acquisition An 6)
// Prêt 3 : démarrage An 8 (lié à acquisition An 8)
// Prêt 4 : démarrage An 10 (lié à acquisition An 10)
// Prêt 5 : démarrage An 11 (lié à acquisition An 11)
const PRETS_EXCEL = [
  { id: 1, label: 'Prêt 1',  montant: 1025000,           taux: 0.033, duree: 15, anneeDebut: 1,  annuiteCalc: 87734.589742649 },
  { id: 2, label: 'Prêt 2',  montant: 206884.39609947032, taux: 0.033, duree: 15, anneeDebut: 6,  annuiteCalc: 17708.212308237 },
  { id: 3, label: 'Prêt 3',  montant: 157031.13352050213, taux: 0.033, duree: 15, anneeDebut: 8,  annuiteCalc: 13441.036171946 },
  { id: 4, label: 'Prêt 4',  montant: 107208.58150780172, taux: 0.033, duree: 15, anneeDebut: 10, annuiteCalc: 9176.488698028  },
  { id: 5, label: 'Prêt 5',  montant: 82392.81625715252,  taux: 0.033, duree: 15, anneeDebut: 11, annuiteCalc: 7052.390177622  },
];

// ─── Paramètres par défaut ────────────────────────────────────────────────────
const DEFAULT_PARAMS = {
  valeurParcInitial: 1250000,
  tauxRevalorisation: 1.5,
  tauxRendementLocatif: 10.0,
  tauxChargesNonRecup: 10.0,
  tauxRemunDirection: 15.22,
  tauxIS: 15.0,
  investissementTotal: 275000,
  hurdle: 6.5,
  nbActions: 200000,
  nbAnnees: 11,
  prets: PRETS_EXCEL.map(p => ({ ...p })),
};

// ─── InputField ───────────────────────────────────────────────────────────────
function InputField({ label, value, onChange, suffix, tooltip, highlight }) {
  return (
    <div className={`p-3 rounded-xl border ${highlight ? 'border-[#C9A961] bg-[#C9A961]/5' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-center gap-1 mb-1">
        <label className="text-xs font-medium text-slate-600">{label}</label>
        {tooltip && (
          <div className="relative group">
            <Info className="h-3 w-3 text-slate-400 cursor-help" />
            <div className="absolute bottom-5 left-0 bg-slate-800 text-white text-xs rounded-lg p-2 w-44 hidden group-hover:block z-10">{tooltip}</div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Input type="number" value={value} step="any"
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="h-8 text-sm font-semibold border-0 p-0 focus-visible:ring-0 bg-transparent" />
        {suffix && <span className="text-sm text-slate-500 font-medium whitespace-nowrap">{suffix}</span>}
      </div>
    </div>
  );
}

// ─── KpiCard ──────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color = 'blue', icon: Icon }) {
  const colors = { blue:'bg-blue-50 text-blue-700 border-blue-200', green:'bg-emerald-50 text-emerald-700 border-emerald-200', gold:'bg-amber-50 text-amber-700 border-amber-200', navy:'bg-[#1A3A52] text-white border-[#1A3A52]', red:'bg-red-50 text-red-700 border-red-200' };
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-2 opacity-70">{Icon && <Icon className="h-4 w-4" />}<span className="text-xs font-medium">{label}</span></div>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs opacity-70 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AdminBusinessPlan() {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [modeExcel, setModeExcel] = useState(true);
  const [activeTab, setActiveTab] = useState('synthese');
  const [detteExpandee, setDetteExpandee] = useState(null);

  const set = (k, v) => { setParams(p => ({ ...p, [k]: v })); setModeExcel(false); };

  // Gestion des prêts
  const setPret = (idx, k, v) => {
    const arr = [...params.prets];
    arr[idx] = { ...arr[idx], [k]: v };
    setParams(p => ({ ...p, prets: arr }));
    setModeExcel(false);
  };
  const addPret = () => {
    const newId = Math.max(...params.prets.map(p => p.id), 0) + 1;
    setParams(p => ({
      ...p,
      prets: [...p.prets, { id: newId, label: `Prêt ${newId}`, montant: 200000, taux: 0.033, duree: 15, anneeDebut: 5 }]
    }));
    setModeExcel(false);
  };
  const removePret = (idx) => {
    setParams(p => ({ ...p, prets: p.prets.filter((_, i) => i !== idx) }));
    setModeExcel(false);
  };

  // ── Données affichées : Excel exact OU recalcul ────────────────────────────
  const { annees, triScenarios } = useMemo(() => {
    if (modeExcel) {
      const n = Math.min(params.nbAnnees, 11);
      return {
        annees: Array.from({ length: n }, (_, i) => ({
          annee: i + 1,
          valeurParcBrut:     EXCEL_VALEUR.valeurParcBrut[i],
          valeurNetteParc:    EXCEL_VALEUR.valeurNetteParc[i],
          revenusLocatifs:    EXCEL_VALEUR.revenusLocatifs[i],
          chargesNonRecup:    EXCEL_VALEUR.chargesNonRecup[i],
          remuDirection:      EXCEL_VALEUR.remuDirection[i],
          serviceDette:       EXCEL_VALEUR.serviceDette[i],
          resultatAvantIS:    EXCEL_VALEUR.resultatAvantIS[i],
          IS:                 EXCEL_VALEUR.IS[i],
          tresorerieAnnuelle: EXCEL_VALEUR.tresorerieAnnuelle[i],
          tresorerieCumulee:  EXCEL_VALEUR.tresorerieCumulee[i],
          ltc:                EXCEL_VALEUR.ltc[i],
          dscrBrut:           EXCEL_VALEUR.dscrBrut[i],
          valeurSociete:      EXCEL_VALEUR.valeurSociete[i],
          valeurAction:       EXCEL_VALEUR.valeurAction[i],
          carriedInterest:    EXCEL_VALEUR.carriedInterest[i],
          retourInvestNet:    EXCEL_VALEUR.retourInvestNet[i],
        })),
        triScenarios: Object.entries(EXCEL_VALEUR.triNet).map(([s, tri]) => ({
          sortie: parseInt(s), tri,
          valFinale: EXCEL_VALEUR.retourInvestNet[parseInt(s) - 1],
          carried:   EXCEL_VALEUR.carriedInterest[parseInt(s) - 1],
        })),
      };
    }

    // ── Recalcul dynamique ─────────────────────────────────────────────────
    let valeurParc = params.valeurParcInitial;
    const tauxRev   = params.tauxRevalorisation / 100;
    const tauxLoc   = params.tauxRendementLocatif / 100;
    const tauxCh    = params.tauxChargesNonRecup / 100;
    const tauxDir   = params.tauxRemunDirection / 100;
    const tauxIS    = params.tauxIS / 100;

    // Pré-calculer les annuités de chaque prêt
    const pretsCalc = params.prets.map(p => ({
      ...p,
      ann: annuite(p.montant, p.taux, p.duree),
      resteDu: p.montant,
    }));

    let tresorerieCumulee = 0;
    const annees = [];

    for (let i = 0; i < params.nbAnnees; i++) {
      const anneeNum = i + 1;

      // Revalorisation du parc
      valeurParc *= (1 + tauxRev);

      // Service de la dette : somme des prêts actifs cette année
      let serviceDette = 0;
      let detteTotale = 0;
      pretsCalc.forEach(p => {
        const offset = anneeNum - p.anneeDebut; // 0 = 1ère année du prêt
        if (offset >= 0 && offset < p.duree) {
          serviceDette += p.ann;
        }
        // Capital restant dû
        if (offset < 0) detteTotale += p.montant;
        else if (offset < p.duree) {
          let r = p.montant;
          for (let k = 0; k < offset; k++) {
            const int = r * p.taux;
            r = Math.max(0, r - (p.ann - int));
          }
          detteTotale += r;
        }
      });

      const revenusLocatifs  = valeurParc * tauxLoc;
      const chargesNonRecup  = revenusLocatifs * tauxCh;
      const remuDir          = anneeNum > 1 ? revenusLocatifs * tauxDir : 0;
      const resultatAvantIS  = revenusLocatifs - chargesNonRecup - remuDir - serviceDette;
      const IS               = Math.max(0, resultatAvantIS * tauxIS);
      const tresorAnnuelle   = resultatAvantIS - IS;
      tresorerieCumulee += tresorAnnuelle;

      const valeurNetteParc  = valeurParc - detteTotale;
      const valeurSociete    = valeurNetteParc + tresorerieCumulee;

      annees.push({
        annee: anneeNum,
        valeurParcBrut:     Math.round(valeurParc),
        valeurNetteParc:    Math.round(valeurNetteParc),
        revenusLocatifs:    Math.round(revenusLocatifs),
        chargesNonRecup:    Math.round(chargesNonRecup),
        remuDirection:      Math.round(remuDir),
        serviceDette:       Math.round(serviceDette),
        resultatAvantIS:    Math.round(resultatAvantIS),
        IS:                 Math.round(IS),
        tresorerieAnnuelle: Math.round(tresorAnnuelle),
        tresorerieCumulee:  Math.round(tresorerieCumulee),
        ltc:                valeurParc > 0 ? detteTotale / valeurParc : 0,
        dscrBrut:           serviceDette > 0 ? revenusLocatifs / serviceDette : null,
        valeurSociete:      Math.round(valeurSociete),
        valeurAction:       params.nbActions > 0 ? Math.round((valeurSociete / params.nbActions) * 1000) / 1000 : 0,
        carriedInterest:    null,
        retourInvestNet:    null,
      });
    }

    // TRI recalculé
    const triScenarios = [];
    for (let sortie = 5; sortie <= Math.min(params.nbAnnees, 10); sortie++) {
      const flux = [-params.investissementTotal];
      for (let i = 0; i < sortie - 1; i++) flux.push(annees[i].tresorerieAnnuelle * 0.466);
      const a = annees[sortie - 1];
      flux.push((a.tresorerieAnnuelle * 0.466) + (a.valeurSociete * 0.466));
      triScenarios.push({ sortie, tri: calculerTRI(flux), valFinale: Math.round(a.valeurSociete * 0.466), carried: null });
    }

    return { annees, triScenarios };
  }, [params, modeExcel]);

  const derniere = annees[annees.length - 1] || {};
  const triAn5  = triScenarios.find(t => t.sortie === 5);
  const triAn10 = triScenarios.find(t => t.sortie === 10) || triScenarios[triScenarios.length - 1];

  const chartData = annees.map(a => ({
    name: `An ${a.annee}`,
    'Parc Brut':       a.valeurParcBrut,
    'Valeur Nette':    a.valeurNetteParc,
    'Tréso Cumulée':   a.tresorerieCumulee,
    'Revenus Loc.':    a.revenusLocatifs,
    'Service Dette':   a.serviceDette,
    'LTC %':           a.ltc !== null ? +(a.ltc * 100).toFixed(1) : null,
    'DSCR':            a.dscrBrut,
  }));

  const tabs = [
    { id: 'synthese', label: 'Synthèse' },
    { id: 'exploitation', label: 'Exploitation' },
    { id: 'dettes', label: 'Dettes & Amortissements' },
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
            <p className="text-slate-500 text-sm">{modeExcel ? 'Données exactes de votre fichier Excel.' : 'Mode simulation — recalcul en temps réel.'}</p>
          </div>
          <div className="flex items-center gap-3">
            {!modeExcel && (
              <button onClick={() => { setParams(DEFAULT_PARAMS); setModeExcel(true); }}
                className="text-xs px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 font-medium border border-amber-200 hover:bg-amber-200">
                ↩ Restaurer BP original
              </button>
            )}
            <div className={`text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 ${modeExcel ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {modeExcel ? '📊 Données Excel exactes' : <><CheckCircle2 className="h-3 w-3" /> Simulation</>}
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <KpiCard icon={Building2} label="Parc An 1" value={eur(annees[0]?.valeurParcBrut)} sub="Valeur brute" color="navy" />
          <KpiCard icon={TrendingUp} label="TRI Net — Sortie An 5" value={pct(triAn5?.tri)} sub="Hurdle 6,5% respecté" color="green" />
          <KpiCard icon={TrendingUp} label="TRI Net — Sortie An 10" value={pct(triAn10?.tri)} sub="Scénario 10 ans" color="green" />
          <KpiCard icon={Euro} label={`Valeur Société An ${annees.length}`} value={eur(derniere.valeurSociete)} sub={`Action : ${eur(derniere.valeurAction, 3)}`} color="gold" />
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
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Évolution Parc, Valeur Nette & Trésorerie (€)</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                        <Tooltip formatter={v => eur(v)} />
                        <Legend />
                        <Line type="monotone" dataKey="Parc Brut" stroke="#1A3A52" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="Valeur Nette" stroke="#C9A961" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="Tréso Cumulée" stroke="#10b981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">TRI Net par Scénario de Sortie</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={triScenarios.map(t => ({ name: `An ${t.sortie}`, 'TRI %': +(t.tri * 100).toFixed(2) }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} domain={[0, 14]} />
                        <Tooltip formatter={v => `${v} %`} />
                        <ReferenceLine y={6.5} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Hurdle 6,5%', position: 'insideTopRight', fontSize: 10, fill: '#ef4444' }} />
                        <Bar dataKey="TRI %" fill="#C9A961" radius={[4,4,0,0]} />
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
                          <th className="px-3 py-2.5 text-left font-medium min-w-[170px]">Indicateur</th>
                          {annees.map(a => <th key={a.annee} className="px-3 py-2.5 text-right font-medium">An {a.annee}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { label: 'Valeur Parc Brut',       key: 'valeurParcBrut',     f: v => eur(v) },
                          { label: 'Valeur Nette Parc',       key: 'valeurNetteParc',    f: v => eur(v) },
                          { label: 'Revenus Locatifs',        key: 'revenusLocatifs',    f: v => eur(v) },
                          { label: 'Service Dette',           key: 'serviceDette',       f: v => eur(v) },
                          { label: 'Trésorerie Annuelle',     key: 'tresorerieAnnuelle', f: v => eur(v), hl: true },
                          { label: 'Trésorerie Cumulée',      key: 'tresorerieCumulee',  f: v => eur(v) },
                          { label: 'LTC',                     key: 'ltc',                f: v => pct(v) },
                          { label: 'DSCR (loyer brut)',       key: 'dscrBrut',           f: v => fmt(v, 4) },
                          { label: 'Valeur Société (DCF)',    key: 'valeurSociete',      f: v => eur(v), hl: true },
                          { label: 'Valeur Action (€)',       key: 'valeurAction',       f: v => eur(v, 3) },
                        ].map((row, ri) => (
                          <tr key={ri} className={row.hl ? 'bg-[#C9A961]/10 font-semibold' : ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="px-3 py-2 text-slate-700">{row.label}</td>
                            {annees.map(a => <td key={a.annee} className="px-3 py-2 text-right font-mono text-slate-800">{row.f(a[row.key])}</td>)}
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
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                        <Tooltip formatter={v => eur(v)} />
                        <Legend />
                        <Bar dataKey="Revenus Loc." fill="#1A3A52" radius={[4,4,0,0]} />
                        <Bar dataKey="Service Dette" fill="#C9A961" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">DSCR & LTC</h3>
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
                        <th className="px-3 py-2.5 text-left min-w-[200px]">Poste (€)</th>
                        {annees.map(a => <th key={a.annee} className="px-3 py-2.5 text-right">An {a.annee}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { label: '+ Revenus Locatifs Bruts',     key: 'revenusLocatifs',    c: 'green' },
                        { label: '— Charges non récupérables',    key: 'chargesNonRecup',    c: 'red' },
                        { label: '— Rémunération direction',      key: 'remuDirection',      c: 'red' },
                        { label: '— Service de la dette',         key: 'serviceDette',       c: 'red' },
                        { label: '= Résultat avant IS',           key: 'resultatAvantIS',    c: 'bold' },
                        { label: '— IS (15%)',                    key: 'IS',                 c: 'red' },
                        { label: '= Trésorerie nette annuelle',   key: 'tresorerieAnnuelle', c: 'hl' },
                        { label: 'Trésorerie cumulée',            key: 'tresorerieCumulee',  c: '' },
                      ].map((row, ri) => (
                        <tr key={ri} className={row.c==='hl' ? 'bg-emerald-50 font-semibold' : row.c==='bold' ? 'bg-slate-100 font-semibold' : ri%2===0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className={`px-3 py-2 ${row.c==='red' ? 'text-red-700' : row.c==='green' ? 'text-emerald-700' : 'text-slate-700'}`}>{row.label}</td>
                          {annees.map(a => (
                            <td key={a.annee} className={`px-3 py-2 text-right font-mono ${row.c==='red' ? 'text-red-700' : row.c==='green' ? 'text-emerald-700' : 'text-slate-800'}`}>
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

            {/* ── DETTES & AMORTISSEMENTS ── */}
            {activeTab === 'dettes' && (
              <div className="space-y-6">
                {/* Récap service de la dette */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Service de la Dette Total par Année (€)</h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[#1A3A52] text-white">
                          <th className="px-3 py-2.5 text-left min-w-[120px]">Prêt</th>
                          <th className="px-3 py-2.5 text-right">Montant</th>
                          <th className="px-3 py-2.5 text-right">Annuité</th>
                          <th className="px-3 py-2.5 text-right">Début</th>
                          {annees.map(a => <th key={a.annee} className="px-3 py-2.5 text-right">An {a.annee}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {params.prets.map((p, pi) => {
                          const ann = p.annuiteCalc || annuite(p.montant, p.taux, p.duree);
                          return (
                            <tr key={p.id} className={pi % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="px-3 py-2 font-medium text-slate-700">{p.label}</td>
                              <td className="px-3 py-2 text-right font-mono">{eur(p.montant)}</td>
                              <td className="px-3 py-2 text-right font-mono text-[#1A3A52]">{eur(ann)}</td>
                              <td className="px-3 py-2 text-right">An {p.anneeDebut}</td>
                              {annees.map(a => {
                                const offset = a.annee - p.anneeDebut;
                                const actif = offset >= 0 && offset < p.duree;
                                return (
                                  <td key={a.annee} className={`px-3 py-2 text-right font-mono ${actif ? 'text-red-700' : 'text-slate-300'}`}>
                                    {actif ? eur(ann) : '—'}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                        {/* Ligne total */}
                        <tr className="bg-[#1A3A52]/10 font-bold">
                          <td className="px-3 py-2 text-slate-800">TOTAL</td>
                          <td className="px-3 py-2 text-right font-mono">{eur(params.prets.reduce((s, p) => s + p.montant, 0))}</td>
                          <td className="px-3 py-2"></td>
                          <td className="px-3 py-2"></td>
                          {annees.map(a => <td key={a.annee} className="px-3 py-2 text-right font-mono text-[#1A3A52]">{eur(a.serviceDette)}</td>)}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tableaux d'amortissement détaillés — accordéon */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Tableaux d'Amortissement Détaillés</h3>
                  <div className="space-y-3">
                    {params.prets.map((p, pi) => {
                      const ann = p.annuiteCalc || annuite(p.montant, p.taux, p.duree);
                      const rows = tableauAmortissement(p.montant, p.taux, p.duree);
                      const totalInt = rows.reduce((s, r) => s + r.interet, 0);
                      const isOpen = detteExpandee === p.id;
                      return (
                        <div key={p.id} className="border border-slate-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setDetteExpandee(isOpen ? null : p.id)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                          >
                            <div className="flex items-center gap-4 text-sm">
                              <span className="font-semibold text-[#1A3A52]">{p.label}</span>
                              <span className="text-slate-500">Montant : <strong className="text-slate-800">{eur(p.montant)}</strong></span>
                              <span className="text-slate-500">Annuité : <strong className="text-[#1A3A52]">{eur(ann)}</strong>/an</span>
                              <span className="text-slate-500">Démarrage : <strong>An {p.anneeDebut}</strong></span>
                              <span className="text-slate-500">Total intérêts : <strong className="text-red-600">{eur(totalInt)}</strong></span>
                            </div>
                            <span className="text-xs text-slate-400">{isOpen ? '▲ Masquer' : '▼ Détail'}</span>
                          </button>
                          {isOpen && (
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-[#1A3A52] text-white">
                                    <th className="px-3 py-2 text-left">Période</th>
                                    <th className="px-3 py-2 text-right">K Début</th>
                                    <th className="px-3 py-2 text-right">Annuité</th>
                                    <th className="px-3 py-2 text-right">Intérêts</th>
                                    <th className="px-3 py-2 text-right">Capital remboursé</th>
                                    <th className="px-3 py-2 text-right">K Fin</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {rows.map((r, ri) => (
                                    <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                      <td className="px-3 py-1.5 font-medium">{2026 + p.anneeDebut + ri}</td>
                                      <td className="px-3 py-1.5 text-right font-mono">{eur(r.kDebut)}</td>
                                      <td className="px-3 py-1.5 text-right font-mono text-[#1A3A52] font-semibold">{eur(r.loyer)}</td>
                                      <td className="px-3 py-1.5 text-right font-mono text-red-700">{eur(r.interet)}</td>
                                      <td className="px-3 py-1.5 text-right font-mono text-emerald-700">{eur(r.capital)}</td>
                                      <td className="px-3 py-1.5 text-right font-mono">{eur(r.kFin)}</td>
                                    </tr>
                                  ))}
                                  <tr className="bg-[#C9A961]/10 font-semibold">
                                    <td className="px-3 py-1.5">TOTAL</td>
                                    <td></td>
                                    <td className="px-3 py-1.5 text-right font-mono">{eur(rows.reduce((s,r)=>s+r.loyer,0))}</td>
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
              </div>
            )}

            {/* ── RETOUR INVESTISSEUR ── */}
            {activeTab === 'investisseur' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-slate-800">Scénarios de Sortie</h3>
                    <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 border">
                      Investissement : <strong>275 000 €</strong> — Hurdle : <strong>6,5%/an</strong> — Carried : <strong>20%</strong>
                    </div>
                    {triScenarios.map(s => (
                      <div key={s.sortie} className={`rounded-xl border p-4 ${s.tri >= 0.065 ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="font-semibold text-slate-800">Sortie Année {s.sortie}</p>
                            {s.valFinale && <p className="text-xs text-slate-500">Retour net : {eur(s.valFinale)}</p>}
                          </div>
                          <div className="text-right">
                            <p className={`text-3xl font-bold ${s.tri >= 0.065 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(s.tri)}</p>
                            <p className="text-xs text-slate-500">TRI Net</p>
                          </div>
                        </div>
                        {s.carried != null && <p className="text-xs text-slate-500 mb-2">Carried interest : {eur(s.carried)}</p>}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${s.tri >= 0.065 ? 'bg-emerald-500' : 'bg-red-400'}`} style={{ width: `${Math.min(100, (s.tri / 0.15) * 100)}%` }} />
                          </div>
                          <span className={`text-xs font-medium flex items-center gap-1 ${s.tri >= 0.065 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {s.tri >= 0.065 ? <><CheckCircle2 className="h-3 w-3" /> Hurdle atteint</> : <><AlertCircle className="h-3 w-3" /> Hurdle non atteint</>}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-4">Valeur de l'Action (€)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={annees.map(a => ({ name: `An ${a.annee}`, 'Action (€)': a.valeurAction }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v} €`} />
                        <Tooltip formatter={v => eur(v, 3)} />
                        <Line type="monotone" dataKey="Action (€)" stroke="#C9A961" strokeWidth={3} dot={{ fill:'#C9A961', r:4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-4 bg-[#1A3A52] rounded-xl p-4 text-white grid grid-cols-2 gap-4">
                      <div><p className="text-xs text-white/60 mb-1">Nb actions</p><p className="font-bold">{fmt(params.nbActions)}</p></div>
                      <div><p className="text-xs text-white/60 mb-1">Investissement</p><p className="font-bold">275 000 €</p></div>
                      <div><p className="text-xs text-white/60 mb-1">Valeur An 1</p><p className="font-bold text-[#C9A961]">{eur(annees[0]?.valeurAction, 3)}</p></div>
                      <div><p className="text-xs text-white/60 mb-1">Valeur An {annees.length}</p><p className="font-bold text-[#C9A961]">{eur(derniere.valeurAction, 3)}</p></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── PARAMÈTRES ── */}
            {activeTab === 'parametres' && (
              <div className="space-y-8">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
                  Modifiez les paramètres pour simuler un scénario. Cliquez sur <strong>"Restaurer BP original"</strong> pour revenir aux valeurs exactes de votre Excel.
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><Building2 className="h-4 w-4 text-[#C9A961]" /> Actif Immobilier</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <InputField label="Valeur parc initial" value={params.valeurParcInitial} onChange={v => set('valeurParcInitial', v)} suffix="€" highlight tooltip="Excel : 1 250 000 €" />
                    <InputField label="Revalorisation / an" value={params.tauxRevalorisation} onChange={v => set('tauxRevalorisation', v)} suffix="%" tooltip="Excel : 1,5%" />
                    <InputField label="Rendement locatif brut" value={params.tauxRendementLocatif} onChange={v => set('tauxRendementLocatif', v)} suffix="%" highlight tooltip="Excel : 10%" />
                    <InputField label="Charges non récup." value={params.tauxChargesNonRecup} onChange={v => set('tauxChargesNonRecup', v)} suffix="%" tooltip="Excel : 10%" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><Percent className="h-4 w-4 text-[#C9A961]" /> Gouvernance & Fiscalité</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <InputField label="Rémunération direction" value={params.tauxRemunDirection} onChange={v => set('tauxRemunDirection', v)} suffix="%" tooltip="Excel : ~15,22%" />
                    <InputField label="Hurdle Rate" value={params.hurdle} onChange={v => set('hurdle', v)} suffix="%" highlight tooltip="Excel : 6,5%" />
                    <InputField label="Taux IS" value={params.tauxIS} onChange={v => set('tauxIS', v)} suffix="%" tooltip="Excel : 15%" />
                    <InputField label="Nombre d'actions" value={params.nbActions} onChange={v => set('nbActions', Math.round(v))} tooltip="Excel : 200 000" />
                  </div>
                </div>

                {/* ── Gestion des dettes ── */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <Euro className="h-4 w-4 text-[#C9A961]" /> Prêts Bancaires ({params.prets.length})
                    </h3>
                    <Button size="sm" onClick={addPret} className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white text-xs h-8 gap-1">
                      <Plus className="h-3.5 w-3.5" /> Ajouter un prêt
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {params.prets.map((p, idx) => {
                      const ann = p.annuiteCalc || annuite(p.montant, p.taux, p.duree);
                      return (
                        <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-[#1A3A52]">{p.label}</span>
                              <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded-full border">Annuité : {eur(ann)}/an</span>
                            </div>
                            <button onClick={() => removePret(idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-200 transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div className="p-3 rounded-xl border border-slate-200 bg-white">
                              <label className="text-xs font-medium text-slate-600 block mb-1">Libellé</label>
                              <input type="text" value={p.label} onChange={e => setPret(idx, 'label', e.target.value)}
                                className="w-full h-8 text-sm font-semibold bg-transparent border-0 focus:outline-none" />
                            </div>
                            <InputField label="Montant (€)" value={p.montant} onChange={v => { setPret(idx, 'montant', v); setPret(idx, 'annuiteCalc', annuite(v, p.taux, p.duree)); }} suffix="€" highlight />
                            <InputField label="Taux (%)" value={+(p.taux * 100).toFixed(2)} onChange={v => { const t = v/100; setPret(idx,'taux',t); setPret(idx,'annuiteCalc',annuite(p.montant,t,p.duree)); }} suffix="%" />
                            <InputField label="Durée (ans)" value={p.duree} onChange={v => { const d = Math.round(v); setPret(idx,'duree',d); setPret(idx,'annuiteCalc',annuite(p.montant,p.taux,d)); }} suffix="ans" />
                            <InputField label="Année début" value={p.anneeDebut} onChange={v => setPret(idx, 'anneeDebut', Math.round(v))} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-amber-800 mb-2">Hypothèses Clés (BP Excel)</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-amber-700">
                    <div>LTC initial : <strong>77,7%</strong></div>
                    <div>Effet de levier : <strong>×4,55</strong></div>
                    <div>Hurdle : <strong>6,5%/an</strong></div>
                    <div>CMPC : <strong>4,00%</strong></div>
                    <div>Coût fonds propres : <strong>6,5%</strong></div>
                    <div>LTC fonds propres : <strong>22%</strong></div>
                    <div>Coût dette : <strong>3,3%</strong></div>
                    <div>LTC dette : <strong>78%</strong></div>
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