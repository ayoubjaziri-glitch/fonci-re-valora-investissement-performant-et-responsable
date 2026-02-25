import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Building2,
  Users,
  Briefcase,
  ArrowRight,
  Clock } from
'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    investmentType: 'investisseur',
    amount: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation d'envoi
    setSubmitted(true);
  };

  const investmentOptions = [
  {
    id: "investisseur",
    title: "Associé Investisseur"
  },
  {
    id: "obligataire",
    title: "Obligataire"
  },
  {
    id: "actif",
    title: "Associé Actif"
  },
  {
    id: "partenariat",
    title: "Partenariat"
  },
  {
    id: "autre",
    title: "Autre"
  }];


  const steps = [
  { number: "1", title: "Prise de contact", desc: "Échange avec les fondateurs" },
  { number: "2", title: "Questions / Réponses", desc: "Compréhension du modèle" },
  { number: "3", title: "Souscription", desc: "Signature électronique" },
  { number: "4", title: "Intégration", desc: "Accès plateforme" },
  { number: "5", title: "Création de valeur", desc: "Participation active" }];


  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto">

          <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-100">
            <div className="w-20 h-20 bg-gradient-to-br from-[#C9A961] to-[#B8994F] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-serif text-[#1A3A52] mb-4 text-center">Votre demande a été transmise avec succès</h2>
            <p className="text-slate-600 mb-8 text-center leading-relaxed">
              Merci de l'intérêt que vous portez à La Foncière Patrimoniale. Notre équipe étudiera votre demande 
              et vous contactera dans les prochains jours pour échanger sur votre projet d'investissement.
            </p>
            
            <div className="bg-[#F8F9FA] rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-[#1A3A52] mb-4 text-center">Prochaines étapes</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#C9A961] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <p className="text-sm text-slate-600">Étude de votre profil par notre équipe</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#C9A961] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <p className="text-sm text-slate-600">Prise de contact sous 48h ouvrées</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#C9A961] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <p className="text-sm text-slate-600">Échange détaillé sur votre projet</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="border-[#1A3A52] text-[#1A3A52] hover:bg-[#1A3A52] hover:text-white font-semibold">

                Envoyer un nouveau message
              </Button>
            </div>
          </div>
        </motion.div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-[#1A3A52] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 border border-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                Contact
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Échanger avec la foncière
            </h1>
            <p className="text-xl text-white/70">
              Prenez contact avec notre équipe pour découvrir notre stratégie d'investissement structuré.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Left Column - Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}>

                <h2 className="text-2xl font-serif text-[#1E3A5F] mb-8">
                  Contactez-nous
                </h2>

                <div className="space-y-6 mb-12">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#C9A961]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-[#C9A961]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A3A52]">Email</p>
                      <a href="mailto:ayoubjaziri@gmail.com" className="text-gray-600 hover:text-[#C9A961] transition-colors">
                        ayoubjaziri@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#C9A961]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-[#C9A961]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A3A52]">Téléphone</p>
                      <a href="tel:+33758736580" className="text-gray-600 hover:text-[#C9A961] transition-colors">
                        +33 7 58 73 65 80
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#C9A961]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-[#C9A961]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A3A52]">Adresse</p>
                      <p className="text-gray-600">16 Rue de la Laure<br />03200 Vichy</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#C9A961]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-[#C9A961]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A3A52]">Horaires d'ouverture</p>
                      <p className="text-gray-600">Lundi - Vendredi : 9h - 18h<br />Samedi : 10h - 15h</p>
                    </div>
                  </div>
                </div>

                {/* Réseaux sociaux */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <p className="font-semibold text-[#1A3A52] mb-4">Suivez-nous :</p>
                  <div className="flex items-center gap-3">
                    <a 
                      href="https://www.linkedin.com/company/la-fonciere-patrimoniale" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-[#C9A961]/10 hover:bg-[#C9A961] rounded-xl flex items-center justify-center transition-colors group"
                    >
                      <svg className="w-6 h-6 text-[#C9A961] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://www.instagram.com/lafoncierepatrimoniale" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-[#C9A961]/10 hover:bg-[#C9A961] rounded-xl flex items-center justify-center transition-colors group"
                    >
                      <svg className="w-6 h-6 text-[#C9A961] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  </div>
                </div>

              </motion.div>
            </div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3">

              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-serif text-[#1A3A52] mb-6">Entrer en relation</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="mt-1"
                        required />

                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="mt-1"
                        required />

                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1"
                        required />

                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-1" />

                    </div>
                  </div>

                  <div>
                    <Label htmlFor="investmentType">Type de contact souhaité</Label>
                    <select
                      id="investmentType"
                      value={formData.investmentType}
                      onChange={(e) => setFormData({ ...formData, investmentType: e.target.value })}
                      className="w-full mt-2 px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#C9A961] focus:border-transparent">

                      {investmentOptions.map((option) =>
                      <option key={option.id} value={option.id}>
                          {option.title}
                        </option>
                      )}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Message</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      placeholder="Décrivez votre demande..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="mt-1"
                      required />

                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] py-6 text-base font-semibold">

                    Prendre contact
                    <Send className="ml-2 h-5 w-5" />
                  </Button>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <strong>Le formulaire présent sur ce site vise uniquement à faciliter une mise en relation avec les personnes souhaitant en savoir davantage.</strong> Les échanges s'inscrivent ensuite dans un cadre confidentiel et personnalisé, adapté à chaque situation.
                    </p>
                    


                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">

            <h2 className="text-3xl md:text-4xl font-serif text-[#1E3A5F] mb-4">
              Votre parcours vers la création de valeur
            </h2>
            <p className="text-gray-600">
              Un parcours en 5 étapes pour devenir associé et participer activement à la croissance
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {steps.map((step, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4">

                <div className="bg-white rounded-2xl p-6 shadow-sm min-w-[160px] text-center border border-gray-100">
                  <div className="w-10 h-10 bg-[#C9A961] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#1E3A5F] font-bold">{step.number}</span>
                  </div>
                  <h4 className="font-semibold text-[#1E3A5F] mb-1">{step.title}</h4>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
                {index < steps.length - 1 &&
              <ArrowRight className="h-5 w-5 text-[#C9A961] hidden md:block" />
              }
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-[#C9A961] rounded-2xl p-6 text-center">

            <p className="text-[#1A3A52] font-medium text-sm">
              Ce formulaire a pour seul objet de permettre une prise de contact à l'initiative des personnes intéressées 
              et ne constitue pas une offre de titres financiers. La souscription éventuelle n'interviendra qu'après des échanges privés 
              et la transmission de la documentation complète (statuts, pacte d'associés).
            </p>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs text-gray-500">AVERTISSEMENT : Avant toute souscription, chaque associé doit prendre connaissance des statuts et du Pacte d'Associés. Ce site est à caractère promotionnel et ne constitue pas un conseil en investissement.


          </p>
        </div>
      </section>
    </div>);

}