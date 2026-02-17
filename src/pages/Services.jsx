import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Search, 
  Hammer, 
  CheckSquare, 
  Home as HomeIcon,
  Briefcase,
  ArrowRight,
  Users,
  Shield,
  FileText
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Services() {
  const services = [
    {
      icon: TrendingUp,
      title: "Levée de Fonds & Ingénierie Financière",
      description: "Pilotage des levées de fonds afin de renforcer la capacité d'investissement de la foncière et créer de la valeur pour les associés.",
      features: ["Structuration financière optimisée", "Effet de levier bancaire 80%", "Montage juridique adapté"]
    },
    {
      icon: Search,
      title: "Acquisition & Sélection",
      description: "Sourcing stratégique d'actifs résidentiels à fort potentiel de valorisation.",
      features: ["Analyse multicritères rigoureuse", "Négociation experte", "Due diligence complète"]
    },
    {
      icon: Hammer,
      title: "Rénovation & Valorisation BBC",
      description: "Travaux pilotés par experts BTP avec objectif DPE A ou B systématique.",
      features: ["Plus-value latentes +10–15%", "Réseau de 30+ entreprises BTP", "Conformité énergétique garantie"]
    },
    {
      icon: Users,
      title: "Gestion intégrée & équipe dédiée",
      description: "Une équipe pluridisciplinaire dédie l'intégralité de son temps au pilotage et à la performance de la foncière.",
      features: ["Analystes & gestionnaires", "Techniciens qualifiés", "Suivi personnalisé"]
    },
    {
      icon: HomeIcon,
      title: "Gestion Locative & Pilotage",
      description: "Commercialisation multi-canaux avec taux d'occupation cible >98%.",
      features: ["Sélection rigoureuse locataires", "Reporting semestriel détaillé", "Gestion des impayés"]
    },
    {
      icon: Briefcase,
      title: "Arbitrage Stratégique & Fiscalité",
      description: "Cessions bloc ou lot par lot avec optimisation fiscale PEA-PME.",
      features: ["Stratégie de sortie optimisée", "Exonération IR après 5 ans", "Création de valeur maximisée"]
    }
  ];

  const processSteps = [
    { number: "01", title: "Sourcing", desc: "Identification d'opportunités off-market" },
    { number: "02", title: "Analyse", desc: "Due diligence approfondie" },
    { number: "03", title: "Acquisition", desc: "Négociation et financement" },
    { number: "04", title: "Rénovation", desc: "Travaux BBC pilotés" },
    { number: "05", title: "Location", desc: "Mise en marché optimisée" },
    { number: "06", title: "Arbitrage", desc: "Cession stratégique" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-[#1E3A5F] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 left-0 w-96 h-96 border border-white/20 rounded-full transform -translate-x-1/2 translate-y-1/2" />
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
                Nos services
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Parcours clé en main
            </h1>
            <p className="text-xl text-white/70">
              Un accompagnement complet de l'acquisition à l'arbitrage, piloté par une équipe 
              d'experts dédiée à la création de valeur patrimoniale durable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 flex items-center gap-4"
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm min-w-[200px]">
                  <span className="text-3xl font-bold text-[#C9A961]">{step.number}</span>
                  <h3 className="font-semibold text-[#1E3A5F] mt-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <ArrowRight className="h-6 w-6 text-[#C9A961] flex-shrink-0" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
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
                Expertise complète
              </span>
              <div className="w-12 h-1 bg-[#C9A961]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1E3A5F] mb-4">
              Nos domaines d'expertise
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une chaîne de valeur intégrée pour maximiser la performance de vos investissements
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-[#C9A961]/30"
              >
                <div className="w-16 h-16 bg-[#1E3A5F] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#C9A961] transition-colors">
                  <service.icon className="h-8 w-8 text-[#C9A961] group-hover:text-[#1E3A5F] transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-[#1E3A5F] mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-[#C9A961] rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-24 bg-[#1E3A5F]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Pourquoi choisir notre gestion ?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10 text-center"
            >
              <div className="w-16 h-16 bg-[#C9A961] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-[#1E3A5F]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Zéro gestion</h3>
              <p className="text-white/70">
                Nous nous occupons de tout, de A à Z. Vous profitez des revenus sans les contraintes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10 text-center"
            >
              <div className="w-16 h-16 bg-[#C9A961] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-[#1E3A5F]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Transparence totale</h3>
              <p className="text-white/70">
                Reporting régulier, accès aux informations et gouvernance participative.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10 text-center"
            >
              <div className="w-16 h-16 bg-[#C9A961] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-[#1E3A5F]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Équipe dédiée</h3>
              <p className="text-white/70">
                Une équipe pluridisciplinaire à temps plein au service de votre investissement.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#C9A961]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-[#1E3A5F] mb-4">
            Prêt à déléguer votre investissement immobilier ?
          </h2>
          <p className="text-[#1E3A5F]/80 mb-8">
            Rejoignez La Foncière Patrimoniale et bénéficiez de notre expertise complète.
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