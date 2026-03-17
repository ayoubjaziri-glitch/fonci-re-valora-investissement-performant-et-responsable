import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function InterventionMap() {
  // Centré sur Vichy
  const center = [46.1313, 3.4304]; // Vichy coordinates
  const defaultZoom = 8; // Zoom pour voir Vichy et ses environs

  // Récupère les biens actifs des Réalisations
  const { data: realisations = [] } = useQuery({
    queryKey: ['realisations-biens'],
    queryFn: () => base44.entities.RealisationBien.list('ordre', 50),
    initialData: []
  });

  const { data: zonesDb = [] } = useQuery({
    queryKey: ['map-locations'],
    queryFn: () => base44.entities.MapLocation.filter({ actif: true }),
    initialData: []
  });

  // Récupère les acquisitions (patrimoine) de l'espace associé
  const { data: acquisitions = [] } = useQuery({
    queryKey: ['acq-associe'],
    queryFn: () => base44.entities.AcquisitionAssocie.filter({ type: 'patrimoine' }),
    initialData: []
  });

  // Fusionner zones manuelles + biens actifs des réalisations + acquisitions
  const allZones = [
    ...zonesDb,
    ...realisations.filter(b => b.actif && b.location && b.lat && b.lng).map(b => ({
      id: `real-${b.id}`,
      name: b.titre,
      adresse: b.location,
      lat: b.lat,
      lng: b.lng,
      dpe: b.dpe_apres,
      logements: b.logements,
      image_url: b.image_apres,
      actif: true
    })),
    ...acquisitions.filter(a => a.ville).map((a, idx) => ({
      id: `acq-${a.id}-${idx}`,
      name: a.ville,
      adresse: a.ville,
      lat: 46.1313 + (Math.random() * 0.5 - 0.25), // Petite variation autour de Vichy
      lng: 3.4304 + (Math.random() * 0.5 - 0.25),
      dpe: a.dpe,
      logements: a.lots ? `${a.lots} lots` : '',
      image_url: null,
      actif: true
    }))
  ];

  // Ne pas dédupliquer par nom pour voir tous les biens même à la même adresse
  const uniqueZones = allZones;

  return (
    <div className="relative">
      <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200">
        <MapContainer 
          center={center} 
          zoom={defaultZoom} 
          style={{ height: '500px', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {uniqueZones.map((zone, index) => (
            <Marker 
              key={index} 
              position={[zone.lat, zone.lng]}
              icon={customIcon}
            >
              <Popup>
                <div className="p-0 min-w-[280px]">
                  {zone.image_url && (
                    <img 
                      src={zone.image_url} 
                      alt={zone.name}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-4">
                    <h4 className="font-bold text-slate-900 text-base mb-2">{zone.name}</h4>
                    <p className="text-slate-600 text-xs mb-3 flex items-start gap-1">
                      <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      {zone.adresse}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 font-medium text-sm">{zone.logements}</span>
                      {zone.dpe && (
                        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                          zone.dpe === 'A' ? 'bg-emerald-500' : 
                          zone.dpe === 'B' ? 'bg-green-500' : 
                          'bg-lime-500'
                        }`}>
                          DPE {zone.dpe}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg z-[1000]">
        <p className="text-xs text-slate-500 mb-2 font-medium">NOTRE PARC IMMOBILIER</p>
        <div className="flex items-center gap-2">
          <img 
            src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png" 
            alt="marker"
            className="w-4 h-auto"
          />
          <span className="text-sm text-slate-700">Cliquez pour voir l'immeuble</span>
        </div>
      </div>
    </div>
  );
}