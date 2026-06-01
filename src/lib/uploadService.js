// File upload service using Supabase Storage
import { supabase } from '@/lib/supabaseClient';

const BUCKET = 'public-files';

async function ensureBucket() {
  try {
    await supabase.storage.createBucket(BUCKET, { public: true });
  } catch (_) {
    // bucket already exists, ignore
  }
}

export async function uploadFile(file, folder = 'uploads') {
  await ensureBucket();
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return { success: true, file_url: publicUrl };
}

export async function uploadPrivateFile(file, bucket = 'private-files') {
  const ext = file.name.split('.').pop();
  const fileName = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  return { success: true, file_uri: `${bucket}/${fileName}` };
}