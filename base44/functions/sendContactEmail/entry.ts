import { Resend } from 'npm:resend@4.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { prenom, nom, email, telephone, type_demande, message, destinataires } = body;

    const recipients = Array.isArray(destinataires) ? destinataires : ['ayoubjaziri@gmail.com'];

    const htmlContent = `
      <h2>Nouvelle demande de contact</h2>
      <p><strong>Nom:</strong> ${nom} ${prenom}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Téléphone:</strong> ${telephone || 'Non fourni'}</p>
      <p><strong>Type de demande:</strong> ${type_demande}</p>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Message envoyé depuis le formulaire de contact - La Foncière Valora</small></p>
    `;

    const result = await resend.emails.send({
      from: 'contact@foncierevalora.fr',
      to: recipients,
      subject: `[Foncière Valora] Nouvelle demande de contact - ${type_demande}`,
      html: htmlContent
    });

    return new Response(JSON.stringify({ success: true, result }), { status: 200 });
  } catch (error) {
    console.error('Email send error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});