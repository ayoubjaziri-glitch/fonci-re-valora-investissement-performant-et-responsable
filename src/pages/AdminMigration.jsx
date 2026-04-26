import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { db } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader, Play, RefreshCw } from 'lucide-react';

const TABLES = [
  { label: 'Membres Équipe',      src: () => base44.entities.MembreEquipe.list(),          dst: (d) => db.MembreEquipe.bulkCreate(d),          key: 'membres_equipe' },
  { label: 'Articles Blog',       src: () => base44.entities.ArticleBlog.list(),            dst: (d) => db.ArticleBlog.bulkCreate(d),            key: 'articles_blog' },
  { label: 'Réalisations Biens',  src: () => base44.entities.RealisationBien.list(),        dst: (d) => db.RealisationBien.bulkCreate(d),        key: 'realisations_biens' },
  { label: 'Levées de Fonds',     src: () => base44.entities.LeveeFonds.list(),             dst: (d) => db.LeveeFonds.bulkCreate(d),             key: 'levees_fonds' },
  { label: 'Site Images',         src: () => base44.entities.SiteImage.list(),              dst: (d) => db.SiteImage.bulkCreate(d),              key: 'site_images' },
  { label: 'Site Content',        src: () => base44.entities.SiteContent.list(),            dst: (d) => db.SiteContent.bulkCreate(d),            key: 'site_content' },
  { label: 'Site Sections',       src: () => base44.entities.SiteSection.list(),            dst: (d) => db.SiteSection.bulkCreate(d),            key: 'site_sections' },
  { label: 'Contact Requests',    src: () => base44.entities.ContactRequest.list(),         dst: (d) => db.ContactRequest.bulkCreate(d),         key: 'contact_requests' },
  { label: 'Contact Config',      src: () => base44.entities.ContactConfig.list(),          dst: (d) => db.ContactConfig.bulkCreate(d),          key: 'contact_config' },
  { label: 'Investisseurs CRM',   src: () => base44.entities.InvestisseurCRM.list(),        dst: (d) => db.InvestisseurCRM.bulkCreate(d),        key: 'investisseurs_crm' },
  { label: 'Accès Associés',      src: () => base44.entities.AccesAssocie.list(),           dst: (d) => db.AccesAssocie.bulkCreate(d),           key: 'acces_associes' },
  { label: 'Documents Associés',  src: () => base44.entities.DocumentAssocie.list(),        dst: (d) => db.DocumentAssocie.bulkCreate(d),        key: 'documents_associes' },
  { label: 'Actualités Associés', src: () => base44.entities.ActualiteAssocie.list(),       dst: (d) => db.ActualiteAssocie.bulkCreate(d),       key: 'actualites_associes' },
  { label: 'Acquisitions',        src: () => base44.entities.AcquisitionAssocie.list(),     dst: (d) => db.AcquisitionAssocie.bulkCreate(d),     key: 'acquisitions_associes' },
  { label: 'Map Locations',       src: () => base44.entities.MapLocation.list(),            dst: (d) => db.MapLocation.bulkCreate(d),            key: 'map_locations' },
  { label: 'Espace Associé Config', src: () => base44.entities.EspaceAssocieConfig.list(), dst: (d) => db.EspaceAssocieConfig.bulkCreate(d),   key: 'espace_associe_config' },
  { label: 'Roadmap Associés',    src: () => base44.entities.RoadmapAssocie.list(),         dst: (d) => db.RoadmapAssocie.bulkCreate(d),         key: 'roadmap_associes' },
  { label: 'Tâches',              src: () => base44.entities.Tache.list(),                  dst: (d) => db.Tache.bulkCreate(d),                  key: 'taches' },
  { label: 'Projets',             src: () => base44.entities.Projet.list(),                 dst: (d) => db.Projet.bulkCreate(d),                 key: 'projets' },
];

// Colonnes Base44 à supprimer avant insertion dans Supabase
const STRIP_KEYS = ['created_date', 'updated_date', 'created_by', 'created_by_id', 'updated_by', 'updated_by_id', '__v', '_id'];

function cleanRecord(record) {
  const cleaned = { ...record };
  STRIP_KEYS.forEach(k => delete cleaned[k]);
  // Supprimer l'id Base44 (UUID différent) pour laisser Supabase générer le sien
  delete cleaned.id;
  return cleaned;
}

