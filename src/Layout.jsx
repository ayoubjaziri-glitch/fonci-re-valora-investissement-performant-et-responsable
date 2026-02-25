import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import {
  Menu,
  X,
  Phone,
  Mail,
  Building2,
  ChevronRight } from
'lucide-react';
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const navigation = [
  { name: 'Accueil', page: 'Home' },
  { name: 'Stratégie & Performance', page: 'StrategyPerformance' },
  { name: 'Nos Services', page: 'Services' },
  { name: 'Notre histoire', page: 'Equipe' },
  { name: 'Écosystème', page: 'Partenaires' },
  { name: 'Durabilité', page: 'Durabilite' },
  { name: 'Réalisations', page: 'Realisations' }];


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/42737eb60_logosansar.png"
                alt="La Foncière Patrimoniale" className="rounded-[10px] h-24 w-auto" />


            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((item) =>
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`text-sm font-medium transition-colors ${
                currentPageName === item.page ?
                'text-amber-600' :
                'text-slate-600 hover:text-slate-900'}`
                }>

                  {item.name}
                </Link>
              )}
            </nav>

            {/* CTA + Mobile Menu */}
            <div className="flex items-center gap-4">
              <Link to={createPageUrl("Contact")} className="hidden md:block">
                <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
                  Nous contacter
                </Button>
              </Link>
              <Link to={createPageUrl("EspaceAssocie")} className="hidden md:block">
                <Button variant="outline" className="border-[#C9A961] text-[#C9A961] hover:bg-[#C9A961]/10 font-semibold">
                  Espace Associés
                </Button>
              </Link>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-900">

                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen &&
        <div className="lg:hidden bg-white border-t border-slate-100">
            <div className="px-6 py-4 space-y-2">
              {navigation.map((item) =>
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between py-3 border-b border-slate-100 ${
              currentPageName === item.page ?
              'text-amber-600' :
              'text-slate-900'}`
              }>

                  {item.name}
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </Link>
            )}
              <Link
              to={createPageUrl("EspaceAssocie")}
              onClick={() => setMobileMenuOpen(false)}
              className="block pt-4">

                <Button className="w-full bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
                  Espace Associés
                </Button>
              </Link>
            </div>
          </div>
        }
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="bg-slate-900 mb-6">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/42737eb60_logosansar.png"
                  alt="La Foncière Patrimoniale"
                  className="h-20 w-auto mb-4" />

              </div>
              <p className="text-white/60 mb-6 max-w-sm">
                Foncière résidentielle dédiée à l'acquisition, à la réhabilitation BBC et à la valorisation 
                d'immeubles présentant un potentiel de création de valeur au sein de marchés résidentiels dynamiques.
              </p>
              <p className="text-white/40 text-sm">
                Groupe Auvergne et Patrimoine — Fondé en 2008
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2">
                {navigation.map((item) =>
                <li key={item.page}>
                    <Link
                    to={createPageUrl(item.page)}
                    className="text-white/60 hover:text-[#C9A961] transition-colors text-sm">

                      {item.name}
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:ayoubjaziri@gmail.com" className="flex items-center gap-2 text-white/60 hover:text-[#C9A961] transition-colors text-sm">
                    <Mail className="h-4 w-4" />
                    ayoubjaziri@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:+33758736580" className="flex items-center gap-2 text-white/60 hover:text-[#C9A961] transition-colors text-sm">
                    <Phone className="h-4 w-4" />
                    +33 7 58 73 65 80
                  </a>
                </li>
                <li className="text-white/60 text-sm">
                  16 Rue de la Laure<br />03200 Vichy
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
              <p className="text-white/40 text-sm">
                © 2024 La Foncière Patrimoniale. Tous droits réservés.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to={createPageUrl("MentionsLegales")} className="text-white/40 hover:text-white/70 text-sm transition-colors">
                  Mentions légales
                </Link>
                <Link to={createPageUrl("PolitiqueConfidentialite")} className="text-white/40 hover:text-white/70 text-sm transition-colors">
                  Politique de confidentialité
                </Link>
              </div>
            </div>
            


          </div>
        </div>
      </footer>
    </div>);

}