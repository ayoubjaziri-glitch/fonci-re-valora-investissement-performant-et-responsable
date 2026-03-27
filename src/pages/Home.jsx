import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import {
  Building2, TrendingUp, Shield, Users, ArrowRight, CheckCircle2,
  MapPin, Calendar, Percent, Target, Search, Home as HomeIcon,
  Key, BarChart3, Leaf, Quote, Thermometer, Zap, TreePine } from
'lucide-react';
import { Button } from "@/components/ui/button";
import RealisationsGallery from "../components/RealisationsGallery";
import InterventionMap from "../components/InterventionMap";
import { useQuery } from "@tanstack/react-query";
import { base44 } from '@/api/base44Client';
import DynamicSections from '../components/DynamicSections';
import { useSiteContent } from '../hooks/useSiteContent';

export default function Home() {
  const { get, getList } = useSiteContent();

  const { data: images = [] } = useQuery({
    queryKey: ['site-images'],
    queryFn: () => base44.entities.SiteImage.list(),
    initialData: []
  });

  const { data: levees = [] } = useQuery({
    queryKey: ['levees-fonds'],
    queryFn: () => base44.entities.LeveeFonds.list('-created_date', 100),
    initialData: []
  });

  const getImageUrl = (key, fallback) => {
    const image = images.find((img) => img.key === key);
    return image?.url || fallback;
  };

  const currentLevy = levees.find((l) => l.actif && l.statut === 'Ouverte') ||
  levees.find((l) => l.actif && l.statut === 'En cours') ||
  levees.find((l) => l.statut === 'Ouverte') ||
  levees.find((l) => l.statut === 'En cours') ||
  levees[0] ||
  {
    nom: 'Notre levée de fonds inaugurale',
    objectif: '250 000 €',
    collecte: '95 000 €',
    avancement: 38,
    ticket_min: '10 000 €',
    rendement_cible: '>10%',
    horizon: '5 ans',
    effet_levier: 'x5',
    valorisation_an5: '+61%',
    sous_titre: 'Première opération à 1,25 M€',
    description: "Cette opération permet de soutenir le développement d'une foncière résidentielle à fort potentiel."
  };

  const stats = [
  { value: get('home_stat1_valeur', '18 ans'), label: get('home_stat1_label', "D'expertise immobilière"), icon: Calendar },
  { value: get('home_stat2_valeur', '3 M€'), label: get('home_stat2_label', "D'actifs sous gestion"), icon: Building2 },
  { value: get('home_stat3_valeur', '>10%'), label: get('home_stat3_label', "TRI net visé"), icon: Percent },
  { value: get('home_stat4_valeur', '20 M€'), label: get('home_stat4_label', "Objectif 5 ans"), icon: Target }];


  const services = [
  {
    title: get('home_service1_titre', "Souscription au capital"),
    description: get('home_service1_desc', "La Foncière Valora fonctionne selon un modèle associant des opérateurs aux projets immobiliers développés par la société. Ces partenaires, en lien avec leur compétence métier, interviennent dans la structuration, la réalisation ou le suivi des opérations."),
    imageKey: "service_souscription",
    icon: Key
  },
  {
    title: get('home_service2_titre', "Sourcing et due diligence"),
    description: get('home_service2_desc', "Notre équipe identifie des actifs à fort potentiel de revalorisation. Chaque acquisition fait l'objet d'une analyse approfondie : rentabilité locative, décote à l'achat, potentiel de réhabilitation."),
    imageKey: "service_sourcing",
    icon: Search
  },
  {
    title: get('home_service3_titre', "Asset management et arbitrage"),
    description: get('home_service3_desc', "Gestion locative intégrée, suivi des flux de trésorerie, optimisation du taux d'occupation et stratégie d'arbitrage pour maximiser la création de valeur."),
    imageKey: "service_asset",
    icon: BarChart3
  }];


  const atouts = getList('home_atouts_liste', [
  "Mutualisation du risque locatif au sein d'un portefeuille diversifié",
  "Allocation équilibrée entre revenus courants et création de valeur à long terme",
  "Gestion opérationnelle des actifs intégralement déléguée",
  "Véhicule d'investissement structuré, doté d'une gouvernance lisible",
  "Accès sélectif : Identification anticipée d'actifs et déploiement opérationnel maîtrisé dans des zones à dynamique soutenue.",
  "Diversification géographique visant à atténuer l'exposition aux cycles locaux"]
  );

  const valeurAjoutee = getList('home_valeur_liste', [
  "Objectif de TRI supérieur aux véhicules d'investissement collectifs traditionnels et à l'immobilier en direct",
  "Chaîne de valeur intégrée : Du sourcing à l'acquisition, du financement à la réalisation des travaux (notamment BBC), puis à la mise en location et à l'arbitrage des actifs.",
  "Effet de levier bancaire optimisé (LTV 80%) démultipliant la performance",
  "Reporting régulier et transparence sur la valorisation des actifs",
  "Création de valeur via la rénovation énergétique et l'amélioration du DPE"]
  );

  const testimonials = [
  {
    text: get('home_temoignage1_texte', "Ce qui m'a convaincu, c'est la transparence du modèle : 0€ de frais d'entrée, une rémunération indexée sur la performance réelle, et une équipe qui investit elle-même dans les mêmes actifs."),
    author: get('home_temoignage1_auteur', "François B."),
    role: get('home_temoignage1_role', "Chef d'entreprise — Associé depuis 2024")
  },
  {
    text: get('home_temoignage2_texte', "J'ai cherché pendant longtemps un véhicule d'investissement immobilier sans les contraintes de la gestion directe. La Foncière Valora correspond exactement à ce que je cherchais."),
    author: get('home_temoignage2_auteur', "Isabelle R."),
    role: get('home_temoignage2_role', "Médecin libéral — Associée depuis 2025")
  },
  {
    text: get('home_temoignage3_texte', "Le reporting est clair, les fondateurs sont accessibles et répondent en 24h. C'est rare de trouver cette qualité de relation dans l'investissement immobilier structuré."),
    author: get('home_temoignage3_auteur', "Marc D."),
    role: get('home_temoignage3_role', "Cadre supérieur — Associé depuis 2024")
  }];


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${getImageUrl('hero_home', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/0a169e079_france-paris-haussmann-la-facade-de-l-immeuble-e2dnpy.jpg')}')`
          }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/70" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl">

            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-widest uppercase text-sm">
                {get('home_hero_accroche', 'Foncière Résidentielle')}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-6">
              <span className="text-white">{get('home_hero_titre_ligne1', 'INVESTIR & VALORISER')}</span>
              <br />
              <span className="text-[#C9A961]">{get('home_hero_titre_ligne2', 'DURABLEMENT')}</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-10 max-w-2xl leading-relaxed">
              {get('home_hero_description', "Depuis 2008, le Groupe Auvergne et Patrimoine développe un savoir faire dans l'acquisition et la valorisation d'actifs résidentiels. La Foncière Valora s'inscrit dans cette continuité en offrant un cadre structuré d'association autour d'une vision patrimoniale de long terme.")}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to={createPageUrl("Contact")}>
                <Button className="bg-[#C9A961] text-slate-900 px-8 py-6 text-base font-semibold rounded-md shadow hover:bg-[#B8994F] border-2 border-[#C9A961]">
                  Entrer en relation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={createPageUrl("StrategyPerformance")}>
                <Button variant="outline" className="border-2 border-[#C9A961]/60 text-[#C9A961] hover:bg-[#C9A961]/10 px-8 py-6 text-base font-semibold">
                  Découvrir notre stratégie
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#C9A961] rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Sections dynamiques — Après Hero */}
      <DynamicSections page="accueil" minOrdre={10} maxOrdre={100} />

      {/* Qui sommes-nous */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-[#C9A961]" />
                <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                  {get('home_quisommes_accroche', 'Qui sommes-nous')}
                </span>
              </div>
              <h2 className="text-slate-900 mb-6 text-3xl font-serif md:text-4xl">
                {get('home_quisommes_titre', "Une foncière indépendante au service d'une vision patrimoniale exigeante")}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                {get('home_quisommes_description1', "La Foncière Valora développe et valorise des actifs résidentiels durables à travers une stratégie d'acquisition sélective, de réhabilitation énergétique BBC et de gestion active.")}
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                {get('home_quisommes_description2', "Un modèle conçu pour offrir aux investisseurs une exposition structurée à l'immobilier, avec effet de levier maîtrisé, gouvernance alignée et gestion intégralement déléguée.")}
              </p>
              <div className="space-y-4">
                {[
                get('home_quisommes_point1', 'Portefeuille diversifié'),
                get('home_quisommes_point2', 'Gestion opérationnelle centralisée'),
                get('home_quisommes_point3', 'Éligibilité PEA-PME')].
                map((point, i) =>
                <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#C9A961] mt-1 flex-shrink-0" />
                    <span className="text-slate-700">{point}</span>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-6">
              <div className="bg-slate-900 p-6 text-center rounded-2xl">
                <Calendar className="h-8 w-8 text-[#C9A961] mx-auto mb-3" />
                <p className="text-3xl font-bold text-white mb-1">{get('home_chiffre1_valeur', '18 ans')}</p>
                <p className="text-sm text-white/60">{get('home_chiffre1_label', "D'expertise immobilière")}</p>
              </div>
              <div className="bg-slate-900 p-6 text-center rounded-2xl">
                <Building2 className="h-8 w-8 text-[#C9A961] mx-auto mb-3" />
                <p className="text-3xl font-bold text-white mb-1">{get('home_chiffre2_valeur', '3.7 M€')}</p>
                <p className="text-sm text-white/60">{get('home_chiffre2_label', "D'actifs sous gestion")}</p>
              </div>
              <div className="bg-[#C9A961] rounded-2xl p-6 text-center">
                <Percent className="h-8 w-8 text-[#1A3A52] mx-auto mb-3" />
                <p className="text-3xl font-bold text-[#1A3A52] mb-1">{get('home_chiffre3_valeur', '> 10%')}</p>
                <p className="text-slate-900 text-sm font-semibold">{get('home_chiffre3_label', 'TRI net visé')}</p>
              </div>
              <div className="bg-slate-900 p-6 text-center rounded-2xl">
                <Target className="h-8 w-8 text-[#C9A961] mx-auto mb-3" />
                <p className="text-3xl font-bold text-white mb-1">{get('home_chiffre4_valeur', '20 M€')}</p>
                <p className="text-sm text-white/80">{get('home_chiffre4_label', 'Objectif 5 ans')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sections dynamiques — Après Qui sommes-nous */}
      <DynamicSections page="accueil" minOrdre={100} maxOrdre={200} />

      {/* Durabilité */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-[#C9A961]" />
                <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">Durabilité</span>
              </div>
              <h2 className="text-slate-900 mb-6 text-3xl font-serif md:text-4xl">
                {get('home_durabilite_titre', 'La Foncière Responsable')}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                {get('home_durabilite_description', "La durabilité, la qualité de la gouvernance et l'attention portée aux enjeux sociaux structurent notre démarche. Chaque opération de réhabilitation s'inscrit dans une logique d'amélioration mesurable de la performance énergétique, contribuant à la valorisation d'un patrimoine immobilier plus sobre et pérenne.")}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                  <Thermometer className="h-8 w-8 text-[#C9A961] mb-3" />
                  <p className="font-semibold text-[#1A3A52] mb-1">{get('home_durable1_titre', 'Performance énergétique')}</p>
                  <p className="text-sm text-slate-600">{get('home_durable1_desc', '100% du parc en DPE C, B ou A')}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                  <Zap className="h-8 w-8 text-[#C9A961] mb-3" />
                  <p className="font-semibold text-[#1A3A52] mb-1">{get('home_durable2_titre', '-60% énergie')}</p>
                  <p className="text-sm text-slate-600">{get('home_durable2_desc', 'Réduction moyenne de consommation')}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                  <TreePine className="h-8 w-8 text-[#C9A961] mb-3" />
                  <p className="font-semibold text-[#1A3A52] mb-1">{get('home_durable3_titre', 'Matériaux durables')}</p>
                  <p className="text-sm text-slate-600">{get('home_durable3_desc', 'Isolation biosourcée privilégiée')}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                  <Leaf className="h-8 w-8 text-[#C9A961] mb-3" />
                  <p className="font-semibold text-[#1A3A52] mb-1">{get('home_durable4_titre', 'Impact carbone')}</p>
                  <p className="text-sm text-slate-600">{get('home_durable4_desc', 'Trajectoire bas-carbone 2030')}</p>
                </div>
              </div>
              <Link to={createPageUrl("Durabilite")}>
                <Button className="bg-[#C9A961] text-slate-900 font-semibold shadow hover:bg-[#B8994F]">
                  Découvrir notre engagement ESG
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <img
                src={getImageUrl('durabilite_home', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/0a169e079_france-paris-haussmann-la-facade-de-l-immeuble-e2dnpy.jpg')}
                alt="Rénovation durable"
                className="rounded-3xl shadow-2xl w-full h-80 object-cover" />
              <div className="absolute -bottom-6 -left-6 bg-[#C9A961] text-[#1A3A52] rounded-2xl p-6 shadow-xl">
                <p className="text-slate-900 mb-1 text-4xl font-bold">{get('home_durable_badge_valeur', '100%')}</p>
                <p className="text-[#1A3A52]/80 text-sm">{get('home_durable_badge_label', 'DPE C, B et A')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sections dynamiques — Après Durabilité */}
      <DynamicSections page="accueil" minOrdre={200} maxOrdre={350} />

      {/* Atouts & Valeur Ajoutée */}
      <section className="bg-gradient-to-br py-20 from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-bold tracking-wider uppercase">
                {get('home_atouts_accroche', 'Pourquoi investir avec nous')}
              </span>
              <div className="w-16 h-1 bg-[#C9A961]" />
            </div>
            <h2 className="text-slate-900 mb-6 text-4xl font-serif md:text-5xl">
              {get('home_atouts_titre', "Les atouts d'une foncière structurée")}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {get('home_atouts_description', "À la différence des véhicules fortement mutualisés ou d'un investissement immobilier en direct, notre modèle repose sur une approche structurée de la création de valeur, avec un alignement clair des intérêts entre les associés.")}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white rounded-3xl p-10 border-2 border-[#1A3A52] shadow-xl">
              <div className="text-slate-900 mb-8 flex items-center gap-4">
                <div className="w-16 h-16 bg-[#1A3A52] rounded-2xl flex items-center justify-center">
                  <Shield className="h-9 w-9 text-[#C9A961]" />
                </div>
                <h3 className="text-slate-900 text-3xl font-serif">Atouts</h3>
              </div>
              <ul className="space-y-5">
                {atouts.map((atout, index) =>
                <motion.li key={index} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-[#C9A961]/5 transition-all">
                    <CheckCircle2 className="h-6 w-6 text-[#C9A961] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{atout}</span>
                  </motion.li>
                )}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-[#C9A961] rounded-3xl p-10 shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-[#1A3A52] rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-9 w-9 text-[#C9A961]" />
                </div>
                <h3 className="text-slate-900 text-3xl font-serif">Valeur ajoutée</h3>
              </div>
              <ul className="space-y-5">
                {valeurAjoutee.map((item, index) =>
                <motion.li key={index} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-[#1A3A52]/20 rounded-xl hover:bg-[#1A3A52]/30 transition-all">
                    <CheckCircle2 className="h-6 w-6 text-[#1A3A52] mt-0.5 flex-shrink-0" />
                    <span className="text-[#1A3A52] font-medium">{item}</span>
                  </motion.li>
                )}
              </ul>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-slate-900 p-8 text-center rounded-2xl">
            <p className="text-white text-lg">
              {get('home_modele_banniere', "Un modèle structuré : absence de frais d'entrée • rémunération indexée sur la création de valeur • convergence durable des intérêts entre associés")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sections dynamiques — Après Atouts */}
      <DynamicSections page="accueil" minOrdre={350} maxOrdre={500} />

      {/* Nos Services */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                {get('home_missions_accroche', 'Nos Missions')}
              </span>
              <div className="w-12 h-1 bg-[#C9A961]" />
            </div>
            <h2 className="text-slate-900 mb-6 text-3xl font-serif md:text-4xl">
              {get('home_missions_titre', 'Solution intégrée de bout en bout')}
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">
              {get('home_missions_description', "Une gestion structurée, de l'acquisition à l'arbitrage, portée par une équipe engagée dans la création de valeur patrimoniale durable.")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) =>
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group relative">
                <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-2xl transition-all duration-500 h-full hover:-translate-y-2">
                  <div className="relative h-72 overflow-hidden">
                    <img src={getImageUrl(service.imageKey, '')} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A3A52] via-[#1A3A52]/50 to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <div className="w-14 h-14 bg-[#C9A961] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <service.icon className="h-7 w-7 text-[#1A3A52]" />
                      </div>
                      <h3 className="text-xl font-serif text-white mb-1">{service.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-600 leading-relaxed mb-4">{service.description}</p>
                    <Link to={createPageUrl("Services")} className="inline-flex items-center text-[#C9A961] font-semibold hover:gap-3 transition-all group-hover:text-[#B8994F]">
                      Nos missions <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Sections dynamiques — Après Nos Services */}
      <DynamicSections page="accueil" minOrdre={500} maxOrdre={600} />

      {/* Équipe */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                {get('home_equipe_accroche', 'Équipe fondatrice')}
              </span>
              <div className="w-12 h-1 bg-[#C9A961]" />
            </div>
            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">
              {get('home_equipe_titre', 'Associés opérationnels & Gouvernance')}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {get('home_equipe_description', "18 années de trajectoire — Une expérience consolidée dans l'immobilier résidentiel, fondée sur une pratique continue de l'acquisition et de la valorisation d'actifs.")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
            { key: 'photo_ayoub', nom: get('home_membre1_nom', 'Ayoub Jaziri'), role: get('home_membre1_role', 'Cofondateur'), desc: get('home_membre1_desc', "Stratégie d'acquisition, suivi des travaux, financement et gouvernance."), fallback: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
            { key: 'photo_sophian', nom: get('home_membre2_nom', 'Sophian Naili'), role: get('home_membre2_role', 'Cofondateur'), desc: get('home_membre2_desc', "Investissement, sourcing off-market et arbitrages • gouvernance juridique et vision stratégique de la foncière."), fallback: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
            { key: 'photo_renaud', nom: get('home_membre3_nom', 'Renaud Marchand'), role: get('home_membre3_role', 'Associé'), desc: get('home_membre3_desc', "Travaux & rénovation, pilotage des chantiers • Ingénieur BTP • expertise technique sur les projets de réhabilitation."), fallback: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' }].
            map((m, i) =>
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                <div className="w-20 h-20 bg-[#1A3A52] rounded-full mx-auto mb-4 overflow-hidden border-4 border-[#C9A961]">
                  <img src={getImageUrl(m.key, m.fallback)} alt={m.nom} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold text-[#1A3A52] mb-2">{m.nom}</h3>
                <p className="text-[#C9A961] text-sm font-medium mb-3">{m.role}</p>
                <p className="text-slate-600 text-sm">{m.desc}</p>
              </motion.div>
            )}
          </div>

          <div className="text-center">
            <Link to={createPageUrl("Equipe")}>
              <Button variant="outline" className="border-[#1A3A52] text-[#1A3A52] hover:bg-slate-100">
                Découvrir l'équipe complète <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) =>
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-[#C9A961] rounded-2xl flex items-center justify-center">
                  <stat.icon className="h-7 w-7 text-[#1A3A52]" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Sections dynamiques — Après Équipe */}
      <DynamicSections page="accueil" minOrdre={600} maxOrdre={700} />

      {/* Nos Réalisations */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                {get('home_realisations_accroche', "Portefeuille d'actifs")}
              </span>
              <div className="w-12 h-1 bg-[#C9A961]" />
            </div>
            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">
              {get('home_realisations_titre', 'Nos opérations de valorisation')}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {get('home_realisations_description', "Découvrez nos actifs restructurés : chaque acquisition fait l'objet d'une réhabilitation profonde visant l'excellence énergétique et la création de valeur patrimoniale.")}
            </p>
          </motion.div>
          <RealisationsGallery />
          <div className="text-center mt-12">
            <Link to={createPageUrl("Realisations")}>
              <Button variant="outline" className="border-[#1A3A52] text-[#1A3A52] hover:bg-slate-100 font-semibold">
                Voir toutes nos opérations <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Levée en cours */}
      <section className="bg-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-3 h-3 bg-[#C9A961] rounded-full animate-pulse" />
                  <span className="text-[#C9A961] font-bold uppercase tracking-wider text-sm">Levée en cours</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">{currentLevy.nom}</h2>
                <p className="text-xl text-white/80 mb-8 leading-relaxed">{currentLevy.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <p className="text-white/60 text-sm mb-1">TRI net visé</p>
                    <p className="text-3xl font-bold text-[#C9A961]">{currentLevy.rendement_cible || '>10%'}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <p className="text-white/60 text-sm mb-1">Horizon recommandé</p>
                    <p className="text-3xl font-bold text-white">{currentLevy.horizon || '5 ans'}</p>
                  </div>
                </div>
                <Link to={createPageUrl("Contact")}>
                  <Button className="bg-[#C9A961] text-gray-900 px-10 text-lg font-bold shadow hover:bg-[#B8994F]">
                    Entrer en relation <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="text-center mb-8">
                  <p className="text-[#C9A961] text-sm font-medium mb-2">Objectif de la levée</p>
                  <p className="text-6xl font-bold text-white mb-2">{currentLevy.objectif}</p>
                  <p className="text-white/60 text-sm">{currentLevy.sous_titre || 'Première opération à 1,25 M€'}</p>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                      <span>Avancement</span>
                      <span>{currentLevy.avancement}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C9A961] rounded-full" style={{ width: `${currentLevy.avancement}%` }} />
                    </div>
                    <p className="text-[#C9A961] text-xs mt-2 font-medium">{currentLevy.collecte} souscrits sur {currentLevy.objectif}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/10">
                    <p className="text-white/60 text-xs mb-2">Ticket minimum</p>
                    <p className="text-2xl font-bold text-white">{currentLevy.ticket_min}</p>
                  </div>
                  <div className="bg-[#C9A961]/20 rounded-2xl p-5 text-center border border-[#C9A961]/40">
                    <p className="text-white/60 text-xs mb-2">Frais d'entrée</p>
                    <p className="text-2xl font-bold text-[#C9A961]">0 €</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/10">
                    <p className="text-white/60 text-xs mb-2">Effet de levier</p>
                    <p className="text-2xl font-bold text-white">{currentLevy.effet_levier || 'x5'}</p>
                  </div>
                  <div className="bg-[#C9A961]/20 rounded-2xl p-5 text-center border border-[#C9A961]/40">
                    <p className="text-white/60 text-xs mb-2">Valorisation An 5</p>
                    <p className="text-2xl font-bold text-[#C9A961]">{currentLevy.valorisation_an5 || '+61%'}</p>
                  </div>
                </div>
                <div className="bg-[#C9A961] rounded-xl p-4 text-center">
                  <p className="text-slate-900 font-semibold">
                    {get('home_levee_banniere', "Investissement aligné • Rémunération à la performance")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">Témoignages</span>
              <div className="w-12 h-1 bg-[#C9A961]" />
            </div>
            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">
              {get('home_temoignages_titre', 'Ce que nos associés disent de nous')}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {get('home_temoignages_description', 'Des investisseurs engagés qui partagent leur expérience avec La Foncière Valora.')}
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) =>
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-slate-50 rounded-2xl p-8 relative">
                <Quote className="h-10 w-10 text-[#C9A961]/30 absolute top-6 right-6" />
                <p className="text-slate-700 leading-relaxed mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#1A3A52] rounded-full flex items-center justify-center">
                    <span className="text-[#C9A961] font-semibold">{testimonial.author.split(' ').map((n) => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A3A52]">{testimonial.author}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Sections dynamiques — Après Réalisations */}
      <DynamicSections page="accueil" minOrdre={700} maxOrdre={800} />

      {/* Zones avec carte */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                {get('home_zones_accroche', "Zones d'intervention")}
              </span>
              <div className="w-12 h-1 bg-[#C9A961]" />
            </div>
            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">
              {get('home_zones_titre', 'Des marchés à fort potentiel')}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {get('home_zones_description', "La stratégie d'investissement s'oriente vers des territoires présentant des perspectives de valorisation pérennes, fondées sur la profondeur du marché locatif, la stabilité démographique et la vitalité des bassins d'emploi.")}
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <InterventionMap />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-slate-900 mt-16 p-8 rounded-2xl md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-serif text-white mb-2">
                  {get('home_objectif_titre', 'Objectif Stratégique')}
                </h3>
                <p className="text-white/70 max-w-xl">
                  {get('home_objectif_description', "Créer de la valeur durable par amélioration de la performance énergétique (DPE C minimum), revalorisation locative, amortissement des prêts et plus-value à l'arbitrage.")}
                </p>
              </div>
              <Link to={createPageUrl("StrategyPerformance")}>
                <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] px-8 py-6 whitespace-nowrap font-semibold">
                  Découvrir notre stratégie <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sections dynamiques — Après Zones / avant CTA */}
      <DynamicSections page="accueil" minOrdre={800} maxOrdre={Infinity} />

      {/* CTA */}
      <section className="bg-[#C9A961] px-3 py-8">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-slate-900 mb-2 px-1 text-lg font-serif md:text-3xl">
              {get('home_cta_titre', 'Une plateforme immobilière ouverte aux partenaires')}
            </h2>
            <p className="text-slate-800 mb-5 text-base leading-relaxed">
              {get('home_cta_description', "Participez à une approche patrimoniale intégrant les enjeux de durabilité au sein d'une stratégie structurée.")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={createPageUrl("Contact")}>
                <Button className="bg-slate-900 text-slate-50 px-8 py-6 text-base font-semibold shadow hover:bg-[#1A3A52]">
                  Entrer en relation <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={createPageUrl("StrategyPerformance")}>
                <Button variant="outline" className="bg-slate-50 text-[#C9A961] px-8 py-6 text-base font-semibold border border-white/30">
                  Stratégie & Performance
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>);

}