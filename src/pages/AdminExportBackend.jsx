import React, { useState } from 'react';
import { Download, FileCode, Database, Server, CheckCircle2, Copy, Check, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Contenu des fichiers exportables ────────────────────────────────────────

const FILES = {
  sql_schema: {
    name: 'schema.sql',
    label: 'Schéma Supabase (SQL)',
    icon: Database,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    description: 'Tables PostgreSQL pour toutes les entités du projet',
    content: `-- ============================================================
-- FONCIÈRE VALORA — Schéma Supabase PostgreSQL
-- Généré automatiquement — à exécuter dans Supabase SQL Editor
-- ============================================================

-- Extension UUID
create extension if not exists "pgcrypto";

-- ── Tâches ──────────────────────────────────────────────────
create table if not exists taches (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by text,
  titre text not null,
  description text,
  statut text default 'A faire' check (statut in ('A faire','En cours','En révision','Terminé','Bloqué')),
  priorite text default 'Moyenne' check (priorite in ('Urgente','Haute','Moyenne','Basse')),
  projet text,
  section text,
  assigne_a text,
  responsable_email text,
  date_debut date,
  date_echeance date,
  tags text,
  sous_taches text,
  commentaires text,
  pieces_jointes text,
  ordre integer default 0,
  est_jalon boolean default false,
  dependances text,
  avancement integer default 0 check (avancement >= 0 and avancement <= 100)
);

-- ── Projets ──────────────────────────────────────────────────
create table if not exists projets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  nom text not null,
  description text,
  couleur text default '#C9A961',
  icone text default '📁',
  statut text default 'Actif' check (statut in ('Actif','En pause','Terminé','Archivé')),
  sections text,
  date_debut date,
  date_fin date,
  membres text
);

-- ── PageViews (Analytics) ────────────────────────────────────
create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  page text not null,
  path text,
  session_id text,
  user_agent text,
  referrer text,
  search_keywords text,
  time_on_page numeric,
  country text,
  city text,
  lat numeric,
  lng numeric,
  ip text
);

-- ── ContactRequest ───────────────────────────────────────────
create table if not exists contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  prenom text,
  nom text,
  email text,
  telephone text,
  type_demande text,
  message text,
  email_envoye boolean default false
);

-- ── InvestisseurCRM ──────────────────────────────────────────
create table if not exists investisseurs_crm (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  prenom text,
  nom text,
  email text,
  telephone text,
  statut text default 'Prospect',
  montant_investi numeric default 0,
  date_prochain_contact date,
  notes text,
  source text,
  tags text
);

-- ── ArticleBlog ──────────────────────────────────────────────
create table if not exists articles_blog (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  titre text not null,
  slug text unique,
  extrait text,
  contenu text,
  categorie text default 'Investissement',
  auteur text default 'La Foncière Valora',
  image_url text,
  temps_lecture text,
  date_publication date,
  publie boolean default true
);

-- ── RealisationBien ──────────────────────────────────────────
create table if not exists realisations_biens (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  titre text not null,
  location text,
  lat numeric,
  lng numeric,
  annee text,
  image_avant text,
  image_apres text,
  surface text,
  logements text,
  investissement text,
  dpe_avant text,
  dpe_apres text,
  description_avant text,
  description_apres text,
  travaux text,
  rendement_brut text,
  plus_value text,
  ordre integer default 0,
  actif boolean default true
);

-- ── MembreEquipe ─────────────────────────────────────────────
create table if not exists membres_equipe (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  nom text not null,
  role text,
  focus text,
  description text,
  experience text,
  image_url text,
  type text default 'membre' check (type in ('fondateur','membre')),
  ordre integer default 0,
  actif boolean default true
);

-- ── LeveeFonds ───────────────────────────────────────────────
create table if not exists levees_fonds (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  nom text not null,
  objectif text,
  collecte text,
  avancement numeric default 0,
  date_ouverture date,
  date_cloture date,
  ticket_min text,
  rendement_cible text,
  description text,
  statut text default 'Préparation',
  nb_investisseurs numeric default 0,
  horizon text default '5 ans',
  effet_levier text,
  valorisation_an5 text,
  sous_titre text,
  actif boolean default true
);

-- ── AccesAdmin ───────────────────────────────────────────────
create table if not exists acces_admin (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text not null,
  password_hash text not null,
  nom text,
  actif boolean default true
);

-- ── AccesAssocie ─────────────────────────────────────────────
create table if not exists acces_associes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text not null,
  password_hash text not null,
  nom text,
  actif boolean default true
);

-- ── SiteImage ────────────────────────────────────────────────
create table if not exists site_images (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  key text unique not null,
  url text,
  description text,
  category text
);

-- ── SiteContent ──────────────────────────────────────────────
create table if not exists site_content (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  cle text unique not null,
  valeur text,
  page text,
  label text,
  type_champ text default 'texte'
);

-- ── ContactConfig ────────────────────────────────────────────
create table if not exists contact_config (
  id uuid primary key default gen_random_uuid(),
  cle text unique not null,
  valeur text,
  description text
);

-- ── DocumentAssocie ──────────────────────────────────────────
create table if not exists documents_associes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  nom text not null,
  categorie text,
  type_acces text default 'privé',
  file_url text,
  taille text,
  date_document date,
  actif boolean default true
);

-- ── AcquisitionAssocie ───────────────────────────────────────
create table if not exists acquisitions_associes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  ville text,
  prix text,
  lots numeric,
  dpe text,
  statut text default 'Négociation',
  avancement numeric default 0,
  livraison text,
  type text default 'acquisition_en_cours',
  valeur text,
  occupation text
);

-- ── MapLocation ──────────────────────────────────────────────
create table if not exists map_locations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  lat numeric,
  lng numeric,
  adresse text,
  image_url text,
  logements text,
  dpe text,
  actif boolean default true
);

-- ── ActualiteAssocie ─────────────────────────────────────────
create table if not exists actualites_associes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  titre text not null,
  description text,
  type text default 'note',
  date_publication date,
  actif boolean default true
);

-- ── EspaceAssocieConfig ──────────────────────────────────────
create table if not exists espace_associe_config (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  cle text unique not null,
  section text,
  donnees text
);

-- ── RoadmapAssocie ───────────────────────────────────────────
create table if not exists roadmap_associes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  etape text not null,
  date_prevue text,
  statut text default 'planifie',
  avancement numeric default 0,
  ordre numeric
);

-- Trigger pour updated_at automatique
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger taches_updated_at before update on taches for each row execute function update_updated_at();
create trigger projets_updated_at before update on projets for each row execute function update_updated_at();
create trigger investisseurs_updated_at before update on investisseurs_crm for each row execute function update_updated_at();
create trigger articles_updated_at before update on articles_blog for each row execute function update_updated_at();
create trigger site_content_updated_at before update on site_content for each row execute function update_updated_at();

-- RLS (Row Level Security) — à activer selon vos besoins
-- alter table taches enable row level security;
-- alter table contact_requests enable row level security;
`
  },

  edge_check_overdue: {
    name: 'check-overdue-taches/index.ts',
    label: 'Edge Function — Tâches en retard',
    icon: Server,
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    description: 'Cron journalier — alertes et rappels d\'échéance par email (Resend)',
    content: `// ============================================================
// Supabase Edge Function : check-overdue-taches
// Déploiement : supabase functions deploy check-overdue-taches
// Cron : tous les jours à 8h → dans Supabase Dashboard > Edge Functions > Cron
// Variables d'env requises : SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_KEY')!
);
const RESEND_KEY = Deno.env.get('RESEND_API_KEY')!;

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': \`Bearer \${RESEND_KEY}\`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'Foncière Valora <noreply@votre-domaine.fr>', to, subject, html })
  });
  return res.ok;
}

Deno.serve(async (_req) => {
  const { data: taches, error } = await supabase
    .from('taches')
    .select('*')
    .neq('statut', 'Terminé')
    .not('responsable_email', 'is', null)
    .not('date_echeance', 'is', null);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  let overdueCount = 0, reminderCount = 0;

  for (const tache of taches ?? []) {
    const echeance = new Date(tache.date_echeance);
    echeance.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((echeance.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const emoji = { 'Urgente': '🔴', 'Haute': '🟠', 'Moyenne': '🟡', 'Basse': '⚪' }[tache.priorite as string] ?? '';
    const echeanceStr = new Date(tache.date_echeance).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

    if (diffDays < 0) {
      const jours = Math.abs(diffDays);
      await sendEmail(
        tache.responsable_email,
        \`⚠️ Tâche en retard (\${jours}j) : \${tache.titre}\`,
        buildOverdueHtml(tache, jours, emoji, echeanceStr)
      );
      overdueCount++;
    } else if (diffDays === 2 || diffDays === 1) {
      await sendEmail(
        tache.responsable_email,
        \`🔔 Rappel — Échéance \${diffDays === 1 ? 'demain' : 'dans 2 jours'} : \${tache.titre}\`,
        buildReminderHtml(tache, diffDays, emoji, echeanceStr)
      );
      reminderCount++;
    }
  }

  return Response.json({ success: true, overdueCount, reminderCount, total: taches?.length ?? 0 });
});

function buildOverdueHtml(tache: any, jours: number, emoji: string, echeanceStr: string) {
  return \`<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:20px;border-radius:12px;">
  <div style="background:#1A3A52;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="color:#C9A961;margin:0;font-size:22px;">La Foncière Valora</h1>
    <p style="color:#ffffff99;margin:8px 0 0;font-size:14px;">Alerte de retard</p>
  </div>
  <div style="background:white;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;">
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;text-align:center;margin-bottom:24px;">
      <p style="margin:0;font-size:28px;">⚠️</p>
      <p style="margin:4px 0 0;font-weight:bold;color:#dc2626;font-size:18px;">Tâche en retard de \${jours} jour\${jours > 1 ? 's' : ''}</p>
    </div>
    <div style="background:#f1f5f9;border-left:4px solid #dc2626;padding:16px;border-radius:4px;margin:20px 0;">
      <p style="margin:0;font-size:18px;font-weight:bold;color:#1A3A52;">\${tache.titre}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;width:140px;">Projet</td><td style="padding:8px 0;font-weight:600;color:#1A3A52;">\${tache.projet ?? 'Sans projet'}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Priorité</td><td style="padding:8px 0;font-weight:600;color:#1A3A52;">\${emoji} \${tache.priorite ?? 'Moyenne'}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Statut</td><td style="padding:8px 0;font-weight:600;color:#dc2626;">\${tache.statut}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Avancement</td><td style="padding:8px 0;font-weight:600;color:#1A3A52;">\${tache.avancement ?? 0}%</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Échéance</td><td style="padding:8px 0;font-weight:600;color:#dc2626;">\${echeanceStr}</td></tr>
    </table>
    <p style="color:#64748b;font-size:14px;">Merci de mettre à jour le statut dès que possible.</p>
  </div>
  <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:16px;">La Foncière Valora — Notification automatique</p>
</div>\`;
}

function buildReminderHtml(tache: any, jours: number, emoji: string, echeanceStr: string) {
  return \`<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:20px;border-radius:12px;">
  <div style="background:#1A3A52;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="color:#C9A961;margin:0;font-size:22px;">La Foncière Valora</h1>
    <p style="color:#ffffff99;margin:8px 0 0;font-size:14px;">Rappel d'échéance</p>
  </div>
  <div style="background:white;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;">
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px;text-align:center;margin-bottom:24px;">
      <p style="margin:0;font-size:28px;">🔔</p>
      <p style="margin:4px 0 0;font-weight:bold;color:#d97706;font-size:18px;">Échéance \${jours === 1 ? 'demain' : 'dans 2 jours'}</p>
    </div>
    <div style="background:#f1f5f9;border-left:4px solid #C9A961;padding:16px;border-radius:4px;margin:20px 0;">
      <p style="margin:0;font-size:18px;font-weight:bold;color:#1A3A52;">\${tache.titre}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;width:140px;">Projet</td><td style="padding:8px 0;font-weight:600;color:#1A3A52;">\${tache.projet ?? 'Sans projet'}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Priorité</td><td style="padding:8px 0;font-weight:600;color:#1A3A52;">\${emoji} \${tache.priorite ?? 'Moyenne'}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Statut</td><td style="padding:8px 0;font-weight:600;color:#1A3A52;">\${tache.statut}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Échéance</td><td style="padding:8px 0;font-weight:600;color:#d97706;">\${echeanceStr}</td></tr>
    </table>
  </div>
  <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:16px;">La Foncière Valora — Notification automatique</p>
</div>\`;
}
`
  },

  edge_notify: {
    name: 'notify-responsable/index.ts',
    label: 'Edge Function — Notification responsable',
    icon: Server,
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    description: 'Déclenché sur assignation/complétion de tâche — envoie un email au responsable',
    content: `// ============================================================
// Supabase Edge Function : notify-responsable
// Déploiement : supabase functions deploy notify-responsable
// Peut être appelée depuis le frontend ou via un Webhook Supabase
// Variables d'env requises : SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_KEY')!
);
const RESEND_KEY = Deno.env.get('RESEND_API_KEY')!;

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': \`Bearer \${RESEND_KEY}\`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'Foncière Valora <noreply@votre-domaine.fr>', to, subject, html })
  });
  return res.ok;
}

Deno.serve(async (req) => {
  const { type, tacheId } = await req.json();

  const { data: taches } = await supabase.from('taches').select('*').eq('id', tacheId);
  const tache = taches?.[0];
  if (!tache) return Response.json({ error: 'Tâche introuvable' }, { status: 404 });
  if (!tache.responsable_email) return Response.json({ skipped: true, reason: 'Pas de responsable email' });

  const emoji = { 'Urgente': '🔴', 'Haute': '🟠', 'Moyenne': '🟡', 'Basse': '⚪' }[tache.priorite as string] ?? '';
  const echeanceStr = tache.date_echeance
    ? new Date(tache.date_echeance).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Non définie';
  const projet = tache.projet ?? 'Sans projet';

  let subject = '', html = '';

  if (type === 'assigned') {
    subject = \`📋 Nouvelle tâche assignée : \${tache.titre}\`;
    html = \`<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#1A3A52;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="color:#C9A961;margin:0;">La Foncière Valora</h1>
  </div>
  <div style="background:white;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;">
    <h2 style="color:#1A3A52;">📋 Une tâche vous a été assignée</h2>
    <div style="background:#f1f5f9;border-left:4px solid #C9A961;padding:16px;border-radius:4px;margin:20px 0;">
      <p style="margin:0;font-size:18px;font-weight:bold;color:#1A3A52;">\${tache.titre}</p>
      <p style="margin:4px 0 0;color:#64748b;">\${tache.description ?? 'Aucune description'}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      <tr><td style="padding:8px 0;color:#64748b;width:140px;">Projet</td><td style="font-weight:600;color:#1A3A52;">\${projet}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">Priorité</td><td style="font-weight:600;color:#1A3A52;">\${emoji} \${tache.priorite ?? 'Moyenne'}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">Échéance</td><td style="font-weight:600;color:#dc2626;">\${echeanceStr}</td></tr>
    </table>
  </div>
</div>\`;
  } else if (type === 'completed') {
    subject = \`✅ Tâche terminée : \${tache.titre}\`;
    html = \`<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#1A3A52;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="color:#C9A961;margin:0;">La Foncière Valora</h1>
  </div>
  <div style="background:white;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;">
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;text-align:center;">
      <p style="margin:0;font-size:28px;">✅</p>
      <p style="font-weight:bold;color:#16a34a;font-size:18px;">Tâche terminée !</p>
    </div>
    <p style="font-size:18px;font-weight:bold;color:#1A3A52;">\${tache.titre}</p>
    <p>Projet : \${projet} | Priorité : \${emoji} \${tache.priorite}</p>
    <p style="color:#64748b;">Bravo pour votre travail ! 🎉</p>
  </div>
</div>\`;
  } else if (type === 'overdue') {
    const jours = Math.floor((new Date().getTime() - new Date(tache.date_echeance).getTime()) / (1000 * 60 * 60 * 24));
    subject = \`⚠️ Tâche en retard (\${jours}j) : \${tache.titre}\`;
    html = \`<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#1A3A52;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="color:#C9A961;margin:0;">La Foncière Valora</h1>
  </div>
  <div style="background:white;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;">
    <p style="color:#dc2626;font-weight:bold;font-size:18px;">⚠️ En retard de \${jours} jour\${jours > 1 ? 's' : ''}</p>
    <p style="font-size:18px;font-weight:bold;color:#1A3A52;">\${tache.titre}</p>
    <p>Projet : \${projet} | Statut : \${tache.statut} | Avancement : \${tache.avancement ?? 0}%</p>
    <p>Échéance prévue : \${echeanceStr}</p>
    <p style="color:#64748b;">Merci de mettre à jour le statut dès que possible.</p>
  </div>
</div>\`;
  } else {
    return Response.json({ error: 'Type inconnu' }, { status: 400 });
  }

  await sendEmail(tache.responsable_email, subject, html);
  return Response.json({ success: true, to: tache.responsable_email, type });
});
`
  },

  env_example: {
    name: '.env.example',
    label: 'Variables d\'environnement',
    icon: FileCode,
    color: 'bg-slate-50 border-slate-200 text-slate-700',
    description: 'Toutes les variables d\'env nécessaires au projet Supabase + Vercel',
    content: `# ============================================================
# FONCIÈRE VALORA — Variables d'environnement
# Copier ce fichier en .env.local pour le dev, et configurer dans Vercel/Supabase
# ============================================================

# ── Supabase ─────────────────────────────────────────────────
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Pour les Edge Functions uniquement (NE PAS exposer côté client)
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ── Resend (emails transactionnels) ──────────────────────────
# Créer un compte sur resend.com, vérifier votre domaine
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ── OpenAI (pour les fonctions IA) ───────────────────────────
# Remplace l'intégration Base44 InvokeLLM
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ── Cloudinary ou Supabase Storage (pour les uploads) ────────
# Option A : Supabase Storage (recommandé, inclus dans Supabase)
# Les fichiers sont stockés dans des buckets Supabase — aucune config supplémentaire

# Option B : Cloudinary (si vous préférez)
# CLOUDINARY_CLOUD_NAME=votre-cloud
# CLOUDINARY_API_KEY=123456789
# CLOUDINARY_API_SECRET=xxxxxxxxxxxx

# ── App ──────────────────────────────────────────────────────
VITE_APP_URL=https://votre-domaine.fr
`
  },

  readme_deploy: {
    name: 'DEPLOY_README.md',
    label: 'Guide de déploiement',
    icon: Package,
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    description: 'Étapes complètes pour migrer sur Supabase + Vercel',
    content: `# 🚀 Guide de Migration — Foncière Valora
## De Base44 vers Supabase + Vercel

---

## 1. Prérequis

- Compte [Supabase](https://supabase.com) (gratuit pour commencer)
- Compte [Vercel](https://vercel.com) (gratuit)
- Compte [Resend](https://resend.com) pour les emails (gratuit jusqu'à 3000/mois)
- [Supabase CLI](https://supabase.com/docs/guides/cli) installé : \`npm install -g supabase\`

---

## 2. Créer le projet Supabase

\`\`\`bash
# Connexion
supabase login

# Initialiser le projet local
supabase init

# Lier à votre projet Supabase (après création sur supabase.com)
supabase link --project-ref VOTRE_PROJECT_REF
\`\`\`

---

## 3. Créer les tables (schema.sql)

1. Aller dans **Supabase Dashboard → SQL Editor**
2. Coller le contenu de \`schema.sql\`
3. Cliquer **Run**

---

## 4. Exporter les données depuis Base44

Pour chaque entité dans Base44 :
1. Aller dans **Base44 Dashboard → Data**
2. Sélectionner la table → **Export CSV**
3. Importer dans Supabase : **Table Editor → Import CSV**

Ordre d'import recommandé :
1. site_content
2. site_images
3. membres_equipe
4. realisations_biens
5. levees_fonds
6. articles_blog
7. taches + projets
8. investisseurs_crm
9. contact_requests
10. acces_admin + acces_associes

---

## 5. Déployer les Edge Functions

\`\`\`bash
# Créer les dossiers
mkdir -p supabase/functions/check-overdue-taches
mkdir -p supabase/functions/notify-responsable

# Copier les fichiers index.ts dans chaque dossier
# Puis déployer :
supabase functions deploy check-overdue-taches
supabase functions deploy notify-responsable

# Configurer les secrets
supabase secrets set RESEND_API_KEY=re_xxxx
supabase secrets set OPENAI_API_KEY=sk-proj-xxxx
\`\`\`

---

## 6. Configurer le Cron pour les alertes tâches

Dans **Supabase Dashboard → Edge Functions → Schedules** :

- **Fonction** : \`check-overdue-taches\`
- **Schedule** : \`0 8 * * *\` (tous les jours à 8h)

---

## 7. Adapter le frontend React

Remplacer les imports Base44 par Supabase :

\`\`\`bash
npm install @supabase/supabase-js
\`\`\`

\`\`\`ts
// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
\`\`\`

Exemple de remplacement :
\`\`\`ts
// ❌ Avant (Base44)
const taches = await base44.entities.Tache.list();

// ✅ Après (Supabase)
const { data: taches } = await supabase.from('taches').select('*').order('created_at', { ascending: false });
\`\`\`

---

## 8. Déployer sur Vercel

\`\`\`bash
npm install -g vercel
vercel login
vercel --prod
\`\`\`

Configurer les variables d'env dans **Vercel Dashboard → Settings → Environment Variables** :
- \`VITE_SUPABASE_URL\`
- \`VITE_SUPABASE_ANON_KEY\`

---

## 9. Domaine personnalisé

1. **Vercel** → Settings → Domains → Ajouter votre domaine
2. **Supabase** → Pas de config domaine nécessaire (API accessible directement)

---

## Récapitulatif des coûts

| Service | Gratuit | Payant |
|---------|---------|--------|
| Supabase | 500 MB DB, 1 GB storage, 50k MAU | $25/mois (Pro) |
| Vercel | Projets illimités, 100 GB bw | $20/mois (Pro) |
| Resend | 3000 emails/mois | $20/mois (50k emails) |
| OpenAI | — | ~$0.01 / requête GPT-4o-mini |

**Total minimal : 0€/mois** pour les volumes actuels.
`
  }
};

// ─── Composant principal ──────────────────────────────────────────────────────

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100">
      {copied ? <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copié</> : <><Copy className="h-3.5 w-3.5" /> Copier</>}
    </button>
  );
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadAll() {
  Object.values(FILES).forEach(f => downloadFile(f.name, f.content));
}

