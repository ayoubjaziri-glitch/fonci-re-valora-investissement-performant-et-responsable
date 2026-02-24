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
import Contact from './pages/Contact';
import Equipe from './pages/Equipe';
import Partenaires from './pages/Partenaires';
import Services from './pages/Services';
import StrategyPerformance from './pages/StrategyPerformance';
import Team from './pages/Team';
import Durabilite from './pages/Durabilite';
import Realisations from './pages/Realisations';
import Home from './pages/Home';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Contact": Contact,
    "Equipe": Equipe,
    "Partenaires": Partenaires,
    "Services": Services,
    "StrategyPerformance": StrategyPerformance,
    "Team": Team,
    "Durabilite": Durabilite,
    "Realisations": Realisations,
    "Home": Home,
    "MentionsLegales": MentionsLegales,
    "PolitiqueConfidentialite": PolitiqueConfidentialite,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};