import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Building2, Percent, Shield, FileText, Users, 
  Eye, EyeOff, Lock, Mail, ArrowRight, BarChart3, Leaf, 
  Calendar, Euro, PieChart, Download, Target, Zap, Calculator,
  TrendingDown, AlertCircle, CheckCircle2, DollarSign, Activity,
  Briefcase, Award, Clock
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export default function EspaceAssocie() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [montantSimulation, setMontantSimulation] = useState(25000);
  const [dureeSimulation, setDureeSimulation] = useState(5);

  // Calculs simulateur intégré
  const leverageRatio = 4;
  const montantEmprunte = montantSimulation * leverageRatio;
  const valeurTotaleActif = montantSimulation + montantEmprunte;
  const triNet = 10.5;
  const capitalFinal = montantSimulation * Math.pow(1 + triNet/100, dureeSimulation);
  const gainTotal = capitalFinal - montantSimulation;

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A192F] via-[#1A3A52] to-[#0A192F] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-[#C9A961] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-[#1A3A52]" />
              </div>
              <h1 className="text-2xl font-serif text-[#1A3A52] mb-2">Espace Associé</h1>
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
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    className="pl-10"
                    placeholder="votre@email.com"
                  />
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
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#1A3A52] hover:bg-[#2A4A6F] text-white py-6 font-semibold">
                Connexion sécurisée
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-slate-600 hover:text-[#C9A961]">Mot de passe oublié ?</a>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500 text-center">
                Connexion sécurisée par chiffrement SSL. Authentification à deux facteurs disponible.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const kpis = [
    { 
      label: "Valeur du Patrimoine", 
      value: "3 200 000 €", 
      change: "+8,5%", 
      positive: true, 
      icon: Building2,
      detail: "Gross Asset Value réactualisée"
    },
    { 
      label: "Rendement Net Annuel", 
      value: "10,2%", 
      change: "+0,7 pts", 
      positive: true, 
      icon: TrendingUp,
      detail: "TRI net de frais"
    },
    { 
      label: "Ratio LTV", 
      value: "68%", 
      change: "-2%", 
      positive: true, 
      icon: Percent,
      detail: "Loan To Value"
    },
    { 
      label: "Loyers Annuels", 
      value: "185 000 €", 
      change: "+12%", 
      positive: true, 
      icon: Euro,
      detail: "Revenus locatifs bruts"
    }
  ];

  const dpeData = [
    { classe: "C", count: 42, color: "bg-lime-500", percentage: 100 }
  ];

  const documents = [
    { name: "Statuts de la société", date: "2025-01-15", type: "public", category: "Juridique" },
    { name: "Rapport annuel ESG 2025", date: "2025-12-31", type: "public", category: "ESG" },
    { name: "Pacte d'associés", date: "2025-02-01", type: "privé", category: "Juridique" },
    { name: "Bulletin de souscription", date: "2025-03-20", type: "privé", category: "Investissement" },
    { name: "Relevé fiscal annuel 2025", date: "2026-01-10", type: "privé", category: "Fiscal" },
    { name: "PV Assemblée Générale 2025", date: "2025-12-15", type: "public", category: "Gouvernance" }
  ];

  const actualites = [
    {
      date: "15 Fév 2026",
      title: "Acquisition d'un immeuble à Lyon 3ème",
      desc: "Signature notariée d'un actif de 1,25 M€ avec potentiel de valorisation de 25%",
      type: "acquisition"
    },
    {
      date: "10 Fév 2026",
      title: "Fin des travaux - Bordeaux Centre",
      desc: "12 lots rénovés avec passage DPE F → C. Mise en location immédiate.",
      type: "travaux"
    },
    {
      date: "5 Fév 2026",
      title: "Note du Président - Marché T1 2026",
      desc: "Perspectives encourageantes sur les marchés secondaires avec tensions locatives soutenues.",
      type: "note"
    }
  ];

  const leveeEnCours = {
    objectif: 250000,
    collecte: 187500,
    pourcentage: 75,
    souscripteurs: 12,
    dateCloture: "31 Mars 2026"
  };

  const patrimoine = [
    { nom: "Lyon 3ème - Garibaldi", lots: 8, valeur: "980 000 €", dpe: "C", occupation: "87%" },
    { nom: "Bordeaux Centre", lots: 12, valeur: "1 450 000 €", dpe: "C", occupation: "100%" },
    { nom: "Vichy - Boulevard Kennedy", lots: 6, valeur: "420 000 €", dpe: "C", occupation: "92%" },
    { nom: "Clermont-Ferrand", lots: 16, valeur: "1 350 000 €", dpe: "C", occupation: "95%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Dashboard */}
      <div className="bg-[#0A192F] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif text-white mb-1">Espace Associé</h1>
              <p className="text-white/60 text-sm">Dernière mise à jour : 24 Février 2026</p>
            </div>
            <Button 
              onClick={() => setIsLoggedIn(false)} 
              className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold"
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Levée en cours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#C9A961] to-[#B8994F] rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-[#1A3A52] rounded-full animate-pulse" />
            <h3 className="text-xl font-serif text-[#1A3A52]">Levée de Fonds en Cours</h3>
          </div>
          <div className="grid md:grid-cols-4 gap-6 mb-4">
            <div>
              <p className="text-[#1A3A52]/70 text-sm mb-1">Objectif</p>
              <p className="text-2xl font-bold text-[#1A3A52]">{leveeEnCours.objectif.toLocaleString()} €</p>
            </div>
            <div>
              <p className="text-[#1A3A52]/70 text-sm mb-1">Collecté</p>
              <p className="text-2xl font-bold text-[#1A3A52]">{leveeEnCours.collecte.toLocaleString()} €</p>
            </div>
            <div>
              <p className="text-[#1A3A52]/70 text-sm mb-1">Souscripteurs</p>
              <p className="text-2xl font-bold text-[#1A3A52]">{leveeEnCours.souscripteurs}</p>
            </div>
            <div>
              <p className="text-[#1A3A52]/70 text-sm mb-1">Clôture</p>
              <p className="text-2xl font-bold text-[#1A3A52]">{leveeEnCours.dateCloture}</p>
            </div>
          </div>
          <div className="h-3 bg-[#1A3A52]/20 rounded-full overflow-hidden">
            <div className="h-full bg-[#1A3A52]" style={{width: `${leveeEnCours.pourcentage}%`}} />
          </div>
          <p className="text-sm text-[#1A3A52]/80 mt-2">{leveeEnCours.pourcentage}% de l'objectif atteint</p>
        </motion.div>

        {/* KPIs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  kpi.positive ? 'bg-emerald-100' : 'bg-red-100'
                }`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.positive ? 'text-emerald-600' : 'text-red-600'}`} />
                </div>
                <span className={`text-sm font-semibold ${
                  kpi.positive ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-1">{kpi.value}</p>
              <p className="text-sm text-slate-600">{kpi.label}</p>
              <p className="text-xs text-slate-400 mt-2">{kpi.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Simulateur Intégré */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#1A3A52] to-[#2A4A6F] rounded-2xl p-6 text-white"
            >
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="h-6 w-6 text-[#C9A961]" />
                <h3 className="text-xl font-serif">Simulateur d'Investissement</h3>
              </div>

              <div className="space-y-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-white/80">Montant</label>
                    <span className="text-xl font-bold text-[#C9A961]">{montantSimulation.toLocaleString()} €</span>
                  </div>
                  <Slider
                    value={[montantSimulation]}
                    onValueChange={(value) => setMontantSimulation(value[0])}
                    min={10000}
                    max={100000}
                    step={5000}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-white/80">Durée</label>
                    <span className="text-xl font-bold text-[#C9A961]">{dureeSimulation} ans</span>
                  </div>
                  <Slider
                    value={[dureeSimulation]}
                    onValueChange={(value) => setDureeSimulation(value[0])}
                    min={3}
                    max={10}
                    step={1}
                  />
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

              <Link to={createPageUrl("SimulateurInvestissement")}>
                <Button className="w-full mt-4 bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
                  Simulateur Avancé
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            {/* DPE Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Performance Énergétique du Parc</h3>
                <Target className="h-6 w-6 text-[#C9A961]" />
              </div>
              
              <div className="space-y-3">
                {dpeData.map((dpe, index) => (
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
                        <div className={`h-full ${dpe.color}`} style={{width: `${dpe.percentage}%`}} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-xl p-4">
                  <Leaf className="h-6 w-6 text-emerald-600 mb-2" />
                  <p className="text-2xl font-bold text-emerald-900">-450t</p>
                  <p className="text-xs text-emerald-700">CO₂ économisées/an</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <Zap className="h-6 w-6 text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-blue-900">-42%</p>
                  <p className="text-xs text-blue-700">Conso énergétique</p>
                </div>
              </div>
            </motion.div>

            {/* Patrimoine Détaillé */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Composition du Patrimoine</h3>
              <div className="space-y-3">
                {patrimoine.map((actif, index) => (
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
                ))}
              </div>
            </motion.div>

            {/* Chantiers en cours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Chantiers en Cours</h3>
              
              <div className="space-y-4">
                <div className="border-l-4 border-[#C9A961] pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900">Lyon 3ème - Rue Garibaldi</h4>
                      <p className="text-sm text-slate-600">8 lots • DPE G → C</p>
                    </div>
                    <span className="text-sm font-semibold text-[#C9A961]">75%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C9A961]" style={{width: '75%'}} />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Livraison prévue : Mars 2026</p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900">Vichy Centre - Boulevard Kennedy</h4>
                      <p className="text-sm text-slate-600">6 lots • DPE F → C</p>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">45%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{width: '45%'}} />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Livraison prévue : Mai 2026</p>
                </div>
              </div>
            </motion.div>

            {/* Revenus & Distributions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Revenus & Distributions</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Revenus locatifs 2025</p>
                    <p className="text-xs text-slate-500">Taux d'occupation moyen : 93,5%</p>
                  </div>
                  <span className="text-2xl font-bold text-emerald-700">185 000 €</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Distribution T4 2025</p>
                    <p className="text-xs text-slate-500">Versée le 15 janvier 2026</p>
                  </div>
                  <span className="text-2xl font-bold text-blue-700">32 500 €</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Prochaine distribution</p>
                    <p className="text-xs text-slate-500">Prévue : 15 avril 2026</p>
                  </div>
                  <span className="text-lg font-bold text-slate-900">≈ 28 000 €</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Documents */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Documents</h3>
                <FileText className="h-6 w-6 text-slate-400" />
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          doc.type === 'public' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {doc.type}
                        </span>
                        <span className="text-xs text-slate-500">{doc.date}</span>
                      </div>
                    </div>
                    <button className="text-[#C9A961] hover:text-[#B8994F]">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Actualités */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Actualités</h3>
                <Calendar className="h-6 w-6 text-slate-400" />
              </div>
              
              <div className="space-y-4">
                {actualites.map((actu, index) => (
                  <div key={index} className="border-l-2 border-[#C9A961] pl-4">
                    <p className="text-xs text-slate-500 mb-1">{actu.date}</p>
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">{actu.title}</h4>
                    <p className="text-xs text-slate-600">{actu.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Indicateurs Additionnels */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Indicateurs Clés</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Taux d'occupation</span>
                  <span className="font-bold text-emerald-600">93,5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Délai moyen de location</span>
                  <span className="font-bold text-slate-900">18 jours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Dette résiduelle</span>
                  <span className="font-bold text-slate-900">2 180 000 €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Nombre d'actifs</span>
                  <span className="font-bold text-slate-900">4 immeubles</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total lots</span>
                  <span className="font-bold text-slate-900">42 lots</span>
                </div>
              </div>
            </motion.div>

            {/* Gouvernance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-[#1A3A52] to-[#2A4A6F] rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-[#C9A961]" />
                <h3 className="text-lg font-semibold text-white">Comité Opérationnel</h3>
              </div>
              <p className="text-white/70 text-sm mb-4">
                Accès réservé aux associés élus par les catégories B et C pour les décisions stratégiques 
                (acquisitions, arbitrages, emprunts).
              </p>
              <Button className="w-full bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
                Accéder au Comité
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Avertissement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-amber-50 border-2 border-amber-200 rounded-2xl p-6"
        >
          <div className="flex gap-4">
            <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Informations Importantes</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                Les données présentées sont basées sur les performances réelles du parc immobilier. 
                Les projections futures sont des estimations et ne garantissent pas les résultats futurs. 
                Tout investissement comporte des risques de perte en capital. Document non contractuel.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}