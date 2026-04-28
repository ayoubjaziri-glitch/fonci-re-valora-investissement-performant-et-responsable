import { supabase } from './supabaseClient';

/**
 * Upload un fichier directement à Supabase Storage
 * @param {File} file - Le fichier à uploader
 * @param {string} bucket - Le bucket Supabase (default: 'uploads')
 * @param {string} path - Le chemin du fichier (default: auto-generated)
 * @returns {Promise<string>} URL publique du fichier
 */
export async function uploadFileToSupabase(file, bucket = 'uploads', path = null) {
  try {
    // Générer un chemin unique si non fourni
    const filePath = path || `${Date.now()}_${file.name}`;

    // Upload le fichier
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    // Générer l'URL publique
    const publicUrl = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath).data.publicUrl;

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}