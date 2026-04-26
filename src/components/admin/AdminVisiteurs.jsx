import React, { useState, useMemo } from 'react';
import { db } from '@/lib/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { Users, Globe, MapPin, TrendingUp, Clock, Eye, RefreshCw, Calendar, BarChart3, Monitor, Smartphone, Tablet, Search, ExternalLink, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import VisitorsMap from './VisitorsMap';
import VisitorDetail from './VisitorDetail';

const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

function StatCard({ icon: IconComp, label, value, sub, color = 'text-[#C9A961]' }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
          <IconComp className={`h-5 w-5 ${color}`} />
        </div>
        <span className="text-sm text-slate-500">{label}</span>
      </div>
      <p className="text-3xl font-bold text-[#1A3A52]">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

function getDeviceType(ua = '') {
  if (/Mobile|Android|iPhone|iPod/i.test(ua)) return 'Mobile';
  if (/iPad|Tablet/i.test(ua)) return 'Tablette';
  return 'Desktop';
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
    const host = new URL(referrer).hostname.replace('www.', '');
    return host;
  } catch {
    return 'Autre';
  }
}

const SOURCE_COLORS = {
  'Direct': '#6366f1',
  'Google': '#ea4335',
  'LinkedIn': '#0077b5',
  'Facebook': '#1877f2',
  'Instagram': '#e1306c',
  'Bing': '#00809d',
  'Yahoo': '#720e9e',
  'Twitter/X': '#000000',
};

function getSourceColor(source) {
  return SOURCE_COLORS[source] || '#C9A961';
}

