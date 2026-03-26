import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { X, Sparkles, Save, RefreshCw, MapPin, Edit3, ChevronRight, Check, Wand2, Star } from 'lucide-react';
import SectionPreview from './SectionPreview';

const PAGE_STRUCTURES = {
  accueil: ['Hero principal', 'Qui sommes-nous', 'Durabilité ESG', 'Atouts & Valeur ajoutée', 'Nos Missions', 'Équipe fondatrice', 'Chiffres clés', 'Nos Réalisations', 'Levée en cours', 'Témoignages', "Zones d'intervention", 'CTA final'],
  strategie: ['Hero Stratégie', "Piliers d'acquisition", 'Contexte & Enjeux', 'Zones cibles', 'Projections de rendement', 'Triple création de valeur', 'Alignement des intérêts', 'Comparatif investissements', 'Avantages fiscaux PEA-PME', 'CTA final'],
  missions: ['Hero Nos Missions', "Processus d'investissement (6 étapes)", 'Domaines expertise', 'Gestion intégrée', 'Information & Gouvernance', 'CTA final'],
  equipe: ['Hero Notre Histoire', 'Fondateurs', 'Membres équipe', 'Forces organisation', 'Structure du groupe', 'Trajectoire financière', 'CTA'],
  ecosysteme: ['Hero Écosystème', 'Partenaires architectes', 'Partenaires BTP', 'Partenaires juridiques', 'Réseau agents', 'Partenaires bancaires', 'Valeurs partagées', 'CTA'],
  durabilite: ['Hero Durabilité', 'Vision ESG', 'Engagements concrets', 'Piliers E/S/G', 'Trajectoire énergie', 'Interventions techniques', 'CTA'],
  nos_biens: ['Hero Nos Biens', 'Statistiques patrimoine', 'Galerie réalisations avant/après', 'Carte intervention', 'CTA'],
};

const PAGE_LABELS = {
  accueil: 'Accueil', strategie: 'Stratégie & Performance', missions: 'Nos Missions',
  equipe: 'Notre Histoire', ecosysteme: 'Écosystème', durabilite: 'Durabilité', nos_biens: 'Nos Biens',
};

const UNSPLASH_IMAGES = {
  accueil: [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    'https://images.unsplash.com/photo-1582407947304-fd86f28f959a?w=800&q=80',
  ],
  strategie: [
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80',
  ],
  missions: [
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80',
  ],
  equipe: [
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80',
  ],
  ecosysteme: [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
  ],
  durabilite: [
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
    'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
  ],
  nos_biens: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  ],
};

