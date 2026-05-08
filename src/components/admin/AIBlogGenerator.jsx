import React, { useState } from 'react';
import { generateBlogArticle } from '@/lib/aiService';
import { db } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Wand2, Loader2, CheckCircle2, Sparkles } from 'lucide-react';

const CATEGORIES = ["Marché", "Investissement", "Fiscalité", "Rénovation", "Gouvernance"];

function slugify(str) {
  if (!str) return 'article-' + Date.now();
  return String(str).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AIBlogGenerator({ onClose, onSuccess }) {
  const [step, setStep] = useState('config'); // 'config' | 'generating' | 'done'
  const [sujet, setSujet] = useState('');
  const [categorie, setCategorie] = useState('Investissement');
  const [motsCles, setMotsCles] = useState('');
  const [angle, setAngle] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!sujet.trim()) { setError('Veuillez entrer un sujet.'); return; }
    setError('');
    setStep('generating');
    try {
      const articleData = await generateBlogArticle({
        sujet,
        categorie,
        motsCles,
        angle,
      });

      if (articleData.error) throw new Error(articleData.error);

      await db.ArticleBlog.create(articleData);
      setStep('done');
      onSuccess();
    } catch (err) {
      console.error('AI Blog generation error:', err);
      setError("Une erreur s'est produite lors de la génération. Veuillez réessayer.");
      setStep('config');
    }
  };

  if (step === 'generating') {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-gradient-to-br from-[#C9A961] to-[#B8994F] rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          </div>
          <h3 className="text-xl font-serif text-[#1A3A52] mb-3">L'IA rédige votre article…</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
          Génération d'un contenu complet et optimisé SEO avec <strong>Gemini Flash</strong>.<br />
          Cela peut prendre 20 à 45 secondes pour 3000-5000 mots.
          </p>
          <div className="mt-6 flex flex-col gap-2 text-xs text-slate-400">
          <span>✦ Rédaction de 3000-5000 mots</span>
            <span>✦ Structure SEO optimisée</span>
            <span>✦ Publication automatique</span>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-serif text-[#1A3A52] mb-3">Article publié avec succès !</h3>
          <p className="text-slate-500 text-sm mb-8">L'article a été généré, optimisé SEO et publié directement sur votre blog.</p>
          <Button onClick={onClose} className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white px-8">
            Voir les articles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A3A52] to-[#2A4A6F] px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C9A961] rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-[#1A3A52]" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Générer un article avec l'IA</h2>
              <p className="text-white/60 text-xs">Gemini Flash — Article complet & SEO</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-8 space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1">Sujet de l'article <span className="text-red-400">*</span></label>
            <Input
              value={sujet}
              onChange={e => { setSujet(e.target.value); setError(''); }}
              placeholder="Ex: Comment investir dans l'immobilier avec peu d'apport en 2025 ?"
              className="text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1">Catégorie</label>
            <select value={categorie} onChange={e => setCategorie(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md text-sm bg-white">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1">Mots-clés SEO <span className="text-slate-400 font-normal">(optionnel)</span></label>
            <Input
              value={motsCles}
              onChange={e => setMotsCles(e.target.value)}
              placeholder="Ex: immeuble de rapport, rendement locatif, Vichy, PEA-PME..."
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1">Angle éditorial <span className="text-slate-400 font-normal">(optionnel)</span></label>
            <Textarea
              rows={2}
              value={angle}
              onChange={e => setAngle(e.target.value)}
              placeholder="Ex: Guide pratique pour primo-investisseurs, ton expert et rassurant..."
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            <strong>✦ IA Performante :</strong> L'article sera rédigé par Gemini Flash avec 3000-5000 mots, optimisation SEO et publié automatiquement.
          </div>

          <Button
            onClick={handleGenerate}
            className="w-full bg-gradient-to-r from-[#C9A961] to-[#B8994F] hover:from-[#B8994F] hover:to-[#A07840] text-[#1A3A52] font-bold py-6 text-base"
          >
            <Wand2 className="h-5 w-5 mr-2" /> Générer & Publier l'article
          </Button>
        </div>
      </div>
    </div>
  );
}