import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';

export default function PolitiqueConfidentialite() {
  const sections = [
    {
      icon: Database,
      title: "Données collectées",
      content: "Nous collectons uniquement les données nécessaires à la gestion de votre demande de contact : nom, prénom, adresse email, numéro de téléphone et informations relatives à votre projet d'investissement. Ces données sont collectées via le formulaire de contact présent sur notre site."
    },
    {
      icon: Lock,
      title: "Finalité du traitement",
      content: "Vos données personnelles sont collectées et traitées pour les finalités suivantes : répondre à vos demandes d'information, gérer votre relation avec La Foncière Patrimoniale, vous proposer des opportunités d'investissement adaptées à votre profil."
    },
    {
      icon: Shield,
      title: "Base légale",
      content: "Le traitement de vos données repose sur votre consentement et l'exécution de mesures précontractuelles prises à votre demande. Vous disposez d'un droit de retrait de votre consentement à tout moment."
    },
    {
      icon: UserCheck,
      title: "Vos droits",
      content: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données. Pour exercer ces droits, contactez-nous à ayoubjaziri@gmail.com."
    },
    {
      icon: Eye,
      title: "Destinataires",
      content: "Vos données personnelles sont destinées exclusivement aux équipes internes de La Foncière Patrimoniale et ne sont jamais transmises à des tiers sans votre consentement explicite."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="py-24 bg-[#1A3A52]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Politique de Confidentialité
            </h1>
            <p className="text-xl text-white/70">
              Protection de vos données personnelles
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-[#C9A961]/10 border border-[#C9A961]/30 rounded-2xl p-6 mb-12">
            <p className="text-slate-700 leading-relaxed">
              La Foncière Patrimoniale accorde une importance particulière à la protection de vos données personnelles 
              et s'engage à les traiter dans le respect du Règlement Général sur la Protection des Données (RGPD) 
              et de la loi Informatique et Libertés.
            </p>
          </div>

          <div className="space-y-8 mb-12">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-[#1A3A52] rounded-2xl flex items-center justify-center">
                    <section.icon className="h-7 w-7 text-[#C9A961]" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-serif text-[#1A3A52] mb-3">{section.title}</h2>
                  <p className="text-slate-600 leading-relaxed">{section.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif text-[#1A3A52] mb-4">Durée de conservation</h2>
              <p className="text-slate-600 leading-relaxed">
                Vos données personnelles sont conservées pendant la durée nécessaire aux finalités pour lesquelles 
                elles ont été collectées. En cas de non-réponse de votre part pendant une période de 3 ans, 
                vos données seront supprimées de nos systèmes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#1A3A52] mb-4">Sécurité</h2>
              <p className="text-slate-600 leading-relaxed">
                Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger 
                vos données contre la perte, l'utilisation abusive, l'accès non autorisé, la divulgation, 
                l'altération ou la destruction.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#1A3A52] mb-4">Cookies</h2>
              <p className="text-slate-600 leading-relaxed">
                Notre site utilise uniquement des cookies techniques strictement nécessaires à son fonctionnement. 
                Nous n'utilisons aucun cookie publicitaire ou de tracking sans votre consentement préalable et explicite.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#1A3A52] mb-4">Contact</h2>
              <p className="text-slate-600 leading-relaxed">
                Pour toute question relative à la protection de vos données personnelles ou pour exercer vos droits, 
                vous pouvez nous contacter :<br /><br />
                <strong>Email :</strong> ayoubjaziri@gmail.com<br />
                <strong>Téléphone :</strong> +33 7 58 73 65 80<br />
                <strong>Adresse :</strong> 16 Rue de la Laure, 03200 Vichy
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#1A3A52] mb-4">Réclamation</h2>
              <p className="text-slate-600 leading-relaxed">
                Vous avez le droit d'introduire une réclamation auprès de la Commission Nationale de l'Informatique 
                et des Libertés (CNIL) si vous estimez que le traitement de vos données personnelles n'est pas conforme 
                à la réglementation en vigueur.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 mt-12">
            <p className="text-sm text-slate-500">
              Dernière mise à jour : Février 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}