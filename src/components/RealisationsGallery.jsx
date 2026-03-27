import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import BeforeAfterSlider from "./BeforeAfterSlider";
import { useQuery } from "@tanstack/react-query";
import { base44 } from '@/api/base44Client';

const FALLBACK_REALISATIONS = [
  {
    id: 'f1',
    titre: "Immeuble haussmannien - Lyon 6ème",
    location: "Lyon, Rhône",
    image_avant: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/5c0c78345_pa00083251-bordeaux-immeuble.jpg",
    image_apres: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/0a169e079_france-paris-haussmann-la-facade-de-l-immeuble-e2dnpy.jpg",
    surface: "1 200 m²", logements: "12 lots", dpe_avant: "F", dpe_apres: "B",
    description_apres: "Réhabilitation BBC complète : ITE, menuiseries triple vitrage, PAC collective.",
  },
  {
    id: 'f2',
    titre: "Résidence bourgeoise - Bordeaux",
    location: "Bordeaux, Gironde",
    image_avant: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/6612247a6_immeuble_bordeaux__098875700_1532_22022018.jpg",
    image_apres: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/5c0c78345_pa00083251-bordeaux-immeuble.jpg",
    surface: "850 m²", logements: "8 lots", dpe_avant: "E", dpe_apres: "A",
    description_apres: "Transformation BBC avec panneaux photovoltaïques et domotique intégrée.",
  },
  {
    id: 'f3',
    titre: "Immeuble en pierre - Bordeaux",
    location: "Bordeaux, Gironde",
    image_avant: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800&q=80",
    image_apres: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    surface: "450 m²", logements: "4 lots", dpe_avant: "G", dpe_apres: "B",
    description_apres: "Reconversion patrimoniale en 4 appartements avec géothermie et matériaux biosourcés.",
  },
  {
    id: 'f4',
    titre: "Ensemble immobilier - Clermont",
    location: "Clermont-Ferrand",
    image_avant: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    image_apres: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    surface: "2 100 m²", logements: "18 lots", dpe_avant: "E", dpe_apres: "A",
    description_apres: "Rénovation carbone neutre avec économies de charges de 65%.",
  }
];

const getDPEColor = (dpe) => {
  const colors = { 'A': 'bg-emerald-500', 'B': 'bg-green-500', 'C': 'bg-lime-500', 'D': 'bg-yellow-500', 'E': 'bg-orange-500', 'F': 'bg-red-400', 'G': 'bg-red-600' };
  return colors[dpe] || 'bg-gray-400';
};

export default function RealisationsGallery() {
  const { data: dbRealisations = [] } = useQuery({
    queryKey: ['realisations-biens'],
    queryFn: () => base44.entities.RealisationBien.list('ordre', 50),
    initialData: []
  });

  // Use DB data if available, otherwise fallback
  const realisations = dbRealisations.filter(r => r.actif !== false).length > 0
    ? dbRealisations.filter(r => r.actif !== false).slice(0, 4)
    : FALLBACK_REALISATIONS;

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
              beforeImage={item.image_avant}
              afterImage={item.image_apres}
              alt={item.titre}
            />
            <div className="absolute bottom-3 left-3 flex items-center gap-1 z-10">
              <div className={`w-7 h-7 ${getDPEColor(item.dpe_avant)} text-white text-xs font-bold flex items-center justify-center rounded shadow-lg`}>
                {item.dpe_avant}
              </div>
              <ArrowRight className="h-3 w-3 text-white drop-shadow-lg" />
              <div className={`w-7 h-7 ${getDPEColor(item.dpe_apres)} text-white text-xs font-bold flex items-center justify-center rounded shadow-lg`}>
                {item.dpe_apres}
              </div>
            </div>
          </div>
          <h3 className="font-semibold text-slate-900 text-sm mb-1">{item.titre}</h3>
          <p className="text-xs text-slate-500 mb-2">{item.logements} • {item.surface}</p>
          <p className="text-xs text-slate-600 leading-relaxed">{item.description_apres}</p>
        </motion.div>
      ))}
    </div>
  );
}