export default function AISectionModal({ page, existingSections, onSave, onCancel }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editedVariant, setEditedVariant] = useState(null);

  const pageStructure = PAGE_STRUCTURES[page] || [];
  const pageLabel = PAGE_LABELS[page] || page;
  const imageSuggestions = UNSPLASH_IMAGES[page] || [];

  const activeResult = editedVariant !== null ? editedVariant : (variants[selectedVariant] || null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setVariants([]);
    setSelectedVariant(0);
    setEditedVariant(null);
    setEditMode(false);

    const existingList = existingSections.map((s, i) => `${i + 1}. "${s.titre}" (${s.type_section})`).join('\n') || 'Aucune';

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un expert senior en marketing immobilier premium et en rédaction de contenu pour sites web haut de gamme.
Tu travailles pour "La Foncière Valora" — une foncière résidentielle d'exception (fondée en 2008, groupe Auvergne & Patrimoine).

IDENTITÉ DE MARQUE :
- Couleurs : bleu marine profond #1A3A52 + or #C9A961
- Ton : élégant, institutionnel, rassurant, expert — jamais marketing vulgaire
- Positionnement : création de valeur patrimoniale durable, alignement des intérêts, pilotage professionnel
- Cibles : investisseurs qualifiés, chefs d'entreprise, professions libérales, cadres dirigeants
- Différenciateurs : 0€ frais d'entrée, rémunération à la performance, TRI >10% net, PEA-PME, réhabilitation BBC

PAGE CIBLE : "${pageLabel}"
STRUCTURE DE LA PAGE (dans l'ordre) :
${pageStructure.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}

SECTIONS PERSONNALISÉES DÉJÀ PRÉSENTES :
${existingList}

DEMANDE DE L'ADMIN : "${prompt}"

MISSION : Génère 3 variantes distinctes de section, de haute qualité professionnelle. Chaque variante doit :
1. Avoir un angle éditorial différent (ex : chiffres et performance / storytelling émotionnel / pédagogie et expertise)
2. Être immédiatement publiable sans modification
3. Avoir un titre accrocheur, professionnel, qui donne envie de lire
4. Proposer un contenu dense et de valeur (pas de blabla creux)
5. Pour "chiffres" : format strict "valeur|libellé" sur des lignes séparées (ex: ">10%|TRI net visé")
6. Pour "liste" : items précis et percutants, un par ligne commençant par "- "
7. Pour "cta" : texte ultra-convaincant qui donne envie d'agir

Retourne exactement ce JSON :
{
  "variants": [
    {
      "titre": "...",
      "sous_titre": "...",
      "contenu": "...",
      "type_section": "texte|texte_image|chiffres|cta|temoignage|liste",
      "position_index": <1-${pageStructure.length}>,
      "position_label": "...",
      "justification": "...",
      "angle": "..."
    },
    { ... variante 2 ... },
    { ... variante 3 ... }
  ]
}`,
      response_json_schema: {
        type: 'object',
        properties: {
          variants: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                titre: { type: 'string' },
                sous_titre: { type: 'string' },
                contenu: { type: 'string' },
                type_section: { type: 'string' },
                position_index: { type: 'number' },
                position_label: { type: 'string' },
                justification: { type: 'string' },
                angle: { type: 'string' },
              },
            },
          },
        },
      },
    });

    const processed = (res.variants || []).map((v, i) => {
      const needsImage = v.type_section === 'texte_image';
      return {
        ...v,
        ordre: (v.position_index || (5 + i)) * 10,
        image_url: needsImage ? (imageSuggestions[i] || imageSuggestions[0] || '') : '',
        actif: true,
      };
    });

    setVariants(processed);
    setLoading(false);
  };

  const handleSave = () => {
    const toSave = activeResult;
    if (!toSave) return;
    onSave({
      titre: toSave.titre,
      sous_titre: toSave.sous_titre || '',
      contenu: toSave.contenu || '',
      image_url: toSave.image_url || '',
      type_section: toSave.type_section || 'texte',
      ordre: toSave.ordre,
      actif: true,
    });
  };

  const handleSelectVariant = (i) => {
    setSelectedVariant(i);
    setEditedVariant(null);
    setEditMode(false);
  };

  const startEdit = () => {
    setEditedVariant({ ...variants[selectedVariant] });
    setEditMode(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0 bg-gradient-to-r from-[#1A3A52] to-[#2A4A6F] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C9A961] rounded-xl flex items-center justify-center">
              <Wand2 className="h-5 w-5 text-[#1A3A52]" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Créer avec l'IA</h3>
              <p className="text-xs text-white/50">Page : {pageLabel} • Propulsé par Claude AI</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X className="h-5 w-5 text-white/70" />
          </button>
        </div>

        <div className="p-6 space-y-5 flex-1">
          {/* Prompt */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">
              Décrivez ce que vous voulez ajouter
            </label>
            <Textarea
              rows={3}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={`Ex : "Une section témoignage percutant d'un investisseur chef d'entreprise"\n"Bloc chiffres clés impressionnants sur notre performance"\n"Section qui explique notre avantage concurrentiel vs les SCPI"`}
              className="resize-none text-sm"
            />
            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#C9A961]" />
              L'IA va générer <strong>3 variantes professionnelles</strong> parmi lesquelles vous choisirez la meilleure.
            </p>
          </div>

          {/* Structure de la page */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <MapPin className="h-3 w-3" /> Structure actuelle de la page
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
            className="w-full bg-gradient-to-r from-[#1A3A52] to-[#2A4A6F] hover:from-[#2A4A6F] hover:to-[#3A5A8F] text-white py-5 font-semibold text-base shadow-lg"
          >
            {loading
              ? <><RefreshCw className="h-5 w-5 mr-2 animate-spin" /> L'IA rédige 3 variantes professionnelles…</>
              : <><Sparkles className="h-5 w-5 mr-2" /> Générer 3 variantes avec Claude AI</>
            }
          </Button>

          {/* Sélection des variantes */}
          {variants.length > 0 && (
            <div className="space-y-5">
              {/* Tabs variantes */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Choisissez la meilleure variante</p>
                <div className="grid grid-cols-3 gap-3">
                  {variants.map((v, i) => (
                    <button key={i} onClick={() => handleSelectVariant(i)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${selectedVariant === i && editedVariant === null ? 'border-[#C9A961] bg-[#C9A961]/5' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${selectedVariant === i && editedVariant === null ? 'bg-[#C9A961] text-white' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</span>
                        <span className="text-xs font-semibold text-[#1A3A52] truncate">{v.angle || `Variante ${i + 1}`}</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{v.titre}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aperçu de la variante sélectionnée */}
              {activeResult && (
                <div className="border-2 border-[#C9A961]/30 rounded-2xl overflow-hidden">
                  {/* Position suggérée */}
                  <div className="bg-[#C9A961]/10 px-5 py-3 border-b border-[#C9A961]/20 flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-[#C9A961] mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1A3A52]">
                        Position suggérée : après « {activeResult.position_label} »
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{activeResult.justification}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={startEdit}
                        className="text-xs text-slate-500 hover:text-[#1A3A52] flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white transition-colors">
                        <Edit3 className="h-3 w-3" /> Modifier
                      </button>
                      <button onClick={handleGenerate}
                        className="text-xs text-[#C9A961] hover:text-[#B8994F] flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white transition-colors">
                        <RefreshCw className="h-3 w-3" /> Régénérer
                      </button>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Aperçu visuel */}
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Aperçu</p>
                      <SectionPreview section={activeResult} />
                    </div>

                    {/* Image si texte_image */}
                    {activeResult.type_section === 'texte_image' && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-2">Image de la section</p>
                        <div className="flex gap-2 flex-wrap mb-2">
                          {imageSuggestions.map((url, i) => (
                            <button key={i}
                              onClick={() => {
                                const updated = { ...(editedVariant || variants[selectedVariant]), image_url: url };
                                setEditedVariant(updated);
                              }}
                              className={`rounded-lg overflow-hidden border-2 transition-all ${activeResult.image_url === url ? 'border-[#C9A961]' : 'border-slate-200'}`}>
                              <img src={url} alt="" className="w-20 h-14 object-cover" />
                            </button>
                          ))}
                        </div>
                        <Input
                          value={activeResult.image_url || ''}
                          onChange={e => setEditedVariant({ ...(editedVariant || variants[selectedVariant]), image_url: e.target.value })}
                          placeholder="Ou collez une URL d'image personnalisée…"
                          className="text-xs"
                        />
                      </div>
                    )}

                    {/* Édition inline */}
                    {editMode && editedVariant && (
                      <div className="space-y-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Modifier le contenu</p>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Titre</label>
                          <Input value={editedVariant.titre} onChange={e => setEditedVariant({ ...editedVariant, titre: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Sous-titre / Accroche</label>
                          <Input value={editedVariant.sous_titre || ''} onChange={e => setEditedVariant({ ...editedVariant, sous_titre: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">
                            Contenu
                            {editedVariant.type_section === 'chiffres' && <span className="text-[#C9A961] ml-1">(format : "valeur|libellé" par ligne)</span>}
                            {editedVariant.type_section === 'liste' && <span className="text-[#C9A961] ml-1">(un item par ligne)</span>}
                          </label>
                          <Textarea rows={6} value={editedVariant.contenu || ''} onChange={e => setEditedVariant({ ...editedVariant, contenu: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-slate-500 mb-1 block">Type</label>
                            <select value={editedVariant.type_section} onChange={e => setEditedVariant({ ...editedVariant, type_section: e.target.value })}
                              className="w-full px-3 py-2 border border-input rounded-md text-sm bg-white">
                              {['texte', 'texte_image', 'chiffres', 'cta', 'temoignage', 'liste'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-slate-500 mb-1 block">Ordre d'affichage</label>
                            <Input type="number" value={editedVariant.ordre} onChange={e => setEditedVariant({ ...editedVariant, ordre: parseInt(e.target.value) || 0 })} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0 bg-slate-50 rounded-b-2xl">
          <Button onClick={handleSave} disabled={!activeResult}
            className="flex-1 bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold py-5">
            <Save className="h-4 w-4 mr-2" /> Ajouter cette section au site
          </Button>
          <Button variant="outline" onClick={onCancel} className="px-6">Annuler</Button>
        </div>
      </div>
    </div>
  );
}