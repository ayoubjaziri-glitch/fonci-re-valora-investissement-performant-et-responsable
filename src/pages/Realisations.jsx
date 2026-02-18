import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ArrowRight, Leaf, Home, Thermometer, Zap, Building2, 
  Calendar, MapPin, Euro, ChevronLeft, ChevronRight, ArrowLeftRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const realisations = [
  {
    id: 1,
    title: "Immeuble de rapport - Lyon 6ème",
    location: "Lyon, Rhône",
    year: "2023",
    imageAvant: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    imageApres: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    surface: "1 200 m²",
    logements: "12 lots",
    investissement: "1 450 000 €",
    dpeAvant: "F",
    dpeApres: "B",
    descriptionAvant: "Immeuble haussmannien dégradé avec installations vétustes, façade abîmée et isolation inexistante. Taux de vacance locative de 25%.",
    descriptionApres: "Réhabilitation complète aux normes BBC : isolation thermique par l'extérieur, remplacement des menuiseries, chaufferie collective haute performance. Taux d'occupation 100%.",
    travaux: ["ITE complète", "PAC collective", "VMC double flux", "Menuiseries triple vitrage", "Ravalement façade"],
    rendementBrut: "8,2%",
    plusValue: "+18%"
  },
  {
    id: 2,
    title: "Résidence Le Parc - Vichy",
    location: "Vichy, Allier",
    year: "2022",
    imageAvant: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
    imageApres: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    surface: "850 m²",
    logements: "8 lots",
    investissement: "720 000 €",
    dpeAvant: "E",
    dpeApres: "A",
    descriptionAvant: "Résidence des années 70 avec isolation insuffisante, équipements énergivores et parties communes dégradées.",
    descriptionApres: "Transformation en résidence BBC avec panneaux photovoltaïques en toiture, domotique intégrée et espaces verts aménagés. Label BBC Effinergie.",
    travaux: ["Panneaux solaires 12 kWc", "Isolation renforcée", "Domotique", "Toiture végétalisée", "Bornes VE"],
    rendementBrut: "9,1%",
    plusValue: "+24%"
  },
  {
    id: 3,
    title: "Hôtel particulier - Bordeaux",
    location: "Bordeaux, Gironde",
    year: "2023",
    imageAvant: "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?w=800&q=80",
    imageApres: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    surface: "450 m²",
    logements: "4 lots",
    investissement: "890 000 €",
    dpeAvant: "G",
    dpeApres: "B",
    descriptionAvant: "Maison de maître XIXème en péril, toiture défaillante, humidité structurelle et installations hors normes.",
    descriptionApres: "Reconversion patrimoniale en 4 appartements haut de gamme avec préservation des éléments architecturaux d'origine. Géothermie et matériaux biosourcés.",
    travaux: ["Géothermie", "Isolation biosourcée", "Récupération eaux pluviales", "Restauration patrimoine", "Charpente neuve"],
    rendementBrut: "7,8%",
    plusValue: "+32%"
  },
  {
    id: 4,
    title: "Ensemble immobilier - Clermont-Ferrand",
    location: "Clermont-Ferrand, Puy-de-Dôme",
    year: "2024",
    imageAvant: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    imageApres: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    surface: "2 100 m²",
    logements: "18 lots",
    investissement: "2 150 000 €",
    dpeAvant: "E",
    dpeApres: "A",
    descriptionAvant: "Ensemble de deux bâtiments mitoyens avec performances énergétiques médiocres et parties communes obsolètes.",
    descriptionApres: "Projet phare de rénovation énergétique avec objectif carbone neutre. Confort thermique optimal été comme hiver, économies de charges de 65%.",
    travaux: ["Isolation performante R=8", "PAC air-eau", "Éclairage LED intelligent", "Bornes de recharge VE", "Toiture isolée"],
    rendementBrut: "8,7%",
    plusValue: "+21%"
  }
];

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

