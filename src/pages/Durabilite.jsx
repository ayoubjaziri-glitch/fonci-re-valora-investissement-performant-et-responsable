import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  Leaf, TreePine, Thermometer, Zap, Droplets, Sun, Wind, 
  Building2, ArrowRight, CheckCircle2, Target, BarChart3,
  Recycle, ShieldCheck, Users, Globe
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Durabilite() {
  const engagements = [
    {
      icon: Thermometer,
      title: "Objectif DPE C, B, voire A",
      description: "Tous nos actifs sont réhabilités avec un objectif minimum de DPE C. Selon les opportunités, nous visons les classes B et A lorsque techniquement et économiquement justifié.",
      metric: "C, B, A",
      metricLabel: "Objectifs DPE"
    },
    {
      icon: Zap,
      title: "Réduction énergétique",
      description: "Objectif de -40% d'économies d'énergie après réhabilitation, conformément aux standards BBC et aux attentes réglementaires.",
      metric: "-40%",
      metricLabel: "consommation"
    },
    {
      icon: Target,
      title: "Éradication passoires",
      description: "100% du parc hors des classes E, F et G d'ici 2027, assurant la conformité réglementaire et la louabilité pérenne.",
      metric: "100%",
      metricLabel: "hors E/F/G"
    },
    {
      icon: Droplets,
      title: "Gestion de l'eau",
      description: "Installation de mousseurs et chasses d'eau double flux pour réduire les charges d'eau des occupants.",
      metric: "-20%",
      metricLabel: "conso eau"
    }
  ];

  const piliers = [
    {
      title: "Environnement (E)",
      icon: Globe,
      color: "emerald",
      items: [
        "Focus sur l'éradication des passoires thermiques (achat en G, livraison en C)",
        "Isolation systématique des combles et planchers bas",
        "Remplacement des chaudières fioul/gaz par des PAC",
        "Utilisation de matériaux à faible impact (laine de roche, métisse)",
        "Gestion responsable des déchets de chantier"
      ]
    },
    {
      title: "Social (S)",
      icon: Users,
      color: "blue",
      items: [
        "Logements sains : VMC performante pour éviter l'humidité",
        "Réduction des charges locatives grâce à l'efficacité énergétique",
        "Confort thermique été comme hiver",
        "Partenariats avec entreprises locales",
        "Installation de bornes de recharge véhicules électriques"
      ]
    },
    {
      title: "Gouvernance (G)",
      icon: ShieldCheck,
      color: "slate",
      items: [
        "Rapport annuel sur l'évolution du DPE moyen du parc",
        "Transparence totale avec les investisseurs",
        "Budgets de travaux maîtrisés et prévisibles",
        "Respect des réglementations thermiques",
        "Audit énergétique systématique avant acquisition"
      ]
    }
  ];

  const certifications = [
    { name: "BBC Effinergie", desc: "Bâtiment Basse Consommation" },
    { name: "HPE Rénovation", desc: "Haute Performance Énergétique" },
    { name: "Label E+C-", desc: "Énergie Positive & Réduction Carbone" }
  ];

  const trajectoire = [
    { year: "2026", objectif: "50%", desc: "Parc hors E/F/G" },
    { year: "2027", objectif: "100%", desc: "Parc hors E/F/G" },
    { year: "2028", objectif: "80%", desc: "Actifs DPE C ou mieux" },
    { year: "2030", objectif: "95%", desc: "Actifs DPE C ou mieux" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-[#1A3A52] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
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
                Stratégie ESG
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Valorisation Patrimoniale Durable
            </h1>
            <p className="text-xl text-white/80">
              Transformer des passoires thermiques en actifs sains et louables sur les 20 prochaines années, 
              sans risque réglementaire. Notre approche privilégie la pérennité patrimoniale plutôt que 
              la quête d'objectifs difficilement atteignables.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                Une stratégie ciblée et cohérente
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Notre démarche de rénovation énergétique vise à transformer des passoires thermiques (F/G) 
                en actifs performants et durables. L'objectif principal est d'atteindre <strong>un DPE C minimum</strong>, 
                garantissant la conformité réglementaire et la louabilité pérenne.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Lorsque les conditions techniques et la configuration des bâtiments le permettent, nous visons 
                des performances supérieures avec un <strong>DPE B, voire A</strong>. Cette approche flexible 
                répond à un triple enjeu : <strong>conformité réglementaire</strong>, <strong>confort des occupants</strong> 
                et <strong>valorisation patrimoniale durable</strong>.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Chaque projet fait l'objet d'un audit énergétique approfondi permettant de définir le niveau 
                de performance optimal en fonction des caractéristiques du bâtiment et du marché local. 
                L'objectif est de maximiser la création de valeur tout en assurant une exécution maîtrisée.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                alt="Immeuble durable"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#C9A961]/20 rounded-2xl flex items-center justify-center">
                    <Leaf className="h-8 w-8 text-[#C9A961]" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#1A3A52]">-40%</p>
                    <p className="text-slate-600 text-sm">Économies d'énergie</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
              Nos engagements concrets
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Des objectifs mesurables et ambitieux pour transformer notre parc immobilier 
              en référence de la rénovation durable.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {engagements.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
              >
                <div className="w-14 h-14 bg-[#C9A961]/20 rounded-2xl flex items-center justify-center mb-4">
                  <item.icon className="h-7 w-7 text-[#C9A961]" />
                </div>
                <h3 className="font-semibold text-[#1A3A52] mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{item.description}</p>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-2xl font-bold text-[#C9A961]">{item.metric}</p>
                  <p className="text-xs text-slate-500">{item.metricLabel}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Piliers ESG */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
              Les 3 piliers de notre démarche ESG
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {piliers.map((pilier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl p-8 bg-white border border-slate-200"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-[#C9A961]/20">
                  <pilier.icon className="h-7 w-7 text-[#C9A961]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1A3A52] mb-4">{pilier.title}</h3>
                <ul className="space-y-3">
                  {pilier.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-[#C9A961]" />
                      <span className="text-slate-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trajectoire */}
      <section className="py-24 bg-[#1A3A52]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Notre trajectoire de valorisation
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Un plan d'action réaliste et mesurable pour transformer l'intégralité de notre parc 
              en actifs conformes et pérennes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {trajectoire.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20"
              >
                <p className="text-[#C9A961] font-medium mb-2">{item.year}</p>
                <p className="text-4xl font-bold text-white mb-2">{item.objectif}</p>
                <p className="text-white/70 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Travaux types */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
              Nos interventions techniques
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Un programme de réhabilitation complet pour atteindre les meilleurs standards 
              de performance énergétique.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-6">
              <Thermometer className="h-10 w-10 text-[#C9A961] mb-4" />
              <h3 className="font-semibold text-[#1A3A52] mb-3">Isolation thermique</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Isolation systématique des combles et planchers bas</li>
                <li>• Menuiseries double vitrage performantes</li>
                <li>• ITE si nécessaire selon diagnostic</li>
                <li>• Traitement des ponts thermiques critiques</li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6">
              <Zap className="h-10 w-10 text-[#C9A961] mb-4" />
              <h3 className="font-semibold text-[#1A3A52] mb-3">Systèmes énergétiques</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Remplacement fioul/gaz par PAC air-eau</li>
                <li>• Raccordement réseau chaleur urbain si disponible</li>
                <li>• VMC performante (simple ou double flux)</li>
                <li>• Régulation et programmation optimisées</li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6">
              <Sun className="h-10 w-10 text-[#C9A961] mb-4" />
              <h3 className="font-semibold text-[#1A3A52] mb-3">Compléments & services</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Bornes de recharge véhicules électriques (image premium)</li>
                <li>• Mousseurs et chasses d'eau double flux</li>
                <li>• Éclairage LED dans les parties communes</li>
                <li>• Matériaux à faible impact privilégiés (laine de roche, métisse)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#C9A961]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-[#1A3A52] mb-4">
            Investir aux côtés de La Foncière Patrimoniale
          </h2>
          <p className="text-[#1A3A52]/80 mb-8">
            Participez à une approche patrimoniale intégrant les enjeux de durabilité 
            au sein d'une stratégie structurée.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={createPageUrl("Contact")}>
              <Button className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white px-8 py-6 font-semibold">
                Entrer en relation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to={createPageUrl("Realisations")}>
              <Button variant="outline" className="border-[#1A3A52]/30 text-[#1A3A52] hover:bg-[#1A3A52]/10 px-8 py-6 font-semibold">
                Voir nos réalisations
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}