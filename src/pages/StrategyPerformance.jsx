import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import {
  MapPin, Home, Percent, Tag, Building2, FileCheck, Clock, ArrowRight,
  Search, Landmark, Wrench, CalendarDays, CheckCircle2, XCircle,
  TrendingUp, PiggyBank, Shield, Handshake, Trophy, BarChart3 } from
'lucide-react';
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import InvestmentSimulator from "../components/InvestmentSimulator";
import { base44 } from "@/api/base44Client";

export default function StrategyPerformance() {
  useEffect(() => {
    base44.analytics.track({
      eventName: "strategy_performance_page_viewed",
      properties: { timestamp: new Date().toISOString() }
    });
  }, []);

  const strategyPoints = [
  { icon: Home, title: "Rénovation BBC", description: "DPE D–E transformé en A–B pour maximiser la valeur" },
  { icon: Percent, title: "Rendement 9%+ brut", description: "Objectif d'équilibre économique durable sur chaque actif" },
  { icon: Tag, title: "Décote à l'Achat", description: "−10% à −15% vs prix marché pour créer la valeur" },
  { icon: Building2, title: "Sourcing Off-Market", description: "Réseau de 45+ agents partenaires pour opportunités exclusives" },
  { icon: FileCheck, title: "Due Diligence", description: "Analyse multicritères, diagnostics complets, financement sécurisé" },
  { icon: Clock, title: "Horizon 5–6 ans", description: "Cycle de détention patrimonial avec arbitrages stratégiques" }];


  const contextItems = [
  { icon: Search, title: "Sélection des actifs", desc: "Identifier des immeubles à fort potentiel suppose une lecture fine des marchés, un réseau qualifié et une analyse multicritère approfondie." },
  { icon: Landmark, title: "Structuration du financement", desc: "L'intégration de l'effet de levier et la négociation de conditions adaptées nécessitent une ingénierie financière cohérente avec la trajectoire patrimoniale." },
  { icon: Wrench, title: "Conduite des réhabilitations", desc: "La rénovation BBC implique une coordination technique exigeante et un pilotage rigoureux des intervenants." },
  { icon: CalendarDays, title: "Exploitation locative", desc: "La gestion du patrimoine et le suivi administratif reposent sur une organisation opérationnelle structurée." }];


  const solutions = [
  { title: "Parcours d'investissement structuré", desc: "De l'acquisition à l'arbitrage, chaque étape du cycle immobilier est organisée dans une logique de gestion déléguée et de pilotage professionnel." },
  { title: "Processus structuré", desc: "Analyses approfondies, réhabilitations BBC, mise en exploitation locative et reporting régulier : une méthodologie pensée pour inscrire la valorisation dans la durée." },
  { title: "Structuration du financement", desc: "Recours maîtrisé à l'effet de levier et recherche de conditions bancaires adaptées à la stratégie patrimoniale." },
  { title: "Pilotage & transparence", desc: "Communication périodique, suivi des indicateurs clés et gouvernance favorisant une lecture claire de l'évolution du portefeuille." }];


  const zones = [
  { name: "Bordeaux", description: "Métropole dynamique avec forte demande locative" },
  { name: "Lyon", description: "2ème marché français, tension locative élevée" },
  { name: "Vichy", description: "Ville thermale en renouveau, rendements attractifs" },
  { name: "Clermont-Ferrand", description: "Bassin universitaire et économique stable" }];


  const projectionData = [
  { year: '2026', value: 10000 },
  { year: '2027', value: 11000 },
  { year: '2028', value: 12100 },
  { year: '2029', value: 13310 },
  { year: '2030', value: 14641 },
  { year: '2031', value: 16489 }];


  const valueCreation = [
  { icon: Building2, title: "Revenus locatifs nets", value: "562 500 €", desc: "112 500 €/an × 5 ans" },
  { icon: TrendingUp, title: "Amortissement crédit", value: "274 929 €", desc: "Enrichissement fonds propres" },
  { icon: PiggyBank, title: "Appréciation actif", value: "+96 605 €", desc: "Valeur an 5 : 1 346 605 €" }];


  const comparatif = [
  {
    title: "SCPI Traditionnelles",
    items: [
    { label: "Frais d'entrée", value: "8–12%", negative: true },
    { label: "Frais de gestion", value: "10–15% HT/an", negative: true },
    { label: "Rendement net typique", value: "3–4%/an", neutral: true }]

  },
  {
    title: "La Foncière Valora",
    highlight: true,
    items: [
    { label: "Frais d'entrée", value: "0 €", positive: true },
    { label: "Frais de gestion", value: "0 € fixe", positive: true },
    { label: "Loyers nets", value: "9% NET", positive: true }]

  },
  {
    title: "Gestion en Direct",
    items: [
    { label: "Temps investi", value: "Très élevé", negative: true },
    { label: "Expertise requise", value: "Technique", negative: true },
    { label: "Coûts cachés", value: "Nombreux", negative: true }]

  }];


  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-[#1A3A52] overflow-hidden">
        <div className="bg-slate-900 opacity-100 absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 border border-white/20 rounded-full" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                Stratégie & Performance
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Une approche structurée de l'investissement résidentiel
            </h1>
            <p className="text-xl text-white/70">
              Pilotage professionnel du cycle immobilier, de l'acquisition à l'arbitrage, 
              dans une logique de valorisation patrimoniale progressive.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Context / Solution */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 border border-gray-200">

              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Le Contexte</p>
                  <h3 className="text-slate-900 text-2xl font-serif">Les enjeux structurants</h3>
                </div>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                La valorisation durable d'un actif immobilier repose sur une approche globale mobilisant 
                des compétences complémentaires. Sans cette maîtrise transversale — financière, technique, 
                opérationnelle et patrimoniale — aucune stratégie de création de valeur ne peut s'inscrire dans le temps.
              </p>
              <div className="space-y-4">
                {contextItems.map((item, index) =>
                <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <item.icon className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1A3A52] mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} className="bg-[#0f172a] p-8 rounded-3xl">


              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-[#C9A961] rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-[#1A3A52]" />
                </div>
                <div>
                  <p className="text-sm text-[#C9A961]">Notre approche</p>
                  <h3 className="text-2xl font-serif text-white">La Foncière Valora</h3>
                </div>
              </div>
              <div className="space-y-4">
                {solutions.map((item, index) =>
                <div key={index} className="flex gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="w-10 h-10 bg-[#C9A961] rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-[#1A3A52]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-white/70">{item.desc}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Strategy Points */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">

            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">Les piliers de l'acquisition

            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {strategyPoints.map((point, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-2xl transition-all duration-300">

                <div className="w-14 h-14 bg-[#1A3A52] rounded-xl flex items-center justify-center mb-4">
                  <point.icon className="h-7 w-7 text-[#C9A961]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A3A52] mb-2">{point.title}</h3>
                <p className="text-slate-600">{point.description}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Zones */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}>

              <h2 className="text-slate-900 mb-6 text-3xl font-serif md:text-4xl">Zones à Fort Potentiel

              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                La stratégie d'investissement s'oriente vers des territoires présentant des perspectives 
                de valorisation pérennes, fondées sur la profondeur du marché locatif, la stabilité 
                démographique et la vitalité des bassins d'emploi.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {zones.map((zone, index) =>
                <div key={index} className="p-4 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-[#C9A961]" />
                      <span className="font-semibold text-[#1A3A52]">{zone.name}</span>
                    </div>
                    <p className="text-sm text-slate-600">{zone.description}</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} className="bg-[#0f172a] p-8 rounded-3xl">


              <h3 className="text-xl font-serif text-white mb-6">Objectifs clés</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#C9A961] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-[#1A3A52]">4</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Villes ciblées</p>
                    <p className="text-white/60 text-sm">Marchés stratégiques sélectionnés</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-[#C9A961]">30</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Immeubles cibles</p>
                    <p className="text-white/60 text-sm">Pipeline d'acquisition identifié</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-[#C9A961]">20M€</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Objectif d'actifs</p>
                    <p className="text-white/60 text-sm">Horizon 5 ans</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Alignment - MOVED UP */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12">

            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">Alignement total des intérêts

            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Le modèle privilégie un alignement durable entre associés, indépendamment de la taille 
              de leur engagement, autour d'une trajectoire patrimoniale commune.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 text-center border border-slate-200">

              <div className="w-16 h-16 bg-[#1A3A52] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Handshake className="h-8 w-8 text-[#C9A961]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A3A52] mb-3">Création de valeur partagée</h3>
              <p className="text-slate-600 text-sm">
                Plus-values réalisées + Remboursement du prêt + Capitalisation des flux
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#C9A961] rounded-3xl p-8 text-center">

              <div className="w-16 h-16 bg-[#1A3A52] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A3A52] mb-3">Rémunération à la performance</h3>
              <p className="text-[#1A3A52]/80 text-sm">
                Carried interest uniquement sur la surperformance au-delà de 6,5%/an
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 text-center border-2 border-[#1A3A52]">

              <div className="w-16 h-16 bg-[#1A3A52] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-[#C9A961]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A3A52] mb-3">0€ de frais initiaux</h3>
              <p className="text-slate-600 text-sm">
                100% de l'apport investi dans les actifs
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparatif */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12">

            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">Comparatif — 3 modèles d'investissement

            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {comparatif.map((model, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-3xl p-6 ${model.highlight ? 'bg-[#C9A961] ring-4 ring-[#C9A961]/30' : 'bg-white border border-slate-200'}`}>

                <h3 className={`text-lg font-semibold text-center mb-6 ${model.highlight ? 'text-white' : 'text-slate-900'}`}>
                  {model.title}
                </h3>
                <div className="space-y-4">
                  {model.items.map((item, idx) =>
                <div key={idx} className={`flex justify-between items-center p-3 rounded-lg ${model.highlight ? 'bg-white/20' : 'bg-slate-50'}`}>
                      <span className={`text-sm ${model.highlight ? 'text-[#1A3A52]' : 'text-slate-600'}`}>{item.label}</span>
                      <span className={`font-semibold ${
                  item.positive ? 'text-[#1A3A52]' :
                  item.negative ? 'text-red-500' :
                  model.highlight ? 'text-[#1A3A52]' : 'text-slate-900'}`
                  }>
                        {item.value}
                      </span>
                    </div>
                )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Performance - Projection - BEFORE SIMULATOR */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}>

              <h2 className="text-slate-900 mb-6 text-3xl font-serif md:text-4xl">Évolution du capital

              </h2>
              <p className="text-slate-600 mb-8">
                Exemple de projection : 10 000 € investis lors de la première levée.
              </p>
              
              <div className="bg-[#0f172a] mb-6 p-6 rounded-2xl from-[#1A3A52] to-[#2A4A6F]">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-white/60 text-sm">Souscription</p>
                    <p className="text-2xl font-bold text-white">10 000 €</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Année 5</p>
                    <p className="text-2xl font-bold text-[#C9A961]">16 489 €</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Performance</p>
                    <p className="text-2xl font-bold text-[#C9A961]">+64,9%</p>
                  </div>
                </div>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A961" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#C9A961" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="year" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`} />
                    <Tooltip
                      formatter={(value) => [`${value.toLocaleString()} €`, 'Valeur']}
                      contentStyle={{ backgroundColor: '#1A3A52', border: 'none', borderRadius: '8px', color: 'white' }} />

                    <Area type="monotone" dataKey="value" stroke="#C9A961" strokeWidth={3} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}>

              <h3 className="text-xl font-serif text-[#1A3A52] mb-6">Triple mécanisme de création de valeur</h3>
              <div className="space-y-4">
                {valueCreation.map((item, index) =>
                <div key={index} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200">
                    <div className="w-14 h-14 bg-[#1A3A52] rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-7 w-7 text-[#C9A961]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1A3A52]">{item.title}</h4>
                      <p className="text-xl font-bold text-[#C9A961]">{item.value}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 bg-[#C9A961]/10 rounded-xl p-4">
                <p className="text-sm text-[#1A3A52]">
                  La création de valeur s'inscrit dans une logique progressive, portée par la gestion 
                  opérationnelle des actifs et l'amortissement naturel des financements.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fiscal PEA-PME */}
      <section className="bg-gray-900 py-16">
        <div className="bg-[#0f172a] mx-auto px-6 max-w-7xl lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}>

              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                Éligibilité PEA-PME
              </h2>
              <p className="text-white/70 mb-6">
                La détention des actions sur une période minimale de 5 ans permet l'éligibilité 
                au dispositif PEA-PME avec exonération d'impôt sur le revenu (12,8%) sur les gains capitalisés.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="h-5 w-5 text-[#C9A961]" />
                  Exonération d'impôt sur le revenu (12,8%)
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="h-5 w-5 text-[#C9A961]" />
                  Plus-values et dividendes réinvestis exonérés
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="h-5 w-5 text-[#C9A961]" />
                  Avantage fiscal lors de la sortie
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6">

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                <p className="text-white/60 text-sm mb-2">Régime Standard</p>
                <p className="text-4xl font-bold text-white mb-2">30%</p>
                <p className="text-white/60 text-sm">Flat Tax (PFU)</p>
              </div>
              <div className="bg-[#C9A961] rounded-2xl p-6 text-center">
                <p className="text-[#1A3A52]/80 text-sm mb-2">Avec PEA-PME</p>
                <p className="text-4xl font-bold text-[#1A3A52] mb-2">17,2%</p>
                <p className="text-[#1A3A52]/80 text-sm">Prélèvements sociaux</p>
                <div className="mt-4 bg-[#1A3A52] rounded-lg py-2 px-4">
                  <p className="text-white text-sm font-semibold">Économie 12,8%</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* CTA */}
      <section className="bg-[#C9A961] py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-slate-900 mb-4 text-2xl font-serif md:text-3xl">S’associer à notre dynamique de valorisation

          </h2>
          <p className="text-slate-800 mb-8">Rejoignez un cercle d'associés unis par une stratégie immobilière maîtrisée, une exécution professionnelle et une gouvernance exemplaire.


          </p>
          <Link to={createPageUrl("Contact")}>
            <Button className="bg-[#0f172a] text-slate-50 px-8 py-6 text-sm font-semibold rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 hover:bg-[#B8994F]">
              Entrer en relation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>);

}