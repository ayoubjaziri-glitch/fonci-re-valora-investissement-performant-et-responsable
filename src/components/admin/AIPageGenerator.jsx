import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Wand2, Sparkles, RefreshCw, Save, CheckCircle2, X,
  ChevronRight, Zap, Star, FileCode, Eye, ExternalLink, Copy
} from 'lucide-react';

const BRAND_CONTEXT = `
LA FONCIÈRE VALORA — Contexte de marque :
- Foncière résidentielle premium fondée en 2008 (groupe Auvergne & Patrimoine)
- Fondateurs : Ayoub Jaziri (vision opérationnelle) et Sofhian Naili (gouvernance juridique & stratégie)
- Couleurs : bleu marine #1A3A52 + or #C9A961
- Ton : élégant, institutionnel, rassurant, expert — jamais marketing vulgaire
- Positionnement : création de valeur patrimoniale durable, 0€ frais d'entrée, TRI >10% net, PEA-PME, réhabilitation BBC DPE A/B
- Cibles : investisseurs qualifiés (ticket min. 10 000€), chefs d'entreprise, professions libérales
- Stack technique : React + Tailwind CSS, charte Valora (bg-[#1A3A52], text-[#C9A961], font-serif pour titres)
- Pages existantes : Accueil, Stratégie & Performance, Nos Missions, Notre Histoire (équipe), Écosystème, Durabilité, Nos Biens, Contact, Blog, Espace Associés
`;

