// lib/supabaseClient.js
// Client Supabase via fetch natif — AUCUNE dépendance externe
// Configurer dans .env.local :
//   VITE_SUPABASE_URL=https://xxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJ...

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const headers = () => ({
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Prefer': 'return=representation',
});

// Retourne des données vides si non configuré (évite les crash pendant migration)
const notConfigured = () => {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('[supabaseClient] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY non configurés. Configurer .env.local');
    return true;
  }
  return false;
};

// ── Helper générique CRUD ──────────────────────────────────────────────────────
function makeEntity(tableName) {
  const base = () => `${SUPABASE_URL}/rest/v1/${tableName}`;

  return {
    async list(orderBy = '-created_at', limit = 500) {
      if (notConfigured()) return [];
      const col = orderBy.replace(/^-/, '');
      const asc = !orderBy.startsWith('-');
      const url = `${base()}?order=${col}.${asc ? 'asc' : 'desc'}&limit=${limit}`;
      const res = await fetch(url, { headers: headers() });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },

    async filter(filters = {}, orderBy = '-created_at', limit = 500) {
      if (notConfigured()) return [];
      const col = orderBy.replace(/^-/, '');
      const asc = !orderBy.startsWith('-');
      const params = Object.entries(filters).map(([k, v]) => `${k}=eq.${v}`).join('&');
      const url = `${base()}?${params}&order=${col}.${asc ? 'asc' : 'desc'}&limit=${limit}`;
      const res = await fetch(url, { headers: headers() });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },

    async get(id) {
      if (notConfigured()) return null;
      const res = await fetch(`${base()}?id=eq.${id}&limit=1`, { headers: { ...headers(), 'Accept': 'application/vnd.pgrst.object+json' } });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },

    async create(payload) {
      if (notConfigured()) return { ...payload, id: `local-${Date.now()}`, created_at: new Date().toISOString() };
      const res = await fetch(base(), {
        method: 'POST',
        headers: { ...headers(), 'Accept': 'application/vnd.pgrst.object+json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },

    async update(id, payload) {
      if (notConfigured()) return { ...payload, id };
      const res = await fetch(`${base()}?id=eq.${id}`, {
        method: 'PATCH',
        headers: { ...headers(), 'Accept': 'application/vnd.pgrst.object+json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },

    async delete(id) {
      if (notConfigured()) return true;
      const res = await fetch(`${base()}?id=eq.${id}`, { method: 'DELETE', headers: headers() });
      if (!res.ok) throw new Error(await res.text());
      return true;
    },

    async bulkCreate(items) {
      if (notConfigured()) return items;
      const res = await fetch(base(), {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(items),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },

    // Realtime via polling (fallback sans WebSocket Supabase)
    subscribe(callback) {
      if (notConfigured()) return () => {};
      let lastIds = new Set();
      const poll = async () => {
        try {
          const res = await fetch(`${base()}?order=created_at.desc&limit=50`, { headers: headers() });
          const data = await res.json();
          data.forEach(row => {
            if (!lastIds.has(row.id)) {
              if (lastIds.size > 0) callback({ type: 'create', id: row.id, data: row });
              lastIds.add(row.id);
            }
          });
        } catch (e) {}
      };
      poll();
      const interval = setInterval(poll, 5000);
      return () => clearInterval(interval);
    },
  };
}

// ── Toutes les entités ─────────────────────────────────────────────────────────
export const db = {
  Tache: makeEntity('taches'),
  Projet: makeEntity('projets'),
  PageView: makeEntity('page_views'),
  ContactRequest: makeEntity('contact_requests'),
  ContactConfig: makeEntity('contact_config'),
  InvestisseurCRM: makeEntity('investisseurs_crm'),
  ArticleBlog: makeEntity('articles_blog'),
  RealisationBien: makeEntity('realisations_biens'),
  MembreEquipe: makeEntity('membres_equipe'),
  LeveeFonds: makeEntity('levees_fonds'),
  SiteImage: makeEntity('site_images'),
  SiteContent: makeEntity('site_content'),
  SiteSection: makeEntity('site_sections'),
  MapLocation: makeEntity('map_locations'),
  AccesAdmin: makeEntity('acces_admin'),
  AccesAssocie: makeEntity('acces_associes'),
  DocumentAssocie: makeEntity('documents_associes'),
  AcquisitionAssocie: makeEntity('acquisitions_associes'),
  ActualiteAssocie: makeEntity('actualites_associes'),
  EspaceAssocieConfig: makeEntity('espace_associe_config'),
  RoadmapAssocie: makeEntity('roadmap_associes'),
  Responsable: makeEntity('responsables'),
  ValoraAIMemoire: makeEntity('valora_ai_memoire'),
  ValoraAIAction: makeEntity('valora_ai_actions'),
};

// ── Compatibilité API base44.entities.X ───────────────────────────────────────
// Permet import { base44 } from '@/api/base44Client' sans rien changer d'autre
export const base44 = {
  entities: db,
  integrations: {
    Core: {
      async SendEmail({ to, subject, body, from_name }) {
        if (notConfigured()) {
          console.log('[SendEmail] Non configuré — email non envoyé');
          return;
        }
        // Appelle l'Edge Function Supabase "send-email" (à déployer)
        await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_KEY}` },
          body: JSON.stringify({ to, subject, body, from_name }),
        });
      },
      async InvokeLLM({ prompt, response_json_schema }) {
        if (notConfigured()) return response_json_schema ? {} : '';
        const res = await fetch(`${SUPABASE_URL}/functions/v1/invoke-llm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_KEY}` },
          body: JSON.stringify({ prompt, response_json_schema }),
        });
        return res.json();
      },
      async UploadFile({ file }) {
        if (notConfigured()) return { file_url: '' };
        const formData = new FormData();
        formData.append('file', file);
        const fileName = `${Date.now()}-${file.name}`;
        const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${fileName}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${SUPABASE_KEY}` },
          body: formData,
        });
        if (!res.ok) throw new Error(await res.text());
        return { file_url: `${SUPABASE_URL}/storage/v1/object/public/${fileName}` };
      },
      async GenerateImage({ prompt }) {
        if (notConfigured()) return { url: '' };
        const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_KEY}` },
          body: JSON.stringify({ prompt }),
        });
        return res.json();
      },
      async ExtractDataFromUploadedFile({ file_url, json_schema }) {
        if (notConfigured()) return { status: 'error', output: null };
        const res = await fetch(`${SUPABASE_URL}/functions/v1/extract-data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_KEY}` },
          body: JSON.stringify({ file_url, json_schema }),
        });
        return res.json();
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
  appLogs: { logUserInApp() {} },
  analytics: { track() {} },
  agents: {
    createConversation: async () => ({ id: null, messages: [] }),
    listConversations: async () => [],
    getConversation: async () => ({ id: null, messages: [] }),
    addMessage: async () => {},
    subscribeToConversation: () => () => {},
    getWhatsAppConnectURL: () => '#',
    getTelegramConnectURL: () => '#',
  },
};