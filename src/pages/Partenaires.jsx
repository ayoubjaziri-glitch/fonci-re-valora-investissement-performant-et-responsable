import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ArrowRight,
  Handshake,
  Star,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Award,
  Phone,
  FileText,
  Search,
  Wrench,
  BarChart3
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import DynamicSections from '../components/DynamicSections';
import { useSiteContent } from '../hooks/useSiteContent';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/supabaseClient';

export default function Partenaires() {
  const { get } = useSiteContent();

  const { data: siteImages = [] } = useQuery({
    queryKey: ['site-images'],
    queryFn: () => db.SiteImage.list(),
    initialData: []
  });

  const img = (key, fallback) => {
    const found = siteImages.find(i => i.key === key);
    return found?.url || fallback;
  };

  const ecosysteme = [
    {
      key: 'architectes',
      emoji: '🏛️',
      category: get('ecosysteme_architectes_categorie', 'Architectes'),
      title: get('ecosysteme_architectes_titre', 'Vision architecturale & valorisation'),
      description: get('ecosysteme_architectes_description', "Les architectes partenaires interviennent sur la conception des projets de réhabilitation, apportant une signature architecturale respectueuse du patrimoine bâti tout en intégrant les exigences de performance énergétique."),
      values: get('ecosysteme_architectes_valeurs', "Rôle clé dans la valorisation des actifs\nVision patrimoniale de long terme\nSignature architecturale soignée").split('\n').filter(v => v.trim()),
    },
    {
      key: 'btp',
      emoji: '🏗️',
      category: get('ecosysteme_btp_categorie', 'Entreprises BTP'),
      title: get('ecosysteme_btp_titre', 'Excellence opérationnelle'),
      description: get('ecosysteme_btp_description', "Les entreprises du bâtiment avec lesquelles nous collaborons sont sélectionnées pour leur savoir-faire technique, leur engagement dans la transition énergétique et leur capacité à respecter les standards de performance énergétique."),
      values: get('ecosysteme_btp_valeurs', "Qualité d'exécution garantie\nEngagement dans la transition énergétique\nPartenaires techniques de confiance").split('\n').filter(v => v.trim()),
    },
    {
      key: 'notaires',
      emoji: '⚖️',
      category: get('ecosysteme_notaires_categorie', 'Notaires & Avocats'),
      title: get('ecosysteme_notaires_titre', 'Sécurisation juridique'),
      description: get('ecosysteme_notaires_description', "Accompagnement par des notaires et cabinets d'avocats spécialisés en droit immobilier, en structuration de sociétés et en gouvernance patrimoniale."),
      values: get('ecosysteme_notaires_valeurs', "Sécurisation des opérations\nStructuration juridique adaptée\nConformité réglementaire").split('\n').filter(v => v.trim()),
    },
    {
      key: 'agents',
      emoji: '🏠',
      category: get('ecosysteme_agents_categorie', 'Agents immobiliers'),
      title: get('ecosysteme_agents_titre', 'Sourcing & commercialisation'),
      description: get('ecosysteme_agents_description', "Réseau d'agents immobiliers pour l'accès à des opportunités off-market et la commercialisation locative des actifs réhabilités."),
      values: get('ecosysteme_agents_valeurs', "Accès privilégié au marché\nConnaissance locale approfondie\nRéactivité commerciale").split('\n').filter(v => v.trim()),
    },
    {
      key: 'banques',
      emoji: '🏦',
      category: get('ecosysteme_banques_categorie', 'Établissements bancaires'),
      title: get('ecosysteme_banques_titre', 'Financement structuré'),
      description: get('ecosysteme_banques_description', "Partenariats avec des établissements de crédit pour structurer des financements adaptés aux opérations d'acquisition et de rénovation."),
      values: get('ecosysteme_banques_valeurs', "Conditions négociées\nRelations de long terme\nExpertise financement immobilier").split('\n').filter(v => v.trim()),
    },
    {
      key: 'patrimoniaux',
      emoji: '🤝',
      category: get('ecosysteme_patrimoniaux_categorie', 'Partenaires patrimoniaux'),
      title: get('ecosysteme_patrimoniaux_titre', 'Accompagnement durable'),
      description: get('ecosysteme_patrimoniaux_description', "Des acteurs engagés dans la durée qui accompagnent les projets immobiliers par leur expertise, leur réseau et leur vision stratégique, contribuant à la pérennité du développement de la foncière."),
      values: get('ecosysteme_patrimoniaux_valeurs', "Acteurs engagés dans la durée\nAccompagnement structuré des projets\nAlignement sur une vision patrimoniale").split('\n').filter(v => v.trim()),
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-[#1A3A52] overflow-hidden">
        <div className="bg-slate-900 opacity-100 absolute inset-0" />
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
            <p className="text-xl text-white/70">
              {get('ecosysteme_hero_description', "Plus qu'une équipe, un modèle d'engagement : nous intégrons nos partenaires techniques et patrimoniaux au cœur de notre structure capitalistique.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sections dynamiques — Après Hero */}
      <DynamicSections page="ecosysteme" minOrdre={10} maxOrdre={100} />

      {/* Écosystème Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">
              {get('ecosysteme_partenaires_titre', 'Nos partenaires')}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {get('ecosysteme_partenaires_description', "Des acteurs qualifiés intervenant sur l'ensemble du cycle de valorisation.")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ecosysteme.map((partenaire, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-200 bg-slate-50">
                    <span className="text-3xl">{partenaire.emoji}</span>
                  </div>
                  <div>
                    <p className="text-sm text-[#C9A961] font-medium uppercase tracking-wider mb-1">{partenaire.category}</p>
                    <h3 className="text-xl font-serif text-[#1A3A52]">{partenaire.title}</h3>
                  </div>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">{partenaire.description}</p>
                <div className="space-y-2">
                  {partenaire.values.map((value, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#C9A961] flex-shrink-0" />
                      <span className="text-sm text-slate-600">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections dynamiques — milieu */}
      <DynamicSections page="ecosysteme" minOrdre={100} maxOrdre={Infinity} />

      {/* Chiffres clés partenaires */}
      <section className="py-16 bg-[#1A3A52]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">En chiffres</span>
              <div className="w-10 h-1 bg-[#C9A961]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              {get('ecosysteme_chiffres_titre', 'Notre réseau en action')}
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              {get('ecosysteme_chiffres_description', 'Un réseau dense de professionnels qualifiés pour une exécution irréprochable.')}
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: get('ecosysteme_stat1_valeur', '6'), label: get('ecosysteme_stat1_label', 'Métiers représentés'), icon: Users },
              { number: get('ecosysteme_stat2_valeur', '15+'), label: get('ecosysteme_stat2_label', 'Partenaires actifs'), icon: Handshake },
              { number: get('ecosysteme_stat3_valeur', '100%'), label: get('ecosysteme_stat3_label', 'Sélectionnés sur dossier'), icon: Shield },
              { number: get('ecosysteme_stat4_valeur', '5 ans'), label: get('ecosysteme_stat4_label', "Durée moyenne d'engagement"), icon: TrendingUp },
            ].map(({ number, label, icon: Icon }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                <Icon className="h-7 w-7 text-[#C9A961] mx-auto mb-3" />
                <p className="text-4xl font-serif text-white mb-2">{number}</p>
                <p className="text-white/60 text-sm">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Processus de sélection */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">Rigueur & Confiance</span>
              <div className="w-10 h-1 bg-[#C9A961]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
              {get('ecosysteme_selection_titre', 'Comment nous sélectionnons nos partenaires')}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {get('ecosysteme_selection_description', 'Chaque partenaire intègre notre réseau après un processus rigoureux garant de la qualité de nos opérations.')}
            </p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', icon: Search,   title: get('ecosysteme_etape1_titre', 'Identification'),  desc: get('ecosysteme_etape1_desc', 'Repérage des acteurs de référence sur leurs marchés locaux et nationaux.') },
              { step: '02', icon: FileText, title: get('ecosysteme_etape2_titre', 'Audit de dossier'), desc: get('ecosysteme_etape2_desc', 'Analyse des références, certifications, capacité financière et engagements ESG.') },
              { step: '03', icon: Wrench,   title: get('ecosysteme_etape3_titre', 'Mission test'),     desc: get('ecosysteme_etape3_desc', "Intervention sur une première opération pour valider l'adéquation opérationnelle.") },
              { step: '04', icon: BarChart3,title: get('ecosysteme_etape4_titre', 'Suivi continu'),    desc: get('ecosysteme_etape4_desc', "Évaluation régulière des performances et maintien du partenariat sur le long terme.") },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
                <div className="bg-slate-50 rounded-2xl p-6 h-full border border-slate-100 hover:shadow-lg transition-all">
                  <div className="text-5xl font-serif text-[#C9A961]/20 font-bold mb-4">{step}</div>
                  <div className="w-10 h-10 bg-[#C9A961]/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-[#C9A961]" />
                  </div>
                  <h3 className="font-serif text-[#1A3A52] text-lg mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 z-10 w-6 h-6 bg-[#C9A961] rounded-full items-center justify-center">
                    <ArrowRight className="h-3 w-3 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs partagées */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-1 bg-[#C9A961]" />
                <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">ADN commun</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                {get('ecosysteme_valeurs_titre', 'Des valeurs partagées avec nos partenaires')}
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {get('ecosysteme_valeurs_description', "Au-delà de la compétence technique, nous choisissons des partenaires qui partagent notre vision : créer de la valeur durable, agir avec intégrité et s'inscrire dans une démarche responsable vis-à-vis du patrimoine bâti et de l'environnement.")}
              </p>
              <div className="space-y-4">
                {[
                  { icon: Shield, label: get('ecosysteme_valeur1_titre', 'Intégrité & transparence'),     desc: get('ecosysteme_valeur1_desc', 'Une relation fondée sur la confiance mutuelle et la communication ouverte.') },
                  { icon: Zap,    label: get('ecosysteme_valeur2_titre', 'Excellence opérationnelle'),     desc: get('ecosysteme_valeur2_desc', 'Des standards élevés à chaque étape du projet, sans compromis sur la qualité.') },
                  { icon: Award,  label: get('ecosysteme_valeur3_titre', 'Engagement RSE'),                desc: get('ecosysteme_valeur3_desc', "Priorité aux matériaux durables, aux économies d'énergie et au bien-être des locataires.") },
                  { icon: Star,   label: get('ecosysteme_valeur4_titre', 'Vision long terme'),             desc: get('ecosysteme_valeur4_desc', 'Des partenariats construits pour durer, dans une logique de création de valeur partagée.') },
                ].map(({ icon: Icon, label, desc }, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#C9A961]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="h-5 w-5 text-[#C9A961]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A3A52] mb-1">{label}</p>
                      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden h-52">
                  <img src={img('ecosysteme_photo1', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop')} alt="Chantier" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-52 mt-8">
                  <img src={img('ecosysteme_photo2', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop')} alt="Architecture" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-52 -mt-4">
                  <img src={img('ecosysteme_photo3', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop')} alt="Finance" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-52 mt-4">
                  <img src={img('ecosysteme_photo4', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop')} alt="Réunion" className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Citation / Témoignage */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <div className="text-7xl text-[#C9A961]/20 font-serif leading-none mb-6">"</div>
            <blockquote className="text-xl md:text-2xl font-serif text-[#1A3A52] leading-relaxed mb-8">
              {get('ecosysteme_citation_texte', "Nous ne cherchons pas simplement des prestataires. Nous construisons un écosystème où chaque acteur est partie prenante du projet commun, avec des intérêts alignés et une vision partagée de la valeur à créer.")}
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#C9A961]/20 flex items-center justify-center">
                {img('ecosysteme_citation_photo', '') ? (
                  <img src={img('ecosysteme_citation_photo', '')} alt="Fondateur" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#C9A961] font-bold">AJ</span>
                )}
              </div>
              <div className="text-left">
                <p className="font-semibold text-[#1A3A52]">{get('ecosysteme_citation_auteur', 'Ayoub Jaziri')}</p>
                <p className="text-sm text-slate-500">{get('ecosysteme_citation_role', 'Co-fondateur, La Foncière Valora')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Devenir partenaire */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-1 bg-[#C9A961]" />
                <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">Rejoignez-nous</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                {get('ecosysteme_rejoindre_titre', 'Devenir partenaire de La Foncière Valora')}
              </h2>
              <p className="text-white/60 mb-8 leading-relaxed">
                {get('ecosysteme_rejoindre_description', "Vous êtes architecte, entrepreneur BTP, agent immobilier, notaire ou établissement financier ? Rejoignez notre réseau de partenaires sélectionnés et participez à des opérations ambitieuses de réhabilitation immobilière.")}
              </p>
              <div className="space-y-4 mb-8">
                {get('ecosysteme_rejoindre_avantages', "Accès à des projets structurés et bien financés\nRelations durables fondées sur la confiance\nRémunération compétitive et paiements ponctuels\nParticipation à la création de valeur partagée")
                  .split('\n').filter(v => v.trim()).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#C9A961] flex-shrink-0" />
                    <span className="text-white/80 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link to={createPageUrl("Contact")}>
                <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] px-8 py-4 text-base font-semibold rounded-md gap-2">
                  <Phone className="h-5 w-5" />
                  {get('ecosysteme_rejoindre_bouton', 'Prendre contact')}
                </Button>
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { emoji: '🏛️', metier: get('ecosysteme_metier1_titre', "Architectes & Maîtres d'œuvre"), desc: get('ecosysteme_metier1_desc', 'Conception et suivi de projets de réhabilitation ambitieux.') },
                  { emoji: '🏗️', metier: get('ecosysteme_metier2_titre', 'Entreprises du bâtiment'),       desc: get('ecosysteme_metier2_desc', 'Gros œuvre, second œuvre, rénovation énergétique.') },
                  { emoji: '🏠', metier: get('ecosysteme_metier3_titre', 'Agents & Chasseurs immobiliers'), desc: get('ecosysteme_metier3_desc', 'Sourcing off-market et commercialisation locative.') },
                  { emoji: '⚖️', metier: get('ecosysteme_metier4_titre', 'Juristes & Notaires'),           desc: get('ecosysteme_metier4_desc', 'Sécurisation des transactions et structuration juridique.') },
                ].map(({ emoji, metier, desc }, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start gap-4 hover:bg-white/10 transition-colors">
                    <span className="text-3xl">{emoji}</span>
                    <div>
                      <p className="font-semibold text-white mb-1">{metier}</p>
                      <p className="text-white/50 text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Contact */}
      <section className="py-16 bg-[#C9A961]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
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