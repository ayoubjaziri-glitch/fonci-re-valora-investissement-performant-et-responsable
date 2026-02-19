import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Leaf, Home, Thermometer, Zap, ArrowLeftRight, ArrowRight, MapPin } from 'lucide-react';
import BeforeAfterSlider from "./BeforeAfterSlider";

const realisations = [
  {
    id: 1,
    title: "Immeuble haussmannien - Lyon 6ème",
    location: "Lyon, Rhône",
    imageAvant: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80",
    imageApres: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    surface: "1 200 m²",
    logements: "12 lots",
    dpeAvant: "F",
    dpeApres: "B",
    descriptionAvant: "Immeuble dégradé avec installations vétustes et isolation inexistante.",
    descriptionApres: "Réhabilitation BBC complète : ITE, menuiseries triple vitrage, PAC collective.",
    travaux: ["ITE complète", "PAC collective", "VMC double flux", "Menuiseries"]
  },
  {
    id: 2,
    title: "Résidence bourgeoise - Vichy",
    location: "Vichy, Allier",
    imageAvant: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
    imageApres: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    surface: "850 m²",
    logements: "8 lots",
    dpeAvant: "E",
    dpeApres: "A",
    descriptionAvant: "Résidence années 70 avec équipements énergivores et isolation insuffisante.",
    descriptionApres: "Transformation BBC avec panneaux photovoltaïques et domotique intégrée.",
    travaux: ["Panneaux solaires", "Isolation renforcée", "Domotique", "Toiture végétalisée"]
  },
  {
    id: 3,
    title: "Immeuble en pierre - Bordeaux",
    location: "Bordeaux, Gironde",
    imageAvant: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800&q=80",
    imageApres: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    surface: "450 m²",
    logements: "4 lots",
    dpeAvant: "G",
    dpeApres: "B",
    descriptionAvant: "Immeuble en pierre XIXème en péril avec installations hors normes.",
    descriptionApres: "Reconversion patrimoniale en 4 appartements avec géothermie et matériaux biosourcés.",
    travaux: ["Géothermie", "Isolation biosourcée", "Récupération eaux", "Restauration"]
  },
  {
    id: 4,
    title: "Ensemble immobilier - Clermont",
    location: "Clermont-Ferrand",
    imageAvant: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    imageApres: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    surface: "2 100 m²",
    logements: "18 lots",
    dpeAvant: "E",
    dpeApres: "A",
    descriptionAvant: "Deux bâtiments mitoyens avec performances énergétiques médiocres.",
    descriptionApres: "Rénovation carbone neutre avec économies de charges de 65%.",
    travaux: ["Isolation R=8", "PAC air-eau", "LED intelligent", "Bornes VE"]
  }
];

export default function RealisationsGallery() {
  const [showAfter, setShowAfter] = useState({});

  const toggleImage = (id) => {
    setShowAfter(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getDPEColor = (dpe) => {
    const colors = {
      'A': 'bg-emerald-500',
      'B': 'bg-green-500',
      'C': 'bg-lime-500',
      'D': 'bg-yellow-500',
      'E': 'bg-orange-500',
      'F': 'bg-red-400',
      'G': 'bg-red-600'
    };
    return colors[dpe] || 'bg-gray-400';
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {realisations.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="group"
        >
          <div className="relative h-56 rounded-2xl overflow-hidden mb-4">
            <BeforeAfterSlider 
              beforeImage={item.imageAvant}
              afterImage={item.imageApres}
              alt={item.title}
            />
            
            {/* DPE Badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1 z-10">
              <div className={`w-7 h-7 ${getDPEColor(item.dpeAvant)} text-white text-xs font-bold flex items-center justify-center rounded shadow-lg`}>
                {item.dpeAvant}
              </div>
              <ArrowRight className="h-3 w-3 text-white drop-shadow-lg" />
              <div className={`w-7 h-7 ${getDPEColor(item.dpeApres)} text-white text-xs font-bold flex items-center justify-center rounded shadow-lg`}>
                {item.dpeApres}
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-slate-900 text-sm mb-1">{item.title}</h3>
          <p className="text-xs text-slate-500 mb-2">{item.logements} • {item.surface}</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            {item.descriptionApres}
          </p>
        </motion.div>
      ))}
    </div>
  );
}