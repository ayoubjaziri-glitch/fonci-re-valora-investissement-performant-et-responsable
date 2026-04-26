// Configuration Supabase
const SUPABASE_URL = 'https://cnulpkwcfpbujojwefah.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5NLD8wzCMdxN4TCiuSYK-w_mDQ1aQFO';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

// Fonction générique pour interagir avec une table Supabase
function createEntity(tableName) {
  const base = `${SUPABASE_URL}/rest/v1/${tableName}`;

  return {
    // Lister tous les enregistrements
    async list(orderBy = '-created_at', limit = 100) {
      const column = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
      const direction = orderBy.startsWith('-') ? 'desc' : 'asc';
      const url = `${base}?order=${column}.${direction}&limit=${limit}`;
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },

    // Filtrer les enregistrements
    async filter(filters = {}, orderBy = '-created_at', limit = 100) {
      const column = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
      const direction = orderBy.startsWith('-') ? 'desc' : 'asc';
      const params = new URLSearchParams({ order: `${column}.${direction}`, limit });
      Object.entries(filters).forEach(([k, v]) => params.append(k, `eq.${v}`));
      const res = await fetch(`${base}?${params}`, { headers });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },

    // Obtenir un enregistrement par ID
    async get(id) {
      const res = await fetch(`${base}?id=eq.${id}`, { headers });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data[0] || null;
    },

    // Créer un enregistrement
    async create(data) {
      const payload = { ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      const res = await fetch(base, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      return Array.isArray(result) ? result[0] : result;
    },

    // Créer plusieurs enregistrements
    async bulkCreate(dataArray) {
      const payload = dataArray.map(d => ({ ...d, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }));
      const res = await fetch(base, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },

    // Mettre à jour un enregistrement
    async update(id, data) {
      const payload = { ...data, updated_at: new Date().toISOString() };
      const res = await fetch(`${base}?id=eq.${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      return Array.isArray(result) ? result[0] : result;
    },

    // Supprimer un enregistrement
    async delete(id) {
      const res = await fetch(`${base}?id=eq.${id}`, {
        method: 'DELETE',
        headers
      });
      if (!res.ok) throw new Error(await res.text());
      return true;
    },

    // S'abonner aux changements (polling simple)
    subscribe(callback, interval = 5000) {
      let lastCheck = new Date().toISOString();
      const poll = setInterval(async () => {
        try {
          const res = await fetch(`${base}?updated_at=gt.${lastCheck}&order=updated_at.desc`, { headers });
          if (res.ok) {
            const data = await res.json();
            if (data.length > 0) {
              lastCheck = new Date().toISOString();
              data.forEach(item => callback({ type: 'update', id: item.id, data: item }));
            }
          }
        } catch (e) {}
      }, interval);
      return () => clearInterval(poll);
    }
  };
}

// Export de toutes les entités du projet
export const db = {
  ContactRequest: createEntity('contact_requests'),
  SiteContent: createEntity('site_contents'),
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
  EspaceAssocieConfig: createEntity('espace_associe_configs'),
  ContactConfig: createEntity('contact_configs'),
  InvestisseurCRM: createEntity('investisseurs_crm'),
  Tache: createEntity('taches'),
  Projet: createEntity('projets'),
  Responsable: createEntity('responsables'),
};