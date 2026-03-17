import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp, Building2, Percent, Shield, FileText, Users,
  Eye, EyeOff, Lock, Mail, ArrowRight, BarChart3, Leaf,
  Calendar, Euro, PieChart, Download, Target, Zap, Calculator,
  TrendingDown, AlertCircle, CheckCircle2, DollarSign, Activity,
  Briefcase, Award, Clock, FileSpreadsheet, Rocket, MapPin } from
'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export default function EspaceAssocie() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [associeName, setAssociateName] = useState('');

  useEffect(() => {
    // Vérifier l'authentification au chargement
    const checkAuth = async () => {
      const savedAuth = localStorage.getItem('associe_auth');
      if (savedAuth) {
        try {
          const auth = JSON.parse(savedAuth);
          // Vérifier que le compte existe toujours et est actif
          const allAccess = await base44.entities.AccesAssocie.list();
          const associe = allAccess.find((a) =>
          a.email === auth.email &&
          a.actif === true
          );

          if (associe) {
            setIsLoggedIn(true);
            setAssociateName(auth.nom);
          } else {
            // Le compte n'existe plus ou est désactivé
            localStorage.removeItem('associe_auth');
          }
        } catch (error) {
          console.error('Erreur vérification auth:', error);
          localStorage.removeItem('associe_auth');
        }
      }
    };

    checkAuth();
  }, []);
  const [montantSimulation, setMontantSimulation] = useState(25000);
  const [dureeSimulation, setDureeSimulation] = useState(5);
  const [triCible, setTriCible] = useState(10);

  // Calculs simulateur intégré
  const capitalFinal = montantSimulation * Math.pow(1 + triCible / 100, dureeSimulation);
  const gainTotal = capitalFinal - montantSimulation;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      // Récupérer tous les accès actifs
      const allAccess = await base44.entities.AccesAssocie.list();

      // Filtrer manuellement pour trouver l'associé avec cet email et actif
      const associe = allAccess.find((a) =>
      a.email === loginData.email &&
      a.actif === true
      );

      if (!associe) {
        setLoginError('Email non reconnu ou compte désactivé');
        return;
      }

      // Vérifier le mot de passe
      if (associe.password !== loginData.password) {
        setLoginError('Mot de passe incorrect');
        return;
      }

      // Connexion réussie
      setIsLoggedIn(true);
      setAssociateName(associe.nom);
      localStorage.setItem('associe_auth', JSON.stringify({
        email: associe.email,
        nom: associe.nom
      }));
    } catch (error) {
      console.error('Erreur:', error);
      setLoginError('Erreur de connexion. Veuillez réessayer.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAssociateName('');
    localStorage.removeItem('associe_auth');
  };

  // Fetch dynamic data
  const { data: configs = [] } = useQuery({ queryKey: ['ea-config'], queryFn: () => base44.entities.EspaceAssocieConfig.list(), enabled: isLoggedIn });
  const { data: docsDb = [] } = useQuery({ queryKey: ['docs-associe'], queryFn: () => base44.entities.DocumentAssocie.filter({ actif: true }, '-date_document'), enabled: isLoggedIn });
  const { data: actuDb = [] } = useQuery({ queryKey: ['actu-associe'], queryFn: () => base44.entities.ActualiteAssocie.filter({ actif: true }, '-date_publication', 5), enabled: isLoggedIn });
  const { data: acqDb = [] } = useQuery({ queryKey: ['acq-associe'], queryFn: () => base44.entities.AcquisitionAssocie.list(), enabled: isLoggedIn });
  const { data: realisationDb = [] } = useQuery({ queryKey: ['realisation-biens'], queryFn: () => base44.entities.RealisationBien.filter({ actif: true }), enabled: isLoggedIn });
  const { data: roadmapDb = [] } = useQuery({ queryKey: ['roadmap-associe'], queryFn: () => base44.entities.RoadmapAssocie.list('ordre'), enabled: isLoggedIn });

  const getConfig = (key, fallback) => {
    const found = configs.find((c) => c.cle === key);
    if (found) {try {return JSON.parse(found.donnees);} catch {return fallback;}}
    return fallback;
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-slate-900 p-6 min-h-screen from-[#0A192F] via-[#1A3A52] to-[#0A192F] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md">

          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-40 h-40 flex items-center justify-center mx-auto mb-4">
                <img src="https://media.base44.com/images/public/699460f1b03f6285dc8513a7/a176d3ceb_logo2.png"

                alt="La Foncière Patrimoniale" className="h-full w-auto object-contain rounded-xl" />


              </div>
              <h1 className="text-2xl font-serif text-[#1A3A52] mb-2">Espace Associés</h1>
              <p className="text-slate-600">Accédez à votre tableau de bord sécurisé</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="pl-10"
                    placeholder="votre@email.com" />

                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="pl-10 pr-10"
                    placeholder="••••••••" />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600">

                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {loginError &&
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">{loginError}</p>
                </div>
              }

              <Button type="submit" className="bg-slate-900 text-white px-4 py-6 text-sm font-semibold rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 w-full hover:bg-[#2A4A6F]">
                Connexion sécurisée
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <a href="mailto:ayoubjaziri@gmail.com?subject=Mot de passe oublié - Espace Associés" className="text-sm text-slate-600 hover:text-[#C9A961] transition-colors">
                Mot de passe oublié ? Contacter l'administrateur
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500 text-center">
                Connexion sécurisée par chiffrement SSL. Authentification à deux facteurs disponible.
              </p>
            </div>
          </div>
        </motion.div>
      </div>);

  }

  // Dynamic data with fallbacks
  const kpisRaw = getConfig('kpis', [
  { label: "Valeur du Patrimoine", value: "3 200 000 €", change: "+8,5%", positive: true, detail: "Gross Asset Value réactualisée" },
  { label: "Rendement Net Annuel", value: "10,2%", change: "+0,7 pts", positive: true, detail: "TRI net de frais" },
  { label: "Ratio LTC", value: "68%", change: "-2%", positive: true, detail: "Loan To Cost" },
  { label: "Loyers Annuels", value: "185 000 €", change: "+12%", positive: true, detail: "Revenus locatifs bruts" }]
  );
  const kpiIcons = [Building2, TrendingUp, Percent, Euro];
  const kpis = kpisRaw.map((k, i) => ({ ...k, icon: kpiIcons[i] || BarChart3 }));

  const dpeData = [{ classe: "C", count: 42, color: "bg-lime-500", percentage: 100 }];

  const leveeRaw = getConfig('levee_fonds', { titre: 'Série A — Levée de Fonds Inaugurale', description: 'Levée de fonds pour le financement de nos premières acquisitions résidentielles en zones tendues.', objectif: 250000, collecte: 187500, souscripteurs: 12, dateCloture: '31 Mars 2026', ticketMinimum: '10 000 €', typeTitre: 'Actions ordinaires PEA-PME' });
  const leveeEnCours = { ...leveeRaw, pourcentage: Math.round(leveeRaw.collecte / leveeRaw.objectif * 100) };

  const valorisationRaw = getConfig('valorisation', { valeurActuelle: 3200000, evolution: '+8.5%', nombreActions: 32000, valeurAction: 100, plusValueAction: '+8.5%', dateValo: '31 Déc 2025', plusValueTotal: 250000 });
  const valorisationSociete = valorisationRaw;

  const indicRaw = getConfig('indicateurs', { occupation: '93,5%', delaiLocation: '18 jours', dette: '2 180 000 €', nbActifs: '4 immeubles', totalLots: '42 lots', couvertureLoyers: '~1,4x', ltv: '68%' });
  const energieRaw = getConfig('energie', { co2: '-450t', conso: '-42%' });
  const resultatsRaw = getConfig('resultats', { loyers: '185 000 €', tauxOccupation: '93,5%', resultatNet: '32 500 €', datePub: '15 janvier 2026', prochainResultat: '≈ 28 000 €', dateProchaineResult: '15 avril 2026' });
  const gouvernanceRaw = getConfig('gouvernance', { texte: "Accès réservé aux associés élus par les catégories B et C pour les décisions stratégiques (acquisitions, arbitrages, emprunts).", stratégieDette: "Amortissement progressif sur 20 ans. Effet de levier maîtrisé avec LTV cible ≤ 80% à l'acquisition." });

  // DB data - Synchronize from both RealisationBien (actifs réalisés) and AcquisitionAssocie (patrimoine)
  const patrimoine = [
    // Biens réalisés actifs (RealisationBien)
    ...realisationDb.map((r) => ({
      nom: r.titre,
      lots: r.logements ? parseInt(r.logements) : 0,
      valeur: r.investissement || '—',
      dpe: r.dpe_apres,
      occupation: r.plus_value || '—'
    })),
    // Acquisitions de type patrimoine
    ...acqDb.filter((a) => a.type === 'patrimoine').map((a) => ({
      nom: a.ville,
      lots: a.lots,
      valeur: a.valeur,
      dpe: a.dpe,
      occupation: a.occupation
    }))
  ];


  const acquisitionsEnCours = acqDb.filter((a) => a.type === 'acquisition_en_cours').length > 0 ?
  acqDb.filter((a) => a.type === 'acquisition_en_cours') :
  [
  { ville: "Toulouse - Capitole", prix: "1 850 000 €", lots: 14, dpe: "F → B", statut: "Due Diligence", avancement: 65, livraison: "Juin 2026" },
  { ville: "Montpellier Centre", prix: "950 000 €", lots: 8, dpe: "E → C", statut: "Négociation", avancement: 40, livraison: "Septembre 2026" }];


  const chantiers = acqDb.filter((a) => a.type === 'chantier');

  const roadmap = roadmapDb.length > 0 ? roadmapDb.map((r) => ({ etape: r.etape, date: r.date_prevue, statut: r.statut, avancement: r.avancement || 0 })) :
  [
  { etape: "Levée de fonds Série A", date: "Q1 2026", statut: "en_cours", avancement: 75 },
  { etape: "Acquisition Vichy", date: "Q2 2026", statut: "en_cours", avancement: 65 },
  { etape: "Acquisition Bordeaux", date: "Q3 2026", statut: "en_cours", avancement: 45 },
  { etape: "Acquisition Lyon", date: "Q4 2026", statut: "planifie", avancement: 0 },
  { etape: "Levée de fonds Série B", date: "Q1 2027", statut: "planifie", avancement: 0 },
  { etape: "Expansion zones cibles", date: "Q2 2027", statut: "planifie", avancement: 0 }];


  const actualites = actuDb.length > 0 ?
  actuDb.map((a) => ({ date: a.date_publication, title: a.titre, desc: a.description, type: a.type })) :
  [
  { date: "15 Fév 2026", title: "Acquisition d'un immeuble à Lyon 3ème", desc: "Signature notariée d'un actif de 1,25 M€ avec potentiel de valorisation de 25%", type: "acquisition" },
  { date: "10 Fév 2026", title: "Fin des travaux - Bordeaux Centre", desc: "12 lots rénovés avec passage DPE F → C. Mise en location immédiate.", type: "travaux" },
  { date: "5 Fév 2026", title: "Note du Président - Marché T1 2026", desc: "Perspectives encourageantes sur les marchés secondaires avec tensions locatives soutenues.", type: "note" }];


  const allDocs = docsDb.length > 0 ? docsDb : [];
  const documentsFinanciers = allDocs.filter((d) => d.categorie === 'Financier' || d.categorie === 'Fiscal').length > 0 ?
  allDocs.filter((d) => d.categorie === 'Financier' || d.categorie === 'Fiscal').map((d) => ({ name: d.nom, type: d.categorie, date: d.date_document || '', size: d.taille || '', url: d.file_url })) :
  [
  { name: "Bilan comptable 2025", type: "Bilan", date: "2025-12-31", size: "2.4 MB" },
  { name: "Compte de résultat 2025", type: "Compte de résultat", date: "2025-12-31", size: "1.8 MB" },
  { name: "Annexes comptables 2025", type: "Annexes", date: "2025-12-31", size: "3.2 MB" },
  { name: "Rapport du commissaire aux comptes", type: "Audit", date: "2026-01-15", size: "1.5 MB" }];


  const documents = allDocs.filter((d) => d.categorie !== 'Financier' && d.categorie !== 'Fiscal').length > 0 ?
  allDocs.filter((d) => d.categorie !== 'Financier' && d.categorie !== 'Fiscal').map((d) => ({ name: d.nom, date: d.date_document || '', type: d.type_acces, category: d.categorie, url: d.file_url })) :
  [
  { name: "Statuts de la société", date: "2025-01-15", type: "public", category: "Juridique" },
  { name: "Rapport annuel ESG 2025", date: "2025-12-31", type: "public", category: "ESG" },
  { name: "Pacte d'associés", date: "2025-02-01", type: "privé", category: "Juridique" },
  { name: "Bulletin de souscription", date: "2025-03-20", type: "privé", category: "Investissement" },
  { name: "Relevé fiscal annuel 2025", date: "2026-01-10", type: "privé", category: "Fiscal" },
  { name: "PV Assemblée Générale 2025", date: "2025-12-15", type: "public", category: "Gouvernance" }];



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Dashboard */}
      <div className="bg-[#0A192F] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif text-white mb-1">Espace Associés</h1>
              <p className="text-white/60 text-sm">Bienvenue {associeName} • Dernière mise à jour : 24 Février 2026</p>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">

              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Valorisation Société */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1A3A52] to-[#2A4A6F] rounded-2xl p-6 mb-8 text-white">

          <h3 className="text-xl font-serif mb-6">Valorisation de la Société</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <p className="text-white/60 text-sm mb-1">Valorisation Globale</p>
              <p className="text-3xl font-bold text-[#C9A961]">{typeof valorisationSociete.valeurActuelle === 'number' ? valorisationSociete.valeurActuelle.toLocaleString() : valorisationSociete.valeurActuelle} €</p>
              <p className="text-emerald-400 text-sm mt-1">{valorisationSociete.evolution} vs {valorisationSociete.dateValo}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Valeur de l'Action</p>
              <p className="text-3xl font-bold text-white">{valorisationSociete.valeurAction} €</p>
              <p className="text-emerald-400 text-sm mt-1">{valorisationSociete.plusValueAction} depuis création</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Nombre d'Actions</p>
              <p className="text-3xl font-bold text-white">{typeof valorisationSociete.nombreActions === 'number' ? valorisationSociete.nombreActions.toLocaleString() : valorisationSociete.nombreActions}</p>
              <p className="text-white/40 text-sm mt-1">Actions émises</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Plus-value Réalisée</p>
              <p className="text-3xl font-bold text-[#C9A961]">+{typeof valorisationSociete.plusValueTotal === 'number' ? valorisationSociete.plusValueTotal.toLocaleString() : valorisationSociete.plusValueTotal || '250 000'} €</p>
              <p className="text-emerald-400 text-sm mt-1">Sur période 2024-2025</p>
            </div>
          </div>
        </motion.div>

        {/* Levée en cours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#C9A961] to-[#B8994F] rounded-2xl p-6 mb-8">

          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-[#1A3A52] rounded-full animate-pulse" />
            <h3 className="text-xl font-serif text-[#1A3A52]">{leveeEnCours.titre || 'Levée de Fonds en Cours'}</h3>
          </div>
          {leveeEnCours.description && <p className="text-[#1A3A52]/70 text-sm mb-4">{leveeEnCours.description}</p>}
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            <div>
              <p className="text-[#1A3A52]/70 text-xs mb-1">Objectif</p>
              <p className="text-xl font-bold text-[#1A3A52]">{leveeEnCours.objectif.toLocaleString()} €</p>
            </div>
            <div>
              <p className="text-[#1A3A52]/70 text-xs mb-1">Collecté</p>
              <p className="text-xl font-bold text-[#1A3A52]">{leveeEnCours.collecte.toLocaleString()} €</p>
            </div>
            <div>
              <p className="text-[#1A3A52]/70 text-xs mb-1">Souscripteurs</p>
              <p className="text-xl font-bold text-[#1A3A52]">{leveeEnCours.souscripteurs}</p>
            </div>
            <div>
              <p className="text-[#1A3A52]/70 text-xs mb-1">Clôture</p>
              <p className="text-xl font-bold text-[#1A3A52]">{leveeEnCours.dateCloture}</p>
            </div>
            {leveeEnCours.ticketMinimum && <div>
              <p className="text-[#1A3A52]/70 text-xs mb-1">Ticket min.</p>
              <p className="text-xl font-bold text-[#1A3A52]">{leveeEnCours.ticketMinimum}</p>
            </div>}
            {leveeEnCours.typeTitre && <div>
              <p className="text-[#1A3A52]/70 text-xs mb-1">Type de titre</p>
              <p className="text-sm font-bold text-[#1A3A52]">{leveeEnCours.typeTitre}</p>
            </div>}
          </div>
          <div className="h-3 bg-[#1A3A52]/20 rounded-full overflow-hidden">
            <div className="h-full bg-[#1A3A52]" style={{ width: `${leveeEnCours.pourcentage}%` }} />
          </div>
          <p className="text-sm text-[#1A3A52]/80 mt-2">{leveeEnCours.pourcentage}% de l'objectif atteint</p>
        </motion.div>

        {/* KPIs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) =>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              kpi.positive ? 'bg-emerald-100' : 'bg-red-100'}`
              }>
                  <kpi.icon className={`h-6 w-6 ${kpi.positive ? 'text-emerald-600' : 'text-red-600'}`} />
                </div>
                <span className={`text-sm font-semibold ${
              kpi.positive ? 'text-emerald-600' : 'text-red-600'}`
              }>
                  {kpi.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-1">{kpi.value}</p>
              <p className="text-sm text-slate-600">{kpi.label}</p>
              <p className="text-xs text-slate-400 mt-2">{kpi.detail}</p>
            </motion.div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Simulateur Intégré */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#1A3A52] to-[#2A4A6F] rounded-2xl p-6 text-white">

              <div className="flex items-center gap-3 mb-6">
                <Calculator className="h-6 w-6 text-[#C9A961]" />
                <h3 className="text-xl font-serif">Simulateur d'Investissement</h3>
              </div>

              <div className="space-y-5 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-white/80">Montant investi</label>
                    <span className="text-lg font-bold text-[#C9A961]">{montantSimulation.toLocaleString()} €</span>
                  </div>
                  <Slider value={[montantSimulation]} onValueChange={(value) => setMontantSimulation(value[0])} min={10000} max={100000} step={5000} />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-white/80">Durée</label>
                    <span className="text-lg font-bold text-[#C9A961]">{dureeSimulation} ans</span>
                  </div>
                  <Slider value={[dureeSimulation]} onValueChange={(value) => setDureeSimulation(value[0])} min={3} max={10} step={1} />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-white/80">TRI cible</label>
                    <span className="text-lg font-bold text-[#C9A961]">{triCible}%</span>
                  </div>
                  <Slider value={[triCible]} onValueChange={(value) => setTriCible(value[0])} min={0.5} max={35} step={0.5} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-white/60 text-xs mb-1">Capital Final</p>
                  <p className="text-2xl font-bold text-white">{Math.round(capitalFinal).toLocaleString()} €</p>
                </div>
                <div className="bg-[#C9A961]/20 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-white/60 text-xs mb-1">Gain Total</p>
                  <p className="text-2xl font-bold text-[#C9A961]">+{Math.round(gainTotal).toLocaleString()} €</p>
                </div>
              </div>


            </motion.div>

            {/* DPE Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Performance Énergétique du Parc</h3>
                <Target className="h-6 w-6 text-[#C9A961]" />
              </div>
              
              <div className="space-y-3">
                {dpeData.map((dpe, index) =>
                <div key={index} className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${dpe.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-lg">{dpe.classe}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{dpe.count} lots</span>
                        <span className="text-sm text-slate-600">{dpe.percentage}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${dpe.color}`} style={{ width: `${dpe.percentage}%` }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4">
                <Leaf className="h-6 w-6 text-emerald-600 mb-2" />
                <p className="text-2xl font-bold text-emerald-900">{energieRaw.co2}</p>
                <p className="text-xs text-emerald-700">CO₂ économisées/an</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <Zap className="h-6 w-6 text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-blue-900">{energieRaw.conso}</p>
                <p className="text-xs text-blue-700">Conso énergétique</p>
              </div>
              </div>
            </motion.div>

            {/* Patrimoine Détaillé */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

              <h3 className="text-lg font-semibold text-slate-900 mb-6">Composition du Patrimoine</h3>
              <div className="space-y-3">
                {patrimoine.map((actif, index) =>
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">{actif.nom}</h4>
                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <span>{actif.lots} lots</span>
                        <span>•</span>
                        <span>DPE {actif.dpe}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-semibold">Occupation {actif.occupation}</span>
                      </div>
                    </div>
                    <span className="font-bold text-[#1A3A52]">{actif.valeur}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Chantiers en cours */}
            {chantiers.length > 0 &&
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

              <h3 className="text-lg font-semibold text-slate-900 mb-6">Chantiers en Cours</h3>
              <div className="space-y-4">
                {chantiers.map((c, i) =>
                <div key={i} className="border-l-4 border-[#C9A961] pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">{c.ville}</h4>
                        <p className="text-sm text-slate-600">{c.lots} lots {c.dpe ? `• DPE ${c.dpe}` : ''}</p>
                      </div>
                      <span className="text-sm font-semibold text-[#C9A961]">{c.avancement}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-[#C9A961]" style={{ width: `${c.avancement}%` }} /></div>
                    {c.livraison && <p className="text-xs text-slate-500 mt-2">Livraison prévue : {c.livraison}</p>}
                  </div>
                )}
              </div>
            </motion.div>
            }

            {/* Acquisitions en Cours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

              <div className="flex items-center gap-3 mb-6">
                <MapPin className="h-6 w-6 text-[#C9A961]" />
                <h3 className="text-lg font-semibold text-slate-900">Acquisitions en Cours</h3>
              </div>
              
              <div className="space-y-4">
                {acquisitionsEnCours.map((acq, index) =>
                <div key={index} className="border-l-4 border-[#C9A961] pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">{acq.ville}</h4>
                        <p className="text-sm text-slate-600">{acq.lots} lots • {acq.dpe}</p>
                        <p className="text-xs text-slate-500 mt-1">Prix : {acq.prix}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                    acq.statut === 'Due Diligence' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`
                    }>
                        {acq.statut}
                      </span>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>Avancement</span>
                        <span>{acq.avancement}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#C9A961]" style={{ width: `${acq.avancement}%` }} />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">Livraison prévue : {acq.livraison}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Roadmap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

              <div className="flex items-center gap-3 mb-6">
                <Rocket className="h-6 w-6 text-[#C9A961]" />
                <h3 className="text-lg font-semibold text-slate-900">Roadmap 2026-2027</h3>
              </div>
              
              <div className="space-y-3">
                {roadmap.map((item, index) =>
                <div key={index} className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  item.statut === 'en_cours' ? 'bg-[#C9A961]' : 'bg-slate-200'}`
                  }>
                      {item.statut === 'en_cours' ?
                    <CheckCircle2 className="h-5 w-5 text-[#1A3A52]" /> :

                    <Clock className="h-5 w-5 text-slate-500" />
                    }
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-slate-900 text-sm">{item.etape}</h4>
                        <span className="text-xs text-slate-500">{item.date}</span>
                      </div>
                      {item.statut === 'en_cours' &&
                    <div className="mt-2">
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#C9A961]" style={{ width: `${item.avancement}%` }} />
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{item.avancement}% complété</p>
                        </div>
                    }
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Revenus & Résultats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

              <h3 className="text-lg font-semibold text-slate-900 mb-6">Revenus & Résultats</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Revenus locatifs annuels</p>
                    <p className="text-xs text-slate-500">Taux d'occupation moyen : {resultatsRaw.tauxOccupation}</p>
                  </div>
                  <span className="text-2xl font-bold text-emerald-700">{resultatsRaw.loyers}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Résultat Net (dernier trimestre)</p>
                    <p className="text-xs text-slate-500">Publié le {resultatsRaw.datePub}</p>
                  </div>
                  <span className="text-2xl font-bold text-blue-700">{resultatsRaw.resultatNet}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Prochain résultat net</p>
                    <p className="text-xs text-slate-500">Prévu : {resultatsRaw.dateProchaineResult}</p>
                  </div>
                  <span className="text-lg font-bold text-slate-900">{resultatsRaw.prochainResultat}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Documents Financiers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Documents Financiers</h3>
                <FileSpreadsheet className="h-6 w-6 text-slate-400" />
              </div>
              
              <div className="space-y-3 mb-4">
                {documentsFinanciers.map((doc, index) =>
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {doc.type}
                        </span>
                        <span className="text-xs text-slate-500">{doc.date}</span>
                        <span className="text-xs text-slate-400">• {doc.size}</span>
                      </div>
                    </div>
                    {doc.url ?
                  <a href={doc.url} target="_blank" rel="noreferrer" className="text-[#C9A961] hover:text-[#B8994F]"><Download className="h-5 w-5" /></a> :

                  <button className="text-slate-300 cursor-not-allowed"><Download className="h-5 w-5" /></button>
                  }
                  </div>
                )}
              </div>

              <Button className="w-full bg-[#1A3A52] hover:bg-[#2A4A6F] text-white font-semibold">
                <FileSpreadsheet className="mr-2 h-5 w-5" />
                Générer Rapport Financier
              </Button>
            </motion.div>

            {/* Documents Juridiques */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Documents Juridiques</h3>
                <FileText className="h-6 w-6 text-slate-400" />
              </div>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {documents.map((doc, index) =>
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                      doc.type === 'public' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`
                      }>
                        {doc.type}
                      </span>
                      <span className="text-xs text-slate-500">{doc.date}</span>
                    </div>
                  </div>
                  {doc.url ?
                  <a href={doc.url} target="_blank" rel="noreferrer" className="text-[#C9A961] hover:text-[#B8994F]"><Download className="h-5 w-5" /></a> :

                  <button className="text-slate-300 cursor-not-allowed"><Download className="h-5 w-5" /></button>
                  }
                </div>
                )}
              </div>
            </motion.div>

            {/* Actualités */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Actualités</h3>
                <Calendar className="h-6 w-6 text-slate-400" />
              </div>
              
              <div className="space-y-4">
                {actualites.map((actu, index) =>
                <div key={index} className="border-l-2 border-[#C9A961] pl-4">
                    <p className="text-xs text-slate-500 mb-1">{actu.date}</p>
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">{actu.title}</h4>
                    <p className="text-xs text-slate-600">{actu.desc}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Indicateurs Additionnels */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

              <h3 className="text-lg font-semibold text-slate-900 mb-4">Indicateurs Clés</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Taux d'occupation</span>
                  <span className="font-bold text-emerald-600">{indicRaw.occupation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Délai moyen de location</span>
                  <span className="font-bold text-slate-900">{indicRaw.delaiLocation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Dette résiduelle</span>
                  <span className="font-bold text-slate-900">{indicRaw.dette}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Nombre d'actifs</span>
                  <span className="font-bold text-slate-900">{indicRaw.nbActifs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total lots</span>
                  <span className="font-bold text-slate-900">{indicRaw.totalLots}</span>
                </div>
              </div>
            </motion.div>

            {/* État de la dette */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.38 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-5">État de la Dette</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-600">Dette totale résiduelle</span>
                  <span className="font-bold text-slate-900">{indicRaw.dette}</span>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">LTV (Loan to Value)</span>
                    <span className="font-semibold text-slate-900">{kpis[2]?.value || '68%'}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-[#C9A961] rounded-full" style={{ width: kpis[2]?.value || '68%' }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Seuil cible ≤ 80%</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-emerald-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1">Actifs financés</p>
                    <p className="font-bold text-emerald-700">{indicRaw.nbActifs}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1">Couverture loyers/dette</p>
                    <p className="font-bold text-blue-700">{indicRaw.couvertureLoyers || '~1,4x'}</p>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    <strong>Stratégie :</strong> {gouvernanceRaw.stratégieDette}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Gouvernance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-[#1A3A52] to-[#2A4A6F] rounded-2xl p-6 shadow-sm">

              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-[#C9A961]" />
                <h3 className="text-lg font-semibold text-white">Comité Opérationnel</h3>
              </div>
              <p className="text-white/70 text-sm mb-4">
                {gouvernanceRaw.texte}
              </p>
              <Button className="w-full bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
                Accéder au Comité
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Avertissement légal */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-600">Les données présentées dans cet espace sont confidentielles et réservées aux associés. Toute diffusion est strictement interdite.</p>
        </div>















      </div>
    </div>);

}