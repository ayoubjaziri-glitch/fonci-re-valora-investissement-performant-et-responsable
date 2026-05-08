import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = 'https://cnulpkwcfpbujojwefah.supabase.co';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_KEY');

Deno.serve(async (req) => {
  try {
    if (!SUPABASE_SERVICE_KEY) {
      return Response.json({ error: 'Missing SUPABASE_SERVICE_KEY' }, { status: 500 });
    }

    const { bucketName = 'documents' } = await req.json();

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Lister les buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      throw listError;
    }

    // Vérifier si le bucket existe
    const bucketExists = buckets?.some(b => b.name === bucketName);
    
    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 524288000, // 500MB
      });
      
      if (createError && !createError.message.includes('already exists')) {
        throw createError;
      }
    }

    return Response.json({ success: true, bucket: bucketName });
  } catch (error) {
    console.error('Error ensuring bucket:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});