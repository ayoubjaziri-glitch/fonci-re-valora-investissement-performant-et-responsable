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
import { Link } from 'react-router-dom';

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
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      icon: Key
    },
    {
      title: "Sourcing et due diligence",
      description: "Notre équipe identifie des actifs à fort potentiel de revalorisation. Chaque acquisition fait l'objet d'une analyse approfondie : rentabilité locative, décote à l'achat, potentiel de réhabilitation.",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
      icon: Search
    },
    {
      title: "Asset management et arbitrage",
      description: "Gestion locative intégrée, suivi des flux de trésorerie, optimisation du taux d'occupation et stratégie d'arbitrage pour maximiser la création de valeur et le TRI de vos parts.",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
      icon: BarChart3
    }
  ];

  const atouts = [
    "Mutualisation des risques locatifs sur un portefeuille diversifié",
    "Allocation optimisée entre rendement courant et plus-value à terme",
    "Externalisation totale de la gestion d'actifs immobiliers",
    "Véhicule d'investissement structuré avec gouvernance claire",
    "Ticket d'entrée accessible et liquidité encadrée",
    "Diversification géographique limitant l'exposition aux cycles locaux"
  ];

  const valeurAjoutee = [
    "Objectif de TRI supérieur aux SCPI et à l'immobilier en direct",
    "Chaîne de valeur intégrée : sourcing, acquisition, réhabilitation, gestion, cession",
    "Effet de levier bancaire optimisé (LTV 80%) démultipliant la performance",
    "Reporting régulier et transparence sur la valorisation des actifs",
    "Création de valeur via la rénovation BBC et l'amélioration du DPE"
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
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-slate-900/85" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-6">
                Votre patrimoine,
                <span className="block text-emerald-400">notre priorité</span>
              </h1>
              
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                <strong className="text-white">Bienvenue chez La Foncière Patrimoniale.</strong> Nous structurons 
                des opérations d'acquisition et de valorisation d'actifs immobiliers résidentiels. Notre véhicule 
                d'investissement vous permet de bénéficier de l'effet de levier bancaire et d'une gestion 
                professionnelle pour optimiser le rendement de vos capitaux propres.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link to={createPageUrl("Services")}>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-base font-semibold">
                    Découvrir nos services
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to={createPageUrl("Contact")}>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base">
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-emerald-500/20 rounded-3xl blur-2xl" />
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <div className="text-center mb-6">
                    <p className="text-emerald-400 font-medium mb-2">Levée en cours</p>
                    <p className="text-4xl font-bold text-white">250 000 €</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-white/80">
                      <span>Ticket minimum</span>
                      <span className="font-semibold text-white">10 000 €</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>TRI net visé</span>
                      <span className="font-semibold text-emerald-400">10,5%</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Horizon</span>
                      <span className="font-semibold text-white">5 ans</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Frais d'entrée</span>
                      <span className="font-semibold text-emerald-400">0 €</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Qui sommes-nous Section */}
      <section className="relative py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-white/90" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl text-center"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
              Qui sommes-nous ?
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              <strong className="text-slate-900">La Foncière Patrimoniale</strong> est un véhicule d'investissement immobilier 
              spécialisé dans l'acquisition, la réhabilitation BBC et l'asset management d'actifs résidentiels. 
              Notre mission : constituer un portefeuille patrimonial performant et résilient, en proposant à nos 
              associés une exposition au marché immobilier avec effet de levier, gestion déléguée et alignement 
              total des intérêts via le carried interest.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Durabilité Section */}
      <section className="py-24 bg-emerald-50">
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
                  Durabilité
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                La Foncière Responsable
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Nos engagements en matière de <strong>durabilité, de gouvernance et de responsabilité sociale</strong> sont 
                au cœur de notre stratégie. Chaque réhabilitation vise l'amélioration significative de la 
                performance énergétique des bâtiments pour un parc immobilier plus vertueux.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <Thermometer className="h-8 w-8 text-emerald-500 mb-3" />
                  <p className="font-semibold text-slate-900 mb-1">Rénovation BBC</p>
                  <p className="text-sm text-slate-600">Objectif DPE A ou B sur 100% du parc</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <Zap className="h-8 w-8 text-emerald-500 mb-3" />
                  <p className="font-semibold text-slate-900 mb-1">-60% énergie</p>
                  <p className="text-sm text-slate-600">Réduction moyenne de consommation</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <TreePine className="h-8 w-8 text-emerald-500 mb-3" />
                  <p className="font-semibold text-slate-900 mb-1">Matériaux durables</p>
                  <p className="text-sm text-slate-600">Isolation biosourcée privilégiée</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <Leaf className="h-8 w-8 text-emerald-500 mb-3" />
                  <p className="font-semibold text-slate-900 mb-1">Impact carbone</p>
                  <p className="text-sm text-slate-600">Trajectoire bas-carbone 2030</p>
                </div>
              </div>

              <Link to={createPageUrl("Services")}>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
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
                src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80" 
                alt="Rénovation durable"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-emerald-600 text-white rounded-2xl p-6 shadow-xl">
                <p className="text-4xl font-bold mb-1">100%</p>
                <p className="text-emerald-100 text-sm">des actifs rénovés<br/>aux normes BBC</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Offre Globale Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
              Un véhicule d'investissement structuré
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">
              <strong>La Foncière Patrimoniale prend en charge l'intégralité du cycle immobilier</strong> : 
              sourcing off-market, structuration du financement bancaire, pilotage des travaux de réhabilitation, 
              asset management et arbitrage stratégique. Vous bénéficiez d'une gestion professionnelle sans 
              contrainte opérationnelle.
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
                className="group"
              >
                <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-serif text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">{service.description}</p>
                <Link to={createPageUrl("Services")} className="inline-flex items-center text-blue-600 font-medium mt-4 hover:gap-3 transition-all">
                  En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900">
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
                <div className="w-14 h-14 mx-auto mb-4 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <stat.icon className="h-7 w-7 text-white" />
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
              <div className="w-12 h-1 bg-emerald-500" />
              <span className="text-emerald-600 font-medium tracking-wider uppercase text-sm">
                Portefeuille d'actifs
              </span>
              <div className="w-12 h-1 bg-emerald-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
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
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                Voir toutes nos opérations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Atouts & Valeur Ajoutée Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Atouts */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute top-0 left-0 w-64 h-64 rounded-2xl overflow-hidden -z-10 opacity-20">
                <img 
                  src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=400&q=80" 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-600" />
                Atouts
              </h3>
              <ul className="space-y-4">
                {atouts.map((atout, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{atout}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Valeur Ajoutée */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-2xl overflow-hidden -z-10 opacity-20">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80" 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-emerald-500" />
                Valeur ajoutée pour l'investisseur
              </h3>
              <ul className="space-y-4">
                {valeurAjoutee.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
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
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
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
                <Quote className="h-10 w-10 text-blue-500/30 absolute top-6 right-6" />
                <p className="text-slate-700 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{testimonial.author.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.author}</p>
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
              <div className="w-12 h-1 bg-blue-600" />
              <span className="text-blue-600 font-medium tracking-wider uppercase text-sm">
                Zones d'intervention
              </span>
              <div className="w-12 h-1 bg-blue-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
              Des marchés à fort potentiel
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Nous concentrons nos acquisitions sur des marchés secondaires dynamiques 
              et des zones géographiques résilientes offrant un équilibre optimal entre rendement et sécurité.
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
            className="mt-16 bg-blue-600 rounded-2xl p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-serif text-white mb-2">
                  Objectif Stratégique
                </h3>
                <p className="text-blue-100 max-w-xl">
                  Créer de la valeur durable par revalorisation technique (travaux BBC), 
                  revalorisation locative, amortissement des prêts et plus-value à l'arbitrage.
                </p>
              </div>
              <Link to={createPageUrl("Strategy")}>
                <Button className="bg-white hover:bg-slate-100 text-blue-700 px-8 py-6 whitespace-nowrap">
                  Découvrir notre stratégie
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
              Rejoignez une communauté d'associés alignés
            </h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Portée par un groupe solide depuis 2008, contribuez à la création 
              de valeur patrimoniale durable avec La Foncière Patrimoniale.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={createPageUrl("Contact")}>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-base font-semibold">
                  Devenir associé
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={createPageUrl("Performance")}>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base">
                  Voir les performances
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}