import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-16 bg-[#1A3A52]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" className="text-white hover:text-[#C9A961] mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
          <h1 className="text-4xl font-serif text-white mb-4">Mentions légales</h1>
          <p className="text-white/70">Dernière mise à jour : Février 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4">1. Éditeur du site</h2>
            <p className="text-slate-600 mb-6">
              Le présent site internet est édité par :<br/>
              <strong>La Foncière Patrimoniale</strong><br/>
              Forme juridique : SAS (Société par Actions Simplifiée)<br/>
              Siège social : 16 Rue de la Laure, 03200 Vichy<br/>
              Email : ayoubjaziri@gmail.com<br/>
              Téléphone : +33 7 58 73 65 80
            </p>

            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4 mt-12">2. Directeur de la publication</h2>
            <p className="text-slate-600 mb-6">
              Le directeur de la publication est : <strong>Ayoub Jaziri</strong>, en qualité de représentant légal de la société.
            </p>

            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4 mt-12">3. Hébergement</h2>
            <p className="text-slate-600 mb-6">
              Le site est hébergé par :<br/>
              <strong>Base44</strong><br/>
              Siège social : États-Unis<br/>
              Site web : <a href="https://www.base44.com" target="_blank" rel="noopener noreferrer" className="text-[#C9A961] hover:underline">www.base44.com</a>
            </p>

            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4 mt-12">4. Propriété intellectuelle</h2>
            <p className="text-slate-600 mb-6">
              L'ensemble du contenu présent sur ce site (textes, images, graphiques, logo, icônes, etc.) 
              est la propriété exclusive de La Foncière Patrimoniale ou de ses partenaires. 
              Toute reproduction, distribution, modification, adaptation, retransmission ou publication, 
              même partielle, de ces différents éléments est strictement interdite sans l'accord exprès 
              par écrit de La Foncière Patrimoniale.
            </p>

            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4 mt-12">5. Protection des données personnelles</h2>
            <p className="text-slate-600 mb-6">
              Les informations collectées sur ce site font l'objet d'un traitement informatique destiné 
              à la gestion des demandes de contact. Conformément à la loi « informatique et libertés » 
              et au RGPD, vous bénéficiez d'un droit d'accès, de rectification, de portabilité et d'effacement 
              de vos données ou encore de limitation du traitement. Vous pouvez également, pour des motifs légitimes, 
              vous opposer au traitement des données vous concernant.<br/><br/>
              Pour exercer ces droits ou pour toute question sur le traitement de vos données, 
              vous pouvez nous contacter à l'adresse : <strong>ayoubjaziri@gmail.com</strong>
            </p>

            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4 mt-12">6. Cookies</h2>
            <p className="text-slate-600 mb-6">
              Le site peut être amené à vous demander l'acceptation des cookies pour des besoins de statistiques 
              et d'affichage. Un cookie est une information déposée sur votre disque dur par le serveur du site 
              que vous visitez. Il contient plusieurs données qui sont stockées sur votre ordinateur dans un simple 
              fichier texte auquel un serveur accède pour lire et enregistrer des informations.
            </p>

            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4 mt-12">7. Limitation de responsabilité</h2>
            <p className="text-slate-600 mb-6">
              La Foncière Patrimoniale s'efforce d'assurer au mieux de ses possibilités, l'exactitude et 
              la mise à jour des informations diffusées sur ce site. Toutefois, La Foncière Patrimoniale 
              ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition 
              sur ce site. En conséquence, La Foncière Patrimoniale décline toute responsabilité pour toute 
              imprécision, inexactitude ou omission portant sur des informations disponibles sur ce site.
            </p>

            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4 mt-12">8. Droit applicable</h2>
            <p className="text-slate-600 mb-6">
              Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut 
              d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles 
              de compétence en vigueur.
            </p>

            <div className="mt-12 p-6 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-600">
                <strong>Avertissement :</strong> Ce document est à caractère promotionnel et ne constitue pas 
                un conseil en investissement. Les informations présentées ont un caractère institutionnel et ne 
                constituent pas une offre au public. Avant toute souscription, chaque associé doit prendre 
                connaissance des statuts et du Pacte d'Associés.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}