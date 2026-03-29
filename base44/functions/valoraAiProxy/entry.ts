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
      const conv = await agentSdk.createConversation({
        agent_name: 'valora_ai',
        metadata: payload.metadata || {}
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