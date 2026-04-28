import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { prenom, nom, email, telephone, type_demande, message, destinataires } = await req.json();

    const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

    const emailBody = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#1A3A52;padding:32px 40px;text-align:center;">
            <h1 style="color:#C9A961;font-size:22px;margin:0;font-weight:bold;letter-spacing:1px;">LA FONCIÈRE VALORA</h1>
            <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:8px 0 0;">Nouvelle demande de contact reçue</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 0;text-align:center;">
            <span style="background:#C9A961;color:#1A3A52;font-weight:bold;font-size:13px;padding:6px 20px;border-radius:20px;display:inline-block;">${type_demande}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 40px 0;">
            <h2 style="color:#1A3A52;font-size:16px;margin:0 0 16px;border-bottom:2px solid #C9A961;padding-bottom:10px;">Coordonnées du contact</h2>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:8px 0;width:40%;"><span style="color:#888;font-size:13px;">👤 Prénom &amp; Nom</span></td>
                <td style="padding:8px 0;"><strong style="color:#1A3A52;font-size:14px;">${prenom} ${nom}</strong></td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding:8px 12px;border-radius:6px;"><span style="color:#888;font-size:13px;">✉️ Email</span></td>
                <td style="padding:8px 12px;"><a href="mailto:${email}" style="color:#C9A961;font-size:14px;text-decoration:none;font-weight:bold;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding:8px 0;"><span style="color:#888;font-size:13px;">📞 Téléphone</span></td>
                <td style="padding:8px 0;"><strong style="color:#1A3A52;font-size:14px;">${telephone || 'Non renseigné'}</strong></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 40px 0;">
            <h2 style="color:#1A3A52;font-size:16px;margin:0 0 12px;border-bottom:2px solid #C9A961;padding-bottom:10px;">Message</h2>
            <div style="background:#f8f6f1;border-left:4px solid #C9A961;border-radius:6px;padding:20px;color:#333;font-size:14px;line-height:1.7;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 40px;text-align:center;">
            <a href="mailto:${email}?subject=Re: ${type_demande} - La Foncière Valora" style="background:#C9A961;color:#1A3A52;font-weight:bold;font-size:14px;padding:14px 32px;border-radius:8px;text-decoration:none;display:inline-block;">
              ↩ Répondre à ${prenom}
            </a>
          </td>
        </tr>
        <tr>
          <td style="background:#f4f4f4;padding:20px 40px;text-align:center;border-top:1px solid #e0e0e0;">
            <p style="color:#aaa;font-size:12px;margin:0;">Reçu le ${dateStr} via lafoncierepatrimoniale.com</p>
            <p style="color:#aaa;font-size:11px;margin:6px 0 0;">16 Rue de la Laure, 03200 Vichy — La Foncière Valora</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // Resend sans domaine vérifié : on force l'envoi vers l'email du compte Resend
    const toList = ['ayoubjaziri@gmail.com'];

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    for (const to of toList) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'La Foncière Valora <onboarding@resend.dev>',
          to,
          subject: `📩 Nouvelle demande - ${type_demande} | La Foncière Valora`,
          html: emailBody
        })
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});