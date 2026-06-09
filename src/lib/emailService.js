// Email via EmailJS — configurez vos identifiants sur https://www.emailjs.com/
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_abc1234';   // ⚠️ À remplacer par votre vrai Service ID
const EMAILJS_TEMPLATE_ID = 'template_7llpt0a';
const EMAILJS_PUBLIC_KEY = 'l2GGP5GaMJzYu-J6RUFhM';

export async function sendContactEmail(data) {
  const { prenom, nom, email, telephone, type_demande, message } = data;

  const templateParams = {
    from_name: `${prenom} ${nom}`,
    from_email: email,
    phone: telephone || 'Non renseigné',
    subject: type_demande,
    message,
    reply_to: email,
  };

  try {
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    return { success: result?.status === 200 };
  } catch (err) {
    console.warn('EmailJS non configuré — email non envoyé:', err);
    return { success: false };
  }
}