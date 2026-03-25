import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { X, Sparkles, Save, RefreshCw, MapPin, ChevronRight } from 'lucide-react';

// Structure réelle de chaque page pour que l'IA propose des positions précises
const PAGE_STRUCTURES = {
  accueil: [
    'Hero (titre principal + CTA)',
    'Qui sommes-nous (texte + métriques)',
    'Durabilité (texte + visuels)',
    'Atouts & Valeur ajoutée',
    'Nos Missions (3 cartes)',
    'Équipe fondatrice',
    'Stats (chiffres clés)',
    'Nos Réalisations (galerie)',
    'Levée en cours',
    'Témoignages',
    'Zones d\'intervention (carte)',
    'CTA final',
  ],
  strategie: [
    'Hero Stratégie',
    'Piliers d\'acquisition',
    'Contexte opérationnel',
    'Zones cibles',
    'Rendements projetés (graphique)',
    'Moteurs de création de valeur',
    'Avantages fiscaux (PEA-PME)',
    'CTA final',
  ],
  missions: [
    'Hero Nos Missions',
    'Processus d\'investissement (timeline)',
    'Services (grille)',
    'Proposition de valeur',
    'CTA final',
  ],
  equipe: [
    'Hero Notre Histoire',
    'Fondateurs',
    'Membres de l\'équipe',
    'Forces de l\'organisation',
    'Structure du groupe',
    'Projections financières',
    'CTA',
  ],
  ecosysteme: [
    'Hero Écosystème',
    'Partenaires',
    'Valeurs partagées',
    'CTA',
  ],
  durabilite: [
    'Hero Durabilité',
    'Piliers ESG',
    'Simulateur carbone',
    'Trajectoire environnementale',
    'CTA',
  ],
  nos_biens: [
    'Hero Nos Biens',
    'Statistiques globales',
    'Galerie des réalisations (avant/après)',
    'Carte d\'intervention',
    'CTA',
  ],
};

const PAGE_LABELS = {
  accueil: 'Accueil',
  strategie: 'Stratégie',
  missions: 'Nos Missions',
  equipe: 'Notre Histoire',
  ecosysteme: 'Écosystème',
  durabilite: 'Durabilité',
  nos_biens: 'Nos Biens',
};

export default function AISectionModal({ page, existingSections, onSave, onCancel }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { titre, sous_titre, contenu, type_section, position_suggeree, position_index, justification }
  const [editMode, setEditMode] = useState(false);

  const pageStructure = PAGE_STRUCTURES[page] || [];
  const pageLabel = PAGE_LABELS[page] || page;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);

    const existingList = existingSections.map((s, i) => `${i + 1}. "${s.titre}" (${s.type_section})`).join('\n') || 'Aucune section existante';

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un expert en marketing immobilier pour la foncière Valora, une foncière résidentielle haut de gamme.

L'administrateur veut ajouter une nouvelle section sur la page "${pageLabel}" du site web.

Description de ce qu'il veut : "${prompt}"

