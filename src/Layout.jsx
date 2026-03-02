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
import { useQuery } from "@tanstack/react-query";
import { base44 } from '@/api/base44Client';

function LogoImage() {
  const { data: images = [] } = useQuery({
    queryKey: ['site-images'],
    queryFn: () => base44.entities.SiteImage.list(),
    initialData: [],
  });

  const logoImage = images.find(img => img.key === 'logo');
  const logoUrl = logoImage?.url || 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699460f1b03f6285dc8513a7/42737eb60_logosansar.png';

  return (
    <img
      src={logoUrl}
      alt="La Foncière Patrimoniale" 
      className="rounded-[10px] h-24 w-auto" 
    />
  );
}

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
  { name: 'Nos biens', page: 'Realisations' }];


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <LogoImage />


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
                <LogoImage />
              </div>
              <p className="text-white/60 mb-6 max-w-sm">
                Foncière résidentielle dédiée à l'acquisition, à la réhabilitation BBC et à la valorisation 
                d'immeubles présentant un potentiel de création de valeur au sein de marchés résidentiels dynamiques.
              </p>
              <p className="text-white/40 text-sm mb-4">
                Groupe Auvergne et Patrimoine — Fondé en 2008
              </p>
              
              {/* Réseaux sociaux - MODIFIEZ LES URLS CI-DESSOUS */}
              <div className="flex items-center gap-4">
                <a 
                  href="https://www.linkedin.com/company/la-fonciere-patrimoniale" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-[#C9A961] rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/lafoncierepatrimoniale" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-[#C9A961] rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
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

              {/* Réseaux sociaux */}
              <div className="flex items-center gap-3 mt-6">
                <a 
                  href="https://www.linkedin.com/company/la-fonciere-patrimoniale" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-[#C9A961] rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/lafoncierepatrimoniale" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-[#C9A961] rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
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