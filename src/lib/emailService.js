// Service pour envoyer des emails via la Edge Function Supabase (Resend)
const SUPABASE_URL = 'https://cnulpkwcfpbujojwefah.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_5NLD8wzCMdxN4TCiuSYK-w_mDQ1aQFO';

export async function sendContactEmail(data) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/send-contact-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erreur lors de l\'envoi de l\'email');
  }

  return { success: true };
}