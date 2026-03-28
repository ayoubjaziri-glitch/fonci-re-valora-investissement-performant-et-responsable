import React, { useState } from 'react';
import {
  TrendingUp, Building2, Percent, Euro, BarChart3,
  AlertCircle, CheckCircle2, Plus, Trash2, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';

// ─── Formatters ───────────────────────────────────────────────────────────────
const f0 = n => (n == null || isNaN(n)) ? '—' : new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n);
const f2 = n => (n == null || isNaN(n)) ? '—' : new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const f4 = n => (n == null || isNaN(n)) ? '—' : new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(n);
const eur  = n => (n == null || isNaN(n)) ? '—' : `${f0(n)} €`;
const eur2 = n => (n == null || isNaN(n)) ? '—' : `${f2(n)} €`;
const pct2 = n => (n == null || isNaN(n) || !isFinite(n)) ? '—' : `${f2(n * 100)} %`;

// ─── DONNÉES EXACTES EXCEL — Feuille "Valeur " ────────────────────────────────
// 11 années (An 1 à An 11)
const BP = {
  // I. EXPLOITATION DU PARC
  valeurParcBrut:     [1250000, 1268749.9999999998, 1287781.2499999995, 1307097.9687499993, 1326704.4382812493, 1605210.499979806, 1629288.6574795027, 1850016.9042423228, 1877767.1578059574, 2039944.3920577988, 2173534.578260106],
  valeurNetteParc:    [347659.58974264865, 422098.19594680466, 498374.5261556978, 576549.2252614845, 656684.9394377621, 749727.4094188111, 845221.5309092347, 951507.2171746113, 1058448.6145368756, 1176245.5879663804, 1299453.9791406326],
  revenusLocatifs:    [125000, 126874.99999999999, 128778.12499999996, 130709.79687499994, 132670.44382812493, 160521.0499979806, 162928.86574795027, 185001.69042423228, 187776.71578059575, 203994.4392057799, 217353.45782601062],
  chargesNonRecup:    [12500, 12687.5, 12877.812499999996, 13070.979687499996, 13267.044382812493, 16052.104999798059, 16292.886574795028, 18500.16904242323, 18777.671578059577, 20399.443920577993, 21735.345782601064],
  remuDirection:      [0, 19031.249999999996, 19316.718749999993, 19606.46953124999, 19900.566574218738, 24078.15749969709, 24439.32986219254, 27750.25356363484, 28166.50736708936, 30599.16588086698, 32603.01867390159],
  bonusPerf:          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

  // II. FLUX ET DÉSENDETTEMENT
  totalDette:         1025000, // valeur initiale
  serviceDette:       [87734.58974264862, 87734.58974264862, 87734.58974264862, 87734.58974264862, 87734.58974264862, 105442.80205088534, 105442.80205088534, 118883.83822283102, 118883.83822283102, 128060.32692085861, 135112.71709848076],
  amortissement:      [50000, 50000, 50000, 50000, 50000, 60344.219804973516, 60344.219804973516, 68195.77648099863, 68195.77648099863, 71985.89422118368, 77675.84636924634],
  plusValuePotentiel: [null, null, null, null, 326704.43828124925, 406949.2246604415, 491371.6019651119, 584006.708308303, 679952.7383529362, 780105.1399412092, 888380.1521913221],
  resultatAvantIS:    [28675, 13110.266461507388, 16375.334216244519, 19722.457019388006, 23153.957304722688, 28896.235623675544, 33153.74894552743, 39207.339379721234, 44177.286043751265, 51996.58169179727, 56875.48069559529],
  IS:                 [4301.25, 1966.539969226108, 2456.300132436678, 2958.368552908201, 3473.093595708403, 4334.435343551331, 4973.062341829115, 5881.100906958185, 6794.321510937816, 8749.145422949317, 9968.870173898822],
  tresorerieCumulee:  [45464.16025735138, 50919.28054547664, 57311.984420391316, 64651.373781084476, 72946.52331382115, 31838.97439300234, 43619.75931125059, 18348.30461951006, 33502.68172118803, 22886.89340476459, 20222.195437604838],
  tresorerieAnnuelle: [20464.16025735138, 5455.120288125258, 6392.703874914674, 7339.389360693151, 8295.149532736668, 10613.550104048774, 11780.784918248253, 13986.328688385001, 15154.37710167797, 16186.357060526985, 17933.506097128375],

  // III. VALORISATION (DCF)
  valeurSociete:      [590217.9165544838, 701006.461651708, 769368.8616761413, 871675.4628847775, 943656.6101530327, 982460.5103194065, 1072505.2915130584, 1145819.963604641, 1257716.0678730116, 1337971.3609901161, 1424746.6358411016],
  nbActions:          200000,
  valeurAction:       [2.9510895827724193, 3.50503230825854, 3.8468443083807062, 4.358377314423887, 4.718283050765163, 4.912302551597032, 5.362526457565292, 5.7290998180232044, 6.2885803393650574, 6.689856804950581, 7.123733179205508],

  // IV. RÉPARTITION
  detentionA:  0.5340703962269258,
  detentionBC: 0.4659296037730742,

  // V. RATIOS
  dscrBrut:    [1.4247516329267829, 1.4461229074206845, 1.4678147510319945, 1.4898319722974742, 1.5121794518819363, 1.5223518995684049, 1.5451871780619306, 1.5561550938275786, 1.579497420234992, 1.5929557897493782, null],
  dscrNet:     [1.2822764696341047, 1.0845921805655134, 1.100861063273996, 1.1173739792231059, 1.134134588911452, 1.1417639246763036, 1.1588903835464481, 1.1671163203706838, 1.1846230651762442, 1.1947168423120336, null],
  ltc:         [0.776872328205881, 0.7214989588596614, 0.6661655260505637, 0.6108576356385038, 0.5555608614056561, 0.541771304568217, 0.48666199298095275, 0.4661623958504108, 0.41111803735838975, 0.3824347171662607, 0.06216267201354451],

  // INVESTISSEUR
  investissement:     275000,
  valeurCreeInvest:   [275000, 326619.662919745, 358471.7288761056, 406139.4030406154, 439677.55046644487, 457757.43629581336, 499711.9655192047, 533871.4416375887, 586007.1491631012, 623400.4660858456, 663831.6355144649],
  hurdleAnnuel:       17875,
  carriedInterest:    [null, null, null, null, 15060.510093288975, 15101.487259162672, 19917.393103840936, 23174.288327517734, 30026.429832620244, 33930.093217169124, 38441.32710289299],
  retourInvestNet:    [null, null, null, null, 424617.0403731559, 442655.9490366507, 479794.57241536374, 510697.1533100709, 555980.719330481, 589470.3728686764, 625390.3084115719],
  triNet:             [null, null, null, null, 0.10200481602489919, 0.09759587692547123, 0.09940707792953374, 0.09910289710992282, 0.10110663991128765, 0.10038541277665747, null],

  // DCF détail
  dcfTresorerie:      [72946.52331382115, 31838.97439300234, 43619.75931125059, 18348.30461951006, 33502.68172118803, 22886.89340476459, 20222.195437604838, 23569.19413494544, 44580.030249995245, 84321.04575624231, 159489.32106045543],
  dcfVTActualisee:    [473156.73570863286, 564828.4081379476, 614592.7334908645, 694471.6730182813, 744086.4176195944, 811219.3439330675, 873551.1572856295, 920121.2483837297, 963388.0414776937, 1003518.1943824096, 1040670.6350324446],
  dcfFluxActualise:   [38474.73780924522, 44968.03081083886, 51688.464443189856, 59297.62371475188, 66941.58497715718, 74481.77637499069, 82325.03099213992, 124611.9883312416, 164504.81557251286, 202091.0859490321, 237456.42427009626],

  // FLUX TRI (ligne par ligne de l'Excel)
  fluxTRI: {
    5:  [-275000, 20464.16025735138, 5455.120288125258, 6392.703874914674, 7339.389360693151, 8295.149532736668, 424617.0403731559],
    6:  [-275000, 20464.16025735138, 5455.120288125258, 6392.703874914674, 7339.389360693151, 8295.149532736668, 10613.550104048774, 442655.9490366507],
    7:  [-275000, 20464.16025735138, 5455.120288125258, 6392.703874914674, 7339.389360693151, 8295.149532736668, 10613.550104048774, 11780.784918248253, 479794.57241536374],
    8:  [-275000, 20464.16025735138, 5455.120288125258, 6392.703874914674, 7339.389360693151, 8295.149532736668, 10613.550104048774, 11780.784918248253, 13986.328688385001, 510697.1533100709],
    9:  [-275000, 20464.16025735138, 5455.120288125258, 6392.703874914674, 7339.389360693151, 8295.149532736668, 10613.550104048774, 11780.784918248253, 13986.328688385001, 15154.37710167797, 555980.719330481],
    10: [-275000, 20464.16025735138, 5455.120288125258, 6392.703874914674, 7339.389360693151, 8295.149532736668, 10613.550104048774, 11780.784918248253, 13986.328688385001, 15154.37710167797, 16186.357060526985, 589470.3728686764],
  },
};

