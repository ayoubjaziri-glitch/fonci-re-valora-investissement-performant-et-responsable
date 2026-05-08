import { createClient } from 'npm:@supabase/supabase-js@2.104.1';

Deno.serve(async (req) => {
  try {
    const { nom, categorie, type_acces, date_document, file_url, taille } = await req.json();

    if (!nom || !categorie || !file_url) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_KEY');

    if (!supabaseUrl || !serviceKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const { data, error } = await supabase
      .from('documents_associes')
      .insert({
        nom,
        categorie,
        type_acces,
        date_document: date_document || null,
        file_url,
        taille: taille || null,
        actif: true
      })
      .select();

    if (error) throw error;

    return Response.json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Insert document error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});