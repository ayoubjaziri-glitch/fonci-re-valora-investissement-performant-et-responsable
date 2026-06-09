import { base44 } from '@/api/base44Client';

export async function sendContactEmail(data) {
  const { prenom, nom, email, telephone, type_demande, message } = data;

  const subject = `[Foncière Valora] Nouvelle demande — ${type_demande}`;
  const body = `
Nouvelle demande de contact reçue sur foncierevalora.fr

---
Nom : ${prenom} ${nom}
Email : ${email}
Téléphone : ${telephone || 'Non renseigné'}
Objet : ${type_demande}

Message :
${message}

---
Reçu le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
  `.trim();

  await Promise.all([
    base44.integrations.Core.SendEmail({
      to: 'ayoubjaziri@gmail.com',
      subject,
      body,
      from_name: 'Foncière Valora'
    }),
    base44.integrations.Core.SendEmail({
      to: 'ayoubcontact33@gmail.com',
      subject,
      body,
      from_name: 'Foncière Valora'
    })
  ]);

  return { success: true };
}