import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Wand2, Sparkles, RefreshCw, Save, CheckCircle2, X, Globe,
  Home, TrendingUp, Briefcase, Users, Leaf, Building2, ChevronRight,
  Eye, Zap, Star
} from 'lucide-react';

const PAGES = [
  { id: 'accueil', label: 'Accueil', icon: Home, desc: 'Page principale du site' },
  { id: 'strategie', label: 'Stratégie & Performance', icon: TrendingUp, desc: 'Stratégie investissement' },
  { id: 'missions', label: 'Nos Missions', icon: Briefcase, desc: 'Services et expertise' },
  { id: 'equipe', label: 'Notre Histoire', icon: Users, desc: "L'équipe fondatrice" },
  { id: 'ecosysteme', label: 'Écosystème', icon: Globe, desc: 'Partenaires professionnels' },
  { id: 'durabilite', label: 'Durabilité ESG', icon: Leaf, desc: 'Engagements environnementaux' },
  { id: 'nos_biens', label: 'Nos Biens', icon: Building2, desc: 'Réalisations et portefeuille' },
];

const PAGE_CONTEXTS = {
  accueil: "La page d'accueil présente la foncière, ses fondateurs (Ayoub Jaziri et Sofhian Naili), le concept d'investissement, les chiffres clés (18 ans d'expertise, 3.7M€ sous gestion, TRI >10%), la levée de fonds en cours et des témoignages d'associés.",
  strategie: "La page stratégie détaille les 6 piliers d'acquisition, les zones cibles (Bordeaux, Lyon, Vichy, Clermont-Ferrand), les projections financières (10 000€ → 16 489€ en 5 ans), l'alignement des intérêts et le comparatif avec les SCPI.",
  missions: "La page missions présente le processus d'investissement en 6 étapes (Sourcing → Arbitrage), la gestion déléguée, l'information & gouvernance, et l'avantage d'une chaîne de valeur intégrée.",
  equipe: "La page équipe présente Ayoub Jaziri et Sofhian Naili (fondateurs), Renaud Marchand (BTP), la structure du groupe Auvergne & Patrimoine (fondé en 2008), les filiales BVS et SA Gabriel, et la trajectoire de croissance jusqu'à 20M€.",
  ecosysteme: "La page écosystème présente les 6 catégories de partenaires : architectes (maîtrise d'œuvre), BTP (30+ entreprises), avocats/notaires (structuration juridique), agents immobiliers (sourcing off-market), banques (financement LTV 80%), et conseillers patrimoniaux.",
  durabilite: "La page durabilité détaille les engagements ESG : réhabilitation BBC, objectif DPE A/B pour 100% du parc, réduction -60% énergie, matériaux biosourcés, trajectoire bas-carbone 2030, et les 3 piliers E/S/G.",
  nos_biens: "La page nos biens présente le portefeuille immobilier (3.7M€, 4 immeubles, 42 lots, 100% DPE C/B/A), les réalisations avec comparatifs avant/après, et la carte géographique des interventions.",
};

