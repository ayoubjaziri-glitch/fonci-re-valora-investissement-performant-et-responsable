import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { nom, categorie, type_acces, date_document, file_url, taille } = await req.json();

    if (!nom || !categorie || !file_url) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Use service role to bypass RLS
    const doc = await base44.asServiceRole.entities.DocumentAssocie.create({
      nom,
      categorie,
      type_acces,
      date_document,
      file_url,
      taille,
      actif: true
    });

    return Response.json({ success: true, data: doc });
  } catch (error) {
    console.error('Insert document error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});