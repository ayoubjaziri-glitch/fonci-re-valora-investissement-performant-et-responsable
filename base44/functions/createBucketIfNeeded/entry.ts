import { createClient } from 'npm:@supabase/supabase-js@2.104.1';

Deno.serve(async (req) => {
  try {
    const { supabaseUrl, supabaseKey } = await req.json();

    if (!supabaseUrl || !supabaseKey) {
      return Response.json(
        { error: 'Missing credentials' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const bucketName = 'associes-documents';

    // Vérifier les buckets existants
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) throw listError;

    const bucketExists = buckets?.some(b => b.name === bucketName);

    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800, // 50MB
      });

      if (createError && !createError.message.includes('already exists')) {
        throw createError;
      }
    }

    return Response.json({ success: true, bucketExists: !!bucketExists });
  } catch (error) {
    console.error('Bucket error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});