export default function AdminMigration() {
  const [statuses, setStatuses] = useState({}); // { key: { state, count, error } }
  const [running, setRunning] = useState(false);

  const setStatus = (key, val) => setStatuses(prev => ({ ...prev, [key]: val }));

  const migrateAll = async () => {
    setRunning(true);
    setStatuses({});

    for (const table of TABLES) {
      setStatus(table.key, { state: 'loading' });
      try {
        const data = await table.src();
        if (!data || data.length === 0) {
          setStatus(table.key, { state: 'empty', count: 0 });
          continue;
        }
        const cleaned = data.map(cleanRecord);
        await table.dst(cleaned);
        setStatus(table.key, { state: 'ok', count: cleaned.length });
      } catch (e) {
        setStatus(table.key, { state: 'error', error: e.message });
      }
    }
    setRunning(false);
  };

  const migrateOne = async (table) => {
    setStatus(table.key, { state: 'loading' });
    try {
      const data = await table.src();
      if (!data || data.length === 0) {
        setStatus(table.key, { state: 'empty', count: 0 });
        return;
      }
      const cleaned = data.map(cleanRecord);
      await table.dst(cleaned);
      setStatus(table.key, { state: 'ok', count: cleaned.length });
    } catch (e) {
      setStatus(table.key, { state: 'error', error: e.message });
    }
  };

  const total = TABLES.length;
  const done = Object.values(statuses).filter(s => s.state === 'ok' || s.state === 'empty').length;
  const errors = Object.values(statuses).filter(s => s.state === 'error').length;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-[#1A3A52] mb-1">🚀 Migration Base44 → Supabase</h1>
          <p className="text-slate-500 text-sm mb-4">Cliquez sur <strong>Tout migrer</strong> pour transférer toutes les données en un clic.</p>

          {/* Progress */}
          {Object.keys(statuses).length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{done} / {total} tables migrées</span>
                {errors > 0 && <span className="text-red-500">{errors} erreur(s)</span>}
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-[#C9A961] h-2 rounded-full transition-all"
                  style={{ width: `${(done / total) * 100}%` }}
                />
              </div>
            </div>
          )}

          <Button
            onClick={migrateAll}
            disabled={running}
            className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white gap-2 w-full py-6 text-base font-bold"
          >
            {running ? <Loader className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
            {running ? 'Migration en cours...' : 'Tout migrer (19 tables)'}
          </Button>
        </div>

        {/* Table list */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {TABLES.map((table, i) => {
            const s = statuses[table.key];
            return (
              <div key={table.key} className={`flex items-center gap-4 px-5 py-3.5 ${i < TABLES.length - 1 ? 'border-b border-slate-100' : ''}`}>
                {/* Status icon */}
                <div className="w-6 flex-shrink-0 flex justify-center">
                  {!s && <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />}
                  {s?.state === 'loading' && <Loader className="h-4 w-4 animate-spin text-blue-500" />}
                  {s?.state === 'ok' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                  {s?.state === 'empty' && <CheckCircle2 className="h-5 w-5 text-slate-300" />}
                  {s?.state === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{table.label}</p>
                  {s?.state === 'ok' && <p className="text-xs text-emerald-600">{s.count} enregistrement(s) importés</p>}
                  {s?.state === 'empty' && <p className="text-xs text-slate-400">Table vide — ignorée</p>}
                  {s?.state === 'error' && <p className="text-xs text-red-500 truncate">{s.error}</p>}
                </div>

                {/* Retry button on error */}
                {s?.state === 'error' && (
                  <Button size="sm" variant="outline" onClick={() => migrateOne(table)}
                    className="text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50 flex-shrink-0">
                    <RefreshCw className="h-3 w-3" /> Réessayer
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Success message */}
        {!running && done === total && errors === 0 && Object.keys(statuses).length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
            <p className="text-2xl mb-1">🎉</p>
            <p className="font-bold text-emerald-800">Migration terminée avec succès !</p>
            <p className="text-sm text-emerald-600 mt-1">Toutes les données sont maintenant dans Supabase.</p>
          </div>
        )}
      </div>
    </div>
  );
}