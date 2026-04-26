// Email service using Resend (free tier available)
// Alternative: SendGrid, Mailgun, AWS SES

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

export async function sendEmail({ to, subject, body, from_name = 'La Foncière Valora' }) {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${from_name} <onboarding@resend.dev>`,
        to,
        subject,
        html: body
      })
    });

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}