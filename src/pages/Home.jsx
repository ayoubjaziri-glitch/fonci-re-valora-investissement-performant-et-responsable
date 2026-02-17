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
  Quote
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Home() {
  const stats = [
    { value: "18 ans", label: "D'expertise immobilière", icon: Calendar },
    { value: "3 M€", label: "D'actifs sous gestion", icon: Building2 },
    { value: "10,5%", label: "TRI net visé", icon: Percent },
    { value: "20 M€", label: "Objectif 5 ans", icon: Target }
  ];

  const services = [
    {
      title: "Investissement immobilier clé en main",
      description: "Investissez aux côtés de La Foncière Patrimoniale dans des opérations immobilières structurées. Bénéficiez d'un cadre sécurisé et d'une stratégie patrimoniale claire pour développer votre capital.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      icon: Key
    },
    {
      title: "Sélection d'opportunités immobilières",
      description: "Nous identifions et analysons les biens les plus performants adaptés à notre stratégie patrimoniale. Chaque opportunité est évaluée selon sa rentabilité, sa localisation et son potentiel de rénovation durable.",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
      icon: Search
    },
    {
      title: "Gestion locative et arbitrage patrimonial",
      description: "Nous prenons en charge la gestion complète des locataires, le suivi des loyers et des charges, ainsi que les opérations de maintenance et d'arbitrage pour optimiser la rentabilité globale.",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
      icon: BarChart3
    }
  ];

  const atouts = [
    "Mutualisation et diversification du risque locatif",
    "Équilibre optimisé entre rendement et niveau de risque",
    "Absence de contraintes liées à la gestion locative quotidienne",
    "Approche patrimoniale long terme, sécurisée et structurée",
    "Liberté dans le choix du montant à investir",
    "Répartition géographique des investissements"
  ];

  const valeurAjoutee = [
    "Objectif de performance financière supérieur à l'immobilier traditionnel",
    "Prise en charge complète : recherche, négociation, acquisition, travaux, location, revente",
    "Renforcement de la diversification globale du patrimoine",
    "Transparence totale sur les opérations et la stratégie",
    "Création de valeur durable à travers des actifs rénovés et optimisés"
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
        <div className="absolute inset-0 bg-[#1E3A5F]/80" />
        
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
                <span className="block text-[#C9A961]">notre priorité</span>
              </h1>
              
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                <strong className="text-white">Bienvenue chez La Foncière Patrimoniale.</strong> Nous vous accompagnons 
                dans la constitution d'un patrimoine immobilier durable et performant. Grâce à notre expertise 
                dans l'acquisition, la rénovation et la gestion de biens, nous transformons chaque projet en 
                une opportunité concrète de valorisation et de revenus pérennes.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link to={createPageUrl("Services")}>
                  <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1E3A5F] px-8 py-6 text-base font-semibold">
                    En savoir plus
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
                <div className="absolute -inset-4 bg-[#C9A961]/20 rounded-3xl blur-2xl" />
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <div className="text-center mb-6">
                    <p className="text-[#C9A961] font-medium mb-2">Levée en cours</p>
                    <p className="text-4xl font-bold text-white">250 000 €</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-white/80">
                      <span>Ticket minimum</span>
                      <span className="font-semibold text-white">10 000 €</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>TRI net visé</span>
                      <span className="font-semibold text-[#C9A961]">10,5%</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Horizon</span>
                      <span className="font-semibold text-white">5 ans</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Frais d'entrée</span>
                      <span className="font-semibold text-[#C9A961]">0 €</span>
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
            <h2 className="text-3xl md:text-4xl font-serif text-[#1E3A5F] mb-6">
              Qui sommes-nous ?
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              <strong className="text-[#1E3A5F]">La Foncière Patrimoniale</strong> est une société immobilière dédiée à l'acquisition, 
              la rénovation durable et la valorisation d'actifs immobiliers. Notre mission est de constituer 
              un patrimoine solide et générateur de revenus, en accompagnant nos clients dans des investissements 
              structurés, sécurisés et orientés long terme, grâce à une gestion intégrée et experte de l'ensemble 
              du cycle immobilier.
            </p>
          </motion.div>
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
            <h2 className="text-3xl md:text-4xl font-serif text-[#1E3A5F] mb-6">
              Une Offre Globale pour Vos Projets Immobiliers
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              <strong>Nous proposons une offre globale clé en main</strong>, pensée pour les investisseurs 
              souhaitant placer leur argent en toute sérénité. Nous prenons en charge l'ensemble des étapes 
              de l'investissement immobilier, de la recherche et sélection des biens à l'acquisition, 
              au pilotage des travaux, à la mise en location et à l'arbitrage des actifs.
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F]/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-[#C9A961] rounded-xl flex items-center justify-center">
                    <service.icon className="h-6 w-6 text-[#1E3A5F]" />
                  </div>
                </div>
                <h3 className="text-xl font-serif text-[#1E3A5F] mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
                <Link to={createPageUrl("Services")} className="inline-flex items-center text-[#C9A961] font-medium mt-4 hover:gap-3 transition-all">
                  Lire plus <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#1E3A5F]">
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
                  <stat.icon className="h-7 w-7 text-[#1E3A5F]" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Atouts & Valeur Ajoutée Section */}
      <section className="py-24 bg-[#F8F9FA]">
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
              <h3 className="text-2xl font-serif text-[#1E3A5F] mb-6 flex items-center gap-3">
                <Shield className="h-8 w-8 text-[#C9A961]" />
                Atouts
              </h3>
              <ul className="space-y-4">
                {atouts.map((atout, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#C9A961] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{atout}</span>
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
              <h3 className="text-2xl font-serif text-[#1E3A5F] mb-6 flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-[#C9A961]" />
                Valeur ajoutée pour l'investisseur
              </h3>
              <ul className="space-y-4">
                {valeurAjoutee.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#C9A961] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
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
            <h2 className="text-3xl md:text-4xl font-serif text-[#1E3A5F] mb-4">
              Ce que nos clients disent de nous
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
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
                className="bg-[#F8F9FA] rounded-2xl p-8 relative"
              >
                <Quote className="h-10 w-10 text-[#C9A961]/30 absolute top-6 right-6" />
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#1E3A5F] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{testimonial.author.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1E3A5F]">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Zones Section */}
      <section className="py-24 bg-[#1E3A5F]">
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
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Des marchés à fort potentiel
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Nous concentrons nos acquisitions sur des marchés secondaires dynamiques 
              et des zones géographiques résilientes.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {zones.map((zone, index) => (
              <motion.div
                key={zone}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/15 transition-colors"
              >
                <MapPin className="h-8 w-8 text-[#C9A961] mx-auto mb-3" />
                <p className="text-white font-semibold">{zone}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-[#C9A961] rounded-2xl p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-serif text-[#1E3A5F] mb-2">
                  Objectif Stratégique
                </h3>
                <p className="text-[#1E3A5F]/80 max-w-xl">
                  Créer de la valeur durable par revalorisation technique (travaux BBC), 
                  revalorisation locative, amortissement des prêts et plus-value à la revente.
                </p>
              </div>
              <Link to={createPageUrl("Strategy")}>
                <Button className="bg-[#1E3A5F] hover:bg-[#2A4A6F] text-white px-8 py-6 whitespace-nowrap">
                  En savoir plus
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[#1E3A5F] mb-6">
              Rejoignez une communauté d'associés alignés
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Portée par un groupe solide depuis 2008, contribuez à la création 
              de valeur patrimoniale durable avec La Foncière Patrimoniale.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={createPageUrl("Contact")}>
                <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1E3A5F] px-8 py-6 text-base font-semibold">
                  Contactez-nous
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={createPageUrl("Performance")}>
                <Button variant="outline" className="border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white px-8 py-6 text-base">
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