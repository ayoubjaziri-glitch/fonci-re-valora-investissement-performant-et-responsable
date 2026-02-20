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
    name: "Lyon", 
    lat: 45.764043, 
    lng: 4.835659,
    description: "Métropole dynamique avec fort potentiel locatif",
    actifs: "3 immeubles",
    logements: "28 logements"
  },
  { 
    name: "Bordeaux", 
    lat: 44.837789, 
    lng: -0.579180,
    description: "Marché en croissance, forte demande résidentielle",
    actifs: "2 immeubles",
    logements: "16 logements"
  },
  { 
    name: "Vichy", 
    lat: 46.127771, 
    lng: 3.425896,
    description: "Ville thermale avec patrimoine architectural remarquable",
    actifs: "4 immeubles",
    logements: "32 logements"
  },
  { 
    name: "Clermont-Ferrand", 
    lat: 45.777222, 
    lng: 3.087025,
    description: "Capitale auvergnate, marché résilient",
    actifs: "2 immeubles",
    logements: "18 logements"
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
                <div className="p-2 min-w-[200px]">
                  <h4 className="font-bold text-slate-900 text-lg mb-2">{zone.name}</h4>
                  <p className="text-slate-600 text-sm mb-3">{zone.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600 font-medium">{zone.actifs}</span>
                    <span className="text-slate-500">{zone.logements}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg z-[1000]">
        <p className="text-xs text-slate-500 mb-2 font-medium">ZONES D'INTERVENTION</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <span className="text-sm text-slate-700">Actifs en portefeuille</span>
        </div>
      </div>
    </div>
  );
}