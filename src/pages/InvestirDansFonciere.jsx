import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';

export default function InvestirDansFonciere() {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['blog-articles'],
    queryFn: () => base44.entities.ArticleBlog.filter({ publie: true }),
  });

  const article = articles.find(a => a.slug === 'investissement-immobilier-2026-guide-fonciere-valora');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9A961] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-600">Article non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#1A3A52] to-[#2A4A6F]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                Article Blog
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
              {article.titre}
            </h1>
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              {article.extrait}
            </p>
            <div className="flex items-center gap-4 text-white/70 text-sm">
              <span>{new Date(article.date_publication).toLocaleDateString('fr-FR')}</span>
              <span>•</span>
              <span>{article.temps_lecture}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className="py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="prose prose-lg max-w-none mb-16">
            <ReactMarkdown
              components={{
                h2: ({node, ...props}) => <h2 className="text-4xl font-serif text-[#1A3A52] mb-8 mt-12" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-2xl font-serif text-[#1A3A52] mb-6 mt-10" {...props} />,
                p: ({node, ...props}) => <p className="text-lg text-slate-700 leading-relaxed mb-6" {...props} />,
                ul: ({node, ...props}) => <ul className="space-y-3 mb-8 list-disc list-inside" {...props} />,
                li: ({node, ...props}) => <li className="text-slate-700" {...props} />,
                strong: ({node, ...props}) => <strong className="text-[#1A3A52] font-semibold" {...props} />,
                code: ({node, inline, ...props}) => inline ? 
                  <code className="bg-[#C9A961]/10 text-[#C9A961] px-2 py-1 rounded" {...props} /> :
                  <code className="bg-slate-100 p-4 rounded block mb-6" {...props} />,
              }}
            >
              {article.contenu}
            </ReactMarkdown>
          </div>
        </div>
      </article>

              
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Une foncière fonctionne selon un schéma simple mais puissant : elle collecte des fonds auprès d'investisseurs 
                (appelés associés ou actionnaires selon la forme juridique), puis utilise ces capitaux pour acquérir des biens 
                immobiliers. Ces actifs sont ensuite gérés activement pour générer des revenus locatifs et prendre de la valeur 
                au fil du temps.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Les revenus générés par le patrimoine immobilier (loyers perçus) sont redistribués aux investisseurs sous forme 
                de dividendes ou de distributions, après déduction des charges d'exploitation, des frais de gestion et du 
                remboursement des emprunts éventuels. À terme, lors de la cession des actifs, les plus-values réalisées 
                viennent également rémunérer les associés proportionnellement à leur participation au capital.
              </p>

              <h3 className="text-2xl font-serif text-[#1A3A52] mt-12 mb-6">Les Acteurs d'une Foncière</h3>
              
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Une foncière immobilière réunit plusieurs types d'acteurs aux rôles complémentaires :
              </p>

              <div className="bg-slate-50 rounded-2xl p-8 mb-8">
                <h4 className="text-xl font-semibold text-[#1A3A52] mb-4">Les Gérants ou Dirigeants</h4>
                <p className="text-slate-700 mb-4">
                  Ce sont les professionnels qui pilotent la stratégie d'investissement de la foncière. Ils sont responsables 
                  du sourcing des opportunités d'acquisition, de la négociation des prix d'achat, du pilotage des travaux de 
                  rénovation éventuels, de la gestion locative et de l'optimisation de la valorisation du patrimoine. Leur 
                  expertise en immobilier, finance et gestion de projet est déterminante pour la performance de la foncière.
                </p>
                <p className="text-slate-700">
                  Dans une foncière bien structurée, les gérants sont également associés significatifs, investissant leur 
                  propre capital aux côtés des autres investisseurs. Ce "skin in the game" garantit un parfait alignement des 
                  intérêts entre dirigeants et associés.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8 mb-8">
                <h4 className="text-xl font-semibold text-[#1A3A52] mb-4">Les Investisseurs / Associés</h4>
                <p className="text-slate-700 mb-4">
                  Ce sont les personnes physiques ou morales qui apportent des capitaux à la foncière en échange de parts 
                  sociales ou d'actions. Ils deviennent copropriétaires du patrimoine immobilier et bénéficient des revenus 
                  et plus-values générés, proportionnellement à leur participation au capital.
                </p>
                <p className="text-slate-700">
                  Les investisseurs d'une foncière recherchent généralement un placement immobilier clé en main, sans les 
                  contraintes de la gestion locative en direct, tout en bénéficiant d'une diversification géographique et 
                  typologique de leurs actifs immobiliers.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8 mb-8">
                <h4 className="text-xl font-semibold text-[#1A3A52] mb-4">Les Prestataires Externes</h4>
                <p className="text-slate-700 mb-4">
                  Une foncière s'appuie également sur un écosystème de partenaires professionnels : experts-comptables, 
                  commissaires aux comptes, avocats spécialisés en droit immobilier, notaires, géomètres, bureaux d'études 
                  techniques, entreprises de travaux, agents immobiliers, gestionnaires locatifs, etc.
                </p>
                <p className="text-slate-700">
                  Cette professionnalisation permet de sécuriser chaque étape du processus d'investissement et de garantir 
                  une gestion conforme aux réglementations en vigueur.
                </p>
              </div>

              <h3 className="text-2xl font-serif text-[#1A3A52] mt-12 mb-6">L'Histoire des Foncières en France</h3>
              
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Les foncières immobilières ont une longue histoire en France. Les premières sociétés immobilières cotées 
                apparaissent dès le XIXe siècle, permettant déjà à l'époque de démocratiser l'accès à l'investissement dans 
                l'immobilier de rapport parisien. Le Baron Haussmann lui-même fut un promoteur de ce modèle pour financer 
                la transformation de Paris.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Dans les années 1960-1970, la création des SCPI (Sociétés Civiles de Placement Immobilier) marque un tournant 
                majeur. Ces véhicules d'investissement collectif permettent aux épargnants modestes d'accéder à la "pierre-papier" 
                avec des tickets d'entrée de quelques milliers d'euros seulement. Les SCPI connaissent un succès grandissant, 
                collectant aujourd'hui plusieurs dizaines de milliards d'euros.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Plus récemment, l'émergence des foncières patrimoniales privées (comme La Foncière Patrimoniale) répond à une 
                demande croissante d'investisseurs avertis recherchant des stratégies d'investissement plus ciblées, des 
                rendements supérieurs et un alignement fort avec les gérants. Ces structures combinent la rigueur des foncières 
                institutionnelles avec l'agilité et la proximité des structures entrepreneuriales.
              </p>
            </div>
          </section>

          {/* Section 2: Avantages */}
          <section id="avantages" className="mb-20">
            <h2 className="text-4xl font-serif text-[#1A3A52] mb-8">Les Avantages Décisifs d'Investir dans une Foncière</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border-2 border-[#C9A961]/20 rounded-2xl p-8">
                <div className="w-16 h-16 bg-[#C9A961]/10 rounded-xl flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-[#C9A961]" />
                </div>
                <h3 className="text-2xl font-serif text-[#1A3A52] mb-4">Mutualisation et Diversification</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  L'un des avantages majeurs d'une foncière réside dans la mutualisation des risques grâce à la diversification 
                  du portefeuille immobilier. Plutôt que d'investir l'intégralité de votre capital dans un seul bien immobilier 
                  (avec tous les risques concentrés : vacance locative, dépréciation du marché local, sinistre, etc.), une 
                  foncière vous permet d'accéder à un panier d'actifs variés.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Cette diversification peut être géographique (plusieurs villes, régions), typologique (studios, T2, T3, 
                  commerces), ou encore en termes de profils locataires (étudiants, jeunes actifs, familles, seniors). Ainsi, 
                  si un actif rencontre des difficultés temporaires, l'impact sur votre rentabilité globale reste limité car 
                  les autres actifs continuent de performer normalement.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white border-2 border-[#C9A961]/20 rounded-2xl p-8">
                <div className="w-16 h-16 bg-[#C9A961]/10 rounded-xl flex items-center justify-center mb-6">
                  <Award className="h-8 w-8 text-[#C9A961]" />
                </div>
                <h3 className="text-2xl font-serif text-[#1A3A52] mb-4">Professionnalisation de la Gestion</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Investir en direct dans l'immobilier locatif nécessite du temps, des compétences et une disponibilité 
                  importante : recherche de biens, visites, négociations, gestion administrative, relation avec les locataires, 
                  entretien et travaux, gestion des impayés, déclarations fiscales, etc. C'est un véritable métier.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Une foncière vous libère de toutes ces contraintes en confiant la gestion à des professionnels expérimentés. 
                  L'équipe de gestion s'occupe de tout : sourcing des opportunités d'acquisition, négociation des prix, pilotage 
                  des travaux de rénovation, gestion locative complète, optimisation fiscale, reporting aux associés. Vous 
                  investissez en toute sérénité, sans aucune contrainte de gestion quotidienne.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white border-2 border-[#C9A961]/20 rounded-2xl p-8">
                <div className="w-16 h-16 bg-[#C9A961]/10 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="h-8 w-8 text-[#C9A961]" />
                </div>
                <h3 className="text-2xl font-serif text-[#1A3A52] mb-4">Effet de Levier Maîtrisé</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Grâce à sa structure professionnelle et à la qualité de ses actifs, une foncière bénéficie généralement de 
                  conditions de financement bancaire très avantageuses. Les établissements financiers sont plus enclins à 
                  financer une foncière gérée par des professionnels expérimentés qu'un particulier débutant.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Cet effet de levier permet de démultiplier la rentabilité des fonds propres. Par exemple, avec un ratio LTC 
                  (Loan To Cost) de 75%, chaque euro investi par les associés "achète" en réalité 4€ d'actifs immobiliers. 
                  Cette démultiplication amplifie mécaniquement les rendements, tout en maîtrisant les risques grâce à une 
                  structure financière équilibrée et à un taux de couverture du service de la dette confortable.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white border-2 border-[#C9A961]/20 rounded-2xl p-8">
                <div className="w-16 h-16 bg-[#C9A961]/10 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-[#C9A961]" />
                </div>
                <h3 className="text-2xl font-serif text-[#1A3A52] mb-4">Optimisation Fiscale Structurée</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Les foncières bénéficient de schémas d'optimisation fiscale performants, notamment via le choix de la forme 
                  juridique adaptée (SCI à l'IR, société soumise à l'IS, éligibilité PEA-PME, etc.), l'amortissement comptable 
                  des immeubles et travaux, la déductibilité des intérêts d'emprunt et des charges d'exploitation.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Par exemple, une foncière éligible au PEA-PME permet à ses associés de bénéficier d'une exonération totale 
                  d'impôt sur les plus-values après 5 ans de détention (seuls les prélèvements sociaux de 17,2% restent dus). 
                  Cette fiscalité ultra-avantageuse peut transformer radicalement la rentabilité nette de votre investissement 
                  par rapport à un placement immobilier classique.
                </p>
              </motion.div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h3 className="text-2xl font-serif text-[#1A3A52] mt-12 mb-6">Accessibilité et Tickets d'Entrée</h3>
              
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Investir en direct dans un immeuble de rapport de qualité nécessite généralement un capital important, souvent 
                plusieurs centaines de milliers d'euros. Ce montant reste inaccessible pour la majorité des épargnants, qui 
                se retrouvent alors cantonnés à l'achat d'un seul petit appartement, sans diversification possible.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Une foncière démocratise l'accès à l'investissement immobilier patrimonial. Selon les structures, les tickets 
                d'entrée peuvent débuter à partir de 10 000€, 25 000€ ou 50 000€, permettant ainsi à des investisseurs aux 
                capacités financières variées d'accéder à un patrimoine immobilier diversifié et géré professionnellement.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Cette accessibilité ne sacrifie rien à la qualité : vous investissez dans les mêmes types d'actifs qu'un 
                investisseur institutionnel (immeubles entiers en centre-ville, opérations de réhabilitation à forte valeur 
                ajoutée), mais de manière mutualisée avec d'autres associés partageant les mêmes objectifs patrimoniaux.
              </p>

              <h3 className="text-2xl font-serif text-[#1A3A52] mt-12 mb-6">Transparence et Gouvernance</h3>
              
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Les foncières patrimoniales de qualité se distinguent par leur exigence de transparence et de gouvernance. 
                Les associés reçoivent régulièrement (trimestriellement ou semestriellement) des reportings détaillés sur :
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#C9A961] flex-shrink-0 mt-1" />
                  <span className="text-slate-700">La valorisation actualisée du patrimoine immobilier (basée sur des expertises indépendantes)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#C9A961] flex-shrink-0 mt-1" />
                  <span className="text-slate-700">Les revenus locatifs perçus et le taux d'occupation des actifs</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#C9A961] flex-shrink-0 mt-1" />
                  <span className="text-slate-700">L'avancement des projets d'acquisition et de rénovation en cours</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#C9A961] flex-shrink-0 mt-1" />
                  <span className="text-slate-700">La situation financière consolidée (trésorerie, endettement, ratios clés)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#C9A961] flex-shrink-0 mt-1" />
                  <span className="text-slate-700">Les perspectives d'évolution et la stratégie à moyen terme</span>
                </li>
              </ul>

              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Par ailleurs, les associés disposent de droits de gouvernance : participation aux assemblées générales, droit 
                de vote sur les décisions stratégiques majeures (acquisitions importantes, cessions d'actifs, modification des 
                statuts, etc.), accès aux comptes certifiés par un commissaire aux comptes indépendant.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Cette transparence et cette gouvernance structurée créent un climat de confiance indispensable pour un 
                investissement de long terme. Vous savez précisément où va votre argent, comment il est géré, et quelles 
                performances sont générées.
              </p>
            </div>
          </section>

          {/* Section 3: Types */}
          <section id="types" className="mb-20">
            <h2 className="text-4xl font-serif text-[#1A3A52] mb-8">Les Différents Types de Foncières Immobilières</h2>
            
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-lg text-slate-700 leading-relaxed mb-8">
                Le paysage des foncières immobilières françaises est riche et varié. Chaque type de structure présente des 
                caractéristiques propres en termes de réglementation, de liquidité, de fiscalité et de stratégie d'investissement. 
                Comprendre ces différences est essentiel pour choisir le véhicule le plus adapté à vos objectifs patrimoniaux.
              </p>
            </div>

            <div className="space-y-8 mb-12">
              <div className="bg-gradient-to-r from-slate-50 to-white border-l-4 border-[#C9A961] rounded-r-2xl p-8">
                <h3 className="text-2xl font-serif text-[#1A3A52] mb-4">SCPI - Sociétés Civiles de Placement Immobilier</h3>
                
                <p className="text-slate-700 leading-relaxed mb-4">
                  Les SCPI sont les véhicules d'investissement immobilier les plus répandus en France, avec une capitalisation 
                  totale dépassant les 80 milliards d'euros. Créées dans les années 1960, elles permettent à des particuliers 
                  d'investir collectivement dans un patrimoine immobilier géré professionnellement.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-semibold text-[#1A3A52] mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#C9A961]" />
                      Avantages
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li>• Ticket d'entrée accessible (dès 200-1000€)</li>
                      <li>• Distribution de revenus réguliers (trimestriels)</li>
                      <li>• Gestion 100% déléguée</li>
                      <li>• Fiscalité transparente (revenus fonciers)</li>
                      <li>• Grande diversification du patrimoine</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1A3A52] mb-3">Inconvénients</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li>• Liquidité faible (marché secondaire limité)</li>
                      <li>• Frais d'entrée élevés (8-12% du montant investi)</li>
                      <li>• Rendements modestes (4-5% en moyenne)</li>
                      <li>• Pas de création de valeur active</li>
                      <li>• Stratégie passive d'achat-location-conservation</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-50 to-white border-l-4 border-[#C9A961] rounded-r-2xl p-8">
                <h3 className="text-2xl font-serif text-[#1A3A52] mb-4">SCI - Sociétés Civiles Immobilières</h3>
                
                <p className="text-slate-700 leading-relaxed mb-4">
                  La SCI est une structure juridique privée permettant à plusieurs personnes de détenir et gérer ensemble un 
                  patrimoine immobilier. C'est une forme particulièrement prisée pour l'immobilier familial ou entre associés 
                  partageant une vision commune.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-semibold text-[#1A3A52] mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#C9A961]" />
                      Avantages
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li>• Flexibilité de gouvernance (statuts sur-mesure)</li>
                      <li>• Optimisation fiscale (choix IR ou IS)</li>
                      <li>• Transmission facilitée (donation de parts)</li>
                      <li>• Gestion active possible</li>
                      <li>• Pas de régulation AMF contraignante</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1A3A52] mb-3">Inconvénients</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li>• Liquidité quasi-nulle (cession de parts complexe)</li>
                      <li>• Nécessite accord unanime des associés</li>
                      <li>• Formalisme administratif important</li>
                      <li>• Responsabilité indéfinie des associés</li>
                      <li>• Gestion chronophage si active</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-50 to-white border-l-4 border-[#C9A961] rounded-r-2xl p-8">
                <h3 className="text-2xl font-serif text-[#1A3A52] mb-4">Foncières Patrimoniales Privées (Value-Add)</h3>
                
                <p className="text-slate-700 leading-relaxed mb-4">
                  Les foncières patrimoniales privées représentent une nouvelle génération de véhicules d'investissement 
                  immobilier, alliant professionnalisme institutionnel et agilité entrepreneuriale. Elles se distinguent par 
                  une stratégie active de création de valeur via la réhabilitation d'actifs décotés.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-semibold text-[#1A3A52] mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#C9A961]" />
                      Avantages
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                       <li>• Rendements cibles élevés (10-12% TRI)</li>
                      <li>• Création de valeur active (value-add)</li>
                      <li>• Alignement fort gérants/investisseurs</li>
                      <li>• Stratégie ciblée et différenciante</li>
                      <li>• Éligibilité PEA-PME possible</li>
                      <li>• Reporting transparent et régulier</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1A3A52] mb-3">Caractéristiques</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li>• Ticket d'entrée : 25 000€ à 100 000€</li>
                      <li>• Horizon de détention : 5-10 ans</li>
                      <li>• Stratégie : acquisition + réhabilitation BBC</li>
                      <li>• Cible : immeubles résidentiels centre-ville</li>
                      <li>• Effet de levier : LTC 70-80%</li>
                      <li>• Gouvernance : AG, reporting, comité opérationnel</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 bg-[#C9A961]/5 rounded-xl p-6">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <strong className="text-[#1A3A52]">La Foncière Patrimoniale</strong> s'inscrit dans cette catégorie. 
                    Notre stratégie consiste à acquérir des immeubles anciens mal valorisés (passoires thermiques DPE F/G) 
                    dans des villes moyennes dynamiques, puis à les transformer via des réhabilitations BBC complètes pour 
                    atteindre un DPE B ou C. Cette approche value-add génère une double création de valeur : optimisation 
                    des loyers (+15-25%) et revalorisation patrimoniale (+20-35%).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="my-16">
            <div className="bg-gradient-to-r from-[#1A3A52] to-[#2A4A6F] rounded-3xl p-12 text-center">
              <h3 className="text-3xl font-serif text-white mb-4">
                Prêt à investir dans l'immobilier résidentiel structuré ?
              </h3>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                Découvrez notre stratégie d'investissement et comment devenir associé de La Foncière Patrimoniale.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to={createPageUrl("Contact")}>
                  <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold px-8 py-6 text-lg">
                    Prendre Contact
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to={createPageUrl("StrategyPerformance")}>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#1A3A52] font-semibold px-8 py-6 text-lg">
                    Notre Stratégie
                  </Button>
                </Link>
              </div>
            </div>
          </section>

        </div>
      </article>

      {/* Footer CTA */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-600">
            <strong>Avertissement :</strong> Tout investissement immobilier comporte des risques de perte en capital. 
            Les performances passées ne préjugent pas des performances futures. Ce contenu est fourni à titre informatif 
            uniquement et ne constitue pas un conseil en investissement.
          </p>
        </div>
      </section>
    </div>
  );
}