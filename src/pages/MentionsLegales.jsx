import React from 'react';
import { motion } from 'framer-motion';

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-24 bg-[#1A3A52]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Mentions Légales
            </h1>
            <p className="text-xl text-white/70">
              Informations légales et réglementaires
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-8">
          <div>
            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4">Éditeur du site</h2>
            <p className="text-slate-600 leading-relaxed">
              <strong>La Foncière Patrimoniale</strong><br />
              Société par Actions Simplifiée (SAS)<br />
              Siège social : 16 Rue de la Laure, 03200 Vichy<br />
              Email : ayoubjaziri@gmail.com<br />
              Téléphone : +33 7 58 73 65 80
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4">Directeur de la publication</h2>
            <p className="text-slate-600">
              Ayoub Jaziri, Cofondateur
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4">Hébergement</h2>
            <p className="text-slate-600 leading-relaxed">
              Ce site est hébergé par Base44<br />
              www.base44.com
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4">Propriété intellectuelle</h2>
            <p className="text-slate-600 leading-relaxed">
              L'ensemble du contenu de ce site (textes, images, logos, graphismes) est la propriété exclusive 
              de La Foncière Patrimoniale, sauf mention contraire. Toute reproduction, distribution, modification, 
              adaptation, retransmission ou publication de ces différents éléments est strictement interdite sans 
              l'accord exprès par écrit de La Foncière Patrimoniale.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4">Avertissement</h2>
            <p className="text-slate-600 leading-relaxed">
              Les informations contenues sur ce site sont fournies à titre informatif uniquement et ne constituent 
              ni une sollicitation ni une offre d'achat ou de vente de titres financiers. Ce document ne constitue 
              pas un conseil en investissement. Tout investissement comporte des risques de perte en capital. 
              Les performances passées ne préjugent pas des performances futures.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4">Limitation de responsabilité</h2>
            <p className="text-slate-600 leading-relaxed">
              La Foncière Patrimoniale s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées 
              sur ce site, dont elle se réserve le droit de corriger le contenu à tout moment et sans préavis. 
              Toutefois, elle ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises 
              à disposition sur ce site.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4">Cookies</h2>
            <p className="text-slate-600 leading-relaxed">
              Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. Aucun cookie publicitaire 
              ou de tracking n'est utilisé sans votre consentement préalable.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4">Droit applicable</h2>
            <p className="text-slate-600 leading-relaxed">
              Les présentes mentions légales sont soumises au droit français. Tout litige relatif à l'utilisation 
              du site sera soumis à la compétence exclusive des tribunaux français.
            </p>
          </div>

          <div className="pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Dernière mise à jour : Février 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}