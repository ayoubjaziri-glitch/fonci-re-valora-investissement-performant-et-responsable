import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Lock, Eye, EyeOff, Settings, Image, Users, BarChart3, Newspaper,
  Building2, Rocket, MapPin, LogOut, Shield, LayoutDashboard,
  FileText, Mail, TrendingUp, Euro, MessageSquare, CheckCircle2,
  Clock, AlertCircle, ChevronRight, Globe, Phone, Star, Trash2, ImageIcon, Wand2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import GererAcces from './GererAcces';
import AdminEspaceAssocie from './AdminEspaceAssocie';
import AdminEquipe from '../components/admin/AdminEquipe';
import AdminBlog from '../components/admin/AdminBlog';
import AdminLeveeFonds from '../components/admin/AdminLeveeFonds';
import AdminRealisations from '../components/admin/AdminRealisations';
import AdminRealisationsPlus from '../components/admin/AdminRealisationsPlus';
import AdminAcces from '../components/admin/AdminAcces';
import GestionPhotos from './GestionPhotos';
import AdminSections from '../components/admin/AdminSections';
import AdminContenu from '../components/admin/AdminContenu';
import AIPageGenerator from '../components/admin/AIPageGenerator';
import AdminVisiteurs from '../components/admin/AdminVisiteurs';

