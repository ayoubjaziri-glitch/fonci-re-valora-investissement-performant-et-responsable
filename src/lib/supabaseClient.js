// Configuration Supabase — Foncière Valora
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cnulpkwcfpbujojwefah.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5NLD8wzCMdxN4TCiuSYK-w_mDQ1aQFO';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

function createEntity(tableName) {
  const base = `${SUPABASE_URL}/rest/v1/${tableName}`;

  return {
    async list(orderBy = '-created_at', limit = 500) {
      const column = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
      const direction = orderBy.startsWith('-') ? 'desc' : 'asc';
      const res = await fetch(`${base}?order=${column}.${direction}&limit=${limit}`, { headers });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    async filter(filters = {}, orderBy = '-created_at', limit = 500) {
      const column = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
      const direction = orderBy.startsWith('-') ? 'desc' : 'asc';
      const params = new URLSearchParams({ order: `${column}.${direction}`, limit });
      Object.entries(filters).forEach(([k, v]) => params.append(k, `eq.${v}`));
      const res = await fetch(`${base}?${params}`, { headers });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    async get(id) {
      const res = await fetch(`${base}?id=eq.${id}`, { headers });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data[0] || null;
    },
    async create(data) {
      const res = await fetch(base, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      return Array.isArray(result) ? result[0] : result;
    },
    async bulkCreate(dataArray) {
      const res = await fetch(base, {
        method: 'POST',
        headers,
        body: JSON.stringify(dataArray)
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    async update(id, data) {
      const res = await fetch(`${base}?id=eq.${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      return Array.isArray(result) ? result[0] : result;
    },
    async delete(id) {
      const res = await fetch(`${base}?id=eq.${id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error(await res.text());
      return true;
    },
    subscribe(callback, interval = 5000) {
      let running = true;
      const poll = setInterval(async () => {
        if (!running) return;
      }, interval);
      return () => { running = false; clearInterval(poll); };
    }
  };
}

export const db = {
  ContactRequest: createEntity('contact_requests'),
  SiteContent: createEntity('site_content'),
  SiteImage: createEntity('site_images'),
  SiteSection: createEntity('site_sections'),
  MembreEquipe: createEntity('membres_equipe'),
  ArticleBlog: createEntity('articles_blog'),
  RealisationBien: createEntity('realisations_biens'),
  LeveeFonds: createEntity('levees_fonds'),
  MapLocation: createEntity('map_locations'),
  PageView: createEntity('page_views'),
  AccesAdmin: createEntity('acces_admin'),
  AccesAssocie: createEntity('acces_associes'),
  DocumentAssocie: createEntity('documents_associes'),
  ActualiteAssocie: createEntity('actualites_associes'),
  AcquisitionAssocie: createEntity('acquisitions_associes'),
  RoadmapAssocie: createEntity('roadmap_associes'),
  EspaceAssocieConfig: createEntity('espace_associe_config'),
  ContactConfig: createEntity('contact_config'),
  InvestisseurCRM: createEntity('investisseurs_crm'),
  Tache: createEntity('taches'),
  Projet: createEntity('projets'),
  Responsable: createEntity('responsables'),
};