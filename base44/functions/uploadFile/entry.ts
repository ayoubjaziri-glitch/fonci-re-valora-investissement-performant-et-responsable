import { createClient } from 'npm:@supabase/supabase-js@2.104.1';

const supabaseUrl = 'https://cnulpkwcfpbujojwefah.supabase.co';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const bucket = formData.get('bucket') || 'site-assets';

    if (!file || !(file instanceof File)) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Créer le bucket s'il n'existe pas
    try {
      await supabase.storage.createBucket(bucket, { public: true });
    } catch (e) {
      // Bucket existe déjà ou autre erreur
      console.log('Bucket setup:', e.message);
    }

    // Upload le fichier
    const fileName = `${Date.now()}-${file.name}`;
    const fileBuffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`uploads/${fileName}`, new Uint8Array(fileBuffer), {
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    const file_url = `${supabaseUrl}/storage/v1/object/public/${bucket}/${data.path}`;

    return Response.json({ file_url, success: true });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});