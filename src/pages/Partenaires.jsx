import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ecosysteme = [
  {
    logoUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/1/18/Logo_UNSFA.svg/200px-Logo_UNSFA.svg.png',
    logoAlt: 'Architecture',
    logoBg: 'bg-white',
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
    logoUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/5/52/Logo_FFB.svg/200px-Logo_FFB.svg.png',
    logoAlt: 'BTP',
    logoBg: 'bg-white',
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
    logoUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/0/09/Logo_Conseil_Superieur_du_Notariat.svg/200px-Logo_Conseil_Superieur_du_Notariat.svg.png',
    logoAlt: 'Notaires',
    logoBg: 'bg-white',
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
    logoUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/4/44/Logo_FNAIM.svg/200px-Logo_FNAIM.svg.png',
    logoAlt: 'Agents immobiliers',
    logoBg: 'bg-white',
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
    logoUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/e/e4/Logo_FBF.svg/200px-Logo_FBF.svg.png',
    logoAlt: 'Banques',
    logoBg: 'bg-white',
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
    logoUrl: null,
    logoAlt: 'Patrimoniaux',
    logoBg: 'bg-[#1A3A52]',
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

export default function Partenaires() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">Écosystème</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Écosystème de partenaires
            </h1>
            <p className="text-xl text-white/70">
              Plus qu'une équipe, un modèle d'engagement : nous intégrons nos partenaires techniques et patrimoniaux au cœur de notre structure capitalistique. En alliant leurs expertises à nos objectifs de croissance, nous assurons une exécution fluide et une création de valeur optimisée à chaque cycle d'investissement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-2xl font-serif text-[#1A3A52] mb-2">Notre réseau en action</h2>
            <p className="text-slate-500">Un réseau dense de professionnels qualifiés pour une exécution irréprochable.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-slate-50 rounded-2xl">
                <p className="text-3xl font-bold text-[#C9A961] mb-1">{s.valeur}</p>
                <p className="text-sm text-slate-600">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Grille partenaires */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">Nos partenaires</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Des acteurs qualifiés intervenant sur l'ensemble du cycle de valorisation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ecosysteme.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-200 ${p.logoBg}`}>
                    {p.logoUrl ? (
                      <img src={p.logoUrl} alt={p.logoAlt} className="w-12 h-12 object-contain"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                    ) : null}
                    <span className="text-2xl items-center justify-center w-full h-full" style={{ display: p.logoUrl ? 'none' : 'flex' }}>
                      {p.emoji}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-[#C9A961] font-medium uppercase tracking-wider mb-1">{p.category}</p>
                    <h3 className="text-xl font-serif text-[#1A3A52]">{p.title}</h3>
                  </div>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">{p.description}</p>
                <div className="space-y-2">
                  {p.values.map((v, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#C9A961] flex-shrink-0" />
                      <span className="text-sm text-slate-600">{v}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
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

      {/* CTA */}
      <section className="py-16 bg-[#C9A961]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">Partenaires et opérateurs</h2>
            <p className="text-slate-800 mb-8">
              La foncière développe ses projets avec des partenaires : investisseurs privés, architectes, entreprises de construction et experts immobiliers.
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