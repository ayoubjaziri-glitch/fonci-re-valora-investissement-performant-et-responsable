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
  FileText } from
'lucide-react';
import { Button } from "@/components/ui/button";
import DynamicSections from '../components/DynamicSections';
import { useSiteContent } from '../hooks/useSiteContent';

export default function Services() {
  const { get } = useSiteContent();
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
    description: "Sourcing stratégique d'actifs résidentiels présentant un potentiel de valorisation durable.",
    features: ["Analyse multicritères structurée", "Négociation maîtrisée", "Due diligence approfondie"]
  },
  {
    icon: Hammer,
    title: "Rénovation & Valorisation BBC",
    description: "Travaux pilotés par experts BTP avec objectif DPE A ou B systématique.",
    features: ["Plus-value latentes +10–15%", "Réseau de 30+ entreprises BTP", "Conformité énergétique garantie"]
  },
  {
    icon: Users,
    title: "Gestion déléguée, vision partagée",
    description: "La gestion opérationnelle est intégralement pilotée par la foncière, permettant aux investisseurs de rester concentrés sur leur stratégie patrimoniale tout en conservant une lecture claire des actifs et des décisions structurantes.",
    features: ["Gestion opérationnelle complète", "Reporting régulier", "Gouvernance transparente"]
  },
  {
    icon: HomeIcon,
    title: "Gestion locative & Pilotage",
    description: "Commercialisation multi-canaux visant un taux d'occupation cible supérieur à 98 %.",
    features: ["Sélection rigoureuse des locataires", "Reporting semestriel structuré", "Suivi administratif et financier des flux locatifs"]
  },
  {
    icon: Briefcase,
    title: "Arbitrage Stratégique & Fiscalité",
    description: "Cessions d'actifs, en bloc ou de manière sélective, intégrant une approche patrimoniale et un cadre fiscal adapté, notamment via le PEA-PME.",
    features: ["Stratégie de sortie structurée dans une logique de long terme", "Cadre fiscal pouvant bénéficier des dispositifs en vigueur, dont le PEA-PME", "Valorisation progressive du patrimoine"]
  }];


  const processSteps = [
  { number: "01", title: "Sourcing", desc: "Identification d'opportunités, y compris hors marché" },
  { number: "02", title: "Analyse", desc: "Études approfondies et due diligence structurée" },
  { number: "03", title: "Acquisition", desc: "Structuration, négociation et financement des opérations" },
  { number: "04", title: "Réhabilitation", desc: "Programmes de rénovation BBC pilotés et suivis" },
  { number: "05", title: "Exploitation locative", desc: "Mise en location et gestion optimisée des actifs" },
  { number: "06", title: "Arbitrage", desc: "Cessions et réallocations stratégiques du portefeuille" }];


  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-[#1E3A5F] overflow-hidden">
        <div className="bg-slate-900 opacity-100 absolute inset-0">
          <div className="absolute bottom-0 left-0 w-96 h-96 border border-white/20 rounded-full transform -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                {get('missions_hero_accroche', 'Nos missions')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              {get('missions_hero_titre', 'Nos missions')}
            </h1>
            <p className="text-xl text-white/70">
              {get('missions_hero_description', "Une gestion institutionnelle de l'acquisition à l'arbitrage, pilotée par une équipe d'experts dédiée à la création de valeur patrimoniale durable.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Timeline - Enhanced for better visibility */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12">

            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">{get('missions_process_titre', "Processus d'investissement structuré")}

            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {get('missions_process_description', 'Six étapes maîtrisées pour maximiser la création de valeur patrimoniale')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((step, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all">

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#1A3A52] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-[#C9A961]">{step.number}</span>
                  </div>
                  <h3 className="font-semibold text-[#1A3A52] text-lg">{step.title}</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            )}
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
            className="text-center mb-16">

            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                {get('missions_expertise_accroche', 'Expertise complète')}
              </span>
              <div className="w-12 h-1 bg-[#C9A961]" />
            </div>
            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">{get('missions_expertise_titre', "Nos domaines d'expertise")}

            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {get('missions_expertise_description', 'Une chaîne de valeur intégrée pour maximiser la performance de vos investissements')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:border-[#C9A961] hover:-translate-y-2">

                <div className="w-16 h-16 bg-[#1A3A52] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#C9A961] transition-all duration-300 group-hover:scale-110">
                  <service.icon className="h-8 w-8 text-[#C9A961] group-hover:text-[#1A3A52] transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-[#1A3A52] mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) =>
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-[#C9A961] rounded-full" />
                      {feature}
                    </li>
                )}
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">

            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            {get('missions_pourquoi_titre', 'Pourquoi choisir notre gestion ?')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">

              <div className="w-16 h-16 bg-[#C9A961] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-[#1E3A5F]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 text-center">{get('missions_avantage1_titre', 'Gestion intégrée')}</h3>
              <p className="text-white/70">{get('missions_avantage1_description', "La Foncière Valora assure le pilotage global des opérations immobilières : sélection, structuration, suivi et valorisation dans une logique patrimoniale de long terme.")}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">

              <div className="w-16 h-16 bg-[#C9A961] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-[#1E3A5F]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 text-center">{get('missions_avantage2_titre', 'Information & Gouvernance')}</h3>
              <p className="text-white/70">{get('missions_avantage2_description', "Une communication périodique et une organisation de la gouvernance permettent aux partenaires concernés de suivre l'évolution des opérations et les orientations stratégiques.")}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">

              <div className="w-16 h-16 bg-[#C9A961] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-[#1E3A5F]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 text-center">{get('missions_avantage3_titre', 'Pilotage opérationnel')}</h3>
              <p className="text-white/70">{get('missions_avantage3_description', "Une organisation structurée réunissant des compétences complémentaires au service du développement et de la gestion des actifs.")}</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center">

            <p className="text-xl text-white/90 italic font-serif">{get('missions_conclusion_titre', 'Aux côtés de La Foncière Valora')}</p>
            <p className="text-white/70 mt-4 max-w-3xl mx-auto">
              {get('missions_conclusion_description', 'Découvrez une approche immobilière fondée sur un pilotage professionnel, une vision durable et un cadre de collaboration défini au cas par cas.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sections personnalisées */}
      <DynamicSections page="missions" />

      {/* CTA */}
      <section className="py-16 bg-[#C9A961]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-slate-900 mb-4 text-2xl font-serif md:text-3xl">S’associer à notre dynamique de valorisation

          </h2>
          <p className="text-[#1A3A52]/80 mb-8">
            Accédez à une exposition immobilière organisée autour d'un pilotage professionnel et d'une gouvernance claire.
          </p>
          <Link to={createPageUrl("Contact")}>
            <Button className="bg-slate-800 text-white px-8 py-6 text-sm font-semibold rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 hover:bg-[#2A4A6F]">
              Entrer en relation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>);

}