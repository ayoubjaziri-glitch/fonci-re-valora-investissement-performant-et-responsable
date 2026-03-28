import { jsPDF } from 'jspdf';

// ─── COULEURS ───────────────────────────────────────────────────────────────
const C = {
  navy:      [26, 58, 82],
  navyDark:  [15, 23, 42],
  gold:      [201, 169, 97],
  goldLight: [245, 235, 210],
  white:     [255, 255, 255],
  gray100:   [245, 247, 250],
  gray200:   [226, 232, 240],
  gray400:   [148, 163, 184],
  gray600:   [71, 85, 105],
  gray900:   [15, 23, 42],
  green:     [16, 185, 129],
  red:       [239, 68, 68],
  amber:     [245, 158, 11],
};

// ─── SAFE STRING ────────────────────────────────────────────────────────────
function s(val, fallback = '-') {
  if (val === null || val === undefined) return fallback;
  return String(val)
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/≈/g, '~')
    .replace(/—/g, '-')
    .replace(/–/g, '-')
    .replace(/CO₂/g, 'CO2')
    .replace(/[^\x00-\x7F]/g, (c) => {
      // Remplacer tout autre caractère non-ASCII par son équivalent ou le supprimer
      const map = { '°': 'deg', '×': 'x', '²': '2', '³': '3', '¹': '1', '\u2019': "'", '\u2018': "'", '\u201C': '"', '\u201D': '"' };
      return map[c] !== undefined ? map[c] : c;
    });
}

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
  const MARGIN = 14;
  const CONTENT_W = W - MARGIN * 2;
  const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  let y = 0;

  // ─── HELPERS ─────────────────────────────────────────────────────────────

  function fc(color) { doc.setFillColor(color[0], color[1], color[2]); }
  function tc(color) { doc.setTextColor(color[0], color[1], color[2]); }
  function dc(color) { doc.setDrawColor(color[0], color[1], color[2]); }

  function font(style = 'normal', size = 9) {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
  }

  function checkY(needed = 20) {
    if (y + needed > 278) { newPage(); }
  }

  function pageFooter() {
    const total = doc.internal.getNumberOfPages();
    const current = doc.internal.getCurrentPageInfo().pageNumber;
    fc(C.navyDark); doc.rect(0, 286, W, 11, 'F');
    fc(C.gold); doc.rect(0, 284.5, W, 1.5, 'F');
    font('normal', 7); tc(C.gray400);
    doc.text('LA FONCIÈRE VALORA — Document strictement confidentiel', MARGIN, 291.5);
    doc.text(`Page ${current} / ${total}`, W - MARGIN, 291.5, { align: 'right' });
  }

  function pageHeader() {
    fc(C.navyDark); doc.rect(0, 0, W, 14, 'F');
    fc(C.gold); doc.rect(0, 13, W, 1.5, 'F');
    font('bold', 7.5); tc(C.gold);
    doc.text('LA FONCIÈRE VALORA', MARGIN, 9);
    font('normal', 7); tc(C.gray400);
    doc.text(`Rapport Associés — ${dateStr}`, W - MARGIN, 9, { align: 'right' });
    y = 20;
  }

  function newPage() {
    pageFooter();
    doc.addPage();
    pageHeader();
  }

  function sectionHeader(title) {
    checkY(16);
    y += 2;
    fc(C.gold); doc.rect(MARGIN, y, 3, 8, 'F');
    font('bold', 11); tc(C.navy);
    doc.text(title.toUpperCase(), MARGIN + 7, y + 6);
    // Ligne séparatrice
    fc(C.gray200); doc.rect(MARGIN + 7, y + 8.5, CONTENT_W - 7, 0.4, 'F');
    y += 14;
  }

  function labelValue(label, value, x, yPos, labelW = 55) {
    font('normal', 8); tc(C.gray600);
    doc.text(s(label), x, yPos);
    font('bold', 8); tc(C.navyDark);
    doc.text(s(value), x + labelW, yPos);
  }

  function row(label, value, shade = false, y_override = null) {
    const ry = y_override !== null ? y_override : y;
    checkY(8);
    if (shade) { fc(C.gray100); doc.rect(MARGIN, ry, CONTENT_W, 7.5, 'F'); }
    font('normal', 8.5); tc(C.gray600);
    doc.text(s(label), MARGIN + 4, ry + 5.5);
    font('bold', 8.5); tc(C.navyDark);
    doc.text(s(value), W - MARGIN - 2, ry + 5.5, { align: 'right' });
    if (y_override === null) y += 8;
  }

  function miniBar(x, yPos, barW, pct, color = C.gold) {
    fc(C.gray200); doc.roundedRect(x, yPos, barW, 2.5, 1, 1, 'F');
    const p = Math.min(Math.max(parseInt(pct) || 0, 0), 100);
    if (p > 0) { fc(color); doc.roundedRect(x, yPos, barW * p / 100, 2.5, 1, 1, 'F'); }
    return p;
  }

  function badge(text, x, yPos, bgColor, txtColor) {
    const tw = doc.getTextWidth(s(text)) + 6;
    fc(bgColor); doc.roundedRect(x, yPos - 3.5, tw, 5, 1.5, 1.5, 'F');
    font('bold', 6.5); tc(txtColor);
    doc.text(s(text), x + 3, yPos);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PAGE 1 — COUVERTURE
  // ════════════════════════════════════════════════════════════════════════════
  fc(C.navyDark); doc.rect(0, 0, W, 297, 'F');

  // Bande or supérieure épaisse
  fc(C.gold); doc.rect(0, 0, W, 5, 'F');

  // Filigrane géométrique (rectangle creux)
  dc(C.gold); doc.setLineWidth(0.3);
  doc.roundedRect(10, 10, W - 20, 277, 4, 4, 'S');
  doc.setLineWidth(0.1);

  // Logo texte
  y = 65;
  font('bold', 10); tc(C.gold);
  doc.text('LA FONCIÈRE VALORA', W / 2, y, { align: 'center' });

  y += 6;
  fc(C.gold); doc.rect(W / 2 - 30, y, 60, 0.5, 'F');

  y += 9;
  font('bold', 22); tc(C.white);
  doc.text('RAPPORT DE SITUATION', W / 2, y, { align: 'center' });
  y += 11;
  font('normal', 14); tc(C.gold);
  doc.text('ASSOCIÉ CONFIDENTIEL', W / 2, y, { align: 'center' });

  y += 10;
  fc(C.gold); doc.rect(W / 2 - 30, y, 60, 0.5, 'F');

  // Bloc associé
  y += 14;
  fc([20, 40, 65]); doc.roundedRect(35, y, W - 70, 24, 3, 3, 'F');
  dc(C.gold); doc.setLineWidth(0.4);
  doc.roundedRect(35, y, W - 70, 24, 3, 3, 'S');
  font('normal', 8); tc(C.gold);
  doc.text('PRÉPARÉ EXCLUSIVEMENT POUR', W / 2, y + 8, { align: 'center' });
  font('bold', 14); tc(C.white);
  doc.text(s(associeName, 'Associé Valora'), W / 2, y + 19, { align: 'center' });

  // KPIs couverture (4 blocs)
  y += 34;
  const coverKpis = [
    { label: 'PATRIMOINE', val: s(kpis[0]?.value, '3 200 000 €') },
    { label: 'RENDEMENT NET', val: s(kpis[1]?.value, '10,2%') },
    { label: 'RATIO LTV', val: s(kpis[2]?.value, '68%') },
    { label: 'LOYERS / AN', val: s(kpis[3]?.value, '185 000 €') },
  ];
  const cbw = (W - 40) / 4;
  coverKpis.forEach((k, i) => {
    const bx = 20 + i * cbw;
    fc([18, 38, 60]); doc.roundedRect(bx, y, cbw - 3, 26, 2, 2, 'F');
    dc(C.gold); doc.setLineWidth(0.3);
    doc.roundedRect(bx, y, cbw - 3, 26, 2, 2, 'S');
    font('normal', 6.5); tc(C.gold);
    doc.text(k.label, bx + (cbw - 3) / 2, y + 8, { align: 'center' });
    font('bold', 11); tc(C.white);
    doc.text(k.val, bx + (cbw - 3) / 2, y + 19, { align: 'center' });
  });

  // Date & mentions légales
  y += 36;
  font('normal', 7.5); tc(C.gray400);
  doc.text(`Généré le ${dateStr}`, W / 2, y, { align: 'center' });
  y += 7;
  font('italic', 6.5); tc(C.gray600);
  doc.text(
    'Document strictement confidentiel. Réservé aux associés de la Foncière Valora. Ne pas diffuser.',
    W / 2, y, { align: 'center' }
  );

  // Bande or inférieure
  fc(C.gold); doc.rect(0, 292, W, 5, 'F');


  // ════════════════════════════════════════════════════════════════════════════
  // PAGE 2 — VALORISATION & LEVÉE DE FONDS
  // ════════════════════════════════════════════════════════════════════════════
  doc.addPage();
  pageHeader();

  // ── Valorisation ──
  sectionHeader('Valorisation de la Société');

  const valItems = [
    { label: 'Valorisation Globale', value: `${s(valorisationSociete.valeurActuelle)} €`, sub: s(valorisationSociete.evolution) },
    { label: "Valeur de l'Action", value: `${s(valorisationSociete.valeurAction)} €`, sub: s(valorisationSociete.plusValueAction) },
    { label: "Nombre d'Actions", value: s(valorisationSociete.nombreActions), sub: 'Actions émises' },
    { label: 'Plus-value Réalisée', value: `+${s(valorisationSociete.plusValueTotal || '250 000')} €`, sub: '2024–2025' },
  ];
  const vbw = (CONTENT_W - 3) / 2;
  valItems.forEach((item, i) => {
    const bx = MARGIN + (i % 2) * (vbw + 3);
    const by = y + Math.floor(i / 2) * 22;
    fc(C.navy); doc.roundedRect(bx, by, vbw, 19, 2, 2, 'F');
    font('normal', 7); tc(C.gray400);
    doc.text(item.label, bx + 6, by + 7);
    font('bold', 12); tc(C.gold);
    doc.text(item.value, bx + 6, by + 14.5);
    font('normal', 7); tc([150, 175, 200]);
    doc.text(item.sub, bx + vbw - 4, by + 14.5, { align: 'right' });
  });
  y += 47;

  // ── Levée de fonds ──
  sectionHeader('Levée de Fonds en Cours');

  // Fond doré
  fc(C.goldLight); doc.roundedRect(MARGIN, y, CONTENT_W, 52, 3, 3, 'F');
  dc(C.gold); doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN, y, CONTENT_W, 52, 3, 3, 'S');

  // Pastille animée simulée
  fc(C.navy); doc.circle(MARGIN + 8, y + 8, 3, 'F');
  fc(C.gold); doc.circle(MARGIN + 8, y + 8, 1.5, 'F');

  font('bold', 10); tc(C.navy);
  doc.text(s(leveeEnCours.titre, 'Levée de Fonds Inaugurale'), MARGIN + 15, y + 9);

  if (leveeEnCours.description) {
    font('normal', 7.5); tc(C.gray600);
    const lines = doc.splitTextToSize(s(leveeEnCours.description), CONTENT_W - 12);
    doc.text(lines.slice(0, 2), MARGIN + 6, y + 17);
  }

  // 6 indicateurs en grille 3x2
  const lfItems = [
    ['Objectif', `${s(leveeEnCours.objectif)} €`],
    ['Collecté', `${s(leveeEnCours.collecte)} €`],
    ['Souscripteurs', s(leveeEnCours.souscripteurs)],
    ['Clôture', s(leveeEnCours.dateCloture)],
    ['Ticket minimum', s(leveeEnCours.ticketMinimum)],
    ['Type de titre', s(leveeEnCours.typeTitre)],
  ];
  const lfColW = (CONTENT_W - 12) / 3;
  lfItems.forEach(([label, value], i) => {
    const lx = MARGIN + 6 + (i % 3) * lfColW;
    const ly = y + 26 + Math.floor(i / 3) * 12;
    font('normal', 6.5); tc(C.gray600);
    doc.text(label, lx, ly);
    font('bold', 8.5); tc(C.navy);
    doc.text(value, lx, ly + 5.5);
  });

  // Barre progression
  y += 55;
  font('normal', 7.5); tc(C.gray600);
  doc.text("Progression de la collecte", MARGIN, y);
  font('bold', 7.5); tc(C.navy);
  const pct = leveeEnCours.pourcentage || 0;
  doc.text(`${pct}%`, W - MARGIN, y, { align: 'right' });
  y += 4;
  fc(C.gray200); doc.roundedRect(MARGIN, y, CONTENT_W, 4, 2, 2, 'F');
  if (pct > 0) { fc(C.navy); doc.roundedRect(MARGIN, y, CONTENT_W * pct / 100, 4, 2, 2, 'F'); }
  y += 8;


  // ════════════════════════════════════════════════════════════════════════════
  // PAGE 3 — KPIs & INDICATEURS
  // ════════════════════════════════════════════════════════════════════════════
  newPage();

  sectionHeader('Indicateurs de Performance Clés');

  // 4 KPI boxes
  const kpiW = (CONTENT_W - 6) / 4;
  kpis.slice(0, 4).forEach((kpi, i) => {
    const bx = MARGIN + i * (kpiW + 2);
    const by = y;
    fc(C.gray100); doc.roundedRect(bx, by, kpiW, 26, 2, 2, 'F');
    // Barre couleur à gauche
    fc(kpi.positive !== false ? C.green : C.red);
    doc.roundedRect(bx, by, 3, 26, 1, 1, 'F');
    font('normal', 6.5); tc(C.gray400);
    doc.text(s(kpi.label), bx + 6, by + 7);
    font('bold', 12); tc(C.navyDark);
    doc.text(s(kpi.value), bx + 6, by + 16);
    font('bold', 7); tc(kpi.positive !== false ? C.green : C.red);
    doc.text(s(kpi.change), bx + 6, by + 22.5);
  });
  y += 32;

  // ── Indicateurs Opérationnels ──
  sectionHeader('Indicateurs Opérationnels');
  const indics = [
    ["Taux d'occupation", s(indicRaw.occupation)],
    ['Délai moyen de location', s(indicRaw.delaiLocation)],
    ["Nombre d'actifs", s(indicRaw.nbActifs)],
    ['Total lots', s(indicRaw.totalLots)],
    ['Dette résiduelle', s(indicRaw.dette)],
    ['Couverture loyers / dette', s(indicRaw.couvertureLoyers, '~1,4x')],
    ['LTV (Loan to Value)', s(kpis[2]?.value, '68%')],
    ['Seuil cible LTV', '<= 80%'],
  ];
  indics.forEach(([label, val], i) => row(label, val, i % 2 === 0));
  y += 4;

  // ── Revenus & Résultats ──
  sectionHeader('Revenus & Résultats');
  [
    ['Revenus locatifs annuels', s(resultatsRaw.loyers)],
    ["Taux d'occupation moyen", s(resultatsRaw.tauxOccupation)],
    ['Résultat net (dernier trimestre)', s(resultatsRaw.resultatNet)],
    ['Date de publication', s(resultatsRaw.datePub)],
    ['Prochain résultat net estimé', s(resultatsRaw.prochainResultat)],
    ['Date du prochain résultat', s(resultatsRaw.dateProchaineResult)],
  ].forEach(([label, val], i) => row(label, val, i % 2 === 0));
  y += 4;

  // ── Performance Énergétique ──
  sectionHeader('Performance Énergétique');
  [
    ['CO2 économisées par an', s(energieRaw.co2)],
    ['Réduction de la consommation énergétique', s(energieRaw.conso)],
    ['Classe DPE moyenne du parc', 'C (Basse Consommation)'],
  ].forEach(([label, val], i) => row(label, val, i % 2 === 0));


  // ════════════════════════════════════════════════════════════════════════════
  // PAGE 4 — PATRIMOINE & ACQUISITIONS
  // ════════════════════════════════════════════════════════════════════════════
  newPage();

  sectionHeader('Composition du Patrimoine');

  if (patrimoine.length > 0) {
    // En-tête tableau
    fc(C.navy); doc.rect(MARGIN, y, CONTENT_W, 8, 'F');
    font('bold', 7.5); tc(C.white);
    const cols = [MARGIN + 4, MARGIN + 65, MARGIN + 88, MARGIN + 112, W - MARGIN - 4];
    const headers = ['Actif / Localisation', 'Lots', 'DPE', 'Occupation', 'Valeur'];
    headers.forEach((h, i) => doc.text(h, i === 4 ? cols[i] : cols[i], y + 5.5, i === 4 ? { align: 'right' } : {}));
    y += 9;

    patrimoine.forEach((actif, i) => {
      checkY(8);
      if (i % 2 === 0) { fc(C.gray100); doc.rect(MARGIN, y, CONTENT_W, 8, 'F'); }
      font('normal', 7.5); tc(C.gray900);
      const nom = doc.splitTextToSize(s(actif.nom), 58);
      doc.text(nom[0], cols[0], y + 5.5);
      doc.text(s(actif.lots), cols[1], y + 5.5);
      doc.text(s(actif.dpe), cols[2], y + 5.5);
      doc.text(s(actif.occupation), cols[3], y + 5.5);
      font('bold', 7.5); tc(C.navy);
      doc.text(s(actif.valeur), cols[4], y + 5.5, { align: 'right' });
      y += 8;
    });
  } else {
    font('italic', 8); tc(C.gray400);
    doc.text('Aucun actif patrimonial renseigné.', MARGIN + 4, y + 6);
    y += 12;
  }
  y += 6;

  // ── Acquisitions en cours ──
  sectionHeader('Acquisitions en Cours');
  acquisitionsEnCours.forEach((acq) => {
    checkY(28);
    fc(C.gray100); doc.roundedRect(MARGIN, y, CONTENT_W, 24, 2, 2, 'F');
    fc(C.gold); doc.roundedRect(MARGIN, y, 3, 24, 1, 1, 'F');

    font('bold', 9); tc(C.navy);
    doc.text(s(acq.ville), MARGIN + 7, y + 8);

    font('normal', 7.5); tc(C.gray600);
    const detail = [
      acq.lots ? `${acq.lots} lots` : null,
      acq.dpe ? `DPE ${acq.dpe}` : null,
      acq.prix ? acq.prix : null,
      acq.livraison ? `Livraison : ${acq.livraison}` : null,
    ].filter(Boolean).join('   •   ');
    doc.text(detail, MARGIN + 7, y + 14.5);

    // Statut badge
    badge(s(acq.statut), W - MARGIN - doc.getTextWidth(s(acq.statut)) - 12, y + 8.5, C.goldLight, C.navy);

    // Mini progress bar
    const av = acq.avancement || 0;
    miniBar(MARGIN + 7, y + 18.5, CONTENT_W - 14, av);
    font('normal', 6.5); tc(C.gray400);
    doc.text(`${av}% complété`, W - MARGIN - 4, y + 21, { align: 'right' });
    y += 28;
  });

  // ── Chantiers ──
  if (chantiers.length > 0) {
    checkY(20);
    sectionHeader('Chantiers en Cours');
    chantiers.forEach((c) => {
      checkY(16);
      font('bold', 8.5); tc(C.navyDark);
      doc.text(s(c.ville), MARGIN + 4, y + 5);
      font('normal', 7); tc(C.gray600);
      const sub = [c.lots ? `${c.lots} lots` : null, c.dpe ? `DPE ${c.dpe}` : null].filter(Boolean).join(' — ');
      if (sub) doc.text(sub, MARGIN + 4, y + 10);
      font('bold', 7.5); tc(C.navy);
      doc.text(`${c.avancement || 0}%`, W - MARGIN - 4, y + 5, { align: 'right' });
      miniBar(MARGIN + 4, y + 12, CONTENT_W - 8, c.avancement);
      y += 18;
    });
  }


  // ════════════════════════════════════════════════════════════════════════════
  // PAGE 5 — ROADMAP & ACTUALITÉS
  // ════════════════════════════════════════════════════════════════════════════
  newPage();

  sectionHeader('Roadmap Stratégique 2026–2027');

  roadmap.forEach((item, i) => {
    checkY(18);
    const isDone = item.statut === 'termine';
    const isActive = item.statut === 'en_cours';
    const circleFill = isDone ? C.green : isActive ? C.gold : C.gray200;
    fc(circleFill); doc.circle(MARGIN + 6, y + 5.5, 4, 'F');
    if (isDone) { font('bold', 7); tc(C.white); doc.text('✓', MARGIN + 6, y + 7.5, { align: 'center' }); }
    else if (isActive) { fc(C.navy); doc.circle(MARGIN + 6, y + 5.5, 1.5, 'F'); }

    // Ligne verticale de connexion (sauf dernier)
    if (i < roadmap.length - 1) {
      fc(C.gray200); doc.rect(MARGIN + 5.5, y + 9.5, 1, 7, 'F');
    }

    font(isActive ? 'bold' : 'normal', 9);
    tc(isActive ? C.navyDark : isDone ? C.gray600 : C.gray600);
    doc.text(s(item.etape), MARGIN + 15, y + 6.5);
    font('normal', 7.5); tc(C.gray400);
    doc.text(s(item.date), W - MARGIN - 4, y + 6.5, { align: 'right' });

    if (isActive && item.avancement > 0) {
      y += 9;
      miniBar(MARGIN + 15, y + 1, CONTENT_W - 19, item.avancement, C.gold);
      font('normal', 6.5); tc(C.gray400);
      doc.text(`${item.avancement}% complété`, MARGIN + 15, y + 7);
      y += 10;
    } else {
      y += 14;
    }
  });

  y += 4;
  sectionHeader('Actualités Récentes');

  actualites.forEach((actu) => {
    checkY(22);
    fc(C.gray100); doc.roundedRect(MARGIN, y, CONTENT_W, 19, 2, 2, 'F');
    fc(C.gold); doc.roundedRect(MARGIN, y, 3, 19, 1, 1, 'F');

    font('normal', 6.5); tc(C.gray400);
    doc.text(s(actu.date), MARGIN + 7, y + 6);

    font('bold', 8.5); tc(C.navy);
    doc.text(s(actu.title), MARGIN + 7, y + 11.5);

    font('normal', 7); tc(C.gray600);
    const descLines = doc.splitTextToSize(s(actu.desc), CONTENT_W - 14);
    doc.text(descLines[0], MARGIN + 7, y + 16.5);
    y += 23;
  });


  // ════════════════════════════════════════════════════════════════════════════
  // PAGE 6 — DETTE & GOUVERNANCE
  // ════════════════════════════════════════════════════════════════════════════
  newPage();

  sectionHeader('État de la Dette & Financement');

  [
    ['Dette totale résiduelle', s(indicRaw.dette)],
    ['LTV (Loan to Value)', s(kpis[2]?.value, '68%')],
    ['Seuil cible LTV', '<= 80%'],
    ['Nombre d\'actifs financés', s(indicRaw.nbActifs)],
    ['Couverture loyers / dette', s(indicRaw.couvertureLoyers, '~1,4x')],
  ].forEach(([label, val], i) => row(label, val, i % 2 === 0));
  y += 4;

  // Barre LTV
  const ltvPct = parseInt(s(kpis[2]?.value, '68')) || 68;
  checkY(16);
  font('normal', 7.5); tc(C.gray600);
  doc.text('Visualisation du Ratio LTV', MARGIN + 4, y + 5);
  font('bold', 7.5); tc(C.navy);
  doc.text(`${ltvPct}% / Cible <= 80%`, W - MARGIN - 4, y + 5, { align: 'right' });
  y += 8;
  fc(C.gray200); doc.roundedRect(MARGIN + 4, y, CONTENT_W - 8, 5, 2, 2, 'F');
  fc(ltvPct <= 80 ? C.green : C.red);
  doc.roundedRect(MARGIN + 4, y, (CONTENT_W - 8) * Math.min(ltvPct, 100) / 100, 5, 2, 2, 'F');
  y += 12;

  // Bloc stratégie dette
  checkY(22);
  fc(C.goldLight); doc.roundedRect(MARGIN, y, CONTENT_W, 20, 2, 2, 'F');
  dc(C.gold); doc.setLineWidth(0.3); doc.roundedRect(MARGIN, y, CONTENT_W, 20, 2, 2, 'S');
  font('bold', 7.5); tc(C.navy);
  doc.text('Stratégie de dette', MARGIN + 6, y + 7);
  font('normal', 7.5); tc(C.gray600);
  const stratLines = doc.splitTextToSize(s(gouvernanceRaw.stratégieDette), CONTENT_W - 12);
  doc.text(stratLines.slice(0, 2), MARGIN + 6, y + 13.5);
  y += 26;

  // ── Gouvernance ──
  sectionHeader('Gouvernance & Comité Opérationnel');
  checkY(30);
  fc(C.navy); doc.roundedRect(MARGIN, y, CONTENT_W, 26, 3, 3, 'F');
  font('normal', 8); tc([200, 215, 230]);
  const govLines = doc.splitTextToSize(s(gouvernanceRaw.texte), CONTENT_W - 12);
  doc.text(govLines.slice(0, 3), MARGIN + 6, y + 10);
  y += 32;

  // ── Disclaimer légal final ──
  checkY(18);
  fc(C.gray100); doc.roundedRect(MARGIN, y, CONTENT_W, 16, 2, 2, 'F');
  font('italic', 7); tc(C.gray400);
  const disclaimer = 'Les données présentées dans ce rapport sont issues de notre système de gestion interne et sont communiquées à titre informatif. Ce document est strictement confidentiel et ne constitue pas une offre de titres financiers.';
  const dLines = doc.splitTextToSize(disclaimer, CONTENT_W - 10);
  doc.text(dLines, MARGIN + 5, y + 7);


  // ── Pieds de page toutes les pages ──
  const total = doc.internal.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    if (p > 1) pageFooter();
    else {
      // Couverture : pas de footer standard (bande or déjà présente)
    }
  }

  // Sauvegarde
  const filename = `Rapport_Valora_${s(associeName, 'Associe').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}