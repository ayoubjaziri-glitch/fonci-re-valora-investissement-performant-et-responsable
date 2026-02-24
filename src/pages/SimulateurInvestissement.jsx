import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  Calculator, TrendingUp, Euro, Calendar, BarChart3, 
  ArrowRight, Leaf, Building2, Target, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function SimulateurInvestissement() {
  const [montant, setMontant] = useState(50000);
  const [duree, setDuree] = useState(5);
  const [profil, setProfil] = useState('equilibre'); // prudent, equilibre, dynamique

  // Paramètres de projection selon profil
  const profiles = {
    prudent: { tri: 8.5, plusValue: 15, renovation: 'C' },
    equilibre: { tri: 10.5, plusValue: 25, renovation: 'B' },
    dynamique: { tri: 12.5, plusValue: 35, renovation: 'A' }
  };

  const currentProfile = profiles[profil];

  // Calculs
  const apportPersonnel = montant;
  const leverageRatio = 4; // LTV 80%
  const montantEmprunte = apportPersonnel * leverageRatio;
  const valeurTotaleActif = apportPersonnel + montantEmprunte;
  
  // Revenus locatifs annuels (estimation 4% du capital investi)
  const revenuLocatifAnnuel = valeurTotaleActif * 0.04;
  const revenuLocatifTotal = revenuLocatifAnnuel * duree;

  // Amortissement crédit (simplification linéaire)
  const amortissementTotal = montantEmprunte * 0.15 * duree; // ~15% par an
  
  // Plus-value immobilière
  const plusValuePourcent = currentProfile.plusValue;
  const plusValueEuros = valeurTotaleActif * (plusValuePourcent / 100);

  // Valeur finale
  const valeurFinaleActif = valeurTotaleActif + plusValueEuros;
  const detteRestante = montantEmprunte - amortissementTotal;
  const capitalFinal = valeurFinaleActif - detteRestante;

  // Performance
  const gainTotal = capitalFinal - apportPersonnel;
  const triNet = ((capitalFinal / apportPersonnel) ** (1 / duree) - 1) * 100;

  // Projection année par année
  const projectionAnnuelle = [];
  for (let annee = 1; annee <= duree; annee++) {
    const revenuAnnee = revenuLocatifAnnuel;
    const amortissementAnnee = montantEmprunte * 0.15;
    const plusValuePartielle = (valeurTotaleActif * (plusValuePourcent / 100)) * (annee / duree);
    const capitalAnnee = apportPersonnel + (amortissementAnnee * annee) + plusValuePartielle;
    
    projectionAnnuelle.push({
      annee,
      capital: Math.round(capitalAnnee),
      revenus: Math.round(revenuAnnee),
      plusValue: Math.round(plusValuePartielle)
    });
  }

  const scenarios = [
    {
      id: 'prudent',
      nom: 'Prudent',
      description: 'DPE C minimum - Marchés secondaires stables',
      tri: '8,5%',
      risque: 'Faible',
      color: 'blue'
    },
    {
      id: 'equilibre',
      nom: 'Équilibré',
      description: 'DPE B - Rénovation performante',
      tri: '10,5%',
      risque: 'Modéré',
      color: 'emerald'
    },
    {
      id: 'dynamique',
      nom: 'Dynamique',
      description: 'DPE A - Actifs premium + forte revalorisation',
      tri: '12,5%',
      risque: 'Élevé',
      color: 'amber'
    }
  ];

  const impactDPE = [
    { niveau: 'F → C', valorisation: '+15%', economie: '-40%', detail: 'Mise en conformité réglementaire' },
    { niveau: 'F → B', valorisation: '+25%', economie: '-55%', detail: 'Performance énergétique supérieure' },
    { niveau: 'F → A', valorisation: '+35%', economie: '-65%', detail: 'Excellence énergétique' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-[#1A3A52] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 border border-white/20 rounded-full" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                Simulateur
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Simulateur d'Investissement
            </h1>
            <p className="text-xl text-white/70">
              Projetez votre investissement et visualisez l'impact de la rénovation énergétique 
              sur la création de valeur patrimoniale.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Inputs */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-lg sticky top-24"
            >
              <div className="flex items-center gap-3 mb-8">
                <Calculator className="h-8 w-8 text-[#C9A961]" />
                <h2 className="text-2xl font-serif text-[#1A3A52]">Vos Paramètres</h2>
              </div>

              {/* Montant */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-slate-700">Montant de souscription</label>
                  <span className="text-2xl font-bold text-[#1A3A52]">{montant.toLocaleString()} €</span>
                </div>
                <Slider
                  value={[montant]}
                  onValueChange={(value) => setMontant(value[0])}
                  min={10000}
                  max={200000}
                  step={5000}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>10 000 €</span>
                  <span>200 000 €</span>
                </div>
              </div>

              {/* Durée */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-slate-700">Durée de détention</label>
                  <span className="text-2xl font-bold text-[#1A3A52]">{duree} ans</span>
                </div>
                <Slider
                  value={[duree]}
                  onValueChange={(value) => setDuree(value[0])}
                  min={3}
                  max={10}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>3 ans</span>
                  <span>10 ans</span>
                </div>
              </div>

              {/* Profil */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-700 mb-4">Profil d'investissement</label>
                <div className="space-y-3">
                  {scenarios.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => setProfil(scenario.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        profil === scenario.id
                          ? `border-${scenario.color}-500 bg-${scenario.color}-50`
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-slate-900">{scenario.nom}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          profil === scenario.id ? `bg-${scenario.color}-100 text-${scenario.color}-700` : 'bg-slate-100 text-slate-600'
                        }`}>
                          TRI {scenario.tri}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{scenario.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Structure effet de levier */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-3 text-sm">Structure de financement</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Apport personnel</span>
                    <span className="font-semibold text-slate-900">{apportPersonnel.toLocaleString()} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Levier bancaire (LTV 80%)</span>
                    <span className="font-semibold text-slate-900">{montantEmprunte.toLocaleString()} €</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="text-slate-900 font-semibold">Valeur totale de l'actif</span>
                    <span className="font-bold text-[#1A3A52]">{valeurTotaleActif.toLocaleString()} €</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right - Results */}
          <div className="space-y-6">
            {/* Performance globale */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-[#1A3A52] to-[#2A4A6F] rounded-3xl p-8 text-white"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-8 w-8 text-[#C9A961]" />
                <h3 className="text-2xl font-serif">Performance Projetée</h3>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-white/60 text-sm mb-1">Capital Final</p>
                  <p className="text-3xl font-bold">{Math.round(capitalFinal).toLocaleString()} €</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Gain Total</p>
                  <p className="text-3xl font-bold text-[#C9A961]">+{Math.round(gainTotal).toLocaleString()} €</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">TRI Net Projeté</span>
                  <span className="text-2xl font-bold text-[#C9A961]">{triNet.toFixed(1)}%</span>
                </div>
              </div>
            </motion.div>

            {/* Décomposition */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200"
            >
              <h4 className="font-semibold text-slate-900 mb-4">Décomposition de la Valeur</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Euro className="h-6 w-6 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Revenus Locatifs</p>
                      <p className="text-xs text-slate-600">{duree} ans cumulés</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-700">{Math.round(revenuLocatifTotal).toLocaleString()} €</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Amortissement Crédit</p>
                      <p className="text-xs text-slate-600">Capital remboursé</p>
                    </div>
                  </div>
                  <span className="font-bold text-blue-700">{Math.round(amortissementTotal).toLocaleString()} €</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-amber-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Plus-value Immobilière</p>
                      <p className="text-xs text-slate-600">+{plusValuePourcent}% valorisation</p>
                    </div>
                  </div>
                  <span className="font-bold text-amber-700">{Math.round(plusValueEuros).toLocaleString()} €</span>
                </div>
              </div>
            </motion.div>

            {/* Projection annuelle */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-slate-200"
            >
              <h4 className="font-semibold text-slate-900 mb-4">Évolution du Capital</h4>
              <div className="space-y-2">
                {projectionAnnuelle.map((annee) => (
                  <div key={annee.annee} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-600 w-16">An {annee.annee}</span>
                    <div className="flex-1">
                      <div className="h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                        <div 
                          className="h-full bg-gradient-to-r from-[#C9A961] to-[#B8994F] flex items-center justify-end pr-2"
                          style={{ width: `${(annee.capital / capitalFinal) * 100}%` }}
                        >
                          <span className="text-xs font-semibold text-[#1A3A52]">
                            {annee.capital.toLocaleString()} €
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Impact DPE */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <Leaf className="h-6 w-6 text-emerald-600" />
                <h4 className="font-semibold text-slate-900">Impact de la Rénovation DPE</h4>
              </div>
              <div className="space-y-3">
                {impactDPE.map((impact, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 border border-emerald-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-slate-900">{impact.niveau}</span>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                          {impact.valorisation}
                        </span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          {impact.economie}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">{impact.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Avertissement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-amber-50 border-2 border-amber-200 rounded-2xl p-6"
        >
          <div className="flex gap-4">
            <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Avertissement</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                Ces projections sont basées sur des hypothèses et la performance passée ne préjuge pas des résultats futurs. 
                Les rendements réels peuvent varier en fonction des conditions de marché, de la qualité des actifs, 
                et de l'exécution opérationnelle. Tout investissement comporte des risques de perte en capital. 
                Ce simulateur ne constitue pas un conseil en investissement.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-[#1A3A52] rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-serif text-white mb-4">
            Prêt à Investir ?
          </h3>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Contactez notre équipe pour discuter de votre projet d'investissement 
            et accéder aux opportunités en cours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={createPageUrl("Contact")}>
              <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] px-8 py-6 font-semibold">
                Nous contacter
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to={createPageUrl("StrategyPerformance")}>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 font-semibold">
                Voir la Stratégie
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}