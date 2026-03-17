import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';
import Contact from './pages/Contact';
import Durabilite from './pages/Durabilite';
import Equipe from './pages/Equipe';
import EspaceAssocie from './pages/EspaceAssocie';
import Home from './pages/Home';
import InvestirDansFonciere from './pages/InvestirDansFonciere';
import MentionsLegales from './pages/MentionsLegales';
import Partenaires from './pages/Partenaires';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import Realisations from './pages/Realisations';
import Services from './pages/Services';
import StrategyPerformance from './pages/StrategyPerformance';
import __Layout from './Layout.jsx';

export const PAGES = {
    "Blog": Blog,
    "BlogArticle": BlogArticle,
    "Contact": Contact,
    "Durabilite": Durabilite,
    "Equipe": Equipe,
    "EspaceAssocie": EspaceAssocie,
    "Home": Home,
    "InvestirDansFonciere": InvestirDansFonciere,
    "MentionsLegales": MentionsLegales,
    "Partenaires": Partenaires,
    "PolitiqueConfidentialite": PolitiqueConfidentialite,
    "Realisations": Realisations,
    "Services": Services,
    "StrategyPerformance": StrategyPerformance,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};