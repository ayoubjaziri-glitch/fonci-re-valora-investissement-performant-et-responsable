import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle, CheckCircle2, Loader2, RefreshCw,
  Database, ChevronRight, X, Info, ArrowRight, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Descriptions détaillées pour chaque type de problème
const ISSUE_DETAILS = {
  image_missing_url: {
    titre: 'Image sans URL',
    explication: (issue) => `L'image "${issue.data?.key}" est enregistrée dans la base de données mais n'a pas d'URL associée. Elle ne s'affichera pas sur le site.`,
    impact: 'Cette image sera absente du site — les visiteurs verront une image cassée ou un espace vide à la place.',
    action: 'Allez dans "Photos & Média" et ajoutez une URL valide pour cette image.',
    section: 'photos',
    severity_color: 'red'
  },
  article_missing_image: {
    titre: 'Article sans image de couverture',
    explication: (issue) => `L'article "${issue.data?.titre}" n'a pas d'image de couverture définie.`,
    impact: 'L\'article s\'affichera sans vignette dans la liste du blog, ce qui le rend moins attractif pour les visiteurs.',
    action: 'Allez dans "Blog & Articles", éditez cet article et ajoutez une image de couverture.',
    section: 'blog',
    severity_color: 'orange'
  },
  article_missing_slug: {
    titre: 'Article sans slug URL',
    explication: (issue) => `L'article "${issue.data?.titre}" n'a pas de slug défini. Le slug est l'identifiant URL de l'article (ex: mon-article).`,
    impact: 'L\'article est inaccessible via son URL — les visiteurs ne peuvent pas y accéder directement et il ne sera pas indexé par Google.',
    action: 'Allez dans "Blog & Articles", éditez cet article et renseignez un slug unique (ex: nom-de-larticle-en-minuscules-sans-espaces).',
    section: 'blog',
    severity_color: 'red'
  },
  realisation_missing_image: {
    titre: 'Réalisation sans photo "avant"',
    explication: (issue) => `La réalisation "${issue.data?.titre}" n'a pas de photo "avant" travaux.`,
    impact: 'Le comparateur avant/après ne pourra pas s\'afficher correctement sur la page de réalisations.',
    action: 'Allez dans "Nos Biens & Réalisations", éditez cette réalisation et ajoutez une photo avant.',
    section: 'realisations',
    severity_color: 'orange'
  },
  realisation_missing_dpe: {
    titre: 'Réalisation avec DPE incomplet',
    explication: (issue) => `La réalisation "${issue.data?.titre}" n'a pas de DPE avant et/ou après renseigné.`,
    impact: 'La progression DPE (ex: F → B) ne s\'affichera pas, ce qui est un argument de valorisation important.',
    action: 'Allez dans "Nos Biens & Réalisations", éditez cette réalisation et renseignez les classes DPE avant et après.',
    section: 'realisations',
    severity_color: 'orange'
  },
  equipe_missing_image: {
    titre: 'Membre de l\'équipe sans photo',
    explication: (issue) => `Le membre "${issue.data?.nom}" (${issue.data?.role || 'rôle non défini'}) n'a pas de photo de profil.`,
    impact: 'La fiche de ce membre s\'affichera sans photo sur la page équipe, ce qui nuit à la crédibilité.',
    action: 'Allez dans "Équipe", éditez ce membre et uploadez ou renseignez l\'URL de sa photo.',
    section: 'equipe',
    severity_color: 'orange'
  },
  tache_orphaned_project: {
    titre: 'Tâche sans projet valide',
    explication: (issue) => `La tâche "${issue.data?.titre}" est associée au projet "${issue.data?.projet}" qui n'existe plus ou est introuvable.`,
    impact: 'Cette tâche n\'apparaît dans aucun projet dans le gestionnaire de tâches.',
    action: 'Allez dans "Gestion des tâches", trouvez cette tâche et réassignez-la à un projet existant.',
    section: 'taches',
    severity_color: 'orange'
  },
  tache_overdue: {
    titre: 'Tâche en retard',
    explication: (issue) => {
      const days = issue.data?.date_echeance
        ? Math.ceil((new Date() - new Date(issue.data.date_echeance)) / (1000 * 60 * 60 * 24))
        : '?';
      return `La tâche "${issue.data?.titre}" (${issue.data?.statut || ''}) avait une échéance dépassée depuis ${days} jour${days > 1 ? 's' : ''}. Responsable : ${issue.data?.assigne_a || 'non assigné'}.`;
    },
    impact: 'Cette tâche bloque potentiellement d\'autres tâches ou projets.',
    action: 'Allez dans "Gestion des tâches" pour mettre à jour le statut ou reporter l\'échéance.',
    section: 'taches',
    severity_color: 'orange'
  },
  crm_missing_contact: {
    titre: 'Investisseur sans coordonnées',
    explication: (issue) => `L'investisseur "${issue.data?.prenom || ''} ${issue.data?.nom || ''}" (statut: ${issue.data?.statut || 'inconnu'}) n'a ni email ni téléphone renseigné.`,
    impact: 'Impossible de recontacter cet investisseur. Il disparaîtra des relances automatiques.',
    action: 'Allez dans "CRM Investisseurs", trouvez cette fiche et ajoutez au moins un moyen de contact.',
    section: 'crm',
    severity_color: 'red'
  },
  acquisition_missing_price: {
    titre: 'Acquisition sans prix',
    explication: (issue) => `L'acquisition "${issue.data?.ville}" (statut: ${issue.data?.statut || 'inconnu'}) n'a pas de prix renseigné.`,
    impact: 'Cette acquisition s\'affichera sans montant dans l\'espace associés, ce qui manque de clarté pour les investisseurs.',
    action: 'Allez dans "Biens & Acquisitions" dans l\'espace associés et renseignez le prix de cette acquisition.',
    section: 'biens',
    severity_color: 'orange'
  },
};

