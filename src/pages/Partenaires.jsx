import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Quote, Building2, Users, TrendingUp, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import DynamicSections from '../components/DynamicSections';
import { useSiteContent } from '../hooks/useSiteContent';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/supabaseClient';

const VALEUR_ICONS = [Shield, TrendingUp, Users, Building2];

function useSiteImages() {
  const { data: images = [] } = useQuery({
    queryKey: ['site-images'],
    queryFn: () => db.SiteImage.list(),
    staleTime: 0
  });
  const getImg = (key, fallback = '') => images.find((i) => i.key === key)?.url || fallback;
  return { getImg };
}

export default function Partenaires() {
  const { get } = useSiteContent();
  const { getImg } = useSiteImages();

  const ecosysteme = [
  {
    emoji: '🏛️',
    category: get('ecosysteme_architectes_categorie', 'Architectes'),
    title: get('ecosysteme_architectes_titre', 'Vision architecturale & valorisation'),
    description: get('ecosysteme_architectes_description', "Les architectes partenaires interviennent sur la conception des projets de réhabilitation, apportant une signature architecturale respectueuse du patrimoine bâti tout en intégrant les exigences de performance énergétique."),
    values: get('ecosysteme_architectes_valeurs', "Rôle clé dans la valorisation des actifs\nVision patrimoniale de long terme\nSignature architecturale soignée").split('\n').filter((v) => v.trim())
  },
  {
    emoji: '🏗️',
    category: get('ecosysteme_btp_categorie', 'Entreprises BTP'),
    title: get('ecosysteme_btp_titre', 'Excellence opérationnelle'),
    description: get('ecosysteme_btp_description', "Les entreprises du bâtiment avec lesquelles nous collaborons sont sélectionnées pour leur savoir-faire technique, leur engagement dans la transition énergétique et leur capacité à respecter les standards de performance énergétique."),
    values: get('ecosysteme_btp_valeurs', "Qualité d'exécution garantie\nEngagement dans la transition énergétique\nPartenaires techniques de confiance").split('\n').filter((v) => v.trim())
  },
  {
    emoji: '⚖️',
    category: get('ecosysteme_notaires_categorie', 'Notaires & Avocats'),
    title: get('ecosysteme_notaires_titre', 'Sécurisation juridique'),
    description: get('ecosysteme_notaires_description', "Accompagnement par des notaires et cabinets d'avocats spécialisés en droit immobilier, en structuration de sociétés et en gouvernance patrimoniale."),
    values: get('ecosysteme_notaires_valeurs', "Sécurisation des opérations\nStructuration juridique adaptée\nConformité réglementaire").split('\n').filter((v) => v.trim())
  },
  {
    emoji: '🏠',
    category: get('ecosysteme_agents_categorie', 'Agents immobiliers'),
    title: get('ecosysteme_agents_titre', 'Sourcing & commercialisation'),
    description: get('ecosysteme_agents_description', "Réseau d'agents immobiliers pour l'accès à des opportunités off-market et la commercialisation locative des actifs réhabilités."),
    values: get('ecosysteme_agents_valeurs', "Accès privilégié au marché\nConnaissance locale approfondie\nRéactivité commerciale").split('\n').filter((v) => v.trim())
  },
  {
    emoji: '🏦',
    category: get('ecosysteme_banques_categorie', 'Établissements bancaires'),
    title: get('ecosysteme_banques_titre', 'Financement structuré'),
    description: get('ecosysteme_banques_description', "Partenariats avec des établissements de crédit pour structurer des financements adaptés aux opérations d'acquisition et de rénovation."),
    values: get('ecosysteme_banques_valeurs', "Conditions négociées\nRelations de long terme\nExpertise financement immobilier").split('\n').filter((v) => v.trim())
  },
  {
    emoji: '🤝',
    category: get('ecosysteme_patrimoniaux_categorie', 'Partenaires patrimoniaux'),
    title: get('ecosysteme_patrimoniaux_titre', 'Accompagnement durable'),
    description: get('ecosysteme_patrimoniaux_description', "Des acteurs engagés dans la durée qui accompagnent les projets immobiliers par leur expertise, leur réseau et leur vision stratégique, contribuant à la pérennité du développement de la foncière."),
    values: get('ecosysteme_patrimoniaux_valeurs', "Acteurs engagés dans la durée\nAccompagnement structuré des projets\nAlignement sur une vision patrimoniale").split('\n').filter((v) => v.trim())
  }];


  const stats = [
  { valeur: get('ecosysteme_stat1_valeur', '6'), label: get('ecosysteme_stat1_label', 'Métiers représentés') },
  { valeur: get('ecosysteme_stat2_valeur', '15+'), label: get('ecosysteme_stat2_label', 'Partenaires actifs') },
  { valeur: get('ecosysteme_stat3_valeur', '100%'), label: get('ecosysteme_stat3_label', 'Sélectionnés sur dossier') },
  { valeur: get('ecosysteme_stat4_valeur', '5 ans'), label: get('ecosysteme_stat4_label', "Durée moyenne d'engagement") }];


  const etapes = [
  { titre: get('ecosysteme_etape1_titre', 'Identification'), desc: get('ecosysteme_etape1_desc', 'Repérage des acteurs de référence sur leurs marchés locaux et nationaux.') },
  { titre: get('ecosysteme_etape2_titre', 'Audit de dossier'), desc: get('ecosysteme_etape2_desc', 'Analyse des références, certifications, capacité financière et engagements ESG.') },
  { titre: get('ecosysteme_etape3_titre', 'Mission test'), desc: get('ecosysteme_etape3_desc', "Première collaboration sur une opération pour valider le niveau de qualité et de réactivité.") },
  { titre: get('ecosysteme_etape4_titre', 'Intégration'), desc: get('ecosysteme_etape4_desc', "Référencement dans notre panel de partenaires avec un suivi qualité régulier sur l'ensemble des missions.") }];


  const valeurs = [
  { icon: Shield, titre: get('ecosysteme_valeur1_titre', 'Confiance'), desc: get('ecosysteme_valeur1_desc', "Chaque partenaire est sélectionné sur la base de critères stricts de professionnalisme et d'intégrité.") },
  { icon: TrendingUp, titre: get('ecosysteme_valeur2_titre', 'Performance'), desc: get('ecosysteme_valeur2_desc', "Nous collaborons avec des acteurs dont l'excellence opérationnelle est reconnue sur leurs marchés.") },
  { icon: Users, titre: get('ecosysteme_valeur3_titre', 'Engagement'), desc: get('ecosysteme_valeur3_desc', "Nos relations partenariales s'inscrivent dans la durée, pour une création de valeur partagée et durable.") },
  { icon: Building2, titre: get('ecosysteme_valeur4_titre', 'Complémentarité'), desc: get('ecosysteme_valeur4_desc', "Un écosystème couvrant l'intégralité du cycle immobilier, de l'acquisition à la valorisation locative.") }];


  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, #C9A961 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                {get('ecosysteme_hero_accroche', 'Écosystème')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              {get('ecosysteme_hero_titre', 'Écosystème de partenaires')}
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              {get('ecosysteme_hero_description', "Plus qu'une équipe, un modèle d'engagement : nous intégrons nos partenaires techniques et patrimoniaux au cœur de notre structure capitalistique.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grille partenaires métiers */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
              {get('ecosysteme_partenaires_titre', 'Nos partenaires métiers')}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {get('ecosysteme_partenaires_description', "Des acteurs qualifiés intervenant sur l'ensemble du cycle de valorisation.")}
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ecosysteme.map((p, i) =>
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
                  {p.values.map((val, idx) =>
                <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#C9A961] flex-shrink-0" />
                      <span className="text-sm text-slate-600">{val}</span>
                    </div>
                )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) =>
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-3xl font-bold text-[#C9A961] mb-1">{s.valeur}</p>
                <p className="text-sm text-slate-600">{s.label}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Groupe Auvergne et Patrimoine */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-1 bg-[#C9A961]" />
                <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                  {get('ecosysteme_groupe_accroche', 'Notre ancrage')}
                </span>
              </div>
              <h2 className="text-3xl font-serif text-white mb-6">
                {get('ecosysteme_groupe_titre', 'Groupe Auvergne et Patrimoine')}
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                {get('ecosysteme_groupe_para1', "La Foncière Valora s'appuie sur les expertises et le réseau du Groupe Auvergne et Patrimoine, fondé en 2008. Ce groupe spécialisé dans le conseil en gestion de patrimoine et en investissement immobilier constitue le socle sur lequel la foncière développe ses opérations.")}
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                {get('ecosysteme_groupe_para2', "Cette appartenance à un groupe structuré apporte à la foncière un accès privilégié à un réseau d'investisseurs, à des opportunités de sourcing off-market, et à une expertise patrimoniale et financière reconnue.")}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                { val: get('ecosysteme_groupe_chiffre1_val', '2008'), label: get('ecosysteme_groupe_chiffre1_label', 'Année de création du groupe') },
                { val: get('ecosysteme_groupe_chiffre2_val', '15 ans'), label: get('ecosysteme_groupe_chiffre2_label', "D'expérience patrimoniale") },
                { val: get('ecosysteme_groupe_chiffre3_val', 'Vichy'), label: get('ecosysteme_groupe_chiffre3_label', 'Ancrage Auvergne-Rhône-Alpes') },
                { val: get('ecosysteme_groupe_chiffre4_val', '360°'), label: get('ecosysteme_groupe_chiffre4_label', 'Vision patrimoniale globale') }].
                map((item, i) =>
                <div key={i} className="bg-white/10 rounded-xl p-4">
                    <p className="text-[#C9A961] font-bold text-xl">{item.val}</p>
                    <p className="text-white/60 text-sm mt-1">{item.label}</p>
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-white/10 rounded-3xl p-8 border border-white/20">
                <Quote className="h-10 w-10 text-[#C9A961] mb-4" />
                <p className="text-white text-lg leading-relaxed italic mb-6">
                  {get('ecosysteme_citation_texte', '"Notre conviction est que la création de valeur durable dans l\'immobilier résidentiel passe par une approche intégrée : sourcing off-market, réhabilitation énergétique, et gestion active des actifs."')}
                </p>
                <div className="flex items-center gap-4">
                  {getImg('ecosysteme_citation_photo') ?
                  <img src={getImg('ecosysteme_citation_photo')} alt="Auteur" className="w-12 h-12 rounded-full object-cover border-2 border-[#C9A961]" /> :

                  <div className="w-12 h-12 bg-[#C9A961] rounded-full flex items-center justify-center text-white font-bold text-lg">AJ</div>
                  }
                  <div>
                    <p className="text-white font-semibold">{get('ecosysteme_citation_auteur', 'Ayoub Jaziri')}</p>
                    <p className="text-white/50 text-sm">{get('ecosysteme_citation_role', 'Fondateur, La Foncière Valora')}</p>
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
            <h2 className="text-3xl font-serif text-[#1A3A52] mb-3">
              {get('ecosysteme_valeurs_titre', 'Nos valeurs partenariales')}
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              {get('ecosysteme_valeurs_description', 'Les principes qui guident chaque relation partenariale que nous nouons.')}
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
                </motion.div>);

            })}
          </div>
        </div>
      </section>

      {/* Processus sélection */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-serif text-[#1A3A52] mb-3">
              {get('ecosysteme_selection_titre', 'Comment nous sélectionnons nos partenaires')}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              {get('ecosysteme_selection_description', 'Chaque partenaire intègre notre réseau après un processus rigoureux garant de la qualité de nos opérations.')}
            </p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {etapes.map((e, i) =>
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="p-6 bg-white rounded-2xl border border-slate-200">
                <div className="w-8 h-8 bg-[#C9A961] rounded-full flex items-center justify-center text-white font-bold text-sm mb-4">{i + 1}</div>
                <h4 className="font-semibold text-[#1A3A52] mb-2">{e.titre}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{e.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* DynamicSections */}
      <DynamicSections page="ecosysteme" minOrdre={0} maxOrdre={99} />

      {/* CTA */}
      <section className="py-16 bg-[#C9A961]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">
              {get('ecosysteme_cta_titre', 'Rejoindre notre écosystème')}
            </h2>
            <p className="text-slate-800 mb-8 max-w-2xl mx-auto">
              {get('ecosysteme_cta_description', "Vous êtes un professionnel de l'immobilier, un architecte, une entreprise du bâtiment ou un investisseur patrimonial ? Découvrez comment collaborer avec La Foncière Valora.")}
            </p>
            <Link to={createPageUrl("Contact")}>
              <Button className="bg-slate-900 hover:bg-[#2A4A6F] text-white px-8 py-4 text-base font-semibold rounded-md gap-2">
                {get('ecosysteme_cta_bouton', 'Nous contacter')}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>);

}