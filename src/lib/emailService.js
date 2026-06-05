// Service pour envoyer des emails via EmailJS (frontend only, no server needed)
import emailjs from '@emailjs/browser';

// ⚙️ À configurer sur https://www.emailjs.com/
// 1. Créez un compte gratuit
// 2. Ajoutez un "Email Service" (Gmail, Outlook, etc.)
// 3. Créez un "Email Template" avec les variables ci-dessous
// 4. Remplacez les 3 constantes suivantes

const EMAILJS_SERVICE_ID = 'service_valora';    // ← votre Service ID
const EMAILJS_TEMPLATE_ID = 'template_contact'; // ← votre Template ID
const EMAILJS_PUBLIC_KEY = 'VOTRE_PUBLIC_KEY';  // ← votre Public Key

export async function sendContactEmail(data) {
  const { prenom, nom, email, telephone, type_demande, message } = data;

  const templateParams = {
    from_name: `${prenom} ${nom}`,
    from_email: email,
    phone: telephone || 'Non renseigné',
    subject: type_demande,
    message: message,
    reply_to: email,
  };

  const result = await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    templateParams,
    EMAILJS_PUBLIC_KEY
  );

  if (result.status !== 200) {
    throw new Error('Erreur EmailJS : ' + result.text);
  }

  return { success: true };
}