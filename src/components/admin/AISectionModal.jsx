import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { X, Sparkles, Save, RefreshCw, MapPin, Edit3 } from 'lucide-react';
import SectionPreview from './SectionPreview';

const PAGE_STRUCTURES = {
  accueil: ['Hero (titre principal + CTA)', 'Qui sommes-nous', 'Durabilité', 'Atouts & Valeur ajoutée', 'Nos Missions', 'Équipe fondatrice', 'Stats chiffres clés', 'Nos Réalisations', 'Levée en cours', 'Témoignages', 'Zones d\'intervention', 'CTA final'],
  strategie: ['Hero Stratégie', 'Piliers d\'acquisition', 'Contexte opérationnel', 'Zones cibles', 'Rendements projetés', 'Moteurs de création de valeur', 'Avantages fiscaux', 'CTA final'],
  missions: ['Hero Nos Missions', 'Processus d\'investissement', 'Services', 'Proposition de valeur', 'CTA final'],
  equipe: ['Hero Notre Histoire', 'Fondateurs', 'Membres équipe', 'Forces organisation', 'Structure du groupe', 'Projections financières', 'CTA'],
  ecosysteme: ['Hero Écosystème', 'Partenaires', 'Valeurs partagées', 'CTA'],
  durabilite: ['Hero Durabilité', 'Piliers ESG', 'Simulateur carbone', 'Trajectoire environnementale', 'CTA'],
  nos_biens: ['Hero Nos Biens', 'Statistiques globales', 'Galerie réalisations', 'Carte intervention', 'CTA'],
};

const PAGE_LABELS = {
  accueil: 'Accueil', strategie: 'Stratégie', missions: 'Nos Missions',
  equipe: 'Notre Histoire', ecosysteme: 'Écosystème', durabilite: 'Durabilité', nos_biens: 'Nos Biens',
};

const UNSPLASH_SUGGESTIONS = {
  accueil: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'],
  strategie: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'],
  missions: ['https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'],
  equipe: ['https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80'],
  ecosysteme: ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80'],
  durabilite: ['https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80'],
  nos_biens: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80'],
};

