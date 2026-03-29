import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { type, tacheId } = await req.json();

  // Fetch tache
  const taches = await base44.asServiceRole.entities.Tache.filter({ id: tacheId });
  const tache = taches[0];
  if (!tache) return Response.json({ error: 'Tâche introuvable' }, { status: 404 });

  if (!tache.responsable_email) return Response.json({ skipped: true, reason: 'Pas de responsable email' });

  const prioriteEmoji = { 'Urgente': '🔴', 'Haute': '🟠', 'Moyenne': '🟡', 'Basse': '⚪' }[tache.priorite] || '';
  const echeance = tache.date_echeance ? new Date(tache.date_echeance).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Non définie';
  const projet = tache.projet || 'Sans projet';

  let subject, body;

  if (type === 'assigned') {
    subject = `📋 Nouvelle tâche assignée : ${tache.titre}`;
    body = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px; border-radius: 12px;">
        <div style="background: #1A3A52; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #C9A961; margin: 0; font-size: 22px;">La Foncière Valora</h1>
          <p style="color: #ffffff99; margin: 8px 0 0; font-size: 14px;">Gestion des tâches</p>
        </div>
        <div style="background: white; padding: 28px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1A3A52; margin-top: 0;">📋 Une tâche vous a été assignée</h2>
          <div style="background: #f1f5f9; border-left: 4px solid #C9A961; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0 0 8px; font-size: 18px; font-weight: bold; color: #1A3A52;">${tache.titre}</p>
            <p style="margin: 0; color: #64748b; font-size: 14px;">${tache.description || 'Aucune description'}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Projet</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${projet}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Priorité</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${prioriteEmoji} ${tache.priorite || 'Moyenne'}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Statut</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${tache.statut}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Échéance</td><td style="padding: 8px 0; font-weight: 600; color: ${tache.date_echeance ? '#dc2626' : '#1A3A52'};">${echeance}</td></tr>
          </table>
          <p style="color: #64748b; font-size: 14px; margin: 0;">Connectez-vous au back-office pour voir les détails et mettre à jour votre avancement.</p>
        </div>
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 16px;">La Foncière Valora — Notification automatique</p>
      </div>
    `;
  } else if (type === 'overdue') {
    const joursRetard = Math.floor((new Date() - new Date(tache.date_echeance)) / (1000 * 60 * 60 * 24));
    subject = `⚠️ Tâche en retard (${joursRetard}j) : ${tache.titre}`;
    body = `
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
            <p style="margin: 0 0 8px; font-size: 18px; font-weight: bold; color: #1A3A52;">${tache.titre}</p>
            <p style="margin: 0; color: #64748b; font-size: 14px;">${tache.description || 'Aucune description'}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Projet</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${projet}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Priorité</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${prioriteEmoji} ${tache.priorite || 'Moyenne'}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Statut actuel</td><td style="padding: 8px 0; font-weight: 600; color: #dc2626;">${tache.statut}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Échéance prévue</td><td style="padding: 8px 0; font-weight: 600; color: #dc2626;">${echeance}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Avancement</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${tache.avancement || 0}%</td></tr>
          </table>
          <p style="color: #64748b; font-size: 14px;">Merci de mettre à jour le statut de cette tâche dès que possible.</p>
        </div>
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 16px;">La Foncière Valora — Notification automatique</p>
      </div>
    `;
  } else if (type === 'completed') {
    subject = `✅ Tâche terminée : ${tache.titre}`;
    body = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px; border-radius: 12px;">
        <div style="background: #1A3A52; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #C9A961; margin: 0; font-size: 22px;">La Foncière Valora</h1>
          <p style="color: #ffffff99; margin: 8px 0 0; font-size: 14px;">Félicitations !</p>
        </div>
        <div style="background: white; padding: 28px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 28px;">✅</p>
            <p style="margin: 4px 0 0; font-weight: bold; color: #16a34a; font-size: 18px;">Tâche marquée comme terminée !</p>
          </div>
          <div style="background: #f1f5f9; border-left: 4px solid #16a34a; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1A3A52;">${tache.titre}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Projet</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${projet}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Priorité</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${prioriteEmoji} ${tache.priorite || 'Moyenne'}</td></tr>
          </table>
          <p style="color: #64748b; font-size: 14px;">Bravo pour votre travail ! 🎉</p>
        </div>
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 16px;">La Foncière Valora — Notification automatique</p>
      </div>
    `;
  } else if (type === 'reminder') {
    const joursRestants = Math.ceil((new Date(tache.date_echeance) - new Date()) / (1000 * 60 * 60 * 24));
    subject = `🔔 Rappel — Échéance dans ${joursRestants}j : ${tache.titre}`;
    body = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px; border-radius: 12px;">
        <div style="background: #1A3A52; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #C9A961; margin: 0; font-size: 22px;">La Foncière Valora</h1>
          <p style="color: #ffffff99; margin: 8px 0 0; font-size: 14px;">Rappel d'échéance</p>
        </div>
        <div style="background: white; padding: 28px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 28px;">🔔</p>
            <p style="margin: 4px 0 0; font-weight: bold; color: #d97706; font-size: 18px;">Échéance dans ${joursRestants} jour${joursRestants > 1 ? 's' : ''}</p>
          </div>
          <div style="background: #f1f5f9; border-left: 4px solid #C9A961; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0 0 8px; font-size: 18px; font-weight: bold; color: #1A3A52;">${tache.titre}</p>
            <p style="margin: 0; color: #64748b; font-size: 14px;">${tache.description || ''}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Projet</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${projet}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Priorité</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${prioriteEmoji} ${tache.priorite || 'Moyenne'}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Statut</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${tache.statut}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Avancement</td><td style="padding: 8px 0; font-weight: 600; color: #1A3A52;">${tache.avancement || 0}%</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Échéance</td><td style="padding: 8px 0; font-weight: 600; color: #d97706;">${echeance}</td></tr>
          </table>
        </div>
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 16px;">La Foncière Valora — Notification automatique</p>
      </div>
    `;
  } else {
    return Response.json({ error: 'Type inconnu' }, { status: 400 });
  }

  await base44.asServiceRole.integrations.Core.SendEmail({
    to: tache.responsable_email,
    subject,
    body,
    from_name: 'La Foncière Valora — Tâches'
  });

  return Response.json({ success: true, to: tache.responsable_email, type });
});