// ─── 5 TABLEAUX DE DETTE EXACTS (lignes de chaque feuille Excel) ──────────────
const DETTES_EXCEL = [
  {
    id: 1, label: 'Prêt 1', montant: 1025000, taux: 0.033, duree: 15,
    annuite: 87734.58974264862, anneeDebut: 1,
    rows: [
      [1025000,        87734.59, 33825.00,    53909.59, 971090.41],
      [971090.41,      87734.59, 32045.98,    55688.61, 915401.80],
      [915401.80,      87734.59, 30208.26,    57526.33, 857875.47],
      [857875.47,      87734.59, 28309.89,    59424.70, 798450.77],
      [798450.77,      87734.59, 26348.88,    61385.71, 737065.06],
      [737065.06,      87734.59, 24323.15,    63411.44, 673653.62],
      [673653.62,      87734.59, 22230.57,    65504.02, 608149.60],
      [608149.60,      87734.59, 20068.94,    67665.65, 540483.94],
      [540483.94,      87734.59, 17835.97,    69898.62, 470585.32],
      [470585.32,      87734.59, 15529.32,    72205.27, 398380.05],
      [398380.05,      87734.59, 13146.54,    74588.05, 323792.00],
      [323792.00,      87734.59, 10685.14,    77049.45, 246742.55],
      [246742.55,      87734.59,  8142.50,    79592.09, 167150.46],
      [167150.46,      87734.59,  5515.97,    82218.62,  84931.84],
      [ 84931.84,      87734.59,  2802.75,    84931.84,       0.0],
    ],
    totalAnnuites: 1316018.85, totalInterets: 291018.85, totalCapital: 1025000,
  },
  {
    id: 2, label: 'Prêt 2', montant: 206884.39609947032, taux: 0.033, duree: 15,
    annuite: 17708.212308236725, anneeDebut: 6,
    rows: [
      [206884.40, 17708.21,  6827.19, 10881.03, 196003.37],
      [196003.37, 17708.21,  6468.11, 11240.10, 184763.27],
      [184763.27, 17708.21,  6097.19, 11611.02, 173152.24],
      [173152.24, 17708.21,  5714.02, 11994.19, 161158.05],
      [161158.05, 17708.21,  5318.22, 12389.00, 148768.06],
      [148768.06, 17708.21,  4909.35, 12798.87, 135969.19],
      [135969.19, 17708.21,  4486.98, 13221.23, 122747.96],
      [122747.96, 17708.21,  4050.68, 13657.53, 109090.43],
      [109090.43, 17708.21,  3599.98, 14108.23,  94982.21],
      [ 94982.21, 17708.21,  3134.41, 14573.80,  80408.41],
      [ 80408.41, 17708.21,  2653.48, 15054.73,  65353.67],
      [ 65353.67, 17708.21,  2156.67, 15551.54,  49802.13],
      [ 49802.13, 17708.21,  1643.47, 16064.74,  33737.39],
      [ 33737.39, 17708.21,  1113.33, 16594.88,  17142.51],
      [ 17142.51, 17708.21,   565.70, 17142.51,       0.0],
    ],
    totalAnnuites: 265623.18, totalInterets: 58738.79, totalCapital: 206884.40,
  },
  {
    id: 3, label: 'Prêt 3', montant: 157031.13352050213, taux: 0.033, duree: 15,
    annuite: 13441.036171945689, anneeDebut: 8,
    rows: [
      [157031.13, 13441.04,  5182.03,  8259.01, 148772.12],
      [148772.12, 13441.04,  4909.48,  8531.56, 140240.57],
      [140240.57, 13441.04,  4627.94,  8813.10, 131427.47],
      [131427.47, 13441.04,  4337.11,  9103.93, 122323.54],
      [122323.54, 13441.04,  4036.68,  9404.36, 112919.18],
      [112919.18, 13441.04,  3726.33,  9714.70, 103204.48],
      [103204.48, 13441.04,  3405.75, 10035.29,  93169.19],
      [ 93169.19, 13441.04,  3074.58, 10366.45,  82802.74],
      [ 82802.74, 13441.04,  2732.49, 10708.55,  72094.19],
      [ 72094.19, 13441.04,  2379.11, 11061.93,  61032.26],
      [ 61032.26, 13441.04,  2014.06, 11426.97,  49605.29],
      [ 49605.29, 13441.04,  1636.97, 11804.06,  37801.23],
      [ 37801.23, 13441.04,  1247.44, 12193.60,  25607.64],
      [ 25607.64, 13441.04,   845.05, 12595.98,  13011.65],
      [ 13011.65, 13441.04,   429.38, 13011.65,       0.0],
    ],
    totalAnnuites: 201615.54, totalInterets: 44584.41, totalCapital: 157031.13,
  },
  {
    id: 4, label: 'Prêt 4', montant: 107208.58150780172, taux: 0.033, duree: 15,
    annuite: 9176.488698027599, anneeDebut: 10,
    rows: [
      [107208.58,  9176.49,  3537.88,  5638.61, 101569.98],
      [101569.98,  9176.49,  3351.81,  5824.68,  95745.30],
      [ 95745.30,  9176.49,  3159.59,  6016.89,  89728.40],
      [ 89728.40,  9176.49,  2961.04,  6215.45,  83512.95],
      [ 83512.95,  9176.49,  2755.93,  6420.56,  77092.39],
      [ 77092.39,  9176.49,  2544.05,  6632.44,  70459.95],
      [ 70459.95,  9176.49,  2325.18,  6851.31,  63608.64],
      [ 63608.64,  9176.49,  2099.09,  7077.40,  56531.24],
      [ 56531.24,  9176.49,  1865.53,  7310.96,  49220.28],
      [ 49220.28,  9176.49,  1624.27,  7552.22,  41668.06],
      [ 41668.06,  9176.49,  1375.05,  7801.44,  33866.62],
      [ 33866.62,  9176.49,  1117.60,  8058.89,  25807.73],
      [ 25807.73,  9176.49,   851.65,  8324.83,  17482.89],
      [ 17482.89,  9176.49,   576.94,  8599.55,   8883.34],
      [  8883.34,  9176.49,   293.15,  8883.34,       0.0],
    ],
    totalAnnuites: 137647.33, totalInterets: 30438.75, totalCapital: 107208.58,
  },
  {
    id: 5, label: 'Prêt 5', montant: 82392.81625715252, taux: 0.033, duree: 15,
    annuite: 7052.390177622152, anneeDebut: 11,
    rows: [
      [82392.82,  7052.39,  2718.96,  4333.43, 78059.39],
      [78059.39,  7052.39,  2575.96,  4476.43, 73582.96],
      [73582.96,  7052.39,  2428.24,  4624.15, 68958.81],
      [68958.81,  7052.39,  2275.64,  4776.75, 64182.06],
      [64182.06,  7052.39,  2118.01,  4934.38, 59247.67],
      [59247.67,  7052.39,  1955.17,  5097.22, 54150.46],
      [54150.46,  7052.39,  1786.97,  5265.43, 48885.03],
      [48885.03,  7052.39,  1613.21,  5439.18, 43445.85],
      [43445.85,  7052.39,  1433.71,  5618.68, 37827.17],
      [37827.17,  7052.39,  1248.30,  5804.09, 32023.08],
      [32023.08,  7052.39,  1056.76,  5995.63, 26027.45],
      [26027.45,  7052.39,   858.91,  6193.48, 19833.96],
      [19833.96,  7052.39,   654.52,  6397.87, 13436.10],
      [13436.10,  7052.39,   443.39,  6609.00,  6827.10],
      [ 6827.10,  7052.39,   225.29,  6827.10,      0.0],
    ],
    totalAnnuites: 105785.85, totalInterets: 23393.04, totalCapital: 82392.82,
  },
];

