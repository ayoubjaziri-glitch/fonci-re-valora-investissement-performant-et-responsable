/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';
import Contact from './pages/Contact';
import Durabilite from './pages/Durabilite';
import Equipe from './pages/Equipe';
import EspaceAssocie from './pages/EspaceAssocie';
import GererAcces from './pages/GererAcces';
import GestionPhotos from './pages/GestionPhotos';
import Home from './pages/Home';
import InvestirDansFonciere from './pages/InvestirDansFonciere';
import MentionsLegales from './pages/MentionsLegales';
import Partenaires from './pages/Partenaires';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import Realisations from './pages/Realisations';
import Services from './pages/Services';
import StrategyPerformance from './pages/StrategyPerformance';
import AdminEspaceAssocie from './pages/AdminEspaceAssocie';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Blog": Blog,
    "BlogArticle": BlogArticle,
    "Contact": Contact,
    "Durabilite": Durabilite,
    "Equipe": Equipe,
    "EspaceAssocie": EspaceAssocie,
    "GererAcces": GererAcces,
    "GestionPhotos": GestionPhotos,
    "Home": Home,
    "InvestirDansFonciere": InvestirDansFonciere,
    "MentionsLegales": MentionsLegales,
    "Partenaires": Partenaires,
    "PolitiqueConfidentialite": PolitiqueConfidentialite,
    "Realisations": Realisations,
    "Services": Services,
    "StrategyPerformance": StrategyPerformance,
    "AdminEspaceAssocie": AdminEspaceAssocie,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};