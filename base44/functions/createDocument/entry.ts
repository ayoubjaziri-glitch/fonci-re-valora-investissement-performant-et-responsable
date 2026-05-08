import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = 'https://cnulpkwcfpbujojwefah.supabase.co';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_KEY');

Deno.serve(async (req) => {
  try {
    if (!SUPABASE_SERVICE_KEY) {
      return Response.json({ error: 'Missing SUPABASE_SERVICE_KEY' }, { status: 500 });
    }

    const { document } = await req.json();

    // Utiliser le service role Supabase pour contourner les RLS
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data, error } = await supabase
      .from('documents_associes')
      .insert([document])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return Response.json(data[0]);
  } catch (error) {
    console.error('Error creating document:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});