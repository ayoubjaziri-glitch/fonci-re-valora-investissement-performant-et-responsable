import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Leaf, Home, Thermometer, Zap } from 'lucide-react';

const realisations = [
  {
    id: 1,
    title: "Immeuble Haussmannien - Lyon 6ème",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    surface: "1 200 m²",
    logements: "12 appartements",
    dpeAvant: "F",
    dpeApres: "B",
    description: "Réhabilitation complète avec isolation thermique par l'extérieur, remplacement des menuiseries et installation d'une chaufferie collective performante.",
    travaux: ["Isolation ITE", "PAC collective", "VMC double flux", "Menuiseries triple vitrage"]
  },
  {
    id: 2,
    title: "Résidence Le Parc - Vichy",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    surface: "850 m²",
    logements: "8 appartements",
    dpeAvant: "E",
    dpeApres: "A",
    description: "Transformation d'un immeuble des années 70 en résidence BBC avec panneaux photovoltaïques et système domotique.",
    travaux: ["Panneaux solaires", "Isolation renforcée", "Domotique", "Toiture végétalisée"]
  },
  {
    id: 3,
    title: "Villa Belle Époque - Bordeaux",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    surface: "450 m²",
    logements: "4 appartements",
    dpeAvant: "G",
    dpeApres: "B",
    description: "Reconversion d'une maison de maître en 4 logements haut de gamme avec préservation du patrimoine architectural.",
    travaux: ["Isolation intérieure", "Géothermie", "Récupération eaux pluviales", "Matériaux biosourcés"]
  },
  {
    id: 4,
    title: "Résidence Thermale - Clermont-Ferrand",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    surface: "2 100 m²",
    logements: "18 appartements",
    dpeAvant: "E",
    dpeApres: "A",
    description: "Projet phare de rénovation énergétique avec objectif carbone neutre et confort thermique optimal.",
    travaux: ["Isolation performante", "PAC air-eau", "Éclairage LED", "Bornes de recharge VE"]
  }
];

export default function RealisationsGallery() {
  const [selectedId, setSelectedId] = useState(null);
  const selectedRealisation = realisations.find(r => r.id === selectedId);

  const getDPEColor = (dpe) => {
    const colors = {
      'A': 'bg-green-500',
      'B': 'bg-lime-500',
      'C': 'bg-yellow-400',
      'D': 'bg-orange-400',
      'E': 'bg-orange-500',
      'F': 'bg-red-400',
      'G': 'bg-red-600'
    };
    return colors[dpe] || 'bg-gray-400';
  };

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {realisations.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedId(item.id)}
            className="group cursor-pointer"
          >
            <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              
              {/* DPE Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                <span className={`w-6 h-6 ${getDPEColor(item.dpeAvant)} text-white text-xs font-bold flex items-center justify-center rounded`}>
                  {item.dpeAvant}
                </span>
                <span className="text-slate-400">→</span>
                <span className={`w-6 h-6 ${getDPEColor(item.dpeApres)} text-white text-xs font-bold flex items-center justify-center rounded`}>
                  {item.dpeApres}
                </span>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-semibold text-lg">{item.title}</p>
                <p className="text-white/70 text-sm">{item.logements} • {item.surface}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedRealisation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-72 md:h-96">
                <img 
                  src={selectedRealisation.image} 
                  alt={selectedRealisation.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <X className="h-5 w-5 text-slate-900" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-8">
                  <h3 className="text-2xl font-serif text-white mb-2">{selectedRealisation.title}</h3>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <span className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      {selectedRealisation.logements}
                    </span>
                    <span>{selectedRealisation.surface}</span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-4">Performance énergétique</h4>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-slate-500 mb-2">Avant</p>
                        <div className={`w-16 h-16 ${getDPEColor(selectedRealisation.dpeAvant)} text-white text-2xl font-bold flex items-center justify-center rounded-xl`}>
                          {selectedRealisation.dpeAvant}
                        </div>
                      </div>
                      <Zap className="h-8 w-8 text-amber-500" />
                      <div className="text-center">
                        <p className="text-sm text-slate-500 mb-2">Après</p>
                        <div className={`w-16 h-16 ${getDPEColor(selectedRealisation.dpeApres)} text-white text-2xl font-bold flex items-center justify-center rounded-xl`}>
                          {selectedRealisation.dpeApres}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-4">Travaux réalisés</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRealisation.travaux.map((travail, idx) => (
                        <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm flex items-center gap-1">
                          <Leaf className="h-3 w-3" />
                          {travail}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  {selectedRealisation.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}