export default function AISectionModal({ page, existingSections, onSave, onCancel }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const pageStructure = PAGE_STRUCTURES[page] || [];
  const pageLabel = PAGE_LABELS[page] || page;
  const imageSuggestions = UNSPLASH_SUGGESTIONS[page] || [];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    setEditMode(false);

    const existingList = existingSections.map((s, i) => `${i + 1}. "${s.titre}" (${s.type_section})`).join('\n') || 'Aucune';

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un expert en marketing immobilier premium pour "La Foncière Valora", une foncière résidentielle haut de gamme (couleurs : bleu marine #1A3A52 et or #C9A961, ton professionnel et élégant).

L'admin veut ajouter une section sur la page "${pageLabel}".
Demande : "${prompt}"

Structure de la page :
${pageStructure.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Sections custom déjà présentes : ${existingList}

Génère :
1. Un contenu complet, professionnel, aligné avec le positionnement premium de la foncière
2. Pour le type "chiffres" : formate le contenu comme "valeur|libellé" sur des lignes séparées (ex: "10%|TRI net visé")
3. Pour le type "liste" : un item par ligne, commençant par "- "
4. La meilleure position dans la page + justification courte

JSON :
{
  "titre": "...",
  "sous_titre": "...",
  "contenu": "...",
  "type_section": "texte|texte_image|chiffres|cta|temoignage|liste",
  "image_url": "laisser vide",
  "position_suggeree": "...",
  "position_index": <1-${pageStructure.length}>,
  "justification": "..."
}`,
      response_json_schema: {
        type: 'object',
        properties: {
          titre: { type: 'string' },
          sous_titre: { type: 'string' },
          contenu: { type: 'string' },
          type_section: { type: 'string' },
          image_url: { type: 'string' },
          position_suggeree: { type: 'string' },
          position_index: { type: 'number' },
          justification: { type: 'string' },
        },
      },
    });

    const suggestedOrder = (res.position_index || 5) * 10;
    // Suggest first image if type needs one
    const imageUrl = (res.type_section === 'texte_image' && imageSuggestions[0]) ? imageSuggestions[0] : '';
    setResult({ ...res, ordre: suggestedOrder, image_url: imageUrl });
    setLoading(false);
  };

  const handleSave = () => {
    if (!result) return;
    onSave({
      titre: result.titre,
      sous_titre: result.sous_titre || '',
      contenu: result.contenu || '',
      image_url: result.image_url || '',
      type_section: result.type_section || 'texte',
      ordre: result.ordre,
      actif: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[93vh] overflow-y-auto shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C9A961]/10 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-[#C9A961]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1A3A52]">Créer une section avec l'IA</h3>
              <p className="text-xs text-slate-400">Page : {pageLabel}</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-5 flex-1">
          {/* Prompt */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Décrivez ce que vous voulez ajouter
            </label>
            <Textarea
              rows={3}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={`Ex : "Une section témoignage d'un investisseur satisfait", "Bloc chiffres clés avec le TRI et l'objectif", "Section présentant notre processus de sélection en 3 étapes"…`}
              className="resize-none"
            />
          </div>

          {/* Structure de la page */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <MapPin className="h-3 w-3" /> Structure de la page
            </p>
            <div className="flex flex-wrap gap-1.5">
              {pageStructure.map((s, i) => (
                <span key={i} className="text-xs bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-md">
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
            {loading
              ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> L'IA génère votre section…</>
              : <><Sparkles className="h-4 w-4 mr-2" /> Générer avec l'IA</>
            }
          </Button>

          {/* Résultat */}
          {result && (
            <div className="border-2 border-[#C9A961]/30 rounded-2xl overflow-hidden">
              {/* Position suggérée */}
              <div className="bg-[#C9A961]/10 px-5 py-3 border-b border-[#C9A961]/20 flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#C9A961] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#1A3A52]">
                    Position suggérée : <em>après « {result.position_suggeree} »</em>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{result.justification}</p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Aperçu visuel */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Aperçu (charte Valora)</p>
                  <SectionPreview section={result} />
                </div>

                {/* Champ image si texte_image */}
                {result.type_section === 'texte_image' && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-2">Image de la section</p>
                    <div className="flex gap-2 flex-wrap mb-2">
                      {imageSuggestions.map((url, i) => (
                        <button key={i} onClick={() => setResult({ ...result, image_url: url })}
                          className={`rounded-lg overflow-hidden border-2 transition-all ${result.image_url === url ? 'border-[#C9A961]' : 'border-slate-200'}`}>
                          <img src={url} alt="" className="w-20 h-14 object-cover" />
                        </button>
                      ))}
                    </div>
                    <Input
                      value={result.image_url}
                      onChange={e => setResult({ ...result, image_url: e.target.value })}
                      placeholder="Ou collez une URL d'image personnalisée…"
                      className="text-xs"
                    />
                  </div>
                )}

                {/* Édition inline */}
                {editMode ? (
                  <div className="space-y-3 bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Modifier le contenu</p>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Titre</label>
                      <Input value={result.titre} onChange={e => setResult({ ...result, titre: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Sous-titre / Accroche</label>
                      <Input value={result.sous_titre || ''} onChange={e => setResult({ ...result, sous_titre: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">
                        Contenu
                        {result.type_section === 'chiffres' && <span className="text-[#C9A961] ml-1">(format : "valeur|libellé" par ligne)</span>}
                        {result.type_section === 'liste' && <span className="text-[#C9A961] ml-1">(un item par ligne)</span>}
                      </label>
                      <Textarea rows={5} value={result.contenu || ''} onChange={e => setResult({ ...result, contenu: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Type de section</label>
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
                  </div>
                ) : null}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                  <button onClick={() => setEditMode(!editMode)}
                    className="text-xs text-slate-500 hover:text-[#1A3A52] flex items-center gap-1 transition-colors">
                    <Edit3 className="h-3 w-3" />
                    {editMode ? 'Masquer l\'édition' : 'Modifier manuellement'}
                  </button>
                  <button onClick={handleGenerate}
                    className="text-xs text-[#C9A961] hover:text-[#B8994F] flex items-center gap-1 transition-colors">
                    <RefreshCw className="h-3 w-3" /> Régénérer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0">
          <Button onClick={handleSave} disabled={!result}
            className="flex-1 bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
            <Save className="h-4 w-4 mr-2" /> Ajouter cette section au site
          </Button>
          <Button variant="outline" onClick={onCancel}>Annuler</Button>
        </div>
      </div>
    </div>
  );
}