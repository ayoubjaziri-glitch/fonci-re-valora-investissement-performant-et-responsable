import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Send, Plus, Sparkles, Trash2, ChevronDown, Bot, User, Loader2, Zap, Globe, Database, FileText, CheckSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SUGGESTIONS = [
  "Analyse les statistiques de visiteurs et rédige un rapport complet",
  "Crée un article de blog sur l'investissement immobilier à Vichy",
  "Planifie une roadmap complète pour le prochain trimestre",
  "Rédige une newsletter pour les associés sur l'avancement des projets",
  "Analyse toutes les tâches en retard et propose un plan d'action",
  "Crée 3 nouvelles actualités pour l'espace associés",
  "Optimise le contenu SEO de la page d'accueil",
  "Génère un rapport stratégique sur le portefeuille immobilier",
];

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C9A961] to-[#8B6F1E] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      )}
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {message.tool_calls?.length > 0 && (
          <div className="space-y-1 w-full">
            {message.tool_calls.map((tc, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-500">
                <Database className="h-3 w-3 text-[#C9A961]" />
                <span className="font-mono">{tc.name?.replace(/_/g, ' ')}</span>
                {tc.status === 'completed' && <span className="ml-auto text-emerald-500">✓</span>}
                {(tc.status === 'running' || tc.status === 'in_progress') && <Loader2 className="ml-auto h-3 w-3 animate-spin text-[#C9A961]" />}
              </div>
            ))}
          </div>
        )}
        {message.content && (
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
                  h1: ({ children }) => <h1 className="text-base font-bold my-2 text-[#1A3A52]">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-sm font-bold my-2 text-[#1A3A52]">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold my-1 text-[#1A3A52]">{children}</h3>,
                  code: ({ children }) => <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                  blockquote: ({ children }) => <blockquote className="border-l-2 border-[#C9A961] pl-3 my-2 text-slate-600 italic">{children}</blockquote>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
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

export default function ValoraAI() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!activeConv) return;
    const unsub = base44.agents.subscribeToConversation(activeConv.id, (data) => {
      setMessages(data.messages || []);
    });
    return unsub;
  }, [activeConv?.id]);

  const loadConversations = async () => {
    setLoadingConvs(true);
    const convs = await base44.agents.listConversations({ agent_name: 'valora_ai' });
    setConversations(convs || []);
    setLoadingConvs(false);
  };

  const newConversation = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: 'valora_ai',
      metadata: { name: `Mission ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}` }
    });
    setConversations(prev => [conv, ...prev]);
    setActiveConv(conv);
    setMessages([]);
    inputRef.current?.focus();
  };

  const selectConversation = async (conv) => {
    const full = await base44.agents.getConversation(conv.id);
    setActiveConv(full);
    setMessages(full.messages || []);
  };

  const deleteConversation = async (e, convId) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (activeConv?.id === convId) { setActiveConv(null); setMessages([]); }
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    let conv = activeConv;
    if (!conv) {
      conv = await base44.agents.createConversation({
        agent_name: 'valora_ai',
        metadata: { name: msg.slice(0, 50) }
      });
      setConversations(prev => [conv, ...prev]);
      setActiveConv(conv);
    }

    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: msg }]);

    await base44.agents.addMessage(conv, { role: 'user', content: msg });
    setLoading(false);
  };

  const activeConvName = activeConv?.metadata?.name || 'Nouvelle mission';

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-[600px] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">

      {/* Sidebar conversations */}
      <div className="w-64 bg-[#0F2537] flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C9A961] to-[#8B6F1E] flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Valora AI</p>
              <p className="text-white/40 text-xs">Agent de direction</p>
            </div>
          </div>
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
              <button key={conv.id} onClick={() => selectConversation(conv)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all group ${activeConv?.id === conv.id ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
                <Bot className="h-3.5 w-3.5 flex-shrink-0 opacity-60" />
                <span className="flex-1 text-xs truncate">{conv.metadata?.name || 'Mission'}</span>
                <button onClick={(e) => deleteConversation(e, conv.id)}
                  className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition-all flex-shrink-0">
                  <Trash2 className="h-3 w-3" />
                </button>
              </button>
            ))
          )}
        </div>

        {/* Capacités */}
        <div className="p-3 border-t border-white/10 space-y-1.5">
          <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold px-1">Capacités</p>
          {[
            { icon: Globe, label: 'Recherche web' },
            { icon: Database, label: 'Toutes les données' },
            { icon: FileText, label: 'Rédaction & contenu' },
            { icon: CheckSquare, label: 'Tâches & projets' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-2 py-1">
              <Icon className="h-3 w-3 text-[#C9A961]" />
              <span className="text-white/50 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Zone chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-semibold text-[#1A3A52] flex-1 truncate">{activeConvName}</span>
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#C9A961]/10 to-amber-50 border border-[#C9A961]/30 rounded-full px-3 py-1">
            <Zap className="h-3 w-3 text-[#C9A961]" />
            <span className="text-xs font-semibold text-[#8B6F1E]">Puissance maximale</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!activeConv && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A961] to-[#8B6F1E] flex items-center justify-center mb-4 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1A3A52] mb-2">Valora AI — Agent de Direction</h3>
              <p className="text-slate-500 text-sm max-w-md mb-8">
                Donnez-moi une mission et je l'exécute de A à Z. Gestion du contenu, tâches, projets, rédaction, analyse stratégique — je m'occupe de tout.
              </p>
              <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
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
            <MessageBubble key={i} message={msg} />
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C9A961] to-[#8B6F1E] flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-[#C9A961] animate-spin" />
                  <span className="text-sm text-slate-500">En train de travailler…</span>
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
              placeholder="Donnez-moi une mission… (ex: Crée un article de blog complet sur la rénovation énergétique)"
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
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A961] to-[#8B6F1E] hover:from-[#B8994F] hover:to-[#7A5F0D] flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">
              <Send className="h-4 w-4 text-white" />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-300 mt-2">Shift+Entrée pour sauter une ligne · Entrée pour envoyer</p>
        </div>
      </div>
    </div>
  );
}