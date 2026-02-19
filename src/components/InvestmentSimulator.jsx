import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, PiggyBank, Percent, Euro, Info } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function InvestmentSimulator() {
  const [montant, setMontant] = useState(25000);
  const [duree, setDuree] = useState(5);

  const results = useMemo(() => {
    const triNet = 0.105; // 10.5% TRI net
    const amortissement = 0.0511; // 5.11% amortissement annuel du prêt
    
    // Calcul de la valeur finale avec intérêts composés
    const valeurFinale = montant * Math.pow(1 + triNet, duree);
    const gainTotal = valeurFinale - montant;
    const rendementTotal = ((valeurFinale - montant) / montant) * 100;
    
    // Évolution année par année
    const evolution = [];
    for (let i = 0; i <= duree; i++) {
      evolution.push({
        annee: i,
        valeur: montant * Math.pow(1 + triNet, i),
        croissance: ((Math.pow(1 + triNet, i) - 1) * 100).toFixed(1)
      });
    }

    return {
      valeurFinale: valeurFinale.toFixed(0),
      gainTotal: gainTotal.toFixed(0),
      rendementTotal: rendementTotal.toFixed(1),
      evolution
    };
  }, [montant, duree]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
      <div className="bg-gradient-to-r from-[#1A3A52] to-[#2A4A6F] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="h-8 w-8 text-[#C9A961]" />
          <h3 className="text-2xl font-serif text-white">Simulateur de souscription</h3>
        </div>
        <p className="text-white/70">Projetez la valorisation de vos parts dans la foncière</p>
      </div>

      <div className="p-6 md:p-8">
        {/* Montant */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <label className="text-slate-900 font-medium flex items-center gap-2">
              Montant de la souscription
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Ticket d'entrée minimum : 10 000 €. 100% de votre apport est investi dans les actifs immobiliers.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <span className="text-2xl font-bold text-[#C9A961]">{formatNumber(montant)} €</span>
          </div>
          <Slider
            value={[montant]}
            onValueChange={(value) => setMontant(value[0])}
            min={10000}
            max={500000}
            step={5000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>10 000 €</span>
            <span>500 000 €</span>
          </div>
        </div>

        {/* Durée */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <label className="text-slate-900 font-medium flex items-center gap-2">
              Horizon de détention
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Durée recommandée : 5 ans pour bénéficier de l'avantage fiscal PEA-PME. Rachat possible dès la 2ème année.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <span className="text-2xl font-bold text-[#C9A961]">{duree} ans</span>
          </div>
          <Slider
            value={[duree]}
            onValueChange={(value) => setDuree(value[0])}
            min={2}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>2 ans</span>
            <span>10 ans</span>
          </div>
        </div>

        {/* Résultats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            key={results.valeurFinale}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-[#1A3A52] rounded-2xl p-4 text-center"
          >
            <Euro className="h-6 w-6 text-[#C9A961] mx-auto mb-2" />
            <p className="text-xs text-white/60 mb-1">Valorisation estimée</p>
            <p className="text-xl font-bold text-white">{formatNumber(results.valeurFinale)} €</p>
          </motion.div>

          <motion.div
            key={results.gainTotal}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-[#C9A961] rounded-2xl p-4 text-center"
          >
            <TrendingUp className="h-6 w-6 text-[#1A3A52] mx-auto mb-2" />
            <p className="text-xs text-[#1A3A52]/70 mb-1">Plus-value latente</p>
            <p className="text-xl font-bold text-[#1A3A52]">+{formatNumber(results.gainTotal)} €</p>
          </motion.div>

          <motion.div
            key={results.rendementTotal}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-[#1A3A52] rounded-2xl p-4 text-center"
          >
            <Percent className="h-6 w-6 text-[#C9A961] mx-auto mb-2" />
            <p className="text-xs text-white/60 mb-1">TRI global</p>
            <p className="text-xl font-bold text-white">+{results.rendementTotal}%</p>
          </motion.div>
        </div>

        {/* Évolution */}
        <div className="bg-gradient-to-r from-[#1A3A52] to-[#2A4A6F] rounded-2xl p-6 mb-6">
          <h4 className="text-white font-medium mb-4">Projection de la valeur de vos parts</h4>
          <div className="space-y-3">
            {results.evolution.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-white/60 text-sm w-24">
                  {item.annee === 0 ? 'Souscription' : `Année ${item.annee}`}
                </span>
                <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.valeur / results.evolution[results.evolution.length - 1].valeur) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full bg-[#C9A961] rounded-full"
                  />
                </div>
                <span className="text-[#C9A961] font-semibold text-sm w-28 text-right">
                  {formatNumber(item.valeur.toFixed(0))} €
                </span>
                <span className="text-white/50 text-xs w-16 text-right">
                  +{item.croissance}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          * Simulation indicative basée sur un TRI net de 10,5% après carried interest (hurdle 6,5%). 
          Les performances passées ne préjugent pas des performances futures. Investissement soumis à risque de perte en capital.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to={createPageUrl("Contact")} className="flex-1">
            <Button className="w-full bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold py-6">
              Demander une documentation
            </Button>
          </Link>
          <Link to={createPageUrl("Realisations")} className="flex-1">
            <Button variant="outline" className="w-full border-[#1A3A52] text-[#1A3A52] hover:bg-slate-100 py-6">
              Voir nos actifs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}