export default function AIPageGenerator({ onClose }) {
  const [pageName, setPageName] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [pageDescription, setPageDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [step, setStep] = useState(1); // 1: config, 2: review, 3: instructions

  const handleSlugChange = (name) => {
    setPageName(name);
    const slug = name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setPageSlug(slug);
  };

  const handleGenerate = async () => {
    if (!pageName.trim() || !pageDescription.trim()) return;
    setLoading(true);
    setGeneratedCode('');

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `${BRAND_CONTEXT}

MISSION : Génère le code complet d'une nouvelle page React pour le site de La Foncière Valora.

NOUVELLE PAGE À CRÉER :
- Nom : "${pageName}"
- Route : /${pageSlug}
- Description / Objectif : "${pageDescription}"

EXIGENCES TECHNIQUES :
1. Composant React fonctionnel exporté par défaut, nom en PascalCase basé sur le slug
2. Utilise Tailwind CSS + framer-motion (import { motion } from 'framer-motion')
3. Utilise { Link } from 'react-router-dom' et { createPageUrl } from '../utils' pour la navigation
4. Utilise { Button } from "@/components/ui/button"
5. Utilise { ArrowRight, ... } from 'lucide-react' (seulement les icônes qui existent dans lucide-react v0.475)
6. Respecte la charte graphique Valora : bg-[#1A3A52] pour headers, text-[#C9A961] pour accents, font-serif pour les grands titres
7. Structure complète avec : hero section (py-24 bg-slate-900), plusieurs sections intermédiaires, CTA final (bg-[#C9A961])
8. Animations motion : initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
9. Responsive design (mobile first), grilles md:grid-cols-X
10. Contenu professionnel, dense et pertinent pour une foncière premium — PAS de Lorem Ipsum
11. NE PAS importer d'entités ou de hooks de base44 — page statique uniquement
12. Le fichier doit commencer par "import React from 'react';"

Retourne UNIQUEMENT le code JSX complet du composant, sans explication, sans markdown, sans backticks. Juste le code brut commençant par "import React".`,
    });

    setGeneratedCode(typeof res === 'string' ? res : JSON.stringify(res));
    setStep(2);
    setLoading(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0 bg-gradient-to-r from-[#0F2537] to-[#1A3A52] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C9A961] rounded-xl flex items-center justify-center">
              <FileCode className="h-6 w-6 text-[#1A3A52]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Générateur de nouvelle page</h3>
              <p className="text-xs text-white/50">L'IA crée une page entière (code JSX complet) à ajouter au site</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X className="h-5 w-5 text-white/70" />
          </button>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-0 px-6 py-4 bg-slate-50 border-b border-slate-100 flex-shrink-0">
          {[
            { n: 1, label: 'Décrire la page' },
            { n: 2, label: 'Réviser le code' },
            { n: 3, label: 'Intégrer au site' },
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
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Nom de la nouvelle page *</label>
                <Input
                  value={pageName}
                  onChange={e => handleSlugChange(e.target.value)}
                  placeholder="Ex : FAQ Investisseurs, Mentions légales, Glossaire, Politique ESG..."
                  className="text-sm"
                />
                {pageSlug && (
                  <p className="text-xs text-slate-400 mt-1.5">
                    URL : <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">/{pageSlug}</code>
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Description et objectif de la page *</label>
                <Textarea
                  rows={5}
                  value={pageDescription}
                  onChange={e => setPageDescription(e.target.value)}
                  placeholder={`Décrivez précisément ce que doit contenir cette page :\n\nEx : "Une page FAQ complète répondant aux 10 questions les plus fréquentes des investisseurs : fiscalité PEA-PME, liquidité, risques, horizon d'investissement, processus de souscription, gouvernance, distributions, sortie..."\n\nEx : "Une page glossaire présentant tous les termes financiers et immobiliers utilisés par la foncière : TRI, DPE, BBC, LTV, carried interest, SCPI, pacte d'associés..."`}
                  className="resize-none text-sm"
                />
              </div>

              <div className="bg-gradient-to-r from-[#1A3A52]/5 to-[#C9A961]/5 rounded-xl p-4 border border-[#C9A961]/20">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-[#C9A961] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#1A3A52] mb-1">Comment ça fonctionne</p>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      <li>• L'IA génère le <strong>code JSX complet</strong> d'une nouvelle page React</li>
                      <li>• La page respecte la <strong>charte graphique Valora</strong> (couleurs, typo, animations)</li>
                      <li>• Vous copiez le code et le collez dans un nouveau fichier <code className="bg-slate-100 px-1 rounded">pages/NomPage.jsx</code></li>
                      <li>• Puis vous ajoutez la route dans <code className="bg-slate-100 px-1 rounded">App.jsx</code> et le lien dans le menu</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button onClick={handleGenerate} disabled={!pageName.trim() || !pageDescription.trim() || loading}
                className="w-full bg-gradient-to-r from-[#1A3A52] to-[#2A4A6F] text-white py-6 font-semibold text-base shadow-lg">
                {loading
                  ? <><RefreshCw className="h-5 w-5 mr-2 animate-spin" /> L'IA génère votre page complète…</>
                  : <><Sparkles className="h-5 w-5 mr-2" /> Générer la page avec l'IA</>
                }
              </Button>
            </div>
          )}

          {/* STEP 2 : Review code */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-[#1A3A52]">Code généré — {pageName}</h4>
                  <p className="text-sm text-slate-500">{generatedCode.length} caractères • Page React complète avec charte Valora</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyCode} variant="outline" className="border-[#C9A961] text-[#1A3A52] hover:bg-[#C9A961]/10 text-sm">
                    <Copy className="h-4 w-4 mr-1.5" /> Copier le code
                  </Button>
                  <Button onClick={handleGenerate} variant="outline" className="text-sm" disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Régénérer
                  </Button>
                </div>
              </div>

              <div className="bg-[#0F2537] rounded-xl p-4 overflow-auto max-h-96 border border-slate-700">
                <pre className="text-xs text-green-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {generatedCode}
                </pre>
              </div>

              <Button onClick={() => setStep(3)} className="w-full bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold py-4">
                <ChevronRight className="h-4 w-4 mr-2" /> Voir comment intégrer cette page →
              </Button>
            </div>
          )}

          {/* STEP 3 : Instructions */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-6 w-6 text-[#C9A961]" />
                <h4 className="font-semibold text-[#1A3A52]">Page générée — 3 étapes pour l'intégrer</h4>
              </div>

              <div className="space-y-3">
                {[
                  {
                    n: 1,
                    title: `Créer le fichier pages/${pageName.replace(/\s+/g, '')}.jsx`,
                    desc: 'Dans le chat, demandez : "Crée le fichier pages/' + pageName.replace(/\s+/g, '') + '.jsx" puis collez le code généré.',
                    code: null,
                  },
                  {
                    n: 2,
                    title: 'Ajouter la route dans App.jsx',
                    desc: "Dans App.jsx, importez la page et ajoutez la route dans le composant Routes :",
                    code: `import ${pageName.replace(/\s+/g, '')} from './pages/${pageName.replace(/\s+/g, '')}'\n\n// Dans <Routes> :\n<Route path="/${pageSlug}" element={<LayoutWrapper currentPageName="${pageName.replace(/\s+/g, '')}"><${pageName.replace(/\s+/g, '')} /></LayoutWrapper>} />`,
                  },
                  {
                    n: 3,
                    title: 'Ajouter le lien dans le menu (optionnel)',
                    desc: "Dans Layout.jsx, ajoutez la page dans le tableau navigation :",
                    code: `{ name: '${pageName}', page: '${pageName.replace(/\s+/g, '')}' }`,
                  },
                ].map((step) => (
                  <div key={step.n} className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-[#C9A961] rounded-full flex items-center justify-center text-xs font-bold text-[#1A3A52] flex-shrink-0 mt-0.5">{step.n}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-[#1A3A52] text-sm mb-1">{step.title}</p>
                        <p className="text-xs text-slate-500 mb-2">{step.desc}</p>
                        {step.code && (
                          <div className="bg-[#0F2537] rounded-lg p-3 relative">
                            <pre className="text-xs text-green-300 font-mono whitespace-pre-wrap">{step.code}</pre>
                            <button onClick={() => navigator.clipboard.writeText(step.code)}
                              className="absolute top-2 right-2 p-1 rounded bg-white/10 hover:bg-white/20 transition-colors">
                              <Copy className="h-3 w-3 text-white/60" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs text-blue-700">
                  <strong>Conseil :</strong> Vous pouvez aussi simplement coller le code dans le chat en demandant à l'assistant de l'intégrer automatiquement — il s'occupera de créer le fichier et d'ajouter la route.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1">← Revoir le code</Button>
                <Button onClick={() => { setStep(1); setPageName(''); setPageSlug(''); setPageDescription(''); setGeneratedCode(''); }} variant="outline" className="flex-1">
                  Générer une autre page
                </Button>
                <Button onClick={onClose} className="flex-1 bg-[#1A3A52] text-white hover:bg-[#2A4A6F]">Fermer</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}