import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import {
  Building2, Users, TrendingUp, Target, ArrowRight,
  Briefcase, Award, Network, Lightbulb } from
'lucide-react';
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { base44 } from '@/api/base44Client';
import DynamicSections from '../components/DynamicSections';

export default function Equipe() {
  const { data: images = [] } = useQuery({
    queryKey: ['site-images'],
    queryFn: () => base44.entities.SiteImage.list(),
    initialData: []
  });

  const { data: membresDB = [] } = useQuery({
    queryKey: ['membres-equipe'],
    queryFn: () => base44.entities.MembreEquipe.list('ordre', 100),
    initialData: []
  });

  const getImageUrl = (key, fallback) => {
    const image = images.find((img) => img.key === key);
    return image?.url || fallback;
  };

  // Données statiques de fallback si la BDD est vide
  const staticFounders = [
  {
    name: "Ayoub Jaziri", role: "Cofondateur", focus: "Vision opérationnelle",
    description: "Ayoub Jaziri porte la vision opérationnelle de la foncière et accompagne la mise en œuvre concrète des projets immobiliers.",
    experience: "Il intervient sur l'architecture financière des opérations, la relation avec les partenaires investisseurs et clients, ainsi que la coordination des acteurs impliqués dans le développement et la valorisation des actifs.",
    imageKey: "photo_ayoub"
  },
  {
    name: "Sofhian Naili", role: "Cofondateur", focus: "Gouvernance juridique & Vision stratégique",
    description: "De formation juridique, Sofhian Naili est également fondateur du Groupe Auvergne et Patrimoine, actif dans la structuration et la valorisation d'actifs immobiliers depuis 2008.",
    experience: "Il assure la gouvernance juridique et la vision stratégique de la foncière, veille à la structuration statutaire, à l'équilibre entre les associés et au respect des principes d'éthique et de loyauté.",
    imageKey: "photo_sophian"
  }];

  const staticTeam = [
  { name: "Renaud Marchand", role: "Investisseur stratégique", focus: "Expertise technique BTP", description: "Ingénieur BTP, président de SCABB, apporte son expertise technique sur les projets de réhabilitation.", imageKey: "photo_renaud" },
  { name: "Christophe Gironde", role: "Directeur administratif", focus: "Coordination opérationnelle", description: "Assure la direction administrative et la coordination des opérations au sein de la société Gabriel.", imageKey: "photo_christophe" },
  { name: "Marie Dupont", role: "Responsable gestion locative", focus: "Relations locataires", description: "Pilote la gestion locative, le suivi des occupants et l'optimisation du taux d'occupation.", imageKey: "photo_marie" },
  { name: "Thomas Laurent", role: "Chargé de financement", focus: "Structuration bancaire", description: "Gère les relations bancaires, montages financiers et optimisation de l'effet de levier.", imageKey: "photo_thomas" },
  { name: "Sophie Martin", role: "Comptable", focus: "Reporting financier", description: "Assure la comptabilité, le reporting financier et le suivi des indicateurs de performance.", imageKey: "photo_sophie" },
  { name: "Lucas Mercier", role: "Chargé d'acquisition", focus: "Sourcing & négociation", description: "Identifie et négocie les opportunités d'acquisition off-market auprès des notaires et agents.", imageKey: "photo_lucas" }
  ];

  const activeMembers = membresDB.filter(m => m.actif);
  const dbFounders = activeMembers.filter(m => m.type === 'fondateur');
  const dbTeam = activeMembers.filter(m => m.type === 'membre');

  // Utilise la BDD si elle contient des données, sinon fallback statique
  const founders = dbFounders.length > 0 ? dbFounders.map(m => ({
    name: m.nom, role: m.role, focus: m.focus, description: m.description, experience: m.experience, image: m.image_url
  })) : staticFounders;

  const team = dbTeam.length > 0 ? dbTeam.map(m => ({
    name: m.nom, role: m.role, focus: m.focus, description: m.description, image: m.image_url
  })) : staticTeam;


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
  }];


  const groupStats = [
  { label: "Actifs sous gestion", value: "3 M€" },
  { label: "Entreprises BTP", value: "30+" },
  { label: "Collaborateurs", value: "4" },
  { label: "Années d'expertise", value: "18 ans" }];


  const trajectory = [
  { year: "2026", value: "1,25 M€" },
  { year: "2027", value: "2,5 M€" },
  { year: "2028", value: "5 M€" },
  { year: "2029", value: "10 M€" },
  { year: "2030", value: "15 M€" },
  { year: "2031", value: "20 M€" }];


  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-[#1A3A52] overflow-hidden">
        <div className="bg-slate-900 opacity-100 absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 border border-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                Équipe fondatrice
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Notre histoire
            </h1>
            <p className="text-xl text-white/70">
              Un collectif d'associés opérationnels intervenant à tous les niveaux de la chaîne de valeur, 
              uni par une vision patrimoniale de long terme et un alignement durable des intérêts.
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
            className="text-center mb-16">

            <h2 className="text-3xl md:text-4xl font-serif text-[#1A3A52] mb-4">
              Associés opérationnels & Gouvernance
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Un collectif d'associés opérationnels intervenant à tous les niveaux de la chaîne de valeur
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
            {founders.map((founder, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow">

                <div className="relative h-56">
                  <img
                  src={founder.image || getImageUrl(founder.imageKey, '')}
                  alt={founder.name}
                  className="w-full h-full object-cover" />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A3A52]/90 via-[#1A3A52]/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="mb-1">
                      <span className="text-[#C9A961] text-xs font-medium tracking-wider uppercase">
                        {founder.role}
                      </span>
                    </div>
                    <h3 className="text-lg font-serif text-white mb-1">{founder.name}</h3>
                    <p className="text-white/80 text-xs font-medium">{founder.focus}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-slate-700 text-sm mb-3">{founder.description}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{founder.experience}</p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {team.map((member, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-md transition-shadow">

                <div className="relative h-40">
                  <img
                  src={member.image || getImageUrl(member.imageKey, '')}
                  alt={member.name}
                  className="w-full h-full object-cover" />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A3A52]/90 via-[#1A3A52]/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-base font-semibold text-white mb-1">{member.name}</h3>
                    <p className="text-[#C9A961] text-xs font-medium">{member.role}</p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-slate-600 mb-2">{member.focus}</p>
                  <p className="text-xs text-slate-500">{member.description}</p>
                </div>
              </motion.div>
            )}
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
            className="text-center mb-12">

            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">Forces clés de l'équipe

            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {strengths.map((strength, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 text-center border border-slate-200">

                <div className="w-16 h-16 bg-[#1A3A52] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <strength.icon className="h-8 w-8 text-[#C9A961]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A3A52] mb-2">{strength.title}</h3>
                <p className="text-slate-600 text-sm">{strength.description}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Group Structure */}
      <section className="bg-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">

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
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8 text-center border-2 border-[#C9A961]">

              <Building2 className="h-12 w-12 text-[#C9A961] mx-auto mb-4" />
              <h3 className="text-2xl font-serif text-white mb-2">Auvergne & Patrimoine</h3>
              <p className="text-[#C9A961] font-medium mb-4">Holding du groupe • Établi et éprouvé</p>
              <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-2xl font-bold text-white">18 ans</p>
                  <p className="text-white/60 text-sm">D'expertise</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-2xl font-bold text-[#C9A961]">3.7 M€</p>
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
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">

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
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">

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
                className="bg-[#C9A961] rounded-2xl p-6 text-center border-2 border-[#C9A961]">

                <div className="w-12 h-12 bg-[#1A3A52] rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-[#C9A961]" />
                </div>
                <h4 className="text-[#1A3A52] font-bold mb-2"> Foncière Valora</h4>
                <p className="text-[#1A3A52]/80 text-sm">Objet de cette présentation</p>
              </motion.div>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">

            {groupStats.map((stat, index) =>
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            )}
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
            className="text-center mb-16">

            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">Trajectoire de développement

            </h2>
            <p className="text-slate-600">La Foncière Valora — 5 ans de croissance</p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-[#C9A961]/20" />
            <div className="absolute top-8 left-0 h-1 bg-[#C9A961]" style={{ width: '50%' }} />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
              {trajectory.map((item, index) =>
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center">

                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                index === 0 ? 'bg-[#1A3A52]' : index === trajectory.length - 1 ? 'bg-[#C9A961]' : 'bg-white border-2 border-[#C9A961]'}`
                }>
                    <span className={`text-lg font-bold ${
                  index === 0 ? 'text-[#C9A961]' : index === trajectory.length - 1 ? 'text-[#1A3A52]' : 'text-[#C9A961]'}`
                  }>
                      {item.year.slice(2)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">{item.year}</p>
                  <p className="text-xl font-bold text-[#1A3A52]">{item.value}</p>
                </motion.div>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="bg-slate-900 mt-16 p-8 text-center rounded-2xl from-[#1A3A52] to-[#2A4A6F]">


            <div className="flex items-center justify-center gap-3 mb-4">
              <Target className="h-6 w-6 text-[#C9A961]" />
              <h3 className="text-xl font-serif text-white">Objectif 5 ans</h3>
            </div>
            <p className="text-4xl font-bold text-[#C9A961] mb-2">20 M€</p>
            <p className="text-white/70">d'actifs sous gestion</p>
          </motion.div>
        </div>
      </section>

      {/* Sections personnalisées */}
      <DynamicSections page="equipe" />

      {/* CTA */}
      <section className="py-16 bg-[#C9A961]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>

            <h2 className="text-slate-900 mb-4 text-2xl font-serif md:text-3xl">Rejoignez une équipe d'experts

            </h2>
            <p className="text-[#1A3A52]/80 mb-8">
              Portée par un groupe solide depuis 2008, contribuez à la création de valeur patrimoniale durable.
            </p>
            <Link to={createPageUrl("Contact")}>
              <Button className="bg-slate-900 text-white px-8 py-6 text-sm font-semibold rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 hover:bg-[#2A4A6F]">
                Devenir associé
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>);

}