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

        let searchKeywords = '';
        if (document.referrer) {
            try {
                const refUrl = new URL(document.referrer);
                searchKeywords = refUrl.searchParams.get('q') || refUrl.searchParams.get('p') || '';
            } catch (e) {}
        }

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