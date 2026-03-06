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

export default function MentionsLegales() {
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
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">Informations légales</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Mentions Légales</h1>
            <p className="text-white/60 text-lg">Conformément aux articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN)</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 space-y-10">

          <Section number="1" title="Identification de l'éditeur">
            <p>Le présent site internet, accessible à l'adresse <strong>www.lafoncierepatrimoniale.com</strong>, est édité par :</p>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-sm space-y-1.5">
              <p><strong>Dénomination sociale :</strong> La Foncière Patrimoniale</p>
              <p><strong>Forme juridique :</strong> Société par Actions Simplifiée (SAS)</p>
              <p><strong>Siège social :</strong> 16 Rue de la Laure, 03200 Vichy, France</p>
              <p><strong>Groupe :</strong> Auvergne et Patrimoine — fondé en 2008</p>
              <p><strong>Adresse électronique :</strong> <a href="mailto:ayoubjaziri@gmail.com" className="text-[#C9A961] hover:underline">ayoubjaziri@gmail.com</a></p>
              <p><strong>Téléphone :</strong> +33 7 58 73 65 80</p>
            </div>
          </Section>

          <Section number="2" title="Directeur de la publication">
            <p>Le directeur de la publication est <strong>Monsieur Ayoub Jaziri</strong>, en sa qualité de cofondateur et dirigeant de La Foncière Patrimoniale, responsable éditorial au sens de l'article 6-III-1° de la LCEN.</p>
          </Section>

          <Section number="3" title="Hébergement du site">
            <p>Le site est hébergé par :</p>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-sm space-y-1.5">
              <p><strong>Prestataire :</strong> Base44 Inc.</p>
              <p><strong>Site web :</strong> <a href="https://www.base44.com" target="_blank" rel="noopener noreferrer" className="text-[#C9A961] hover:underline">www.base44.com</a></p>
            </div>
          </Section>

          <Section number="4" title="Propriété intellectuelle et droits d'auteur">
            <p>
              L'ensemble des éléments constituant ce site internet — notamment, mais non limitativement, les textes, articles, études, photographies, illustrations, logos, marques, dénominations sociales, données, bases de données, logiciels, architectures et tout autre contenu — sont la propriété exclusive de La Foncière Patrimoniale ou font l'objet d'une autorisation d'utilisation accordée à cette dernière.
            </p>
            <p>
              Ces éléments sont protégés par les dispositions du Code de la propriété intellectuelle et, notamment, par le droit d'auteur (articles L. 111-1 et suivants), le droit des marques (articles L. 711-1 et suivants) et le droit sui generis sur les bases de données (articles L. 341-1 et suivants).
            </p>
            <p>
              Toute reproduction, représentation, modification, adaptation, traduction, extraction, réutilisation, totale ou partielle, par quelque procédé que ce soit, sans l'autorisation préalable et écrite de La Foncière Patrimoniale, est strictement interdite et constituerait une contrefaçon sanctionnée pénalement et civilement.
            </p>
          </Section>

          <Section number="5" title="Avertissement financier et réglementaire">
            <p>
              Les informations, analyses et contenus publiés sur ce site sont fournis à titre purement informatif et documentaire. Ils ne constituent en aucun cas :
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>une offre au public de titres financiers au sens du Règlement (UE) 2017/1129 (Règlement Prospectus) ;</li>
              <li>un démarchage bancaire ou financier au sens des articles L. 341-1 et suivants du Code monétaire et financier ;</li>
              <li>un conseil en investissement au sens de la Directive MIF II (2014/65/UE) ;</li>
              <li>une recommandation personnalisée d'investir ou de désinvestir dans quelque instrument financier que ce soit.</li>
            </ul>
            <p>
              Tout investissement immobilier ou financier comporte des risques, notamment de perte partielle ou totale du capital investi. Les performances passées ne constituent pas un indicateur fiable des performances futures. Avant toute décision d'investissement, il est vivement conseillé de consulter un conseiller en gestion de patrimoine indépendant et agréé.
            </p>
            <div className="bg-amber-50 border-l-4 border-[#C9A961] rounded-r-xl p-4 text-sm text-slate-700">
              <strong>Avertissement :</strong> Ce site est à caractère promotionnel. Il ne constitue pas un document d'information réglementaire au sens de l'AMF. Avant toute souscription, chaque investisseur est invité à prendre connaissance des statuts, du pacte d'associés et de l'ensemble des documents juridiques et financiers applicables.
            </div>
          </Section>

          <Section number="6" title="Limitation de responsabilité">
            <p>
              La Foncière Patrimoniale s'efforce d'assurer l'exactitude, la complétude et la mise à jour régulière des informations diffusées sur ce site. Toutefois, elle ne saurait garantir l'exhaustivité ou la parfaite exactitude des informations publiées et se réserve le droit de les modifier à tout moment, sans préavis et sans engagement.
            </p>
            <p>
              La responsabilité de La Foncière Patrimoniale ne saurait être engagée en cas de dommages directs ou indirects résultant de l'utilisation du site, d'une indisponibilité temporaire du service, ou de la présence de virus ou d'éléments malveillants sur les sites tiers vers lesquels des liens hypertextes pourraient être établis.
            </p>
          </Section>

          <Section number="7" title="Liens hypertextes">
            <p>
              Ce site peut contenir des liens vers des sites internet tiers. La Foncière Patrimoniale n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, à leur disponibilité ou à leurs pratiques en matière de protection des données personnelles.
            </p>
            <p>
              La création de liens hypertextes pointant vers ce site est soumise à l'accord préalable et écrit de La Foncière Patrimoniale.
            </p>
          </Section>

          <Section number="8" title="Gestion des cookies">
            <p>
              Ce site utilise des cookies techniques strictement nécessaires à son bon fonctionnement (maintien de session, préférences d'affichage). Ces cookies ne collectent aucune donnée à caractère personnel à des fins publicitaires ou analytiques sans votre consentement préalable et explicite, conformément aux dispositions de l'article 82 de la loi Informatique et Libertés et aux recommandations de la CNIL.
            </p>
          </Section>

          <Section number="9" title="Droit applicable et juridiction compétente">
            <p>
              Les présentes mentions légales sont régies, interprétées et appliquées conformément au droit français.
            </p>
            <p>
              En cas de litige relatif à l'interprétation, à la validité ou à l'exécution des présentes, et à défaut de résolution amiable, les parties conviennent d'attribuer compétence exclusive aux juridictions françaises territorialement compétentes, nonobstant pluralité de défendeurs ou appel en garantie.
            </p>
          </Section>

          <div className="pt-4 text-sm text-slate-400 border-t border-slate-100">
            Dernière mise à jour : 6 mars 2026 — La Foncière Patrimoniale © 2026. Tous droits réservés.
          </div>
        </div>
      </section>
    </div>
  );
}