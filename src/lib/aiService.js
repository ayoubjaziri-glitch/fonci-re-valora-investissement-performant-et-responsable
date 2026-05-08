// Service pour générer des articles avec Gemini directement
export async function generateBlogArticle(params) {
  const { sujet, categorie = 'Investissement', motsCles = '', angle = '' } = params;

  if (!sujet) {
    throw new Error('Sujet manquant');
  }

  const prompt = `Tu es un expert en immobilier d'investissement, fiscalité et rénovation énergétique en France. Tu rédiges pour le blog de "La Foncière Valora", une foncière résidentielle premium basée à Vichy, dédiée à l'acquisition, réhabilitation et valorisation d'immeubles avec fort potentiel de création de valeur.

MISSION : Rédige un article de blog complet et long (3000-5000 MOTS), optimisé SEO, en français, sur le sujet suivant :

Sujet : "${sujet}"
Catégorie : "${categorie}"
Mots-clés SEO à intégrer naturellement : "${motsCles || 'investissement immobilier, foncière, rénovation, rendement, immeuble de rapport'}"
Angle éditorial / ton souhaité : "${angle || 'Expert et professionnel, ton conseiller pour investisseurs patrimoniaux'}"

RÈGLES STRICTES :
- Format : Markdown pur, UNIQUEMENT des paragraphes longs (pas de tableaux, AUCUN)
- Seulement 3-4 titres H2 (##) maximum pour structurer les grandes sections
- AUCUN sous-titre H3, aucune liste à puces, aucun formatting gras ou italique sauf très rare
- 3000-5000 mots de paragraphes denses et bien développés
- Ton: professionnel, pédagogique, écrit par un humain expert
- Inclure des exemples concrets et chiffrés intégrés naturellement dans le texte
- Mentionner la Foncière Valora naturellement 2-3 fois
- L'extrait (résumé) doit faire 2-3 phrases accrocheuses pour le SEO
- Calculer le temps de lecture approximatif (environ 1 mot = 0.006 min)
- Choisir une URL Unsplash en rapport avec l'immobilier ou la rénovation

Réponds UNIQUEMENT avec un JSON valide (pas de markdown autour) :
{
  "titre": "...",
  "slug": "...",
  "extrait": "...",
  "contenu": "...(Markdown, 3000-5000 mots)...",
  "categorie": "${categorie}",
  "auteur": "La Foncière Valora",
  "image_url": "https://images.unsplash.com/photo-...",
  "temps_lecture": "X min",
  "date_publication": "${new Date().toISOString().split('T')[0]}"
}`;

  const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];
  let lastError = '';

  for (const model of MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 8192,
            }
          })
        }
      );

      if (!response.ok) {
        const error = await response.text();
        lastError = error;
        if (response.status !== 503 && response.status !== 429) {
          throw new Error(`Erreur Gemini: ${error}`);
        }
        continue;
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!rawText) {
        throw new Error('Réponse vide de Gemini');
      }

      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Format JSON invalide');
      }

      let article = JSON.parse(jsonMatch[0]);

      // Nettoyer le slug
      const slug = (article.slug || article.titre || sujet)
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      return { ...article, slug, publie: true };
    } catch (error) {
      if (error.message.includes('Format JSON') || error.message.includes('Réponse vide')) {
        lastError = error.message;
        continue;
      }
      throw error;
    }
  }

  throw new Error(`Tous les modèles sont indisponibles: ${lastError}`);
}