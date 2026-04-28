import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Quote, Building2, Users, TrendingUp, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import DynamicSections from '../components/DynamicSections';

const ecosysteme = [
  {
    emoji: '🏛️',
    category: 'Architectes',
    title: 'Vision architecturale & valorisation',
    description: "Les architectes partenaires interviennent sur la conception des projets de réhabilitation, apportant une signature architecturale respectueuse du patrimoine bâti tout en intégrant les exigences de performance énergétique.",
    values: [
      "Rôle clé dans la valorisation des actifs",
      "Vision patrimoniale de long terme",
      "Signature architecturale soignée",
    ],
  },
  {
    emoji: '🏗️',
    category: 'Entreprises BTP',
    title: 'Excellence opérationnelle',
    description: "Les entreprises du bâtiment avec lesquelles nous collaborons sont sélectionnées pour leur savoir-faire technique, leur engagement dans la transition énergétique et leur capacité à respecter les standards de performance énergétique.",
    values: [
      "Qualité d'exécution garantie",
      "Engagement dans la transition énergétique",
      "Partenaires techniques de confiance",
    ],
  },
  {
    emoji: '⚖️',
    category: 'Notaires & Avocats',
    title: 'Sécurisation juridique',
    description: "Accompagnement par des notaires et cabinets d'avocats spécialisés en droit immobilier, en structuration de sociétés et en gouvernance patrimoniale.",
    values: [
      "Sécurisation des opérations",
      "Structuration juridique adaptée",
      "Conformité réglementaire",
    ],
  },
  {
    emoji: '🏠',
    category: 'Agents immobiliers',
    title: 'Sourcing & commercialisation',
    description: "Réseau d'agents immobiliers pour l'accès à des opportunités off-market et la commercialisation locative des actifs réhabilités.",
    values: [
      "Accès privilégié au marché",
      "Connaissance locale approfondie",
      "Réactivité commerciale",
    ],
  },
  {
    emoji: '🏦',
    category: 'Établissements bancaires',
    title: 'Financement structuré',
    description: "Partenariats avec des établissements de crédit pour structurer des financements adaptés aux opérations d'acquisition et de rénovation.",
    values: [
      "Conditions négociées",
      "Relations de long terme",
      "Expertise financement immobilier",
    ],
  },
  {
    emoji: '🤝',
    category: 'Partenaires patrimoniaux',
    title: 'Accompagnement durable',
    description: "Des acteurs engagés dans la durée qui accompagnent les projets immobiliers par leur expertise, leur réseau et leur vision stratégique, contribuant à la pérennité du développement de la foncière.",
    values: [
      "Acteurs engagés dans la durée",
      "Accompagnement structuré des projets",
      "Alignement sur une vision patrimoniale",
    ],
  },
];

const stats = [
  { valeur: '6', label: 'Métiers représentés' },
  { valeur: '15+', label: 'Partenaires actifs' },
  { valeur: '100%', label: 'Sélectionnés sur dossier' },
  { valeur: '5 ans', label: "Durée moyenne d'engagement" },
];

const etapes = [
  { titre: 'Identification', desc: 'Repérage des acteurs de référence sur leurs marchés locaux et nationaux.' },
  { titre: 'Audit de dossier', desc: 'Analyse des références, certifications, capacité financière et engagements ESG.' },
  { titre: 'Mission test', desc: 'Première collaboration sur une opération pour valider le niveau de qualité et de réactivité.' },
  { titre: 'Intégration', desc: "Référencement dans notre panel de partenaires avec un suivi qualité régulier sur l'ensemble des missions." },
];

const valeurs = [
  {
    icon: Shield,
    titre: 'Confiance',
    desc: 'Chaque partenaire est sélectionné sur la base de critères stricts de professionnalisme et d\'intégrité.',
  },
  {
    icon: TrendingUp,
    titre: 'Performance',
    desc: 'Nous collaborons avec des acteurs dont l\'excellence opérationnelle est reconnue sur leurs marchés.',
  },
  {
    icon: Users,
    titre: 'Engagement',
    desc: 'Nos relations partenariales s\'inscrivent dans la durée, pour une création de valeur partagée et durable.',
  },
  {
    icon: Building2,
    titre: 'Complémentarité',
    desc: 'Un écosystème couvrant l\'intégralité du cycle immobilier, de l\'acquisition à la valorisation locative.',
  },
];

