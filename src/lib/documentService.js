// Service pour uploader des documents directement à Supabase
import { supabase } from './supabaseClient';
import { db } from './supabaseClient';

export async function uploadAndSaveDocument(file, metadata) {
  const { nom, categorie, type_acces, date_document } = metadata;

  if (!file || !nom) {
    throw new Error('Fichier et nom requis');
  }

  try {
    // Upload le fichier à Supabase Storage
    const bucket = 'documents';
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) {
      throw new Error(`Erreur upload: ${uploadError.message}`);
    }

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    // Calculer la taille
    const taille = (file.size / 1024 / 1024).toFixed(1) + ' MB';

    // Insérer dans la base de données
    const documentData = {
      nom,
      categorie,
      type_acces: type_acces || 'privé',
      file_url: publicUrl,
      taille,
      date_document: date_document || null,
      actif: true
    };

    const result = await db.DocumentAssocie.create(documentData);

    return result;
  } catch (error) {
    console.error('Erreur upload document:', error);
    throw error;
  }
}