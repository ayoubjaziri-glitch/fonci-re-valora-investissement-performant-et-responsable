import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle, CheckCircle2, Loader2, RefreshCw, Eye, EyeOff,
  Database, Link2, Trash2, Plus, Settings, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AuditGlobal() {
  const [activeTab, setActiveTab] = useState('overview');
  const [auditing, setAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState(null);
  const [fixes, setFixes] = useState([]);

  // Récupérer toutes les entités
  const { data: equipe = [] } = useQuery({ queryKey: ['equipe-audit'], queryFn: () => base44.entities.MembreEquipe.list() });
  const { data: articles = [] } = useQuery({ queryKey: ['articles-audit'], queryFn: () => base44.entities.ArticleBlog.list() });
  const { data: realisations = [] } = useQuery({ queryKey: ['realisations-audit'], queryFn: () => base44.entities.RealisationBien.list() });
  const { data: levees = [] } = useQuery({ queryKey: ['levees-audit'], queryFn: () => base44.entities.LeveeFonds.list() });
  const { data: docs = [] } = useQuery({ queryKey: ['docs-audit'], queryFn: () => base44.entities.DocumentAssocie.list() });
  const { data: acquisitions = [] } = useQuery({ queryKey: ['acquisitions-audit'], queryFn: () => base44.entities.AcquisitionAssocie.list() });
  const { data: taches = [] } = useQuery({ queryKey: ['taches-audit'], queryFn: () => base44.entities.Tache.list('-created_date', 500) });
  const { data: crm = [] } = useQuery({ queryKey: ['crm-audit'], queryFn: () => base44.entities.InvestisseurCRM.list() });
  const { data: sections = [] } = useQuery({ queryKey: ['sections-audit'], queryFn: () => base44.entities.SiteSection.list() });
  const { data: contenu = [] } = useQuery({ queryKey: ['contenu-audit'], queryFn: () => base44.entities.SiteContent.list() });
  const { data: maps = [] } = useQuery({ queryKey: ['maps-audit'], queryFn: () => base44.entities.MapLocation.list() });
  const { data: images = [] } = useQuery({ queryKey: ['images-audit'], queryFn: () => base44.entities.SiteImage.list() });

  const runAudit = () => {
    setAuditing(true);
    const results = {
      issues: [],
      warnings: [],
      stats: {}
    };

    // 1. Vérifier les images cassées
    images.forEach(img => {
      if (!img.url || img.url.trim() === '') {
        results.issues.push({
          type: 'image_missing_url',
          entity: 'SiteImage',
          id: img.id,
          message: `Image "${img.key}" sans URL`,
          severity: 'high'
        });
      }
    });

    // 2. Vérifier les articles sans images
    articles.forEach(a => {
      if (!a.image_url || a.image_url.trim() === '') {
        results.warnings.push({
          type: 'article_missing_image',
          entity: 'ArticleBlog',
          id: a.id,
          message: `Article "${a.titre}" sans image`,
          severity: 'medium'
        });
      }
      if (!a.slug || a.slug.trim() === '') {
        results.issues.push({
          type: 'article_missing_slug',
          entity: 'ArticleBlog',
          id: a.id,
          message: `Article "${a.titre}" sans slug`,
          severity: 'high'
        });
      }
    });

    // 3. Vérifier réalisations
    realisations.forEach(r => {
      if (!r.image_avant || r.image_avant.trim() === '') {
        results.warnings.push({
          type: 'realisation_missing_image',
          entity: 'RealisationBien',
          id: r.id,
          message: `Réalisation "${r.titre}" sans image avant`,
          severity: 'medium'
        });
      }
      if (!r.dpe_avant || !r.dpe_apres) {
        results.warnings.push({
          type: 'realisation_missing_dpe',
          entity: 'RealisationBien',
          id: r.id,
          message: `Réalisation "${r.titre}" DPE incomplet`,
          severity: 'low'
        });
      }
    });

    // 4. Vérifier équipe
    equipe.forEach(e => {
      if (!e.image_url || e.image_url.trim() === '') {
        results.warnings.push({
          type: 'equipe_missing_image',
          entity: 'MembreEquipe',
          id: e.id,
          message: `Membre "${e.nom}" sans photo`,
          severity: 'medium'
        });
      }
    });

    // 5. Vérifier tâches orphelines
    const projectNames = new Set(taches.map(t => t.projet).filter(Boolean));
    taches.forEach(t => {
      if (t.projet && !projectNames.has(t.projet)) {
        results.warnings.push({
          type: 'tache_orphaned_project',
          entity: 'Tache',
          id: t.id,
          message: `Tâche "${t.titre}" assignée à un projet inexistant`,
          severity: 'low'
        });
      }
      if (t.date_echeance && new Date(t.date_echeance) < new Date() && t.statut !== 'Terminé') {
        results.warnings.push({
          type: 'tache_overdue',
          entity: 'Tache',
          id: t.id,
          message: `Tâche "${t.titre}" en retard`,
          severity: 'medium'
        });
      }
    });

    // 6. Vérifier CRM - investisseurs sans contact
    crm.forEach(c => {
      if (!c.email && !c.telephone) {
        results.warnings.push({
          type: 'crm_missing_contact',
          entity: 'InvestisseurCRM',
          id: c.id,
          message: `Investisseur "${c.prenom} ${c.nom}" sans contact`,
          severity: 'high'
        });
      }
    });

    // 7. Vérifier acquisitions
    acquisitions.forEach(a => {
      if (a.prix === '0 €' || !a.prix) {
        results.warnings.push({
          type: 'acquisition_missing_price',
          entity: 'AcquisitionAssocie',
          id: a.id,
          message: `Acquisition "${a.ville}" sans prix`,
          severity: 'medium'
        });
      }
    });

    // 8. Stats globales
    results.stats = {
      totalEquipe: equipe.filter(e => e.actif).length,
      totalArticles: articles.filter(a => a.publie).length,
      totalRealisations: realisations.filter(r => r.actif).length,
      totalLevees: levees.length,
      totalDocs: docs.filter(d => d.actif).length,
      totalTaches: taches.filter(t => t.statut !== 'Terminé').length,
      totalCRM: crm.length,
      issueCount: results.issues.length,
      warningCount: results.warnings.length
    };

    setAuditResults(results);
    setAuditing(false);
  };

  const issuesByType = auditResults ? {
    high: [...auditResults.issues, ...auditResults.warnings].filter(i => i.severity === 'high'),
    medium: [...auditResults.issues, ...auditResults.warnings].filter(i => i.severity === 'medium'),
    low: [...auditResults.issues, ...auditResults.warnings].filter(i => i.severity === 'low')
  } : {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1A3A52]">Audit Global du Contenu</h2>
          <p className="text-slate-500 text-sm mt-1">Synchronisez et vérifiez la cohérence de tous les contenus</p>
        </div>
        <Button
          onClick={runAudit}
          disabled={auditing}
          className="bg-[#1A3A52] hover:bg-[#2A4A6F] gap-2"
        >
          {auditing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {auditing ? 'Audit en cours...' : 'Lancer l\'audit'}
        </Button>
      </div>

      {!auditResults ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Database className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Cliquez sur "Lancer l'audit" pour analyser vos contenus</p>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-slate-500 text-xs font-medium mb-1">Problèmes critiques</p>
              <p className={`text-2xl font-bold ${issuesByType.high?.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {issuesByType.high?.length || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-slate-500 text-xs font-medium mb-1">Avertissements</p>
              <p className={`text-2xl font-bold ${issuesByType.medium?.length > 0 ? 'text-orange-600' : 'text-emerald-600'}`}>
                {issuesByType.medium?.length || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-slate-500 text-xs font-medium mb-1">Contenu actif</p>
              <p className="text-2xl font-bold text-blue-600">{auditResults.stats.totalArticles}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-slate-500 text-xs font-medium mb-1">Tâches en cours</p>
              <p className="text-2xl font-bold text-purple-600">{auditResults.stats.totalTaches}</p>
            </div>
          </div>

          {/* Issues détaillées */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center gap-3 bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Problèmes critiques ({issuesByType.high?.length || 0})</p>
                <p className="text-xs text-red-700">À corriger en priorité</p>
              </div>
            </div>
            <div className="divide-y">
              {issuesByType.high?.length === 0 ? (
                <div className="p-6 text-center text-emerald-600 flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> Aucun problème critique
                </div>
              ) : (
                issuesByType.high?.map((issue, i) => (
                  <div key={i} className="p-4 hover:bg-red-50 transition-colors">
                    <p className="text-sm font-medium text-slate-800">{issue.message}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {issue.entity} • ID: {issue.id}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Avertissements */}
          {issuesByType.medium?.length > 0 && (
            <div className="bg-white rounded-2xl border border-orange-200 overflow-hidden">
              <div className="p-5 border-b border-orange-200 flex items-center gap-3 bg-orange-50">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <p className="font-semibold text-orange-900">Avertissements ({issuesByType.medium?.length})</p>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {issuesByType.medium?.map((issue, i) => (
                  <div key={i} className="p-4 hover:bg-orange-50 transition-colors text-sm">
                    <p className="font-medium text-slate-800">{issue.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{issue.entity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats détaillées */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="font-semibold text-[#1A3A52] mb-4">Résumé des contenus</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-slate-500 text-xs mb-1">Équipe active</p>
                <p className="text-lg font-bold text-slate-800">{auditResults.stats.totalEquipe}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">Articles publiés</p>
                <p className="text-lg font-bold text-slate-800">{auditResults.stats.totalArticles}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">Réalisations</p>
                <p className="text-lg font-bold text-slate-800">{auditResults.stats.totalRealisations}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">Investisseurs CRM</p>
                <p className="text-lg font-bold text-slate-800">{auditResults.stats.totalCRM}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}