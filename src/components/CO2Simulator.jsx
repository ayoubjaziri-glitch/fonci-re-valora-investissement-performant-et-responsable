import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Slider } from "@/components/ui/slider";
import { Zap, Leaf, Thermometer, TrendingDown, BarChart3, ArrowRight, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Cell } from 'recharts';

// DPE data: kWhEP/m²/an (énergie primaire) et kgCO2eq/m²/an
const DPE_DATA = {
  G: { label: 'G', minEP: 420, co2: 115, color: '#8B0000', bgColor: '#FEE2E2' },
  F: { label: 'F', minEP: 331, co2: 85,  color: '#DC2626', bgColor: '#FEE2E2' },
  E: { label: 'E', minEP: 251, co2: 60,  color: '#F97316', bgColor: '#FFEDD5' },
  D: { label: 'D', minEP: 181, co2: 35,  color: '#EAB308', bgColor: '#FEF9C3' },
  C: { label: 'C', minEP: 111, co2: 16,  color: '#22C55E', bgColor: '#DCFCE7' },
  B: { label: 'B', minEP: 71,  co2: 7,   color: '#16A34A', bgColor: '#DCFCE7' },
  A: { label: 'A', minEP: 50,  co2: 2.5, color: '#15803D', bgColor: '#DCFCE7' },
};

const DPE_ORDER = ['G', 'F', 'E', 'D', 'C', 'B', 'A'];

// Coût énergie moyen en France (€/kWh énergie primaire, mix)
const COUT_KWH = 0.13;
// Arbres nécessaires pour absorber 1 tonne CO2/an
const ARBRES_PAR_TONNE = 40;
// Km voiture par kgCO2
const KM_PAR_KG_CO2 = 6.5;

