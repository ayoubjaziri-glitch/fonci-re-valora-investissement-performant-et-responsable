import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Valora AI Executor — exécute les actions validées par l'admin
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { action, payload } = body;

    // ── PLAN : demander à l'AI de réfléchir et proposer un plan ───────────────
    if (action === 'generatePlan') {
      const { userRequest, context } = payload;

      const systemPrompt = `Tu es Valora AI, le Directeur Général Délégué et Community Manager de La Foncière Valora, une foncière résidentielle premium basée à Vichy.

RÈGLE ABSOLUE : Tu ne fais JAMAIS d'action sans validation explicite. Tu proposes d'abord un PLAN DÉTAILLÉ.

Contexte entreprise :
- Couleurs : bleu marine #1A3A52, or #C9A961
- Ton : professionnel, premium, sérieux, confiant
- Spécialité : acquisition, réhabilitation, valorisation d'immeubles résidentiels
- Réseaux : LinkedIn (professionnel B2B) + Instagram (visuel, patrimoine)

${context ? `Contexte actuel de la base de données :\n${context}` : ''}

Quand l'utilisateur te demande quelque chose, tu dois :
1. ANALYSER la demande
2. PROPOSER un plan structuré avec des étapes numérotées
3. Pour chaque étape, décrire PRÉCISÉMENT ce que tu vas faire
4. Indiquer clairement ce qui sera publié/modifié/créé
5. Attendre la validation avant d'exécuter quoi que ce soit

FORMAT DE RÉPONSE OBLIGATOIRE pour une demande d'action :
Commence par "## 📋 Mon plan d'action" puis liste les étapes.
Termine TOUJOURS par : "**Valides-tu ce plan ? Je peux exécuter tout cela en une fois.**"

Si c'est juste une question ou une discussion (pas une action), réponds normalement sans plan.`;

      const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nDemande de l'utilisateur : ${userRequest}`,
        add_context_from_internet: false,
        model: 'claude_sonnet_4_6'
      });

      return Response.json({ success: true, plan: response });
    }

    // ── EXECUTE : exécuter les actions après validation ────────────────────────
    if (action === 'executeActions') {
      const { actions, conversationId } = payload;
      const results = [];

      for (const act of actions) {
        try {
          let entityId = null;
          let snapshotAvant = null;
          let imageUrl = null;

          if (act.type === 'blog_create') {
            // Générer image si demandé
            if (act.data.generate_image) {
              const img = await base44.asServiceRole.integrations.Core.GenerateImage({
                prompt: `Photo professionnelle immobilière premium pour un article de blog : "${act.data.titre}". Style : élégant, moderne, tons bleu marine et or. Foncière Valora.`
              });
              act.data.image_url = img.url;
              imageUrl = img.url;
            }
            const created = await base44.asServiceRole.entities.ArticleBlog.create(act.data);
            entityId = created.id;

          } else if (act.type === 'blog_update') {
            const existing = await base44.asServiceRole.entities.ArticleBlog.get(act.entity_id);
            snapshotAvant = JSON.stringify(existing);
            await base44.asServiceRole.entities.ArticleBlog.update(act.entity_id, act.data);
            entityId = act.entity_id;

          } else if (act.type === 'site_content_update') {
            const items = await base44.asServiceRole.entities.SiteContent.filter({ cle: act.data.cle });
            if (items.length > 0) {
              snapshotAvant = JSON.stringify(items[0]);
              await base44.asServiceRole.entities.SiteContent.update(items[0].id, { valeur: act.data.valeur });
              entityId = items[0].id;
            } else {
              const created = await base44.asServiceRole.entities.SiteContent.create(act.data);
              entityId = created.id;
            }

          } else if (act.type === 'image_generate') {
            const img = await base44.asServiceRole.integrations.Core.GenerateImage({
              prompt: act.data.prompt
            });
            imageUrl = img.url;

          } else if (act.type === 'actu_create') {
            const created = await base44.asServiceRole.entities.ActualiteAssocie.create(act.data);
            entityId = created.id;

          } else if (act.type === 'tache_create') {
            const created = await base44.asServiceRole.entities.Tache.create(act.data);
            entityId = created.id;

          } else if (act.type === 'linkedin_post') {
            // LinkedIn nécessite OAuth - retourner le contenu pour publication manuelle
            // (OAuth flow géré côté frontend)
            imageUrl = act.data.image_url || null;

          } else if (act.type === 'instagram_post') {
            imageUrl = act.data.image_url || null;
          }

          // Enregistrer l'action pour revert
          const logged = await base44.asServiceRole.entities.ValoraAIAction.create({
            conversation_id: conversationId || '',
            type: act.type,
            label: act.label,
            payload: JSON.stringify(act.data),
            snapshot_avant: snapshotAvant || '',
            entity_id: entityId || '',
            statut: 'success',
            image_url: imageUrl || ''
          });

          results.push({ success: true, actionId: logged.id, type: act.type, entityId, imageUrl, label: act.label });

        } catch (err) {
          results.push({ success: false, type: act.type, label: act.label, error: err.message });
        }
      }

      return Response.json({ success: true, results });
    }

    // ── REVERT : annuler les dernières actions ────────────────────────────────
    if (action === 'revertActions') {
      const { actionIds } = payload;
      const reverted = [];

      for (const actionId of actionIds) {
        const act = await base44.asServiceRole.entities.ValoraAIAction.get(actionId);
        if (!act || act.statut === 'reverted') continue;

        try {
          if (act.type === 'blog_create' && act.entity_id) {
            await base44.asServiceRole.entities.ArticleBlog.delete(act.entity_id);
          } else if (act.type === 'blog_update' && act.entity_id && act.snapshot_avant) {
            const snap = JSON.parse(act.snapshot_avant);
            await base44.asServiceRole.entities.ArticleBlog.update(act.entity_id, snap);
          } else if (act.type === 'site_content_update' && act.entity_id && act.snapshot_avant) {
            const snap = JSON.parse(act.snapshot_avant);
            await base44.asServiceRole.entities.SiteContent.update(act.entity_id, { valeur: snap.valeur });
          } else if (act.type === 'actu_create' && act.entity_id) {
            await base44.asServiceRole.entities.ActualiteAssocie.delete(act.entity_id);
          } else if (act.type === 'tache_create' && act.entity_id) {
            await base44.asServiceRole.entities.Tache.delete(act.entity_id);
          }

          await base44.asServiceRole.entities.ValoraAIAction.update(actionId, { statut: 'reverted' });
          reverted.push({ actionId, label: act.label });

        } catch (err) {
          reverted.push({ actionId, label: act.label, error: err.message });
        }
      }

      return Response.json({ success: true, reverted });
    }

    // ── PARSE PLAN : extraire les actions d'un plan validé ────────────────────
    if (action === 'parsePlan') {
      const { planText, userRequest } = payload;

      const parsePrompt = `Tu es un parser d'actions pour Valora AI. 

À partir de ce plan d'action approuvé par l'utilisateur, génère une liste d'actions JSON à exécuter.

Plan approuvé :
${planText}

Demande originale : ${userRequest}

Génère un JSON avec la structure suivante :
{
  "actions": [
    {
      "type": "blog_create|blog_update|site_content_update|image_generate|linkedin_post|instagram_post|tache_create|actu_create",
      "label": "Description courte de l'action",
      "data": { ... données spécifiques ... },
      "entity_id": "ID si update (optionnel)",
      "requires_oauth": "linkedin|instagram|null"
    }
  ],
  "summary": "Résumé en 1 phrase de ce qui va être fait",
  "has_social_media": true/false,
  "has_images": true/false
}

Pour blog_create, data doit contenir : titre, slug, extrait, contenu (markdown), categorie, auteur, publie, generate_image (bool)
Pour site_content_update : cle, valeur, page
Pour linkedin_post : texte, hashtags, image_prompt (si image nécessaire)
Pour instagram_post : caption, hashtags, image_prompt
Pour tache_create : titre, statut, priorite, projet, description
Pour actu_create : titre, description, type, date_publication, actif

IMPORTANT : génère un contenu RÉEL et complet, pas des placeholders. Le contenu doit être professionnel, en français, dans le style de La Foncière Valora.`;

      const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: parsePrompt,
        response_json_schema: {
          type: "object",
          properties: {
            actions: { type: "array" },
            summary: { type: "string" },
            has_social_media: { type: "boolean" },
            has_images: { type: "boolean" }
          }
        },
        model: 'claude_sonnet_4_6'
      });

      return Response.json({ success: true, parsed: response });
    }

    // ── GENERATE IMAGE ─────────────────────────────────────────────────────────
    if (action === 'generateImage') {
      const { prompt } = payload;
      const img = await base44.asServiceRole.integrations.Core.GenerateImage({ prompt });
      return Response.json({ success: true, url: img.url });
    }

    return Response.json({ error: 'Action inconnue' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});