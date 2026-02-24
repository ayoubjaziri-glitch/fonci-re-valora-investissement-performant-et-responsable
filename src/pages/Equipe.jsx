import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  Building2, Users, TrendingUp, Target, ArrowRight, 
  Briefcase, Award, Network, Lightbulb
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Equipe() {
  const founders = [
    {
      name: "Ayoub Jaziri",
      role: "Cofondateur",
      focus: "Vision opérationnelle",
      description: "Ayoub Jaziri porte la vision opérationnelle de la foncière et accompagne la mise en œuvre concrète des projets immobiliers.",
      experience: "Il intervient sur l'architecture financière des opérations, la relation avec les partenaires investisseurs et clients, ainsi que la coordination des acteurs impliqués dans le développement et la valorisation des actifs. Son action s'inscrit dans une logique de structuration durable et de suivi opérationnel des projets.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
    },
    {
      name: "Sofhian Naili",
      role: "Cofondateur",
      focus: "Gouvernance juridique & Vision stratégique",
      description: "De formation juridique, Sofhian Naili est également fondateur du Groupe Auvergne et Patrimoine, actif dans la structuration et la valorisation d'actifs immobiliers depuis 2008.",
      experience: "Il assure la gouvernance juridique et la vision stratégique de la foncière, veille à la structuration statutaire, à l'équilibre entre les associés et au respect des principes d'éthique et de loyauté, tout en sécurisant la trajectoire de développement dans une logique patrimoniale de long terme. Il anime également, aux côtés d'Ayoub Jaziri, la relation avec les investisseurs et les partenaires stratégiques.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"
    }
  ];

  const team = [
    {
      name: "Renaud Marchand",
      role: "Investisseur stratégique",
      focus: "Expertise technique BTP",
      description: "Ingénieur BTP de formation, multi-entrepreneur et président de la société SCABB, Renaud Marchand dirige plusieurs entreprises spécialisées dans le domaine du gros œuvre.",
      experience: "Fort d'une expertise reconnue dans le secteur du bâtiment, il intervient au sein de la foncière en qualité d'investisseur stratégique, apportant une lecture technique et opérationnelle des projets et contribuant à une dynamique d'association fondée sur une vision patrimoniale de long terme et un alignement durable des intérêts entre associés.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"
    },
    {
      name: "Christophe Gironde",
      role: "Directeur administratif",
      focus: "Société Gabriel",
      description: "Ancien libraire durant quatorze ans et conférencier, Christophe Gironde a rejoint le groupe en 2022.",
      experience: "Il assure la direction administrative au sein de la société Gabriel, structure de présidence de la foncière, et veille à la coordination administrative des opérations. Il suit la validation, la présentation et la mise en forme des propositions ainsi que des accords d'association, veille à la tenue des registres et assure la coordination avec les partenaires juridiques, financiers et opérationnels. En lien avec les partenaires culturels du groupe, il participe également à l'ouverture de la foncière vers des initiatives patrimoniales et culturelles, dans une démarche respectueuse des territoires et des usages.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80"
    }
  ];

  const strengths = [
    {
      icon: Award,
      title: "18 ans d'historique cumulée",
      description: "Expertise éprouvée sur l'immobilier résidentiel"
    },
    {
      icon: Network,
      title: "Chaîne de valeur intégrée",
      description: "De la levée de fonds au sourcing, financement, travaux BBC, location et arbitrage"
    },
    {
      icon: Lightbulb,
      title: "Accès privilégié",
      description: "Opportunités exclusives et exécution rapide dans les zones tendues"
    }
  ];

  const groupStats = [
    { label: "Actifs sous gestion", value: "3 M€" },
    { label: "Entreprises BTP", value: "30+" },
    { label: "Collaborateurs", value: "4" },
    { label: "Années d'expertise", value: "18 ans" }
  ];

  const trajectory = [
    { year: "2026", value: "1,25 M€" },
    { year: "2027", value: "2,5 M€" },
    { year: "2028", value: "5 M€" },
    { year: "2029", value: "10 M€" },
    { year: "2030", value: "15 M€" },
    { year: "2031", value: "20 M€" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-[#1A3A52] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 border border-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
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
                Équipe fondatrice
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Gouvernance et pilotage opérationnel
            </h1>
            <p className="text-xl text-white/70">
              Une organisation structurée réunissant des compétences complémentaires au service 
              d'une stratégie patrimoniale de long terme.
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
            <h2 className="text-3xl md:text-4xl font-serif text-[#1A3A52] mb-4">
              Les fondateurs
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Fondateurs et associés stratégiques mobilisant leurs compétences au service du projet
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {founders.map((founder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl transition-shadow"
              >
                <div className="relative h-80">
                  <img 
                    src={founder.image} 
                    alt={founder.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A3A52]/90 via-[#1A3A52]/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="mb-2">
                      <span className="text-[#C9A961] text-sm font-medium tracking-wider uppercase">
                        {founder.role}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-2">{founder.name}</h3>
                    <p className="text-white/80 text-sm font-medium">{founder.focus}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-700 mb-4">{founder.description}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{founder.experience}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl transition-shadow"
              >
                <div className="relative h-80">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A3A52]/90 via-[#1A3A52]/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="mb-2">
                      <span className="text-[#C9A961] text-sm font-medium tracking-wider uppercase">
                        {member.role}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-2">{member.name}</h3>
                    <p className="text-white/80 text-sm font-medium">{member.focus}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-700 mb-4">{member.description}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{member.experience}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[#1A3A52] mb-4">
              Forces clés de l'équipe
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {strengths.map((strength, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center border border-slate-200"
              >
                <div className="w-16 h-16 bg-[#1A3A52] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <strength.icon className="h-8 w-8 text-[#C9A961]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A3A52] mb-2">{strength.title}</h3>
                <p className="text-slate-600 text-sm">{strength.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Group Structure */}
      <section className="py-24 bg-[#1A3A52]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block bg-[#C9A961] text-[#1A3A52] px-4 py-2 rounded-full text-sm font-bold mb-6">
              Depuis 2008
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Structure du groupe
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Un groupe établi et éprouvé avec 18 ans d'expertise en immobilier patrimonial
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Parent Company */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8 text-center border-2 border-[#C9A961]"
            >
              <Building2 className="h-12 w-12 text-[#C9A961] mx-auto mb-4" />
              <h3 className="text-2xl font-serif text-white mb-2">Auvergne & Patrimoine</h3>
              <p className="text-[#C9A961] font-medium mb-4">Holding du groupe • Établi et éprouvé</p>
              <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-2xl font-bold text-white">18 ans</p>
                  <p className="text-white/60 text-sm">D'expertise</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-2xl font-bold text-[#C9A961]">3 M€</p>
                  <p className="text-white/60 text-sm">Valorisation</p>
                </div>
              </div>
            </motion.div>

            {/* Subsidiaries */}
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10"
              >
                <div className="w-12 h-12 bg-[#C9A961] rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Building2 className="h-6 w-6 text-[#1A3A52]" />
                </div>
                <h4 className="text-white font-semibold mb-2">BVS</h4>
                <p className="text-white/60 text-sm">Blaise Vichy Séjours</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10"
              >
                <div className="w-12 h-12 bg-[#C9A961] rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-[#1A3A52]" />
                </div>
                <h4 className="text-white font-semibold mb-2">SA Gabriel</h4>
                <p className="text-white/60 text-sm">Présidente des sociétés</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-[#C9A961] rounded-2xl p-6 text-center border-2 border-[#C9A961]"
              >
                <div className="w-12 h-12 bg-[#1A3A52] rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-[#C9A961]" />
                </div>
                <h4 className="text-[#1A3A52] font-bold mb-2">La Foncière Patrimoniale</h4>
                <p className="text-[#1A3A52]/80 text-sm">Objet de cette présentation</p>
              </motion.div>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {groupStats.map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Growth Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[#1A3A52] mb-4">
              Trajectoire de développement
            </h2>
            <p className="text-slate-600">La Foncière Patrimoniale — 5 ans de croissance</p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-[#C9A961]/20" />
            <div className="absolute top-8 left-0 h-1 bg-[#C9A961]" style={{ width: '50%' }} />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
              {trajectory.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    index === 0 ? 'bg-[#1A3A52]' : index === trajectory.length - 1 ? 'bg-[#C9A961]' : 'bg-white border-2 border-[#C9A961]'
                  }`}>
                    <span className={`text-lg font-bold ${
                      index === 0 ? 'text-[#C9A961]' : index === trajectory.length - 1 ? 'text-[#1A3A52]' : 'text-[#C9A961]'
                    }`}>
                      {item.year.slice(2)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">{item.year}</p>
                  <p className="text-xl font-bold text-[#1A3A52]">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-r from-[#1A3A52] to-[#2A4A6F] rounded-2xl p-8 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Target className="h-6 w-6 text-[#C9A961]" />
              <h3 className="text-xl font-serif text-white">Objectif 5 ans</h3>
            </div>
            <p className="text-4xl font-bold text-[#C9A961] mb-2">20 M€</p>
            <p className="text-white/70">d'actifs sous gestion</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#C9A961]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-serif text-[#1A3A52] mb-4">
              Rejoignez une équipe d'experts
            </h2>
            <p className="text-[#1A3A52]/80 mb-8">
              Portée par un groupe solide depuis 2008, contribuez à la création de valeur patrimoniale durable.
            </p>
            <Link to={createPageUrl("Contact")}>
              <Button className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white px-8 py-6 font-semibold">
                Devenir associé
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}