export default function Partenaires() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, #C9A961 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">Écosystème</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Écosystème de partenaires
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Plus qu'une équipe, un modèle d'engagement : nous intégrons nos partenaires techniques et patrimoniaux au cœur de notre structure capitalistique. En alliant leurs expertises à nos objectifs de croissance, nous assurons une exécution fluide et une création de valeur optimisée à chaque cycle d'investissement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grille partenaires */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">Nos partenaires métiers</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Des acteurs qualifiés intervenant sur l'ensemble du cycle de valorisation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ecosysteme.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">{p.emoji}</span>
                  </div>
                  <div>
                    <p className="text-sm text-[#C9A961] font-medium uppercase tracking-wider mb-1">{p.category}</p>
                    <h3 className="text-xl font-serif text-[#1A3A52]">{p.title}</h3>
                  </div>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">{p.description}</p>
                <div className="space-y-2">
                  {p.values.map((val, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#C9A961] flex-shrink-0" />
                      <span className="text-sm text-slate-600">{val}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-3xl font-bold text-[#C9A961] mb-1">{s.valeur}</p>
                <p className="text-sm text-slate-600">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Groupe Auvergne et Patrimoine */}
      <section className="py-16 bg-[#1A3A52]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-1 bg-[#C9A961]" />
                <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">Notre ancrage</span>
              </div>
              <h2 className="text-3xl font-serif text-white mb-6">Groupe Auvergne et Patrimoine</h2>
              <p className="text-white/70 leading-relaxed mb-6">
                La Foncière Valora s'appuie sur les expertises et le réseau du Groupe Auvergne et Patrimoine, fondé en 2008. Ce groupe spécialisé dans le conseil en gestion de patrimoine et en investissement immobilier constitue le socle sur lequel la foncière développe ses opérations.
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                Cette appartenance à un groupe structuré apporte à la foncière un accès privilégié à un réseau d'investisseurs, à des opportunités de sourcing off-market, et à une expertise patrimoniale et financière reconnue.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: '2008', label: 'Année de création du groupe' },
                  { val: '15 ans', label: "D'expérience patrimoniale" },
                  { val: 'Vichy', label: 'Ancrage Auvergne-Rhône-Alpes' },
                  { val: '360°', label: 'Vision patrimoniale globale' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-4">
                    <p className="text-[#C9A961] font-bold text-xl">{item.val}</p>
                    <p className="text-white/60 text-sm mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {/* Citation */}
              <div className="bg-white/10 rounded-3xl p-8 border border-white/20">
                <Quote className="h-10 w-10 text-[#C9A961] mb-4" />
                <p className="text-white text-lg leading-relaxed italic mb-6">
                  "Notre conviction est que la création de valeur durable dans l'immobilier résidentiel passe par une approche intégrée : sourcing off-market, réhabilitation énergétique, et gestion active des actifs. L'écosystème que nous avons constitué autour de la foncière reflète cette vision."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#C9A961] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    AJ
                  </div>
                  <div>
                    <p className="text-white font-semibold">Ayoub Jaziri</p>
                    <p className="text-white/50 text-sm">Fondateur, La Foncière Valora</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nos valeurs partenariales */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-serif text-[#1A3A52] mb-3">Nos valeurs partenariales</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Les principes qui guident chaque relation partenariale que nous nouons.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {valeurs.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <div className="w-12 h-12 bg-[#C9A961]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-[#C9A961]" />
                  </div>
                  <h4 className="font-semibold text-[#1A3A52] mb-2">{v.titre}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Processus sélection */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-serif text-[#1A3A52] mb-3">Comment nous sélectionnons nos partenaires</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Chaque partenaire intègre notre réseau après un processus rigoureux garant de la qualité de nos opérations.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {etapes.map((e, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-8 h-8 bg-[#C9A961] rounded-full flex items-center justify-center text-white font-bold text-sm mb-4">
                  {i + 1}
                </div>
                <h4 className="font-semibold text-[#1A3A52] mb-2">{e.titre}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{e.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DynamicSections bottom */}
      <DynamicSections page="ecosysteme" orderRange={[4, 99]} />

      {/* CTA */}
      <section className="py-16 bg-[#C9A961]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">Rejoindre notre écosystème</h2>
            <p className="text-slate-800 mb-8 max-w-2xl mx-auto">
              Vous êtes un professionnel de l'immobilier, un architecte, une entreprise du bâtiment ou un investisseur patrimonial ? Découvrez comment collaborer avec La Foncière Valora.
            </p>
            <Link to={createPageUrl("Contact")}>
              <Button className="bg-slate-900 hover:bg-[#2A4A6F] text-white px-8 py-4 text-base font-semibold rounded-md gap-2">
                Nous contacter
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}