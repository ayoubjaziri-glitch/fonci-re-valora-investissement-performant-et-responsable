import { createClient } from 'npm:@supabase/supabase-js@2.45.0';

const SUPABASE_URL = 'https://cnulpkwcfpbujojwefah.supabase.co';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_KEY');

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const bucketName = 'associes-documents';
    
    // Créer le bucket s'il n'existe pas
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: true });
    }

    // Upload le fichier
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);

    if (error) throw error;

    // Récupérer l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return Response.json({
      file_url: publicUrl,
      size: (file.size / 1024 / 1024).toFixed(1) + ' MB'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});