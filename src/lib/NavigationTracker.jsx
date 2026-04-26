import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { base44 } from '@/api/base44Client';
import { pagesConfig } from '@/pages.config';

function getSessionId() {
    let sid = sessionStorage.getItem('_valora_sid');
    if (!sid) {
        sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
        sessionStorage.setItem('_valora_sid', sid);
    }
    return sid;
}

const PAGE_LABELS = {
    '/': 'Accueil',
    '/StrategyPerformance': 'Stratégie',
    '/Services': 'Nos Missions',
    '/Equipe': 'Notre Histoire',
    '/Partenaires': 'Écosystème',
    '/Durabilite': 'Durabilité',
    '/Realisations': 'Nos Biens',
    '/Contact': 'Contact',
    '/Blog': 'Blog',
    '/EspaceAssocie': 'Espace Associés',
};

export default function NavigationTracker() {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const { Pages, mainPage } = pagesConfig;
    const mainPageKey = mainPage ?? Object.keys(Pages)[0];
    const lastPath = useRef(null);
    // Stocker l'ID de la vue créée et l'heure d'entrée pour mise à jour du temps
    const currentViewId = useRef(null);
    const enterTime = useRef(null);

    // Log user activity when navigating to a page
    useEffect(() => {
        const pathname = location.pathname;
        let pageName;
        if (pathname === '/' || pathname === '') {
            pageName = mainPageKey;
        } else {
            const pathSegment = pathname.replace(/^\//, '').split('/')[0];
            const pageKeys = Object.keys(Pages);
            const matchedKey = pageKeys.find(key => key.toLowerCase() === pathSegment.toLowerCase());
            pageName = matchedKey || null;
        }
        if (isAuthenticated && pageName) {
            base44.appLogs.logUserInApp(pageName).catch(() => {});
        }
    }, [location, isAuthenticated, Pages, mainPageKey]);

    // Mettre à jour le temps de la vue précédente avant d'enregistrer la nouvelle
    const updatePreviousTime = () => {
        if (currentViewId.current && enterTime.current) {
            const seconds = Math.round((Date.now() - enterTime.current) / 1000);
            if (seconds > 2) {
                base44.entities.PageView.update(currentViewId.current, { time_on_page: seconds }).catch(() => {});
            }
            currentViewId.current = null;
            enterTime.current = null;
        }
    };

    // Track real page views
    useEffect(() => {
        const pathname = location.pathname;
        if (lastPath.current === pathname) return;

        // Mettre à jour le temps passé sur la page précédente
        updatePreviousTime();

        lastPath.current = pathname;

        if (pathname.startsWith('/admin') || pathname.startsWith('/EspaceAssocie')) return;

        const label = PAGE_LABELS[pathname] || pathname.replace('/', '') || 'Accueil';
        enterTime.current = Date.now();

        // ── Détection exhaustive des mots-clés ──────────────────────────────
        let searchKeywords = '';
        const currentUrl = new URL(window.location.href);

        // 1. Paramètres UTM dans l'URL actuelle (campagnes Google Ads, LinkedIn Ads, etc.)
        const utmTerm = currentUrl.searchParams.get('utm_term');
        const utmContent = currentUrl.searchParams.get('utm_content');
        const utmCampaign = currentUrl.searchParams.get('utm_campaign');
        const utmSource = currentUrl.searchParams.get('utm_source');
        const utmMedium = currentUrl.searchParams.get('utm_medium');

        if (utmTerm) searchKeywords = utmTerm;
        else if (utmContent) searchKeywords = utmContent;

        // 2. Mots-clés depuis le referrer (moteurs de recherche)
        if (!searchKeywords && document.referrer) {
            try {
                const refUrl = new URL(document.referrer);
                const host = refUrl.hostname;
                // Google (tous les pays)
                if (/google\./i.test(host)) {
                    searchKeywords = refUrl.searchParams.get('q') || '';
                }
                // Bing
                else if (/bing\.com/i.test(host)) {
                    searchKeywords = refUrl.searchParams.get('q') || '';
                }
                // Yahoo
                else if (/yahoo\.com/i.test(host)) {
                    searchKeywords = refUrl.searchParams.get('p') || refUrl.searchParams.get('q') || '';
                }
                // DuckDuckGo
                else if (/duckduckgo\.com/i.test(host)) {
                    searchKeywords = refUrl.searchParams.get('q') || '';
                }
                // Ecosia
                else if (/ecosia\.org/i.test(host)) {
                    searchKeywords = refUrl.searchParams.get('q') || '';
                }
                // Qwant
                else if (/qwant\.com/i.test(host)) {
                    searchKeywords = refUrl.searchParams.get('q') || '';
                }
                // Baidu
                else if (/baidu\.com/i.test(host)) {
                    searchKeywords = refUrl.searchParams.get('wd') || refUrl.searchParams.get('q') || '';
                }
                // Yandex
                else if (/yandex\./i.test(host)) {
                    searchKeywords = refUrl.searchParams.get('text') || '';
                }
                // Fallback générique — essayer tous les params communs
                else {
                    searchKeywords = refUrl.searchParams.get('q') ||
                        refUrl.searchParams.get('query') ||
                        refUrl.searchParams.get('search') ||
                        refUrl.searchParams.get('keyword') ||
                        refUrl.searchParams.get('s') || '';
                }
            } catch (e) {}
        }

        // 3. Paramètres de recherche dans l'URL actuelle elle-même
        if (!searchKeywords) {
            searchKeywords = currentUrl.searchParams.get('q') ||
                currentUrl.searchParams.get('query') ||
                currentUrl.searchParams.get('keyword') ||
                currentUrl.searchParams.get('search') ||
                currentUrl.searchParams.get('s') || '';
        }

        // 4. Hashtag significatif dans l'URL (certaines campagnes l'utilisent)
        if (!searchKeywords && window.location.hash && window.location.hash.length > 1) {
            const hashVal = window.location.hash.slice(1).replace(/-|_/g, ' ').trim();
            if (hashVal.length > 2 && hashVal.length < 100 && !/^\d+$/.test(hashVal)) {
                searchKeywords = hashVal;
            }
        }

        // 5. Stocker le keyword de la 1ère session pour retrouver la source sur les pages suivantes
        if (searchKeywords) {
            sessionStorage.setItem('_valora_kw', searchKeywords);
            if (utmSource) sessionStorage.setItem('_valora_utm_source', utmSource);
            if (utmMedium) sessionStorage.setItem('_valora_utm_medium', utmMedium);
            if (utmCampaign) sessionStorage.setItem('_valora_utm_campaign', utmCampaign);
        } else {
            // Récupérer le keyword détecté en début de session (navigation interne)
            searchKeywords = sessionStorage.getItem('_valora_kw') || '';
        }

        // Construire un label enrichi si UTM disponible
        const utmLabel = [
            utmSource || sessionStorage.getItem('_valora_utm_source'),
            utmMedium || sessionStorage.getItem('_valora_utm_medium'),
            utmCampaign || sessionStorage.getItem('_valora_utm_campaign'),
        ].filter(Boolean).join(' / ');
        if (utmLabel && !searchKeywords) searchKeywords = `[Campagne] ${utmLabel}`;
        // ────────────────────────────────────────────────────────────────────

        const geoCache = sessionStorage.getItem('_valora_geo');

        const saveView = (geo = {}) => {
            base44.entities.PageView.create({
                page: label,
                path: pathname,
                session_id: getSessionId(),
                user_agent: navigator.userAgent.slice(0, 200),
                referrer: document.referrer ? document.referrer.slice(0, 500) : '',
                search_keywords: searchKeywords.slice(0, 200),
                country: geo.country || '',
                city: geo.city || '',
                lat: geo.lat || null,
                lng: geo.lon || null,
                ip: geo.query ? geo.query.split('.').slice(0, 3).join('.') + '.x' : '',
                time_on_page: 0,
            }).then(created => {
                if (created?.id) currentViewId.current = created.id;
            }).catch(() => {});
        };

        if (geoCache) {
            saveView(JSON.parse(geoCache));
        } else {
            fetch('https://ip-api.com/json/?fields=status,country,city,lat,lon,query')
                .then(r => r.json())
                .then(geo => {
                    if (geo.status === 'success' && geo.lat) {
                        sessionStorage.setItem('_valora_geo', JSON.stringify(geo));
                        saveView(geo);
                    } else throw new Error('no geo');
                })
                .catch(() => {
                    fetch('https://ipapi.co/json/')
                        .then(r => r.json())
                        .then(geo => {
                            const normalized = { country: geo.country_name, city: geo.city, lat: geo.latitude, lon: geo.longitude, query: geo.ip };
                            sessionStorage.setItem('_valora_geo', JSON.stringify(normalized));
                            saveView(normalized);
                        })
                        .catch(() => saveView());
                });
        }
    }, [location.pathname]);

    // Mettre à jour le temps quand l'utilisateur ferme/quitte l'onglet
    useEffect(() => {
        const handleUnload = () => updatePreviousTime();
        const handleVisibility = () => {
            if (document.visibilityState === 'hidden') updatePreviousTime();
        };
        window.addEventListener('beforeunload', handleUnload);
        document.addEventListener('visibilitychange', handleVisibility);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, []);

    return null;
}