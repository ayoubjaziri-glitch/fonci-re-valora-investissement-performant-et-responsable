import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { nom, categorie, type_acces, date_document, file_url, taille } = await req.json();

    if (!nom || !categorie) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert avec service role (bypass RLS)
    const result = await base44.asServiceRole.entities.DocumentAssocie.create({
      nom,
      categorie,
      type_acces,
      date_document: date_document || null,
      file_url: file_url || null,
      taille: taille || null,
      actif: true
    });

    return Response.json(result);
  } catch (error) {
    console.error('Error creating document:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});