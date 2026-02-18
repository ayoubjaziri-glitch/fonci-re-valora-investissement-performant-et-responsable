import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { 
  Menu, 
  X, 
  Phone, 
  Mail,
  Building2,
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Accueil', page: 'Home' },
    { name: 'Stratégie', page: 'Strategy' },
    { name: 'Durabilité', page: 'Services' },
    { name: 'Performance', page: 'Performance' },
    { name: 'Équipe', page: 'Team' },
    { name: 'Contact', page: 'Contact' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-amber-500" />
              </div>
              <div className="hidden sm:block">
                <p className="text-slate-900 font-serif text-lg leading-tight">La Foncière</p>
                <p className="text-amber-600 text-xs tracking-wider uppercase">Patrimoniale</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`text-sm font-medium transition-colors ${
                    currentPageName === item.page 
                      ? 'text-amber-600' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CTA + Mobile Menu */}
            <div className="flex items-center gap-4">
              <Link to={createPageUrl("Contact")} className="hidden md:block">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold">
                  Devenir associé
                </Button>
              </Link>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-900"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100">
            <div className="px-6 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 border-b border-slate-100 ${
                    currentPageName === item.page 
                      ? 'text-amber-600' 
                      : 'text-slate-900'
                  }`}
                >
                  {item.name}
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </Link>
              ))}
              <Link 
                to={createPageUrl("Contact")}
                onClick={() => setMobileMenuOpen(false)}
                className="block pt-4"
              >
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold">
                  Devenir associé
                </Button>
              </Link>
            </div>
          </div>
        )}
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
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-slate-900" />
                </div>
                <div>
                  <p className="text-white font-serif text-lg leading-tight">La Foncière</p>
                  <p className="text-amber-500 text-xs tracking-wider uppercase">Patrimoniale</p>
                </div>
              </div>
              <p className="text-white/60 mb-6 max-w-sm">
                Foncière résidentielle spécialisée dans l'acquisition, la rénovation BBC et la valorisation 
                d'immeubles à fort potentiel dans les zones tendues.
              </p>
              <p className="text-white/40 text-sm">
                Groupe Auvergne et Patrimoine — Fondé en 2008
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.page}>
                    <Link
                      to={createPageUrl(item.page)}
                      className="text-white/60 hover:text-amber-500 transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:ayoubjaziri@gmail.com" className="flex items-center gap-2 text-white/60 hover:text-amber-500 transition-colors text-sm">
                    <Mail className="h-4 w-4" />
                    ayoubjaziri@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:+33758736580" className="flex items-center gap-2 text-white/60 hover:text-amber-500 transition-colors text-sm">
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

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © 2024 La Foncière Patrimoniale. Tous droits réservés.
            </p>
            <p className="text-white/40 text-xs text-center md:text-right max-w-lg">
              Ce document est à caractère promotionnel et ne constitue pas un conseil en investissement.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}