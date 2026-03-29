import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Send, Plus, Sparkles, Trash2, Bot, User, Loader2, Zap, Globe,
  Database, FileText, CheckSquare, Calendar, Share2, Check, X,
  RotateCcw, Image, Linkedin, Instagram, AlertTriangle, ChevronDown,
  ChevronUp, Play, Eye, Clock, Brain, Edit2, Power, Tag
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const CATEGORIES = ['Stratégie', 'Patrimoine', 'Finances', 'Équipe', 'Investisseurs', 'Communication', 'Marché', 'Autre'];
const CAT_COLORS = {
  'Stratégie': 'bg-blue-100 text-blue-700', 'Patrimoine': 'bg-amber-100 text-amber-700',
  'Finances': 'bg-green-100 text-green-700', 'Équipe': 'bg-purple-100 text-purple-700',
  'Investisseurs': 'bg-orange-100 text-orange-700', 'Communication': 'bg-pink-100 text-pink-700',
  'Marché': 'bg-teal-100 text-teal-700', 'Autre': 'bg-slate-100 text-slate-600',
};
const EMPTY_NOTE = { titre: '', categorie: 'Autre', contenu: '', actif: true };

const SUGGESTIONS = [
  "Rédige un article de blog SEO sur l'investissement immobilier à Vichy avec image",
  "Génère 3 posts LinkedIn pour cette semaine avec visuels",
  "Crée un calendrier éditorial complet pour avril avec posts Instagram",
  "Rédige une newsletter pour les associés sur nos derniers projets",
  "Modifie le texte d'accroche de la page d'accueil avec un ton plus percutant",
  "Crée 2 posts Instagram sur nos rénovations avec images",
  "Analyse notre présence et propose une stratégie de contenu sur 1 mois",
  "Génère un rapport sur l'avancement de nos chantiers",
];

// Détecter si le message contient un plan validable
function isPlanMessage(content) {
  return content && (
    content.includes('## 📋 Mon plan d\'action') ||
    content.includes('Valides-tu ce plan') ||
    content.includes('Mon plan d\'action')
  );
}

// Appel proxy existant
async function agentProxy(action, payload = {}) {
  const res = await base44.functions.invoke('valoraAiProxy', { action, payload });
  if (!res.data?.success) throw new Error(res.data?.error || 'Erreur proxy agent');
  return res.data.data;
}

// Appel executor
async function executor(action, payload = {}) {
  const res = await base44.functions.invoke('valoraAiExecutor', { action, payload });
  if (!res.data?.success) throw new Error(res.data?.error || 'Erreur executor');
  return res.data;
}

// ─── Plan Approval Card ───────────────────────────────────────────────────────
function PlanApprovalCard({ message, onApprove, onReject, isExecuting, convId }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-2xl border-2 border-[#C9A961] bg-amber-50/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#1A3A52] to-[#2A4A6F]">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#C9A961]" />
          <span className="text-white font-semibold text-sm">Plan d'action proposé</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-xs">En attente de validation</span>
          <button onClick={() => setExpanded(v => !v)} className="text-white/60 hover:text-white">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="px-4 py-3">
          <ReactMarkdown
            className="text-sm prose prose-sm max-w-none prose-headings:text-[#1A3A52] prose-strong:text-[#1A3A52]"
            components={{
              p: ({ children }) => <p className="my-1 leading-relaxed text-slate-700">{children}</p>,
              ul: ({ children }) => <ul className="my-1 ml-4 list-disc space-y-0.5">{children}</ul>,
              ol: ({ children }) => <ol className="my-1 ml-4 list-decimal space-y-0.5">{children}</ol>,
              li: ({ children }) => <li className="text-sm text-slate-700">{children}</li>,
              h2: ({ children }) => <h2 className="text-base font-bold my-2 text-[#1A3A52]">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold my-1 text-[#1A3A52]">{children}</h3>,
              strong: ({ children }) => <strong className="font-semibold text-[#1A3A52]">{children}</strong>,
            }}
          >{message.content}</ReactMarkdown>
        </div>
      )}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-t border-amber-200">
        <Button
          onClick={() => onApprove(message)}
          disabled={isExecuting}
          className="flex-1 bg-[#1A3A52] hover:bg-[#2A4A6F] text-white gap-2"
        >
          {isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {isExecuting ? 'Exécution en cours…' : '✓ Valider & Exécuter'}
        </Button>
        <Button
          onClick={() => onReject(message)}
          disabled={isExecuting}
          variant="outline"
          className="border-red-200 text-red-500 hover:bg-red-50 gap-2"
        >
          <X className="h-4 w-4" /> Annuler
        </Button>
      </div>
    </div>
  );
}

