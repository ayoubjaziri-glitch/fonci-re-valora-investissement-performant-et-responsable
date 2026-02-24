import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  Building2, 
  TrendingUp, 
  Shield, 
  Users, 
  ArrowRight, 
  CheckCircle2,
  MapPin,
  Calendar,
  Percent,
  Target,
  Search,
  Home as HomeIcon,
  Key,
  BarChart3,
  Leaf,
  Quote,
  Thermometer,
  Zap,
  TreePine
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import RealisationsGallery from "../components/RealisationsGallery";
import InterventionMap from "../components/InterventionMap";

export default function Home() {
  const stats = [
    { value: "18 ans", label: "D'expertise immobilière", icon: Calendar },
    { value: "3 M€", label: "D'actifs sous gestion", icon: Building2 },
    { value: "10,5%", label: "TRI net visé", icon: Percent },
    { value: "20 M€", label: "Objectif 5 ans", icon: Target }
  ];

  const services = [
    {
      title: "Souscription au capital",
      description: "Devenez associé de La Foncière Patrimoniale et participez à des opérations d'acquisition structurées. Bénéficiez d'un véhicule d'investissement collectif avec une stratégie de valorisation patrimoniale éprouvée.",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/5c0c78345_pa00083251-bordeaux-immeuble.jpg",
      icon: Key
    },
    {
      title: "Sourcing et due diligence",
      description: "Notre équipe identifie des actifs à fort potentiel de revalorisation. Chaque acquisition fait l'objet d'une analyse approfondie : rentabilité locative, décote à l'achat, potentiel de réhabilitation.",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/6612247a6_immeuble_bordeaux__098875700_1532_22022018.jpg",
      icon: Search
    },
    {
      title: "Asset management et arbitrage",
      description: "Gestion locative intégrée, suivi des flux de trésorerie, optimisation du taux d'occupation et stratégie d'arbitrage pour maximiser la création de valeur et le TRI de vos parts.",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/0a169e079_france-paris-haussmann-la-facade-de-l-immeuble-e2dnpy.jpg",
      icon: BarChart3
    }
  ];

  const atouts = [
    "Mutualisation du risque locatif au sein d'un portefeuille diversifié",
    "Allocation équilibrée entre revenus courants et création de valeur à long terme",
    "Gestion opérationnelle des actifs intégralement déléguée",
    "Véhicule d'investissement structuré, doté d'une gouvernance lisible",
    "Ticket d'entrée accessible avec des mécanismes de liquidité encadrés",
    "Diversification géographique visant à atténuer l'exposition aux cycles locaux"
  ];

  const valeurAjoutee = [
    "Objectif de TRI supérieur aux véhicules d'investissement collectifs traditionnels et à l'immobilier en direct",
    "Chaîne de valeur intégrée : sourcing, acquisition, réhabilitation, gestion, cession",
    "Effet de levier bancaire optimisé (LTV 80%) démultipliant la performance",
    "Reporting régulier et transparence sur la valorisation des actifs",
    "Création de valeur via la rénovation énergétique et l'amélioration du DPE"
  ];

  const testimonials = [
    {
      text: "Grâce à La Foncière Patrimoniale, j'ai pu optimiser mon patrimoine et réaliser des investissements judicieux. Leur expertise est un atout précieux.",
      author: "Sophie M.",
      role: "Investisseur depuis 2022"
    },
    {
      text: "Un accompagnement personnalisé et une écoute attentive de mes besoins. La Foncière Patrimoniale est un partenaire de confiance pour la gestion de mon patrimoine.",
      author: "Jean-Pierre D.",
      role: "Associé fondateur"
    },
    {
      text: "La Foncière Patrimoniale m'a permis de mieux comprendre les enjeux de la gestion de patrimoine et de prendre des décisions éclairées pour mon avenir financier.",
      author: "Marie L.",
      role: "Investisseur"
    }
  ];

  const zones = ["Bordeaux", "Lyon", "Vichy", "Clermont-Ferrand"];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Inspired by Orion */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/0a169e079_france-paris-haussmann-la-facade-de-l-immeuble-e2dnpy.jpg')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/70" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            {/* Accent Line */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-widest uppercase text-sm">
                Foncière Résidentielle
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-6">
              <span className="text-white">INVESTIR & VALORISER</span>
              <br />
              <span className="text-[#C9A961]">DURABLEMENT</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-10 max-w-2xl leading-relaxed">
              Depuis 2008, le Groupe Auvergne et Patrimoine développe une expertise pointue 
              dans l'acquisition et la valorisation d'actifs résidentiels. Aujourd'hui, 
              <strong className="text-[#C9A961]"> La Foncière Patrimoniale</strong> vous permet 
              d'accéder à cette stratégie éprouvée : un portefeuille immobilier performant, 
              géré par des experts, avec <strong className="text-white">zéro contrainte de gestion</strong>.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to={createPageUrl("Contact")}>
                <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] px-8 py-6 text-base font-semibold border-2 border-[#C9A961]">
                  Entrer en relation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={createPageUrl("StrategyPerformance")}>
                <Button variant="outline" className="border-2 border-[#C9A961]/60 text-[#C9A961] hover:bg-[#C9A961]/10 px-8 py-6 text-base font-semibold">
                  Découvrir notre stratégie
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#C9A961] rounded-full"
              />
          </div>
        </motion.div>
      </section>

      {/* Qui sommes-nous Section - New Structure */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-[#C9A961]" />
                <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                  Qui sommes-nous
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-[#1A3A52] mb-6">
                Une foncière indépendante au service d'une vision patrimoniale exigeante
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                La Foncière Patrimoniale développe et valorise des actifs résidentiels durables à travers 
                une stratégie d'acquisition sélective, de réhabilitation BBC et de gestion active.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Un modèle conçu pour offrir aux investisseurs une exposition structurée à l'immobilier, 
                avec effet de levier maîtrisé, gouvernance alignée et gestion intégralement déléguée.
              </p>
              
              {/* Key Benefits */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#C9A961] mt-1 flex-shrink-0" />
                  <span className="text-slate-700">Portefeuille diversifié</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#C9A961] mt-1 flex-shrink-0" />
                  <span className="text-slate-700">Gestion opérationnelle centralisée</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#C9A961] mt-1 flex-shrink-0" />
                  <span className="text-slate-700">Éligibilité PEA-PME</span>
                </div>
              </div>
            </motion.div>

            {/* Right - Key Metrics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-[#1A3A52] rounded-2xl p-6 text-center">
                <Calendar className="h-8 w-8 text-[#C9A961] mx-auto mb-3" />
                <p className="text-3xl font-bold text-white mb-1">18 ans</p>
                <p className="text-sm text-white/60">D'expertise immobilière</p>
              </div>
              <div className="bg-[#1A3A52] rounded-2xl p-6 text-center">
                <Building2 className="h-8 w-8 text-[#C9A961] mx-auto mb-3" />
                <p className="text-3xl font-bold text-white mb-1">3 M€</p>
                <p className="text-sm text-white/60">D'actifs sous gestion</p>
              </div>
              <div className="bg-[#C9A961] rounded-2xl p-6 text-center">
                <Percent className="h-8 w-8 text-[#1A3A52] mx-auto mb-3" />
                <p className="text-3xl font-bold text-[#1A3A52] mb-1">10,5%</p>
                <p className="text-sm text-[#1A3A52]/80">TRI net visé</p>
              </div>
              <div className="bg-[#1A3A52] rounded-2xl p-6 text-center">
                <Target className="h-8 w-8 text-[#C9A961] mx-auto mb-3" />
                <p className="text-3xl font-bold text-white mb-1">20 M€</p>
                <p className="text-sm text-white/80">Objectif 5 ans</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Durabilité Section */}
      <section className="py-24 bg-slate-50">
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
                  Durabilité
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-[#1A3A52] mb-6">
                La Foncière Responsable
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                La durabilité, la qualité de la gouvernance et l'attention portée aux enjeux sociaux structurent 
                notre démarche. Chaque opération de réhabilitation s'inscrit dans une logique d'amélioration mesurable 
                de la performance énergétique, contribuant à la valorisation d'un patrimoine immobilier plus sobre et pérenne.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                  <Thermometer className="h-8 w-8 text-[#C9A961] mb-3" />
                  <p className="font-semibold text-[#1A3A52] mb-1">Rénovation BBC</p>
                  <p className="text-sm text-slate-600">Objectif DPE A ou B sur 100% du parc</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                  <Zap className="h-8 w-8 text-[#C9A961] mb-3" />
                  <p className="font-semibold text-[#1A3A52] mb-1">-60% énergie</p>
                  <p className="text-sm text-slate-600">Réduction moyenne de consommation</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                  <TreePine className="h-8 w-8 text-[#C9A961] mb-3" />
                  <p className="font-semibold text-[#1A3A52] mb-1">Matériaux durables</p>
                  <p className="text-sm text-slate-600">Isolation biosourcée privilégiée</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                  <Leaf className="h-8 w-8 text-[#C9A961] mb-3" />
                  <p className="font-semibold text-[#1A3A52] mb-1">Impact carbone</p>
                  <p className="text-sm text-slate-600">Trajectoire bas-carbone 2030</p>
                </div>
              </div>

              <Link to={createPageUrl("Durabilite")}>
                <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
                  Découvrir notre engagement ESG
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/0a169e079_france-paris-haussmann-la-facade-de-l-immeuble-e2dnpy.jpg" 
                alt="Rénovation durable"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#C9A961] text-[#1A3A52] rounded-2xl p-6 shadow-xl">
                <p className="text-4xl font-bold mb-1">100%</p>
                <p className="text-[#1A3A52]/80 text-sm">des actifs rénovés<br/>aux normes BBC</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Atouts & Valeur Ajoutée Section - MOVED UP AND ENHANCED */}
      <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-bold tracking-wider uppercase">
                Pourquoi investir avec nous
              </span>
              <div className="w-16 h-1 bg-[#C9A961]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#1A3A52] mb-6">
              Les atouts d'une foncière structurée
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              À la différence des véhicules fortement mutualisés ou d'un investissement immobilier 
              en direct, notre modèle repose sur une approche structurée de la création de valeur, 
              avec un alignement clair des intérêts entre les associés.
            </p>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mt-4">
              La stratégie d'investissement permet d'établir un lien lisible entre la valorisation 
              des actifs immobiliers sous-jacents et l'appréhension de cette valeur par l'investisseur, 
              offrant une lecture plus directe du patrimoine et de son évolution dans le temps.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Atouts */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-10 border-2 border-[#1A3A52] shadow-xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-[#1A3A52] rounded-2xl flex items-center justify-center">
                  <Shield className="h-9 w-9 text-[#C9A961]" />
                </div>
                <h3 className="text-3xl font-serif text-[#1A3A52]">Atouts</h3>
              </div>
              <ul className="space-y-5">
                {atouts.map((atout, index) => (
                  <motion.li 
                    key={index} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-[#C9A961]/5 transition-all"
                  >
                    <CheckCircle2 className="h-6 w-6 text-[#C9A961] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{atout}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Valeur Ajoutée */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#C9A961] rounded-3xl p-10 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-[#1A3A52] rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-9 w-9 text-[#C9A961]" />
                </div>
                <h3 className="text-3xl font-serif text-[#1A3A52]">Valeur ajoutée</h3>
              </div>
              <ul className="space-y-5">
                {valeurAjoutee.map((item, index) => (
                  <motion.li 
                    key={index} 
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-[#1A3A52]/20 rounded-xl hover:bg-[#1A3A52]/30 transition-all"
                  >
                    <CheckCircle2 className="h-6 w-6 text-[#1A3A52] mt-0.5 flex-shrink-0" />
                    <span className="text-[#1A3A52] font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-[#1A3A52] rounded-2xl p-8"
          >
            <p className="text-white text-lg">
              <strong className="text-[#C9A961]">Un modèle unique</strong> : 0€ de frais d'entrée • 
              Rémunération à la performance • Alignement total des intérêts
            </p>
          </motion.div>
        </div>
      </section>

      {/* Nos Services Section - Enhanced */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                Notre Expertise
              </span>
              <div className="w-12 h-1 bg-[#C9A961]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1A3A52] mb-6">
              Solution intégrée de bout en bout
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Une gestion structurée, de l'acquisition à l'arbitrage, portée par une équipe 
              engagée dans la création de valeur patrimoniale durable.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-2xl transition-all duration-500 h-full hover:-translate-y-2">
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A3A52] via-[#1A3A52]/50 to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <div className="w-14 h-14 bg-[#C9A961] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <service.icon className="h-7 w-7 text-[#1A3A52]" />
                      </div>
                      <h3 className="text-xl font-serif text-white mb-1">{service.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-600 leading-relaxed mb-4">{service.description}</p>
                    <Link to={createPageUrl("Services")} className="inline-flex items-center text-[#C9A961] font-semibold hover:gap-3 transition-all group-hover:text-[#B8994F]">
                      Découvrir <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                Équipe fondatrice
              </span>
              <div className="w-12 h-1 bg-[#C9A961]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1A3A52] mb-4">
              Une équipe d'experts engagés
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              18 ans d'expérience cumulée sur l'immobilier résidentiel avec une chaîne de valeur intégrée
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 text-center border border-slate-200"
            >
              <div className="w-20 h-20 bg-[#1A3A52] rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-10 w-10 text-[#C9A961]" />
              </div>
              <h3 className="font-semibold text-[#1A3A52] mb-2">Ayoub Jaziri</h3>
              <p className="text-[#C9A961] text-sm font-medium mb-3">Cofondateur</p>
              <p className="text-slate-600 text-sm">Stratégie d'acquisition, suivi des travaux, financement et gouvernance</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 text-center border border-slate-200"
            >
              <div className="w-20 h-20 bg-[#1A3A52] rounded-full mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-10 w-10 text-[#C9A961]" />
              </div>
              <h3 className="font-semibold text-[#1A3A52] mb-2">Sophian Naili</h3>
              <p className="text-[#C9A961] text-sm font-medium mb-3">Cofondateur</p>
              <p className="text-slate-600 text-sm">Investissement, sourcing off-market et arbitrages • 3 M€ de patrimoine</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 text-center border border-slate-200"
            >
              <div className="w-20 h-20 bg-[#1A3A52] rounded-full mx-auto mb-4 flex items-center justify-center">
                <HomeIcon className="h-10 w-10 text-[#C9A961]" />
              </div>
              <h3 className="font-semibold text-[#1A3A52] mb-2">Renaud Marchand</h3>
              <p className="text-[#C9A961] text-sm font-medium mb-3">Associé</p>
              <p className="text-slate-600 text-sm">Travaux & rénovation, pilotage des chantiers • Ingénieur BTP • 40+ biens</p>
            </motion.div>
          </div>

          <div className="text-center">
            <Link to={createPageUrl("Equipe")}>
              <Button variant="outline" className="border-[#1A3A52] text-[#1A3A52] hover:bg-slate-100">
                Découvrir l'équipe complète
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#1A3A52]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-[#C9A961] rounded-2xl flex items-center justify-center">
                  <stat.icon className="h-7 w-7 text-[#1A3A52]" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Réalisations Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                Portefeuille d'actifs
              </span>
              <div className="w-12 h-1 bg-[#C9A961]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1A3A52] mb-4">
              Nos opérations de valorisation
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Découvrez nos actifs restructurés : chaque acquisition fait l'objet d'une 
              réhabilitation profonde visant l'excellence énergétique et la création de valeur patrimoniale.
            </p>
          </motion.div>

          <RealisationsGallery />
          
          <div className="text-center mt-12">
            <Link to={createPageUrl("Realisations")}>
              <Button variant="outline" className="border-[#1A3A52] text-[#1A3A52] hover:bg-slate-100 font-semibold">
                Voir toutes nos opérations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Levée en cours - Moved down and enhanced */}
      <section className="py-24 bg-gradient-to-br from-[#1A3A52] via-[#2A4A6F] to-[#1A3A52]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-3 h-3 bg-[#C9A961] rounded-full animate-pulse" />
                  <span className="text-[#C9A961] font-bold uppercase tracking-wider text-sm">
                    Levée en cours
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                  Rejoignez la première levée
                </h2>
                <p className="text-xl text-white/80 mb-8 leading-relaxed">
                  Participez à notre levée inaugurale et bénéficiez d'un positionnement stratégique 
                  dans une foncière résidentielle à fort potentiel. 100% de votre apport investi 
                  dans les actifs, <strong className="text-[#C9A961]">0€ de frais d'entrée</strong>.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <p className="text-white/60 text-sm mb-1">TRI net visé</p>
                    <p className="text-3xl font-bold text-[#C9A961]">10,5%</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <p className="text-white/60 text-sm mb-1">Horizon recommandé</p>
                    <p className="text-3xl font-bold text-white">5 ans</p>
                  </div>
                </div>
                <Link to={createPageUrl("Contact")}>
                  <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-bold px-10 py-7 text-lg">
                    Entrer en relation
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="text-center mb-8">
                  <p className="text-[#C9A961] text-sm font-medium mb-2">Objectif de la levée</p>
                  <p className="text-6xl font-bold text-white mb-2">250 000 €</p>
                  <p className="text-white/60 text-sm">Première opération à 1,25 M€</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/10">
                    <p className="text-white/60 text-xs mb-2">Ticket minimum</p>
                    <p className="text-2xl font-bold text-white">10 000 €</p>
                  </div>
                  <div className="bg-[#C9A961]/20 rounded-2xl p-5 text-center border border-[#C9A961]/40">
                    <p className="text-white/60 text-xs mb-2">Frais d'entrée</p>
                    <p className="text-2xl font-bold text-[#C9A961]">0 €</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/10">
                    <p className="text-white/60 text-xs mb-2">Effet de levier</p>
                    <p className="text-2xl font-bold text-white">x5</p>
                  </div>
                  <div className="bg-[#C9A961]/20 rounded-2xl p-5 text-center border border-[#C9A961]/40">
                    <p className="text-white/60 text-xs mb-2">Valorisation An 5</p>
                    <p className="text-2xl font-bold text-[#C9A961]">+61%</p>
                  </div>
                </div>

                <div className="bg-[#C9A961] rounded-xl p-4 text-center">
                  <p className="text-[#1A3A52] font-semibold">
                    Investissement aligné • Rémunération à la performance
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[#1A3A52] mb-4">
              Ce que nos clients disent de nous
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Découvrez les témoignages de nos clients satisfaits et voyez comment La Foncière Patrimoniale 
              a contribué à leur succès financier.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl p-8 relative"
              >
                <Quote className="h-10 w-10 text-[#C9A961]/30 absolute top-6 right-6" />
                <p className="text-slate-700 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#1A3A52] rounded-full flex items-center justify-center">
                    <span className="text-[#C9A961] font-semibold">{testimonial.author.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A3A52]">{testimonial.author}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Zones Section with Map */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                Zones d'intervention
              </span>
              <div className="w-12 h-1 bg-[#C9A961]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1A3A52] mb-4">
              Des marchés à fort potentiel
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              La stratégie d'investissement s'oriente vers des territoires présentant des perspectives 
              de valorisation pérennes, fondées sur la profondeur du marché locatif, la stabilité 
              démographique et la vitalité des bassins d'emploi.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <InterventionMap />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-[#1A3A52] rounded-2xl p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-serif text-white mb-2">
                  Objectif Stratégique
                </h3>
                <p className="text-white/70 max-w-xl">
                  Créer de la valeur durable par revalorisation technique (travaux BBC), 
                  revalorisation locative, amortissement des prêts et plus-value à l'arbitrage.
                </p>
              </div>
              <Link to={createPageUrl("StrategyPerformance")}>
                <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] px-8 py-6 whitespace-nowrap font-semibold">
                  Découvrir notre stratégie
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1A3A52]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
              Investir aux côtés de La Foncière Patrimoniale
            </h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Foncière résidentielle spécialisée dans l'acquisition et la réhabilitation d'actifs à fort 
              potentiel de valorisation, principalement situés sur des marchés locatifs tendus.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={createPageUrl("Contact")}>
                <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] px-8 py-6 text-base font-semibold">
                  Entrer en relation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={createPageUrl("StrategyPerformance")}>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base">
                  Stratégie & Performance
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}