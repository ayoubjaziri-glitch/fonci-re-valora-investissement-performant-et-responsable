import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const zones = [
  { 
    name: "Immeuble Lyon Garibaldi", 
    lat: 45.764043, 
    lng: 4.835659,
    adresse: "12 Cours Gambetta, 69003 Lyon",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80",
    logements: "12 logements",
    dpe: "B"
  },
  { 
    name: "Résidence Bordeaux Chartrons", 
    lat: 44.837789, 
    lng: -0.579180,
    adresse: "45 Rue Notre-Dame, 33000 Bordeaux",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
    logements: "8 logements",
    dpe: "C"
  },
  { 
    name: "Immeuble Vichy Centre", 
    lat: 46.127771, 
    lng: 3.425896,
    adresse: "28 Boulevard des États-Unis, 03200 Vichy",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
    logements: "14 logements",
    dpe: "A"
  },
  { 
    name: "Résidence Clermont Jaude", 
    lat: 45.777222, 
    lng: 3.087025,
    adresse: "8 Place de Jaude, 63000 Clermont-Ferrand",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
    logements: "8 logements",
    dpe: "B"
  }
];

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
  const center = [45.8, 2.5]; // Centre de la France

  return (
    <div className="relative">
      <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200">
        <MapContainer 
          center={center} 
          zoom={6} 
          style={{ height: '500px', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {zones.map((zone, index) => (
            <Marker 
              key={index} 
              position={[zone.lat, zone.lng]}
              icon={customIcon}
            >
              <Popup>
                <div className="p-0 min-w-[280px]">
                  <img 
                    src={zone.image} 
                    alt={zone.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h4 className="font-bold text-slate-900 text-base mb-2">{zone.name}</h4>
                    <p className="text-slate-600 text-xs mb-3 flex items-start gap-1">
                      <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      {zone.adresse}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 font-medium text-sm">{zone.logements}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                        zone.dpe === 'A' ? 'bg-emerald-500' : 
                        zone.dpe === 'B' ? 'bg-green-500' : 
                        'bg-lime-500'
                      }`}>
                        DPE {zone.dpe}
                      </span>
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