const SECTION_LABELS = {
  photos: 'Photos & Média',
  blog: 'Blog & Articles',
  realisations: 'Nos Biens & Réalisations',
  equipe: 'Équipe',
  taches: 'Gestion des tâches',
  crm: 'CRM Investisseurs',
  biens: 'Espace Associés > Biens',
};

// Panneau de détail d'un problème
function IssueDetailPanel({ issue, onClose }) {
  const detail = ISSUE_DETAILS[issue.type] || {
    titre: 'Problème détecté',
    explication: () => issue.message,
    impact: 'Vérifiez ce problème pour assurer la cohérence du contenu.',
    action: 'Corrigez manuellement dans la section concernée.',
    severity_color: issue.severity === 'high' ? 'red' : 'orange'
  };

  const colorMap = {
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
  };
  const c = colorMap[detail.severity_color] || colorMap.orange;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className={`p-5 border-b ${c.border} ${c.bg} flex items-start justify-between gap-3`}>
          <div className="flex items-center gap-3">
            <AlertCircle className={`h-5 w-5 flex-shrink-0 ${c.text}`} />
            <div>
              <p className={`font-bold ${c.text}`}>{detail.titre}</p>
              <p className="text-xs text-slate-500 mt-0.5">{issue.entity}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Corps */}
        <div className="p-5 space-y-4">
          {/* Ce qui se passe */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <Info className="h-3.5 w-3.5" /> Ce qui se passe
            </p>
            <p className="text-sm text-slate-800 bg-slate-50 rounded-xl p-3 leading-relaxed">
              {typeof detail.explication === 'function' ? detail.explication(issue) : detail.explication}
            </p>
          </div>

          {/* Impact */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" /> Impact
            </p>
            <p className={`text-sm rounded-xl p-3 leading-relaxed ${c.bg} ${c.text}`}>
              {detail.impact}
            </p>
          </div>

          {/* Action corrective */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <ArrowRight className="h-3.5 w-3.5" /> Comment corriger
            </p>
            <p className="text-sm text-slate-800 bg-emerald-50 border border-emerald-200 rounded-xl p-3 leading-relaxed">
              {detail.action}
            </p>
          </div>

          {detail.section && (
            <div className="text-xs text-slate-400 flex items-center gap-1 pt-1">
              <ExternalLink className="h-3.5 w-3.5" />
              Section concernée : <strong className="text-slate-600">{SECTION_LABELS[detail.section] || detail.section}</strong>
            </div>
          )}
        </div>

        <div className="px-5 pb-5">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-[#1A3A52] text-white text-sm font-semibold hover:bg-[#2A4A6F] transition-colors">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuditGlobal() {
  const [auditing, setAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);

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
        results.issues.push({ type: 'image_missing_url', entity: 'SiteImage', id: img.id, message: `Image "${img.key}" sans URL`, severity: 'high', data: img });
      }
    });

    // 2. Vérifier les articles sans images
    articles.forEach(a => {
      if (!a.image_url || a.image_url.trim() === '') {
        results.warnings.push({ type: 'article_missing_image', entity: 'ArticleBlog', id: a.id, message: `Article "${a.titre}" sans image`, severity: 'medium', data: a });
      }
      if (!a.slug || a.slug.trim() === '') {
        results.issues.push({ type: 'article_missing_slug', entity: 'ArticleBlog', id: a.id, message: `Article "${a.titre}" sans slug`, severity: 'high', data: a });
      }
    });

    // 3. Vérifier réalisations
    realisations.forEach(r => {
      if (!r.image_avant || r.image_avant.trim() === '') {
        results.warnings.push({ type: 'realisation_missing_image', entity: 'RealisationBien', id: r.id, message: `Réalisation "${r.titre}" sans image avant`, severity: 'medium', data: r });
      }
      if (!r.dpe_avant || !r.dpe_apres) {
        results.warnings.push({ type: 'realisation_missing_dpe', entity: 'RealisationBien', id: r.id, message: `Réalisation "${r.titre}" DPE incomplet`, severity: 'low', data: r });
      }
    });

    // 4. Vérifier équipe
    equipe.forEach(e => {
      if (!e.image_url || e.image_url.trim() === '') {
        results.warnings.push({ type: 'equipe_missing_image', entity: 'MembreEquipe', id: e.id, message: `Membre "${e.nom}" sans photo`, severity: 'medium', data: e });
      }
    });

    // 5. Vérifier tâches
    const projectNames = new Set(taches.map(t => t.projet).filter(Boolean));
    taches.forEach(t => {
      if (t.projet && !projectNames.has(t.projet)) {
        results.warnings.push({ type: 'tache_orphaned_project', entity: 'Tache', id: t.id, message: `Tâche "${t.titre}" assignée à un projet inexistant`, severity: 'low', data: t });
      }
      if (t.date_echeance && new Date(t.date_echeance) < new Date() && t.statut !== 'Terminé') {
        results.warnings.push({ type: 'tache_overdue', entity: 'Tache', id: t.id, message: `Tâche "${t.titre}" en retard`, severity: 'medium', data: t });
      }
    });

    // 6. Vérifier CRM
    crm.forEach(c => {
      if (!c.email && !c.telephone) {
        results.warnings.push({ type: 'crm_missing_contact', entity: 'InvestisseurCRM', id: c.id, message: `Investisseur "${c.prenom} ${c.nom}" sans contact`, severity: 'high', data: c });
      }
    });

    // 7. Vérifier acquisitions
    acquisitions.forEach(a => {
      if (a.prix === '0 €' || !a.prix) {
        results.warnings.push({ type: 'acquisition_missing_price', entity: 'AcquisitionAssocie', id: a.id, message: `Acquisition "${a.ville}" sans prix`, severity: 'medium', data: a });
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
      {selectedIssue && <IssueDetailPanel issue={selectedIssue} onClose={() => setSelectedIssue(null)} />}
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

          {/* Problèmes critiques */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center gap-3 bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Problèmes critiques ({issuesByType.high?.length || 0})</p>
                <p className="text-xs text-red-700">À corriger en priorité — cliquez pour voir le détail</p>
              </div>
            </div>
            <div className="divide-y">
              {issuesByType.high?.length === 0 ? (
                <div className="p-6 text-center text-emerald-600 flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> Aucun problème critique
                </div>
              ) : (
                issuesByType.high?.map((issue, i) => (
                  <button key={i} onClick={() => setSelectedIssue(issue)}
                    className="w-full p-4 hover:bg-red-50 transition-colors text-left flex items-center gap-3 group">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{issue.message}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{issue.entity}</p>
                    </div>
                    <span className="text-xs text-red-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Voir le détail <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Avertissements */}
          {issuesByType.medium?.length > 0 && (
            <div className="bg-white rounded-2xl border border-orange-200 overflow-hidden">
              <div className="p-5 border-b border-orange-200 flex items-center gap-3 bg-orange-50">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-semibold text-orange-900">Avertissements ({issuesByType.medium?.length})</p>
                  <p className="text-xs text-orange-600">Cliquez sur un avertissement pour voir ce qui se passe</p>
                </div>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {issuesByType.medium?.map((issue, i) => (
                  <button key={i} onClick={() => setSelectedIssue(issue)}
                    className="w-full p-4 hover:bg-orange-50 transition-colors text-left flex items-center gap-3 group">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{issue.message}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{issue.entity}</p>
                    </div>
                    <span className="text-xs text-orange-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Voir le détail <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </button>
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