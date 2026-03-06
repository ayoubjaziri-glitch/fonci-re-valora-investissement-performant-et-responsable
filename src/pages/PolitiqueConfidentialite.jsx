import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ number, title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="border-b border-slate-100 pb-10"
  >
    <div className="flex items-start gap-4 mb-4">
      <span className="flex-shrink-0 w-8 h-8 bg-[#C9A961] text-[#1A3A52] text-sm font-bold rounded-full flex items-center justify-center mt-0.5">{number}</span>
      <h2 className="text-xl font-serif text-[#1A3A52]">{title}</h2>
    </div>
    <div className="ml-12 text-slate-600 leading-relaxed space-y-3">{children}</div>
  </motion.div>
);

export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-24 bg-[#1A3A52] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A961]/5 rounded-full transform translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">Protection des données</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Politique de Confidentialité</h1>
            <p className="text-white/60 text-lg">Conformément au Règlement (UE) 2016/679 du 27 avril 2016 (RGPD) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée</p>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-[#C9A961]/30 p-6 shadow-sm">
            <p className="text-slate-700 leading-relaxed text-sm">
              La Foncière Patrimoniale, en sa qualité de <strong>responsable de traitement</strong> au sens de l'article 4(7) du RGPD, attache une importance fondamentale à la protection de la vie privée et des données à caractère personnel de toute personne avec laquelle elle est en relation. La présente politique a pour objet d'informer de manière transparente les personnes concernées sur les modalités de collecte, de traitement, de conservation et de protection de leurs données personnelles.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 space-y-10">

          <Section number="1" title="Identité et coordonnées du responsable de traitement">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-sm space-y-1.5">
              <p><strong>Responsable de traitement :</strong> La Foncière Patrimoniale (SAS)</p>
              <p><strong>Siège social :</strong> 16 Rue de la Laure, 03200 Vichy, France</p>
              <p><strong>Représentant légal :</strong> Monsieur Ayoub Jaziri, Cofondateur</p>
              <p><strong>Contact :</strong> <a href="mailto:ayoubjaziri@gmail.com" className="text-[#C9A961] hover:underline">ayoubjaziri@gmail.com</a></p>
              <p><strong>Téléphone :</strong> +33 7 58 73 65 80</p>
            </div>
          </Section>

          <Section number="2" title="Catégories de données collectées">
            <p>Dans le cadre de ses activités, La Foncière Patrimoniale est susceptible de collecter et traiter les catégories de données suivantes :</p>
            <div className="space-y-3">
              {[
                { label: "Données d'identification", detail: "Nom, prénom, civilité" },
                { label: "Données de contact", detail: "Adresse électronique, numéro de téléphone" },
                { label: "Données relatives au projet", detail: "Type de demande, capacité d'investissement, profil investisseur" },
                { label: "Données de navigation", detail: "Cookies techniques, adresse IP, données de session" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-lg px-4 py-3 text-sm">
                  <span className="w-2 h-2 bg-[#C9A961] rounded-full mt-1.5 flex-shrink-0" />
                  <div><strong>{item.label} :</strong> {item.detail}</div>
                </div>
              ))}
            </div>
            <p className="text-sm italic">La Foncière Patrimoniale ne collecte aucune donnée sensible au sens de l'article 9 du RGPD (données de santé, origines ethniques, convictions religieuses, etc.).</p>
          </Section>

          <Section number="3" title="Finalités et bases légales des traitements">
            <p>Les données collectées sont traitées aux fins suivantes, sur les bases légales correspondantes :</p>
            <div className="overflow-hidden rounded-xl border border-slate-200 text-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1A3A52] text-white">
                    <th className="text-left px-4 py-3 font-semibold">Finalité</th>
                    <th className="text-left px-4 py-3 font-semibold">Base légale (art. 6 RGPD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ["Traitement des demandes de contact et d'information", "Exécution de mesures précontractuelles (art. 6.1.b)"],
                    ["Gestion de la relation investisseur", "Intérêt légitime du responsable de traitement (art. 6.1.f)"],
                    ["Envoi d'informations sur les opportunités d'investissement", "Consentement de la personne concernée (art. 6.1.a)"],
                    ["Respect des obligations légales et réglementaires", "Obligation légale (art. 6.1.c)"],
                    ["Fonctionnement technique du site (cookies essentiels)", "Intérêt légitime (art. 6.1.f)"],
                  ].map(([fin, base], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-4 py-3">{fin}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{base}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section number="4" title="Destinataires des données">
            <p>Les données à caractère personnel collectées sont destinées exclusivement aux membres habilités de l'équipe interne de La Foncière Patrimoniale ayant besoin d'y accéder dans le cadre de leurs fonctions.</p>
            <p>Elles ne font l'objet d'aucune cession, vente ou communication à des tiers à des fins commerciales. Elles peuvent cependant être communiquées, dans le strict respect du cadre légal, aux catégories de destinataires suivantes :</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
              <li>Prestataires techniques d'hébergement et de maintenance informatique (sous-traitants au sens du RGPD) ;</li>
              <li>Conseillers juridiques ou comptables dans le cadre de l'exécution de leurs missions ;</li>
              <li>Autorités compétentes sur réquisition judiciaire ou administrative.</li>
            </ul>
            <p className="text-sm">Tous les sous-traitants sont liés par des obligations contractuelles de confidentialité et de sécurité conformes aux exigences du RGPD.</p>
          </Section>

          <Section number="5" title="Durée de conservation">
            <div className="overflow-hidden rounded-xl border border-slate-200 text-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1A3A52] text-white">
                    <th className="text-left px-4 py-3 font-semibold">Catégorie de données</th>
                    <th className="text-left px-4 py-3 font-semibold">Durée de conservation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ["Données de contact (prospects)", "3 ans à compter du dernier contact"],
                    ["Données relatives aux associés", "Durée de la relation contractuelle + 5 ans"],
                    ["Données comptables et financières", "10 ans (obligation légale — art. L. 123-22 C. com.)"],
                    ["Cookies techniques", "13 mois maximum (recommandation CNIL)"],
                  ].map(([cat, duree], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-4 py-3">{cat}</td>
                      <td className="px-4 py-3 text-slate-500">{duree}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm italic">Au terme de ces délais, les données sont supprimées ou anonymisées de manière définitive et irréversible.</p>
          </Section>

          <Section number="6" title="Vos droits">
            <p>Conformément au RGPD (articles 15 à 22) et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {[
                { droit: "Droit d'accès", desc: "Obtenir la confirmation du traitement de vos données et en recevoir une copie (art. 15)" },
                { droit: "Droit de rectification", desc: "Corriger des données inexactes ou incomplètes (art. 16)" },
                { droit: "Droit à l'effacement", desc: "Demander la suppression de vos données sous conditions (art. 17)" },
                { droit: "Droit à la limitation", desc: "Suspendre temporairement un traitement (art. 18)" },
                { droit: "Droit à la portabilité", desc: "Récupérer vos données dans un format structuré et lisible (art. 20)" },
                { droit: "Droit d'opposition", desc: "S'opposer à un traitement fondé sur l'intérêt légitime (art. 21)" },
              ].map(({ droit, desc }, i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="font-semibold text-[#1A3A52] mb-1">{droit}</p>
                  <p className="text-slate-500 text-xs">{desc}</p>
                </div>
              ))}
            </div>
            <p>Pour exercer ces droits, vous pouvez adresser votre demande par courrier électronique à : <a href="mailto:ayoubjaziri@gmail.com" className="text-[#C9A961] hover:underline font-medium">ayoubjaziri@gmail.com</a>, en joignant une copie d'un justificatif d'identité. Nous nous engageons à répondre dans un délai d'un (1) mois à compter de la réception de votre demande, délai pouvant être prolongé de deux (2) mois supplémentaires en cas de demandes complexes ou nombreuses.</p>
          </Section>

          <Section number="7" title="Sécurité des données">
            <p>La Foncière Patrimoniale met en œuvre des mesures techniques et organisationnelles appropriées et proportionnées aux risques identifiés, afin de garantir la confidentialité, l'intégrité et la disponibilité des données à caractère personnel, notamment :</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
              <li>Chiffrement des données en transit (protocole TLS/HTTPS) ;</li>
              <li>Accès restreint aux données sur la base du principe du moindre privilège ;</li>
              <li>Hébergement sécurisé chez un prestataire certifié ;</li>
              <li>Procédures internes de gestion des incidents de sécurité.</li>
            </ul>
            <p className="text-sm">En cas de violation de données susceptible d'engendrer un risque élevé pour vos droits et libertés, La Foncière Patrimoniale s'engage à vous en informer dans les meilleurs délais, conformément à l'article 34 du RGPD.</p>
          </Section>

          <Section number="8" title="Gestion des cookies">
            <p>Lors de votre navigation sur ce site, des cookies techniques strictement nécessaires au fonctionnement du site peuvent être déposés sur votre terminal. Ces cookies ne servent à aucune finalité publicitaire ou de profilage.</p>
            <p>Aucun cookie non essentiel n'est déposé sans recueil préalable de votre consentement, conformément à la délibération CNIL n° 2020-091 du 17 septembre 2020 et aux lignes directrices du 1er octobre 2020.</p>
            <p className="text-sm">Vous pouvez à tout moment configurer votre navigateur pour refuser les cookies. Cette désactivation pourrait toutefois affecter certaines fonctionnalités du site.</p>
          </Section>

          <Section number="9" title="Transferts de données hors Union européenne">
            <p>Les données à caractère personnel collectées sont traitées et stockées au sein de l'Union européenne. En cas de transfert vers un pays tiers, La Foncière Patrimoniale s'assure que des garanties appropriées sont mises en place (clauses contractuelles types de la Commission européenne, décision d'adéquation, etc.), conformément aux articles 44 à 49 du RGPD.</p>
          </Section>

          <Section number="10" title="Droit d'introduire une réclamation auprès de la CNIL">
            <p>Si vous estimez que le traitement de vos données personnelles par La Foncière Patrimoniale n'est pas conforme à la réglementation applicable, vous disposez du droit d'introduire une réclamation auprès de l'autorité de contrôle compétente :</p>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-sm space-y-1.5">
              <p><strong>Commission Nationale de l'Informatique et des Libertés (CNIL)</strong></p>
              <p>3 Place de Fontenoy – TSA 80715 – 75334 Paris Cedex 07</p>
              <p>Téléphone : +33 1 53 73 22 22</p>
              <p><a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#C9A961] hover:underline">www.cnil.fr</a></p>
            </div>
            <p className="text-sm italic">L'exercice de ce droit ne préjuge pas des autres voies de recours amiables ou contentieuses disponibles.</p>
          </Section>

          <Section number="11" title="Mise à jour de la politique de confidentialité">
            <p>La présente politique de confidentialité est susceptible d'être modifiée à tout moment afin de refléter les évolutions réglementaires, jurisprudentielles ou opérationnelles. La date de dernière mise à jour est indiquée en bas de page. Il appartient à chaque utilisateur de consulter régulièrement ce document.</p>
          </Section>

          <div className="pt-4 text-sm text-slate-400 border-t border-slate-100">
            Dernière mise à jour : 6 mars 2026 — La Foncière Patrimoniale © 2026. Tous droits réservés.
          </div>
        </div>
      </section>
    </div>
  );
}