// ─── Execution Result Card ────────────────────────────────────────────────────
function ExecutionResultCard({ results, onRevert }) {
  const [reverted, setReverted] = useState(false);
  const [reverting, setReverting] = useState(false);

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  const handleRevert = async () => {
    if (!confirm('Annuler toutes les actions effectuées ?')) return;
    setReverting(true);
    const actionIds = results.filter(r => r.success && r.actionId).map(r => r.actionId);
    await onRevert(actionIds);
    setReverted(true);
    setReverting(false);
  };

  if (reverted) {
    return (
      <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 flex items-center gap-3">
        <RotateCcw className="h-4 w-4 text-orange-500" />
        <span className="text-sm text-orange-700 font-medium">Actions annulées — retour à l'état précédent.</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-white" />
          <span className="text-white font-semibold text-sm">
            {successCount} action{successCount > 1 ? 's' : ''} exécutée{successCount > 1 ? 's' : ''}
            {failCount > 0 && ` · ${failCount} erreur${failCount > 1 ? 's' : ''}`}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRevert}
          disabled={reverting}
          className="text-white/70 hover:text-white hover:bg-white/10 gap-1.5 text-xs"
        >
          {reverting ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
          Revert
        </Button>
      </div>
      <div className="px-4 py-3 space-y-2">
        {results.map((r, i) => (
          <div key={i} className={`flex items-start gap-3 text-sm ${r.success ? 'text-emerald-800' : 'text-red-700'}`}>
            {r.success
              ? <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              : <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />}
            <div className="flex-1">
              <span className="font-medium">{r.label}</span>
              {r.error && <p className="text-xs text-red-500 mt-0.5">{r.error}</p>}
              {r.imageUrl && (
                <div className="mt-2">
                  <img src={r.imageUrl} alt="Générée" className="h-24 w-auto rounded-lg object-cover" />
                </div>
              )}
              {r.type === 'linkedin_post' && r.success && (
                <div className="mt-1 flex items-center gap-2">
                  <a
                    href="https://www.linkedin.com/company/la-fonciere-patrimoniale/posts/"
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded flex items-center gap-1 hover:bg-blue-700"
                  >
                    <Linkedin className="h-3 w-3" /> Publier sur LinkedIn
                  </a>
                  <span className="text-xs text-slate-400">(contenu copié ci-dessus)</span>
                </div>
              )}
              {r.type === 'instagram_post' && r.success && (
                <div className="mt-1">
                  <a
                    href="https://www.instagram.com/lafoncierepatrimoniale"
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded flex items-center gap-1 w-fit hover:opacity-90"
                  >
                    <Instagram className="h-3 w-3" /> Publier sur Instagram
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ message, onApprove, onReject, isExecuting, convId }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  if (isSystem) return null;

  const hasPlan = !isUser && isPlanMessage(message.content);

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C9A961] to-[#8B6F1E] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      )}
      <div className={`max-w-[88%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        {message.tool_calls?.length > 0 && (
          <div className="space-y-1 w-full">
            {message.tool_calls.map((tc, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-500">
                <Database className="h-3 w-3 text-[#C9A961]" />
                <span className="font-mono">{tc.name?.replace(/_/g, ' ')}</span>
                {tc.status === 'completed' && <span className="ml-auto text-emerald-500">✓</span>}
                {(tc.status === 'running' || tc.status === 'in_progress') && (
                  <Loader2 className="ml-auto h-3 w-3 animate-spin text-[#C9A961]" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Plan avec boutons validation */}
        {hasPlan && !message.approved && !message.rejected ? (
          <PlanApprovalCard
            message={message}
            onApprove={onApprove}
            onReject={onReject}
            isExecuting={isExecuting}
            convId={convId}
          />
        ) : message.executionResults ? (
          // Résultats d'exécution
          <ExecutionResultCard
            results={message.executionResults}
            onRevert={async (ids) => {
              await executor('revertActions', { actionIds: ids });
            }}
          />
        ) : message.content ? (
          <div className={`rounded-2xl px-4 py-3 ${isUser
            ? 'bg-[#1A3A52] text-white rounded-br-sm'
            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
          }`}>
            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            ) : (
              <ReactMarkdown
                className="text-sm prose prose-sm max-w-none prose-headings:text-[#1A3A52] prose-strong:text-[#1A3A52] prose-a:text-[#C9A961]"
                components={{
                  p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="my-1 ml-4 list-disc space-y-0.5">{children}</ul>,
                  ol: ({ children }) => <ol className="my-1 ml-4 list-decimal space-y-0.5">{children}</ol>,
                  li: ({ children }) => <li className="text-sm">{children}</li>,
                  h2: ({ children }) => <h2 className="text-base font-bold my-2 text-[#1A3A52]">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold my-1 text-[#1A3A52]">{children}</h3>,
                  code: ({ children }) => <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-[#C9A961] pl-3 my-2 text-slate-600 italic">{children}</blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-2">
                      <table className="text-xs border-collapse w-full">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => <th className="border border-slate-200 bg-slate-50 px-2 py-1 text-left font-semibold">{children}</th>,
                  td: ({ children }) => <td className="border border-slate-200 px-2 py-1">{children}</td>,
                }}
              >{message.content}</ReactMarkdown>
            )}
          </div>
        ) : null}

        {message.approved && !message.executionResults && (
          <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <Check className="h-3.5 w-3.5" /> Plan validé — exécution en cours…
          </div>
        )}
        {message.rejected && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <X className="h-3.5 w-3.5" /> Plan annulé par l'utilisateur
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-[#1A3A52] flex items-center justify-center flex-shrink-0 mt-0.5">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
}

// ─── Panneau Mémoire ──────────────────────────────────────────────────────────
function MemoirePanel() {
  const qc = useQueryClient();
  const [form, setForm] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(''); // 'success', 'error', ''
  const fileInputRef = useRef(null);

  const { data: notes = [] } = useQuery({
    queryKey: ['valora-memoire'],
    queryFn: () => base44.entities.ValoraAIMemoire.list('-created_date', 200),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['valora-memoire'] });
  const createMut = useMutation({ mutationFn: (d) => base44.entities.ValoraAIMemoire.create(d), onSuccess: invalidate });
  const updateMut = useMutation({ mutationFn: ({ id, data }) => base44.entities.ValoraAIMemoire.update(id, data), onSuccess: invalidate });
  const deleteMut = useMutation({ mutationFn: (id) => base44.entities.ValoraAIMemoire.delete(id), onSuccess: invalidate });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus('');
    try {
      // 1. Upload le fichier
      const uploadRes = await base44.integrations.Core.UploadFile({ file });
      
      // 2. Extrait le contenu avec meilleur support Word/Excel/PDF
      const extractRes = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url: uploadRes.file_url,
        json_schema: {
          type: 'object',
          properties: {
            content: { type: 'string' },
            text: { type: 'string' },
            data: { type: 'string' }
          }
        }
      });

      let extractedContent = '';
      if (extractRes?.status === 'success' && extractRes.output) {
        // Tente différentes clés
        extractedContent = extractRes.output.content || 
                         extractRes.output.text || 
                         extractRes.output.data ||
                         (typeof extractRes.output === 'string' ? extractRes.output : '');
        
        // Si c'est encore vide, stringify
        if (!extractedContent && typeof extractRes.output === 'object') {
          extractedContent = Object.values(extractRes.output)
            .filter(v => typeof v === 'string' && v.trim())
            .join('\n');
        }
      }

      if (extractedContent && extractedContent.trim().length > 0) {
        setForm(f => ({
          ...f,
          titre: f?.titre || file.name.replace(/\.[^/.]+$/, ''),
          contenu: (f?.contenu || '') + (f?.contenu ? '\n\n' : '') + '📄 ' + file.name + ':\n' + extractedContent.trim()
        }));
        setUploadStatus('success');
        setTimeout(() => setUploadStatus(''), 2000);
      } else {
        throw new Error('Aucun contenu extrait du fichier.');
      }
    } catch (err) {
      console.error('Erreur extraction:', err);
      setUploadStatus('error');
      alert('❌ Impossible d\'extraire le contenu. Fichiers acceptés : PDF, Word (.docx), Excel (.xlsx), CSV, TXT');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!form.titre?.trim() || !form.contenu?.trim()) return;
    if (form.id) await updateMut.mutateAsync({ id: form.id, data: { titre: form.titre, categorie: form.categorie, contenu: form.contenu, actif: form.actif } });
    else await createMut.mutateAsync({ titre: form.titre, categorie: form.categorie, contenu: form.contenu, actif: form.actif ?? true });
    setForm(null);
  };

  const activeCount = notes.filter(n => n.actif).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <div>
          <p className="text-white font-semibold text-sm flex items-center gap-2"><Brain className="h-4 w-4 text-[#C9A961]" /> Mémoire AI</p>
          <p className="text-white/40 text-xs mt-0.5">{activeCount} note{activeCount !== 1 ? 's' : ''} active{activeCount !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setForm({ ...EMPTY_NOTE })}
          className="w-8 h-8 bg-[#C9A961] hover:bg-[#B8994F] rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
          <Plus className="h-4 w-4 text-[#1A3A52]" />
        </button>
      </div>

      {/* Formulaire */}
      {form && (
        <div className="p-3 bg-[#0A1E2F] border-b border-white/10 space-y-2 flex-shrink-0">
          <Input placeholder="Titre (ex: Projet Lyon 2025)"
            value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
            className="bg-white/10 border-white/20 text-white placeholder-white/30 text-xs h-8" />
          <select value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
            className="w-full px-2 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs focus:outline-none">
            {CATEGORIES.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
          </select>
          <Textarea placeholder="Contexte, chiffres, décisions, informations clés à mémoriser..."
            value={form.contenu} onChange={e => setForm(f => ({ ...f, contenu: e.target.value }))}
            rows={4} className="bg-white/10 border-white/20 text-white placeholder-white/30 text-xs resize-none" />
          <div className="flex gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={`flex-1 py-1.5 text-xs rounded-lg transition-colors disabled:opacity-40 ${
                uploadStatus === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500' :
                uploadStatus === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500' :
                'text-white/50 hover:text-white border border-white/20'
              }`}>
              {uploading ? 'Upload...' : uploadStatus === 'success' ? '✓ Contenu extrait' : uploadStatus === 'error' ? '✗ Erreur extraction' : '📎 Ajouter doc'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.txt,.doc,.docx,.xlsx,.csv"
            />
            <button onClick={() => setForm(null)} className="flex-1 py-1.5 text-xs text-white/50 hover:text-white border border-white/20 rounded-lg transition-colors">Annuler</button>
            <button onClick={handleSave} disabled={!form.titre?.trim() || !form.contenu?.trim()}
              className="flex-1 py-1.5 text-xs bg-[#C9A961] text-[#1A3A52] font-bold rounded-lg hover:bg-[#B8994F] disabled:opacity-40 transition-colors">
              Enregistrer
            </button>
          </div>
        </div>
      )}

      {/* Liste notes */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {notes.length === 0 && !form && (
          <div className="text-center py-8">
            <Brain className="h-8 w-8 text-white/10 mx-auto mb-2" />
            <p className="text-white/30 text-xs">Aucune note de mémoire</p>
            <p className="text-white/20 text-xs mt-1">Ajoutez du contexte pour enrichir les connaissances de l'IA</p>
          </div>
        )}
        {notes.map(note => (
          <div key={note.id} className={`rounded-xl p-2.5 border transition-all ${note.actif ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-50'}`}>
            <div className="flex items-start justify-between gap-1.5 mb-1">
              <p className="text-white text-xs font-semibold flex-1 truncate">{note.titre}</p>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => updateMut.mutate({ id: note.id, data: { actif: !note.actif } })}
                  className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${note.actif ? 'text-emerald-400 hover:text-emerald-300' : 'text-white/30 hover:text-white/60'}`}>
                  <Power className="h-3 w-3" />
                </button>
                <button onClick={() => setForm({ ...note })} className="w-5 h-5 rounded flex items-center justify-center text-white/30 hover:text-white/70 transition-colors">
                  <Edit2 className="h-3 w-3" />
                </button>
                <button onClick={() => { if (confirm('Supprimer ?')) deleteMut.mutate(note.id); }}
                  className="w-5 h-5 rounded flex items-center justify-center text-white/30 hover:text-red-400 transition-colors">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${CAT_COLORS[note.categorie] || CAT_COLORS['Autre']}`}>{note.categorie}</span>
            <p className="text-white/40 text-xs mt-1.5 line-clamp-2">{note.contenu}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ValoraAI ────────────────────────────────────────────────────────────
export default function ValoraAI() {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [sidebarTab, setSidebarTab] = useState('missions'); // 'missions' | 'memoire'
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const activeConvRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    loadConversations();
    return () => clearInterval(pollIntervalRef.current);
  }, []);

  // Scroll uniquement au chargement initial, pas à chaque message
  useEffect(() => {
    if (messages.length === 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [activeConvId]);

  const startPolling = (convId) => {
    clearInterval(pollIntervalRef.current);
    let pollCount = 0;
    const maxPolls = 150; // Max 5 min (150 * 2s)
    
    pollIntervalRef.current = setInterval(async () => {
      pollCount++;
      if (pollCount > maxPolls) {
        clearInterval(pollIntervalRef.current);
        setLoading(false);
        return;
      }

      try {
        const conv = await agentProxy('getConversation', { conversationId: convId });
        const rawMessages = conv.messages || [];

        // Préserver les états locaux
        setMessages(prev => {
          return rawMessages.map((newMsg, i) => {
            const existing = prev[i];
            if (existing && (existing.approved || existing.rejected || existing.executionResults)) {
              return { ...newMsg, approved: existing.approved, rejected: existing.rejected, executionResults: existing.executionResults };
            }
            return newMsg;
          });
        });

        const lastMsg = rawMessages[rawMessages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          setLoading(false);
          clearInterval(pollIntervalRef.current);
        }
      } catch (e) {
        console.error('Polling error:', e);
      }
    }, 2000);
  };

  const stopPolling = () => clearInterval(pollIntervalRef.current);

  const loadConversations = async () => {
    setLoadingConvs(true);
    try {
      const convs = await agentProxy('listConversations', {});
      setConversations(convs || []);
    } catch (e) {
      console.error(e);
    }
    setLoadingConvs(false);
  };

  const newConversation = async () => {
    const conv = await agentProxy('createConversation', {
      metadata: { name: `Mission ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}` }
    });
    activeConvRef.current = conv;
    setConversations(prev => [conv, ...prev]);
    setActiveConvId(conv.id);
    setMessages([]);
    stopPolling();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const selectConversation = async (conv) => {
    stopPolling();
    const full = await agentProxy('getConversation', { conversationId: conv.id });
    activeConvRef.current = full;
    setActiveConvId(full.id);
    setMessages(full.messages || []);
  };

  const deleteConversation = async (e, convId) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (activeConvId === convId) {
      stopPolling();
      activeConvRef.current = null;
      setActiveConvId(null);
      setMessages([]);
    }
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    let conv = activeConvRef.current;
    if (!conv) {
      conv = await agentProxy('createConversation', {
        metadata: { name: msg.slice(0, 50) }
      });
      activeConvRef.current = conv;
      setConversations(prev => [conv, ...prev]);
      setActiveConvId(conv.id);
    }

    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: msg }]);

    // D'abord : générer un plan via l'executor (pas l'agent)
    // On envoie quand même à l'agent pour avoir le contexte conversationnel
    await agentProxy('addMessage', { conversation: conv, content: msg });
    startPolling(conv.id);
  };

  // Approuver un plan → parser + exécuter
  const handleApprove = async (planMessage) => {
    setIsExecuting(true);
    stopPolling(); // Arrêter le polling pendant l'exécution

    // Marquer le message comme approuvé
    setMessages(prev => prev.map(m =>
      m === planMessage ? { ...m, approved: true } : m
    ));

    try {
      // Parser le plan en actions concrètes
      const parseResult = await executor('parsePlan', {
        planText: planMessage.content,
        userRequest: messages.filter(m => m.role === 'user').slice(-1)[0]?.content || ''
      });

      const { actions, has_social_media } = parseResult.parsed;

      // Pour les posts réseaux sociaux : générer les images d'abord si nécessaire
      const enrichedActions = [];
      for (const act of actions) {
        if ((act.type === 'linkedin_post' || act.type === 'instagram_post') && act.data?.image_prompt) {
          const imgResult = await executor('generateImage', { prompt: act.data.image_prompt });
          act.data.image_url = imgResult.url;
        }
        enrichedActions.push(act);
      }

      // Exécuter toutes les actions
      const execResult = await executor('executeActions', {
        actions: enrichedActions,
        conversationId: activeConvId
      });

      // Mettre à jour le message avec les résultats
      setMessages(prev => prev.map(m =>
        m === planMessage ? { ...m, approved: true, executionResults: execResult.results } : m
      ));

      // Envoyer un message de résumé dans la conversation
      const successCount = execResult.results.filter(r => r.success).length;
      const summaryMsg = `✅ **${successCount} action${successCount > 1 ? 's' : ''} exécutée${successCount > 1 ? 's' : ''}** avec succès.\n\nTu peux utiliser le bouton **Revert** pour annuler si nécessaire.${has_social_media ? '\n\n📱 Pour les publications réseaux sociaux, clique sur les liens pour les poster directement.' : ''}`;

      if (activeConvRef.current) {
        await agentProxy('addMessage', {
          conversation: activeConvRef.current,
          content: summaryMsg
        });
      }

    } catch (err) {
      setMessages(prev => prev.map(m =>
        m === planMessage ? { ...m, approved: false, executionResults: [{ success: false, label: 'Erreur', error: err.message }] } : m
      ));
    }

    setIsExecuting(false);
  };

  const handleReject = (planMessage) => {
    setMessages(prev => prev.map(m =>
      m === planMessage ? { ...m, rejected: true } : m
    ));
    // Envoyer un message d'annulation
    if (activeConvRef.current) {
      agentProxy('addMessage', {
        conversation: activeConvRef.current,
        content: "L'utilisateur a annulé ce plan. Propose une alternative ou demande des précisions."
      });
    }
  };

  const activeConvName = conversations.find(c => c.id === activeConvId)?.metadata?.name
    || (activeConvId ? 'Mission en cours' : 'Nouvelle mission');

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-[600px] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">

      {/* Sidebar */}
      <div className="w-64 bg-[#0F2537] flex flex-col flex-shrink-0">
        {/* Logo + onglets */}
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C9A961] to-[#8B6F1E] flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Valora AI</p>
              <p className="text-white/40 text-xs">Validation avant action</p>
            </div>
          </div>
          {/* Onglets */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1">
            <button onClick={() => setSidebarTab('missions')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${sidebarTab === 'missions' ? 'bg-[#C9A961] text-[#1A3A52]' : 'text-white/50 hover:text-white'}`}>
              <Bot className="h-3 w-3" /> Missions
            </button>
            <button onClick={() => setSidebarTab('memoire')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${sidebarTab === 'memoire' ? 'bg-[#C9A961] text-[#1A3A52]' : 'text-white/50 hover:text-white'}`}>
              <Brain className="h-3 w-3" /> Mémoire
            </button>
          </div>
        </div>

        {/* Contenu sidebar selon onglet */}
        {sidebarTab === 'missions' ? (
          <>
            <div className="p-2 flex-shrink-0">
              <button onClick={newConversation}
                className="w-full flex items-center justify-center gap-2 py-2 bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] rounded-xl text-sm font-bold transition-colors">
                <Plus className="h-4 w-4" /> Nouvelle mission
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {loadingConvs ? (
                <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 text-white/30 animate-spin" /></div>
              ) : conversations.length === 0 ? (
                <p className="text-white/30 text-xs text-center py-8">Aucune mission encore</p>
              ) : (
                conversations.map(conv => (
                  <div key={conv.id} onClick={() => selectConversation(conv)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all group cursor-pointer ${
                      activeConvId === conv.id ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
                    <Bot className="h-3.5 w-3.5 flex-shrink-0 opacity-60" />
                    <span className="flex-1 text-xs truncate">{conv.metadata?.name || 'Mission'}</span>
                    <span onClick={(e) => deleteConversation(e, conv.id)}
                      className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition-all flex-shrink-0 p-0.5 rounded cursor-pointer">
                      <Trash2 className="h-3 w-3" />
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-hidden">
            <MemoirePanel />
          </div>
        )}
      </div>

      {/* Zone chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-semibold text-[#1A3A52] flex-1 truncate">{activeConvName}</span>
          <div className="flex items-center gap-1.5 bg-amber-50 border border-[#C9A961]/30 rounded-full px-3 py-1">
            <AlertTriangle className="h-3 w-3 text-[#C9A961]" />
            <span className="text-xs font-semibold text-[#8B6F1E]">Mode Validation Obligatoire</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!activeConvId && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A961] to-[#8B6F1E] flex items-center justify-center mb-4 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1A3A52] mb-2">Valora AI</h3>
              <p className="text-slate-500 text-sm max-w-md mb-1">Je propose un <strong>plan complet</strong> avant d'agir.</p>
              <p className="text-slate-400 text-xs max-w-md mb-2">Tu valides, puis j'exécute tout. Un bouton <strong>Revert</strong> est toujours disponible.</p>
              <div className="flex items-center gap-4 text-xs text-slate-300 mb-8">
                <span className="flex items-center gap-1"><Check className="h-3 w-3 text-emerald-400" /> Validation unique</span>
                <span className="flex items-center gap-1"><RotateCcw className="h-3 w-3 text-orange-400" /> Revert possible</span>
                <span className="flex items-center gap-1"><Image className="h-3 w-3 text-blue-400" /> Images générées</span>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full max-w-xl">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)}
                    className="text-left text-xs bg-white border border-slate-200 hover:border-[#C9A961] hover:bg-amber-50 rounded-xl px-3 py-2.5 text-slate-600 hover:text-[#1A3A52] transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.filter(m => m.role !== 'system').map((msg, i) => (
            <MessageBubble
              key={i}
              message={msg}
              onApprove={handleApprove}
              onReject={handleReject}
              isExecuting={isExecuting}
              convId={activeConvId}
            />
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C9A961] to-[#8B6F1E] flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-[#C9A961] animate-spin" />
                  <span className="text-sm text-slate-500">En train de réfléchir…</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-[#C9A961] focus-within:bg-white transition-all">
            <textarea
              ref={inputRef}
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none max-h-32 min-h-[20px]"
              placeholder="Décris ce que tu veux faire… Je te proposerai un plan avant d'agir."
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={1}
              onInput={e => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading || isExecuting}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A961] to-[#8B6F1E] hover:from-[#B8994F] hover:to-[#7A5F0D] flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Send className="h-4 w-4 text-white" />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-300 mt-2">L'AI propose toujours un plan — tu valides avant toute exécution</p>
        </div>
      </div>
    </div>
  );
}