export default function Realisations() {
  const [selectedId, setSelectedId] = useState(null);
  const [showAfter, setShowAfter] = useState({});
  const selectedRealisation = realisations.find(r => r.id === selectedId);

  const toggleImage = (id) => {
    setShowAfter(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-emerald-500" />
              <span className="text-emerald-400 font-medium tracking-wider uppercase text-sm">
                Portefeuille
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Nos opérations de valorisation
            </h1>
            <p className="text-xl text-white/70">
              Découvrez nos actifs réhabilités : chaque acquisition fait l'objet d'une 
              transformation profonde visant l'excellence énergétique et la création de valeur patrimoniale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">4</p>
              <p className="text-sm text-slate-600">Opérations réalisées</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">42</p>
              <p className="text-sm text-slate-600">Lots restructurés</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">5,2 M€</p>
              <p className="text-sm text-slate-600">Valeur du parc</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">100%</p>
              <p className="text-sm text-slate-600">DPE A ou B</p>
            </div>
          </div>
        </div>
      </section>

      {/* Réalisations Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {realisations.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                {/* Image avec toggle avant/après */}
                <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
                  <img 
                    src={showAfter[item.id] ? item.imageApres : item.imageAvant} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  
                  {/* Toggle Button */}
                  <button
                    onClick={() => toggleImage(item.id)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-white transition-colors"
                  >
                    <ArrowLeftRight className="h-4 w-4 text-slate-700" />
                    <span className="text-sm font-medium text-slate-700">
                      {showAfter[item.id] ? 'Voir avant' : 'Voir après'}
                    </span>
                  </button>

                  {/* Label Avant/Après */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-sm font-semibold ${showAfter[item.id] ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {showAfter[item.id] ? 'APRÈS' : 'AVANT'}
                  </div>

                  {/* DPE Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className={`w-10 h-10 ${getDPEColor(item.dpeAvant)} text-white text-lg font-bold flex items-center justify-center rounded-lg`}>
                      {item.dpeAvant}
                    </div>
                    <ArrowRight className="h-5 w-5 text-white" />
                    <div className={`w-10 h-10 ${getDPEColor(item.dpeApres)} text-white text-lg font-bold flex items-center justify-center rounded-lg`}>
                      {item.dpeApres}
                    </div>
                  </div>

                  {/* Info Bottom */}
                  <div className="absolute bottom-4 right-4 text-right">
                    <p className="text-white font-semibold text-lg">{item.title}</p>
                    <p className="text-white/70 text-sm flex items-center justify-end gap-1">
                      <MapPin className="h-3 w-3" /> {item.location}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-slate-50 rounded-xl p-5 mb-4">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {showAfter[item.id] ? item.descriptionApres : item.descriptionAvant}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500">Surface</p>
                    <p className="font-semibold text-slate-900 text-sm">{item.surface}</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500">Lots</p>
                    <p className="font-semibold text-slate-900 text-sm">{item.logements}</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500">Rendement</p>
                    <p className="font-semibold text-emerald-600 text-sm">{item.rendementBrut}</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500">Plus-value</p>
                    <p className="font-semibold text-emerald-600 text-sm">{item.plusValue}</p>
                  </div>
                </div>

                {/* Travaux Tags */}
                <div className="flex flex-wrap gap-2">
                  {item.travaux.slice(0, 3).map((travail, idx) => (
                    <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs flex items-center gap-1">
                      <Leaf className="h-3 w-3" />
                      {travail}
                    </span>
                  ))}
                  {item.travaux.length > 3 && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                      +{item.travaux.length - 3} travaux
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-white mb-4">
            Participez à nos prochaines opérations
          </h2>
          <p className="text-emerald-100 mb-8">
            Devenez associé et bénéficiez de notre expertise en réhabilitation patrimoniale.
          </p>
          <Link to={createPageUrl("Contact")}>
            <Button className="bg-white hover:bg-slate-100 text-emerald-700 px-8 py-6">
              Devenir associé
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}