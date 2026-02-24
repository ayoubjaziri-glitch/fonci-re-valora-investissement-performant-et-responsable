import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  Handshake, 
  Shield, 
  Users, 
  Award,
  Building2,
  TrendingUp,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Partenaires() {
  const partenaires = [
    {
      icon: Building2,
      category: "Bancaire & Financement",
      title: "Établissements de crédit",
      description: "Partenariats avec des institutions bancaires de premier plan pour structurer des financements adaptés aux opérations d'acquisition et de rénovation.",
      values: ["Négociation de conditions compétitives", "Accès privilégié", "Relations de long terme"]
    },
    {
      icon: Shield,
      category: "Juridique & Fiscal",
      title: "Conseils juridiques",
      description: "Accompagnement par des cabinets spécialisés en droit des sociétés, en fiscalité patrimoniale et en structuration d'opérations immobilières.",
      values: ["Structuration statutaire", "Conformité réglementaire", "Optimisation fiscale"]
    },
    {
      icon: Users,
      category: "Technique & Travaux",
      title: "Entreprises du bâtiment",
      description: "Collaboration avec des artisans et entreprises BTP qualifiés pour la conduite des programmes de réhabilitation BBC.",
      values: ["Qualifications RGE", "Respect des délais", "Qualité d'exécution"]
    },
    {
      icon: TrendingUp,
      category: "Commercial & Locatif",
      title: "Réseau d'agents immobiliers",
      description: "Relations privilégiées avec un réseau d'agents et de prescripteurs pour l'accès à des opportunités off-market et la commercialisation locative.",
      values: ["Sourcing exclusif", "Connaissance du marché local", "Réactivité"]
    }
  ];

  const principes = [
    {
      icon: Handshake,
      title: "Relations de long terme",
      description: "Nous privilégions des partenariats durables fondés sur la confiance mutuelle et l'alignement des intérêts."
    },
    {
      icon: Shield,
      title: "Sélection rigoureuse",
      description: "Chaque partenaire est sélectionné selon des critères stricts de compétence, d'éthique et de fiabilité."
    },
    {
      icon: Award,
      title: "Excellence opérationnelle",
      description: "Nous exigeons le plus haut niveau de professionnalisme dans chaque intervention."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-[#1A3A52] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 border border-white/20 rounded-full" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                Partenaires
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Un écosystème de partenaires sélectionnés
            </h1>
            <p className="text-xl text-white/70">
              La réussite de notre stratégie patrimoniale repose sur la qualité 
              et la complémentarité des acteurs qui accompagnent nos opérations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-slate-600 leading-relaxed">
              La Foncière Patrimoniale s'entoure de partenaires reconnus pour leur professionnalisme 
              et leur capacité à intervenir efficacement sur l'ensemble du cycle immobilier. 
              Cette collaboration structurée permet d'assurer la qualité d'exécution de nos opérations 
              et de sécuriser la trajectoire patrimoniale à long terme.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partenaires Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[#1A3A52] mb-4">
              Nos catégories de partenaires
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Des acteurs spécialisés intervenant à chaque étape du cycle d'investissement.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {partenaires.map((partenaire, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-[#1A3A52] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <partenaire.icon className="h-8 w-8 text-[#C9A961]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#C9A961] font-medium uppercase tracking-wider mb-1">
                      {partenaire.category}
                    </p>
                    <h3 className="text-xl font-serif text-[#1A3A52]">{partenaire.title}</h3>
                  </div>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">{partenaire.description}</p>
                <div className="space-y-2">
                  {partenaire.values.map((value, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#C9A961] flex-shrink-0" />
                      <span className="text-sm text-slate-600">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Principes */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[#1A3A52] mb-4">
              Nos principes de collaboration
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Une démarche exigeante qui garantit la qualité de nos opérations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {principes.map((principe, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-[#1A3A52] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <principe.icon className="h-8 w-8 text-[#C9A961]" />
                </div>
                <h3 className="text-xl font-serif text-[#1A3A52] mb-3">{principe.title}</h3>
                <p className="text-slate-600">{principe.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeur Ajoutée */}
      <section className="py-24 bg-[#1A3A52]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                Une approche structurée du partenariat
              </h2>
              <p className="text-white/70 mb-8 leading-relaxed">
                Chaque partenaire est intégré dans une logique de coopération durable 
                visant à optimiser la qualité d'exécution et la création de valeur sur 
                l'ensemble du cycle immobilier.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-white">
                  <CheckCircle2 className="h-5 w-5 text-[#C9A961] mt-1 flex-shrink-0" />
                  <span>Processus de sélection rigoureux et transparent</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <CheckCircle2 className="h-5 w-5 text-[#C9A961] mt-1 flex-shrink-0" />
                  <span>Évaluation continue de la qualité des prestations</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <CheckCircle2 className="h-5 w-5 text-[#C9A961] mt-1 flex-shrink-0" />
                  <span>Relations de long terme favorisant l'efficacité opérationnelle</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <CheckCircle2 className="h-5 w-5 text-[#C9A961] mt-1 flex-shrink-0" />
                  <span>Alignement sur les objectifs de qualité et de performance</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
            >
              <h3 className="text-xl font-serif text-white mb-6">Impact sur la performance</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Respect des délais</span>
                  <span className="text-[#C9A961] font-bold text-xl">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Qualité d'exécution</span>
                  <span className="text-[#C9A961] font-bold text-xl">Contrôlée</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Optimisation des coûts</span>
                  <span className="text-[#C9A961] font-bold text-xl">Négociée</span>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-white/20">
                <p className="text-white/80 text-sm">
                  La qualité du réseau de partenaires constitue un facteur déterminant 
                  de la réussite opérationnelle et de la création de valeur patrimoniale.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#C9A961]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-serif text-[#1A3A52] mb-4">
              Vous souhaitez rejoindre notre écosystème ?
            </h2>
            <p className="text-[#1A3A52]/80 mb-8">
              Nous sommes ouverts à l'intégration de nouveaux partenaires qualifiés 
              partageant nos valeurs d'excellence et de professionnalisme.
            </p>
            <Link to={createPageUrl("Contact")}>
              <Button className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white px-8 py-6 font-semibold">
                Nous contacter
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}