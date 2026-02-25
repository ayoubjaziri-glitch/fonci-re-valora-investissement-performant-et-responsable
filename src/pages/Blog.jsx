import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, TrendingUp, Building2, Coins, Users, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('tous');

  const categories = [
    { id: 'tous', label: 'Tous les articles' },
    { id: 'marche', label: 'Marché immobilier' },
    { id: 'financement', label: 'Financement' },
    { id: 'strategie', label: 'Stratégie' },
    { id: 'reglementation', label: 'Réglementation' }
  ];

  const articles = [
    {
      id: 1,
      title: "Marché immobilier résidentiel 2026 : Opportunités et tensions dans les villes secondaires",
      slug: "marche-immobilier-2026",
      category: "marche",
      date: "15 janvier 2026",
      readTime: "8 min",
      excerpt: "Analyse approfondie des tendances du marché immobilier français en 2026 : tensions locatives, baisse des volumes de transactions et opportunités pour les investisseurs institutionnels.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      content: `
        <h2>Un marché en pleine mutation</h2>
        <p>Le marché immobilier français traverse en 2026 une période de transformation structurelle. Après deux années de baisse des volumes de transactions (-25% en 2024, -15% en 2025), le marché résidentiel affiche des signaux de stabilisation dans les villes secondaires, portés par des fondamentaux solides.</p>

        <h3>Les villes secondaires : nouveaux eldorados ?</h3>
        <p>Bordeaux, Lyon, Toulouse, Nantes et Montpellier bénéficient d'une attractivité renforcée. Les prix au m² restent contenus (entre 3 500 € et 5 500 €/m² en moyenne) comparés à Paris (>10 000 €/m²), tout en offrant des perspectives de valorisation intéressantes.</p>

        <p><strong>Facteurs clés de cette dynamique :</strong></p>
        <ul>
          <li>Bassins d'emploi dynamiques (tertiaire, santé, enseignement supérieur)</li>
          <li>Démographie favorable (solde migratoire positif)</li>
          <li>Infrastructures de transport en développement (LGV, tramways)</li>
          <li>Qualité de vie recherchée par les actifs (télétravail partiel)</li>
        </ul>

        <h3>Tensions locatives : un contexte porteur</h3>
        <p>Le marché locatif reste sous tension dans la plupart des agglomérations françaises. Le taux de vacance moyen se situe autour de 7,5%, mais descend à moins de 5% dans les centres-villes dynamiques.</p>

        <p><strong>Conséquences pour les investisseurs :</strong></p>
        <ul>
          <li>Taux d'occupation élevés (>95% pour les actifs bien situés et rénovés)</li>
          <li>Délais de location réduits (15-30 jours en moyenne)</li>
          <li>Pouvoir de négociation favorable lors des renouvellements de bail</li>
          <li>Rendements locatifs bruts maintenus entre 4,5% et 6% selon les villes</li>
        </ul>

        <h3>Notre positionnement stratégique</h3>
        <p>La Foncière Patrimoniale capitalise sur ces dynamiques en ciblant des actifs décotés (passoires thermiques F/G) dans des zones tendues. Notre stratégie repose sur trois piliers :</p>

        <ol>
          <li><strong>Acquisition sélective</strong> : immeubles mal valorisés dans des emplacements de qualité</li>
          <li><strong>Réhabilitation énergétique</strong> : passage obligatoire en DPE C minimum (objectif B/A)</li>
          <li><strong>Gestion active</strong> : optimisation des loyers et du taux d'occupation</li>
        </ol>

        <p>Cette approche permet de capter une double création de valeur : revalorisation patrimoniale par les travaux et arbitrage à terme sur un marché assaini.</p>

        <h3>Perspectives 2026-2028</h3>
        <p>Les prévisions pour les 24 prochains mois restent prudentes mais constructives :</p>
        <ul>
          <li>Stabilisation des prix dans les villes secondaires (+0% à +2%/an)</li>
          <li>Maintien des tensions locatives (déficit d'offre structurel)</li>
          <li>Montée en puissance de la rénovation énergétique (contraintes réglementaires)</li>
          <li>Taux de crédit immobilier stabilisés autour de 3,5%-4%</li>
        </ul>

        <p><strong>Conclusion :</strong> Le marché 2026 offre des opportunités ciblées pour les investisseurs structurés capables d'identifier et de transformer des actifs décotés en logements performants. La rareté de l'offre de qualité constitue un atout durable pour les stratégies de valorisation patrimoniale.</p>
      `
    },
    {
      id: 2,
      title: "Structuration du financement immobilier : LTC, effet de levier et optimisation du coût de la dette",
      slug: "financement-immobilier-ltc",
      category: "financement",
      date: "8 janvier 2026",
      readTime: "10 min",
      excerpt: "Comprendre les mécanismes du financement immobilier professionnel : ratio LTC, stratégies de levier et négociation bancaire pour maximiser la rentabilité des opérations.",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
      content: `
        <h2>Les fondamentaux du financement immobilier structuré</h2>
        <p>Le financement immobilier professionnel repose sur des mécanismes spécifiques qui diffèrent significativement du crédit aux particuliers. Comprendre ces leviers est essentiel pour optimiser la rentabilité d'une stratégie d'investissement.</p>

        <h3>Le ratio LTC (Loan-To-Cost) : pilier de la structuration</h3>
        <p>Le LTC mesure le rapport entre le montant emprunté et le coût total de l'opération (acquisition + travaux + frais). Contrairement au LTV (Loan-To-Value) qui se base sur la valeur estimée du bien, le LTC s'appuie sur le coût réel, offrant une vision plus conservative du risque.</p>

        <p><strong>Exemple concret :</strong></p>
        <ul>
          <li>Prix d'acquisition : 800 000 €</li>
          <li>Travaux de réhabilitation : 200 000 €</li>
          <li>Frais d'acquisition et divers : 80 000 €</li>
          <li><strong>Coût total (TC) : 1 080 000 €</strong></li>
        </ul>

        <p>Avec un financement bancaire de 850 000 € :</p>
        <ul>
          <li><strong>LTC = 850 000 / 1 080 000 = 78,7%</strong></li>
          <li>Apport requis : 230 000 € (21,3%)</li>
        </ul>

        <p>Les banques acceptent généralement des LTC compris entre 70% et 80% pour des opérations de réhabilitation portées par des structures expérimentées. Au-delà de 80%, le profil de risque est jugé trop élevé.</p>

        <h3>L'effet de levier : démultiplicateur de performance</h3>
        <p>L'effet de levier bancaire permet de démultiplier la rentabilité des fonds propres investis. Plus le levier est élevé, plus l'impact sur le TRI (Taux de Rentabilité Interne) est important.</p>

        <p><strong>Simulation comparative :</strong></p>

        <h4>Scénario 1 : Acquisition sans levier (100% fonds propres)</h4>
        <ul>
          <li>Apport : 1 080 000 €</li>
          <li>Valorisation finale (après 5 ans) : 1 500 000 €</li>
          <li>Gain : +420 000 € (+38,9%)</li>
          <li><strong>TRI : 6,8%/an</strong></li>
        </ul>

        <h4>Scénario 2 : Acquisition avec levier 4x (LTC 80%)</h4>
        <ul>
          <li>Apport : 230 000 €</li>
          <li>Emprunt : 850 000 € (3,8% sur 18 ans)</li>
          <li>Valorisation finale : 1 500 000 €</li>
          <li>Remboursement capital (5 ans) : ~210 000 €</li>
          <li>Dette résiduelle : 640 000 €</li>
          <li>Valeur nette : 860 000 €</li>
          <li>Gain net : +630 000 € (+274%)</li>
          <li><strong>TRI : 30,2%/an sur fonds propres</strong></li>
        </ul>

        <p>L'effet de levier multiplie par 4,4x la rentabilité des fonds propres dans cet exemple, démontrant la puissance du financement structuré.</p>

        <h3>Négociation bancaire : les clés du succès</h3>
        <p>Obtenir des conditions de financement optimales nécessite une préparation rigoureuse :</p>

        <h4>1. Business plan robuste</h4>
        <ul>
          <li>Analyse de marché détaillée (loyers, taux de vacance, comparables)</li>
          <li>Budget travaux précis (chiffrages d'entreprises, marge de sécurité)</li>
          <li>Projections de trésorerie sur 10 ans minimum</li>
          <li>Ratio de couverture du service de la dette (DSCR) >1,2</li>
        </ul>

        <h4>2. Track record démontrable</h4>
        <ul>
          <li>Historique d'opérations réussies</li>
          <li>Compétences techniques en gestion d'actifs</li>
          <li>Solidité financière de la structure emprunteuse</li>
        </ul>

        <h4>3. Garanties et structuration</h4>
        <ul>
          <li>Hypothèque de premier rang sur l'actif</li>
          <li>Nantissement des parts sociales (si SCI)</li>
          <li>Caution solidaire des associés selon le profil</li>
        </ul>

        <h3>Optimisation du coût de la dette</h3>
        <p>Plusieurs leviers permettent de réduire le coût global du financement :</p>

        <ul>
          <li><strong>Taux fixe vs variable</strong> : privilégier le fixe en période de hausse (sécurisation)</li>
          <li><strong>Durée d'amortissement</strong> : 15-20 ans pour équilibrer coût et mensualités</li>
          <li><strong>Différé d'amortissement</strong> : 12-24 mois pour couvrir la période de travaux</li>
          <li><strong>Assurance emprunteur</strong> : mise en concurrence systématique (économie 20-40%)</li>
          <li><strong>Remboursement anticipé</strong> : négocier des IRA (Indemnités de Remboursement Anticipé) réduites</li>
        </ul>

        <h3>Notre approche du financement</h3>
        <p>À La Foncière Patrimoniale, nous structurons nos opérations avec un LTC cible de 75-80%, permettant :</p>

        <ul>
          <li>Un effet de levier optimal (4-5x)</li>
          <li>Une sécurité financière préservée</li>
          <li>Des marges de manœuvre en cas de dérive de budget travaux</li>
          <li>Un TRI net cible >10% pour les associés</li>
        </ul>

        <p><strong>Conclusion :</strong> La maîtrise du financement immobilier est un facteur clé de succès dans les opérations de valorisation patrimoniale. Un LTC optimisé couplé à une négociation bancaire rigoureuse permet de maximiser la rentabilité tout en maîtrisant le risque.</p>
      `
    },
    {
      id: 3,
      title: "Le Carried Interest en immobilier : alignement des intérêts et rémunération de la performance",
      slug: "carried-interest-immobilier",
      category: "strategie",
      date: "22 décembre 2025",
      readTime: "7 min",
      excerpt: "Décryptage du mécanisme de carried interest : principe, calcul, alignement des intérêts entre gérants et investisseurs, et exemples concrets d'application dans l'immobilier résidentiel.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
      content: `
        <h2>Le Carried Interest : définition et principes</h2>
        <p>Le carried interest (ou "carry") est un mécanisme de rémunération à la performance couramment utilisé dans les fonds d'investissement immobiliers. Il permet aux gérants de percevoir une part des profits générés, au-delà d'un seuil de rentabilité minimum garanti aux investisseurs.</p>

        <h3>Fonctionnement du carried interest</h3>
        <p>Le carried interest repose sur trois paramètres clés :</p>

        <h4>1. Le Hurdle Rate (taux de rentabilité minimal)</h4>
        <p>Seuil de TRI que le fonds doit atteindre avant que les gérants puissent percevoir leur carried interest. Typiquement fixé entre 7% et 10% dans l'immobilier résidentiel.</p>

        <h4>2. Le taux de carry</h4>
        <p>Pourcentage des profits au-delà du hurdle rate reversé aux gérants. Généralement compris entre 15% et 25% dans les structures immobilières.</p>

        <h4>3. Le mécanisme de distribution (waterfall)</h4>
        <p>Ordre de répartition des profits entre les différentes parties prenantes :</p>

        <ol>
          <li><strong>Retour du capital</strong> : remboursement intégral des apports initiaux des investisseurs</li>
          <li><strong>Preferred return</strong> : distribution du hurdle rate aux investisseurs</li>
          <li><strong>Catch-up</strong> (optionnel) : rattrapage permettant aux gérants d'atteindre leur pourcentage cible</li>
          <li><strong>Split résiduel</strong> : partage des profits restants selon le ratio défini</li>
        </ol>

        <h3>Exemple concret de calcul</h3>
        <p><strong>Paramètres du fonds :</strong></p>
        <ul>
          <li>Capital levé : 1 000 000 €</li>
          <li>Hurdle rate : 8% TRI</li>
          <li>Carried interest : 20% au-delà du hurdle rate</li>
          <li>Durée : 5 ans</li>
        </ul>

        <h4>Scénario 1 : Performance conforme (TRI 8%)</h4>
        <ul>
          <li>Capital final : 1 469 000 €</li>
          <li>Profit total : 469 000 €</li>
          <li>Distribution investisseurs : 469 000 € (100%)</li>
          <li>Distribution gérants (carry) : 0 €</li>
        </ul>

        <h4>Scénario 2 : Surperformance (TRI 12%)</h4>
        <ul>
          <li>Capital final : 1 762 000 €</li>
          <li>Profit total : 762 000 €</li>
          <li>Hurdle rate (8% sur 5 ans) : 469 000 €</li>
          <li>Surperformance : 293 000 €</li>
          <li>Carried interest (20% de 293 000 €) : 58 600 €</li>
          <li><strong>Distribution investisseurs : 703 400 € (92,3%)</strong></li>
          <li><strong>Distribution gérants : 58 600 € (7,7%)</strong></li>
        </ul>

        <h3>Avantages du carried interest</h3>

        <h4>Pour les investisseurs :</h4>
        <ul>
          <li><strong>Alignement des intérêts</strong> : les gérants ne gagnent que si la performance dépasse les objectifs</li>
          <li><strong>Sécurité</strong> : retour du capital et rentabilité minimale garantis en priorité</li>
          <li><strong>Motivation</strong> : incitation forte à maximiser la création de valeur</li>
        </ul>

        <h4>Pour les gérants :</h4>
        <ul>
          <li><strong>Rémunération à la performance</strong> : gains proportionnels aux résultats obtenus</li>
          <li><strong>Engagement long terme</strong> : intérêt économique à la réussite du fonds</li>
          <li><strong>Reconnaissance</strong> : valorisation de l'expertise et de la gestion active</li>
        </ul>

        <h3>Variantes et bonnes pratiques</h3>

        <h4>Clawback clause</h4>
        <p>Mécanisme de restitution partielle du carry en cas de sous-performance ultérieure. Protège les investisseurs contre des distributions prématurées de carried interest.</p>

        <h4>High water mark</h4>
        <p>Le carried interest n'est calculé que sur les nouveaux profits, après récupération des pertes antérieures. Évite la double rémunération des gérants.</p>

        <h4>Catch-up à 100%</h4>
        <p>Certains fonds prévoient une phase de "rattrapage" où 100% des profits au-delà du hurdle rate vont aux gérants, jusqu'à ce qu'ils atteignent leur pourcentage cible global (ex : 20% du total).</p>

        <h3>Application à La Foncière Patrimoniale</h3>
        <p>Notre structure intègre un mécanisme de carried interest aligné sur les standards du marché :</p>

        <ul>
          <li><strong>Hurdle rate : 7% TRI net</strong></li>
          <li><strong>Carried interest : 20% de la surperformance</strong></li>
          <li><strong>Pas de frais de gestion récurrents</strong> (contrairement aux SCPI/OPCI)</li>
          <li><strong>Transparence totale</strong> : calcul du carry explicité en amont</li>
        </ul>

        <p><strong>Exemple La Foncière Patrimoniale (apport 50 000 €) :</strong></p>

        <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #f8f9fa;">
            <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Scénario</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">TRI</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Capital final</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Gain investisseur</th>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #dee2e6;">Objectif atteint</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">7%</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">70 128 €</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">+20 128 € (100%)</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #dee2e6;">Surperformance</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">10%</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">80 526 €</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">+28 441 € (93,2%)</td>
          </tr>
        </table>

        <p>Dans le scénario de surperformance, l'investisseur capte 93,2% du gain total, les 6,8% restants (2 085 €) constituant le carried interest versé aux gérants.</p>

        <h3>Transparence et gouvernance</h3>
        <p>La mise en œuvre du carried interest nécessite :</p>

        <ul>
          <li><strong>Définition contractuelle claire</strong> dans les statuts et le pacte d'associés</li>
          <li><strong>Commissariat aux apports</strong> pour valider les calculs</li>
          <li><strong>Reporting régulier</strong> sur la performance et le chemin vers le hurdle rate</li>
          <li><strong>Validation en AG</strong> lors de la distribution effective du carry</li>
        </ul>

        <p><strong>Conclusion :</strong> Le carried interest est un outil puissant d'alignement des intérêts entre gérants et investisseurs. Lorsqu'il est structuré de manière équilibrée et transparente, il constitue un vecteur de performance et de confiance mutuelle au sein d'une foncière.</p>
      `
    },
    {
      id: 4,
      title: "Réglementation 2026 : DPE, interdiction de location et impact sur les stratégies d'investissement",
      slug: "reglementation-dpe-2026",
      category: "reglementation",
      date: "10 décembre 2025",
      readTime: "6 min",
      excerpt: "État des lieux des obligations réglementaires en matière de performance énergétique : calendrier d'interdiction de location, enjeux pour les propriétaires bailleurs et opportunités pour les investisseurs.",
      image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=800&q=80",
      content: `
        <h2>Calendrier réglementaire : le durcissement progressif</h2>
        <p>La loi Climat et Résilience de 2021 a instauré un calendrier progressif d'interdiction de location pour les logements énergivores. Cette contrainte réglementaire bouleverse le marché locatif et crée des opportunités pour les investisseurs structurés.</p>

        <h3>Les dates clés</h3>

        <h4>2023 : DPE G (>450 kWh/m²/an)</h4>
        <p>Depuis le 1er janvier 2023, les logements classés G+ (consommation >450 kWh/m²/an) ne peuvent plus être loués. Environ 90 000 logements concernés en France.</p>

        <h4>2025 : Ensemble du DPE G</h4>
        <p>À partir du 1er janvier 2025, tous les logements classés G sont interdits à la location. <strong>Environ 600 000 logements concernés.</strong></p>

        <h4>2028 : DPE F</h4>
        <p>Interdiction de louer les logements classés F à partir du 1er janvier 2028. <strong>Environ 1,2 million de logements concernés.</strong></p>

        <h4>2034 : DPE E</h4>
        <p>Extension de l'interdiction aux logements E. <strong>Environ 2,6 millions de logements concernés.</strong></p>

        <h3>Impact sur le marché : tensions et opportunités</h3>

        <h4>Côté propriétaires bailleurs</h4>
        <p>Face à ces échéances, les propriétaires de passoires thermiques doivent choisir :</p>

        <ol>
          <li><strong>Rénover</strong> : investissement moyen de 40 000 € à 80 000 € par logement pour passer de F/G à C</li>
          <li><strong>Vendre</strong> : accepter une décote significative (15% à 30% selon les cas)</li>
          <li><strong>Laisser vacant</strong> : perte de revenus locatifs et charges de copropriété maintenues</li>
        </ol>

        <p>Cette situation crée une <strong>pression vendeuse</strong> sur le segment des passoires thermiques, particulièrement visible depuis 2024.</p>

        <h4>Côté investisseurs</h4>
        <p>Les investisseurs structurés disposent d'une fenêtre d'opportunité :</p>

        <ul>
          <li><strong>Acquisition décotée</strong> : prix 20-30% inférieurs aux actifs performants</li>
          <li><strong>Réhabilitation maîtrisée</strong> : budgets travaux optimisés via économies d'échelle</li>
          <li><strong>Revalorisation patrimoniale</strong> : rattrapage de valeur après travaux</li>
          <li><strong>Sécurisation locative</strong> : conformité réglementaire pérenne</li>
        </ul>

        <h3>Les aides à la rénovation : panorama 2026</h3>

        <h4>MaPrimeRénov' (particuliers)</h4>
        <ul>
          <li>Réservée aux résidences principales</li>
          <li>Plafonds de ressources applicables</li>
          <li>Montants variables selon les travaux (5 000 € à 25 000 €)</li>
        </ul>

        <h4>Éco-PTZ (Prêt à Taux Zéro)</h4>
        <ul>
          <li>Jusqu'à 50 000 € pour les rénovations globales</li>
          <li>Accessible sans conditions de ressources</li>
          <li>Remboursement sur 15 à 20 ans</li>
        </ul>

        <h4>CEE (Certificats d'Économies d'Énergie)</h4>
        <ul>
          <li>Primes versées par les fournisseurs d'énergie</li>
          <li>Montants variables selon les travaux et la zone géographique</li>
          <li>Cumulables avec d'autres aides</li>
        </ul>

        <p><strong>⚠️ Limite pour les bailleurs :</strong> Les propriétaires bailleurs (personnes morales comme les SCI) ont un accès restreint aux aides publiques. D'où l'intérêt de stratégies d'investissement structurées capables d'absorber les coûts de rénovation.</p>

        <h3>Notre stratégie face à la réglementation</h3>
        <p>À La Foncière Patrimoniale, nous transformons cette contrainte réglementaire en avantage concurrentiel :</p>

        <h4>1. Ciblage F/G en zones tendues</h4>
        <p>Nous acquérons des immeubles F/G dans des villes à forte demande locative (Bordeaux, Lyon, Toulouse, Nantes). La décote à l'achat (20-30%) finance une partie significative des travaux.</p>

        <h4>2. Passage systématique en DPE C minimum</h4>
        <p>Nos réhabilitations visent un DPE C (objectif B/A selon faisabilité), garantissant :</p>
        <ul>
          <li>Conformité réglementaire à 2034 et au-delà</li>
          <li>Valorisation locative (+10% à +20% selon les cas)</li>
          <li>Valorisation patrimoniale (+25% à +40%)</li>
          <li>Confort des occupants (VMC, isolation, chauffage performant)</li>
        </ul>

        <h4>3. Budget travaux maîtrisé</h4>
        <p>Nos opérations s'appuient sur :</p>
        <ul>
          <li>Audit énergétique préalable systématique</li>
          <li>Chiffrages concurrentiels (3 entreprises minimum)</li>
          <li>Suivi de chantier rigoureux (réunions hebdomadaires)</li>
          <li>Budget travaux moyen : 50 000 € à 70 000 € par logement pour un passage F/G → C</li>
        </ul>

        <h3>Cas d'étude : Bordeaux Centre</h3>
        <p><strong>Opération réalisée en 2024 :</strong></p>

        <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #f8f9fa;">
            <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Paramètre</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Avant travaux</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Après travaux</th>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #dee2e6;">Prix acquisition</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">1 100 000 €</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">-</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #dee2e6;">Travaux</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">-</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">350 000 €</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #dee2e6;">DPE moyen</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">F</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">C</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #dee2e6;">Loyer moyen/lot</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">650 €/mois</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">780 €/mois (+20%)</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #dee2e6;">Valorisation</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">1 100 000 €</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">1 650 000 € (+50%)</td>
          </tr>
        </table>

        <p><strong>Résultat :</strong></p>
        <ul>
          <li>Coût total : 1 450 000 €</li>
          <li>Valorisation : 1 650 000 €</li>
          <li><strong>Plus-value latente : +200 000 € (+13,8%)</strong></li>
          <li>Rendement locatif brut post-travaux : 6,5%</li>
        </ul>

        <h3>Perspectives et conclusion</h3>
        <p>La réglementation DPE structure durablement le marché immobilier français :</p>

        <ul>
          <li><strong>Raréfaction de l'offre locative performante</strong> : maintien des tensions et des loyers</li>
          <li><strong>Obsolescence accélérée des passoires thermiques</strong> : opportunités d'acquisition décotées</li>
          <li><strong>Prime à la rénovation énergétique</strong> : valorisation patrimoniale significative</li>
        </ul>

        <p>Les acteurs capables de transformer des actifs non-conformes en logements performants bénéficient d'un avantage structurel durable. La Foncière Patrimoniale s'inscrit pleinement dans cette dynamique, en capitalisant sur l'expertise technique et la capacité de financement pour créer de la valeur patrimoniale pérenne.</p>
      `
    }
  ];

  const filteredArticles = selectedCategory === 'tous' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-[#1A3A52] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 border border-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 border border-white/20 rounded-full transform translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                Blog & Actualités
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Insights Immobilier & Finance
            </h1>
            <p className="text-xl text-white/80">
              Analyses de marché, stratégies d'investissement et décryptages réglementaires 
              pour comprendre l'immobilier résidentiel structuré.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-slate-200 sticky top-20 bg-white z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#1A3A52] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {filteredArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link to={createPageUrl(`BlogArticle?id=${article.id}`)}>
                  <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#C9A961] text-[#1A3A52] rounded-full text-xs font-semibold">
                        {categories.find(c => c.id === article.category)?.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {article.date}
                    </div>
                    <span>•</span>
                    <span>{article.readTime} de lecture</span>
                  </div>

                  <h2 className="text-2xl font-serif text-[#1A3A52] mb-3 group-hover:text-[#C9A961] transition-colors">
                    {article.title}
                  </h2>

                  <p className="text-slate-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-[#C9A961] font-semibold group-hover:gap-3 transition-all">
                    Lire l'article
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-500">Aucun article dans cette catégorie pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1A3A52]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-white mb-4">
            Envie d'en savoir plus sur notre stratégie ?
          </h2>
          <p className="text-white/70 mb-8">
            Découvrez comment La Foncière Patrimoniale met en œuvre ces principes 
            pour créer de la valeur patrimoniale durable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={createPageUrl("Contact")}>
              <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] px-8 py-6 font-semibold">
                Entrer en relation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to={createPageUrl("StrategyPerformance")}>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 font-semibold">
                Notre stratégie
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}