import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

// Custom gold marker
const goldIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Slightly offset markers that share the same coordinates
function jitterCoords(items) {
  const seen = {};
  return items.map((item) => {
    const key = `${item.lat.toFixed(4)},${item.lng.toFixed(4)}`;
    seen[key] = (seen[key] || 0) + 1;
    const count = seen[key];
    // Spiral offset so overlapping markers spread out
    const angle = (count - 1) * 2.4; // golden angle
    const radius = count === 1 ? 0 : 0.0025 * Math.ceil((count - 1) / 6);
    return {
      ...item,
      displayLat: item.lat + radius * Math.cos(angle),
      displayLng: item.lng + radius * Math.sin(angle),
    };
  });
}

const MapController = ({ mapRef }) => {
  const map = useMap();
  mapRef.current = map;
  return null;
};

const DPE_COLORS = {
  A: 'bg-emerald-500',
  B: 'bg-green-500',
  C: 'bg-lime-500',
  D: 'bg-yellow-500',
  E: 'bg-orange-400',
  F: 'bg-orange-600',
  G: 'bg-red-600',
};

export default function InterventionMap() {
  const mapRef = useRef(null);
  const [selectedBien, setSelectedBien] = useState(null);

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

  // Compute map center
  const center = allBiens.length > 0
    ? [
        allBiens.reduce((s, b) => s + b.lat, 0) / allBiens.length,
        allBiens.reduce((s, b) => s + b.lng, 0) / allBiens.length,
      ]
    : [46.1313, 3.4304];

  // City grouping for legend
  const cities = allBiens.reduce((acc, b) => {
    const isVichy = b.lat > 45.95 && b.lat < 46.35 && b.lng > 3.2 && b.lng < 3.65;
    const isClermont = b.lat > 45.6 && b.lat < 45.95 && b.lng > 2.9 && b.lng < 3.3;
    const city = isVichy ? 'Vichy' : isClermont ? 'Clermont-Fd' : 'Autre';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="relative" style={{ zIndex: 0 }}>
      <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200" style={{ height: 520 }}>
        <MapContainer
          center={center}
          zoom={allBiens.length > 0 ? 10 : 9}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController mapRef={mapRef} />

          {jitteredBiens.map((bien) => (
            <Marker
              key={bien.id}
              position={[bien.displayLat, bien.displayLng]}
              icon={goldIcon}
              eventHandlers={{
                click: () => setSelectedBien(bien.id === selectedBien ? null : bien.id)
              }}
            >
              <Popup
                maxWidth={280}
                minWidth={240}
                autoPan={true}
                autoPanPaddingTopLeft={[10, 10]}
                autoPanPaddingBottomRight={[10, 10]}
              >
                <div className="font-sans" style={{ lineHeight: 1.4 }}>
                  {/* Header */}
                  <div style={{ background: '#1A3A52', margin: '-12px -12px 10px', padding: '12px 14px', borderRadius: '4px 4px 0 0' }}>
                    <p style={{ color: '#C9A961', fontWeight: 700, fontSize: 13, margin: 0 }}>📍 {bien.name}</p>
                    {bien.adresse && (
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, margin: '3px 0 0' }}>{bien.adresse}</p>
                    )}
                  </div>

                  {/* Image */}
                  {bien.image_url && (
                    <div style={{ margin: '0 -12px 10px', height: 130, overflow: 'hidden' }}>
                      <img
                        src={bien.image_url}
                        alt={bien.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}

                  {/* Details */}
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
                          color: 'white',
                          fontWeight: 700,
                          fontSize: 12,
                          padding: '1px 8px',
                          borderRadius: 4,
                          marginTop: 2
                        }}>
                          DPE {bien.dpe}
                        </span>
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
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg z-[1000] min-w-[160px]">
        <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wide">Parc immobilier</p>
        {allBiens.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Aucun bien géolocalisé</p>
        ) : (
          <>
            {Object.entries(cities).map(([city, count]) => (
              <div key={city} className="flex items-center justify-between gap-4 mb-1.5">
                <span className="text-sm font-semibold text-slate-700">{city}</span>
                <span className="bg-[#C9A961] text-white text-xs px-2 py-0.5 rounded-full font-bold">{count}</span>
              </div>
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