import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
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
  Trophy,
  BarChart3,
  Activity,
  Eye,
  Users,
  Clock
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import InvestmentSimulator from "../components/InvestmentSimulator";
import { base44 } from "@/api/base44Client";

export default function Performance() {
  const [activeTab, setActiveTab] = useState('projection');
  
  // Track page view
  useEffect(() => {
    base44.analytics.track({
      eventName: "performance_page_viewed",
      properties: { timestamp: new Date().toISOString() }
    });
  }, []);

  const handleSimulatorInteraction = () => {
    base44.analytics.track({
      eventName: "simulator_interaction",
      properties: { page: "performance" }
    });
  };

  const handleCtaClick = (ctaName) => {
    base44.analytics.track({
      eventName: "cta_clicked",
      properties: { cta_name: ctaName, page: "performance" }
    });
  };

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

  // Advanced Analytics Data
  const portfolioAllocation = [
    { name: 'Lyon', value: 35, color: '#3b82f6' },
    { name: 'Vichy', value: 25, color: '#10b981' },
    { name: 'Bordeaux', value: 25, color: '#8b5cf6' },
    { name: 'Clermont', value: 15, color: '#f59e0b' }
  ];

  const monthlyPerformance = [
    { month: 'Jan', loyers: 9375, charges: 2500, net: 6875 },
    { month: 'Fév', loyers: 9375, charges: 2300, net: 7075 },
    { month: 'Mar', loyers: 9375, charges: 2400, net: 6975 },
    { month: 'Avr', loyers: 9375, charges: 2200, net: 7175 },
    { month: 'Mai', loyers: 9375, charges: 2100, net: 7275 },
    { month: 'Juin', loyers: 9375, charges: 2000, net: 7375 }
  ];

  const kpiMetrics = [
    { label: "Taux d'occupation", value: "98%", trend: "+2%", icon: Building2, color: "emerald" },
    { label: "Rendement brut", value: "10%", trend: "stable", icon: Percent, color: "blue" },
    { label: "Cash-on-cash", value: "45%", trend: "+5%", icon: TrendingUp, color: "emerald" },
    { label: "LTV actuel", value: "76%", trend: "-4%", icon: BarChart3, color: "blue" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
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
              <div className="w-12 h-1 bg-blue-500" />
              <span className="text-blue-400 font-medium tracking-wider uppercase text-sm">
                Performance
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Un modèle 100% aligné
            </h1>
            <p className="text-xl text-white/70">
              0€ de frais initiaux. 100% de votre souscription investie dans les actifs. 
              Rémunération uniquement indexée sur la performance réelle du portefeuille.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm"
            >
              <p className="text-sm text-slate-500 mb-2">Actifs sous gestion</p>
              <p className="text-2xl font-bold text-slate-900">1 250 000 €</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm"
            >
              <p className="text-sm text-slate-500 mb-2">Effet de levier</p>
              <p className="text-2xl font-bold text-blue-600">x5</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm"
            >
              <p className="text-sm text-slate-500 mb-2">TRI net cible</p>
              <p className="text-2xl font-bold text-emerald-600">10,5% / an</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm"
            >
              <p className="text-sm text-slate-500 mb-2">Horizon recommandé</p>
              <p className="text-2xl font-bold text-slate-900">5 ans</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-emerald-500" />
                <span className="text-emerald-600 font-medium tracking-wider uppercase text-sm">
                  Projection
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                Évolution de votre capital
              </h2>
              <p className="text-slate-600 mb-8">
                Exemple concret : 10 000 € investis lors de la première levée de fonds.
              </p>
              
              <div className="bg-slate-900 rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-white/60 text-sm">Souscription</p>
                    <p className="text-2xl font-bold text-white">10 000 €</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Année 5</p>
                    <p className="text-2xl font-bold text-blue-400">16 489 €</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Performance</p>
                    <p className="text-2xl font-bold text-emerald-400">+64,9%</p>
                  </div>
                </div>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="year" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" tickFormatter={(value) => `${(value/1000).toFixed(0)}k€`} />
                    <Tooltip 
                      formatter={(value) => [`${value.toLocaleString()} €`, 'Valeur']}
                      contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: 'white' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-serif text-slate-900 mb-6">Triple mécanisme de création de valeur</h3>
              <div className="space-y-4">
                {valueCreation.map((item, index) => (
                  <div key={index} className="flex gap-4 p-5 bg-slate-50 rounded-2xl">
                    <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-7 w-7 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{item.title}</h4>
                      <p className="text-xl font-bold text-emerald-600">{item.value}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Alignment Model */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
              Alignement total des intérêts
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Un modèle de rémunération unique qui garantit la convergence totale de nos intérêts avec votre réussite patrimoniale.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 text-center border border-slate-200"
            >
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Handshake className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Nous créons de la valeur ensemble</h3>
              <p className="text-slate-600 text-sm">
                Plus-values réalisées + Remboursement du prêt + Capitalisation intégrale des flux = Patrimoine valorisé
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-emerald-500 rounded-3xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Nous partageons cette réussite</h3>
              <p className="text-emerald-100 text-sm">
                Sur la valeur créée au-delà d'un rendement de 6,5%/an
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 text-center border border-slate-200"
            >
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Nous gagnons ensemble</h3>
              <p className="text-slate-600 text-sm">
                Zéro frais initiaux, rémunération progressive alignée sur la performance du parc.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-slate-900 rounded-2xl p-8 text-center"
          >
            <p className="text-white/80 mb-2">Notre rémunération est alignée avec votre réussite.</p>
            <p className="text-white font-semibold text-lg">
              Le carried interest s'applique exclusivement à la surperformance au-delà d'un seuil de rendement annuel de <span className="text-emerald-400">6,5%</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Comparatif */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
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
                className={`rounded-3xl p-6 ${model.highlight ? 'bg-blue-600 ring-4 ring-blue-600/30' : 'bg-white border border-slate-200'}`}
              >
                <h3 className={`text-lg font-semibold text-center mb-6 ${model.highlight ? 'text-white' : 'text-slate-900'}`}>
                  {model.title}
                </h3>
                <div className="space-y-4">
                  {model.items.map((item, idx) => (
                    <div key={idx} className={`flex justify-between items-center p-3 rounded-lg ${model.highlight ? 'bg-white/20' : 'bg-slate-50'}`}>
                      <span className={`text-sm ${model.highlight ? 'text-white' : 'text-slate-600'}`}>{item.label}</span>
                      <span className={`font-semibold ${
                        item.positive ? (model.highlight ? 'text-emerald-300' : 'text-emerald-600') : 
                        item.negative ? 'text-red-500' : 
                        model.highlight ? 'text-white' : 'text-slate-900'
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
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-blue-400" />
                <span className="text-blue-400 font-medium tracking-wider uppercase text-sm">
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
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  Exonération d'impôt sur le revenu (12,8%)
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  Plus-values et dividendes réinvestis exonérés
                </li>
                <li className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
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
              <div className="bg-emerald-500 rounded-2xl p-6 text-center">
                <p className="text-emerald-100 text-sm mb-2">Avec PEA-PME</p>
                <p className="text-4xl font-bold text-white mb-2">17,2%</p>
                <p className="text-emerald-100 text-sm">Prélèvements sociaux</p>
                <div className="mt-4 bg-slate-900 rounded-lg py-2 px-4">
                  <p className="text-emerald-400 text-sm font-semibold">Économie 12,8%</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advanced Analytics Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-1 bg-emerald-500" />
              <span className="text-emerald-600 font-medium tracking-wider uppercase text-sm">
                Analytics avancées
              </span>
              <div className="w-12 h-1 bg-emerald-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
              Suivi en temps réel du portefeuille
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Accédez à des indicateurs de performance détaillés et suivez l'évolution 
              de vos investissements en toute transparence.
            </p>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {kpiMetrics.map((kpi, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <kpi.icon className={`h-6 w-6 ${kpi.color === 'emerald' ? 'text-emerald-500' : 'text-blue-500'}`} />
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    kpi.trend.includes('+') ? 'bg-emerald-100 text-emerald-700' : 
                    kpi.trend.includes('-') ? 'bg-blue-100 text-blue-700' : 
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {kpi.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-1">{kpi.value}</p>
                <p className="text-sm text-slate-500">{kpi.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Portfolio Allocation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 rounded-2xl p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-6">Répartition géographique</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {portfolioAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Monthly Performance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 rounded-2xl p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-6">Performance mensuelle (€)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: 'white' }}
                    />
                    <Bar dataKey="loyers" fill="#3b82f6" name="Loyers" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="net" fill="#10b981" name="Net" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Live Stats Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-white font-medium">Données actualisées en temps réel</span>
              </div>
              <div className="flex items-center gap-6 text-white/70 text-sm">
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Reporting mensuel
                </span>
                <span className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Alertes automatiques
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Maj: {new Date().toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Simulator Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-1 bg-blue-600" />
              <span className="text-blue-600 font-medium tracking-wider uppercase text-sm">
                Simulateur
              </span>
              <div className="w-12 h-1 bg-blue-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
              Projetez la valorisation de vos parts
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Utilisez notre simulateur pour estimer la valorisation de votre souscription 
              sur la durée de détention souhaitée.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto" onClick={handleSimulatorInteraction}>
            <InvestmentSimulator />
          </div>
        </div>
      </section>

      {/* Engagement CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-serif text-white mb-4">
              Prêt à investir dans l'immobilier de demain ?
            </h2>
            <p className="text-blue-100 mb-8">
              Rejoignez une communauté d'associés alignés et participez à la création de valeur patrimoniale.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={createPageUrl("Contact")} onClick={() => handleCtaClick('devenir_associe')}>
                <Button className="bg-white hover:bg-slate-100 text-blue-700 px-8 py-6">
                  Devenir associé
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={createPageUrl("Realisations")} onClick={() => handleCtaClick('voir_actifs')}>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6">
                  Voir nos actifs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}