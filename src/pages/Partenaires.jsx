import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import DynamicSections from '../components/DynamicSections';
import { useSiteContent } from '../hooks/useSiteContent';

export default function Partenaires() {
  const { get } = useSiteContent();

  // Logos représentatifs de chaque métier (images Unsplash professionnelles)
  const ecosysteme = [
  {
    logoUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/1/18/Logo_UNSFA.svg/200px-Logo_UNSFA.svg.png',
    logoAlt: 'Architecture',
    logoBg: 'bg-white',
    key: 'architectes',
    category: get('ecosysteme_architectes_categorie', 'Architectes'),
    title: get('ecosysteme_architectes_titre', 'Vision architecturale & valorisation'),
    description: get('ecosysteme_architectes_description', "Les architectes partenaires interviennent sur la conception des projets de réhabilitation, apportant une signature architecturale respectueuse du patrimoine bâti tout en intégrant les exigences de performance énergétique."),
    values: get('ecosysteme_architectes_valeurs', "Rôle clé dans la valorisation des actifs\nVision patrimoniale de long terme\nSignature architecturale soignée").split('\n').filter(v => v.trim()),
    emoji: '🏛️'
  },
  {
    logoUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/5/52/Logo_FFB.svg/200px-Logo_FFB.svg.png',
    logoAlt: 'BTP',
    logoBg: 'bg-white',
    key: 'btp',
    category: get('ecosysteme_btp_categorie', 'Entreprises BTP'),
    title: get('ecosysteme_btp_titre', 'Excellence opérationnelle'),
    description: get('ecosysteme_btp_description', "Les entreprises du bâtiment avec lesquelles nous collaborons sont sélectionnées pour leur savoir-faire technique, leur engagement dans la transition énergétique et leur capacité à respecter les standards de performance énergétique."),
    values: get('ecosysteme_btp_valeurs', "Qualité d'exécution garantie\nEngagement dans la transition énergétique\nPartenaires techniques de confiance").split('\n').filter(v => v.trim()),
    emoji: '🏗️'
  },
  {
    logoUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/0/09/Logo_Conseil_Superieur_du_Notariat.svg/200px-Logo_Conseil_Superieur_du_Notariat.svg.png',
    logoAlt: 'Notaires',
    logoBg: 'bg-white',
    key: 'notaires',
    category: get('ecosysteme_notaires_categorie', 'Notaires & Avocats'),
    title: get('ecosysteme_notaires_titre', 'Sécurisation juridique'),
    description: get('ecosysteme_notaires_description', "Accompagnement par des notaires et cabinets d'avocats spécialisés en droit immobilier, en structuration de sociétés et en gouvernance patrimoniale."),
    values: get('ecosysteme_notaires_valeurs', "Sécurisation des opérations\nStructuration juridique adaptée\nConformité réglementaire").split('\n').filter(v => v.trim()),
    emoji: '⚖️'
  },
  {
    logoUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/4/44/Logo_FNAIM.svg/200px-Logo_FNAIM.svg.png',
    logoAlt: 'Agents immobiliers',
    logoBg: 'bg-white',
    key: 'agents',
    category: get('ecosysteme_agents_categorie', 'Agents immobiliers'),
    title: get('ecosysteme_agents_titre', 'Sourcing & commercialisation'),
    description: get('ecosysteme_agents_description', "Réseau d'agents immobiliers pour l'accès à des opportunités off-market et la commercialisation locative des actifs réhabilités."),
    values: get('ecosysteme_agents_valeurs', "Accès privilégié au marché\nConnaissance locale approfondie\nRéactivité commerciale").split('\n').filter(v => v.trim()),
    emoji: '🏠'
  },
  {
    logoUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/e/e4/Logo_FBF.svg/200px-Logo_FBF.svg.png',
    logoAlt: 'Banques',
    logoBg: 'bg-white',
    key: 'banques',
    category: get('ecosysteme_banques_categorie', 'Établissements bancaires'),
    title: get('ecosysteme_banques_titre', 'Financement structuré'),
    description: get('ecosysteme_banques_description', "Partenariats avec des établissements de crédit pour structurer des financements adaptés aux opérations d'acquisition et de rénovation."),
    values: get('ecosysteme_banques_valeurs', "Conditions négociées\nRelations de long terme\nExpertise financement immobilier").split('\n').filter(v => v.trim()),
    emoji: '🏦'
  },
  {
    logoUrl: null,
    logoAlt: 'Patrimoniaux',
    logoBg: 'bg-[#1A3A52]',
    key: 'patrimoniaux',
    category: get('ecosysteme_patrimoniaux_categorie', 'Partenaires patrimoniaux'),
    title: get('ecosysteme_patrimoniaux_titre', 'Accompagnement durable'),
    description: get('ecosysteme_patrimoniaux_description', "Des acteurs engagés dans la durée qui accompagnent les projets immobiliers par leur expertise, leur réseau et leur vision stratégique, contribuant à la pérennité du développement de la foncière."),
    values: get('ecosysteme_patrimoniaux_valeurs', "Acteurs engagés dans la durée\nAccompagnement structuré des projets\nAlignement sur une vision patrimoniale").split('\n').filter(v => v.trim()),
    emoji: '🤝'
  }];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-[#1A3A52] overflow-hidden">
        <div className="bg-slate-900 opacity-100 absolute inset-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                {get('ecosysteme_hero_accroche', 'Écosystème')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              {get('ecosysteme_hero_titre', 'Écosystème de partenaires')}
            </h1>
            <p className="text-xl text-white/70">
              {get('ecosysteme_hero_description', "Plus qu'une équipe, un modèle d'engagement : nous intégrons nos partenaires techniques et patrimoniaux au cœur de notre structure capitalistique. En alliant leurs expertises à nos objectifs de croissance, nous assurons une réexécution fluide et une création de valeur optimisée à chaque cycle d'investissement.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sections dynamiques — Après Hero */}
      <DynamicSections page="ecosysteme" minOrdre={10} maxOrdre={100} />

      {/* Écosystème Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12">

            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">
              {get('ecosysteme_partenaires_titre', 'Nos partenaires')}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {get('ecosysteme_partenaires_description', "Des acteurs qualifiés intervenant sur l'ensemble du cycle de valorisation.")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ecosysteme.map((partenaire, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-2xl transition-all duration-300">

                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-200 ${partenaire.logoBg}`}>
                    {partenaire.logoUrl ? (
                      <img
                        src={partenaire.logoUrl}
                        alt={partenaire.logoAlt}
                        className="w-12 h-12 object-contain"
                        onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                      />
                    ) : null}
                    <span className={`text-2xl ${partenaire.logoUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full`} style={{ display: partenaire.logoUrl ? 'none' : 'flex' }}>
                      {partenaire.emoji}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-[#C9A961] font-medium uppercase tracking-wider mb-1">
                      {partenaire.category}
                    </p>
                    <h3 className="text-xl font-serif text-[#1A3A52]">{partenaire.title}</h3>
                  </div>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">{partenaire.description}</p>
                <div className="space-y-2">
                  {partenaire.values.map((value, idx) =>
                <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#C9A961] flex-shrink-0" />
                      <span className="text-sm text-slate-600">{value}</span>
                    </div>
                )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Sections dynamiques — milieu */}
      <DynamicSections page="ecosysteme" minOrdre={100} maxOrdre={Infinity} />

      {/* CTA Contact */}
      <section className="py-16 bg-[#C9A961]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>

            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">
              {get('ecosysteme_cta_titre', 'Partenaires et opérateurs')}
            </h2>
            <p className="text-[#1A3A52]/80 mb-8">
              {get('ecosysteme_cta_description', "La foncière développe ses projets avec des partenaires : investisseurs privés, architectes, entreprises de construction et experts immobiliers.")}
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