function DpeSelector({ label, value, onChange }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-600 mb-3">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {DPE_ORDER.map(dpe => (
          <button
            key={dpe}
            onClick={() => onChange(dpe)}
            className={`w-11 h-11 rounded-xl font-bold text-sm transition-all border-2 ${
              value === dpe
                ? 'scale-110 shadow-lg border-transparent text-white'
                : 'border-transparent text-slate-700 bg-slate-100 hover:bg-slate-200'
            }`}
            style={value === dpe ? { backgroundColor: DPE_DATA[dpe].color } : {}}
          >
            {dpe}
          </button>
        ))}
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, unit, sub, color = '#C9A961', highlight = false }) {
  return (
    <div className={`rounded-2xl p-5 border ${highlight ? 'bg-[#1A3A52] border-[#1A3A52] text-white' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: highlight ? 'rgba(201,169,97,0.2)' : '#f1f5f9' }}>
          <Icon className="h-5 w-5" style={{ color: highlight ? '#C9A961' : color }} />
        </div>
        <p className={`text-xs font-medium ${highlight ? 'text-white/70' : 'text-slate-500'}`}>{label}</p>
      </div>
      <p className={`text-3xl font-bold ${highlight ? 'text-white' : 'text-[#1A3A52]'}`}>
        {value}
        <span className="text-base font-normal ml-1" style={{ color: highlight ? '#C9A961' : '#64748b' }}>{unit}</span>
      </p>
      {sub && <p className={`text-xs mt-1 ${highlight ? 'text-white/60' : 'text-slate-400'}`}>{sub}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A3A52] text-white px-4 py-3 rounded-xl shadow-xl text-sm">
        <p className="font-semibold mb-1">DPE {label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name} : <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CO2Simulator() {
  const [surface, setSurface] = useState(200);
  const [dpeAvant, setDpeAvant] = useState('F');
  const [dpeApres, setDpeApres] = useState('C');

  const idx_avant = DPE_ORDER.indexOf(dpeAvant);
  const idx_apres = DPE_ORDER.indexOf(dpeApres);
  const isValid = idx_apres > idx_avant; // amélioration

  const calc = useMemo(() => {
    const avant = DPE_DATA[dpeAvant];
    const apres = DPE_DATA[dpeApres];

    const ep_avant = avant.minEP * surface;    // kWh/an
    const ep_apres = apres.minEP * surface;
    const ep_economie = ep_avant - ep_apres;

    const co2_avant = avant.co2 * surface;     // kgCO2/an
    const co2_apres = apres.co2 * surface;
    const co2_economie = co2_avant - co2_apres;

    const cout_avant = ep_avant * COUT_KWH;
    const cout_apres = ep_apres * COUT_KWH;
    const cout_economie = cout_avant - cout_apres;

    const arbres = Math.round((co2_economie / 1000) * ARBRES_PAR_TONNE);
    const km_voiture = Math.round(co2_economie * KM_PAR_KG_CO2);

    const pct_ep = ep_avant > 0 ? Math.round((ep_economie / ep_avant) * 100) : 0;
    const pct_co2 = co2_avant > 0 ? Math.round((co2_economie / co2_avant) * 100) : 0;

    return { ep_avant, ep_apres, ep_economie, co2_avant, co2_apres, co2_economie, cout_avant, cout_apres, cout_economie, arbres, km_voiture, pct_ep, pct_co2 };
  }, [surface, dpeAvant, dpeApres]);

  const chartData = DPE_ORDER.map(dpe => ({
    dpe,
    'CO₂ (kg/m²/an)': DPE_DATA[dpe].co2,
    'Énergie (kWhEP/10)': Math.round(DPE_DATA[dpe].minEP / 10),
    fill: DPE_DATA[dpe].color,
  }));

  const scenariosRapides = [
    { label: 'Passoire → Décent', av: 'F', ap: 'C', desc: 'Rénovation standard' },
    { label: 'Passoire → Excellent', av: 'F', ap: 'A', desc: 'Rénovation globale' },
    { label: 'Médiocre → Performant', av: 'E', ap: 'B', desc: 'Rénovation avancée' },
    { label: 'Très mauvais → Décent', av: 'G', ap: 'C', desc: 'Réhabilitation complète' },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-1 bg-[#C9A961]" />
            <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">Outil interactif</span>
            <div className="w-12 h-1 bg-[#C9A961]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
            Simulateur d'Impact Énergétique & CO₂
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Estimez les économies d'énergie et la réduction des émissions CO₂ lors d'une réhabilitation. 
            Ajustez la surface et les classes DPE pour simuler différents scénarios.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Panneau de contrôle */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Surface */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-[#1A3A52] mb-5 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#C9A961]" /> Paramètres de simulation
              </h3>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-600">Surface habitable</label>
                  <span className="text-lg font-bold text-[#1A3A52]">{surface} m²</span>
                </div>
                <Slider
                  value={[surface]}
                  onValueChange={([v]) => setSurface(v)}
                  min={50} max={2000} step={10}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>50 m²</span><span>2 000 m²</span>
                </div>
              </div>

              <DpeSelector label="DPE avant travaux" value={dpeAvant} onChange={setDpeAvant} />
              <div className="my-4 flex items-center gap-2 text-slate-400">
                <div className="flex-1 h-px bg-slate-200" />
                <ArrowRight className="h-4 w-4" />
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              <DpeSelector label="DPE après travaux" value={dpeApres} onChange={setDpeApres} />

              {!isValid && (
                <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">Sélectionnez un DPE après travaux meilleur que le DPE initial.</p>
                </div>
              )}
            </div>

            {/* Scénarios rapides */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-[#1A3A52] mb-4 text-sm">⚡ Scénarios rapides</h3>
              <div className="space-y-2">
                {scenariosRapides.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { setDpeAvant(s.av); setDpeApres(s.ap); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                      dpeAvant === s.av && dpeApres === s.ap
                        ? 'bg-[#1A3A52] text-white border-[#1A3A52]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#C9A961]'
                    }`}
                  >
                    <span className="font-semibold">{s.av} → {s.ap}</span>
                    <span className={`text-xs ml-2 ${dpeAvant === s.av && dpeApres === s.ap ? 'text-white/70' : 'text-slate-400'}`}>
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Résultats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {isValid ? (
              <>
                {/* KPIs principaux */}
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard
                    icon={Leaf}
                    label="Réduction CO₂"
                    value={Math.round(calc.co2_economie).toLocaleString('fr-FR')}
                    unit="kg/an"
                    sub={`−${calc.pct_co2}% des émissions`}
                    highlight
                  />
                  <MetricCard
                    icon={Zap}
                    label="Économie d'énergie"
                    value={Math.round(calc.ep_economie / 1000).toLocaleString('fr-FR')}
                    unit="MWh/an"
                    sub={`−${calc.pct_ep}% de consommation`}
                  />
                  <MetricCard
                    icon={TrendingDown}
                    label="Économie financière"
                    value={Math.round(calc.cout_economie).toLocaleString('fr-FR')}
                    unit="€/an"
                    sub={`avant → après : ${Math.round(calc.cout_avant).toLocaleString('fr-FR')} → ${Math.round(calc.cout_apres).toLocaleString('fr-FR')} €`}
                  />
                  <MetricCard
                    icon={Thermometer}
                    label="Équivalent arbres plantés"
                    value={calc.arbres.toLocaleString('fr-FR')}
                    unit="arbres"
                    sub="pour absorber le CO₂ économisé"
                    color="#16A34A"
                  />
                </div>

                {/* Comparaison avant / après */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <h4 className="font-semibold text-[#1A3A52] mb-5">Comparaison Avant / Après</h4>
                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    {/* Avant */}
                    <div className="rounded-2xl p-4" style={{ backgroundColor: DPE_DATA[dpeAvant].bgColor }}>
                      <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-black mb-2" style={{ backgroundColor: DPE_DATA[dpeAvant].color }}>
                        {dpeAvant}
                      </div>
                      <p className="text-xs text-slate-500 mb-1">Avant travaux</p>
                      <p className="font-bold text-slate-800">{DPE_DATA[dpeAvant].minEP} kWhEP/m²</p>
                      <p className="text-sm text-slate-600">{DPE_DATA[dpeAvant].co2} kgCO₂/m²</p>
                    </div>

                    {/* Flèche + gain */}
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ArrowRight className="h-8 w-8 text-[#C9A961]" />
                      <div className="bg-emerald-100 text-emerald-700 rounded-xl px-3 py-1 text-xs font-bold">
                        −{calc.pct_co2}% CO₂
                      </div>
                      <div className="bg-blue-100 text-blue-700 rounded-xl px-3 py-1 text-xs font-bold">
                        −{calc.pct_ep}% énergie
                      </div>
                    </div>

                    {/* Après */}
                    <div className="rounded-2xl p-4" style={{ backgroundColor: DPE_DATA[dpeApres].bgColor }}>
                      <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-black mb-2" style={{ backgroundColor: DPE_DATA[dpeApres].color }}>
                        {dpeApres}
                      </div>
                      <p className="text-xs text-slate-500 mb-1">Après travaux</p>
                      <p className="font-bold text-slate-800">{DPE_DATA[dpeApres].minEP} kWhEP/m²</p>
                      <p className="text-sm text-slate-600">{DPE_DATA[dpeApres].co2} kgCO₂/m²</p>
                    </div>
                  </div>

                  {/* Barre de progression CO2 */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Émissions CO₂ annuelles</span>
                      <span>{Math.round(calc.co2_avant).toLocaleString('fr-FR')} → {Math.round(calc.co2_apres).toLocaleString('fr-FR')} kg/an</span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full flex gap-1">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${100 - calc.pct_co2}%`, backgroundColor: DPE_DATA[dpeApres].color }}
                        />
                        <div
                          className="h-full rounded-full bg-slate-200 transition-all duration-700"
                          style={{ width: `${calc.pct_co2}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-slate-500">Émissions restantes</span>
                      <span className="text-emerald-600 font-semibold">Économie : {calc.pct_co2}%</span>
                    </div>
                  </div>

                  {/* Équivalent km voiture */}
                  <div className="mt-4 bg-slate-50 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">🚗</span>
                    <p className="text-sm text-slate-600">
                      Le CO₂ économisé équivaut à <strong className="text-[#1A3A52]">{calc.km_voiture.toLocaleString('fr-FR')} km</strong> parcourus en voiture thermique, évités chaque année.
                    </p>
                  </div>
                </div>

                {/* Graphique référentiel DPE */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <h4 className="font-semibold text-[#1A3A52] mb-1">Référentiel DPE — Émissions CO₂</h4>
                  <p className="text-xs text-slate-400 mb-5">kgCO₂eq/m²/an par classe énergétique</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={chartData} barSize={32}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="dpe" tick={{ fontSize: 12, fontWeight: 700 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="CO₂ (kg/m²/an)" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={entry.fill}
                            opacity={
                              entry.dpe === dpeAvant || entry.dpe === dpeApres ? 1 : 0.35
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-white rounded-3xl border border-slate-200 p-16 text-center">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Info className="h-10 w-10 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Sélectionnez vos paramètres</h3>
                <p className="text-slate-500">Choisissez un DPE après travaux meilleur que le DPE initial pour simuler les gains.</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Note méthodologique */}
        <div className="mt-8 bg-slate-100 rounded-2xl px-6 py-4 flex items-start gap-3">
          <Info className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500">
            <strong>Méthodologie :</strong> Simulation basée sur les seuils DPE RE2020 (kWhEP/m²/an) et les facteurs d'émission ADEME (kgCO₂eq/m²/an). 
            Coût énergétique estimé à 0,13 €/kWh. Les résultats sont indicatifs et dépendent des caractéristiques réelles du bâtiment, du mix énergétique et des conditions d'usage.
          </p>
        </div>
      </div>
    </section>
  );
}