// ─── Login ───────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Vérifier les comptes admin en base
    const admins = await base44.entities.AccesAdmin.list();
    const match = admins.find(
      (a) => a.actif && a.email === email.trim() && a.password === password
    );

    if (match) {
      sessionStorage.setItem('admin_auth', '1');
      onLogin();
    } else {
      setError('Identifiants incorrects ou compte désactivé');
      setPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A192F] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input type="email" value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="pl-10" placeholder="admin@example.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="pl-10 pr-10" placeholder="••••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}
            <Button type="submit" disabled={loading} className="w-full bg-[#1A3A52] hover:bg-[#2A4A6F] text-white py-6 font-semibold">
              {loading ? 'Vérification...' : 'Accéder au back-office'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Dashboard Overview ───────────────────────────────────────────────────────
function DashboardSection() {
  const { data: contacts = [] } = useQuery({ queryKey: ['contacts'], queryFn: () => base44.entities.ContactRequest.list('-created_date', 100) });
  const { data: docs = [] } = useQuery({ queryKey: ['docs-associe'], queryFn: () => base44.entities.DocumentAssocie.list() });
  const { data: actu = [] } = useQuery({ queryKey: ['actu-associe'], queryFn: () => base44.entities.ActualiteAssocie.list() });
  const { data: acq = [] } = useQuery({ queryKey: ['acq-associe'], queryFn: () => base44.entities.AcquisitionAssocie.list() });
  const { data: accesAssocies = [] } = useQuery({ queryKey: ['acces-associes'], queryFn: () => base44.entities.AccesAssocie.list() });

  const nonTraites = contacts.filter(c => !c.email_envoye);

  const stats = [
    { label: 'Demandes de contact', value: contacts.length, sub: `${nonTraites.length} non traitées`, icon: MessageSquare, color: 'bg-blue-50 text-blue-600', alert: nonTraites.length > 0 },
    { label: 'Documents', value: docs.length, sub: `${docs.filter(d => d.type_acces === 'privé').length} privés`, icon: FileText, color: 'bg-amber-50 text-amber-600' },
    { label: 'Actualités', value: actu.length, sub: 'Espace associé', icon: Newspaper, color: 'bg-purple-50 text-purple-600' },
    { label: 'Biens / Chantiers', value: acq.length, sub: `${acq.filter(a => a.statut === 'Travaux').length} en travaux`, icon: Building2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Associés actifs', value: accesAssocies.filter(a => a.actif).length, sub: `${accesAssocies.length} total`, icon: Users, color: 'bg-indigo-50 text-indigo-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-[#1A3A52] mb-1">Vue d'ensemble</h2>
        <p className="text-slate-500 text-sm">Tableau de bord global du back-office</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((s, i) => (
          <div key={i} className={`bg-white rounded-2xl p-5 border ${s.alert ? 'border-red-200 shadow-red-100 shadow-md' : 'border-slate-200'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold text-[#1A3A52]">{s.value}</div>
            <div className="text-sm font-medium text-slate-700 mt-0.5">{s.label}</div>
            <div className={`text-xs mt-1 ${s.alert ? 'text-red-500 font-semibold' : 'text-slate-400'}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Dernières demandes */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-[#1A3A52] mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[#C9A961]" />
          Dernières demandes de contact
          {nonTraites.length > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{nonTraites.length} nouvelle{nonTraites.length > 1 ? 's' : ''}</span>}
        </h3>
        <div className="space-y-3">
          {contacts.slice(0, 5).map(c => (
            <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-sm text-slate-900">{c.prenom} {c.nom}</p>
                <p className="text-xs text-slate-500">{c.email} • {c.type_demande || 'Contact général'}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${c.email_envoye ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                {c.email_envoye ? 'Traité' : 'En attente'}
              </span>
            </div>
          ))}
          {contacts.length === 0 && <p className="text-slate-400 text-sm text-center py-4">Aucune demande</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Demandes de Contact ──────────────────────────────────────────────────────
function DemandesContactSection() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState('tous');

  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => base44.entities.ContactRequest.list('-created_date', 200),
  });

  const markDoneMutation = useMutation({
    mutationFn: (id) => base44.entities.ContactRequest.update(id, { email_envoye: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ContactRequest.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  });

  const filtered = contacts.filter(c => {
    if (filter === 'traite') return c.email_envoye;
    if (filter === 'non_traite') return !c.email_envoye;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#1A3A52]">Demandes de Contact</h2>
          <p className="text-slate-500 text-sm">{contacts.filter(c => !c.email_envoye).length} non traitées sur {contacts.length}</p>
        </div>
        <div className="flex gap-2">
          {[['tous','Toutes'],['non_traite','Non traitées'],['traite','Traitées']].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === v ? 'bg-[#1A3A52] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(c => (
          <div key={c.id} className={`bg-white rounded-2xl border p-5 ${!c.email_envoye ? 'border-orange-200' : 'border-slate-200'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-[#1A3A52] rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {c.prenom?.[0]}{c.nom?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{c.prenom} {c.nom}</p>
                    <p className="text-xs text-slate-500">{c.email} {c.telephone && `• ${c.telephone}`}</p>
                  </div>
                  {c.type_demande && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{c.type_demande}</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${!c.email_envoye ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {!c.email_envoye ? '⏳ En attente' : '✓ Traité'}
                  </span>
                </div>
                <div className="ml-12 bg-slate-50 rounded-xl p-3 text-sm text-slate-700">
                  {c.message}
                </div>
                <div className="ml-12 mt-2 flex items-center gap-4">
                  <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-xs text-[#C9A961] hover:text-[#B8994F] font-medium">
                    <Mail className="h-3.5 w-3.5" /> Répondre par email
                  </a>
                  {c.telephone && (
                    <a href={`tel:${c.telephone}`} className="flex items-center gap-1 text-xs text-[#1A3A52] hover:text-[#2A4A6F] font-medium">
                      <Phone className="h-3.5 w-3.5" /> Appeler
                    </a>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                {!c.email_envoye && (
                  <Button size="sm" onClick={() => markDoneMutation.mutate(c.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Marquer traité
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => { if (confirm('Supprimer ?')) deleteMutation.mutate(c.id); }}
                  className="text-red-500 border-red-200 hover:bg-red-50 text-xs">
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Supprimer
                </Button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400">Aucune demande dans cette catégorie</div>}
      </div>
    </div>
  );
}

// ─── Navigation items ─────────────────────────────────────────────────────────
const navGroups = [
  {
    label: 'Général',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'contacts', label: 'Demandes de contact', icon: MessageSquare, badge: true },
      { id: 'visiteurs', label: 'Statistiques visiteurs', icon: Globe },
    ]
  },
  {
    label: 'Contenu du Site',
    items: [
      { id: 'photos', label: 'Photos & Média', icon: Image },
      { id: 'contenu', label: 'Textes & Contenu', icon: FileText },
      { id: 'sections', label: 'Ajouter une section', icon: LayoutDashboard },
      { id: 'equipe', label: 'Équipe', icon: Users },
      { id: 'realisations', label: 'Nos Biens', icon: Building2 },
      { id: 'blog', label: 'Blog & Articles', icon: Newspaper },
      { id: 'levees', label: 'Levées de Fonds', icon: TrendingUp },
    ]
  },
  {
    label: 'Espace Associés',
    items: [
      { id: 'acces', label: 'Accès Associés', icon: Users },
      { id: 'admin', label: 'Accès Admin', icon: Shield },
      { id: 'kpis', label: 'KPIs & Métriques', icon: BarChart3 },
      { id: 'docs', label: 'Documents', icon: FileText },
      { id: 'actu', label: 'Actualités', icon: Newspaper },
      { id: 'biens', label: 'Biens & Acquisitions', icon: Building2 },
      { id: 'roadmap', label: 'Roadmap', icon: Rocket },
    ]
  },
];

// ─── Main Admin ──────────────────────────────────────────────────────────────
export default function AdminBackOffice() {
  const [isAuth, setIsAuth] = useState(() => sessionStorage.getItem('admin_auth') === '1');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPageGenerator, setShowPageGenerator] = useState(false);

  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => base44.entities.ContactRequest.list('-created_date', 200),
    enabled: isAuth,
  });
  const nonTraites = contacts.filter(c => !c.email_envoye).length;

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuth(false);
  };

  if (!isAuth) return <AdminLogin onLogin={() => setIsAuth(true)} />;

  const tabTitles = {
    dashboard: 'Dashboard',
    contacts: 'Demandes de Contact',
    visiteurs: 'Statistiques Visiteurs',
    photos: 'Photos & Média',
    contenu: 'Textes & Contenu du site',
    sections: 'Ajouter une section',
    equipe: 'Équipe',
    blog: 'Blog & Articles',
    levees: 'Levées de Fonds',
    realisations: 'Nos Biens & Réalisations',
    acces: 'Accès Associés',
    admin: 'Accès Admin',
    kpis: 'KPIs & Métriques',
    docs: 'Documents',
    actu: 'Actualités',
    biens: 'Biens & Acquisitions',
    roadmap: 'Roadmap',
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F2537] flex-shrink-0 flex flex-col min-h-screen sticky top-0 h-screen overflow-y-auto">
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C9A961] rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-[#1A3A52]" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Back-Office</p>
              <p className="text-white/40 text-xs">Foncière Valora</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-5 pt-4">
          {navGroups.map(group => (
            <div key={group.label}>
              <p className="text-white/30 text-xs font-semibold uppercase tracking-widest px-3 mb-2">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const isActive = activeTab === item.id;
                  const badgeCount = item.badge ? nonTraites : 0;
                  return (
                    <button key={item.id} onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-[#C9A961] text-[#1A3A52]' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {badgeCount > 0 && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-[#1A3A52] text-white' : 'bg-red-500 text-white'}`}>{badgeCount}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/10 transition-all">
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3 sticky top-0 z-40">
          <div className="text-sm text-slate-400">Back-Office</div>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <div className="text-sm font-semibold text-[#1A3A52] flex-1">{tabTitles[activeTab]}</div>

        </div>

        {/* Content */}
        <div className="flex-1 p-6 lg:p-8">
          {activeTab === 'dashboard' && <DashboardSection />}
          {activeTab === 'contacts' && <DemandesContactSection />}
          {activeTab === 'visiteurs' && <AdminVisiteurs />}
          {activeTab === 'photos' && <GestionPhotos embedded />}
          {activeTab === 'contenu' && <AdminContenu />}
          {activeTab === 'sections' && <AdminSections />}
          {activeTab === 'equipe' && <AdminEquipe />}
          {activeTab === 'blog' && <AdminBlog />}
          {activeTab === 'levees' && <AdminLeveeFonds />}
          {activeTab === 'realisations' && <AdminRealisationsPlus />}
          {activeTab === 'acces' && (
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
             <GererAcces embedded />
           </div>
          )}
          {activeTab === 'admin' && (
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
             <AdminAcces />
           </div>
          )}
          {activeTab === 'kpis' && <EspaceAssocieTabWrapper tab="kpis" />}
          {activeTab === 'docs' && <EspaceAssocieTabWrapper tab="docs" />}
          {activeTab === 'actu' && <EspaceAssocieTabWrapper tab="actu" />}
          {activeTab === 'biens' && <EspaceAssocieTabWrapper tab="acq" />}
          {activeTab === 'roadmap' && <EspaceAssocieTabWrapper tab="roadmap" />}
        </div>
      </div>

      {/* AI Page Generator Modal */}
      {showPageGenerator && <AIPageGenerator onClose={() => setShowPageGenerator(false)} />}
    </div>
  );
}

function EspaceAssocieTabWrapper({ tab }) {
  return <AdminEspaceAssocie defaultTab={tab} embedded />;
}