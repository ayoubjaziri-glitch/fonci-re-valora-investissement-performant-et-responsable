import { createClient } from 'npm:@supabase/supabase-js@2.104.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
  try {
    // Vérifier la méthode
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    // Extraire le fichier et les données
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const bucketName = 'associes-documents';
    const fileName = `${Date.now()}_${file.name}`;
    const fileBuffer = await file.arrayBuffer();

    // S'assurer que le bucket existe (créer s'il n'existe pas)
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucketName);

    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800, // 50MB
      });
    }

    // Upload le fichier
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });

    if (error) throw error;

    // Récupérer l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    const sizeMB = (file.size / 1024 / 1024).toFixed(1) + ' MB';

    return Response.json({
      file_url: publicUrl,
      taille: sizeMB,
      fileName: file.name,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});