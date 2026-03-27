import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom gold marker for individual biens
const goldIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Create a cluster bubble icon with count
function createClusterIcon(count) {
  const size = count > 9 ? 46 : 40;
  return L.divIcon({
    html: `<div style="
      width: ${size}px; height: ${size}px;
      background: #C9A961;
      border: 3px solid #1A3A52;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: ${count > 9 ? 14 : 16}px;
      color: #1A3A52;
      box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      font-family: sans-serif;
    ">${count}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

// Slightly offset markers that share the same coordinates
function jitterCoords(items) {
  const seen = {};
  return items.map((item) => {
    const key = `${item.lat.toFixed(4)},${item.lng.toFixed(4)}`;
    seen[key] = (seen[key] || 0) + 1;
    const count = seen[key];
    const angle = (count - 1) * 2.4;
    const radius = count === 1 ? 0 : 0.0025 * Math.ceil((count - 1) / 6);
    return {
      ...item,
      displayLat: item.lat + radius * Math.cos(angle),
      displayLng: item.lng + radius * Math.sin(angle),
    };
  });
}

// Group biens into city clusters (within ~5km radius)
function buildClusters(biens) {
  const CLUSTER_RADIUS = 0.05; // ~5km in degrees
  const clusters = [];

  biens.forEach(b => {
    const existing = clusters.find(c =>
      Math.abs(c.lat - b.lat) < CLUSTER_RADIUS && Math.abs(c.lng - b.lng) < CLUSTER_RADIUS
    );
    if (existing) {
      existing.count += 1;
      existing.biens.push(b);
      // Update center to be avg
      existing.lat = existing.biens.reduce((s, x) => s + x.lat, 0) / existing.biens.length;
      existing.lng = existing.biens.reduce((s, x) => s + x.lng, 0) / existing.biens.length;
    } else {
      // Extraire uniquement le nom de la ville (avant la première virgule)
      const cityName = (b.adresse || b.name || 'Zone').split(',')[0].trim();
      clusters.push({ lat: b.lat, lng: b.lng, count: 1, biens: [b], label: cityName });
    }
  });
  return clusters;
}

const CLUSTER_ZOOM_THRESHOLD = 13; // below this zoom → show clusters; above → show individual

const MapController = ({ mapRef, onZoomChange }) => {
  const map = useMap();
  mapRef.current = map;

  useMapEvents({
    zoomend: () => onZoomChange(map.getZoom()),
  });

  return null;
};

export default function InterventionMap() {
  const mapRef = useRef(null);
  const [currentZoom, setCurrentZoom] = useState(10);

  const { data: realisations = [] } = useQuery({
    queryKey: ['realisations-biens'],
    queryFn: () => base44.entities.RealisationBien.filter({ actif: true }),
    initialData: []
  });

  const allBiens = realisations
    .filter(b => b.actif && b.lat && b.lng)
    .map(b => ({
      id: `real-${b.id}`,
      name: b.titre,
      adresse: b.location || '',
      lat: parseFloat(b.lat),
      lng: parseFloat(b.lng),
      dpe: b.dpe_apres,
      logements: b.logements,
      surface: b.surface,
      rendement: b.rendement_brut,
      image_url: b.image_apres,
    }));

  const jitteredBiens = jitterCoords(allBiens);
  const clusters = buildClusters(allBiens);

  const showClusters = currentZoom < CLUSTER_ZOOM_THRESHOLD;

  // Centre fixé sur la zone Vichy / Clermont-Ferrand
  const center = [45.95, 3.35];

  // City grouping for legend
  const cities = clusters.map(c => ({
    label: c.label,
    count: c.count,
    lat: c.lat,
    lng: c.lng,
  }));

  const flyToCity = (lat, lng) => {
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 14, { duration: 1.2 });
    }
  };

  return (
    <div className="relative" style={{ zIndex: 0 }}>
      <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200" style={{ height: 520 }}>
        <MapContainer
          center={center}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController mapRef={mapRef} onZoomChange={setCurrentZoom} />

          {/* Cluster markers (visible when zoomed out) */}
          {showClusters && clusters.map((cluster, i) => (
            <Marker
              key={`cluster-${i}`}
              position={[cluster.lat, cluster.lng]}
              icon={createClusterIcon(cluster.count)}
              eventHandlers={{
                click: () => flyToCity(cluster.lat, cluster.lng)
              }}
            />
          ))}

          {/* Individual markers (visible when zoomed in) */}
          {!showClusters && jitteredBiens.map((bien) => (
            <Marker
              key={bien.id}
              position={[bien.displayLat, bien.displayLng]}
              icon={goldIcon}
            >
              <Popup maxWidth={280} minWidth={240} autoPan={true}>
                <div className="font-sans" style={{ lineHeight: 1.4 }}>
                  <div style={{ background: '#1A3A52', margin: '-12px -12px 10px', padding: '12px 14px', borderRadius: '4px 4px 0 0' }}>
                    <p style={{ color: '#C9A961', fontWeight: 700, fontSize: 13, margin: 0 }}>📍 {bien.name}</p>
                    {bien.adresse && (
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, margin: '3px 0 0' }}>{bien.adresse}</p>
                    )}
                  </div>
                  {bien.image_url && (
                    <div style={{ margin: '0 -12px 10px', height: 130, overflow: 'hidden' }}>
                      <img src={bien.image_url} alt={bien.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
                    {bien.logements && (
                      <div style={{ background: '#f8f9fa', borderRadius: 6, padding: '6px 8px' }}>
                        <p style={{ fontSize: 10, color: '#888', margin: 0 }}>Logements</p>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#1A3A52', margin: 0 }}>{bien.logements}</p>
                      </div>
                    )}
                    {bien.surface && (
                      <div style={{ background: '#f8f9fa', borderRadius: 6, padding: '6px 8px' }}>
                        <p style={{ fontSize: 10, color: '#888', margin: 0 }}>Surface</p>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#1A3A52', margin: 0 }}>{bien.surface}</p>
                      </div>
                    )}
                    {bien.rendement && (
                      <div style={{ background: '#f8f9fa', borderRadius: 6, padding: '6px 8px' }}>
                        <p style={{ fontSize: 10, color: '#888', margin: 0 }}>Rendement brut</p>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#1A3A52', margin: 0 }}>{bien.rendement}</p>
                      </div>
                    )}
                    {bien.dpe && (
                      <div style={{ background: '#f8f9fa', borderRadius: 6, padding: '6px 8px' }}>
                        <p style={{ fontSize: 10, color: '#888', margin: 0 }}>DPE</p>
                        <span style={{
                          display: 'inline-block',
                          background: bien.dpe === 'A' ? '#10b981' : bien.dpe === 'B' ? '#22c55e' : bien.dpe === 'C' ? '#84cc16' : '#f59e0b',
                          color: 'white', fontWeight: 700, fontSize: 12,
                          padding: '1px 8px', borderRadius: 4, marginTop: 2
                        }}>DPE {bien.dpe}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg z-[1000] min-w-[170px]">
        <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wide">Parc immobilier</p>
        <p className="text-xs text-slate-400 mb-3 italic">Cliquer pour zoomer</p>
        {allBiens.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Aucun bien géolocalisé</p>
        ) : (
          <>
            {cities.map((city, i) => (
              <button
                key={i}
                onClick={() => flyToCity(city.lat, city.lng)}
                className="flex items-center justify-between gap-4 mb-1.5 w-full hover:bg-slate-50 rounded-lg px-1 py-1 transition-colors group"
              >
                <span className="text-sm font-semibold text-slate-700 group-hover:text-[#C9A961] transition-colors text-left">{city.label}</span>
                <span className="bg-[#C9A961] text-[#1A3A52] text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0">{city.count}</span>
              </button>
            ))}
            <div className="border-t border-slate-100 mt-2 pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500">Total</span>
              <span className="text-xs font-bold text-[#1A3A52]">{allBiens.length} bien{allBiens.length > 1 ? 's' : ''}</span>
            </div>
          </>
        )}
      </div>

      {allBiens.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg">
            <p className="text-slate-500 text-sm">Ajoutez des biens avec coordonnées GPS depuis le back office</p>
          </div>
        </div>
      )}
    </div>
  );
}