import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Settings, Image, Users, BarChart3, Newspaper, Building2, Rocket, MapPin, LogOut, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import des sections existantes
import GestionPhotos from './GestionPhotos';
import GererAcces from './GererAcces';
import AdminEspaceAssocie from './AdminEspaceAssocie';

// ─── Mot de passe admin ─────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'ValorAdmin2026!';

// ─── Login Screen ───────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', '1');
      onLogin();
    } else {
      setError('Mot de passe incorrect');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A192F] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#1A3A52] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-[#C9A961]" />
            </div>
            <h1 className="text-2xl font-serif text-[#1A3A52] mb-1">Back-Office Admin</h1>
            <p className="text-slate-500 text-sm">Foncière Valora — Accès restreint</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe administrateur</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="pl-10 pr-10"
                  placeholder="••••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-[#1A3A52] hover:bg-[#2A4A6F] text-white py-6 font-semibold">
              Accéder au back-office
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Admin ──────────────────────────────────────────────────────────────
export default function AdminBackOffice() {
  const [isAuth, setIsAuth] = useState(() => sessionStorage.getItem('admin_auth') === '1');

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuth(false);
  };

  if (!isAuth) {
    return <AdminLogin onLogin={() => setIsAuth(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-[#1A3A52] border-b border-[#0A192F] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-[#C9A961]" />
            <div>
              <h1 className="text-lg font-serif text-white">Back-Office Admin</h1>
              <p className="text-white/50 text-xs">Foncière Valora</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline"
            className="border-white/20 text-white hover:bg-white/10 gap-2">
            <LogOut className="h-4 w-4" /> Déconnexion
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="photos">
          <TabsList className="flex flex-wrap gap-1 h-auto bg-white border border-slate-200 p-2 rounded-xl mb-8 shadow-sm">
            <TabsTrigger value="photos" className="flex items-center gap-2 text-sm">
              <Image className="h-4 w-4" /> Photos & Carte
            </TabsTrigger>
            <TabsTrigger value="acces" className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" /> Accès Associés
            </TabsTrigger>
            <TabsTrigger value="kpis" className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4" /> KPIs & Métriques
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex items-center gap-2 text-sm">
              <Newspaper className="h-4 w-4" /> Documents & Actus
            </TabsTrigger>
            <TabsTrigger value="biens" className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4" /> Biens & Acquisitions
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="flex items-center gap-2 text-sm">
              <Rocket className="h-4 w-4" /> Roadmap
            </TabsTrigger>
          </TabsList>

          <TabsContent value="photos">
            <GestionPhotos embedded />
          </TabsContent>

          <TabsContent value="acces">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <GererAcces embedded />
            </div>
          </TabsContent>

          <TabsContent value="kpis">
            <EspaceAssocieTabWrapper tab="kpis" />
          </TabsContent>

          <TabsContent value="docs">
            <EspaceAssocieTabWrapper tab="docs_actu" />
          </TabsContent>

          <TabsContent value="biens">
            <EspaceAssocieTabWrapper tab="acq" />
          </TabsContent>

          <TabsContent value="roadmap">
            <EspaceAssocieTabWrapper tab="roadmap" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Wrapper pour réutiliser AdminEspaceAssocie par onglet
function EspaceAssocieTabWrapper({ tab }) {
  return <AdminEspaceAssocie defaultTab={tab} embedded />;
}