// ─── KpiCard ──────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color = 'blue', icon: Icon }) {
  const colors = {
    blue:  'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    gold:  'bg-amber-50 text-amber-700 border-amber-200',
    navy:  'bg-[#1A3A52] text-white border-[#1A3A52]',
    red:   'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-2 opacity-70">
        {Icon && <Icon className="h-4 w-4" />}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs opacity-70 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Tableau générique ────────────────────────────────────────────────────────
function BPTable({ rows, annees = 11, headerColor = 'bg-[#1A3A52]' }) {
  const cols = Array.from({ length: annees }, (_, i) => i);
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-xs">
        <thead>
          <tr className={`${headerColor} text-white`}>
            <th className="px-3 py-2.5 text-left font-medium min-w-[220px] sticky left-0 z-10" style={{ background: 'inherit' }}>Indicateur</th>
            {cols.map(i => <th key={i} className="px-3 py-2.5 text-right font-medium whitespace-nowrap">An {i + 1}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, ri) => (
            <tr key={ri} className={
              row.section ? 'bg-[#1A3A52]/5 font-bold' :
              row.hl === 'gold' ? 'bg-[#C9A961]/10 font-semibold' :
              row.hl === 'green' ? 'bg-emerald-50 font-semibold' :
              row.hl === 'red' ? 'bg-red-50' :
              ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'
            }>
              <td className={`px-3 py-2 sticky left-0 bg-inherit ${
                row.section ? 'text-[#1A3A52] font-bold' :
                row.hl === 'red' ? 'text-red-700' :
                row.hl === 'green' ? 'text-emerald-700' :
                'text-slate-700'
              }`}>
                {row.section ? `▸ ${row.label}` : row.label}
              </td>
              {cols.map(i => (
                <td key={i} className={`px-3 py-2 text-right font-mono ${
                  row.section ? '' :
                  row.hl === 'red' ? 'text-red-700' :
                  row.hl === 'green' ? 'text-emerald-700' :
                  'text-slate-800'
                }`}>
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

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AdminBusinessPlan() {
  const [activeTab, setActiveTab] = useState('complet');
  const [detteOuverte, setDetteOuverte] = useState(null);
  // Dettes personnalisées (permet d'en ajouter)
  const [dettesUser, setDettesUser] = useState([]);

  const addDette = () => setDettesUser(d => [...d, {
    id: Date.now(), label: `Prêt ${DETTES_EXCEL.length + d.length + 1}`,
    montant: 150000, taux: 0.033, duree: 15, anneeDebut: 5,
  }]);
  const removeDette = id => setDettesUser(d => d.filter(x => x.id !== id));
  const updateDette = (id, k, v) => setDettesUser(d => d.map(x => x.id === id ? { ...x, [k]: v } : x));

  const toutesLesDettes = [...DETTES_EXCEL, ...dettesUser];

  const tabs = [
    { id: 'complet', label: 'BP Complet' },
    { id: 'exploitation', label: 'I. Exploitation' },
    { id: 'flux', label: 'II. Flux & Dette' },
    { id: 'valorisation', label: 'III. Valorisation' },
    { id: 'investisseur', label: 'IV. Investisseur' },
    { id: 'dettes', label: 'V. Dettes' },
    { id: 'graphiques', label: 'Graphiques' },
  ];

  const anneesLabels = Array.from({ length: 11 }, (_, i) => `An ${i + 1}`);

  // Graphiques
  const chartData = anneesLabels.map((name, i) => ({
    name,
    'Parc Brut':       BP.valeurParcBrut[i],
    'Valeur Nette':    BP.valeurNetteParc[i],
    'Tréso Cumulée':   BP.tresorerieCumulee[i],
    'Revenus Loc.':    BP.revenusLocatifs[i],
    'Service Dette':   BP.serviceDette[i],
    'LTC %':           +(BP.ltc[i] * 100).toFixed(2),
    'DSCR Brut':       BP.dscrBrut[i],
  }));

  const triData = [5, 6, 7, 8, 9, 10].map(s => ({
    name: `Sortie An ${s}`,
    'TRI %': BP.triNet[s - 1] != null ? +(BP.triNet[s - 1] * 100).toFixed(2) : null,
    'Retour Net': BP.retourInvestNet[s - 1],
  }));

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-6">
      <div className="max-w-full mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif text-[#1A3A52] mb-1">Business Plan — Foncière Valora</h1>
            <p className="text-slate-500 text-sm">Données exactes du fichier <strong>BPpremirelevedesfondsbonTRI.xlsx</strong> — 11 années · 5 prêts</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
              📊 Données Excel exactes
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <KpiCard icon={Building2} label="Parc An 1 (Brut)" value={eur(BP.valeurParcBrut[0])} sub="Valeur initiale" color="navy" />
          <KpiCard icon={Building2} label="Parc An 11 (Brut)" value={eur(BP.valeurParcBrut[10])} sub={`+${((BP.valeurParcBrut[10]/BP.valeurParcBrut[0]-1)*100).toFixed(1)}%`} color="navy" />
          <KpiCard icon={TrendingUp} label="TRI Net — An 5" value={pct2(BP.triNet[4])} sub="10,20 %" color="green" />
          <KpiCard icon={TrendingUp} label="TRI Net — An 10" value={pct2(BP.triNet[9])} sub="10,04 %" color="green" />
          <KpiCard icon={Euro} label="Valeur Société An 11" value={eur(BP.valeurSociete[10])} sub={`Action : ${eur2(BP.valeurAction[10])} €`} color="gold" />
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === t.id ? 'text-[#1A3A52] border-b-2 border-[#C9A961] bg-[#C9A961]/5' : 'text-slate-500 hover:text-slate-700'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* ── BP COMPLET ── */}
            {activeTab === 'complet' && (
              <div className="space-y-1">
                <BPTable annees={11} rows={[
                  { label: 'I. EXPLOITATION DU PARC', section: true },
                  { label: 'Valeur Parc Immobilier Brut (€)', data: BP.valeurParcBrut, fmt: eur, hl: 'gold' },
                  { label: 'Valeur Parc Immobilier NET (€)', data: BP.valeurNetteParc, fmt: eur },
                  { label: 'Revenus Locatifs brut (10%)', data: BP.revenusLocatifs, fmt: eur, hl: 'green' },
                  { label: 'Charges non récupérables (10%)', data: BP.chargesNonRecup, fmt: eur, hl: 'red' },
                  { label: 'Rémunération direction', data: BP.remuDirection, fmt: eur, hl: 'red' },
                  { label: 'Bonus Performance (>10%)', data: BP.bonusPerf, fmt: eur },
                  { label: 'II. FLUX ET DÉSENDETTEMENT', section: true },
                  { label: 'Service Dette (Intérêts + Cap.)', data: BP.serviceDette, fmt: eur, hl: 'red' },
                  { label: 'Amortissement', data: BP.amortissement, fmt: eur },
                  { label: 'Résultat comptable avant IS', data: BP.resultatAvantIS, fmt: eur, hl: 'gold' },
                  { label: 'IS (15%)', data: BP.IS, fmt: eur, hl: 'red' },
                  { label: 'Trésorerie Annuelle', data: BP.tresorerieAnnuelle, fmt: eur, hl: 'green' },
                  { label: 'Trésorerie Cumulée (Sté)', data: BP.tresorerieCumulee, fmt: eur },
                  { label: 'III. VALORISATION (DCF)', section: true },
                  { label: 'Valeur de la Société (DCF)', data: BP.valeurSociete, fmt: eur, hl: 'gold' },
                  { label: "Valeur de l'Action (€ avant carried)", data: BP.valeurAction, fmt: eur2 },
                  { label: 'IV. RÉPARTITION & INVESTISSEUR', section: true },
                  { label: 'Valeur créée pour investisseurs', data: BP.valeurCreeInvest, fmt: eur },
                  { label: 'Hurdle annuel (6,5% × 275k)', data: Array(11).fill(BP.hurdleAnnuel), fmt: eur },
                  { label: 'Carried Interest', data: BP.carriedInterest, fmt: v => v == null ? '—' : eur(v) },
                  { label: 'Retour sur investissement NET', data: BP.retourInvestNet, fmt: v => v == null ? '—' : eur(v), hl: 'green' },
                  { label: 'TRI NET', data: BP.triNet, fmt: v => v == null ? '—' : pct2(v), hl: 'gold' },
                  { label: 'V. RATIOS', section: true },
                  { label: 'DSCR sur loyer BRUT', data: BP.dscrBrut, fmt: v => v == null ? '—' : f4(v) },
                  { label: 'DSCR sur loyer NET', data: BP.dscrNet, fmt: v => v == null ? '—' : f4(v) },
                  { label: 'LTC', data: BP.ltc, fmt: pct2, hl: 'gold' },
                ]} />
              </div>
            )}

            {/* ── I. EXPLOITATION ── */}
            {activeTab === 'exploitation' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700">I. Exploitation du Parc</h3>
                <BPTable annees={11} rows={[
                  { label: 'Valeur Parc Brut (€)', data: BP.valeurParcBrut, fmt: eur, hl: 'gold' },
                  { label: 'Valeur Parc NET (€)', data: BP.valeurNetteParc, fmt: eur },
                  { label: 'Revenus Locatifs brut (10%)', data: BP.revenusLocatifs, fmt: eur, hl: 'green' },
                  { label: 'Charges non récupérables', data: BP.chargesNonRecup, fmt: eur, hl: 'red' },
                  { label: 'Rémunération direction', data: BP.remuDirection, fmt: eur, hl: 'red' },
                  { label: 'Bonus Performance', data: BP.bonusPerf, fmt: eur },
                  { label: 'Plus-value potentielle (réf.)', data: BP.plusValuePotentiel, fmt: v => v == null ? '—' : eur(v) },
                ]} />
              </div>
            )}

            {/* ── II. FLUX & DETTE ── */}
            {activeTab === 'flux' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700">II. Flux & Désendettement</h3>
                <BPTable annees={11} rows={[
                  { label: 'Revenus Locatifs brut', data: BP.revenusLocatifs, fmt: eur, hl: 'green' },
                  { label: '— Charges non récupérables', data: BP.chargesNonRecup, fmt: eur, hl: 'red' },
                  { label: '— Rémunération direction', data: BP.remuDirection, fmt: eur, hl: 'red' },
                  { label: '— Service Dette', data: BP.serviceDette, fmt: eur, hl: 'red' },
                  { label: '= Résultat avant IS', data: BP.resultatAvantIS, fmt: eur, hl: 'gold' },
                  { label: '— IS (15%)', data: BP.IS, fmt: eur, hl: 'red' },
                  { label: '= Trésorerie Annuelle', data: BP.tresorerieAnnuelle, fmt: eur, hl: 'green' },
                  { label: 'Trésorerie Cumulée', data: BP.tresorerieCumulee, fmt: eur },
                  { label: 'Amortissement', data: BP.amortissement, fmt: eur },
                ]} />
                {/* Flux TRI par scénario */}
                <h3 className="text-sm font-semibold text-slate-700 mt-6">Flux TRI (scénarios de sortie — données exactes Excel)</h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[#1A3A52] text-white">
                        <th className="px-3 py-2.5 text-left min-w-[160px]">Scénario</th>
                        <th className="px-3 py-2.5 text-right">An 0</th>
                        {Array.from({ length: 11 }, (_, i) => <th key={i} className="px-3 py-2.5 text-right">An {i + 1}</th>)}
                        <th className="px-3 py-2.5 text-right bg-[#C9A961] text-[#1A3A52]">TRI NET</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[5, 6, 7, 8, 9, 10].map((s, ri) => (
                        <tr key={s} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="px-3 py-2 font-medium text-slate-700">Sortie An {s}</td>
                          {BP.fluxTRI[s].map((v, j) => (
                            <td key={j} className={`px-3 py-2 text-right font-mono ${v < 0 ? 'text-red-700' : j === BP.fluxTRI[s].length - 1 ? 'text-emerald-700 font-bold' : 'text-slate-700'}`}>
                              {eur(v)}
                            </td>
                          ))}
                          {Array.from({ length: 12 - BP.fluxTRI[s].length }, (_, k) => <td key={`e${k}`} className="px-3 py-2 text-right text-slate-300">—</td>)}
                          <td className="px-3 py-2 text-right font-bold text-emerald-700 bg-emerald-50">{pct2(BP.triNet[s - 1])}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── III. VALORISATION ── */}
            {activeTab === 'valorisation' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700">III. Valorisation (DCF)</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <KpiCard label="CMPC" value="4,00 %" sub="Coût capitaux propres 6,5% × LTC 22%" color="blue" icon={Percent} />
                  <KpiCard label="Coût capitaux propres" value="6,50 %" sub="LTC fonds propres : 22%" color="blue" icon={Percent} />
                  <KpiCard label="Coût de la dette" value="3,30 %" sub="LTC dette : 78%" color="blue" icon={Percent} />
                </div>
                <BPTable annees={11} rows={[
                  { label: 'Valeur Société (DCF)', data: BP.valeurSociete, fmt: eur, hl: 'gold' },
                  { label: "Valeur Action (€ avant carried)", data: BP.valeurAction, fmt: eur2 },
                  { label: 'DCF — Trésorerie', data: BP.dcfTresorerie, fmt: eur },
                  { label: 'DCF — VT actualisée', data: BP.dcfVTActualisee, fmt: eur },
                  { label: 'DCF — Flux actualisé', data: BP.dcfFluxActualise, fmt: eur },
                  { label: 'LTC', data: BP.ltc, fmt: pct2, hl: 'gold' },
                  { label: 'DSCR Loyer Brut', data: BP.dscrBrut, fmt: v => v == null ? '—' : f4(v) },
                  { label: 'DSCR Loyer Net', data: BP.dscrNet, fmt: v => v == null ? '—' : f4(v) },
                ]} />

                {/* Répartition capital */}
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div className="bg-[#1A3A52] rounded-xl p-4 text-white">
                    <p className="text-xs text-white/60 mb-1">% Détention Catégorie A</p>
                    <p className="text-2xl font-bold">{(BP.detentionA * 100).toFixed(2)} %</p>
                  </div>
                  <div className="bg-[#C9A961]/20 rounded-xl p-4">
                    <p className="text-xs text-slate-600 mb-1">% Détention Catégories B/C</p>
                    <p className="text-2xl font-bold text-[#1A3A52]">{(BP.detentionBC * 100).toFixed(2)} %</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── IV. INVESTISSEUR ── */}
            {activeTab === 'investisseur' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-slate-800">Scénarios de Sortie (données exactes Excel)</h3>
                    <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 border">
                      Investissement initial : <strong>275 000 €</strong> · Hurdle : <strong>6,5 %/an</strong> (17 875 €/an) · Carried : <strong>20 %</strong>
                    </div>
                    {[5, 6, 7, 8, 9, 10].map(s => {
                      const tri = BP.triNet[s - 1];
                      const ret = BP.retourInvestNet[s - 1];
                      const carried = BP.carriedInterest[s - 1];
                      return (
                        <div key={s} className={`rounded-xl border p-4 ${tri >= 0.065 ? 'border-emerald-200 bg-emerald-50' : 'border-orange-200 bg-orange-50'}`}>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-slate-800">Sortie Année {s}</p>
                              {ret && <p className="text-xs text-slate-500">Retour net : <strong>{eur(ret)}</strong></p>}
                              {carried && <p className="text-xs text-slate-500">Carried : <strong>{eur(carried)}</strong></p>}
                            </div>
                            <div className="text-right">
                              <p className={`text-3xl font-bold ${tri >= 0.065 ? 'text-emerald-600' : 'text-orange-600'}`}>{pct2(tri)}</p>
                              <p className="text-xs text-slate-500">TRI Net</p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${tri >= 0.065 ? 'bg-emerald-500' : 'bg-orange-400'}`} style={{ width: `${Math.min(100, (tri / 0.15) * 100)}%` }} />
                            </div>
                            <span className={`text-xs font-medium flex items-center gap-1 ${tri >= 0.065 ? 'text-emerald-600' : 'text-orange-600'}`}>
                              {tri >= 0.065 ? <><CheckCircle2 className="h-3 w-3" /> Hurdle OK</> : <><AlertCircle className="h-3 w-3" /> Hurdle non atteint</>}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-4">Valeur de l'Action (€)</h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={anneesLabels.map((name, i) => ({ name, "Action (€)": BP.valeurAction[i] }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v} €`} />
                        <Tooltip formatter={v => eur2(v)} />
                        <Line type="monotone" dataKey="Action (€)" stroke="#C9A961" strokeWidth={3} dot={{ fill: '#C9A961', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-4 bg-[#1A3A52] rounded-xl p-4 text-white grid grid-cols-2 gap-3">
                      <div><p className="text-xs text-white/60 mb-1">200 000 actions</p><p className="font-bold">Investissement</p></div>
                      <div><p className="text-xs text-white/60 mb-1">Capital apporté</p><p className="font-bold text-[#C9A961]">275 000 €</p></div>
                      <div><p className="text-xs text-white/60 mb-1">Valeur action An 1</p><p className="font-bold text-[#C9A961]">{eur2(BP.valeurAction[0])}</p></div>
                      <div><p className="text-xs text-white/60 mb-1">Valeur action An 11</p><p className="font-bold text-[#C9A961]">{eur2(BP.valeurAction[10])}</p></div>
                    </div>
                    {/* Tableau récap retour investisseur */}
                    <BPTable annees={11} rows={[
                      { label: 'Valeur créée investisseurs', data: BP.valeurCreeInvest, fmt: eur },
                      { label: 'Carried Interest', data: BP.carriedInterest, fmt: v => v == null ? '—' : eur(v) },
                      { label: 'Retour NET', data: BP.retourInvestNet, fmt: v => v == null ? '—' : eur(v), hl: 'green' },
                      { label: 'TRI NET', data: BP.triNet, fmt: v => v == null ? '—' : pct2(v), hl: 'gold' },
                    ]} />
                  </div>
                </div>
              </div>
            )}

            {/* ── V. DETTES ── */}
            {activeTab === 'dettes' && (
              <div className="space-y-6">
                {/* Récap service total par année */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Service de la Dette Total par Année (€)</h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[#1A3A52] text-white">
                          <th className="px-3 py-2.5 text-left min-w-[130px]">Prêt</th>
                          <th className="px-3 py-2.5 text-right">Montant</th>
                          <th className="px-3 py-2.5 text-right">Annuité/an</th>
                          <th className="px-3 py-2.5 text-right">Début</th>
                          {Array.from({ length: 11 }, (_, i) => <th key={i} className="px-3 py-2.5 text-right">An {i + 1}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {toutesLesDettes.map((p, pi) => (
                          <tr key={p.id} className={pi % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="px-3 py-2 font-medium text-slate-700">{p.label}</td>
                            <td className="px-3 py-2 text-right font-mono">{eur(p.montant)}</td>
                            <td className="px-3 py-2 text-right font-mono text-[#1A3A52] font-semibold">{eur(p.annuite || p.annuiteCalc)}</td>
                            <td className="px-3 py-2 text-right">An {p.anneeDebut}</td>
                            {Array.from({ length: 11 }, (_, i) => {
                              const off = (i + 1) - p.anneeDebut;
                              const actif = off >= 0 && off < p.duree;
                              const ann = p.annuite || p.annuiteCalc;
                              return <td key={i} className={`px-3 py-2 text-right font-mono ${actif ? 'text-red-700' : 'text-slate-300'}`}>{actif ? eur(ann) : '—'}</td>;
                            })}
                          </tr>
                        ))}
                        <tr className="bg-[#C9A961]/10 font-bold">
                          <td className="px-3 py-2 text-slate-800">TOTAL Excel</td>
                          <td className="px-3 py-2 text-right font-mono">{eur(DETTES_EXCEL.reduce((s,p)=>s+p.montant,0))}</td>
                          <td></td><td></td>
                          {Array.from({ length: 11 }, (_, i) => (
                            <td key={i} className="px-3 py-2 text-right font-mono text-[#1A3A52]">{eur(BP.serviceDette[i])}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tableaux d'amortissement accordéon */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Tableaux d'Amortissement Détaillés (données exactes Excel)</h3>
                  <div className="space-y-2">
                    {DETTES_EXCEL.map(p => {
                      const isOpen = detteOuverte === p.id;
                      return (
                        <div key={p.id} className="border border-slate-200 rounded-xl overflow-hidden">
                          <button onClick={() => setDetteOuverte(isOpen ? null : p.id)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <span className="font-bold text-[#1A3A52]">{p.label}</span>
                              <span className="text-slate-500">Montant : <strong className="text-slate-800">{eur(p.montant)}</strong></span>
                              <span className="text-slate-500">Annuité : <strong className="text-[#1A3A52]">{eur(p.annuite)}/an</strong></span>
                              <span className="text-slate-500">Démarrage : <strong>An {p.anneeDebut}</strong></span>
                              <span className="text-slate-500">Total intérêts : <strong className="text-red-600">{eur(p.totalInterets)}</strong></span>
                            </div>
                            <span className="text-slate-400 flex items-center gap-1 text-xs ml-4">
                              {isOpen ? <><ChevronUp className="h-4 w-4" /> Masquer</> : <><ChevronDown className="h-4 w-4" /> Détail</>}
                            </span>
                          </button>
                          {isOpen && (
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-[#1A3A52] text-white">
                                    <th className="px-3 py-2 text-left">Année</th>
                                    <th className="px-3 py-2 text-right">K Début</th>
                                    <th className="px-3 py-2 text-right">Annuité</th>
                                    <th className="px-3 py-2 text-right">Intérêts</th>
                                    <th className="px-3 py-2 text-right">Capital remboursé</th>
                                    <th className="px-3 py-2 text-right">K Fin</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {p.rows.map((r, ri) => (
                                    <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                      <td className="px-3 py-1.5 font-medium">{2026 + p.anneeDebut + ri}</td>
                                      <td className="px-3 py-1.5 text-right font-mono">{eur(r[0])}</td>
                                      <td className="px-3 py-1.5 text-right font-mono text-[#1A3A52] font-semibold">{eur(r[1])}</td>
                                      <td className="px-3 py-1.5 text-right font-mono text-red-700">{eur(r[2])}</td>
                                      <td className="px-3 py-1.5 text-right font-mono text-emerald-700">{eur(r[3])}</td>
                                      <td className="px-3 py-1.5 text-right font-mono">{eur(r[4])}</td>
                                    </tr>
                                  ))}
                                  <tr className="bg-[#C9A961]/10 font-bold">
                                    <td className="px-3 py-1.5">TOTAL</td>
                                    <td></td>
                                    <td className="px-3 py-1.5 text-right font-mono">{eur(p.totalAnnuites)}</td>
                                    <td className="px-3 py-1.5 text-right font-mono text-red-700">{eur(p.totalInterets)}</td>
                                    <td className="px-3 py-1.5 text-right font-mono text-emerald-700">{eur(p.totalCapital)}</td>
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

                {/* Prêts personnalisés */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-700">Simuler un Prêt Supplémentaire</h3>
                    <Button size="sm" onClick={addDette} className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white text-xs h-8 gap-1">
                      <Plus className="h-3.5 w-3.5" /> Ajouter un prêt
                    </Button>
                  </div>
                  {dettesUser.length === 0 && (
                    <p className="text-sm text-slate-400 italic">Aucun prêt additionnel. Cliquez sur "Ajouter" pour simuler un nouveau financement.</p>
                  )}
                  {dettesUser.map(p => {
                    const ann = p.montant > 0 && p.taux > 0 && p.duree > 0
                      ? p.montant * (p.taux * Math.pow(1 + p.taux, p.duree)) / (Math.pow(1 + p.taux, p.duree) - 1)
                      : 0;
                    return (
                      <div key={p.id} className="p-4 mb-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-3">
                          <input type="text" value={p.label} onChange={e => updateDette(p.id, 'label', e.target.value)}
                            className="text-sm font-semibold text-[#1A3A52] bg-transparent border-b border-dashed border-slate-300 focus:outline-none" />
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-[#C9A961]/20 text-amber-800 px-2 py-0.5 rounded-full">Annuité : {eur(ann)}/an</span>
                            <button onClick={() => removeDette(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-200"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          {[
                            { label: 'Montant (€)', key: 'montant', val: p.montant },
                            { label: 'Taux (%)', key: 'tauxPct', val: +(p.taux * 100).toFixed(2), isRate: true },
                            { label: 'Durée (ans)', key: 'duree', val: p.duree },
                            { label: 'Année début', key: 'anneeDebut', val: p.anneeDebut },
                          ].map(field => (
                            <div key={field.key} className="p-2 bg-white rounded-lg border border-slate-200">
                              <label className="block text-slate-500 mb-1">{field.label}</label>
                              <Input type="number" step="any" value={field.val}
                                onChange={e => {
                                  const v = parseFloat(e.target.value) || 0;
                                  updateDette(p.id, field.isRate ? 'taux' : field.key, field.isRate ? v / 100 : v);
                                }}
                                className="h-7 text-sm font-semibold border-0 p-0 focus-visible:ring-0" />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── GRAPHIQUES ── */}
            {activeTab === 'graphiques' && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Évolution Parc, Valeur Nette & Trésorerie (€)</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                        <Tooltip formatter={v => eur(v)} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Line type="monotone" dataKey="Parc Brut" stroke="#1A3A52" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="Valeur Nette" stroke="#C9A961" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="Tréso Cumulée" stroke="#10b981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">TRI Net par Scénario de Sortie</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={triData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} domain={[0, 14]} />
                        <Tooltip formatter={(v, name) => name === 'TRI %' ? `${v} %` : eur(v)} />
                        <ReferenceLine y={6.5} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Hurdle 6,5%', position: 'insideTopRight', fontSize: 10, fill: '#ef4444' }} />
                        <Bar dataKey="TRI %" fill="#C9A961" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Revenus Locatifs vs Service Dette (€)</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                        <Tooltip formatter={v => eur(v)} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="Revenus Loc." fill="#1A3A52" radius={[4,4,0,0]} />
                        <Bar dataKey="Service Dette" fill="#C9A961" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">DSCR (loyer brut) & LTC %</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <ReferenceLine y={1.2} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Min 1.2x', fontSize: 10 }} />
                        <Line type="monotone" dataKey="DSCR Brut" stroke="#C9A961" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="LTC %" stroke="#1A3A52" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Résumé CMPC */}
                <div className="bg-slate-800 rounded-xl p-5 text-white grid md:grid-cols-4 gap-4">
                  <div><p className="text-xs text-white/50 mb-1">CMPC</p><p className="text-xl font-bold text-[#C9A961]">4,00 %</p></div>
                  <div><p className="text-xs text-white/50 mb-1">Coût fonds propres</p><p className="text-xl font-bold">6,50 % × 22%</p></div>
                  <div><p className="text-xs text-white/50 mb-1">Coût de la dette</p><p className="text-xl font-bold">3,30 % × 78%</p></div>
                  <div><p className="text-xs text-white/50 mb-1">Total capital levé (dettes)</p><p className="text-xl font-bold">{eur(DETTES_EXCEL.reduce((s,p)=>s+p.montant,0))}</p></div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}