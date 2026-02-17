import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Home, 
  Percent, 
  Tag,
  Building2,
  FileCheck,
  Clock,
  ArrowRight,
  Search,
  Landmark,
  Wrench,
  CalendarDays,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Strategy() {
  const strategyPoints = [
    {
      icon: Home,
      title: "Rénovation BBC",
      description: "DPE D–E transformé en A–B pour maximiser la valeur"
    },
    {
      icon: Percent,
      title: "Rendement 9%+ brut",
      description: "Objectif d'équilibre économique durable sur chaque actif"
    },
    {
      icon: Tag,
      title: "Décote à l'Achat",
      description: "−10% à −15% vs prix marché pour créer la valeur"
    },
    {
      icon: Building2,
      title: "Sourcing Off-Market",
      description: "Réseau de 45+ agents partenaires pour opportunités exclusives"
    },
    {
      icon: FileCheck,
      title: "Due Diligence",
      description: "Analyse multicritères, diagnostics complets, financement sécurisé"
    },
    {
      icon: Clock,
      title: "Horizon 5–6 ans",
      description: "Cycle de détention patrimonial avec arbitrages stratégiques"
    }
  ];

  const difficulties = [
    { icon: Search, title: "Sélection complexe", desc: "Identifier les bons biens à fort potentiel nécessite expertise, réseau et analyse multicritère." },
    { icon: Landmark, title: "Financement difficile", desc: "Obtenir les meilleures conditions bancaires et maximiser l'effet de levier est chronophage." },
    { icon: Wrench, title: "Travaux chronophages", desc: "Piloter une rénovation BBC, gérer les artisans et respecter les délais demande du temps." },
    { icon: CalendarDays, title: "Gestion quotidienne", desc: "Recherche locataires, entretien, impayés, fiscalité : une charge mentale permanente." }
  ];

  const solutions = [
    { title: "Parcours clé en main", desc: "De l'acquisition à l'arbitrage, nous gérons chaque étape : zéro gestion pour l'investisseur." },
    { title: "Process structuré", desc: "Due diligence, travaux BBC, mise en location et reporting : un modèle éprouvé et rodé." },
    { title: "Financement optimisé 80% LTC", desc: "Effet de levier maximal : nous sécurisons les meilleures conditions bancaires." },
    { title: "Pilotage data & transparence", desc: "Reporting mensuel, contrôle des risques et suivi des KPIs." }
  ];

  const zones = [
    { name: "Bordeaux", description: "Métropole dynamique avec forte demande locative" },
    { name: "Lyon", description: "2ème marché français, tension locative élevée" },
    { name: "Vichy", description: "Ville thermale en renouveau, rendements attractifs" },
    { name: "Clermont-Ferrand", description: "Bassin universitaire et économique stable" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-[#1E3A5F] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 border border-white/20 rounded-full transform translate-x-1/2 -translate-y-1/2" />
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
                Stratégie d'acquisition
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Notre approche d'investissement
            </h1>
            <p className="text-xl text-white/70">
              Une stratégie disciplinée pour créer de la valeur durable dans des zones à fort potentiel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Problem */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Le Constat</p>
                  <h3 className="text-2xl font-serif text-[#1E3A5F]">La difficulté</h3>
                </div>
              </div>
              <div className="space-y-4">
                {difficulties.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <item.icon className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1E3A5F] mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#1E3A5F] rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-[#C9A961] rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-[#1E3A5F]" />
                </div>
                <div>
                  <p className="text-sm text-[#C9A961]">Notre solution</p>
                  <h3 className="text-2xl font-serif text-white">La Foncière Patrimoniale</h3>
                </div>
              </div>
              <div className="space-y-4">
                {solutions.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="w-10 h-10 bg-[#C9A961] rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-[#1E3A5F]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-white/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Strategy Points */}
      <section className="py-24 bg-[#F8F9FA]">
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
                Notre stratégie
              </span>
              <div className="w-12 h-1 bg-[#C9A961]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1E3A5F] mb-4">
              Les piliers de notre acquisition
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {strategyPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-[#1E3A5F] rounded-xl flex items-center justify-center mb-4">
                  <point.icon className="h-7 w-7 text-[#C9A961]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1E3A5F] mb-2">{point.title}</h3>
                <p className="text-gray-600">{point.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Zones */}
      <section className="py-24 bg-white">
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
                  Zones cibles
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-[#1E3A5F] mb-6">
                Zones à Fort Potentiel
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Nous concentrons nos acquisitions sur des marchés secondaires dynamiques 
                et des zones géographiques résilientes. Notre focus : des villes à forte 
                tension locative présentant une croissance démographique stable et un bassin 
                d'emploi en expansion.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {zones.map((zone, index) => (
                  <div key={index} className="p-4 bg-[#F8F9FA] rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-[#C9A961]" />
                      <span className="font-semibold text-[#1E3A5F]">{zone.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{zone.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#1E3A5F] rounded-3xl p-8"
            >
              <h3 className="text-xl font-serif text-white mb-6">Objectifs clés</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#C9A961] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-[#1E3A5F]">4</span>
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

      {/* CTA */}
      <section className="py-16 bg-[#C9A961]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-[#1E3A5F] mb-4">
            Intéressé par notre stratégie ?
          </h2>
          <p className="text-[#1E3A5F]/80 mb-8">
            Découvrez comment notre approche peut faire fructifier votre patrimoine.
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