// ── Onglet Temps Réel ────────────────────────────────────────────────────────
function VisiteursTempsReel({ pageViews, contacts, refetchPageViews }) {
  const now = new Date();
  const thirtyMinAgo = new Date(now - 30 * 60 * 1000);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Visiteurs "actifs" = sessions vues dans les 30 dernières minutes
  const activeViews = pageViews.filter(v => new Date(v.created_date) >= thirtyMinAgo);
  const activeSessions = new Set(activeViews.map(v => v.session_id)).size;

  // Visites aujourd'hui
  const todayViews = pageViews.filter(v => new Date(v.created_date) >= todayStart);
  const todaySessions = new Set(todayViews.map(v => v.session_id)).size;

  // Pages populaires aujourd'hui
  const pageCounts = {};
  todayViews.forEach(v => { pageCounts[v.page] = (pageCounts[v.page] || 0) + 1; });
  const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Derniers contacts
  const recentContacts = contacts.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm text-emerald-600 font-medium">Données réelles</span>
          <span className="text-xs text-slate-400">Mis à jour à {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <Button onClick={refetchPageViews} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Sessions actives" value={activeSessions} sub="30 dernières minutes" color="text-emerald-500" />
        <StatCard icon={Users} label="Visiteurs aujourd'hui" value={todaySessions} sub="Sessions uniques" />
        <StatCard icon={Globe} label="Pages vues aujourd'hui" value={todayViews.length} sub="Total des vues" color="text-blue-500" />
        <StatCard icon={BarChart3} label="Contacts reçus" value={contacts.length} sub={`${contacts.filter(c => !c.email_envoye).length} non traités`} color="text-purple-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pages populaires */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#C9A961]" /> Pages les plus visitées aujourd'hui
          </h3>
          {topPages.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">Aucune visite enregistrée aujourd'hui</p>
          ) : (
            <div className="space-y-3">
              {topPages.map(([page, count], i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-700">{page}</span>
                      <span className="text-sm font-bold text-[#1A3A52]">{count} vues</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C9A961] rounded-full" style={{ width: `${(count / (topPages[0]?.[1] || 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Carte visiteurs — aujourd'hui uniquement */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#C9A961]" /> Localisation des visiteurs — aujourd'hui
          </h3>
          <VisitorsMap pageViews={todayViews} mode="realtime" activeThreshold={30} />
        </div>

      {/* Derniers contacts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-[#C9A961]" /> Derniers contacts reçus
          </h3>
          {recentContacts.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">Aucun contact reçu</p>
          ) : (
            <div className="space-y-3">
              {recentContacts.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{c.prenom} {c.nom}</p>
                    <p className="text-xs text-slate-400">{c.type_demande || 'Contact'}</p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(c.created_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Onglet Statistiques ────────────────────────────────────────────────────────
function VisiteursCumul({ pageViews, contacts }) {
  const now = new Date();

  // Visites des 12 derniers mois
  const twelveMonthsAgo = new Date(now);
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const recentViews = pageViews.filter(v => new Date(v.created_date) >= twelveMonthsAgo);

  // Sessions uniques sur 12 mois
  const totalSessions = new Set(recentViews.map(v => v.session_id)).size;

  // Ce mois-ci
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthViews = pageViews.filter(v => new Date(v.created_date) >= monthStart);
  const thisMonthSessions = new Set(thisMonthViews.map(v => v.session_id)).size;

  // Taux de conversion réel
  const tauxConversion = totalSessions > 0 ? ((contacts.length / totalSessions) * 100).toFixed(1) : '0.0';

  // Graphique mensuel (12 derniers mois)
  const mensuels = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - (11 - i));
    const year = d.getFullYear();
    const month = d.getMonth();
    const moisViews = recentViews.filter(v => {
      const vd = new Date(v.created_date);
      return vd.getFullYear() === year && vd.getMonth() === month;
    });
    const moisContacts = contacts.filter(c => {
      const cd = new Date(c.created_date);
      return cd.getFullYear() === year && cd.getMonth() === month;
    });
    return {
      mois: MONTHS_FR[month],
      visiteurs: new Set(moisViews.map(v => v.session_id)).size,
      contacts: moisContacts.length,
    };
  });

  // Top pages + temps moyen
  const pageStats = {};
  recentViews.forEach(v => {
    if (!pageStats[v.page]) pageStats[v.page] = { count: 0, totalTime: 0, timedCount: 0 };
    pageStats[v.page].count++;
    if (v.time_on_page > 0) {
      pageStats[v.page].totalTime += v.time_on_page;
      pageStats[v.page].timedCount++;
    }
  });
  const topPages = Object.entries(pageStats).sort((a, b) => b[1].count - a[1].count).slice(0, 5);
  const totalPageViews = recentViews.length;

  function fmtTime(seconds) {
    if (!seconds || seconds <= 0) return '—';
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  }

  // Appareils
  const deviceCounts = { Desktop: 0, Mobile: 0, Tablette: 0 };
  recentViews.forEach(v => { const d = getDeviceType(v.user_agent); deviceCounts[d] = (deviceCounts[d] || 0) + 1; });

  // Sources
  const sourceCounts = {};
  recentViews.forEach(v => { const s = getSource(v.referrer); sourceCounts[s] = (sourceCounts[s] || 0) + 1; });
  const topSources = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Sessions (12 mois)" value={totalSessions.toLocaleString('fr-FR')} sub="Sessions uniques" />
        <StatCard icon={Calendar} label="Ce mois-ci" value={thisMonthSessions.toLocaleString('fr-FR')} sub="Sessions uniques" color="text-blue-500" />
        <StatCard icon={TrendingUp} label="Taux de conversion" value={`${tauxConversion}%`} sub="Visiteur → Contact" color="text-emerald-500" />
        <StatCard icon={BarChart3} label="Contacts réels" value={contacts.length} sub="Via formulaire" color="text-purple-500" />
      </div>

      {/* Graphique mensuel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-[#1A3A52] mb-4">Évolution mensuelle (12 derniers mois)</h3>
        {totalSessions === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Eye className="h-12 w-12 text-slate-200 mb-3" />
            <p className="text-slate-400 text-sm">Les statistiques apparaîtront ici au fur et à mesure des visites</p>
            <p className="text-slate-300 text-xs mt-1">Le tracking est maintenant actif</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mensuels}>
                <XAxis dataKey="mois" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                  formatter={(val, name) => [val, name === 'visiteurs' ? 'Sessions' : 'Contacts']} />
                <Bar dataKey="visiteurs" fill="#C9A961" radius={[4, 4, 0, 0]} name="visiteurs" />
                <Bar dataKey="contacts" fill="#1A3A52" radius={[4, 4, 0, 0]} name="contacts" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-3 justify-center">
              <span className="flex items-center gap-2 text-xs text-slate-500"><span className="w-3 h-3 bg-[#C9A961] rounded" /> Sessions</span>
              <span className="flex items-center gap-2 text-xs text-slate-500"><span className="w-3 h-3 bg-[#1A3A52] rounded" /> Contacts</span>
            </div>
          </>
        )}
      </div>

      {/* Carte historique cumul */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#C9A961]" /> Carte cumulative des visiteurs (12 derniers mois)
        </h3>
        <VisitorsMap pageViews={recentViews} mode="history" activeThreshold={30} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top pages */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#C9A961]" /> Top pages
          </h3>
          {topPages.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">Aucune donnée</p>
          ) : (
            <div className="space-y-3">
              {topPages.map(([page, data], i) => {
                const avgTime = data.timedCount > 0 ? Math.round(data.totalTime / data.timedCount) : 0;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-4">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-slate-700">{page}</span>
                        <div className="flex items-center gap-3">
                          {avgTime > 0 && (
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                              <Clock className="h-3 w-3" />{fmtTime(avgTime)} moy.
                            </span>
                          )}
                          <span className="text-sm font-bold text-[#1A3A52]">{Math.round((data.count / totalPageViews) * 100)}%</span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#C9A961] rounded-full" style={{ width: `${(data.count / (topPages[0]?.[1]?.count || 1)) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Appareils */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2">
            <Monitor className="h-4 w-4 text-[#C9A961]" /> Appareils
          </h3>
          {totalSessions === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">Aucune donnée</p>
          ) : (
            <div className="space-y-4">
              {[
                { label: 'Desktop', icon: Monitor, count: deviceCounts.Desktop },
                { label: 'Mobile', icon: Smartphone, count: deviceCounts.Mobile },
                { label: 'Tablette', icon: Tablet, count: deviceCounts.Tablette },
              ].map(({ label, icon: Icon, count }) => {
                const pct = recentViews.length > 0 ? Math.round((count / recentViews.length) * 100) : 0;
                return (
                  <div key={label} className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-slate-700">{label}</span>
                        <span className="text-sm font-bold text-[#1A3A52]">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1A3A52] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sources */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#C9A961]" /> Sources de trafic
          </h3>
          {topSources.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">Aucune donnée</p>
          ) : (
            <div className="space-y-3">
              {topSources.map(([source, count], i) => {
                const pct = recentViews.length > 0 ? Math.round((count / recentViews.length) * 100) : 0;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: getSourceColor(source) }} />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-slate-700 font-medium">{source}</span>
                        <span className="text-sm font-bold text-[#1A3A52]">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: getSourceColor(source) }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-700">
        <strong>✓ Données 100% réelles</strong> — Ces statistiques sont calculées à partir des visites réellement enregistrées sur votre site. Le tracking est actif depuis aujourd'hui.
      </div>
    </div>
  );
}

// ── Helpers enrichis ────────────────────────────────────────────────────────
function getBrowser(ua = '') {
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/OPR\/|Opera/i.test(ua)) return 'Opera';
  if (/Chrome\/[0-9]/i.test(ua) && !/Chromium/i.test(ua)) return 'Chrome';
  if (/Firefox\//i.test(ua)) return 'Firefox';
  if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
  if (/MSIE|Trident/i.test(ua)) return 'Internet Explorer';
  return 'Autre';
}

function getOS(ua = '') {
  if (/Windows NT 10/i.test(ua)) return 'Windows 10/11';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/iPhone|iPad/i.test(ua)) return 'iOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Inconnu';
}

function getHour(dateStr) {
  return new Date(dateStr).getHours();
}

function getDetailedSource(referrer = '') {
  if (!referrer) return { label: 'Direct / Bookmark', category: 'direct', color: '#6366f1' };
  const r = referrer.toLowerCase();
  if (/google\./i.test(r)) return { label: 'Google', category: 'search', color: '#ea4335' };
  if (/bing\.com/i.test(r)) return { label: 'Bing', category: 'search', color: '#00809d' };
  if (/yahoo\.com/i.test(r)) return { label: 'Yahoo', category: 'search', color: '#720e9e' };
  if (/duckduckgo\.com/i.test(r)) return { label: 'DuckDuckGo', category: 'search', color: '#de5833' };
  if (/linkedin\.com/i.test(r)) return { label: 'LinkedIn', category: 'social', color: '#0077b5' };
  if (/facebook\.com|fb\.com/i.test(r)) return { label: 'Facebook', category: 'social', color: '#1877f2' };
  if (/instagram\.com/i.test(r)) return { label: 'Instagram', category: 'social', color: '#e1306c' };
  if (/twitter\.com|t\.co/i.test(r)) return { label: 'Twitter/X', category: 'social', color: '#000000' };
  if (/whatsapp\.com/i.test(r)) return { label: 'WhatsApp', category: 'social', color: '#25d366' };
  try {
    const host = new URL(referrer).hostname.replace('www.', '');
    return { label: host, category: 'referral', color: '#C9A961' };
  } catch {
    return { label: 'Autre', category: 'referral', color: '#94a3b8' };
  }
}

// ── Onglet Sources & Analyse Avancée ────────────────────────────────────────
function VisiteursSources({ pageViews }) {
  const [activeSource, setActiveSource] = useState(null);
  const [activeTab, setActiveTab] = useState('sources');

  // Analyse complète par source
  const sourcesDetail = useMemo(() => {
    const map = {};
    pageViews.forEach(v => {
      const src = getDetailedSource(v.referrer || '');
      const key = src.label;
      if (!map[key]) map[key] = { ...src, count: 0, sessions: new Set(), referrers: {}, pages: {}, cities: {}, devices: {}, browsers: {}, oses: {}, hours: {}, keywords: {} };
      map[key].count++;
      map[key].sessions.add(v.session_id);
      if (v.referrer) map[key].referrers[v.referrer] = (map[key].referrers[v.referrer] || 0) + 1;
      if (v.page) map[key].pages[v.page] = (map[key].pages[v.page] || 0) + 1;
      if (v.city) map[key].cities[v.city] = (map[key].cities[v.city] || 0) + 1;
      if (v.search_keywords && v.search_keywords.trim()) {
        const kw = v.search_keywords.trim();
        map[key].keywords[kw] = (map[key].keywords[kw] || 0) + 1;
      }
      const dev = getDeviceType(v.user_agent); map[key].devices[dev] = (map[key].devices[dev] || 0) + 1;
      const br = getBrowser(v.user_agent); map[key].browsers[br] = (map[key].browsers[br] || 0) + 1;
      const os = getOS(v.user_agent); map[key].oses[os] = (map[key].oses[os] || 0) + 1;
      const h = getHour(v.created_date); map[key].hours[h] = (map[key].hours[h] || 0) + 1;
    });
    return Object.entries(map)
      .map(([k, v]) => [k, { ...v, sessions: v.sessions.size }])
      .sort((a, b) => b[1].count - a[1].count);
  }, [pageViews]);

  // Stats globales appareils
  const deviceStats = useMemo(() => {
    const d = {};
    pageViews.forEach(v => { const t = getDeviceType(v.user_agent); d[t] = (d[t] || 0) + 1; });
    return Object.entries(d).sort((a,b) => b[1]-a[1]);
  }, [pageViews]);

  // Stats globales navigateurs
  const browserStats = useMemo(() => {
    const d = {};
    pageViews.forEach(v => { const b = getBrowser(v.user_agent); d[b] = (d[b] || 0) + 1; });
    return Object.entries(d).sort((a,b) => b[1]-a[1]);
  }, [pageViews]);

  // Stats OS
  const osStats = useMemo(() => {
    const d = {};
    pageViews.forEach(v => { const o = getOS(v.user_agent); d[o] = (d[o] || 0) + 1; });
    return Object.entries(d).sort((a,b) => b[1]-a[1]);
  }, [pageViews]);

  // Heures de pointe
  const hourStats = useMemo(() => {
    const h = Array(24).fill(0);
    pageViews.forEach(v => { h[getHour(v.created_date)]++; });
    return h.map((count, hour) => ({ hour, count }));
  }, [pageViews]);
  const peakHour = hourStats.reduce((best, h) => h.count > best.count ? h : best, { hour: 0, count: 0 });

  // Pays
  const countryStats = useMemo(() => {
    const d = {};
    pageViews.forEach(v => { if (v.country) d[v.country] = (d[v.country] || 0) + 1; });
    return Object.entries(d).sort((a,b) => b[1]-a[1]);
  }, [pageViews]);

  // Villes
  const cityStats = useMemo(() => {
    const d = {};
    pageViews.forEach(v => { if (v.city) d[v.city] = (d[v.city] || 0) + 1; });
    return Object.entries(d).sort((a,b) => b[1]-a[1]).slice(0, 15);
  }, [pageViews]);

  // Catégories sources
  const categoryStats = useMemo(() => {
    const d = { direct: 0, search: 0, social: 0, referral: 0 };
    pageViews.forEach(v => { const src = getDetailedSource(v.referrer || ''); d[src.category] = (d[src.category] || 0) + 1; });
    return d;
  }, [pageViews]);

  const total = pageViews.length || 1;
  const selected = activeSource ? sourcesDetail.find(([s]) => s === activeSource) : null;

  const CATEGORY_LABELS = { direct: 'Direct', search: 'Moteurs de recherche', social: 'Réseaux sociaux', referral: 'Sites référents' };
  const CATEGORY_COLORS = { direct: '#6366f1', search: '#ea4335', social: '#0077b5', referral: '#C9A961' };

  // Mots-clés détectés (search_keywords enregistrés)
  const allKeywords = useMemo(() => {
    const kw = {};
    pageViews.forEach(v => {
      if (v.search_keywords && v.search_keywords.trim()) {
        const k = v.search_keywords.trim();
        if (!kw[k]) kw[k] = { count: 0, sources: {}, pages: {}, cities: {} };
        kw[k].count++;
        const src = getDetailedSource(v.referrer || '').label;
        kw[k].sources[src] = (kw[k].sources[src] || 0) + 1;
        if (v.page) kw[k].pages[v.page] = (kw[k].pages[v.page] || 0) + 1;
        if (v.city) kw[k].cities[v.city] = (kw[k].cities[v.city] || 0) + 1;
      }
    });
    return Object.entries(kw).sort((a, b) => b[1].count - a[1].count);
  }, [pageViews]);

  // Mots-clés dans les sources (inclure les campagnes UTM)
  const sourcesWithKeywords = useMemo(() => {
    return sourcesDetail.filter(([, data]) => Object.keys(data.keywords || {}).length > 0);
  }, [sourcesDetail]);

  const tabs = [
    { id: 'keywords', label: `🔑 Mots-clés${allKeywords.length > 0 ? ` (${allKeywords.length})` : ''}` },
    { id: 'sources', label: 'Sources de trafic' },
    { id: 'geo', label: 'Géographie' },
    { id: 'tech', label: 'Appareils & Tech' },
    { id: 'horaires', label: 'Horaires' },
  ];

  return (
    <div className="space-y-5">
      {/* Résumé catégories */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(categoryStats).map(([cat, count]) => (
          <div key={cat} className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{CATEGORY_LABELS[cat]}</span>
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
            </div>
            <p className="text-2xl font-bold text-[#1A3A52]">{count}</p>
            <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(count/total)*100}%`, backgroundColor: CATEGORY_COLORS[cat] }} />
            </div>
            <p className="text-xs text-slate-400 mt-1">{((count/total)*100).toFixed(0)}% du trafic</p>
          </div>
        ))}
      </div>

      {/* Sous-onglets */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? 'bg-[#1A3A52] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── MOTS-CLÉS ── */}
      {activeTab === 'keywords' && (
        <div className="space-y-5">
          {allKeywords.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <Search className="h-12 w-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-600 font-semibold mb-2">Aucun mot-clé détecté pour le moment</p>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-4">
                Le système de détection est maintenant actif. Les mots-clés seront capturés pour les prochains visiteurs arrivant via :
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                {['Bing', 'DuckDuckGo', 'Yahoo', 'Qwant', 'Ecosia', 'Yandex', 'Google Ads (utm_term)', 'Campagnes UTM', 'Sites avec ?q='].map(src => (
                  <span key={src} className="text-xs bg-slate-100 text-slate-600 rounded-full px-3 py-1">{src}</span>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left text-xs text-amber-800 max-w-lg mx-auto">
                <strong>⚠️ Google Search (gratuit) :</strong> Google masque les mots-clés depuis 2013 pour les recherches organiques. Pour les récupérer, vous devez utiliser <strong>Google Ads</strong> (payant) ou <strong>Google Search Console</strong> (gratuit mais différé).
              </div>
            </div>
          ) : (
            <>
              {/* Résumé */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
                  <p className="text-3xl font-bold text-[#1A3A52]">{allKeywords.length}</p>
                  <p className="text-xs text-slate-500 mt-1">Mots-clés uniques</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
                  <p className="text-3xl font-bold text-[#1A3A52]">{allKeywords.reduce((s, [,d]) => s + d.count, 0)}</p>
                  <p className="text-xs text-slate-500 mt-1">Visites avec mot-clé</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
                  <p className="text-3xl font-bold text-[#C9A961]">{allKeywords[0]?.[0]?.slice(0,20) || '—'}</p>
                  <p className="text-xs text-slate-500 mt-1">Mot-clé #1</p>
                </div>
              </div>

              {/* Liste mots-clés */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#C9A961]" /> Tous les mots-clés détectés — classés par fréquence
                </h3>
                <div className="space-y-3">
                  {allKeywords.map(([kw, data], i) => (
                    <div key={i} className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-xs font-bold text-slate-400 w-5 flex-shrink-0">{i+1}</span>
                          <span className="font-semibold text-[#1A3A52] text-sm truncate">{kw}</span>
                          {kw.startsWith('[Campagne]') && (
                            <span className="text-[10px] bg-purple-100 text-purple-700 rounded-full px-1.5 py-0.5 font-medium flex-shrink-0">UTM</span>
                          )}
                        </div>
                        <span className="text-xs font-bold bg-[#C9A961] text-[#1A3A52] rounded-full px-2 py-0.5 flex-shrink-0">{data.count}×</span>
                      </div>
                      <div className="ml-7 flex flex-wrap gap-2 text-xs">
                        {/* Sources */}
                        {Object.entries(data.sources).map(([src, n]) => (
                          <span key={src} className="bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-0.5">
                            via {src} ×{n}
                          </span>
                        ))}
                        {/* Pages atterrissage */}
                        {Object.entries(data.pages).slice(0,3).map(([page, n]) => (
                          <span key={page} className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">
                            → {page}
                          </span>
                        ))}
                        {/* Villes */}
                        {Object.entries(data.cities).slice(0,2).map(([city, n]) => (
                          <span key={city} className="bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">
                            📍 {city}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── SOURCES ── */}
      {activeTab === 'sources' && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#C9A961]" /> Sources détaillées — cliquer pour analyse
            </h3>
            {sourcesDetail.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Aucune donnée</p>
            ) : (
              <div className="space-y-2">
                {sourcesDetail.map(([source, data]) => (
                  <button key={source} onClick={() => setActiveSource(activeSource === source ? null : source)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${activeSource === source ? 'border-[#C9A961] bg-amber-50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}>
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: data.color }} />
                    <span className="flex-1 text-sm font-medium text-slate-800">{source}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 rounded px-1.5 py-0.5 font-medium uppercase">{data.category}</span>
                    <span className="text-xs bg-white border border-slate-200 rounded-full px-2 py-0.5 text-slate-600 font-bold">{data.count} vues</span>
                    <span className="text-xs text-slate-400">{data.sessions} sess.</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            {!selected ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <Globe className="h-10 w-10 text-slate-200 mb-3" />
                <p className="text-slate-400 text-sm">Cliquez sur une source pour l'analyser</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selected[1].color }} />
                  <h3 className="font-bold text-[#1A3A52] text-lg">{selected[0]}</h3>
                  <span className="text-xs bg-slate-100 text-slate-500 rounded px-2 py-0.5 font-medium uppercase">{selected[1].category}</span>
                  <span className="ml-auto text-sm text-slate-400">{selected[1].count} vues · {selected[1].sessions} sessions</span>
                </div>

                {/* Pages depuis cette source */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Pages visitées depuis cette source</p>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {Object.entries(selected[1].pages).sort((a,b)=>b[1]-a[1]).map(([page, n], i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 w-4">{i+1}</span>
                        <div className="flex-1 flex justify-between items-center bg-slate-50 rounded-lg px-3 py-1">
                          <span className="text-xs text-slate-700">{page}</span>
                          <span className="font-bold text-[#1A3A52] text-xs">{n}×</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mots-clés de cette source */}
                {Object.keys(selected[1].keywords || {}).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5 text-[#C9A961]" /> Mots-clés détectés depuis cette source
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(selected[1].keywords).sort((a,b)=>b[1]-a[1]).map(([kw, n], i) => (
                        <span key={i} className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-full px-2.5 py-1 font-medium flex items-center gap-1">
                          <Tag className="h-2.5 w-2.5" />{kw} <strong>×{n}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Villes */}
                {Object.keys(selected[1].cities).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Villes d'origine</p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(selected[1].cities).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([city, n], i) => (
                        <span key={i} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-0.5">{city} ×{n}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Appareils */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Appareils utilisés</p>
                  <div className="flex gap-2">
                    {Object.entries(selected[1].devices).sort((a,b)=>b[1]-a[1]).map(([dev, n]) => (
                      <span key={dev} className="text-xs bg-slate-100 text-slate-600 rounded-lg px-2 py-1 font-medium">{dev}: {n}</span>
                    ))}
                  </div>
                </div>

                {/* URLs exactes */}
                {Object.keys(selected[1].referrers).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <ExternalLink className="h-3.5 w-3.5" /> URLs exactes de provenance
                    </p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {Object.entries(selected[1].referrers).sort((a,b)=>b[1]-a[1]).slice(0, 10).map(([url, n], i) => (
                        <div key={i} className="flex items-start gap-2 bg-slate-50 rounded-lg px-3 py-1.5">
                          <span className="text-[10px] font-bold text-slate-400 mt-0.5 flex-shrink-0">×{n}</span>
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline break-all">{url}</a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── GÉO ── */}
      {activeTab === 'geo' && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#C9A961]" /> Pays d'origine
            </h3>
            {countryStats.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">Aucune donnée géographique</p> : (
              <div className="space-y-2.5">
                {countryStats.slice(0,12).map(([country, count], i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-4">{i+1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{country}</span>
                        <span className="text-sm font-bold text-[#1A3A52]">{count} vues ({((count/total)*100).toFixed(0)}%)</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#C9A961] rounded-full" style={{ width: `${(count/countryStats[0][1])*100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#C9A961]" /> Top 15 villes
            </h3>
            {cityStats.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">Aucune ville détectée</p> : (
              <div className="space-y-2">
                {cityStats.map(([city, count], i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-5">{i+1}</span>
                      <span className="text-sm font-medium text-slate-700">{city}</span>
                    </div>
                    <span className="text-xs font-bold bg-[#1A3A52] text-white rounded-full px-2 py-0.5">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TECH ── */}
      {activeTab === 'tech' && (
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2">
              <Monitor className="h-4 w-4 text-[#C9A961]" /> Appareils
            </h3>
            <div className="space-y-3">
              {deviceStats.map(([dev, count]) => (
                <div key={dev} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{dev}</span>
                      <span className="text-sm font-bold text-[#1A3A52]">{((count/total)*100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1A3A52] rounded-full" style={{ width: `${(count/total)*100}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-semibold text-[#1A3A52] mb-4">Navigateurs</h3>
            <div className="space-y-3">
              {browserStats.map(([browser, count]) => (
                <div key={browser} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{browser}</span>
                      <span className="text-sm font-bold text-[#1A3A52]">{((count/total)*100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C9A961] rounded-full" style={{ width: `${(count/total)*100}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-semibold text-[#1A3A52] mb-4">Systèmes d'exploitation</h3>
            <div className="space-y-3">
              {osStats.map(([os, count]) => (
                <div key={os} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{os}</span>
                      <span className="text-sm font-bold text-[#1A3A52]">{((count/total)*100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(count/total)*100}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── HORAIRES ── */}
      {activeTab === 'horaires' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1A3A52] flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#C9A961]" /> Heures de visite (toutes données)
            </h3>
            {peakHour.count > 0 && (
              <span className="text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 font-medium">
                🔥 Pic à {peakHour.hour}h — {peakHour.count} visites
              </span>
            )}
          </div>
          <div className="flex items-end gap-1 h-36">
            {hourStats.map(({ hour, count }) => {
              const maxCount = Math.max(...hourStats.map(h => h.count), 1);
              const heightPct = (count / maxCount) * 100;
              const isPeak = hour === peakHour.hour;
              return (
                <div key={hour} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {hour}h : {count}
                  </div>
                  <div
                    className={`w-full rounded-t transition-all ${isPeak ? 'bg-[#C9A961]' : 'bg-slate-200 group-hover:bg-[#1A3A52]/60'}`}
                    style={{ height: `${Math.max(heightPct, count > 0 ? 4 : 0)}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-0.5">
            {[0, 4, 8, 12, 16, 20, 23].map(h => <span key={h}>{h}h</span>)}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Matin (6h-12h)', range: [6,11] },
              { label: 'Après-midi (12h-18h)', range: [12,17] },
              { label: 'Soir (18h-23h)', range: [18,23] },
            ].map(({ label, range }) => {
              const count = hourStats.filter(h => h.hour >= range[0] && h.hour <= range[1]).reduce((s,h) => s+h.count, 0);
              return (
                <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-[#1A3A52]">{count}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
        <strong>🔑 Détection des mots-clés :</strong> Le système capture automatiquement les mots-clés de <strong>Bing, Yahoo, DuckDuckGo, Qwant, Yandex, Ecosia</strong> et toutes les campagnes avec paramètres <strong>utm_term, utm_content, utm_campaign</strong>. Google Search organique masque les mots-clés depuis 2013 — utilisez <strong>Google Ads</strong> (utm_term sera capturé) ou <strong>Google Search Console</strong> pour les récupérer.
      </div>
    </div>
  );
}

// ── Onglet Par Visiteur ───────────────────────────────────────────────────────
function VisiteursListe({ pageViews }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const visitors = useMemo(() => {
    const map = {};
    pageViews.forEach(v => {
      if (!map[v.session_id]) map[v.session_id] = [];
      map[v.session_id].push(v);
    });
    return Object.entries(map)
      .map(([session_id, pages]) => {
        const sorted = [...pages].sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const totalTime = sorted.reduce((s, p) => s + (p.time_on_page || 0), 0);
        const source = getSource(first?.referrer || '');
        const keywords = sorted.map(p => p.search_keywords).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
        return { session_id, pages: sorted, first, last, totalTime, source, keywords, device: getDeviceType(first?.user_agent), country: first?.country || '', city: first?.city || '' };
      })
      .sort((a, b) => new Date(b.last.created_date) - new Date(a.last.created_date));
  }, [pageViews]);

  const filtered = useMemo(() => {
    if (!search.trim()) return visitors;
    const q = search.toLowerCase();
    return visitors.filter(v =>
      v.country.toLowerCase().includes(q) ||
      v.city.toLowerCase().includes(q) ||
      v.source.toLowerCase().includes(q) ||
      v.device.toLowerCase().includes(q) ||
      v.keywords.some(k => k.toLowerCase().includes(q)) ||
      v.pages.some(p => p.page.toLowerCase().includes(q))
    );
  }, [visitors, search]);

  function fmtTime(seconds) {
    if (!seconds || seconds <= 0) return '—';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  }

  function DeviceIcon({ ua }) {
    const d = getDeviceType(ua);
    if (d === 'Mobile') return <Smartphone className="h-3.5 w-3.5" />;
    if (d === 'Tablette') return <Tablet className="h-3.5 w-3.5" />;
    return <Monitor className="h-3.5 w-3.5" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par pays, source, page…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C9A961]"
          />
        </div>
        <span className="text-sm text-slate-400">{filtered.length} visiteur{filtered.length > 1 ? 's' : ''}</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Visiteur</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Source</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Appareil</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Pages</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Temps</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Mots-clés</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Dernière visite</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">Aucun visiteur enregistré</td></tr>
            )}
            {filtered.map((v) => (
              <tr key={v.session_id}
                onClick={() => setSelected(v)}
                className="hover:bg-amber-50 cursor-pointer transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#1A3A52]/10 flex items-center justify-center text-[#1A3A52] flex-shrink-0">
                      <DeviceIcon ua={v.first?.user_agent} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{v.city || v.country || 'Inconnu'}{v.city && v.country && v.city !== v.country ? `, ${v.country}` : ''}</p>
                      <p className="text-xs text-slate-400 font-mono">{v.session_id.slice(0, 12)}…</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-sm font-medium" style={{ color: getSourceColor(v.source) }}>{v.source}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-slate-500 text-sm">{v.device}</td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full">{v.pages.length}</span>
                </td>
                <td className="px-4 py-3 text-center hidden md:table-cell">
                  <span className="text-sm text-slate-600">{fmtTime(v.totalTime)}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {v.keywords.length > 0 ? (
                    <span className="flex items-center gap-1 text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-2 py-0.5">
                      <Tag className="h-3 w-3" />{v.keywords[0]}{v.keywords.length > 1 ? ` +${v.keywords.length - 1}` : ''}
                    </span>
                  ) : <span className="text-slate-300 text-xs">—</span>}
                </td>
                <td className="px-4 py-3 text-right text-xs text-slate-400 whitespace-nowrap">
                  {new Date(v.last.created_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && <VisitorDetail visitor={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ── Composant Principal ───────────────────────────────────────────────────────
export default function AdminVisiteurs() {
  const [tab, setTab] = useState('realtime');

  const { data: pageViews = [], refetch: refetchPageViews } = useQuery({
    queryKey: ['page-views'],
    queryFn: () => db.PageView.list('-created_date', 2000),
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts-analytics'],
    queryFn: () => db.ContactRequest.list('-created_date', 500),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1A3A52] mb-1">Statistiques Visiteurs</h2>
        <p className="text-slate-500 text-sm">Données réelles de trafic sur votre site</p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('realtime')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${tab === 'realtime' ? 'bg-[#1A3A52] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          <span className={`w-2 h-2 rounded-full ${tab === 'realtime' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'}`} />
          Temps réel
        </button>
        <button onClick={() => setTab('stats')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${tab === 'stats' ? 'bg-[#1A3A52] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          <BarChart3 className="h-4 w-4" /> Cumul & Historique
        </button>
        <button onClick={() => setTab('sources')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${tab === 'sources' ? 'bg-[#1A3A52] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          <Search className="h-4 w-4" /> Sources & Mots-clés
        </button>
        <button onClick={() => setTab('visitors')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${tab === 'visitors' ? 'bg-[#1A3A52] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          <Users className="h-4 w-4" /> Par visiteur
        </button>
      </div>

      {tab === 'realtime' && <VisiteursTempsReel pageViews={pageViews} contacts={contacts} refetchPageViews={refetchPageViews} />}
      {tab === 'stats' && <VisiteursCumul pageViews={pageViews} contacts={contacts} />}
      {tab === 'sources' && <VisiteursSources pageViews={pageViews} />}
      {tab === 'visitors' && <VisiteursListe pageViews={pageViews} />}
    </div>
  );
}