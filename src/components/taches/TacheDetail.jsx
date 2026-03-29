import React, { useState } from 'react';
import { X, Calendar, User, Tag, Flag, CheckSquare, Plus, Trash2, MessageSquare, ChevronDown, Clock, BarChart2, Mail, Bell } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

const STATUTS = ['A faire', 'En cours', 'En révision', 'Terminé', 'Bloqué'];
const PRIORITES = ['Urgente', 'Haute', 'Moyenne', 'Basse'];

const STATUT_COLORS = {
  'A faire': 'bg-slate-100 text-slate-600',
  'En cours': 'bg-blue-100 text-blue-700',
  'En révision': 'bg-purple-100 text-purple-700',
  'Terminé': 'bg-emerald-100 text-emerald-700',
  'Bloqué': 'bg-red-100 text-red-700',
};

function parseJSON(str, fallback = []) {
  try { return JSON.parse(str || '[]'); } catch { return fallback; }
}

export default function TacheDetail({ tache, onClose, projets = [] }) {
  const qc = useQueryClient();
  const [data, setData] = useState({ ...tache });
  const [newSousTache, setNewSousTache] = useState('');
  const [newComment, setNewComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [sendingNotif, setSendingNotif] = useState(false);
  const [notifMsg, setNotifMsg] = useState('');

  const { data: responsables = [] } = useQuery({
    queryKey: ['responsables'],
    queryFn: () => base44.entities.Responsable.list(),
  });

  const sousTaches = parseJSON(data.sous_taches);
  const commentaires = parseJSON(data.commentaires);
  const tags = (data.tags || '').split(',').map(t => t.trim()).filter(Boolean);

  const prevStatut = tache.statut;

  const save = async (patch) => {
    const updated = { ...data, ...patch };
    setData(updated);
    setSaving(true);
    await base44.entities.Tache.update(tache.id, patch);
    qc.invalidateQueries({ queryKey: ['taches'] });
    setSaving(false);

    // Notifier si tâche terminée
    if (patch.statut === 'Terminé' && prevStatut !== 'Terminé' && updated.responsable_email) {
      sendNotif('completed', tache.id);
    }
  };

  const sendNotif = async (type, tacheId) => {
    setSendingNotif(true);
    try {
      await base44.functions.invoke('notifyResponsable', { type, tacheId: tacheId || tache.id });
      setNotifMsg(`✓ Email "${type}" envoyé`);
      setTimeout(() => setNotifMsg(''), 3000);
    } catch (e) {
      setNotifMsg('Erreur envoi email');
    }
    setSendingNotif(false);
  };

  const handleResponsableChange = async (responsableId) => {
    const resp = responsables.find(r => r.id === responsableId);
    if (!resp) {
      await save({ assigne_a: '', responsable_email: '' });
      return;
    }
    await save({ assigne_a: resp.nom, responsable_email: resp.email });
    // Envoyer email d'assignation
    if (resp.email) {
      setTimeout(() => sendNotif('assigned', tache.id), 500);
    }
  };

  const addSousTache = async () => {
    if (!newSousTache.trim()) return;
    const updated = [...sousTaches, { id: Date.now(), titre: newSousTache, fait: false }];
    setNewSousTache('');
    await save({ sous_taches: JSON.stringify(updated) });
  };

  const toggleSousTache = async (id) => {
    const updated = sousTaches.map(s => s.id === id ? { ...s, fait: !s.fait } : s);
    await save({ sous_taches: JSON.stringify(updated) });
  };

  const deleteSousTache = async (id) => {
    const updated = sousTaches.filter(s => s.id !== id);
    await save({ sous_taches: JSON.stringify(updated) });
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    const updated = [...commentaires, { id: Date.now(), texte: newComment, date: new Date().toISOString(), auteur: 'Admin' }];
    setNewComment('');
    await save({ commentaires: JSON.stringify(updated) });
  };

  const faitCount = sousTaches.filter(s => s.fait).length;
  const pct = sousTaches.length > 0 ? Math.round((faitCount / sousTaches.length) * 100) : (data.avancement || 0);

  const isOverdue = data.date_echeance && new Date(data.date_echeance) < new Date() && data.statut !== 'Terminé';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40" onClick={onClose}>
      <div className="bg-white h-full w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => save({ statut: data.statut === 'Terminé' ? 'A faire' : 'Terminé' })}
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${data.statut === 'Terminé' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-emerald-400'}`}
            >
              {data.statut === 'Terminé' && <span className="text-white text-xs flex items-center justify-center w-full h-full">✓</span>}
            </button>
            <input
              className="flex-1 text-lg font-semibold text-[#1A3A52] border-0 focus:outline-none focus:bg-slate-50 rounded px-1"
              value={data.titre}
              onChange={e => setData(d => ({ ...d, titre: e.target.value }))}
              onBlur={() => save({ titre: data.titre })}
            />
          </div>
          <div className="flex items-center gap-2">
            {saving && <span className="text-xs text-slate-400">Enregistrement…</span>}
            {notifMsg && <span className="text-xs text-emerald-600 font-medium">{notifMsg}</span>}
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Alerte retard */}
        {isOverdue && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-2 flex items-center gap-2">
            <span className="text-red-600 text-sm font-medium">⚠️ Cette tâche est en retard</span>
            {data.responsable_email && (
              <button onClick={() => sendNotif('overdue')} disabled={sendingNotif}
                className="ml-auto text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg font-medium transition-colors">
                <Bell className="h-3 w-3 inline mr-1" />Alerter le responsable
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">

            {/* Métadonnées */}
            <div className="grid grid-cols-2 gap-4">
              {/* Statut */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Statut</p>
                <select
                  value={data.statut}
                  onChange={e => save({ statut: e.target.value })}
                  className={`text-sm font-medium px-3 py-1.5 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A961] ${STATUT_COLORS[data.statut]}`}
                >
                  {STATUTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Priorité */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Priorité</p>
                <select
                  value={data.priorite || 'Moyenne'}
                  onChange={e => save({ priorite: e.target.value })}
                  className="text-sm font-medium px-3 py-1.5 rounded-lg bg-slate-100 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A961]"
                >
                  {PRIORITES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>

              {/* Responsable */}
              <div className="col-span-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <User className="h-3 w-3" /> Responsable
                </p>
                <div className="flex items-center gap-2">
                  <select
                    value={responsables.find(r => r.email === data.responsable_email)?.id || ''}
                    onChange={e => handleResponsableChange(e.target.value)}
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#C9A961]"
                  >
                    <option value="">— Aucun responsable —</option>
                    {responsables.filter(r => r.actif !== false).map(r => (
                      <option key={r.id} value={r.id}>{r.nom} ({r.email})</option>
                    ))}
                  </select>
                  {data.responsable_email && (
                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-2.5 py-1.5 rounded-lg">
                      <Mail className="h-3 w-3" />
                      <span className="max-w-[120px] truncate">{data.responsable_email}</span>
                    </div>
                  )}
                </div>
                {data.responsable_email && (
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => sendNotif('assigned')} disabled={sendingNotif}
                      className="text-xs text-slate-500 hover:text-[#1A3A52] bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Envoyer assignation
                    </button>
                    <button onClick={() => sendNotif('reminder')} disabled={sendingNotif || !data.date_echeance}
                      className="text-xs text-slate-500 hover:text-[#1A3A52] bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-40">
                      <Bell className="h-3 w-3" /> Envoyer rappel
                    </button>
                  </div>
                )}
              </div>

              {/* Projet */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Projet</p>
                <select
                  value={data.projet || ''}
                  onChange={e => save({ projet: e.target.value })}
                  className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-[#C9A961]"
                >
                  <option value="">Sans projet</option>
                  {projets.map(p => <option key={p.id} value={p.nom}>{p.nom}</option>)}
                </select>
              </div>

              {/* Date début */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1"><Calendar className="h-3 w-3" /> Date début</p>
                <input type="date" className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-[#C9A961]"
                  value={data.date_debut || ''}
                  onChange={e => save({ date_debut: e.target.value })}
                />
              </div>

              {/* Date échéance */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Échéance
                  {isOverdue && <span className="text-red-500 ml-1">⚠️ Retard</span>}
                </p>
                <input type="date" className={`text-sm border rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-[#C9A961] ${isOverdue ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                  value={data.date_echeance || ''}
                  onChange={e => save({ date_echeance: e.target.value })}
                />
              </div>

              {/* Avancement */}
              <div className="col-span-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1"><BarChart2 className="h-3 w-3" /> Avancement — {pct}%</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  {sousTaches.length === 0 && (
                    <input type="range" min="0" max="100" value={data.avancement || 0}
                      onChange={e => setData(d => ({ ...d, avancement: +e.target.value }))}
                      onMouseUp={() => save({ avancement: data.avancement })}
                      className="w-24"
                    />
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="col-span-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1"><Tag className="h-3 w-3" /> Tags</p>
                <input
                  className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-[#C9A961]"
                  value={data.tags || ''}
                  placeholder="tag1, tag2, tag3…"
                  onChange={e => setData(d => ({ ...d, tags: e.target.value }))}
                  onBlur={() => save({ tags: data.tags })}
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((t, i) => <span key={i} className="bg-[#C9A961]/15 text-[#8B6F1E] text-xs px-2 py-0.5 rounded-full font-medium">{t}</span>)}
                  </div>
                )}
              </div>

              {/* Jalon */}
              <div className="col-span-2 flex items-center gap-3">
                <input type="checkbox" id="jalon" checked={data.est_jalon || false}
                  onChange={e => save({ est_jalon: e.target.checked })}
                  className="w-4 h-4 accent-[#C9A961]" />
                <label htmlFor="jalon" className="text-sm text-slate-600 font-medium cursor-pointer">Marquer comme jalon</label>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Description</p>
              <textarea
                className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C9A961] resize-none min-h-[80px]"
                placeholder="Ajouter une description…"
                value={data.description || ''}
                onChange={e => setData(d => ({ ...d, description: e.target.value }))}
                onBlur={() => save({ description: data.description })}
              />
            </div>

            {/* Sous-tâches */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                <CheckSquare className="h-3 w-3" /> Sous-tâches {sousTaches.length > 0 && <span className="text-slate-300">({faitCount}/{sousTaches.length})</span>}
              </p>
              <div className="space-y-1.5 mb-3">
                {sousTaches.map(s => (
                  <div key={s.id} className="flex items-center gap-3 group bg-slate-50 rounded-lg px-3 py-2">
                    <button onClick={() => toggleSousTache(s.id)}
                      className={`w-4 h-4 rounded border-2 flex-shrink-0 transition-all flex items-center justify-center ${s.fait ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-emerald-400'}`}>
                      {s.fait && <span className="text-[10px]">✓</span>}
                    </button>
                    <span className={`flex-1 text-sm ${s.fait ? 'line-through text-slate-400' : 'text-slate-700'}`}>{s.titre}</span>
                    <button onClick={() => deleteSousTache(s.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C9A961]"
                  placeholder="Ajouter une sous-tâche…"
                  value={newSousTache}
                  onChange={e => setNewSousTache(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSousTache()}
                />
                <Button size="sm" onClick={addSousTache} className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Commentaires */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                <MessageSquare className="h-3 w-3" /> Commentaires ({commentaires.length})
              </p>
              <div className="space-y-3 mb-3">
                {commentaires.map(c => (
                  <div key={c.id} className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#1A3A52]">{c.auteur}</span>
                      <span className="text-xs text-slate-400">{new Date(c.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-sm text-slate-700">{c.texte}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C9A961]"
                  placeholder="Ajouter un commentaire…"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addComment()}
                />
                <Button size="sm" onClick={addComment} className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}