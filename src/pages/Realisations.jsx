import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ArrowRight, Leaf, Home, Thermometer, Zap, Building2,
  Calendar, MapPin, Euro, ChevronLeft, ChevronRight, ArrowLeftRight } from
'lucide-react';
import InterventionMap from "../components/InterventionMap";
import { Button } from "@/components/ui/button";
import BeforeAfterSlider from "../components/BeforeAfterSlider";
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';


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
  const selectedRealisation = realisations.find((r) => r.id === selectedId);

  const toggleImage = (id) => {
    setShowAfter((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        {/* MODIFIEZ LA PHOTO DE FOND DU HERO CI-DESSOUS */}
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover" />

        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl">

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
              <p className="text-3xl font-bold text-[#C9A961]">3.7 M€</p>
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
            {realisations.map((item, index) =>
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group">

                {/* Before/After Slider */}
                <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
                  <BeforeAfterSlider
                  beforeImage={item.imageAvant}
                  afterImage={item.imageApres}
                  alt={item.title} />

                  
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
                  



                </div>

                {/* Travaux Tags */}
                <div className="flex flex-wrap gap-2">
                  {item.travaux.slice(0, 3).map((travail, idx) =>
                <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs flex items-center gap-1">
                      <Leaf className="h-3 w-3" />
                      {travail}
                    </span>
                )}
                  {item.travaux.length > 3 &&
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                      +{item.travaux.length - 3} travaux
                    </span>
                }
                </div>
              </motion.div>
            )}
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
            className="text-center mb-12">

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
      <section className="bg-[#C9A961] py-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-slate-900 mb-4 text-2xl font-serif md:text-3xl">Investir aux côtés de La Foncière Valora

          </h2>
          <p className="text-slate-900 mb-8">Accédez à une exposition immobilière structurée et à un pilotage professionnel.

          </p>
          <Link to={createPageUrl("Contact")}>
            <Button className="bg-slate-900 text-white px-8 py-6 text-sm font-semibold rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 hover:bg-[#2A4A6F]">
              Entrer en relation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>);

}