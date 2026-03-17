import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  Calendar, User, Clock, ArrowLeft, Share2, 
  Facebook, Linkedin, Mail, ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function BlogArticle() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const slug = urlParams.get('slug');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
      content: `Le marché immobilier français connaît en 2026 une transformation profonde, portée par la baisse progressive des taux d'intérêt et le retour de la confiance des ménages. Pour les investisseurs avisés, c'est le moment idéal pour se positionner sur des actifs à fort potentiel de valorisation.

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

Pour les investisseurs, le message est clair : **2026 est une année charnière**. Les conditions de marché actuelles offrent un point d'entrée favorable avant la remontée attendue des prix.`
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
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
      content: `Une foncière immobilière est une société dédiée à l'acquisition, la gestion et la valorisation d'actifs immobiliers. Contrairement à l'investissement en direct, elle offre une approche professionnelle, mutualisée et optimisée fiscalement.

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
- Assemblées générales participatives`
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
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
      content: `Dans le monde de l'investissement immobilier structuré, le **carried interest** (ou "intéressement à la performance") est un mécanisme fondamental qui garantit l'alignement parfait entre les intérêts des gérants et ceux des investisseurs.

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
Contrairement aux structures à frais de gestion élevés (2-3% des actifs), le modèle à carried interest privilégie la **rémunération à la performance**. Les gérants gagnent plus si et seulement si les investisseurs gagnent plus.`
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
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
      content: `La rénovation énergétique n'est plus une option : c'est une **obligation réglementaire** et une **opportunité d'investissement** majeure. Découvrez comment transformer des passoires thermiques (DPE F-G) en actifs performants (DPE B-C).

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
- Coût : 400-800 €/fenêtre`
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
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80",
      content: `Le PEA-PME (Plan d'Épargne en Actions destiné aux PME) est un outil fiscal méconnu qui permet d'investir dans des foncières patrimoniales tout en bénéficiant d'une **exonération totale d'impôt** après 5 ans de détention.

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
- **Économie : 6 400 €**`
    }
  ];

  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-[#1A3A52] mb-4">Article non trouvé</h1>
          <Link to={createPageUrl("Blog")}>
            <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedArticles = articles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 2);

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = article.title;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-4xl mx-auto px-6">
            <Link to={createPageUrl("Blog")} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4" />
              Retour au blog
            </Link>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}>
          <span className="inline-block bg-[#C9A961]/10 text-[#C9A961] px-4 py-2 rounded-full text-sm font-semibold mb-6">
            {article.category}
          </span>
          
          <h1 className="text-4xl md:text-5xl font-serif text-[#1A3A52] mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-8">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{article.readTime} de lecture</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-3 mb-12 pb-8 border-b border-slate-200">
            <span className="text-sm text-slate-600 font-medium">Partager :</span>
            <button 
              onClick={() => handleShare('linkedin')}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#0077B5] hover:text-white flex items-center justify-center transition-colors">
              <Linkedin className="h-5 w-5" />
            </button>
            <button 
              onClick={() => handleShare('facebook')}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-colors">
              <Facebook className="h-5 w-5" />
            </button>
            <button 
              onClick={() => handleShare('email')}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors">
              <Mail className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg prose-slate max-w-none">
          <ReactMarkdown
            components={{
              h2: ({children}) => <h2 className="text-3xl font-serif text-[#1A3A52] mt-12 mb-6">{children}</h2>,
              h3: ({children}) => <h3 className="text-2xl font-serif text-[#1A3A52] mt-8 mb-4">{children}</h3>,
              p: ({children}) => <p className="text-slate-700 leading-relaxed mb-6">{children}</p>,
              ul: ({children}) => <ul className="space-y-2 mb-6">{children}</ul>,
              li: ({children}) => <li className="text-slate-700">{children}</li>,
              strong: ({children}) => <strong className="text-[#1A3A52] font-semibold">{children}</strong>,
            }}>
            {article.content}
          </ReactMarkdown>
        </motion.div>

        {/* CTA Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-[#1A3A52] to-[#2A4A6F] rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-serif text-white mb-4">
            Intéressé par notre approche ?
          </h3>
          <p className="text-white/70 mb-6">
            Découvrez comment devenir associé de La Foncière Valora.
          </p>
          <Link to={createPageUrl("Contact")}>
            <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
              Entrer en relation
            </Button>
          </Link>
        </motion.div>

        {/* Related Articles */}
        {relatedArticles.length > 0 &&
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 pt-16 border-t border-slate-200">
          <h3 className="text-2xl font-serif text-[#1A3A52] mb-8">Articles similaires</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {relatedArticles.map((relatedArticle) =>
            <Link key={relatedArticle.id} to={createPageUrl(`BlogArticle?slug=${relatedArticle.slug}`)}>
                <div className="group">
                  <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                    <img 
                      src={relatedArticle.image} 
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h4 className="text-xl font-serif text-[#1A3A52] mb-2 group-hover:text-[#C9A961] transition-colors">
                    {relatedArticle.title}
                  </h4>
                  <p className="text-slate-600 text-sm mb-3">{relatedArticle.excerpt}</p>
                  <div className="flex items-center gap-2 text-[#C9A961] text-sm font-medium">
                    Lire l'article
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            )}
          </div>
        </motion.div>
        }
      </article>
    </div>
  );
}