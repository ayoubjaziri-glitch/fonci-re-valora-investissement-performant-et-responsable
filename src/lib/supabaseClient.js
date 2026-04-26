// lib/supabaseClient.js
// Client Supabase — remplace @/api/base44Client
// Configurer VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Si les variables d'env ne sont pas configurées, on utilise un client factice
// pour que l'app continue à fonctionner pendant la migration
let supabase;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('[supabaseClient] Variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY non configurées. Configurer .env.local pour activer Supabase.');
  // Client factice — retourne des données vides sans planter
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: null, order: () => ({ data: [], error: null, limit: () => ({ data: [], error: null }) }), limit: () => ({ data: [], error: null }), eq: () => ({ data: [], error: null, single: () => ({ data: null, error: null }) }) }),
      insert: () => ({ data: null, error: null, select: () => ({ data: [], error: null, single: () => ({ data: null, error: null }) }) }),
      update: () => ({ data: null, error: null, eq: () => ({ data: null, error: null, select: () => ({ data: [], error: null, single: () => ({ data: null, error: null }) }) }) }),
      delete: () => ({ error: null, eq: () => ({ error: null }) }),
    }),
    channel: () => ({ on: () => ({ subscribe: () => {} }) }),
    removeChannel: () => {},
  };
}

export { supabase };

// ── Helper générique CRUD ──────────────────────────────────────────────────────
// Fournit la même API que base44.entities.X :
//   db.Tache.list()  db.Tache.create({})  db.Tache.update(id, {})  db.Tache.delete(id)

function makeEntity(tableName) {
  return {
    async list(orderBy = '-created_at', limit = 500) {
      const col = orderBy.replace(/^-/, '');
      const asc = !orderBy.startsWith('-');
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order(col, { ascending: asc })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },

    async filter(filters = {}, orderBy = '-created_at', limit = 500) {
      const col = orderBy.replace(/^-/, '');
      const asc = !orderBy.startsWith('-');
      let query = supabase.from(tableName).select('*');
      Object.entries(filters).forEach(([k, v]) => { query = query.eq(k, v); });
      const { data, error } = await query.order(col, { ascending: asc }).limit(limit);
      if (error) throw error;
      return data ?? [];
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
      return data ?? [];
    },

    subscribe(callback) {
      const channel = supabase
        .channel(`realtime:${tableName}:${Date.now()}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, (payload) => {
          const typeMap = { INSERT: 'create', UPDATE: 'update', DELETE: 'delete' };
          callback({
            type: typeMap[payload.eventType],
            id: payload.new?.id || payload.old?.id,
            data: payload.new,
          });
        })
        .subscribe();
      return () => supabase.removeChannel(channel);
    },
  };
}

// ── Toutes les entités du projet ───────────────────────────────────────────────
export const db = {
  // Gestion interne
  Tache: makeEntity('taches'),
  Projet: makeEntity('projets'),

  // Analytics
  PageView: makeEntity('page_views'),

  // Contacts & CRM
  ContactRequest: makeEntity('contact_requests'),
  ContactConfig: makeEntity('contact_config'),
  InvestisseurCRM: makeEntity('investisseurs_crm'),

  // Contenu site
  ArticleBlog: makeEntity('articles_blog'),
  RealisationBien: makeEntity('realisations_biens'),
  MembreEquipe: makeEntity('membres_equipe'),
  LeveeFonds: makeEntity('levees_fonds'),
  SiteImage: makeEntity('site_images'),
  SiteContent: makeEntity('site_content'),
  SiteSection: makeEntity('site_sections'),
  MapLocation: makeEntity('map_locations'),

  // Accès
  AccesAdmin: makeEntity('acces_admin'),
  AccesAssocie: makeEntity('acces_associes'),

  // Espace associés
  DocumentAssocie: makeEntity('documents_associes'),
  AcquisitionAssocie: makeEntity('acquisitions_associes'),
  ActualiteAssocie: makeEntity('actualites_associes'),
  EspaceAssocieConfig: makeEntity('espace_associe_config'),
  RoadmapAssocie: makeEntity('roadmap_associes'),
  LeveeFondsAssocie: makeEntity('levees_fonds'),

  // Responsables
  Responsable: makeEntity('responsables'),

  // Mémoire IA (optionnel)
  ValoraAIMemoire: makeEntity('valora_ai_memoire'),
  ValoraAIAction: makeEntity('valora_ai_actions'),
};

// ── Compatibilité avec l'ancienne API base44.entities.X ────────────────────────
// Permet de remplacer `import { base44 } from '@/api/base44Client'`
// par `import { base44 } from '@/lib/supabaseClient'` sans toucher au reste du code

export const base44 = {
  entities: db,
  integrations: {
    Core: {
      // SendEmail — à remplacer par Resend ou Supabase Edge Function
      // Pour une migration simple, garder l'email côté serveur (Edge Function)
      async SendEmail({ to, subject, body, from_name }) {
        // Option 1 : appeler votre Edge Function Supabase
        if (supabaseUrl) {
          await fetch(`${supabaseUrl}/functions/v1/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({ to, subject, body, from_name }),
          });
        }
        // Option 2 : ne rien faire (emails désactivés tant que non configuré)
        console.log('[SendEmail] Non configuré — installer Resend + Edge Function send-email');
      },

      // InvokeLLM — à remplacer par OpenAI directement ou Edge Function
      async InvokeLLM({ prompt, response_json_schema, add_context_from_internet }) {
        if (supabaseUrl) {
          const res = await fetch(`${supabaseUrl}/functions/v1/invoke-llm`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({ prompt, response_json_schema, add_context_from_internet }),
          });
          return res.json();
        }
        console.warn('[InvokeLLM] Non configuré');
        return response_json_schema ? {} : '';
      },

      // UploadFile — à remplacer par Supabase Storage
      async UploadFile({ file }) {
        if (!supabaseUrl) {
          console.warn('[UploadFile] Non configuré');
          return { file_url: '' };
        }
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from('public').upload(fileName, file);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('public').getPublicUrl(fileName);
        return { file_url: urlData.publicUrl };
      },

      async GenerateImage({ prompt }) {
        console.warn('[GenerateImage] Non configuré — configurer OpenAI DALL-E via Edge Function');
        return { url: '' };
      },
    },
  },
  auth: {
    async me() { return null; },
    async isAuthenticated() { return false; },
    logout() { window.location.reload(); },
    redirectToLogin() {},
    async updateMe() {},
  },
  appLogs: {
    logUserInApp() {},
  },
};