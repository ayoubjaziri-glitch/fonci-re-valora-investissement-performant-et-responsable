import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from './supabaseClient';

const SUPABASE_URL = 'https://cnulpkwcfpbujojwefah.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5NLD8wzCMdxN4TCiuSYK-w_mDQ1aQFO';

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

// Insertion directe dans Supabase sans passer par le client REST (plus rapide)
async function insertPageView(data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/page_views`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    const result = await res.json();
    return Array.isArray(result) ? result[0] : result;
}

async function updatePageViewTime(id, seconds) {
    await fetch(`${SUPABASE_URL}/rest/v1/page_views?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ time_on_page: seconds }),
    });
}

// Géolocalisation avec 3 APIs en fallback, résultat mis en cache session
async function getGeo() {
    const cached = sessionStorage.getItem('_valora_geo');
    if (cached) return JSON.parse(cached);

    // API 1 : ip-api.com (rapide, précise)
    try {
        const r = await fetch('https://ip-api.com/json/?fields=status,country,city,lat,lon,query', { signal: AbortSignal.timeout(3000) });
        const g = await r.json();
        if (g.status === 'success' && g.lat) {
            const geo = { country: g.country, city: g.city, lat: g.lat, lon: g.lon, query: g.query };
            sessionStorage.setItem('_valora_geo', JSON.stringify(geo));
            return geo;
        }
    } catch {}

    // API 2 : ipapi.co
    try {
        const r = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
        const g = await r.json();
        if (g.latitude) {
            const geo = { country: g.country_name, city: g.city, lat: g.latitude, lon: g.longitude, query: g.ip };
            sessionStorage.setItem('_valora_geo', JSON.stringify(geo));
            return geo;
        }
    } catch {}

    // API 3 : freeipapi.com
    try {
        const r = await fetch('https://freeipapi.com/api/json/', { signal: AbortSignal.timeout(3000) });
        const g = await r.json();
        if (g.latitude) {
            const geo = { country: g.countryName, city: g.cityName, lat: g.latitude, lon: g.longitude, query: g.ipAddress };
            sessionStorage.setItem('_valora_geo', JSON.stringify(geo));
            return geo;
        }
    } catch {}

    return {};
}

function extractKeywords() {
    const currentUrl = new URL(window.location.href);
    let kw = '';

    const utmTerm = currentUrl.searchParams.get('utm_term');
    const utmContent = currentUrl.searchParams.get('utm_content');
    const utmCampaign = currentUrl.searchParams.get('utm_campaign');
    const utmSource = currentUrl.searchParams.get('utm_source');
    const utmMedium = currentUrl.searchParams.get('utm_medium');

    if (utmTerm) kw = utmTerm;
    else if (utmContent) kw = utmContent;

    if (!kw && document.referrer) {
        try {
            const ref = new URL(document.referrer);
            const h = ref.hostname;
            if (/google\./i.test(h)) kw = ref.searchParams.get('q') || '';
            else if (/bing\.com/i.test(h)) kw = ref.searchParams.get('q') || '';
            else if (/yahoo\.com/i.test(h)) kw = ref.searchParams.get('p') || ref.searchParams.get('q') || '';
            else if (/duckduckgo\.com/i.test(h)) kw = ref.searchParams.get('q') || '';
            else if (/ecosia\.org|qwant\.com/i.test(h)) kw = ref.searchParams.get('q') || '';
            else if (/yandex\./i.test(h)) kw = ref.searchParams.get('text') || '';
            else if (/baidu\.com/i.test(h)) kw = ref.searchParams.get('wd') || ref.searchParams.get('q') || '';
            else kw = ref.searchParams.get('q') || ref.searchParams.get('query') || '';
        } catch {}
    }

    if (!kw) kw = currentUrl.searchParams.get('q') || currentUrl.searchParams.get('query') || '';

    if (kw) {
        sessionStorage.setItem('_valora_kw', kw);
        if (utmSource) sessionStorage.setItem('_valora_utm_source', utmSource);
        if (utmMedium) sessionStorage.setItem('_valora_utm_medium', utmMedium);
        if (utmCampaign) sessionStorage.setItem('_valora_utm_campaign', utmCampaign);
    } else {
        kw = sessionStorage.getItem('_valora_kw') || '';
    }

    const utmLabel = [
        utmSource || sessionStorage.getItem('_valora_utm_source'),
        utmMedium || sessionStorage.getItem('_valora_utm_medium'),
        utmCampaign || sessionStorage.getItem('_valora_utm_campaign'),
    ].filter(Boolean).join(' / ');
    if (utmLabel && !kw) kw = `[Campagne] ${utmLabel}`;

    return kw;
}

export default function NavigationTracker() {
    const location = useLocation();
    const lastPath = useRef(null);
    const currentViewId = useRef(null);
    const enterTime = useRef(null);

    const flushTime = () => {
        if (currentViewId.current && enterTime.current) {
            const seconds = Math.round((Date.now() - enterTime.current) / 1000);
            if (seconds > 2) {
                updatePageViewTime(currentViewId.current, seconds);
            }
            currentViewId.current = null;
            enterTime.current = null;
        }
    };

    useEffect(() => {
        const pathname = location.pathname;
        if (lastPath.current === pathname) return;

        flushTime();
        lastPath.current = pathname;

        // Ne pas tracker les pages admin/espace associés
        if (pathname.startsWith('/admin') || pathname.startsWith('/EspaceAssocie')) return;

        const label = PAGE_LABELS[pathname] || pathname.replace(/^\//, '') || 'Accueil';
        enterTime.current = Date.now();
        const keywords = extractKeywords();
        const sessionId = getSessionId();
        const userAgent = navigator.userAgent.slice(0, 200);
        const referrer = document.referrer ? document.referrer.slice(0, 500) : '';

        // Envoi IMMÉDIAT sans attendre la géo (visible dans le back-office en <1s)
        const baseData = {
            page: label,
            path: pathname,
            session_id: sessionId,
            user_agent: userAgent,
            referrer,
            search_keywords: keywords.slice(0, 200),
            country: '',
            city: '',
            lat: null,
            lng: null,
            ip: '',
            time_on_page: 0,
        };

        insertPageView(baseData).then(created => {
            if (created?.id) {
                currentViewId.current = created.id;

                // Enrichir avec la géo dès qu'elle est disponible (async, sans bloquer)
                getGeo().then(geo => {
                    if (geo && geo.country && created.id) {
                        fetch(`${SUPABASE_URL}/rest/v1/page_views?id=eq.${created.id}`, {
                            method: 'PATCH',
                            headers: {
                                'apikey': SUPABASE_KEY,
                                'Authorization': `Bearer ${SUPABASE_KEY}`,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                country: geo.country || '',
                                city: geo.city || '',
                                lat: geo.lat || null,
                                lng: geo.lon || null,
                                ip: geo.query ? geo.query.split('.').slice(0, 3).join('.') + '.x' : '',
                            }),
                        });
                    }
                });
            }
        });

    }, [location.pathname]);

    useEffect(() => {
        const onUnload = () => flushTime();
        const onVisibility = () => { if (document.visibilityState === 'hidden') flushTime(); };
        window.addEventListener('beforeunload', onUnload);
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            window.removeEventListener('beforeunload', onUnload);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    return null;
}