export default function AIPageGenerator({ onClose }) {
  const qc = useQueryClient();
  const [selectedPage, setSelectedPage] = useState('');
  const [objectives, setObjectives] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedSections, setGeneratedSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [step, setStep] = useState(1); // 1: config, 2: preview, 3: done

  const handleGenerate = async () => {
    if (!selectedPage) return;
    setLoading(true);
    setGeneratedSections([]);

    const pageInfo = PAGES.find(p => p.id === selectedPage);
    const pageContext = PAGE_CONTEXTS[selectedPage] || '';

    const res = await base44.integrations.Core.InvokeLLM({
      model: 'claude_sonnet_4_6',
      prompt: `Tu es un expert senior en stratégie de contenu et marketing immobilier haut de gamme.
Tu dois générer une série de sections complètes pour enrichir une page web de "La Foncière Valora".

IDENTITÉ DE MARQUE :
- Foncière résidentielle premium fondée en 2008
- Couleurs : bleu marine #1A3A52 + or #C9A961
- Ton : élégant, institutionnel, expert — jamais banal
- Cibles : investisseurs qualifiés (ticket min. 10 000€), chefs d'entreprise, professions libérales
- Avantages : 0€ frais, TRI >10% net, réhabilitation BBC, PEA-PME, alignement total des intérêts

PAGE CIBLE : "${pageInfo?.label}"
CONTEXTE DE LA PAGE :
${pageContext}

OBJECTIFS / INSTRUCTIONS SPÉCIFIQUES :
${objectives || 'Enrichir la page avec des sections complémentaires à fort impact persuasif'}

MISSION : Génère 4 à 6 nouvelles sections de contenu professionnel et immédiatement publiables pour cette page.
Chaque section doit :
1. Apporter une valeur ajoutée réelle et compléter le contenu existant
2. Être rédigée dans un style institutionnel premium (pas de clichés)
3. Renforcer la crédibilité et la confiance de la marque
4. Avoir un contenu dense, précis, spécifique (chiffres, exemples, bénéfices concrets)
5. Pour "chiffres" : "valeur|libellé" sur des lignes séparées
6. Pour "liste" : items impactants, un par ligne, commençant par "- "
7. Pour "cta" : message ultra-convaincant pour passer à l'action

Varie les types (texte, liste, chiffres, cta, temoignage, texte_image) pour créer une expérience de lecture variée.

Retourne ce JSON :
{
  "sections": [
    {
      "titre": "...",
      "sous_titre": "...",
      "contenu": "...",
      "type_section": "texte|texte_image|chiffres|cta|temoignage|liste",
      "ordre": <multiplier de 10>,
      "description_courte": "Résumé en 1 phrase de ce que fait cette section"
    }
  ]
}`,
      response_json_schema: {
        type: 'object',
        properties: {
          sections: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                titre: { type: 'string' },
                sous_titre: { type: 'string' },
                contenu: { type: 'string' },
                type_section: { type: 'string' },
                ordre: { type: 'number' },
                description_courte: { type: 'string' },
              },
            },
          },
        },
      },
    });

    const sections = (res.sections || []).map((s, i) => ({
      ...s,
      page: selectedPage,
      actif: true,
      ordre: (i + 1) * 20,
      image_url: '',
    }));

    setGeneratedSections(sections);
    setSelectedSections(new Set(sections.map((_, i) => i)));
    setStep(2);
    setLoading(false);
  };

  const toggleSection = (i) => {
    const updated = new Set(selectedSections);
    if (updated.has(i)) updated.delete(i);
    else updated.add(i);
    setSelectedSections(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    const toSave = generatedSections.filter((_, i) => selectedSections.has(i));
    for (const section of toSave) {
      await base44.entities.SiteSection.create(section);
    }
    qc.invalidateQueries({ queryKey: ['site-sections'] });
    setSaving(false);
    setSaved(true);
    setStep(3);
  };

  const TYPE_COLORS = {
    texte: 'bg-blue-100 text-blue-700',
    texte_image: 'bg-purple-100 text-purple-700',
    chiffres: 'bg-amber-100 text-amber-700',
    cta: 'bg-[#C9A961]/20 text-[#8B6914]',
    temoignage: 'bg-emerald-100 text-emerald-700',
    liste: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0 bg-gradient-to-r from-[#0F2537] to-[#1A3A52] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C9A961] rounded-xl flex items-center justify-center">
              <Wand2 className="h-6 w-6 text-[#1A3A52]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Générateur de page IA</h3>
              <p className="text-xs text-white/50">Créez et enrichissez une page entière avec Claude AI</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X className="h-5 w-5 text-white/70" />
          </button>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-0 px-6 py-4 bg-slate-50 border-b border-slate-100 flex-shrink-0">
          {[
            { n: 1, label: 'Configurer' },
            { n: 2, label: 'Réviser' },
            { n: 3, label: 'Publier' },
          ].map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= s.n ? 'bg-[#C9A961] text-[#1A3A52]' : 'bg-slate-200 text-slate-400'}`}>
                  {step > s.n ? <CheckCircle2 className="h-4 w-4" /> : s.n}
                </div>
                <span className={`text-sm font-medium ${step >= s.n ? 'text-[#1A3A52]' : 'text-slate-400'}`}>{s.label}</span>
              </div>
              {i < 2 && <ChevronRight className="h-4 w-4 text-slate-300 mx-3" />}
            </React.Fragment>
          ))}
        </div>

        <div className="p-6 flex-1">

          {/* STEP 1 : Configuration */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-[#1A3A52] mb-1">Choisissez la page à enrichir</h4>
                <p className="text-sm text-slate-500 mb-4">L'IA va générer plusieurs nouvelles sections personnalisées pour cette page.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {PAGES.map(p => {
                    const Icon = p.icon;
                    const isSelected = selectedPage === p.id;
                    return (
                      <button key={p.id} onClick={() => setSelectedPage(p.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected ? 'border-[#C9A961] bg-[#C9A961]/5' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                        <Icon className={`h-5 w-5 mb-2 ${isSelected ? 'text-[#C9A961]' : 'text-slate-400'}`} />
                        <p className={`text-sm font-semibold ${isSelected ? 'text-[#1A3A52]' : 'text-slate-700'}`}>{p.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{p.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">
                  Objectifs & instructions (optionnel)
                </label>
                <Textarea
                  rows={4}
                  value={objectives}
                  onChange={e => setObjectives(e.target.value)}
                  placeholder={`Ex : "Ajouter une section FAQ sur les risques d'investissement"\n"Mettre en avant notre avantage sur les SCPI avec des chiffres percutants"\n"Créer une section qui rassure sur la liquidité et l'horizon d'investissement"`}
                  className="resize-none text-sm"
                />
              </div>

              <div className="bg-gradient-to-r from-[#1A3A52]/5 to-[#C9A961]/5 rounded-xl p-4 border border-[#C9A961]/20">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-[#C9A961] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#1A3A52] mb-1">Ce que l'IA va faire</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• Analyser le contexte complet de la page sélectionnée</li>
                      <li>• Générer 4 à 6 sections professionnelles complémentaires</li>
                      <li>• Varier les formats (texte, chiffres, liste, témoignage, CTA…)</li>
                      <li>• Rédiger dans le ton institutionnel de La Foncière Valora</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button onClick={handleGenerate} disabled={!selectedPage || loading}
                className="w-full bg-gradient-to-r from-[#1A3A52] to-[#2A4A6F] text-white py-6 font-semibold text-base shadow-lg hover:shadow-xl transition-shadow">
                {loading
                  ? <><RefreshCw className="h-5 w-5 mr-2 animate-spin" /> Claude AI génère vos sections…</>
                  : <><Sparkles className="h-5 w-5 mr-2" /> Générer les sections avec Claude AI</>
                }
              </Button>
            </div>
          )}

          {/* STEP 2 : Preview & sélection */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-[#1A3A52]">{generatedSections.length} sections générées</h4>
                  <p className="text-sm text-slate-500">Sélectionnez celles que vous voulez publier sur le site</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedSections(new Set(generatedSections.map((_, i) => i)))}
                    className="text-xs text-[#C9A961] hover:text-[#B8994F] font-medium">Tout sélectionner</button>
                  <span className="text-slate-300">|</span>
                  <button onClick={() => setSelectedSections(new Set())}
                    className="text-xs text-slate-400 hover:text-slate-600 font-medium">Tout déselectionner</button>
                </div>
              </div>

              <div className="space-y-3">
                {generatedSections.map((section, i) => {
                  const isSelected = selectedSections.has(i);
                  return (
                    <div key={i}
                      onClick={() => toggleSection(i)}
                      className={`rounded-2xl border-2 p-5 cursor-pointer transition-all ${isSelected ? 'border-[#C9A961] bg-[#C9A961]/3' : 'border-slate-200 opacity-60 hover:opacity-80'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${isSelected ? 'bg-[#C9A961]' : 'border-2 border-slate-300'}`}>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h5 className="font-semibold text-[#1A3A52]">{section.titre}</h5>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[section.type_section] || 'bg-slate-100 text-slate-600'}`}>
                              {section.type_section}
                            </span>
                          </div>
                          {section.sous_titre && <p className="text-sm text-slate-500 mb-1">{section.sous_titre}</p>}
                          <p className="text-xs text-slate-400 italic">{section.description_courte}</p>
                          {section.contenu && (
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2 bg-slate-50 rounded-lg p-2">
                              {section.contenu.slice(0, 150)}{section.contenu.length > 150 ? '…' : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                <strong>{selectedSections.size}</strong> section{selectedSections.size !== 1 ? 's' : ''} sélectionnée{selectedSections.size !== 1 ? 's' : ''} — elles s'afficheront sur la page <strong>{PAGES.find(p => p.id === selectedPage)?.label}</strong> du site.
              </div>
            </div>
          )}

          {/* STEP 3 : Succès */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#C9A961] to-[#B8994F] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-2xl font-serif text-[#1A3A52] mb-2">Page enrichie avec succès !</h4>
              <p className="text-slate-500 mb-8 max-w-md">
                {selectedSections.size} section{selectedSections.size !== 1 ? 's' : ''} ont été ajoutées à la page <strong>{PAGES.find(p => p.id === selectedPage)?.label}</strong> et sont visibles immédiatement sur le site.
              </p>
              <div className="flex gap-3">
                <Button onClick={() => { setStep(1); setSelectedPage(''); setObjectives(''); setGeneratedSections([]); setSaved(false); }}
                  variant="outline" className="border-[#1A3A52] text-[#1A3A52]">
                  Générer une autre page
                </Button>
                <Button onClick={onClose} className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 2 && (
          <div className="px-6 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0 bg-slate-50 rounded-b-2xl">
            <Button variant="outline" onClick={() => setStep(1)} className="px-6">
              ← Retour
            </Button>
            <Button onClick={handleSave} disabled={saving || selectedSections.size === 0}
              className="flex-1 bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold py-5">
              {saving
                ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Publication en cours…</>
                : <><Zap className="h-4 w-4 mr-2" /> Publier {selectedSections.size} section{selectedSections.size !== 1 ? 's' : ''} sur le site</>
              }
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}