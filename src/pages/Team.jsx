import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Briefcase, 
  TrendingUp,
  ArrowRight,
  Calendar,
  Target,
  CheckCircle2,
  Zap,
  Award
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Team() {
  const founders = [
    {
      name: "Ayoub Jaziri",
      role: "Cofondateur",
      expertise: "Stratégie d'acquisition, suivi des travaux, financement et gouvernance.",
      background: "Ex-chef de projet immobilier d'envergure en promotion immobilière à Bordeaux • 8 ans d'experience, investisseur immobilier depuis 5 ans.",
      icon: "AJ"
    },
    {
      name: "Sophian Naili",
      role: "Cofondateur",
      expertise: "Investissement, sourcing off-market et arbitrages.",
      background: "Investisseur immobilier depuis 2008 • 30+ biens • 3 M€ de patrimoine immobilier.",
      icon: "SN"
    },
    {
      name: "Renaud Marchand",
      role: "Associé",
      expertise: "Travaux & rénovation, pilotage des chantiers, qualité BBC.",
      background: "Ingénieur BTP • réseau de 12 entreprises de BTP • Investisseur immobilier • 40+ biens • 5 M€ de patrimoine immobilier",
      icon: "RM"
    }
  ];

  const teamStrengths = [
    { icon: Calendar, text: "16 ans d'historique cumulée sur l'immobilier résidentiel" },
    { icon: TrendingUp, text: "Chaîne de valeur intégrée : Levée des fonds → sourcing → financement → travaux BBC → location → arbitrage" },
    { icon: Zap, text: "Accès privilégié aux opportunités et exécution rapide dans les zones tendues" }
  ];

  const groupStats = [
    { value: "3 M€", label: "Actifs sous gestion" },
    { value: "30+", label: "Entreprises BTP partenaires" },
    { value: "4", label: "Collaborateurs" },
    { value: "18 ans", label: "D'expertise" }
  ];

  const timeline = [
    { year: "2026", assets: "1,25 M€" },
    { year: "2027", assets: "2,5 M€" },
    { year: "2028", assets: "5 M€" },
    { year: "2029", assets: "10 M€" },
    { year: "2030", assets: "15 M€" },
    { year: "2031", assets: "20 M€", highlight: true }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-[#1E3A5F] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 right-0 w-96 h-96 border border-white/20 rounded-full transform translate-x-1/2 translate-y-1/2" />
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
                Notre équipe
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Une équipe d'experts dédiée
            </h1>
            <p className="text-xl text-white/70">
              Des professionnels passionnés unis par une vision commune : créer de la valeur patrimoniale durable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-24">
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
            <h2 className="text-3xl md:text-4xl font-serif text-[#1E3A5F]">
              Les piliers de La Foncière
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {founders.map((founder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="w-20 h-20 bg-[#1E3A5F] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-[#C9A961]">{founder.icon}</span>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-serif text-[#1E3A5F] mb-1">{founder.name}</h3>
                  <p className="text-[#C9A961] font-medium">{founder.role}</p>
                </div>
                <p className="text-[#1E3A5F] font-medium mb-3">{founder.expertise}</p>
                <p className="text-sm text-gray-600">{founder.background}</p>
              </motion.div>
            ))}
          </div>

          {/* Team Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-[#1E3A5F] rounded-3xl p-8"
          >
            <h3 className="text-xl font-serif text-white text-center mb-8">Forces clés de l'équipe</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {teamStrengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#C9A961] rounded-lg flex items-center justify-center flex-shrink-0">
                    <strength.icon className="h-5 w-5 text-[#1E3A5F]" />
                  </div>
                  <p className="text-white/80 text-sm">{strength.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Group Structure */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-[#C9A961]/20 px-4 py-2 rounded-full mb-6">
              <Calendar className="h-4 w-4 text-[#C9A961]" />
              <span className="text-[#C9A961] font-medium text-sm">Depuis 2008</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1E3A5F] mb-4">
              Structure du groupe
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* Group Hierarchy */}
              <div className="space-y-6">
                <div className="bg-[#1E3A5F] rounded-2xl p-6 text-center">
                  <Building2 className="h-8 w-8 text-[#C9A961] mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-white">Auvergne & Patrimoine</h4>
                  <p className="text-white/60 text-sm">Holding du groupe • Établi et éprouvé</p>
                  <p className="text-[#C9A961] font-semibold mt-2">Valorisation : 3 M€</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                    <p className="font-semibold text-[#1E3A5F] text-sm">BVS</p>
                    <p className="text-xs text-gray-500">Blaise Vichy Séjours</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                    <p className="font-semibold text-[#1E3A5F] text-sm">SA Gabriel</p>
                    <p className="text-xs text-gray-500">Présidente</p>
                  </div>
                  <div className="bg-[#C9A961] rounded-xl p-4 text-center">
                    <p className="font-semibold text-[#1E3A5F] text-sm">La Foncière Patrimoniale</p>
                    <p className="text-xs text-[#1E3A5F]/70">Objet de cette présentation</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-2 gap-6">
                {groupStats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 text-center border border-gray-200">
                    <p className="text-3xl font-bold text-[#1E3A5F] mb-2">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Growth Timeline */}
      <section className="py-24">
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
                Trajectoire de développement
              </span>
              <div className="w-12 h-1 bg-[#C9A961]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1E3A5F] mb-4">
              1,25M€ → 20M€ en 5 ans
            </h2>
          </motion.div>

          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex-shrink-0 w-40 rounded-2xl p-6 text-center ${
                  item.highlight ? 'bg-[#C9A961]' : 'bg-[#1E3A5F]'
                }`}
              >
                <p className={`text-sm mb-2 ${item.highlight ? 'text-[#1E3A5F]/70' : 'text-white/60'}`}>
                  {item.year}
                </p>
                <p className={`text-2xl font-bold ${item.highlight ? 'text-[#1E3A5F]' : 'text-[#C9A961]'}`}>
                  {item.assets}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#C9A961]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-[#1E3A5F] mb-4">
            Rejoignez une équipe de passionnés
          </h2>
          <p className="text-[#1E3A5F]/80 mb-8">
            Investissez aux côtés d'experts dédiés à la création de valeur patrimoniale durable.
          </p>
          <Link to={createPageUrl("Contact")}>
            <Button className="bg-[#1E3A5F] hover:bg-[#2A4A6F] text-white px-8 py-6">
              Nous contacter
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}