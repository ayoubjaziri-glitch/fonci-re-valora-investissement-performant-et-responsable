import { jsPDF } from 'jspdf';

export function genererRapportPDF({
  associeName,
  kpis,
  valorisationSociete,
  leveeEnCours,
  indicRaw,
  energieRaw,
  resultatsRaw,
  gouvernanceRaw,
  patrimoine,
  acquisitionsEnCours,
  chantiers,
  roadmap,
  actualites,
}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const navy = [26, 58, 82];      // #1A3A52
  const gold = [201, 169, 97];    // #C9A961
  const lightGray = [245, 247, 250];
  const textGray = [100, 116, 139];
  const darkText = [15, 23, 42];
  const white = [255, 255, 255];
  const emerald = [16, 185, 129];

  const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  let y = 0;

  // ── HELPERS ──────────────────────────────────────────────────────────────────

  function newPage() {
    doc.addPage();
    y = 0;
    drawPageHeader();
  }

  function checkY(needed = 20) {
    if (y + needed > 272) newPage();
  }

  function drawPageHeader() {
    doc.setFillColor(...navy);
    doc.rect(0, 0, W, 16, 'F');
    doc.setFillColor(...gold);
    doc.rect(0, 14, W, 2, 'F');
    doc.setFontSize(8);
    doc.setTextColor(...white);
    doc.setFont('helvetica', 'bold');
    doc.text('LA FONCIÈRE VALORA — RAPPORT ASSOCIÉS CONFIDENTIEL', 14, 10);
    doc.setFont('helvetica', 'normal');
    doc.text(dateStr, W - 14, 10, { align: 'right' });
    y = 22;
  }

  function sectionTitle(title) {
    checkY(14);
    doc.setFillColor(...gold);
    doc.rect(14, y, 4, 7, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...navy);
    doc.text(title, 22, y + 5.5);
    y += 12;
  }

  function kpiBox(x, yPos, w, h, label, value, sub, positive = true) {
    doc.setFillColor(...lightGray);
    doc.roundedRect(x, yPos, w, h, 2, 2, 'F');
    doc.setFillColor(...(positive ? emerald : [239, 68, 68]));
    doc.rect(x, yPos, 3, h, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textGray);
    doc.text(label, x + 7, yPos + 6);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...navy);
    doc.text(value, x + 7, yPos + 13);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textGray);
    doc.text(sub || '', x + 7, yPos + 18);
  }

  function dataRow(label, value, bg = false) {
    checkY(8);
    if (bg) {
      doc.setFillColor(...lightGray);
      doc.rect(14, y, W - 28, 7, 'F');
    }
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.text(label, 18, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...navy);
    doc.text(value || '—', W - 16, y + 5, { align: 'right' });
    y += 8;
  }

  function progressBar(label, value, pct, color = gold) {
    checkY(12);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.text(label, 18, y + 4);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...navy);
    doc.text(value, W - 16, y + 4, { align: 'right' });
    y += 6;
    doc.setFillColor(220, 224, 230);
    doc.roundedRect(18, y, W - 36, 3, 1, 1, 'F');
    const pctNum = Math.min(Math.max(parseInt(pct) || 0, 0), 100);
    if (pctNum > 0) {
      doc.setFillColor(...color);
      doc.roundedRect(18, y, (W - 36) * pctNum / 100, 3, 1, 1, 'F');
    }
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textGray);
    doc.text(`${pctNum}%`, 18, y + 7);
    y += 10;
  }

  // ── PAGE 1 — COUVERTURE ───────────────────────────────────────────────────────
  doc.setFillColor(...navy);
  doc.rect(0, 0, W, 297, 'F');

  // Bande dorée supérieure
  doc.setFillColor(...gold);
  doc.rect(0, 0, W, 4, 'F');

  // Titre principal
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...white);
  doc.text('LA FONCIÈRE VALORA', W / 2, 70, { align: 'center' });

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gold);
  doc.text('RAPPORT DE SITUATION ASSOCIÉ', W / 2, 84, { align: 'center' });

  // Ligne dorée décorative
  doc.setFillColor(...gold);
  doc.rect(50, 92, W - 100, 0.8, 'F');

  // Sous-titre
  doc.setFontSize(11);
  doc.setTextColor(200, 210, 220);
  doc.text(`Document confidentiel — Généré le ${dateStr}`, W / 2, 104, { align: 'center' });

  // Bloc associé
  doc.setFillColor(30, 55, 80);
  doc.roundedRect(30, 118, W - 60, 28, 3, 3, 'F');
  doc.setFontSize(9);
  doc.setTextColor(...gold);
  doc.setFont('helvetica', 'bold');
  doc.text('PRÉPARÉ POUR', W / 2, 128, { align: 'center' });
  doc.setFontSize(14);
  doc.setTextColor(...white);
  doc.text(associeName || 'Associé Valora', W / 2, 138, { align: 'center' });

  // Indicateurs clés cover
  const coverKpis = [
    { label: 'PATRIMOINE', val: kpis[0]?.value || '3 200 000 €' },
    { label: 'RENDEMENT NET', val: kpis[1]?.value || '10,2%' },
    { label: 'RATIO LTC', val: kpis[2]?.value || '68%' },
    { label: 'LOYERS ANNUELS', val: kpis[3]?.value || '185 000 €' },
  ];
  const bw = (W - 60) / 4;
  coverKpis.forEach((k, i) => {
    const bx = 30 + i * bw;
    doc.setFillColor(20, 40, 60);
    doc.roundedRect(bx, 162, bw - 4, 28, 2, 2, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gold);
    doc.text(k.label, bx + (bw - 4) / 2, 170, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...white);
    doc.text(k.val, bx + (bw - 4) / 2, 181, { align: 'center' });
  });

  // Avertissement légal couverture
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120, 140, 160);
  doc.text(
    'Document strictement confidentiel. Réservé aux associés de la Foncière Valora.',
    W / 2, 280, { align: 'center' }
  );

  // Bande dorée inférieure
  doc.setFillColor(...gold);
  doc.rect(0, 293, W, 4, 'F');


  // ── PAGE 2 — VALORISATION & LEVÉE DE FONDS ───────────────────────────────────
  doc.addPage();
  drawPageHeader();

  sectionTitle('VALORISATION DE LA SOCIÉTÉ');

  const valItems = [
    { label: 'Valorisation Globale', val: `${typeof valorisationSociete.valeurActuelle === 'number' ? valorisationSociete.valeurActuelle.toLocaleString() : valorisationSociete.valeurActuelle} €`, evolution: valorisationSociete.evolution },
    { label: "Valeur de l'Action", val: `${valorisationSociete.valeurAction} €`, evolution: valorisationSociete.plusValueAction },
    { label: "Nombre d'Actions", val: `${typeof valorisationSociete.nombreActions === 'number' ? valorisationSociete.nombreActions.toLocaleString() : valorisationSociete.nombreActions}`, evolution: 'Actions émises' },
    { label: 'Plus-value Réalisée', val: `+${typeof valorisationSociete.plusValueTotal === 'number' ? valorisationSociete.plusValueTotal.toLocaleString() : valorisationSociete.plusValueTotal || '250 000'} €`, evolution: '2024-2025' },
  ];
  const vbw = (W - 28) / 2;
  valItems.forEach((item, i) => {
    const bx = 14 + (i % 2) * (vbw + 2);
    const by = y + Math.floor(i / 2) * 24;
    doc.setFillColor(...navy);
    doc.roundedRect(bx, by, vbw, 20, 2, 2, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 195, 210);
    doc.text(item.label, bx + 6, by + 7);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...gold);
    doc.text(item.val, bx + 6, by + 15);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gold);
    doc.text(item.evolution, bx + vbw - 6, by + 15, { align: 'right' });
  });
  y += 52;

  // Levée de fonds
  sectionTitle('LEVÉE DE FONDS EN COURS');
  doc.setFillColor(...gold);
  doc.roundedRect(14, y, W - 28, 42, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...navy);
  doc.text(leveeEnCours.titre || 'Série A — Levée de Fonds Inaugurale', 20, y + 9);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor([26, 58, 82, 0.8]);
  if (leveeEnCours.description) {
    const lines = doc.splitTextToSize(leveeEnCours.description, W - 40);
    doc.text(lines[0], 20, y + 16);
  }

  const lfItems = [
    { label: 'Objectif', val: `${leveeEnCours.objectif?.toLocaleString()} €` },
    { label: 'Collecté', val: `${leveeEnCours.collecte?.toLocaleString()} €` },
    { label: 'Souscripteurs', val: `${leveeEnCours.souscripteurs}` },
    { label: 'Clôture', val: leveeEnCours.dateCloture },
    { label: 'Ticket min.', val: leveeEnCours.ticketMinimum },
    { label: 'Type titre', val: leveeEnCours.typeTitre },
  ];
  const lfbw = (W - 40) / 3;
  lfItems.forEach((item, i) => {
    const lx = 20 + (i % 3) * lfbw;
    const ly = y + 22 + Math.floor(i / 3) * 10;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...navy);
    doc.text(item.label, lx, ly);
    doc.setFont('helvetica', 'bold');
    doc.text(item.val || '—', lx, ly + 5);
  });

  // Barre de progression
  y += 47;
  doc.setFillColor(220, 224, 230);
  doc.roundedRect(14, y, W - 28, 4, 2, 2, 'F');
  const pct = leveeEnCours.pourcentage || 0;
  doc.setFillColor(...navy);
  doc.roundedRect(14, y, (W - 28) * pct / 100, 4, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...navy);
  doc.text(`${pct}% de l'objectif atteint`, 14, y + 10);
  y += 16;


  // ── PAGE 3 — KPIs & INDICATEURS ──────────────────────────────────────────────
  newPage();

  sectionTitle('INDICATEURS DE PERFORMANCE');
  const kpiBoxW = (W - 28 - 6) / 4;
  kpis.slice(0, 4).forEach((kpi, i) => {
    kpiBox(14 + i * (kpiBoxW + 2), y, kpiBoxW, 24, kpi.label, kpi.value, kpi.change, kpi.positive);
  });
  y += 30;

  sectionTitle('INDICATEURS OPÉRATIONNELS');
  const indics = [
    ["Taux d'occupation", indicRaw.occupation],
    ['Délai moyen de location', indicRaw.delaiLocation],
    ['Dette résiduelle', indicRaw.dette],
    ["Nombre d'actifs", indicRaw.nbActifs],
    ['Total lots', indicRaw.totalLots],
    ['Couverture loyers/dette', indicRaw.couvertureLoyers || '~1,4x'],
    ['LTV (Loan to Value)', kpis[2]?.value || '68%'],
  ];
  indics.forEach(([label, val], i) => dataRow(label, val, i % 2 === 0));
  y += 6;

  sectionTitle('REVENUS & RÉSULTATS');
  [
    ['Revenus locatifs annuels', resultatsRaw.loyers],
    ['Taux occupation moyen', resultatsRaw.tauxOccupation],
    ['Résultat net (dernier trimestre)', resultatsRaw.resultatNet],
    ['Date de publication', resultatsRaw.datePub],
    ['Prochain résultat net estimé', resultatsRaw.prochainResultat],
    ['Date prochain résultat', resultatsRaw.dateProchaineResult],
  ].forEach(([label, val], i) => dataRow(label, val, i % 2 === 0));
  y += 6;

  sectionTitle('PERFORMANCE ÉNERGÉTIQUE');
  [
    ['CO₂ économisées/an', energieRaw.co2],
    ['Réduction consommation énergétique', energieRaw.conso],
    ['Classe DPE moyenne du parc', 'C'],
  ].forEach(([label, val], i) => dataRow(label, val, i % 2 === 0));


  // ── PAGE 4 — PATRIMOINE & ACQUISITIONS ───────────────────────────────────────
  newPage();

  sectionTitle('COMPOSITION DU PATRIMOINE');
  if (patrimoine.length > 0) {
    // En-tête tableau
    doc.setFillColor(...navy);
    doc.rect(14, y, W - 28, 8, 'F');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...white);
    ['Actif', 'Lots', 'DPE', 'Occupation', 'Valeur'].forEach((h, i) => {
      const cols = [18, 80, 100, 122, 160];
      doc.text(h, cols[i], y + 5.5);
    });
    y += 9;
    patrimoine.forEach((actif, i) => {
      checkY(8);
      if (i % 2 === 0) { doc.setFillColor(...lightGray); doc.rect(14, y, W - 28, 8, 'F'); }
      doc.setFontSize(7.5);
      doc.setFont('helvetica', i % 2 === 0 ? 'normal' : 'normal');
      doc.setTextColor(...darkText);
      const name = doc.splitTextToSize(actif.nom || '—', 58);
      doc.text(name[0], 18, y + 5.5);
      doc.text(`${actif.lots || 0}`, 80, y + 5.5);
      doc.text(actif.dpe || '—', 100, y + 5.5);
      doc.text(actif.occupation || '—', 122, y + 5.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...navy);
      doc.text(actif.valeur || '—', W - 16, y + 5.5, { align: 'right' });
      y += 8;
    });
  } else {
    doc.setFontSize(8); doc.setTextColor(...textGray); doc.text('Aucun actif patrimonial renseigné.', 18, y + 5); y += 12;
  }
  y += 8;

  sectionTitle('ACQUISITIONS EN COURS');
  acquisitionsEnCours.forEach((acq, i) => {
    checkY(22);
    doc.setFillColor(...lightGray);
    doc.roundedRect(14, y, W - 28, 20, 2, 2, 'F');
    doc.setFillColor(...gold);
    doc.rect(14, y, 3, 20, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...navy);
    doc.text(acq.ville, 22, y + 7);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textGray);
    doc.text(`${acq.lots} lots  •  DPE ${acq.dpe}  •  ${acq.prix}  •  Livraison : ${acq.livraison}`, 22, y + 13);
    // mini progress bar
    const avPct = acq.avancement || 0;
    doc.setFillColor(210, 215, 225);
    doc.roundedRect(22, y + 15, W - 50, 2, 1, 1, 'F');
    doc.setFillColor(...gold);
    doc.roundedRect(22, y + 15, (W - 50) * avPct / 100, 2, 1, 1, 'F');
    doc.setFontSize(6.5);
    doc.text(`${acq.statut} — ${avPct}%`, W - 16, y + 17, { align: 'right' });
    y += 24;
  });

  if (chantiers.length > 0) {
    sectionTitle('CHANTIERS EN COURS');
    chantiers.forEach((c) => {
      checkY(18);
      progressBar(`${c.ville} (${c.lots} lots${c.dpe ? ' — ' + c.dpe : ''})`, `${c.avancement}%`, c.avancement);
    });
  }


  // ── PAGE 5 — ROADMAP & ACTUALITÉS ────────────────────────────────────────────
  newPage();

  sectionTitle('ROADMAP 2026–2027');
  roadmap.forEach((item, i) => {
    checkY(14);
    const isActive = item.statut === 'en_cours';
    const isDone = item.statut === 'termine';
    doc.setFillColor(...(isDone ? [16, 185, 129] : isActive ? gold : [210, 214, 220]));
    doc.circle(20, y + 5, 3, 'F');
    doc.setFontSize(8.5);
    doc.setFont('helvetica', isActive ? 'bold' : 'normal');
    doc.setTextColor(...(isActive ? navy : textGray));
    doc.text(item.etape, 28, y + 6);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textGray);
    doc.text(item.date, W - 16, y + 6, { align: 'right' });
    if (isActive && item.avancement > 0) {
      y += 8;
      doc.setFillColor(210, 215, 225);
      doc.roundedRect(28, y, W - 44, 2.5, 1, 1, 'F');
      doc.setFillColor(...gold);
      doc.roundedRect(28, y, (W - 44) * item.avancement / 100, 2.5, 1, 1, 'F');
      doc.setFontSize(6.5);
      doc.setTextColor(...textGray);
      doc.text(`${item.avancement}% complété`, 28, y + 6);
      y += 8;
    } else {
      y += 12;
    }
  });

  y += 6;
  sectionTitle('ACTUALITÉS RÉCENTES');
  actualites.forEach((actu, i) => {
    checkY(18);
    doc.setFillColor(...lightGray);
    doc.roundedRect(14, y, W - 28, 16, 2, 2, 'F');
    doc.setFillColor(...gold);
    doc.rect(14, y, 3, 16, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textGray);
    doc.text(actu.date, 22, y + 5);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...navy);
    doc.text(actu.title, 22, y + 10.5);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textGray);
    const descLines = doc.splitTextToSize(actu.desc || '', W - 44);
    doc.text(descLines[0], 22, y + 14.5);
    y += 20;
  });


  // ── PAGE 6 — DETTE & GOUVERNANCE ─────────────────────────────────────────────
  newPage();

  sectionTitle('ÉTAT DE LA DETTE & FINANCEMENT');
  [
    ['Dette totale résiduelle', indicRaw.dette],
    ['LTV (Loan to Value)', kpis[2]?.value || '68%'],
    ['Seuil cible LTV', '≤ 80%'],
    ['Actifs financés', indicRaw.nbActifs],
    ['Couverture loyers / dette', indicRaw.couvertureLoyers || '~1,4x'],
  ].forEach(([label, val], i) => dataRow(label, val, i % 2 === 0));
  y += 4;
  // Barre LTV
  const ltvPct = parseInt(kpis[2]?.value) || 68;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textGray);
  doc.text('Ratio LTV', 18, y + 4);
  doc.text(`Seuil cible ≤ 80%`, W - 16, y + 4, { align: 'right' });
  y += 6;
  doc.setFillColor(220, 224, 230);
  doc.roundedRect(18, y, W - 36, 5, 2, 2, 'F');
  doc.setFillColor(...gold);
  doc.roundedRect(18, y, (W - 36) * ltvPct / 100, 5, 2, 2, 'F');
  y += 10;

  checkY(20);
  doc.setFillColor(255, 251, 235);
  doc.roundedRect(14, y, W - 28, 20, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(146, 64, 14);
  doc.text('Stratégie de dette :', 20, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);
  const stratLines = doc.splitTextToSize(gouvernanceRaw.stratégieDette || '', W - 44);
  doc.text(stratLines.slice(0, 2), 20, y + 13);
  y += 26;

  sectionTitle('GOUVERNANCE & COMITÉ OPÉRATIONNEL');
  doc.setFillColor(...navy);
  doc.roundedRect(14, y, W - 28, 24, 3, 3, 'F');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 215, 230);
  const govLines = doc.splitTextToSize(gouvernanceRaw.texte || '', W - 40);
  doc.text(govLines.slice(0, 3), 20, y + 10);
  y += 30;


  // ── PIED DE PAGE TOUTES PAGES ─────────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 2; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(...navy);
    doc.rect(0, 287, W, 10, 'F');
    doc.setFillColor(...gold);
    doc.rect(0, 285, W, 2, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...white);
    doc.text('La Foncière Valora — Groupe Auvergne et Patrimoine — Vichy', 14, 292.5);
    doc.text(`Page ${p} / ${totalPages}`, W - 14, 292.5, { align: 'right' });
  }

  // Sauvegarde
  const filename = `Rapport_Valora_${associeName?.replace(/\s+/g, '_') || 'Associe'}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}