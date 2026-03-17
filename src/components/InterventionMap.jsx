import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

const ClusterMarkerHandler = ({ clusters, mapRef }) => {
  const map = useMap();
  mapRef.current = map;
  return null;
};

export default function InterventionMap() {
  const mapRef = useRef(null);
  const center = [46.1313, 3.4304]; // Vichy
  const defaultZoom = 9;

  const { data: realisations = [] } = useQuery({
    queryKey: ['realisations-biens'],
    queryFn: () => base44.entities.RealisationBien.filter({ actif: true }),
    initialData: []
  });

  const { data: acquisitions = [] } = useQuery({
    queryKey: ['acq-associe'],
    queryFn: () => base44.entities.AcquisitionAssocie.list(),
    initialData: []
  });

  // Coordonnées de Vichy et Clermont-Ferrand
  const CITY_COORDS = {
    vichy: { lat: 46.1313, lng: 3.4304 },
    clermont: { lat: 45.7772, lng: 3.0873 }
  };

  // Combiner les biens actifs du back office avec coordonnées réelles
  const allBiens = [
    ...realisations
      .filter(b => b.actif && b.location && b.lat && b.lng)
      .map(b => ({
        id: `real-${b.id}`,
        name: b.titre,
        adresse: b.location,
        lat: b.lat,
        lng: b.lng,
        dpe: b.dpe_apres,
        logements: b.logements,
        image_url: b.image_apres,
        type: 'realisation'
      }))
  ];

  // Grouper par ville (Vichy ou Clermont-Ferrand)
  const groupedByCity = allBiens.reduce((acc, bien) => {
    const isVichy = (bien.lat > 45.95 && bien.lat < 46.35) && (bien.lng > 3.2 && bien.lng < 3.65);
    const isClermont = (bien.lat > 45.6 && bien.lat < 45.95) && (bien.lng > 2.9 && bien.lng < 3.3);
    
    if (isVichy) {
      acc.vichy.push(bien);
    } else if (isClermont) {
      acc.clermont.push(bien);
    }
    return acc;
  }, { vichy: [], clermont: [] });

  // Créer les clusters
  const clusterMarkers = [];
  if (groupedByCity.vichy.length > 0) {
    clusterMarkers.push({
      id: 'vichy-cluster',
      name: `Vichy (${groupedByCity.vichy.length})`,
      lat: CITY_COORDS.vichy.lat,
      lng: CITY_COORDS.vichy.lng,
      isCluster: true,
      items: groupedByCity.vichy
    });
  }
  if (groupedByCity.clermont.length > 0) {
    clusterMarkers.push({
      id: 'clermont-cluster',
      name: `Clermont-Ferrand (${groupedByCity.clermont.length})`,
      lat: CITY_COORDS.clermont.lat,
      lng: CITY_COORDS.clermont.lng,
      isCluster: true,
      items: groupedByCity.clermont
    });
  }

  const handleClusterClick = (items) => {
    if (!mapRef.current || items.length === 0) return;
    
    const bounds = L.latLngBounds(items.map(item => [item.lat, item.lng]));
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
  };

  return (
    <div className="relative">
      <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200">
        <MapContainer 
          center={center} 
          zoom={defaultZoom} 
          style={{ height: '500px', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClusterMarkerHandler clusters={clusterMarkers} mapRef={mapRef} />
          
          {clusterMarkers.map((cluster) => (
            <Marker 
              key={cluster.id} 
              position={[cluster.lat, cluster.lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => handleClusterClick(cluster.items)
              }}
            >
              <Popup>
                <div className="p-4 min-w-[300px]">
                  <h4 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                    📍 {cluster.name}
                  </h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {cluster.items.map((item, idx) => (
                      <div key={idx} className="border-l-2 border-[#C9A961] pl-3 py-2">
                        <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                        <p className="text-slate-600 text-xs flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {item.adresse}
                        </p>
                        {item.logements && (
                          <p className="text-slate-600 text-xs mt-1">{item.logements}</p>
                        )}
                        {item.dpe && (
                          <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-xs font-bold text-white ${
                            item.dpe === 'A' ? 'bg-emerald-500' : 
                            item.dpe === 'B' ? 'bg-green-500' : 
                            item.dpe === 'C' ? 'bg-lime-500' :
                            'bg-amber-500'
                          }`}>
                            DPE {item.dpe}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleClusterClick(cluster.items)}
                    className="mt-4 w-full bg-[#C9A961] hover:bg-[#B8994F] text-slate-900 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Zoomer sur {cluster.items.length} bien{cluster.items.length > 1 ? 's' : ''}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg z-[1000]">
        <p className="text-xs text-slate-500 mb-3 font-medium">PARC IMMOBILIER</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Vichy</span>
            <span className="bg-[#C9A961] text-white text-xs px-2 py-0.5 rounded-full font-bold">{groupedByCity.vichy.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Clermont-Fd</span>
            <span className="bg-[#C9A961] text-white text-xs px-2 py-0.5 rounded-full font-bold">{groupedByCity.clermont.length}</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Cliquez sur un cluster pour zoomer</p>
        </div>
      </div>
    </div>
  );
}