import React, { useState } from 'react';
import { Download, FileCode, Database, Server, Package, Copy, Check, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Fichiers générés ─────────────────────────────────────────────────────────

const SUPABASE_CLIENT = `// lib/supabaseClient.js
// Remplace api/base44Client.js — 100% indépendant
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Helper CRUD pour conserver la même API qu'avec Base44
// Usage : import { db } from '@/lib/supabaseClient'
// db.Tache.list()  db.Tache.create({})  db.Tache.update(id, {})  db.Tache.delete(id)
function makeEntity(tableName) {
  return {
    async list(orderBy = 'created_at', limit = 500) {
      const col = orderBy.replace(/^-/, '');
      const asc = !orderBy.startsWith('-');
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order(col, { ascending: asc })
        .limit(limit);
      if (error) throw error;
      return data;
    },
    async filter(filters = {}, orderBy = '-created_at', limit = 500) {
      const col = orderBy.replace(/^-/, '');
      const asc = !orderBy.startsWith('-');
      let query = supabase.from(tableName).select('*');
      Object.entries(filters).forEach(([k, v]) => { query = query.eq(k, v); });
      const { data, error } = await query.order(col, { ascending: asc }).limit(limit);
      if (error) throw error;
      return data;
    },
    async get(id) {
      const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    async create(payload) {
      const { data, error } = await supabase.from(tableName).insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    async update(id, payload) {
      const { data, error } = await supabase.from(tableName).update(payload).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    async delete(id) {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      return true;
    },
    async bulkCreate(items) {
      const { data, error } = await supabase.from(tableName).insert(items).select();
      if (error) throw error;
      return data;
    },
    subscribe(callback) {
      const channel = supabase
        .channel(\`realtime:\${tableName}\`)
        .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, (payload) => {
          const typeMap = { INSERT: 'create', UPDATE: 'update', DELETE: 'delete' };
          callback({ type: typeMap[payload.eventType], id: payload.new?.id || payload.old?.id, data: payload.new });
        })
        .subscribe();
      return () => supabase.removeChannel(channel);
    }
  };
}

// Toutes les entités du projet
export const db = {
  Tache: makeEntity('taches'),
  Projet: makeEntity('projets'),
  PageView: makeEntity('page_views'),
  ContactRequest: makeEntity('contact_requests'),
  InvestisseurCRM: makeEntity('investisseurs_crm'),
  ArticleBlog: makeEntity('articles_blog'),
  RealisationBien: makeEntity('realisations_biens'),
  MembreEquipe: makeEntity('membres_equipe'),
  LeveeFonds: makeEntity('levees_fonds'),
  SiteImage: makeEntity('site_images'),
  SiteContent: makeEntity('site_content'),
  SiteSection: makeEntity('site_sections'),
  ContactConfig: makeEntity('contact_config'),
  AccesAdmin: makeEntity('acces_admin'),
  AccesAssocie: makeEntity('acces_associes'),
  DocumentAssocie: makeEntity('documents_associes'),
  AcquisitionAssocie: makeEntity('acquisitions_associes'),
  MapLocation: makeEntity('map_locations'),
  ActualiteAssocie: makeEntity('actualites_associes'),
  EspaceAssocieConfig: makeEntity('espace_associe_config'),
  RoadmapAssocie: makeEntity('roadmap_associes'),
};
`;

const AUTH_CONTEXT = `// lib/AuthContext.jsx
// Version sans Base44 — authentification custom via Supabase Auth (optionnel)
// Ce projet utilisant une auth admin custom (AccesAdmin table), AuthContext est simplifié
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // L'auth admin est gérée via sessionStorage dans AdminBackOffice (AccesAdmin table)
  // Pas d'auth utilisateur publique requise pour ce site vitrine
  const [user] = useState(null);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: false,
      isLoadingAuth: false,
      isLoadingPublicSettings: false,
      authError: null,
      appPublicSettings: null,
      logout: () => {},
      navigateToLogin: () => {},
      checkAppState: () => {},
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
`;

const NAVIGATION_TRACKER = `// lib/NavigationTracker.jsx
// Version sans Base44 — tracking via Supabase directement
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '@/lib/supabaseClient';

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
  const currentViewId = useRef(null);
  const enterTime = useRef(null);
  const lastPath = useRef(null);

  const updatePreviousTime = () => {
    if (currentViewId.current && enterTime.current) {
      const seconds = Math.round((Date.now() - enterTime.current) / 1000);
      if (seconds > 2) {
        db.PageView.update(currentViewId.current, { time_on_page: seconds }).catch(() => {});
      }
      currentViewId.current = null;
      enterTime.current = null;
    }
  };

  useEffect(() => {
    const pathname = location.pathname;
    if (lastPath.current === pathname) return;
    updatePreviousTime();
    lastPath.current = pathname;
    if (pathname.startsWith('/admin') || pathname.startsWith('/EspaceAssocie')) return;

    const label = PAGE_LABELS[pathname] || pathname.replace('/', '') || 'Accueil';
    enterTime.current = Date.now();

    // Détection mots-clés (UTM + moteurs de recherche)
    let searchKeywords = '';
    const currentUrl = new URL(window.location.href);
    const utmTerm = currentUrl.searchParams.get('utm_term');
    const utmContent = currentUrl.searchParams.get('utm_content');
    const utmSource = currentUrl.searchParams.get('utm_source');
    const utmMedium = currentUrl.searchParams.get('utm_medium');
    const utmCampaign = currentUrl.searchParams.get('utm_campaign');

    if (utmTerm) searchKeywords = utmTerm;
    else if (utmContent) searchKeywords = utmContent;

    if (!searchKeywords && document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        const host = refUrl.hostname;
        if (/google\\./i.test(host)) searchKeywords = refUrl.searchParams.get('q') || '';
        else if (/bing\\.com/i.test(host)) searchKeywords = refUrl.searchParams.get('q') || '';
        else if (/yahoo\\.com/i.test(host)) searchKeywords = refUrl.searchParams.get('p') || refUrl.searchParams.get('q') || '';
        else if (/duckduckgo\\.com/i.test(host)) searchKeywords = refUrl.searchParams.get('q') || '';
        else if (/ecosia\\.org/i.test(host)) searchKeywords = refUrl.searchParams.get('q') || '';
        else if (/qwant\\.com/i.test(host)) searchKeywords = refUrl.searchParams.get('q') || '';
        else if (/yandex\\./i.test(host)) searchKeywords = refUrl.searchParams.get('text') || '';
        else searchKeywords = refUrl.searchParams.get('q') || refUrl.searchParams.get('query') || '';
      } catch (e) {}
    }

    if (searchKeywords) sessionStorage.setItem('_valora_kw', searchKeywords);
    else searchKeywords = sessionStorage.getItem('_valora_kw') || '';

    const utmLabel = [utmSource, utmMedium, utmCampaign].filter(Boolean).join(' / ');
    if (utmLabel && !searchKeywords) searchKeywords = \`[Campagne] \${utmLabel}\`;

    const saveView = (geo = {}) => {
      db.PageView.create({
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

    const geoCache = sessionStorage.getItem('_valora_geo');
    if (geoCache) {
      saveView(JSON.parse(geoCache));
    } else {
      fetch('https://ip-api.com/json/?fields=status,country,city,lat,lon,query')
        .then(r => r.json())
        .then(geo => {
          if (geo.status === 'success') {
            sessionStorage.setItem('_valora_geo', JSON.stringify(geo));
            saveView(geo);
          } else throw new Error();
        })
        .catch(() => {
          fetch('https://ipapi.co/json/')
            .then(r => r.json())
            .then(geo => {
              const n = { country: geo.country_name, city: geo.city, lat: geo.latitude, lon: geo.longitude, query: geo.ip };
              sessionStorage.setItem('_valora_geo', JSON.stringify(n));
              saveView(n);
            })
            .catch(() => saveView());
        });
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleUnload = () => updatePreviousTime();
    const handleVisibility = () => { if (document.visibilityState === 'hidden') updatePreviousTime(); };
    window.addEventListener('beforeunload', handleUnload);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return null;
}
`;

const ENV_FILE = `# .env.local — Foncière Valora (Sans Base44)
# Copier ce fichier en .env.local, remplir les valeurs, ne jamais committer

# Supabase (obligatoire)
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email via Resend (pour les Edge Functions — alertes tâches)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# OpenAI (si vous réactivez les fonctions IA)
# OPENAI_API_KEY=sk-proj-xxxx
`;

const SQL_SCHEMA = `-- ============================================================
-- FONCIÈRE VALORA — Schéma Supabase PostgreSQL
-- Exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

create extension if not exists "pgcrypto";

-- Tâches
create table if not exists taches (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(), updated_at timestamptz default now(),
  created_by text, titre text not null, description text,
  statut text default 'A faire', priorite text default 'Moyenne',
  projet text, section text, assigne_a text, responsable_email text,
  date_debut date, date_echeance date, tags text, sous_taches text,
  commentaires text, pieces_jointes text, ordre integer default 0,
  est_jalon boolean default false, dependances text,
  avancement integer default 0 check (avancement between 0 and 100)
);

-- Projets
create table if not exists projets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(), updated_at timestamptz default now(),
  nom text not null, description text, couleur text default '#C9A961',
  icone text default '📁', statut text default 'Actif',
  sections text, date_debut date, date_fin date, membres text
);

-- Analytics visiteurs
create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  page text not null, path text, session_id text, user_agent text,
  referrer text, search_keywords text, time_on_page numeric,
  country text, city text, lat numeric, lng numeric, ip text
);

-- Demandes de contact
create table if not exists contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  prenom text, nom text, email text, telephone text,
  type_demande text, message text, email_envoye boolean default false
);

-- CRM Investisseurs
create table if not exists investisseurs_crm (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(), updated_at timestamptz default now(),
  prenom text, nom text, email text, telephone text,
  statut text default 'Prospect', montant_investi numeric default 0,
  date_prochain_contact date, notes text, source text, tags text
);

-- Blog
create table if not exists articles_blog (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(), updated_at timestamptz default now(),
  titre text not null, slug text unique, extrait text, contenu text,
  categorie text default 'Investissement', auteur text default 'La Foncière Valora',
  image_url text, temps_lecture text, date_publication date, publie boolean default true
);

-- Réalisations / Biens
create table if not exists realisations_biens (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  titre text not null, location text, lat numeric, lng numeric, annee text,
  image_avant text, image_apres text, surface text, logements text,
  investissement text, dpe_avant text, dpe_apres text,
  description_avant text, description_apres text, travaux text,
  rendement_brut text, plus_value text, ordre integer default 0, actif boolean default true
);

-- Équipe
create table if not exists membres_equipe (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  nom text not null, role text, focus text, description text, experience text,
  image_url text, type text default 'membre', ordre integer default 0, actif boolean default true
);

-- Levées de fonds
create table if not exists levees_fonds (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  nom text not null, objectif text, collecte text, avancement numeric default 0,
  date_ouverture date, date_cloture date, ticket_min text, rendement_cible text,
  description text, statut text default 'Préparation', nb_investisseurs numeric default 0,
  horizon text default '5 ans', effet_levier text, valorisation_an5 text,
  sous_titre text, actif boolean default true
);

-- Images du site
create table if not exists site_images (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  key text unique not null, url text, description text, category text
);

-- Contenu éditorial
create table if not exists site_content (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  updated_at timestamptz default now(), cle text unique not null,
  valeur text, page text, label text, type_champ text default 'texte'
);

-- Sections dynamiques
create table if not exists site_sections (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  page text, titre text, sous_titre text, contenu text, image_url text,
  type_section text default 'texte', ordre integer default 0, actif boolean default true
);

-- Config contact
create table if not exists contact_config (
  id uuid primary key default gen_random_uuid(),
  cle text unique not null, valeur text, description text
);

-- Accès admin
create table if not exists acces_admin (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  email text not null, password text not null, nom text, actif boolean default true
);

-- Accès associés
create table if not exists acces_associes (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  email text not null, password text not null, nom text, actif boolean default true
);

-- Documents associés
create table if not exists documents_associes (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  nom text not null, categorie text, type_acces text default 'privé',
  file_url text, taille text, date_document date, actif boolean default true
);

-- Acquisitions
create table if not exists acquisitions_associes (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  ville text, prix text, lots numeric, dpe text, statut text default 'Négociation',
  avancement numeric default 0, livraison text, type text, valeur text, occupation text
);

-- Carte
create table if not exists map_locations (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  name text not null, lat numeric, lng numeric, adresse text,
  image_url text, logements text, dpe text, actif boolean default true
);

-- Actualités associés
create table if not exists actualites_associes (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  titre text not null, description text, type text default 'note',
  date_publication date, actif boolean default true
);

-- Config espace associés
create table if not exists espace_associe_config (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  cle text unique not null, section text, donnees text
);

-- Roadmap
create table if not exists roadmap_associes (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  etape text not null, date_prevue text, statut text default 'planifie',
  avancement numeric default 0, ordre numeric
);

-- Trigger updated_at automatique
create or replace function update_updated_at()
returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'taches_updated_at') then
    create trigger taches_updated_at before update on taches for each row execute function update_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'articles_updated_at') then
    create trigger articles_updated_at before update on articles_blog for each row execute function update_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'investisseurs_updated_at') then
    create trigger investisseurs_updated_at before update on investisseurs_crm for each row execute function update_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'site_content_updated_at') then
    create trigger site_content_updated_at before update on site_content for each row execute function update_updated_at();
  end if;
end $$;

-- RLS : activer pour les tables sensibles si vous utilisez Supabase Auth
-- alter table acces_admin enable row level security;
-- alter table investisseurs_crm enable row level security;
`;

const EDGE_OVERDUE = `// supabase/functions/check-overdue-taches/index.ts
// supabase functions deploy check-overdue-taches
// Cron : 0 8 * * * (Supabase Dashboard > Edge Functions > Cron)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_KEY')!);
const RESEND_KEY = Deno.env.get('RESEND_API_KEY')!;

async function sendEmail(to: string, subject: string, html: string) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': \`Bearer \${RESEND_KEY}\`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'Foncière Valora <noreply@votre-domaine.fr>', to, subject, html })
  });
}

Deno.serve(async (_req) => {
  const { data: taches } = await supabase.from('taches').select('*').neq('statut', 'Terminé').not('responsable_email', 'is', null).not('date_echeance', 'is', null);
  const now = new Date(); now.setHours(0,0,0,0);
  let overdueCount = 0, reminderCount = 0;

  for (const t of taches ?? []) {
    const ech = new Date(t.date_echeance); ech.setHours(0,0,0,0);
    const diff = Math.ceil((ech.getTime() - now.getTime()) / 86400000);
    const emoji = { Urgente:'🔴', Haute:'🟠', Moyenne:'🟡', Basse:'⚪' }[t.priorite] ?? '';
    const echStr = new Date(t.date_echeance).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });

    if (diff < 0) {
      const j = Math.abs(diff);
      await sendEmail(t.responsable_email, \`⚠️ Tâche en retard (\${j}j) : \${t.titre}\`,
        \`<div style="font-family:Arial;max-width:600px;margin:0 auto"><div style="background:#1A3A52;padding:20px;text-align:center"><h2 style="color:#C9A961;margin:0">La Foncière Valora</h2></div><div style="background:white;padding:24px;border:1px solid #e2e8f0"><p style="color:#dc2626;font-weight:bold">⚠️ Tâche en retard de \${j} jour\${j>1?'s':''}</p><p><strong>\${t.titre}</strong></p><p>Projet : \${t.projet ?? 'Sans projet'} | Priorité : \${emoji} \${t.priorite} | Statut : \${t.statut}</p><p>Échéance prévue : <strong style="color:#dc2626">\${echStr}</strong></p><p>Avancement : \${t.avancement ?? 0}%</p></div></div>\`
      );
      overdueCount++;
    } else if (diff === 2 || diff === 1) {
      await sendEmail(t.responsable_email, \`🔔 Rappel échéance \${diff===1?'demain':'dans 2 jours'} : \${t.titre}\`,
        \`<div style="font-family:Arial;max-width:600px;margin:0 auto"><div style="background:#1A3A52;padding:20px;text-align:center"><h2 style="color:#C9A961;margin:0">La Foncière Valora</h2></div><div style="background:white;padding:24px;border:1px solid #e2e8f0"><p style="color:#d97706;font-weight:bold">🔔 Échéance \${diff===1?'demain':'dans 2 jours'}</p><p><strong>\${t.titre}</strong></p><p>Projet : \${t.projet ?? 'Sans projet'} | Priorité : \${emoji} \${t.priorite}</p><p>Échéance : <strong style="color:#d97706">\${echStr}</strong></p></div></div>\`
      );
      reminderCount++;
    }
  }
  return Response.json({ success: true, overdueCount, reminderCount });
});
`;

const EDGE_NOTIFY = `// supabase/functions/notify-responsable/index.ts
// supabase functions deploy notify-responsable
// Appelé depuis le frontend lors d'assignation / complétion de tâche
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_KEY')!);
const RESEND_KEY = Deno.env.get('RESEND_API_KEY')!;

Deno.serve(async (req) => {
  const { type, tacheId } = await req.json();
  const { data: rows } = await supabase.from('taches').select('*').eq('id', tacheId);
  const t = rows?.[0];
  if (!t) return Response.json({ error: 'Tâche introuvable' }, { status: 404 });
  if (!t.responsable_email) return Response.json({ skipped: true });

  const emoji = { Urgente:'🔴', Haute:'🟠', Moyenne:'🟡', Basse:'⚪' }[t.priorite] ?? '';
  const ech = t.date_echeance ? new Date(t.date_echeance).toLocaleDateString('fr-FR') : 'Non définie';
  const header = \`<div style="background:#1A3A52;padding:20px;text-align:center"><h2 style="color:#C9A961;margin:0">La Foncière Valora</h2></div>\`;

  const templates: Record<string,{subject:string,html:string}> = {
    assigned: {
      subject: \`📋 Nouvelle tâche : \${t.titre}\`,
      html: \`<div style="font-family:Arial;max-width:600px;margin:0 auto">\${header}<div style="background:white;padding:24px;border:1px solid #e2e8f0"><h3 style="color:#1A3A52">📋 Une tâche vous a été assignée</h3><p><strong>\${t.titre}</strong></p><p>\${t.description ?? ''}</p><p>Projet : \${t.projet ?? 'Sans projet'} | Priorité : \${emoji} \${t.priorite} | Échéance : \${ech}</p></div></div>\`
    },
    completed: {
      subject: \`✅ Tâche terminée : \${t.titre}\`,
      html: \`<div style="font-family:Arial;max-width:600px;margin:0 auto">\${header}<div style="background:white;padding:24px;border:1px solid #e2e8f0"><p style="color:#16a34a;font-weight:bold">✅ Tâche terminée !</p><p><strong>\${t.titre}</strong></p><p>Projet : \${t.projet} | Priorité : \${emoji} \${t.priorite}</p><p>Bravo ! 🎉</p></div></div>\`
    },
    overdue: {
      subject: \`⚠️ Tâche en retard : \${t.titre}\`,
      html: \`<div style="font-family:Arial;max-width:600px;margin:0 auto">\${header}<div style="background:white;padding:24px;border:1px solid #e2e8f0"><p style="color:#dc2626;font-weight:bold">⚠️ Tâche en retard</p><p><strong>\${t.titre}</strong></p><p>Statut : \${t.statut} | Avancement : \${t.avancement ?? 0}% | Échéance : \${ech}</p></div></div>\`
    },
  };

  const tpl = templates[type];
  if (!tpl) return Response.json({ error: 'Type inconnu' }, { status: 400 });

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': \`Bearer \${RESEND_KEY}\`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'Foncière Valora <noreply@votre-domaine.fr>', to: t.responsable_email, ...tpl })
  });

  return Response.json({ success: true, to: t.responsable_email, type });
});
`;

const VITE_CONFIG = `// vite.config.js — Version sans Base44
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
`;

const README = `# 🚀 Foncière Valora — Migration vers infrastructure indépendante

## Stack cible
- **Frontend** : React + Vite (inchangé)
- **Base de données** : Supabase (PostgreSQL)
- **Emails** : Resend (transactionnel)
- **Hébergement** : Vercel, Netlify, ou tout serveur statique

---

## Étapes de migration

### 1. Créer le projet Supabase
1. Aller sur [supabase.com](https://supabase.com) → New Project
2. Dans **SQL Editor** → coller le contenu de \`schema.sql\` → Run

### 2. Remplacer les fichiers
\`\`\`
src/lib/supabaseClient.js    ← remplace api/base44Client.js
src/lib/AuthContext.jsx      ← version simplifiée (auth custom via table)
src/lib/NavigationTracker.jsx ← utilise supabaseClient au lieu de base44
\`\`\`

Créer \`.env.local\` avec les variables Supabase.

### 3. Mettre à jour les imports dans tout le projet
\`\`\`bash
# Rechercher/remplacer dans tous les fichiers :
# "@/api/base44Client" → "@/lib/supabaseClient"
# base44.entities.Tache → db.Tache
# base44.entities.ArticleBlog → db.ArticleBlog
# (etc. pour chaque entité)
\`\`\`

### 4. Désinstaller le SDK Base44
\`\`\`bash
npm uninstall @base44/sdk @base44/vite-plugin
npm install @supabase/supabase-js
\`\`\`

Supprimer le plugin Base44 de vite.config.js → utiliser la version fournie.

### 5. Retirer AuthProvider Base44 dans App.jsx
L'AuthContext fourni est autonome — plus de dépendance à \`appParams\`.

### 6. Déployer les Edge Functions (alertes tâches)
\`\`\`bash
npm install -g supabase
supabase login
supabase link --project-ref VOTRE_REF
supabase functions deploy check-overdue-taches
supabase functions deploy notify-responsable
supabase secrets set RESEND_API_KEY=re_xxxx
\`\`\`

Configurer le cron dans Supabase Dashboard > Edge Functions > Schedules :
- Fonction : \`check-overdue-taches\`
- Schedule : \`0 8 * * *\` (chaque jour à 8h)

### 7. Exporter les données de Base44
Pour chaque table dans Base44 Admin → Export CSV → Importer dans Supabase Table Editor.

### 8. Déployer le frontend
\`\`\`bash
# Vercel
npm install -g vercel && vercel --prod

# Netlify
npm run build && netlify deploy --prod --dir dist

# Ou tout hébergeur statique (OVH, Ionos, etc.)
# Uploader le dossier dist/
\`\`\`

Configurer les variables d'env (\`VITE_SUPABASE_URL\`, \`VITE_SUPABASE_ANON_KEY\`) dans le dashboard de votre hébergeur.

---

## Résumé des coûts estimés

| Service | Plan gratuit | Notes |
|---------|-------------|-------|
| Supabase | 500 MB, 50k MAU | Largement suffisant au départ |
| Vercel / Netlify | Projets illimités | CDN mondial inclus |
| Resend | 3000 emails/mois | Suffisant pour les alertes |

**Coût total : 0€/mois** pour les volumes actuels.
`;

// ─── Fichiers disponibles ─────────────────────────────────────────────────────
const FILES = [
  {
    id: 'supabase_client',
    name: 'supabaseClient.js',
    path: 'src/lib/supabaseClient.js',
    label: 'Client Supabase + helper CRUD',
    icon: Database,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    desc: 'Remplace base44Client.js — toutes les entités mappées',
    content: SUPABASE_CLIENT,
  },
  {
    id: 'auth_context',
    name: 'AuthContext.jsx',
    path: 'src/lib/AuthContext.jsx',
    label: 'AuthContext simplifié',
    icon: FileCode,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    desc: 'Sans dépendance Base44 — auth admin via table SQL',
    content: AUTH_CONTEXT,
  },
  {
    id: 'nav_tracker',
    name: 'NavigationTracker.jsx',
    path: 'src/lib/NavigationTracker.jsx',
    label: 'NavigationTracker (Analytics)',
    icon: FileCode,
    color: 'text-violet-600 bg-violet-50 border-violet-200',
    desc: 'Tracking visiteurs via Supabase — même logique',
    content: NAVIGATION_TRACKER,
  },
  {
    id: 'env',
    name: '.env.local',
    path: '.env.local',
    label: 'Variables d\'environnement',
    icon: FileCode,
    color: 'text-slate-600 bg-slate-50 border-slate-200',
    desc: 'VITE_SUPABASE_URL, RESEND_API_KEY…',
    content: ENV_FILE,
  },
  {
    id: 'schema',
    name: 'schema.sql',
    path: 'supabase/schema.sql',
    label: 'Schéma SQL Supabase',
    icon: Database,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    desc: 'Toutes les tables + triggers updated_at',
    content: SQL_SCHEMA,
  },
  {
    id: 'edge_overdue',
    name: 'check-overdue-taches/index.ts',
    path: 'supabase/functions/check-overdue-taches/index.ts',
    label: 'Edge Function — Alertes tâches',
    icon: Server,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    desc: 'Cron journalier — envoie les emails de retard via Resend',
    content: EDGE_OVERDUE,
  },
  {
    id: 'edge_notify',
    name: 'notify-responsable/index.ts',
    path: 'supabase/functions/notify-responsable/index.ts',
    label: 'Edge Function — Notifications',
    icon: Server,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    desc: 'Assignation / complétion de tâche → email responsable',
    content: EDGE_NOTIFY,
  },
  {
    id: 'vite',
    name: 'vite.config.js',
    path: 'vite.config.js',
    label: 'Vite Config (sans Base44)',
    icon: FileCode,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    desc: 'Retire le plugin @base44/vite-plugin',
    content: VITE_CONFIG,
  },
  {
    id: 'readme',
    name: 'MIGRATION.md',
    path: 'MIGRATION.md',
    label: 'Guide de migration complet',
    icon: Package,
    color: 'text-teal-600 bg-teal-50 border-teal-200',
    desc: 'Étapes pas à pas pour déployer en autonomie',
    content: README,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function download(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors">
      {copied ? <><Check className="h-3.5 w-3.5 text-emerald-500" />Copié</> : <><Copy className="h-3.5 w-3.5" />Copier</>}
    </button>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AdminExportBackend() {
  const [selected, setSelected] = useState('supabase_client');
  const file = FILES.find(f => f.id === selected);

  const downloadAll = () => {
    FILES.forEach(f => download(f.name, f.content));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-[#1A3A52] flex items-center gap-2">
              <Package className="h-6 w-6 text-[#C9A961]" /> Export — Code indépendant
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Tous les fichiers pour migrer vers <strong>Supabase + Vercel/Netlify</strong> — sans aucune dépendance Base44
            </p>
          </div>
          <Button onClick={downloadAll} className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-bold gap-2">
            <Download className="h-4 w-4" /> Tout télécharger ({FILES.length} fichiers)
          </Button>
        </div>

        {/* Alerte */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Important :</strong> Ces fichiers remplacent les dépendances Base44. Après migration, remplacer tous les imports{' '}
            <code className="bg-amber-100 px-1 rounded">@/api/base44Client</code> par{' '}
            <code className="bg-amber-100 px-1 rounded">@/lib/supabaseClient</code> et{' '}
            <code className="bg-amber-100 px-1 rounded">base44.entities.X</code> par{' '}
            <code className="bg-amber-100 px-1 rounded">db.X</code> dans tout le projet.
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-5">

          {/* Liste fichiers */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-1 mb-2">Fichiers à exporter</p>
            {FILES.map(f => {
              const Icon = f.icon;
              return (
                <button key={f.id} onClick={() => setSelected(f.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${selected === f.id ? 'border-[#C9A961] bg-white shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${f.color}`}>{f.path.split('/')[0] === 'supabase' ? 'supabase/' : 'src/lib/'}</span>
                  </div>
                  <p className="text-xs font-mono font-semibold text-slate-700">{f.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{f.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Viewer */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {/* Header viewer */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${file.color}`}>{file.label}</span>
                  <span className="font-mono text-sm text-slate-500 truncate">{file.path}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <CopyBtn text={file.content} />
                  <Button size="sm" onClick={() => download(file.name, file.content)}
                    className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white gap-1.5 h-8 text-xs">
                    <Download className="h-3.5 w-3.5" /> Télécharger
                  </Button>
                </div>
              </div>
              {/* Code */}
              <div className="overflow-auto max-h-[72vh] bg-[#0F172A]">
                <pre className="p-5 text-xs leading-relaxed text-slate-200 font-mono whitespace-pre">
                  {file.content}
                </pre>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}