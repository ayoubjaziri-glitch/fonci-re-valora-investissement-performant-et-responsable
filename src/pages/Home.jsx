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
  Target
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stats = [
    { value: "18 ans", label: "D'expertise immobilière", icon: Calendar },
    { value: "3 M€", label: "D'actifs sous gestion", icon: Building2 },
    { value: "10,5%", label: "TRI net visé", icon: Percent },
    { value: "20 M€", label: "Objectif 5 ans", icon: Target }
  ];

  const advantages = [
    {
      title: "0€ de frais d'entrée",
      description: "100% de votre apport investi dans l'actif dès le premier jour",
      icon: CheckCircle2
    },
    {
      title: "Alignement total",
      description: "Rémunération uniquement sur la surperformance au-delà de 6,5%/an",
      icon: Users
    },
    {
      title: "Rénovation BBC",
      description: "Transformation systématique des actifs en DPE A/B",
      icon: Building2
    },
    {
      title: "Gestion clé en main",
      description: "De l'acquisition à l'arbitrage, nous gérons tout",
      icon: Shield
    }
  ];

  const zones = ["Bordeaux", "Lyon", "Vichy", "Clermont-Ferrand"];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F] via-[#2A4A6F] to-[#1E3A5F]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 border border-white/20 rounded-full" />
          <div className="absolute bottom-20 left-20 w-64 h-64 border border-white/20 rounded-full" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-12 bg-[#C9A961]" />
                <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                  Groupe Auvergne et Patrimoine
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-6">
                La Foncière
                <span className="block text-[#C9A961]">Patrimoniale</span>
              </h1>
              
              <p className="text-xl text-white/80 mb-4 font-light">
                Immobilier résidentiel performant et durable
              </p>
              
              <p className="text-white/60 mb-8 max-w-lg leading-relaxed">
                Foncière résidentielle spécialisée dans l'acquisition, la rénovation BBC 
                et la valorisation d'immeubles à fort potentiel dans les zones tendues.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                  Solution clé en main
                </span>
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                  Performance alignée
                </span>
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                  Impact ESG
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to={createPageUrl("Contact")}>
                  <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1E3A5F] px-8 py-6 text-base font-semibold">
                    Devenir associé
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to={createPageUrl("Strategy")}>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base">
                    Découvrir notre stratégie
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
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

      {/* Stats Section */}
      <section className="py-16 bg-[#F8F9FA]">
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
                <div className="w-14 h-14 mx-auto mb-4 bg-[#1E3A5F] rounded-2xl flex items-center justify-center">
                  <stat.icon className="h-7 w-7 text-[#C9A961]" />
                </div>
                <p className="text-3xl font-bold text-[#1E3A5F] mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-1 bg-[#C9A961]" />
                  <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                    Notre Vision
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-[#1E3A5F] mb-6">
                  Devenir acteur de référence de l'investissement résidentiel patrimonial durable
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Notre vision est de bâtir, sur le long terme, un portefeuille immobilier significatif, 
                  diversifié et résilient, capable de traverser les cycles économiques tout en offrant 
                  à ses associés une performance attractive et maîtrisée.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Adossés à un groupe établi depuis 2008, nous capitalisons sur une expertise éprouvée 
                  et des ressources intégrées pour créer de la valeur durable.
                </p>
                
                <div className="flex items-center gap-6 p-6 bg-[#F8F9FA] rounded-2xl">
                  <div className="w-16 h-16 bg-[#1E3A5F] rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-[#C9A961]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1E3A5F] mb-1">Mission</p>
                    <p className="text-gray-600">Acquérir, Rénover, Valoriser</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {advantages.map((adv, index) => (
                <div 
                  key={index}
                  className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-[#C9A961]/10 rounded-xl flex items-center justify-center mb-4">
                    <adv.icon className="h-6 w-6 text-[#C9A961]" />
                  </div>
                  <h3 className="font-semibold text-[#1E3A5F] mb-2">{adv.title}</h3>
                  <p className="text-sm text-gray-600">{adv.description}</p>
                </div>
              ))}
            </motion.div>
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