// File upload service using Supabase Storage
import { supabase } from '@/lib/supabaseClient';

export async function uploadFile(file, bucket = 'public-files') {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { success: true, file_url: publicUrl };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: error.message };
  }
}

export async function uploadPrivateFile(file, bucket = 'private-files') {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    return { success: true, file_uri: `${bucket}/${fileName}` };
  } catch (error) {
    console.error('Private upload error:', error);
    return { success: false, error: error.message };
  }
}