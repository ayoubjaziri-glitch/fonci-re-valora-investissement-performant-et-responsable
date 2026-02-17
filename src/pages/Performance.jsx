import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Percent, 
  Building2, 
  PiggyBank,
  ArrowRight,
  CheckCircle2,
  Calculator,
  Shield,
  Handshake,
  Trophy
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function Performance() {
  const projectionData = [
    { year: '2026', value: 10000, label: 'Départ' },
    { year: '2027', value: 11000, label: '+10%' },
    { year: '2028', value: 12100, label: '+21%' },
    { year: '2029', value: 13310, label: '+33%' },
    { year: '2030', value: 14641, label: '+46%' },
    { year: '2031', value: 16489, label: '+61%' }
  ];

  const triProgression = [
    { assets: "1,25 M€", tri: "10%", year: "2026" },
    { assets: "2,5 M€", tri: "14%", year: "2027" },
    { assets: "5 M€", tri: "24%", year: "2028" },
    { assets: "10 M€", tri: "34%", year: "2029" },
    { assets: "15 M€", tri: "41%", year: "2030" },
    { assets: "20 M€", tri: "44%", year: "2031" }
  ];

  const financialDetails = [
    { label: "Valeur de l'actif immobilier", value: "1 250 000 €" },
    { label: "Apport fonds propres (levée)", value: "250 000 € (20%)" },
    { label: "Crédit bancaire", value: "1 000 000 € (80%)" },
    { label: "Durée / Taux du crédit", value: "15 ans / 3,7%" },
    { label: "Loyers bruts (10%)", value: "125 000 €/an" },
    { label: "Loyers nets (9%)", value: "112 500 €/an" }
  ];

  const valueCreation = [
    { icon: Building2, title: "Revenus locatifs nets", value: "562 500 €", desc: "112 500 €/an × 5 ans" },
    { icon: TrendingUp, title: "Amortissement crédit", value: "274 929 €", desc: "Enrichissement fonds propres" },
    { icon: PiggyBank, title: "Appréciation actif", value: "+96 605 €", desc: "Valeur an 5 : 1 346 605 €" }
  ];

  const comparatif = [
    {
      title: "SCPI Traditionnelles",
      color: "gray",
      items: [
        { label: "Frais d'entrée", value: "8–12%", negative: true },
        { label: "Frais de gestion", value: "10–15% HT/an", negative: true },
        { label: "Frais de sortie", value: "Jusqu'à 5%", negative: true },
        { label: "Rendement net typique", value: "3–4%/an", neutral: true }
      ]
    },
    {
      title: "La Foncière Patrimoniale",
      color: "gold",
      highlight: true,
      items: [
        { label: "Frais d'entrée", value: "0 €", positive: true },
        { label: "Frais de gestion", value: "0 € fixe", positive: true },
        { label: "Loyers nets", value: "9% NET", positive: true },
        { label: "Amortissement prêt", value: "+5,11%/an", positive: true }
      ]
    },
    {
      title: "Gestion en Direct",
      color: "gray",
      items: [
        { label: "Temps investi", value: "Très élevé", negative: true },
        { label: "Expertise requise", value: "Technique", negative: true },
        { label: "Coûts cachés", value: "Nombreux", negative: true },
        { label: "Risques", value: "Non mutualisés", negative: true }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-[#1E3A5F] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-80 h-80 border border-white/20 rounded-full" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                Performance
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Un modèle 100% aligné
            </h1>
            <p className="text-xl text-white/70">
              0€ de frais initiaux. 100% de votre apport investi dans l'actif. 
              Rémunération uniquement indexée sur la performance réelle.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm"
            >
              <p className="text-sm text-gray-500 mb-2">Actif immobilier</p>
              <p className="text-2xl font-bold text-[#1E3A5F]">1 250 000 €</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm"
            >
              <p className="text-sm text-gray-500 mb-2">Effet de levier</p>
              <p className="text-2xl font-bold text-[#C9A961]">x5</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm"
            >
              <p className="text-sm text-gray-500 mb-2">TRI net</p>
              <p className="text-2xl font-bold text-[#1E3A5F]">10,5% / an</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm"
            >
              <p className="text-sm text-gray-500 mb-2">Horizon</p>
              <p className="text-2xl font-bold text-[#1E3A5F]">5 ans</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-[#C9A961]" />
                <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                  Projection
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-[#1E3A5F] mb-6">
                Évolution de votre capital
              </h2>
              <p className="text-gray-600 mb-8">
                Exemple concret : 10 000 € investis lors de la première levée de fonds.
              </p>
              
              <div className="bg-[#1E3A5F] rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-white/60 text-sm">Départ</p>
                    <p className="text-2xl font-bold text-white">10 000 €</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Année 5</p>
                    <p className="text-2xl font-bold text-[#C9A961]">16 489 €</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Gain</p>
                    <p className="text-2xl font-bold text-[#C9A961]">+64,9%</p>
                  </div>
                </div>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A961" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#C9A961" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="year" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" tickFormatter={(value) => `${(value/1000).toFixed(0)}k€`} />
                    <Tooltip 
                      formatter={(value) => [`${value.toLocaleString()} €`, 'Valeur']}
                      contentStyle={{ backgroundColor: '#1E3A5F', border: 'none', borderRadius: '8px', color: 'white' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#C9A961" strokeWidth={3} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-serif text-[#1E3A5F] mb-6">Triple mécanisme de création de valeur</h3>
              <div className="space-y-4">
                {valueCreation.map((item, index) => (
                  <div key={index} className="flex gap-4 p-5 bg-[#F8F9FA] rounded-2xl">
                    <div className="w-14 h-14 bg-[#1E3A5F] rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-7 w-7 text-[#C9A961]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1E3A5F]">{item.title}</h4>
                      <p className="text-xl font-bold text-[#C9A961]">{item.value}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Alignment Model */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[#1E3A5F] mb-4">
              Alignement total des intérêts
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un modèle de rémunération unique qui garantit la convergence totale de nos intérêts avec votre réussite patrimoniale.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 text-center border border-gray-100"
            >
              <div className="w-16 h-16 bg-[#1E3A5F] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Handshake className="h-8 w-8 text-[#C9A961]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-3">Nous créons de la valeur ensemble</h3>
              <p className="text-gray-600 text-sm">
                Plus-values réalisées + Remboursement du prêt + Capitalisation intégrale des flux = Patrimoine valorisé
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#C9A961] rounded-3xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-[#1E3A5F] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-8 w-8 text-[#C9A961]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-3">Nous partageons cette réussite</h3>
              <p className="text-[#1E3A5F]/80 text-sm">
                Sur la valeur créée au-delà d'un rendement de 6,5%/an
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 text-center border border-gray-100"
            >
              <div className="w-16 h-16 bg-[#1E3A5F] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-[#C9A961]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-3">Nous gagnons ensemble</h3>
              <p className="text-gray-600 text-sm">
                Zéro frais initiaux, rémunération progressive alignée sur la performance du parc.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-[#1E3A5F] rounded-2xl p-8 text-center"
          >
            <p className="text-white/80 mb-2">Notre rémunération est alignée avec votre réussite.</p>
            <p className="text-white font-semibold text-lg">
              Le carried interest s'applique exclusivement à la surperformance au-delà d'un seuil de rendement annuel de <span className="text-[#C9A961]">6,5%</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Comparatif */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[#1E3A5F] mb-4">
              Comparatif — 3 modèles d'investissement
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {comparatif.map((model, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-3xl p-6 ${model.highlight ? 'bg-[#C9A961] ring-4 ring-[#C9A961]/30' : 'bg-white border border-gray-200'}`}
              >
                <h3 className={`text-lg font-semibold text-center mb-6 ${model.highlight ? 'text-[#1E3A5F]' : 'text-[#1E3A5F]'}`}>
                  {model.title}
                </h3>
                <div className="space-y-4">
                  {model.items.map((item, idx) => (
                    <div key={idx} className={`flex justify-between items-center p-3 rounded-lg ${model.highlight ? 'bg-white/20' : 'bg-gray-50'}`}>
                      <span className={`text-sm ${model.highlight ? 'text-[#1E3A5F]' : 'text-gray-600'}`}>{item.label}</span>
                      <span className={`font-semibold ${
                        item.positive ? 'text-green-600' : 
                        item.negative ? 'text-red-500' : 
                        model.highlight ? 'text-[#1E3A5F]' : 'text-[#1E3A5F]'
                      }`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fiscal */}
      <section className="py-24 bg-[#1E3A5F]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-[#C9A961]" />
                <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                  Optimisation fiscale
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                Éligibilité PEA-PME
              </h2>
              <p className="text-white/70 mb-6">
                La détention des actions sur une période minimale de 5 ans permet l'éligibilité 
                au dispositif PEA-PME avec exonération d'impôt sur le revenu (12,8%) sur les gains capitalisés.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="h-5 w-5 text-[#C9A961]" />
                  Exonération d'impôt sur le revenu (12,8%)
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="h-5 w-5 text-[#C9A961]" />
                  Plus-values et dividendes réinvestis exonérés
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="h-5 w-5 text-[#C9A961]" />
                  Avantage fiscal lors de la sortie
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                <p className="text-white/60 text-sm mb-2">Régime Standard</p>
                <p className="text-4xl font-bold text-white mb-2">30%</p>
                <p className="text-white/60 text-sm">Flat Tax (PFU)</p>
              </div>
              <div className="bg-[#C9A961] rounded-2xl p-6 text-center">
                <p className="text-[#1E3A5F]/70 text-sm mb-2">Avec PEA-PME</p>
                <p className="text-4xl font-bold text-[#1E3A5F] mb-2">17,2%</p>
                <p className="text-[#1E3A5F]/70 text-sm">Prélèvements sociaux</p>
                <div className="mt-4 bg-[#1E3A5F] rounded-lg py-2 px-4">
                  <p className="text-[#C9A961] text-sm font-semibold">Économie 12,8%</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#C9A961]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-[#1E3A5F] mb-4">
            Prêt à investir dans l'immobilier de demain ?
          </h2>
          <p className="text-[#1E3A5F]/80 mb-8">
            Rejoignez une communauté d'associés alignés et créez de la valeur ensemble.
          </p>
          <Link to={createPageUrl("Contact")}>
            <Button className="bg-[#1E3A5F] hover:bg-[#2A4A6F] text-white px-8 py-6">
              Devenir associé
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}