export default function AdminExportBackend() {
  const [selected, setSelected] = useState('sql_schema');
  const file = FILES[selected];

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1A3A52] flex items-center gap-2">
              <Server className="h-6 w-6 text-[#C9A961]" /> Export Backend Indépendant
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Code prêt à déployer sur <strong>Supabase</strong> + <strong>Vercel</strong> — 100% indépendant de Base44
            </p>
          </div>
          <Button
            onClick={downloadAll}
            className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-bold gap-2 flex-shrink-0"
          >
            <Download className="h-4 w-4" /> Tout télécharger ({Object.keys(FILES).length} fichiers)
          </Button>
        </div>

        {/* Bandeau info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <strong>📦 Ce que vous obtenez :</strong> Schéma SQL complet pour Supabase (toutes les tables), 2 Edge Functions TypeScript (alertes tâches + notifications email), variables d'environnement, et un guide de déploiement pas à pas.
        </div>

        <div className="grid lg:grid-cols-4 gap-5">

          {/* Sidebar fichiers */}
          <div className="lg:col-span-1 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-1 mb-3">Fichiers générés</p>
            {Object.entries(FILES).map(([key, f]) => {
              const Icon = f.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${selected === key ? 'border-[#C9A961] bg-white shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-xs font-mono text-slate-600 truncate">{f.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-tight">{f.description}</p>
                </button>
              );
            })}

            {/* Checklist déploiement */}
            <div className="mt-4 bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-600 mb-3">Checklist migration</p>
              {[
                'Créer projet Supabase',
                'Exécuter schema.sql',
                'Exporter données Base44',
                'Déployer Edge Functions',
                'Configurer Cron (alertes)',
                'Adapter imports frontend',
                'Déployer sur Vercel',
                'Configurer domaine',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2 py-1">
                  <div className="w-4 h-4 rounded border border-slate-300 flex-shrink-0" />
                  <span className="text-xs text-slate-600">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Éditeur de code */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {/* Barre de titre */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${file.color}`}>
                    {file.label}
                  </div>
                  <span className="font-mono text-sm text-slate-500">{file.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CopyButton text={file.content} />
                  <Button
                    size="sm"
                    onClick={() => downloadFile(file.name, file.content)}
                    className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white gap-1.5 h-8 text-xs"
                  >
                    <Download className="h-3.5 w-3.5" /> Télécharger
                  </Button>
                </div>
              </div>

              {/* Code */}
              <div className="overflow-auto max-h-[70vh]">
                <pre className="p-5 text-xs leading-relaxed text-slate-800 font-mono whitespace-pre">
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