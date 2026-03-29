import React from 'react';
import { X, Monitor, Smartphone, Tablet, Clock, Globe, Search, MapPin, FileText, Calendar, Tag, ExternalLink } from 'lucide-react';

function getDeviceType(ua = '') {
  if (/Mobile|Android|iPhone|iPod/i.test(ua)) return 'Mobile';
  if (/iPad|Tablet/i.test(ua)) return 'Tablette';
  return 'Desktop';
}

function getDeviceIcon(ua) {
  const d = getDeviceType(ua);
  if (d === 'Mobile') return Smartphone;
  if (d === 'Tablette') return Tablet;
  return Monitor;
}

function getSource(referrer = '') {
  if (!referrer) return 'Direct';
  if (/google/i.test(referrer)) return 'Google';
  if (/linkedin/i.test(referrer)) return 'LinkedIn';
  if (/facebook/i.test(referrer)) return 'Facebook';
  if (/instagram/i.test(referrer)) return 'Instagram';
  if (/bing/i.test(referrer)) return 'Bing';
  if (/yahoo/i.test(referrer)) return 'Yahoo';
  if (/twitter|t\.co/i.test(referrer)) return 'Twitter/X';
  try {
    return new URL(referrer).hostname.replace('www.', '');
  } catch {
    return 'Autre';
  }
}

function fmtTime(seconds) {
  if (!seconds || seconds <= 0) return '—';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
}

function fmtDate(d) {
  return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function VisitorDetail({ visitor, onClose }) {
  // visitor = { session_id, pages: [PageView...] }
  const { session_id, pages } = visitor;
  const sorted = [...pages].sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const totalTime = sorted.reduce((s, p) => s + (p.time_on_page || 0), 0);
  const device = getDeviceType(first?.user_agent);
  const DeviceIcon = getDeviceIcon(first?.user_agent);
  const source = getSource(first?.referrer);
  const keywords = sorted.map(p => p.search_keywords).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
  const country = first?.country || '—';
  const city = first?.city || '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40" onClick={onClose}>
      <div
        className="bg-white h-full w-full max-w-xl shadow-2xl overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0F2537] px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-white font-bold text-base">Visiteur anonyme</p>
            <p className="text-white/40 text-xs font-mono mt-0.5">{session_id}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                <MapPin className="h-3 w-3" />{city}{country && country !== city ? `, ${country}` : ''}
              </span>
              <span className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                <DeviceIcon className="h-3 w-3" />{device}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-[#1A3A52]">{sorted.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Pages vues</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-[#1A3A52]">{fmtTime(totalTime)}</p>
              <p className="text-xs text-slate-500 mt-0.5">Temps total</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-[#C9A961] truncate">{source}</p>
              <p className="text-xs text-slate-500 mt-0.5">Source</p>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Première visite</span>
              <span className="font-medium text-slate-800">{fmtDate(first?.created_date)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Dernière visite</span>
              <span className="font-medium text-slate-800">{fmtDate(last?.created_date)}</span>
            </div>
          </div>

          {/* Source & Referrer */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" /> Source de trafic
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Source</span>
                <span className="font-semibold text-[#1A3A52]">{source}</span>
              </div>
              {first?.referrer && (
                <div className="flex items-start justify-between text-sm gap-3">
                  <span className="text-slate-500 flex-shrink-0">URL référente</span>
                  <a href={first.referrer} target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs break-all text-right flex items-center gap-1">
                    {first.referrer.slice(0, 60)}{first.referrer.length > 60 ? '…' : ''}
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mots-clés */}
          {keywords.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5" /> Mots-clés recherchés
              </h3>
              <div className="flex flex-wrap gap-2">
                {keywords.map((kw, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-full px-3 py-1.5">
                    <Tag className="h-3 w-3" />{kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Parcours de navigation */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Parcours de navigation
            </h3>
            <div className="space-y-2">
              {sorted.map((pv, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                  <div className="w-6 h-6 rounded-full bg-[#1A3A52] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{pv.page}</p>
                    <p className="text-xs text-slate-400">{fmtDate(pv.created_date)}</p>
                  </div>
                  {pv.time_on_page > 0 && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 flex-shrink-0">
                      <Clock className="h-3 w-3" />{fmtTime(pv.time_on_page)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Appareil */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <DeviceIcon className="h-3.5 w-3.5" /> Appareil
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 break-all leading-relaxed">
              {first?.user_agent || '—'}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}