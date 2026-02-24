import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Building2, Percent, Shield, FileText, Users, 
  Eye, EyeOff, Lock, Mail, ArrowRight, BarChart3, Leaf, 
  Calendar, Euro, PieChart, Download, Target, Zap
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EspaceInvestisseurs() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Simulation de login
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
              <h1 className="text-2xl font-serif text-[#1A3A52] mb-2">Espace Investisseurs</h1>
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

  // Dashboard
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
    { classe: "A", count: 0, color: "bg-emerald-500", percentage: 0 },
    { classe: "B", count: 0, color: "bg-green-500", percentage: 0 },
    { classe: "C", count: 42, color: "bg-lime-500", percentage: 100 },
    { classe: "D", count: 0, color: "bg-yellow-500", percentage: 0 },
    { classe: "E", count: 0, color: "bg-orange-500", percentage: 0 },
    { classe: "F", count: 0, color: "bg-red-400", percentage: 0 },
    { classe: "G", count: 0, color: "bg-red-600", percentage: 0 }
  ];

  const documents = [
    { name: "Statuts de la société", date: "2025-01-15", type: "public", category: "Juridique" },
    { name: "Rapport annuel ESG 2025", date: "2025-12-31", type: "public", category: "ESG" },
    { name: "Bulletin de souscription", date: "2025-03-20", type: "privé", category: "Investissement" },
    { name: "Relevé fiscal annuel 2025", date: "2026-01-10", type: "privé", category: "Fiscal" }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Dashboard */}
      <div className="bg-[#0A192F] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif text-white mb-1">Espace Investisseurs</h1>
              <p className="text-white/60 text-sm">Dernière mise à jour : 24 Février 2026</p>
            </div>
            <Button 
              onClick={() => setIsLoggedIn(false)} 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
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
          {/* Left Column - ESG & DPE */}
          <div className="lg:col-span-2 space-y-8">
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
                {dpeData.filter(d => d.count > 0).map((dpe, index) => (
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
          </div>

          {/* Right Column - Documents & News */}
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
              
              <div className="space-y-3">
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

            {/* Gouvernance (Catégorie A uniquement) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-[#1A3A52] to-[#2A4A6F] rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-[#C9A961]" />
                <h3 className="text-lg font-semibold text-white">Comité de Pilotage</h3>
              </div>
              <p className="text-white/70 text-sm mb-4">
                Accès réservé aux associés de catégorie A pour les décisions stratégiques.
              </p>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                Accéder au Comité
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}