import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

/**
 * Proxy pour les appels à l'agent Valora AI depuis le back-office custom.
 * Le back-office utilise son propre système d'auth (mot de passe), pas le token Base44.
 * Ce proxy utilise le service role pour appeler l'agent.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { action, payload } = body;

    // Toutes les opérations agents via service role
    const agentSdk = base44.asServiceRole.agents;

    if (action === 'listConversations') {
      const convs = await agentSdk.listConversations({ agent_name: 'valora_ai' });
      return Response.json({ success: true, data: convs });
    }

    if (action === 'createConversation') {
      // Charger les notes mémoire actives et les injecter dans le contexte initial
      const notes = await base44.asServiceRole.entities.ValoraAIMemoire.filter({ actif: true });
      let metadataWithMemory = payload.metadata || {};
      if (notes && notes.length > 0) {
        const memoryText = notes.map(n =>
          `### ${n.titre} [${n.categorie}]\n${n.contenu}`
        ).join('\n\n---\n\n');
        metadataWithMemory.system_context = `## 🧠 MÉMOIRE PERSONNALISÉE — CONTEXTE PROPRE À VALORA\n\nCes informations t'ont été transmises par l'équipe de La Foncière Valora. Tu les connais parfaitement et tu t'y réfères naturellement.\n\n${memoryText}`;
      }
      const conv = await agentSdk.createConversation({
        agent_name: 'valora_ai',
        metadata: metadataWithMemory
      });
      return Response.json({ success: true, data: conv });
    }

    if (action === 'getConversation') {
      const conv = await agentSdk.getConversation(payload.conversationId);
      return Response.json({ success: true, data: conv });
    }

    if (action === 'addMessage') {
      const result = await agentSdk.addMessage(
        payload.conversation,
        { role: 'user', content: payload.content }
      );
      return Response.json({ success: true, data: result });
    }

    if (action === 'deleteConversation') {
      // Pas d'API delete native, on retourne success quand même
      return Response.json({ success: true });
    }

    return Response.json({ error: 'Action inconnue: ' + action }, { status: 400 });

  } catch (error) {
    console.error('[valoraAiProxy] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});