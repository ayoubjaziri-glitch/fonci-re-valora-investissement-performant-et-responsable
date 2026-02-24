import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function PolitiqueConfidentialite() {
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
          <h1 className="text-4xl font-serif text-white mb-4">Politique de confidentialité</h1>
          <p className="text-white/70">Dernière mise à jour : Février 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4">1. Introduction</h2>
            <p className="text-slate-600 mb-6">
              La Foncière Patrimoniale accorde une grande importance à la protection de vos données personnelles. 
              Cette politique de confidentialité a pour objectif de vous informer sur la manière dont nous collectons, 
              utilisons, partageons et protégeons vos informations personnelles conformément au Règlement Général 
              sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
            </p>

            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4 mt-12">2. Responsable du traitement</h2>
            <p className="text-slate-600 mb-6">
              Le responsable du traitement de vos données personnelles est :<br/>
              <strong>La Foncière Patrimoniale</strong><br/>
              16 Rue de la Laure, 03200 Vichy<br/>
              Email : ayoubjaziri@gmail.com<br/>
              Téléphone : +33 7 58 73 65 80
            </p>

            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4 mt-12">3. Données collectées</h2>
            <p className="text-slate-600 mb-4">
              Nous collectons les catégories de données suivantes :
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
              <li><strong>Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
              <li><strong>Données relatives à votre projet :</strong> type d'investissement souhaité, montant envisagé, message</li>
              <li><strong>Données de connexion :</strong> adresse IP, données de navigation, cookies</li>
            </ul>

            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4 mt-12">4. Finalités du traitement</h2>
            <p className="text-slate-600 mb-4">
              Vos données personnelles sont collectées et traitées pour les finalités suivantes :
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
              <li>Traitement et suivi de vos demandes de contact</li>
              <li>Communication d'informations relatives à nos services et opérations</li>
              <li>Gestion de la relation avec les associés et investisseurs</li>
              <li>Amélioration de nos services et de notre site internet</li>
              <li>Respect de nos obligations légales et réglementaires</li>
            </ul>

            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4 mt-12">5. Base légale du traitement</h2>
            <p className="text-slate-600 mb-6">
              Le traitement de vos données personnelles repose sur les bases légales suivantes :
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
              <li><strong>Intérêt légitime :</strong> pour la gestion des demandes de contact et la communication commerciale</li>
              <li><strong>Consentement :</strong> pour l'utilisation de cookies non essentiels</li>
              <li><strong>Exécution d'un contrat :</strong> pour la gestion de la relation avec les associés</li>
              <li><strong>Obligation légale :</strong> pour le respect des obligations réglementaires</li>
            </ul>

            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4 mt-12">6. Destinataires des données</h2>
            <p className="text-slate-600 mb-6">
              Vos données personnelles sont destinées aux services internes de La Foncière Patrimoniale 
              ainsi qu'à nos prestataires de services (hébergement, solutions techniques). Ces prestataires 
              sont soumis à des obligations contractuelles strictes de confidentialité et de sécurité.
              Nous ne vendons, ne louons ni ne transmettons vos données personnelles à des tiers à des fins commerciales.
            </p>

            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4 mt-12">7. Durée de conservation</h2>
            <p className="text-slate-600 mb-6">
              Vos données personnelles sont conservées pour une durée n'excédant pas celle nécessaire 
              aux finalités pour lesquelles elles sont traitées :
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
              <li><strong>Demandes de contact :</strong> 3 ans à compter du dernier contact</li>
              <li><strong>Données relatives aux associés :</strong> durée de la relation contractuelle + 5 ans (obligations comptables)</li>
              <li><strong>Cookies :</strong> 13 mois maximum</li>
            </ul>

            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4 mt-12">8. Vos droits</h2>
            <p className="text-slate-600 mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
              <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
              <li><strong>Droit de rectification :</strong> corriger vos données inexactes ou incomplètes</li>
              <li><strong>Droit à l'effacement :</strong> supprimer vos données dans certains cas</li>
              <li><strong>Droit à la limitation du traitement :</strong> limiter le traitement de vos données</li>
              <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données pour motifs légitimes</li>
              <li><strong>Droit de retirer votre consentement :</strong> à tout moment pour les traitements fondés sur le consentement</li>
            </ul>
            <p className="text-slate-600 mb-6">
              Pour exercer ces droits, contactez-nous à l'adresse : <strong>ayoubjaziri@gmail.com</strong><br/>
              Vous disposez également du droit d'introduire une réclamation auprès de la CNIL 
              (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#C9A961] hover:underline">www.cnil.fr</a>).
            </p>

            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4 mt-12">9. Sécurité des données</h2>
            <p className="text-slate-600 mb-6">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour assurer 
              un niveau de sécurité adapté au risque, notamment :
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
              <li>Chiffrement des données sensibles</li>
              <li>Contrôle d'accès aux données personnelles</li>
              <li>Sauvegardes régulières</li>
              <li>Surveillance et détection des incidents de sécurité</li>
            </ul>

            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4 mt-12">10. Cookies</h2>
            <p className="text-slate-600 mb-6">
              Notre site utilise des cookies pour améliorer votre expérience de navigation et analyser 
              l'utilisation du site. Vous pouvez gérer vos préférences en matière de cookies via les 
              paramètres de votre navigateur. Certains cookies sont nécessaires au fonctionnement du site 
              et ne peuvent être désactivés.
            </p>

            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4 mt-12">11. Modifications</h2>
            <p className="text-slate-600 mb-6">
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
              La version en vigueur est celle accessible sur notre site internet. La date de dernière mise 
              à jour est indiquée en haut de cette page.
            </p>

            <h2 className="text-2xl font-serif text-[#1A3A52] mb-4 mt-12">12. Contact</h2>
            <p className="text-slate-600 mb-6">
              Pour toute question concernant cette politique de confidentialité ou le traitement de vos 
              données personnelles, vous pouvez nous contacter :<br/>
              Email : <strong>ayoubjaziri@gmail.com</strong><br/>
              Téléphone : <strong>+33 7 58 73 65 80</strong><br/>
              Adresse : <strong>16 Rue de la Laure, 03200 Vichy</strong>
            </p>

            <div className="mt-12 p-6 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-600">
                En utilisant notre site et en nous fournissant vos données personnelles, vous reconnaissez 
                avoir pris connaissance de cette politique de confidentialité et acceptez les traitements 
                qui y sont décrits.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}