import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function BlogArticle() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const articleId = parseInt(params.get('id'));

  const articles = [
    {
      id: 1,
      title: "Marché immobilier résidentiel 2026 : Opportunités et tensions dans les villes secondaires",
      category: "Marché immobilier",
      date: "15 janvier 2026",
      readTime: "8 min",
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
      category: "Financement",
      date: "8 janvier 2026",
      readTime: "10 min",
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

        <p><strong>Conclusion :</strong> La maîtrise du financement immobilier est un facteur clé de succès dans les opérations de valorisation patrimoniale. Un LTC optimisé couplé à une négociation bancaire rigoureuse permet de maximiser la rentabilité tout en maîtrisant le risque.</p>
      `
    },
    {
      id: 3,
      title: "Le Carried Interest en immobilier : alignement des intérêts et rémunération de la performance",
      category: "Stratégie",
      date: "22 décembre 2025",
      readTime: "7 min",
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

        <p><strong>Conclusion :</strong> Le carried interest est un outil puissant d'alignement des intérêts entre gérants et investisseurs. Lorsqu'il est structuré de manière équilibrée et transparente, il constitue un vecteur de performance et de confiance mutuelle au sein d'une foncière.</p>
      `
    },
    {
      id: 4,
      title: "Réglementation 2026 : DPE, interdiction de location et impact sur les stratégies d'investissement",
      category: "Réglementation",
      date: "10 décembre 2025",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=800&q=80",
      content: `
        <h2>Calendrier réglementaire : le durcissement progressif</h2>
        <p>La loi Climat et Résilience de 2021 a instauré un calendrier progressif d'interdiction de location pour les logements énergivores. Cette contrainte réglementaire bouleverse le marché locatif et crée des opportunités pour les investisseurs structurés.</p>

        <h3>Les dates clés</h3>

        <h4>2025 : Ensemble du DPE G</h4>
        <p>À partir du 1er janvier 2025, tous les logements classés G sont interdits à la location. <strong>Environ 600 000 logements concernés.</strong></p>

        <h4>2028 : DPE F</h4>
        <p>Interdiction de louer les logements classés F à partir du 1er janvier 2028. <strong>Environ 1,2 million de logements concernés.</strong></p>

        <h4>2034 : DPE E</h4>
        <p>Extension de l'interdiction aux logements E. <strong>Environ 2,6 millions de logements concernés.</strong></p>

        <p><strong>Conclusion :</strong> La réglementation DPE structure durablement le marché immobilier français. Les acteurs capables de transformer des actifs non-conformes en logements performants bénéficient d'un avantage structurel durable.</p>
      `
    }
  ];

  const article = articles.find(a => a.id === articleId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-[#1A3A52] mb-4">Article non trouvé</h1>
          <Link to={createPageUrl("Blog")}>
            <Button className="bg-[#1A3A52] text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-96">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <Link to={createPageUrl("Blog")}>
              <Button variant="ghost" className="text-white hover:text-[#C9A961] mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au blog
              </Button>
            </Link>
            <span className="inline-block px-3 py-1 bg-[#C9A961] text-[#1A3A52] rounded-full text-sm font-semibold mb-4">
              {article.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {article.date}
              </div>
              <span>•</span>
              <span>{article.readTime} de lecture</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div 
            className="prose prose-lg prose-slate max-w-none
              prose-headings:font-serif prose-headings:text-[#1A3A52]
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
              prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4
              prose-ul:my-6 prose-li:text-slate-700
              prose-ol:my-6
              prose-strong:text-[#1A3A52] prose-strong:font-semibold
              prose-a:text-[#C9A961] prose-a:no-underline hover:prose-a:underline
              prose-table:border-collapse prose-table:w-full
              prose-th:bg-slate-50 prose-th:p-3 prose-th:text-left prose-th:border prose-th:border-slate-200
              prose-td:p-3 prose-td:border prose-td:border-slate-200"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-slate-600">Partager cet article :</p>
              <Button variant="outline" className="border-[#1A3A52] text-[#1A3A52]">
                <Share2 className="mr-2 h-4 w-4" />
                Partager
              </Button>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-[#1A3A52] rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-serif text-white mb-4">
              Intéressé par notre approche ?
            </h3>
            <p className="text-white/80 mb-6">
              Découvrez comment investir aux côtés de La Foncière Patrimoniale
            </p>
            <Link to={createPageUrl("Contact")}>
              <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold px-8 py-6">
                Entrer en relation
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}