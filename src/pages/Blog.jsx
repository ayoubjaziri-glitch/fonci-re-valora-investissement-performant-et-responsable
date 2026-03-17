import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import {
  Calendar, User, ArrowRight, Search, TrendingUp,
  Building2, Euro, Target, Briefcase, Award, FileText,
  ChevronRight, Clock, Tag } from
'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tous');

  const articles = [
  {
    id: 1,
    title: "Marché Immobilier 2026 : Opportunités et Perspectives pour les Investisseurs",
    slug: "marche-immobilier-2026-opportunites",
    excerpt: "Analyse approfondie du marché immobilier français en 2026, tendances des prix, zones à fort potentiel et stratégies d'investissement.",
    category: "Marché",
    author: "Ayoub Jaziri",
    date: "20 Février 2026",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    content: `
# Marché Immobilier 2026 : Opportunités et Perspectives pour les Investisseurs

Le marché immobilier français connaît en 2026 une transformation profonde, portée par la baisse progressive des taux d'intérêt et le retour de la confiance des ménages. Pour les investisseurs avisés, c'est le moment idéal pour se positionner sur des actifs à fort potentiel de valorisation.

## Les grandes tendances du marché 2026

### 1. La reprise progressive de la demande
Après deux années de baisse, le volume de transactions immobilières connaît un rebond significatif au premier trimestre 2026. Les ménages, rassurés par la stabilisation des taux et encouragés par des conditions de financement plus favorables, reprennent leurs projets d'acquisition.

**Chiffres clés :**
- +15% de transactions par rapport à 2025
- Taux moyen des crédits immobiliers : 3,2% (contre 4,1% en 2025)
- Délai moyen de vente : 82 jours (contre 95 jours en 2025)

### 2. Les villes moyennes en forte croissance
Les métropoles régionales et villes moyennes continuent d'attirer les investisseurs grâce à des rendements locatifs attractifs (5-7%) et des prix encore accessibles. Vichy, Clermont-Ferrand, Bordeaux et Lyon restent des valeurs sûres.

### 3. L'impératif de la rénovation énergétique
La réglementation se durcit : dès 2025, les logements classés G sont interdits à la location, suivis des F en 2028. Cette contrainte crée une opportunité majeure pour les foncières spécialisées dans la réhabilitation BBC (Bâtiment Basse Consommation).

## Stratégies gagnantes pour 2026

### Investir dans la valeur ajoutée
Le modèle "value-add" consiste à acquérir des actifs décotés nécessitant une rénovation, pour les valoriser après travaux. **La Foncière Valora** applique cette stratégie avec succès :
- Achat d'immeubles anciens en centre-ville
- Réhabilitation complète avec passage DPE F/G → B/C
- Mise en location à des rendements optimisés (6-8%)
- Valorisation patrimoniale de 20-35%

### Miser sur les zones tendues
Les marchés en tension locative (Lyon, Bordeaux, Toulouse, Montpellier) offrent une combinaison idéale :
- Forte demande locative
- Faible vacance (< 5%)
- Croissance démographique soutenue
- Perspectives de plus-values

### Privilégier la diversification
Un portefeuille immobilier équilibré combine :
- Différentes zones géographiques
- Mix de typologies (T1 à T3)
- Variété de locataires (étudiants, jeunes actifs, familles)

## Perspectives 2026-2028

Les experts anticipent une **hausse modérée des prix** (2-4% par an) dans les villes moyennes, portée par :
- La reprise de la demande
- La raréfaction des biens de qualité énergétique
- L'inflation des coûts de construction
- La tension démographique dans certaines zones

Pour les investisseurs, le message est clair : **2026 est une année charnière**. Les conditions de marché actuelles offrent un point d'entrée favorable avant la remontée attendue des prix.

---

*Vous souhaitez investir dans l'immobilier résidentiel avec une approche professionnelle et structurée ? Découvrez notre stratégie d'investissement.*
      `
  },
  {
    id: 2,
    title: "Foncière Immobilière : Comprendre ce Véhicule d'Investissement Structuré",
    slug: "fonciere-immobiliere-vehicule-investissement",
    excerpt: "Guide complet sur les foncières immobilières, leur fonctionnement, leurs avantages fiscaux et comment elles créent de la valeur pour leurs associés.",
    category: "Investissement",
    author: "La Foncière Valora",
    date: "15 Février 2026",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    content: `
# Foncière Immobilière : Comprendre ce Véhicule d'Investissement Structuré

Une foncière immobilière est une société dédiée à l'acquisition, la gestion et la valorisation d'actifs immobiliers. Contrairement à l'investissement en direct, elle offre une approche professionnelle, mutualisée et optimisée fiscalement.

## Qu'est-ce qu'une foncière ?

### Définition et principe
Une foncière est une **société de placement immobilier** qui collecte des capitaux auprès d'investisseurs pour constituer et gérer un patrimoine immobilier. Les associés détiennent des parts sociales et perçoivent une rémunération proportionnelle à leur participation.

### Les différents types de foncières

**1. SCPI (Société Civile de Placement Immobilier)**
- Accessible dès quelques centaines d'euros
- Gestion entièrement déléguée
- Revenus trimestriels
- Liquidité moyenne

**2. SCI (Société Civile Immobilière)**
- Structure privée entre associés
- Gestion active possible
- Optimisation fiscale
- Transmission facilitée

**3. OPCI (Organisme de Placement Collectif Immobilier)**
- Mix immobilier + valeurs mobilières
- Régulation stricte (AMF)
- Liquidité quotidienne

**4. Foncières patrimoniales (comme la nôtre)**
- Stratégie value-add
- Réhabilitation BBC
- Rendements cibles : 8-12%
- Création de valeur active

## Les avantages d'une foncière

### 1. Mutualisation des risques
En investissant dans une foncière, vous accédez à un **portefeuille diversifié** d'actifs immobiliers répartis sur plusieurs villes, typologies et profils de locataires. Cette diversification limite l'impact d'une vacance locative ou d'un impayé.

### 2. Professionnalisation de la gestion
La foncière dispose d'une **expertise complète** :
- Sourcing d'opportunités
- Due diligence technique et juridique
- Négociation des acquisitions
- Pilotage des travaux
- Gestion locative
- Optimisation fiscale

### 3. Effet de levier maîtrisé
Grâce à sa capacité d'emprunt, une foncière peut acquérir un patrimoine de **3 à 4 fois supérieur** aux capitaux apportés par les associés. Cet effet de levier amplifie la rentabilité tout en maîtrisant le ratio LTC (Loan To Cost).

**Exemple concret :**
- Capital associés : 1 M€
- Emprunt bancaire : 2,5 M€
- Patrimoine total : 3,5 M€
- Ratio LTC : 71%

### 4. Optimisation fiscale
Selon la structure juridique choisie, les foncières bénéficient de régimes fiscaux avantageux :
- **Transparence fiscale** (SCI) : imposition au niveau de chaque associé
- **IS réduit** pour certaines structures
- **Déductibilité** des charges et intérêts d'emprunt
- **Amortissement** des biens

### 5. Alignement des intérêts
Dans une foncière patrimoniale bien structurée, les gérants sont eux-mêmes associés significatifs. Ce **skin in the game** garantit l'alignement total des intérêts entre dirigeants et investisseurs.

## Notre modèle : La Foncière Valora

### Une stratégie différenciante
Nous nous distinguons par notre approche **value-add** :
1. **Acquisition** d'immeubles anciens décotés en centre-ville
2. **Réhabilitation BBC** complète avec amélioration énergétique
3. **Mise en location** optimisée
4. **Valorisation** patrimoniale de 20-35% en 3-5 ans

### Performance cible
- **TRI net associés** : 10-12% par an
- **Rendement locatif** : 6-8%
- **Plus-value de cession** : 20-30% à moyen terme

### Transparence et gouvernance
Nous mettons un point d'honneur à :
- Reporting trimestriel détaillé
- Accès à un espace associé numérique
- Comité opérationnel régulier
- Assemblées générales participatives

## Comment investir dans une foncière ?

### 1. Définir son profil
- Horizon d'investissement : 5-10 ans minimum
- Capacité d'investissement
- Appétence au risque
- Objectifs (revenus vs. capitalisation)

### 2. Analyser la stratégie
- Type d'actifs ciblés
- Zone géographique
- Niveau de risque
- Track record de l'équipe

### 3. Étudier les documents juridiques
- Statuts de la société
- Pacte d'associés
- Règlement de gestion
- Conditions de sortie

### 4. Réaliser son investissement
- Signature du bulletin de souscription
- Versement des fonds
- Intégration au capital
- Accès aux services associés

## Conclusion

Les foncières immobilières offrent une alternative performante à l'investissement locatif en direct. Elles combinent professionnalisme, mutualisation, optimisation fiscale et potentiel de rendement attractif.

**La Foncière Valora** s'adresse aux investisseurs avisés recherchant un placement immobilier structuré, transparent et à fort potentiel de création de valeur.

---

*Intéressé par notre approche ? Contactez-nous pour échanger sur votre projet d'investissement.*
      `
  },
  {
    id: 3,
    title: "Carried Interest et Alignement des Intérêts : La Clé d'une Foncière Performante",
    slug: "carried-interest-alignement-interets",
    excerpt: "Découvrez comment le mécanisme du carried interest aligne parfaitement les intérêts des gérants et des investisseurs dans une foncière immobilière.",
    category: "Gouvernance",
    author: "Ayoub Jaziri",
    date: "10 Février 2026",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    content: `
# Carried Interest et Alignement des Intérêts : La Clé d'une Foncière Performante

Dans le monde de l'investissement immobilier structuré, le **carried interest** (ou "intéressement à la performance") est un mécanisme fondamental qui garantit l'alignement parfait entre les intérêts des gérants et ceux des investisseurs.

## Qu'est-ce que le Carried Interest ?

### Définition
Le carried interest est une **rémunération variable** versée aux gérants d'un fonds ou d'une foncière, uniquement si certains objectifs de performance sont atteints. Il s'agit d'un partage des profits au-delà d'un seuil de rentabilité minimal garanti aux investisseurs.

### Principe de fonctionnement

**Exemple concret :**
1. **Hurdle rate (taux de rendement minimal)** : 8% par an
2. Les investisseurs reçoivent d'abord 8% de rendement annuel
3. Au-delà de ce seuil, les profits sont partagés selon une clé de répartition :
   - 80% aux investisseurs
   - 20% aux gérants (carried interest)

**Cas pratique :**
- Capital investi : 1 M€
- Performance réalisée : 12% par an
- Les 8 premiers % (80 000 €) vont à 100% aux investisseurs
- Les 4% supplémentaires (40 000 €) sont partagés :
  - 32 000 € aux investisseurs (80%)
  - 8 000 € aux gérants (20% de carried)

## Pourquoi le Carried Interest est-il crucial ?

### 1. Alignement total des intérêts
Les gérants ne perçoivent un carried substantiel **que si les investisseurs ont d'abord obtenu leur rendement cible**. Cette structure crée un alignement parfait :
- Aucune incitation à prendre des risques excessifs
- Focus sur la création de valeur durable
- Transparence sur les objectifs de performance

### 2. Motivation à l'excellence
Le carried interest incite les gérants à :
- Sourcer les meilleures opportunités
- Négocier fermement les acquisitions
- Optimiser la gestion opérationnelle
- Maximiser la valorisation à la sortie

### 3. Limitation des frais fixes
Contrairement aux structures à frais de gestion élevés (2-3% des actifs), le modèle à carried interest privilégie la **rémunération à la performance**. Les gérants gagnent plus si et seulement si les investisseurs gagnent plus.

## Les différents modèles de Carried Interest

### Modèle "European Waterfall" (le plus courant)
1. Retour du capital initial aux investisseurs
2. Paiement du hurdle rate (ex: 8% cumulé)
3. Partage des profits au-delà (80/20)

### Modèle "American Waterfall"
- Calcul du carried deal par deal (et non au niveau du fonds)
- Plus favorable aux gérants
- Moins protecteur pour les investisseurs

### Modèle "Catch-up"
1. Retour capital + hurdle rate (100% investisseurs)
2. Phase de "rattrapage" (100% gérants) jusqu'à rééquilibrage
3. Puis partage standard (80/20)

## Notre approche à La Foncière Valora

### Structure transparente
Nous appliquons un modèle de carried interest **aligné avec les meilleurs standards** du marché :

**Nos principes :**
- **Hurdle rate** : 8% TRI net annuel
- **Catch-up** : non (protection investisseurs)
- **Partage** : 80% investisseurs / 20% gérants
- **Calcul** : au niveau du fonds (pas deal par deal)

### Skin in the Game
Au-delà du carried, les fondateurs sont **co-investisseurs significatifs** dans la foncière. Nous investissons notre propre capital aux mêmes conditions que les associés externes.

**Nos engagements :**
- Capital personnel investi : 15% du total
- Aucune priorité de remboursement
- Participation identique aux risques
- Gouvernance participative

## Transparence et reporting

### Calcul du Carried Interest
Le carried est calculé de manière **totalement transparente** :
1. Valorisation trimestrielle du patrimoine (expertises indépendantes)
2. Calcul du TRI global du fonds
3. Déclenchement du carried uniquement si hurdle atteint
4. Versement lors des cessions d'actifs ou distributions

### Reporting aux associés
Chaque trimestre, nos associés reçoivent :
- **Dashboard de performance** (TRI, rendement, valorisation)
- **Détail des acquisitions et cessions**
- **État du carried provisionné** (mais non encore versé)
- **Projection de performance** à 3-5 ans

## Les pièges à éviter

### 1. Absence de hurdle rate
Certaines structures versent du carried dès le premier euro de profit. **C'est un signal d'alerte** : les gérants gagnent même si les investisseurs perdent de l'argent après inflation.

### 2. Frais de gestion excessifs
Méfiez-vous des foncières qui cumulent :
- Frais de gestion élevés (2-3%)
- Frais de souscription (5-10%)
- Carried interest élevé (> 25%)

### 3. Manque de transparence
Si les modalités de calcul du carried ne sont pas clairement explicitées dans le pacte d'associés, **posez des questions**.

## Conclusion

Le carried interest est bien plus qu'un simple mécanisme de rémunération : c'est un **outil de gouvernance** qui garantit que les gérants travaillent dans l'intérêt exclusif des investisseurs.

Chez **La Foncière Valora**, nous sommes convaincus que la performance durable naît de cet alignement parfait. Notre rémunération dépend de votre succès.

**C'est ainsi que se construisent les partenariats de long terme.**

---

*Questions sur notre modèle de gouvernance ? Contactez-nous pour un échange personnalisé.*
      `
  },
  {
    id: 4,
    title: "Réhabilitation BBC : Transformer les Passoires Thermiques en Actifs Performants",
    slug: "rehabilitation-bbc-passoires-thermiques",
    excerpt: "Guide pratique de la réhabilitation Bâtiment Basse Consommation : techniques, coûts, rentabilité et impact ESG.",
    category: "Rénovation",
    author: "La Foncière Valora",
    date: "5 Février 2026",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    content: `
# Réhabilitation BBC : Transformer les Passoires Thermiques en Actifs Performants

La rénovation énergétique n'est plus une option : c'est une **obligation réglementaire** et une **opportunité d'investissement** majeure. Découvrez comment transformer des passoires thermiques (DPE F-G) en actifs performants (DPE B-C).

## Le contexte réglementaire

### Calendrier d'interdiction à la location
- **2025** : Logements DPE G interdits
- **2028** : Logements DPE F interdits  
- **2034** : Logements DPE E interdits

Cette réglementation crée une **décote massive** des biens énergivores (-15 à -30% vs. un bien rénové) et une opportunité pour les investisseurs capables de mener des réhabilitations complètes.

## Notre approche de réhabilitation BBC

### 1. Diagnostic complet
Avant toute acquisition, nous réalisons :
- **Audit énergétique** détaillé (thermographie, infiltrométrie)
- **Diagnostic structurel** (solidité, humidité, amiante)
- **Étude de faisabilité** technique et financière
- **Simulation DPE** post-travaux

### 2. Travaux d'isolation

**Isolation Thermique par l'Extérieur (ITE)**
- Suppression des ponts thermiques
- Ravalement simultané de la façade
- Amélioration esthétique
- Coût : 120-180 €/m²

**Isolation des combles**
- Laine minérale ou ouate de cellulose
- R ≥ 7 m².K/W
- Coût : 30-50 €/m²

**Remplacement des menuiseries**
- Double ou triple vitrage
- Uw ≤ 1,3 W/m².K
- Volets roulants isolants
- Coût : 400-800 €/fenêtre

### 3. Systèmes de chauffage performants

**Pompes à chaleur**
- COP > 4
- Réversible (chauffage/climatisation)
- Coût : 8 000-15 000 € (appartement)

**Chaudières gaz à condensation**
- Rendement > 95%
- Alternative économique
- Coût : 3 000-5 000 €

**Radiateurs basse température**
- Optimisation du rendement
- Coût : 200-400 €/radiateur

### 4. Ventilation et étanchéité

**VMC double flux**
- Récupération de chaleur
- Qualité d'air optimale
- Coût : 4 000-8 000 € (immeuble)

**Traitement des infiltrations**
- Test d'étanchéité à l'air
- Objectif : < 1,5 m³/h.m²

## Budget type de réhabilitation

### Exemple : Immeuble de 6 appartements (450 m²)

**Travaux d'isolation**
- ITE : 60 000 €
- Combles : 8 000 €
- Menuiseries : 18 000 €

**Chauffage/Ventilation**
- PAC + Radiateurs : 45 000 €
- VMC double flux : 6 000 €

**Électricité/Plomberie**
- Mise aux normes : 25 000 €

**Finitions**
- Peinture, sols : 18 000 €

**Total** : 180 000 €
**Coût au m²** : 400 €/m²

## Rentabilité de l'opération

### Cas concret : Vichy - Boulevard Kennedy

**Acquisition**
- Prix d'achat : 420 000 €
- DPE initial : F (passoire thermique)
- Loyers potentiels : 24 000 €/an (rendement 5,7%)

**Travaux**
- Budget rénovation : 180 000 €
- DPE final : C (performant)
- Durée : 8 mois

**Après rénovation**
- Coût total : 600 000 €
- Loyers : 36 000 €/an (rendement 6%)
- Valorisation : 720 000 €
- **Plus-value latente : +120 000 € (+20%)**

## Financement de la réhabilitation

### 1. Ratio LTC maîtrisé
- Apport foncière : 250 000 €
- Emprunt bancaire : 350 000 €
- **Ratio LTC** : 58% (confortable)

### 2. Aides et subventions
- **MaPrimeRénov' Copropriété** : jusqu'à 25%
- **CEE (Certificats d'Économie d'Énergie)** : 5-15%
- **Éco-PTZ** : jusqu'à 50 000 € à 0%

### 3. Optimisation fiscale
- **Amortissement accéléré** des travaux
- **Déduction fiscale** des intérêts d'emprunt
- **Crédit d'impôt** rénovation énergétique

## Impact ESG et valorisation

### Environnement
- **Réduction CO₂** : -60% d'émissions
- **Économie d'énergie** : -70% de consommation
- **Étiquette verte** : DPE B-C

### Social
- **Confort des locataires** amélioré
- **Factures énergétiques** divisées par 2-3
- **Valeur d'usage** accrue

### Gouvernance
- **Conformité réglementaire** anticipée
- **Valorisation patrimoniale** sécurisée
- **Attractivité locative** renforcée

## Nos réalisations

**Lyon 3ème - Garibaldi**
- DPE F → C
- 8 appartements rénovés
- Valorisation : +28%

**Bordeaux Centre**
- DPE G → C  
- 12 lots réhabilités
- Loyers : +35%

**Clermont-Ferrand**
- DPE F → B
- 16 logements transformés
- Plus-value : +32%

## Conclusion

La réhabilitation BBC est au cœur de notre stratégie d'investissement. Elle combine :
- **Opportunité d'achat** (décote des passoires)
- **Création de valeur** (travaux value-add)
- **Performance ESG** (impact environnemental positif)
- **Rentabilité** (rendements locatifs + plus-values)

C'est cette expertise qui fait de **La Foncière Valora** un acteur de référence de l'immobilier durable et performant.

---

*Découvrez nos réalisations et notre approche en détail.*
      `
  },
  {
    id: 5,
    title: "PEA-PME et Immobilier : Optimiser sa Fiscalité en Investissant dans une Foncière",
    slug: "pea-pme-immobilier-fiscalite",
    excerpt: "Comment investir dans l'immobilier via un PEA-PME et bénéficier d'une fiscalité ultra-avantageuse tout en diversifiant son patrimoine.",
    category: "Fiscalité",
    author: "La Foncière Valora",
    date: "1 Février 2026",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    content: `
# PEA-PME et Immobilier : Optimiser sa Fiscalité en Investissant dans une Foncière

Le PEA-PME (Plan d'Épargne en Actions destiné aux PME) est un outil fiscal méconnu qui permet d'investir dans des foncières patrimoniales tout en bénéficiant d'une **exonération totale d'impôt** après 5 ans de détention.

## Qu'est-ce que le PEA-PME ?

### Définition
Le PEA-PME est une **enveloppe fiscale** créée en 2014 pour orienter l'épargne des particuliers vers le financement des PME et ETI (Entreprises de Taille Intermédiaire) européennes.

### Plafond et conditions
- **Plafond de versement** : 225 000 €
- **Cumulable** avec un PEA classique (+ 150 000 €)
- **Enveloppe totale possible** : 375 000 €

### Fiscalité ultra-avantageuse
- **Avant 5 ans** : Plus-values taxées à 12,8% + 17,2% de PS (30% total)
- **Après 5 ans** : **Exonération totale d'impôt** (seulement 17,2% de PS)

**Exemple :**
- Investissement : 100 000 €
- Plus-value après 8 ans : 50 000 €
- Fiscalité hors PEA : 15 000 € (30%)
- Fiscalité en PEA : 8 600 € (17,2%)
- **Économie : 6 400 €**

## Pourquoi investir dans une foncière via PEA-PME ?

### 1. Double performance
- **Rendement immobilier** : loyers + valorisation (8-12% par an)
- **Optimisation fiscale** : exonération d'impôt après 5 ans
- **Performance nette** amplifiée

### 2. Diversification du patrimoine
Le PEA-PME permet d'accéder à l'immobilier professionnel sans :
- Gérer des biens en direct
- Supporter les contraintes locatives
- Immobiliser des liquidités importantes

### 3. Liquidité préservée
Contrairement à un investissement immobilier en direct :
- **Pas de frais de notaire** (6-8%)
- **Sortie possible** à tout moment (avec fiscalité avant 5 ans)
- **Transmission facilitée**

## Notre structure éligible PEA-PME

### Conditions d'éligibilité
**La Foncière Valora** respecte tous les critères :
- ✅ Forme juridique : SAS
- ✅ Effectif : < 250 salariés
- ✅ Chiffre d'affaires : < 50 M€
- ✅ Bilan : < 43 M€
- ✅ Siège social : Union Européenne

### Titre éligible
Nous émettons des **actions ordinaires** éligibles PEA-PME, permettant aux investisseurs de bénéficier pleinement de l'avantage fiscal.

## Cas pratique d'investissement

### Profil : Cadre supérieur, 45 ans

**Situation initiale**
- Épargne disponible : 150 000 €
- TMI (Tranche Marginale d'Imposition) : 41%
- Objectif : préparer retraite + optimiser fiscalité

**Stratégie recommandée**
1. **Ouverture PEA-PME** (plafond 225 000 €)
2. **Investissement** : 100 000 € dans La Foncière Valora
3. **Horizon** : 8-10 ans (jusqu'à la retraite)

**Projection de performance**
- TRI cible : 10% par an
- Capital après 10 ans : 259 000 €
- Plus-value : 159 000 €
- Fiscalité PEA : 27 350 € (17,2% PS uniquement)
- Fiscalité hors PEA : 47 700 € (30%)
- **Économie fiscale : 20 350 €**

## Comparaison : Immobilier direct vs. Foncière en PEA-PME

### Investissement locatif direct (100 000 €)
- **Frais de notaire** : 7 000 €
- **Travaux** : 15 000 €
- **Capital réellement investi** : 78 000 €
- **Rendement net** : 4-5%
- **Fiscalité** : IR + PS sur loyers (jusqu'à 60%)
- **Liquidité** : faible (délai de vente 3-6 mois)

### Foncière en PEA-PME (100 000 €)
- **Frais d'entrée** : 0 €
- **Capital investi** : 100 000 €
- **Rendement cible** : 8-12%
- **Fiscalité** : 0% après 5 ans (hors PS 17,2%)
- **Liquidité** : potentielle à tout moment

**Verdict** : Sur 10 ans, la foncière en PEA-PME surperforme de **40-60%** l'investissement direct.

## Transmission et succession

### Avantage successoral
- Les titres détenus en PEA-PME bénéficient de l'**abattement classique** en cas de succession (100 000 € par parent et par enfant)
- La valeur transmise est la **valeur de marché** au jour du décès
- Fiscalité successorale : 20% au-delà de l'abattement

### Donation anticipée
Il est possible de **donner son PEA-PME** à ses enfants :
- Donation en pleine propriété ou démembrement
- Abattement : 100 000 € par parent/enfant tous les 15 ans
- Optimisation de la transmission patrimoniale

## Points de vigilance

### 1. Horizon d'investissement
Le PEA-PME est adapté pour un horizon **minimum 5 ans**. Tout retrait avant entraîne :
- Clôture du plan
- Fiscalité à 30%

### 2. Risque en capital
Comme tout investissement immobilier, le capital n'est pas garanti. Il est essentiel de :
- Diversifier (ne pas mettre 100% en PEA-PME)
- Choisir une foncière solide avec track record
- Vérifier la stratégie et la gouvernance

### 3. Liquidité relative
Bien que théoriquement liquide, la revente de parts de foncière non cotée peut prendre **quelques semaines à quelques mois**.

## Conclusion

Le PEA-PME est un **outil fiscal puissant** qui permet d'investir dans l'immobilier via une foncière tout en optimisant drastiquement sa fiscalité.

**La Foncière Valora**, éligible PEA-PME, offre une opportunité unique de combiner :
- Performance immobilière (8-12% TRI)
- Optimisation fiscale (0% après 5 ans)
- Professionnalisme de gestion
- Transparence et gouvernance

Pour les investisseurs avisés, c'est une stratégie patrimoniale de premier ordre.

---

*Souhaitez-vous en savoir plus sur notre éligibilité PEA-PME ? Contactez-nous.*
      `
  },
  {
    id: 6,
    title: "Réforme Fiscale 2026 : Comment protéger votre holding patrimoniale de la taxe de 20 % ?",
    slug: "reforme-fiscale-2026-taxe-holding-20-pourcent",
    excerpt: "L'article 3 de la Loi de Finances 2026 instaure une taxe de 20 % sur les actifs non opérationnels des holdings patrimoniales. Analyse des critères, mécanismes et stratégies pour protéger votre structure.",
    category: "Fiscalité",
    author: "La Foncière Valora",
    date: "17 Mars 2026",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    content: `
# Réforme Fiscale 2026 : Comment protéger votre holding patrimoniale de la taxe de 20 % ?

L'année 2026 marque un tournant historique pour les structures de détention patrimoniale. L'article 3 de la Loi de Finances pour 2026 (créant l'article 235 ter C du CGI) a instauré une **taxe de 20 %** ciblant les actifs non opérationnels des holdings, souvent qualifiées de « cash boxes ». Si votre société accumule des capitaux ou des biens sans activité économique réelle, il est urgent de réévaluer la nature de vos actifs pour éviter une imposition que beaucoup d'experts qualifient de « confiscatoire ».

## Les 3 critères d'assujettissement : Êtes-vous dans le viseur ?

Toutes les sociétés ne sont pas concernées par cette mesure. Le législateur a défini trois critères cumulatifs qui font basculer une holding dans le champ de la taxe :

**1. Le seuil de patrimoine :** La valeur vénale brute des actifs doit atteindre au moins **5 millions €**. Ce seuil exclut les petites structures familiales pour se concentrer sur les patrimoines financiers et immobiliers significatifs.

**2. La prépondérance passive :** Plus de **50 % des revenus totaux** (produits d'exploitation et financiers) doivent provenir de « revenus passifs » : dividendes, intérêts de placements, redevances ou loyers.

**3. Le contrôle par des personnes physiques :** La taxe vise les structures détenues majoritairement (au moins 50 % des droits de vote ou financiers) par une personne physique ou son cercle familial. Les groupes institutionnels ou cotés en sont donc exclus.

## Focus Immobilier : La ligne de partage entre « Outil de travail » et « Actif de jouissance »

Le cœur de la réforme repose sur la qualification de vos actifs immobiliers. Pour une foncière, la distinction est vitale car elle détermine l'application du taux de 20 %.

### Les actifs immobiliers imposables (non professionnels)

Sont spécifiquement visés les biens dont la société se réserve la jouissance, sans utilité économique directe :

- **Occupation à titre gratuit :** Logements occupés par les associés ou leur famille sans loyer.
- **Loyers sous-évalués :** Biens loués à des conditions inférieures au marché (loyer de complaisance).
- **Résidences secondaires et de villégiature :** Tout bien non exploité commercialement ou affecté à des loisirs (chasse, pêche).

### Les actifs immobiliers exonérés (professionnels)

Échappent à la taxe les biens qui participent réellement à l'activité de la foncière :

- **Immobilier locatif de marché :** Les biens mis en location à des tiers dans des conditions normales de marché (loyer de pleine concurrence).
- **Immobilier d'exploitation :** Biens affectés directement à l'activité industrielle, commerciale ou libérale de la société ou de ses filiales (bureaux occupés par le personnel, entrepôts opérationnels).

## Mécanisme de calcul et calendrier : Ce qu'il faut savoir

La taxe est assise sur la **valeur vénale des actifs taxables** au jour de la clôture de l'exercice.

- **Le taux :** Fixé à 20 %, il représente une charge massive. Pour un actif imposable de 8 millions €, la taxe annuelle s'élève à **1 600 000 €**.
- **La non-déductibilité :** Cette charge n'est pas déductible du bénéfice imposable à l'IS, ce qui alourdit encore le coût fiscal global.
- **Non-cumul avec l'IFI :** Pour éviter une double imposition, les actifs soumis à cette taxe de 20 % sont exonérés d'Impôt sur la Fortune Immobilière (IFI). Cependant, le taux de 20 % est bien supérieur au plafond de 1,5 % de l'IFI.
- **Échéance :** Elle s'applique aux exercices clos à compter du **31 décembre 2026**. La première déclaration et le paiement interviendront au printemps 2027.

## Plan d'action : 3 stratégies pour sécuriser votre holding avant fin 2026

Face à cette "taxe holding", l'inertie est votre pire ennemie. Voici les leviers d'optimisation préconisés par les experts :

**1. Arbitrage et Réallocation :** Réorienter la trésorerie ou les actifs vers des investissements productifs ou des filiales opérationnelles pour repasser sous le seuil de 50 % de revenus passifs.

**2. Normalisation des Baux :** Si vous détenez des biens occupés par des proches, réajustez les loyers aux prix du marché via des baux réels pour sortir ces actifs de l'assiette taxable.

**3. Distribution de Dividendes :** Réduire la taille du bilan en distribuant une partie de la trésorerie accumulée pour redescendre en dessous du seuil de 5 millions € d'actifs.

## Conclusion

La réforme 2026 ne signifie pas la fin de la holding patrimoniale, mais elle impose une gestion plus **"dynamique"** et moins passive de vos actifs. Un diagnostic patrimonial complet avant le **31 décembre 2026** est indispensable pour identifier vos zones de risque.

*Vous souhaitez analyser l'exposition de votre structure à cette nouvelle taxe ? Contactez notre équipe pour un diagnostic personnalisé.*
    `
  },
  {
    id: 7,
    title: "Dispositif Jeanbrun 2026 : Le guide complet du nouvel investissement locatif amortissable",
    slug: "dispositif-jeanbrun-2026-guide-complet-investissement-locatif",
    excerpt: "Après le Pinel, découvrez le nouveau dispositif Jeanbrun : un mécanisme d'amortissement comptable révolutionnaire pour l'investissement locatif en 2026. Guide complet des conditions, taux et stratégies.",
    category: "Fiscalité",
    author: "La Foncière Valora",
    date: "17 Mars 2026",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    content: `
# Dispositif Jeanbrun 2026 : Le guide complet du nouvel investissement locatif amortissable

Après l'extinction définitive du dispositif Pinel fin 2024, le marché immobilier locatif français a connu une phase d'attentisme. La réponse du gouvernement est arrivée avec le plan « Relance Logement », instaurant par l'article 47 de la loi de finances pour 2026 le **dispositif Jeanbrun**. Contrairement à ses prédécesseurs fondés sur des réductions d'impôt forfaitaires, ce nouveau statut du bailleur privé repose sur un mécanisme d'**amortissement comptable**, offrant une stratégie patrimoniale de long terme bien plus proche de la réalité économique des actifs.

## Le mécanisme de l'amortissement : Comment ça marche ?

La grande révolution de la "Loi Jeanbrun" est l'introduction de l'amortissement pour la **location nue**, un avantage jusqu'ici réservé au statut LMNP (Loueur en Meublé Non Professionnel). L'État reconnaît désormais que le bâti subit une usure théorique et vous autorise à déduire cette "perte de valeur" de vos revenus fonciers.

**L'assiette amortissable :** La loi fixe forfaitairement la valeur du bâti amortissable à **80 %** du prix d'acquisition (les 20 % restants représentant le terrain, actif non amortissable).

**Les taux annuels :** Ils dépendent de votre engagement social (plus le loyer est bas, plus le taux est élevé) :

- **Loyer intermédiaire :** 3,5 % par an (plafonné à 8 000 €)
- **Loyer social :** 4,5 % par an (plafonné à 10 000 €)
- **Loyer très social :** 5,5 % par an (plafonné à 12 000 €)

> Note : Les taux sont légèrement minorés pour l'immobilier ancien rénové (respectivement 3 %, 3,5 % et 4 %).

## Le levier du "Super-Déficit" foncier

Le dispositif Jeanbrun permet de cumuler deux avantages fiscaux puissants. En plus de l'amortissement, vous déduisez l'intégralité des charges réelles : intérêts d'emprunt, taxe foncière, frais de gestion et primes d'assurance.

Si la somme de l'amortissement et des charges dépasse vos revenus locatifs, vous créez un **déficit foncier**. Ce déficit est alors imputable sur votre revenu global (salaires, pensions) dans la limite de **10 700 € par an**. Ce plafond est même doublé à **21 400 €** jusqu'en 2027 pour les travaux de rénovation énergétique dans l'ancien.

## Les conditions d'éligibilité en 2026

Pour sécuriser votre avantage fiscal sur les **9 années d'engagement obligatoire**, vous devez respecter des critères stricts :

**Nature du bien :** Le dispositif cible exclusivement les immeubles collectifs. Les maisons individuelles sont explicitement exclues pour favoriser la densification urbaine.

**Performance énergétique :** Le neuf doit respecter la norme RE2020. Pour l'ancien, les travaux doivent représenter au moins **30 % du prix d'acquisition** et permettre au bien d'atteindre la **classe A ou B** au DPE.

**Plafonds de loyers :** Le calcul du loyer maximum suit une formule précise intégrant un coefficient multiplicateur basé sur la surface pondérée du logement (plafonné à 1,2 pour les surfaces inférieures à 38 m²).

**Zonage universel :** Contrairement au Pinel, l'éligibilité au Jeanbrun est **nationale**. Vous pouvez investir partout en France, bien que les plafonds de loyers restent indexés sur les zones (A bis, A, B1, B2).

## Stratégie de revente et plus-value

Il est crucial d'anticiper la sortie de l'investissement. À la revente, les amortissements pratiqués pendant la détention sont **réintégrés** pour le calcul de la plus-value immobilière. Cela signifie que votre prix d'acquisition "comptable" diminue, augmentant mécaniquement l'assiette taxable à la sortie.

Le dispositif Jeanbrun est donc une stratégie de **capitalisation et de revenus complémentaires à long terme**, plutôt qu'un outil d'achat-revente rapide.

## Conclusion

Plus votre Tranche Marginale d'Imposition (TMI) est élevée, plus l'effet de levier du dispositif Jeanbrun est spectaculaire. En effaçant l'imposition sur vos loyers et en réduisant votre impôt global, il s'impose comme **l'outil majeur de la structuration patrimoniale en 2026**.

*Vous souhaitez évaluer l'impact du dispositif Jeanbrun sur votre situation fiscale ? Notre équipe vous accompagne dans votre stratégie patrimoniale.*
    `
  }];


  const categories = [
  { id: 'tous', label: 'Tous les articles' },
  { id: 'Marché', label: 'Marché' },
  { id: 'Investissement', label: 'Investissement' },
  { id: 'Gouvernance', label: 'Gouvernance' },
  { id: 'Rénovation', label: 'Rénovation' },
  { id: 'Fiscalité', label: 'Fiscalité' }];


  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === 'tous' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-[#1A3A52]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                Blog & Insights
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Expertise & Actualités de l'Immobilier
            </h1>
            <p className="text-xl text-white/70">
              Analyses de marché, guides d'investissement et stratégies patrimoniales par nos experts.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((cat) =>
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat.id ?
              'bg-[#C9A961] text-[#1A3A52]' :
              'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
              }>

                {cat.label}
              </button>
            )}
          </div>
        </motion.div>

        {/* Featured Article */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16">
          <Link to={createPageUrl(`BlogArticle?slug=${featuredArticle.slug}`)}>
            <div className="bg-slate-50 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-80 md:h-auto overflow-hidden">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-[#C9A961] text-[#1A3A52] px-4 py-2 rounded-full text-sm font-semibold">
                      Article Phare
                    </span>
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="text-[#C9A961] font-semibold text-sm mb-3">{featuredArticle.category}</span>
                  <h2 className="text-3xl font-serif text-[#1A3A52] mb-4 group-hover:text-[#C9A961] transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{featuredArticle.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{featuredArticle.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{featuredArticle.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#C9A961] font-semibold group-hover:gap-3 transition-all">
                    Lire l'article
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.slice(1).map((article, index) =>
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}>

              <Link to={createPageUrl(`BlogArticle?slug=${article.slug}`)}>
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-[#1A3A52] px-3 py-1 rounded-full text-xs font-semibold">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-serif text-[#1A3A52] mb-3 group-hover:text-[#C9A961] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed flex-1">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{article.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>

        {filteredArticles.length === 0 &&
        <div className="text-center py-16">
            <p className="text-slate-500 text-lg">Aucun article ne correspond à votre recherche.</p>
          </div>
        }

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-[#1A3A52] to-[#2A4A6F] rounded-3xl p-12 text-center">

          <h2 className="text-3xl font-serif text-white mb-4">
            Vous souhaitez en savoir plus ?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Découvrez notre stratégie d'investissement et comment devenir associé de La Foncière Valora.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to={createPageUrl("StrategyPerformance")}>
              <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold px-8">
                Notre Stratégie
              </Button>
            </Link>
            <Link to={createPageUrl("Contact")}>
              <Button variant="outline" className="bg-background text-slate-900 px-8 py-2 text-sm font-semibold rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border shadow-sm h-9 border-white hover:bg-white hover:text-[#1A3A52]">
                Nous Contacter
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>);

}