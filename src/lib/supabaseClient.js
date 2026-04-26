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

const notConfigured = () => !SUPABASE_URL || !SUPABASE_KEY;

function makeEntity(tableName) {
  const base = () => `${SUPABASE_URL}/rest/v1/${tableName}`;

  return {
    async list(orderBy = '-created_at', limit = 500) {
      if (notConfigured()) return [];
      const col = orderBy.replace(/^-/, '');
      const asc = !orderBy.startsWith('-');
      const res = await fetch(`${base()}?order=${col}.${asc ? 'asc' : 'desc'}&limit=${limit}`, { headers: headers() });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },

    async filter(filters = {}, orderBy = '-created_at', limit = 500) {
      if (notConfigured()) return [];
      const col = orderBy.replace(/^-/, '');
      const asc = !orderBy.startsWith('-');
      const params = Object.entries(filters).map(([k, v]) => `${k}=eq.${v}`).join('&');
      const res = await fetch(`${base()}?${params}&order=${col}.${asc ? 'asc' : 'desc'}&limit=${limit}`, { headers: headers() });
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