import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ArrowRight, Leaf, Home, Thermometer, Zap, Building2, 
  Calendar, MapPin, Euro, ChevronLeft, ChevronRight, ArrowLeftRight
} from 'lucide-react';
import InterventionMap from "../components/InterventionMap";
import { Button } from "@/components/ui/button";
import BeforeAfterSlider from "../components/BeforeAfterSlider";

const realisations = [
  {
    id: 1,
    title: "Immeuble haussmannien - Lyon 6ème",
    location: "Lyon, Rhône",
    year: "2023",
    imageAvant: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/5c0c78345_pa00083251-bordeaux-immeuble.jpg",
    imageApres: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/0a169e079_france-paris-haussmann-la-facade-de-l-immeuble-e2dnpy.jpg",
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
    title: "Résidence en pierre - Bordeaux",
    location: "Bordeaux, Gironde",
    year: "2022",
    imageAvant: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/6612247a6_immeuble_bordeaux__098875700_1532_22022018.jpg",
    imageApres: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/5c0c78345_pa00083251-bordeaux-immeuble.jpg",
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
    title: "Immeuble haussmannien - Paris",
    location: "Paris, Île-de-France",
    year: "2023",
    imageAvant: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/0a169e079_france-paris-haussmann-la-facade-de-l-immeuble-e2dnpy.jpg",
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
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
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
              <p className="text-3xl font-bold text-[#C9A961]">3 M€</p>
              <p className="text-sm text-slate-600">Patrimoine sous gestion</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">4</p>
              <p className="text-sm text-slate-600">Immeubles</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#1A3A52]">42</p>
              <p className="text-sm text-slate-600">Lots</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#C9A961]">100%</p>
              <p className="text-sm text-slate-600">DPE C, B et A</p>
            </div>
          </div>
        </div>
      </section>

      {/* Réalisations Grid */}
      <section className="py-24 bg-white">
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
                {/* Before/After Slider */}
                <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
                  <BeforeAfterSlider 
                    beforeImage={item.imageAvant}
                    afterImage={item.imageApres}
                    alt={item.title}
                  />
                  
                  {/* DPE Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
                    <div className={`w-10 h-10 ${getDPEColor(item.dpeAvant)} text-white text-lg font-bold flex items-center justify-center rounded-lg shadow-lg`}>
                      {item.dpeAvant}
                    </div>
                    <ArrowRight className="h-5 w-5 text-white drop-shadow-lg" />
                    <div className={`w-10 h-10 ${getDPEColor(item.dpeApres)} text-white text-lg font-bold flex items-center justify-center rounded-lg shadow-lg`}>
                      {item.dpeApres}
                    </div>
                  </div>

                  {/* Info Bottom */}
                  <div className="absolute bottom-4 right-4 text-right z-10">
                    <p className="text-white font-semibold text-lg drop-shadow-lg">{item.title}</p>
                    <p className="text-white/90 text-sm flex items-center justify-end gap-1 drop-shadow-lg">
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

      {/* Map Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[#1A3A52] mb-4">
              Notre parc immobilier
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Découvrez la localisation géographique de nos immeubles résidentiels
            </p>
          </motion.div>
          <InterventionMap />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#C9A961]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-[#1A3A52] mb-4">
            Investir aux côtés de La Foncière Patrimoniale
          </h2>
          <p className="text-[#1A3A52]/80 mb-8">
            Accédez à une exposition immobilière structurée et à un pilotage professionnel.
          </p>
          <Link to={createPageUrl("Contact")}>
            <Button className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white px-8 py-6 font-semibold">
              Entrer en relation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}