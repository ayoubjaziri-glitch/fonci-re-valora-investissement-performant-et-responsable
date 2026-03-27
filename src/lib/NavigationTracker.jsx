import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { base44 } from '@/api/base44Client';
import { pagesConfig } from '@/pages.config';

// Generate or retrieve a persistent anonymous session ID
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

    // Log user activity when navigating to a page
    useEffect(() => {
        const pathname = location.pathname;
        let pageName;

        if (pathname === '/' || pathname === '') {
            pageName = mainPageKey;
        } else {
            const pathSegment = pathname.replace(/^\//, '').split('/')[0];
            const pageKeys = Object.keys(Pages);
            const matchedKey = pageKeys.find(
                key => key.toLowerCase() === pathSegment.toLowerCase()
            );
            pageName = matchedKey || null;
        }

        if (isAuthenticated && pageName) {
            base44.appLogs.logUserInApp(pageName).catch(() => {});
        }
    }, [location, isAuthenticated, Pages, mainPageKey]);

    // Track real page views (for all visitors, not just authenticated)
    useEffect(() => {
        const pathname = location.pathname;
        // Avoid double-tracking same path in same navigation
        if (lastPath.current === pathname) return;
        lastPath.current = pathname;

        // Don't track admin pages
        if (pathname.startsWith('/admin') || pathname.startsWith('/EspaceAssocie')) return;

        const label = PAGE_LABELS[pathname] || pathname.replace('/', '') || 'Accueil';

        base44.entities.PageView.create({
            page: label,
            path: pathname,
            session_id: getSessionId(),
            user_agent: navigator.userAgent.slice(0, 200),
            referrer: document.referrer ? document.referrer.slice(0, 200) : '',
        }).catch(() => {});
    }, [location.pathname]);

    return null;
}