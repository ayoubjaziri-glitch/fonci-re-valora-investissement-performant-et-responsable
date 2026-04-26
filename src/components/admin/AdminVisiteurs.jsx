import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
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

// ── Onglet Sources & Mots-clés ─────────────────────────────────────────────────
function VisiteursSources({ pageViews }) {
  const [activeSource, setActiveSource] = useState(null);

  // Toutes les sources avec URL complète
  const sourcesDetail = useMemo(() => {
    const map = {};
    pageViews.forEach(v => {
      const source = getSource(v.referrer || '');
      if (!map[source]) map[source] = { count: 0, referrers: {}, keywords: {}, pages: {} };
      map[source].count++;
      // URL exacte du referrer
      if (v.referrer) {
        map[source].referrers[v.referrer] = (map[source].referrers[v.referrer] || 0) + 1;
      }
      // Mots-clés
      if (v.search_keywords) {
        const kw = v.search_keywords.toLowerCase().trim();
        if (kw) map[source].keywords[kw] = (map[source].keywords[kw] || 0) + 1;
      }
      // Pages atterrissage
      map[source].pages[v.page] = (map[source].pages[v.page] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1].count - a[1].count);
  }, [pageViews]);

  // Tous les mots-clés confondus
  const allKeywords = useMemo(() => {
    const kw = {};
    pageViews.forEach(v => {
      if (v.search_keywords) {
        const k = v.search_keywords.toLowerCase().trim();
        if (k) kw[k] = (kw[k] || 0) + 1;
      }
    });
    return Object.entries(kw).sort((a, b) => b[1] - a[1]);
  }, [pageViews]);

  const selected = activeSource ? sourcesDetail.find(([s]) => s === activeSource) : null;

  return (
    <div className="space-y-6">

      {/* Mots-clés de recherche */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-[#1A3A52] mb-1 flex items-center gap-2">
          <Search className="h-4 w-4 text-[#C9A961]" /> Mots-clés tapés dans Google / Bing
        </h3>
        <p className="text-xs text-slate-400 mb-4">Termes exacts que les visiteurs ont recherché avant d'arriver sur votre site</p>
        {allKeywords.length === 0 ? (
          <div className="text-center py-8">
            <Search className="h-10 w-10 text-slate-200 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">Aucun mot-clé détecté pour l'instant</p>
            <p className="text-slate-300 text-xs mt-1">Les mots-clés s'affichent quand un visiteur arrive via Google ou Bing — Google cache souvent les mots-clés (trafic "not provided"), ce qui est normal.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {allKeywords.map(([kw, count], i) => (
              <div key={i} className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
                <Tag className="h-3 w-3 text-amber-600" />
                <span className="text-sm text-amber-800 font-medium">{kw}</span>
                <span className="text-xs bg-amber-200 text-amber-700 rounded-full px-1.5 py-0.5 font-bold">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sources détaillées */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#C9A961]" /> Sources exactes — cliquer pour détails
          </h3>
          {sourcesDetail.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">Aucune donnée</p>
          ) : (
            <div className="space-y-2">
              {sourcesDetail.map(([source, data]) => (
                <button key={source} onClick={() => setActiveSource(activeSource === source ? null : source)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${activeSource === source ? 'border-[#C9A961] bg-amber-50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}>
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: getSourceColor(source) }} />
                  <span className="flex-1 text-sm font-medium text-slate-800">{source}</span>
                  <span className="text-xs bg-white border border-slate-200 rounded-full px-2 py-0.5 text-slate-600 font-bold">{data.count} visites</span>
                  {Object.keys(data.keywords).length > 0 && (
                    <span className="text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">{Object.keys(data.keywords).length} mots-clés</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Détail source sélectionnée */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <Globe className="h-10 w-10 text-slate-200 mb-3" />
              <p className="text-slate-400 text-sm">Cliquez sur une source pour voir le détail</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getSourceColor(selected[0]) }} />
                <h3 className="font-bold text-[#1A3A52] text-lg">{selected[0]}</h3>
                <span className="text-sm text-slate-400">{selected[1].count} visites</span>
              </div>

              {/* Mots-clés de cette source */}
              {Object.keys(selected[1].keywords).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Search className="h-3.5 w-3.5" /> Mots-clés recherchés
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(selected[1].keywords).sort((a,b)=>b[1]-a[1]).map(([kw, n], i) => (
                      <span key={i} className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-full px-2.5 py-1 flex items-center gap-1">
                        <Tag className="h-2.5 w-2.5" />{kw} <strong>×{n}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pages d'atterrissage */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Pages visitées depuis cette source</p>
                <div className="space-y-1.5">
                  {Object.entries(selected[1].pages).sort((a,b)=>b[1]-a[1]).map(([page, n], i) => (
                    <div key={i} className="flex justify-between items-center text-sm bg-slate-50 rounded-lg px-3 py-1.5">
                      <span className="text-slate-700">{page}</span>
                      <span className="font-bold text-[#1A3A52] text-xs">{n}×</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* URLs exactes */}
              {Object.keys(selected[1].referrers).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <ExternalLink className="h-3.5 w-3.5" /> URLs exactes de provenance
                  </p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {Object.entries(selected[1].referrers).sort((a,b)=>b[1]-a[1]).slice(0, 10).map(([url, n], i) => (
                      <div key={i} className="flex items-start gap-2 bg-slate-50 rounded-lg px-3 py-1.5">
                        <span className="text-[10px] font-bold text-slate-400 mt-0.5 flex-shrink-0">×{n}</span>
                        <a href={url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline break-all">{url}</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800">
        <strong>💡 Note sur les mots-clés Google :</strong> Depuis 2013, Google masque la majorité des mots-clés (trafic "not provided") pour des raisons de confidentialité. Les mots-clés s'affichent principalement pour les clics depuis Google Ads ou certaines recherches non sécurisées. Pour voir tous les mots-clés Google, connectez <strong>Google Search Console</strong> à votre site.
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
    queryFn: () => base44.entities.PageView.list('-created_date', 2000),
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts-analytics'],
    queryFn: () => base44.entities.ContactRequest.list('-created_date', 500),
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