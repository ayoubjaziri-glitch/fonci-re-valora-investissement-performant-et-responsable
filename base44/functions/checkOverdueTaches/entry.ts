import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Appelé chaque jour par une automation schedulée
// Envoie des alertes de retard ET des rappels J-2 avant échéance

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const taches = await base44.asServiceRole.entities.Tache.list();
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let overdueCount = 0;
  let reminderCount = 0;

  for (const tache of taches) {
    if (!tache.responsable_email || tache.statut === 'Terminé') continue;
    if (!tache.date_echeance) continue;

    const echeance = new Date(tache.date_echeance);
    echeance.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((echeance - now) / (1000 * 60 * 60 * 24));

    // Retard (passé la date)
    if (diffDays < 0) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: tache.responsable_email,
        from_name: 'La Foncière Valora — Tâches',
        subject: `⚠️ Tâche en retard (${Math.abs(diffDays)}j) : ${tache.titre}`,
        body: buildOverdueEmail(tache, Math.abs(diffDays))
      });
      overdueCount++;
    }

    // Rappel J-2
    if (diffDays === 2) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: tache.responsable_email,
        from_name: 'La Foncière Valora — Tâches',
        subject: `🔔 Rappel — Échéance dans 2 jours : ${tache.titre}`,
        body: buildReminderEmail(tache, 2)
      });
      reminderCount++;
    }

    // Rappel J-1
    if (diffDays === 1) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: tache.responsable_email,
        from_name: 'La Foncière Valora — Tâches',
        subject: `🔔 Rappel — Échéance demain : ${tache.titre}`,
        body: buildReminderEmail(tache, 1)
      });
      reminderCount++;
    }
  }

  return Response.json({ success: true, overdueCount, reminderCount, total: taches.length });
});

function buildOverdueEmail(tache, joursRetard) {
  const echeance = new Date(tache.date_echeance).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const prioriteEmoji = { 'Urgente': '🔴', 'Haute': '🟠', 'Moyenne': '🟡', 'Basse': '⚪' }[tache.priorite] || '';
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px; border-radius: 12px;">
      <div style="background: #1A3A52; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: #C9A961; margin: 0; font-size: 22px;">La Foncière Valora</h1>
        <p style="color: #ffffff99; margin: 8px 0 0; font-size: 14px;">Alerte de retard</p>
      </div>
      <div style="background: white; padding: 28px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 28px;">⚠️</p>
          <p style="margin: 4px 0 0; font-weight: bold; color: #dc2626; font-size: 18px;">Tâche en retard de ${joursRetard} jour${joursRetard > 1 ? 's' : ''}</p>
        </div>
        <div style="background: #f1f5f9; border-left: 4px solid #dc2626; padding: 16px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1A3A52;">${tache.titre}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Projet</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${tache.projet || 'Sans projet'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Priorité</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${prioriteEmoji} ${tache.priorite || 'Moyenne'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Statut</td><td style="padding: 8px 0; font-weight: 600; color: #dc2626;">${tache.statut}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Avancement</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${tache.avancement || 0}%</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Échéance</td><td style="padding: 8px 0; font-weight: 600; color: #dc2626;">${echeance}</td></tr>
        </table>
        <p style="color: #64748b; font-size: 14px;">Merci de mettre à jour le statut dès que possible.</p>
      </div>
      <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 16px;">La Foncière Valora — Notification automatique</p>
    </div>
  `;
}

function buildReminderEmail(tache, joursRestants) {
  const echeance = new Date(tache.date_echeance).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const prioriteEmoji = { 'Urgente': '🔴', 'Haute': '🟠', 'Moyenne': '🟡', 'Basse': '⚪' }[tache.priorite] || '';
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px; border-radius: 12px;">
      <div style="background: #1A3A52; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: #C9A961; margin: 0; font-size: 22px;">La Foncière Valora</h1>
        <p style="color: #ffffff99; margin: 8px 0 0; font-size: 14px;">Rappel d'échéance</p>
      </div>
      <div style="background: white; padding: 28px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 28px;">🔔</p>
          <p style="margin: 4px 0 0; font-weight: bold; color: #d97706; font-size: 18px;">Échéance ${joursRestants === 1 ? 'demain' : 'dans 2 jours'}</p>
        </div>
        <div style="background: #f1f5f9; border-left: 4px solid #C9A961; padding: 16px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1A3A52;">${tache.titre}</p>
          <p style="margin: 4px 0 0; color: #64748b; font-size: 14px;">${tache.description || ''}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Projet</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${tache.projet || 'Sans projet'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Priorité</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${prioriteEmoji} ${tache.priorite || 'Moyenne'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Statut</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${tache.statut}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Avancement</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${tache.avancement || 0}%</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Échéance</td><td style="padding: 8px 0; font-weight: 600; color: #d97706;">${echeance}</td></tr>
        </table>
      </div>
      <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 16px;">La Foncière Valora — Notification automatique</p>
    </div>
  `;
}