Structure actuelle de la page "${pageLabel}" (sections fixes existantes dans le code) :
${pageStructure.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Sections personnalisées déjà ajoutées via le back-office :
${existingList}

Ta mission :
1. Générer le contenu complet de cette section (titre percutant, sous-titre, contenu détaillé et professionnel adapté au positionnement premium de la foncière)
2. Proposer la meilleure position d'insertion dans la structure de la page, avec une justification claire

Réponds UNIQUEMENT en JSON valide avec ces champs :
{
  "titre": "...",
  "sous_titre": "...",
  "contenu": "...",
  "type_section": "texte|texte_image|chiffres|cta|temoignage|liste",
  "position_suggeree": "Nom exact de la section après laquelle insérer (depuis la structure de la page)",
  "position_index": <numéro de position suggérée 1-${pageStructure.length}>,
  "justification": "Explication courte du choix de position"
}`,
      response_json_schema: {
        type: 'object',
        properties: {
          titre: { type: 'string' },
          sous_titre: { type: 'string' },
          contenu: { type: 'string' },
          type_section: { type: 'string' },
          position_suggeree: { type: 'string' },
          position_index: { type: 'number' },
          justification: { type: 'string' },
        },
      },
    });

    // Calculer l'ordre : basé sur position_index dans la structure
    const totalExisting = existingSections.length;
    const suggestedOrder = (res.position_index || 5) * 10;

    setResult({ ...res, ordre: suggestedOrder });
    setLoading(false);
  };

  const handleSave = () => {
    if (!result) return;
    onSave({
      titre: result.titre,
      sous_titre: result.sous_titre,
      contenu: result.contenu,
      type_section: result.type_section || 'texte',
      ordre: result.ordre,
      actif: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C9A961]/10 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-[#C9A961]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1A3A52]">Créer une section avec l'IA</h3>
              <p className="text-xs text-slate-400">Page : {pageLabel}</p>
            </div>
          </div>
          <button onClick={onCancel}><X className="h-5 w-5 text-slate-400 hover:text-slate-600" /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Prompt */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Décrivez ce que vous voulez ajouter à cette page
            </label>
            <Textarea
              rows={4}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={`Ex: "Je veux ajouter une section qui explique notre processus de sélection des investisseurs avec 3 étapes clés" ou "Ajouter un bloc témoignage d'un associé satisfait de son rendement"`}
              className="resize-none"
            />
          </div>

          {/* Structure de la page (info) */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Structure actuelle de la page
            </p>
            <div className="flex flex-wrap gap-1.5">
              {pageStructure.map((s, i) => (
                <span key={i} className="text-xs bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
                  {i + 1}. {s}
                </span>
              ))}
            </div>
          </div>

          {/* Bouton générer */}
          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-[#1A3A52] hover:bg-[#2A4A6F] text-white py-5 font-semibold"
          >
            {loading ? (
              <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> L'IA génère votre section...</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" /> Générer avec l'IA</>
            )}
          </Button>

          {/* Résultat IA */}
          {result && (
            <div className="border-2 border-[#C9A961]/30 rounded-2xl overflow-hidden">
              {/* Position suggérée */}
              <div className="bg-[#C9A961]/10 px-5 py-3 border-b border-[#C9A961]/20">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-[#C9A961] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[#1A3A52]">
                      Position suggérée par l'IA : après <em>"{result.position_suggeree}"</em>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{result.justification}</p>
                  </div>
                </div>
              </div>

              {/* Contenu généré */}
              <div className="p-5 space-y-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Section générée</p>

                {editMode ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Titre</label>
                      <Input value={result.titre} onChange={e => setResult({ ...result, titre: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Sous-titre</label>
                      <Input value={result.sous_titre} onChange={e => setResult({ ...result, sous_titre: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Contenu</label>
                      <Textarea rows={5} value={result.contenu} onChange={e => setResult({ ...result, contenu: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Type</label>
                      <select value={result.type_section} onChange={e => setResult({ ...result, type_section: e.target.value })}
                        className="w-full px-3 py-2 border border-input rounded-md text-sm bg-white">
                        {['texte','texte_image','chiffres','cta','temoignage','liste'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Ordre d'affichage</label>
                      <Input type="number" value={result.ordre} onChange={e => setResult({ ...result, ordre: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-400">Titre</p>
                      <p className="font-semibold text-[#1A3A52] text-lg">{result.titre}</p>
                    </div>
                    {result.sous_titre && (
                      <div>
                        <p className="text-xs text-slate-400">Sous-titre</p>
                        <p className="text-slate-600">{result.sous_titre}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-slate-400">Contenu</p>
                      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{result.contenu}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Type : {result.type_section}</span>
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Ordre : {result.ordre}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button onClick={() => setEditMode(!editMode)}
                    className="text-xs text-slate-500 hover:text-slate-700 underline">
                    {editMode ? 'Aperçu' : 'Modifier manuellement'}
                  </button>
                  <button onClick={handleGenerate}
                    className="text-xs text-[#C9A961] hover:text-[#B8994F] underline flex items-center gap-1">
                    <RefreshCw className="h-3 w-3" /> Régénérer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex gap-3">
          <Button
            onClick={handleSave}
            disabled={!result}
            className="flex-1 bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold"
          >
            <Save className="h-4 w-4 mr-2" /> Ajouter cette section
          </Button>
          <Button variant="outline" onClick={onCancel}>Annuler</Button>
        </div>
      </div>
    </div>
  );
}