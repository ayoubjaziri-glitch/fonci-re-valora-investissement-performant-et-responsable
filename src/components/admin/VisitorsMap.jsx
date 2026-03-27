import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * mode: 'realtime' | 'history'
 * pageViews: array of PageView records
 * activeThreshold: minutes to consider "active now" (default 30)
 */
export default function VisitorsMap({ pageViews = [], mode = 'realtime', activeThreshold = 30 }) {
  const now = new Date();
  const thresholdMs = activeThreshold * 60 * 1000;

  // Filter views with geo data
  const geoViews = pageViews.filter(v => v.lat && v.lng);

  // Group by city/location cluster
  const clusters = useMemo(() => {
    const map = {};
    geoViews.forEach(v => {
      // Round coords to ~10km bucket
      const key = `${(Math.round(v.lat * 10) / 10)},${(Math.round(v.lng * 10) / 10)}`;
      if (!map[key]) {
        map[key] = {
          lat: v.lat,
          lng: v.lng,
          city: v.city || 'Inconnu',
          country: v.country || '',
          sessions: new Set(),
          activeSessions: new Set(),
          lastSeen: v.created_date,
          views: 0,
        };
      }
      map[key].sessions.add(v.session_id);
      map[key].views += 1;
      if (new Date(v.created_date) > new Date(now - thresholdMs)) {
        map[key].activeSessions.add(v.session_id);
      }
      if (new Date(v.created_date) > new Date(map[key].lastSeen)) {
        map[key].lastSeen = v.created_date;
      }
    });
    return Object.values(map);
  }, [geoViews, thresholdMs]);

  const totalGeo = new Set(geoViews.map(v => v.session_id)).size;
  const totalAll = new Set(pageViews.map(v => v.session_id)).size;
  const noGeoCount = totalAll - totalGeo;

  // Map center = average of clusters, or default to France
  const centerLat = clusters.length > 0 ? clusters.reduce((s, c) => s + c.lat, 0) / clusters.length : 46.5;
  const centerLng = clusters.length > 0 ? clusters.reduce((s, c) => s + c.lng, 0) / clusters.length : 2.5;
  const mapZoom = clusters.length > 0 ? 4 : 5;

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-medium">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          {clusters.reduce((s, c) => s + c.activeSessions.size, 0)} actifs maintenant
        </span>
        <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
          <span className="w-2 h-2 bg-blue-500 rounded-full" />
          {totalGeo} visiteurs localisés
        </span>
        {noGeoCount > 0 && (
          <span className="flex items-center gap-1.5 bg-slate-50 text-slate-500 px-3 py-1.5 rounded-full">
            {noGeoCount} sans localisation
          </span>
        )}
      </div>

      {clusters.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 mb-2">
          Aucune visite géolocalisée pour l'instant. La carte s'enrichira automatiquement avec les nouvelles visites.
        </div>
      )}

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow" style={{ height: 380, zIndex: 0 }}>
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {clusters.map((c, i) => {
            const isActive = c.activeSessions.size > 0;
            const radius = Math.max(8, Math.min(28, 8 + c.sessions.size * 3));
            return (
              <CircleMarker
                key={i}
                center={[c.lat, c.lng]}
                radius={radius}
                pathOptions={{
                  fillColor: isActive ? '#10b981' : '#C9A961',
                  fillOpacity: 0.75,
                  color: isActive ? '#059669' : '#1A3A52',
                  weight: 2,
                }}
              >
                <Tooltip permanent={c.sessions.size > 1} direction="top" offset={[0, -radius]}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>
                    {c.city}{c.country ? `, ${c.country}` : ''} — {c.sessions.size} visiteur{c.sessions.size > 1 ? 's' : ''}
                    {isActive ? ' 🟢' : ''}
                  </span>
                </Tooltip>
                <Popup>
                  <div style={{ fontFamily: 'sans-serif', minWidth: 160 }}>
                    <p style={{ fontWeight: 700, color: '#1A3A52', marginBottom: 4 }}>📍 {c.city}, {c.country}</p>
                    <p style={{ fontSize: 12, color: '#555', margin: '2px 0' }}>Sessions uniques : <strong>{c.sessions.size}</strong></p>
                    {isActive && <p style={{ fontSize: 12, color: '#10b981', margin: '2px 0' }}>● {c.activeSessions.size} actif(s) maintenant</p>}
                    <p style={{ fontSize: 12, color: '#555', margin: '2px 0' }}>Pages vues : <strong>{c.views}</strong></p>
                    <p style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>
                      Dernière visite : {new Date(c.lastSeen).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-slate-500">
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-600 inline-block" /> Actif maintenant</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#C9A961] border-2 border-[#1A3A52] inline-block" /> Visiteur passé</span>
        <span className="flex items-center gap-2 italic">Taille = nombre de sessions</span>
      </div>
    </div>
  );
}