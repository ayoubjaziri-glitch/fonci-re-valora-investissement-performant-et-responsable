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
  ArrowRight
} from 'lucide-react';
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
      title: "Associé Investisseur",
      ticket: "15 000 €",
      description: "Valorisation du capital avec TRI cible >10%"
    },
    {
      id: "obligation",
      title: "Obligation",
      ticket: "10 000 €",
      description: "Taux fixe garanti, sécurisé et prioritaire"
    },
    {
      id: "actif",
      title: "Associé Actif",
      ticket: "10 000 €",
      description: "Rôle opérationnel + work for equity"
    }
  ];

  const steps = [
    { number: "1", title: "Prise de contact", desc: "Échange avec les fondateurs" },
    { number: "2", title: "Questions / Réponses", desc: "Compréhension du modèle" },
    { number: "3", title: "Souscription", desc: "Signature électronique" },
    { number: "4", title: "Intégration", desc: "Accès plateforme" },
    { number: "5", title: "Création de valeur", desc: "Participation active" }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <div className="w-20 h-20 bg-[#C9A961] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-[#1E3A5F]" />
          </div>
          <h2 className="text-2xl font-serif text-[#1E3A5F] mb-4">Message envoyé !</h2>
          <p className="text-gray-600 mb-6">
            Merci pour votre intérêt. Notre équipe vous contactera dans les plus brefs délais.
          </p>
          <Button 
            onClick={() => setSubmitted(false)}
            className="bg-[#1E3A5F] hover:bg-[#2A4A6F] text-white"
          >
            Envoyer un autre message
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-[#1E3A5F] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 border border-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
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
                Contact
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Devenir associé
            </h1>
            <p className="text-xl text-white/70">
              Rejoignez une communauté d'associés alignés et contribuez à la création de valeur patrimoniale durable.
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
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-serif text-[#1E3A5F] mb-8">
                  Contactez-nous
                </h2>

                <div className="space-y-6 mb-12">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#C9A961]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-[#C9A961]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E3A5F]">Email</p>
                      <a href="mailto:contact@fonciere-patrimoniale.fr" className="text-gray-600 hover:text-[#C9A961] transition-colors">
                        contact@fonciere-patrimoniale.fr
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#C9A961]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-[#C9A961]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E3A5F]">Téléphone</p>
                      <a href="tel:+33758736580" className="text-gray-600 hover:text-[#C9A961] transition-colors">
                        +33 (0)7 58 73 65 80
                      </a>
                    </div>
                  </div>
                </div>

                {/* Investment Options */}
                <div className="bg-[#F8F9FA] rounded-2xl p-6">
                  <h3 className="font-semibold text-[#1E3A5F] mb-4">Options d'investissement</h3>
                  <div className="space-y-3">
                    {investmentOptions.map((option) => (
                      <div key={option.id} className="bg-white rounded-xl p-4 border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-[#1E3A5F]">{option.title}</span>
                          <span className="text-[#C9A961] font-semibold">{option.ticket}</span>
                        </div>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-serif text-[#1E3A5F] mb-6">Formulaire de contact</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Type d'investissement souhaité</Label>
                    <RadioGroup
                      value={formData.investmentType}
                      onValueChange={(value) => setFormData({...formData, investmentType: value})}
                      className="grid md:grid-cols-3 gap-3"
                    >
                      {investmentOptions.map((option) => (
                        <div key={option.id} className="relative">
                          <RadioGroupItem
                            value={option.id}
                            id={option.id}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={option.id}
                            className="flex flex-col p-4 border rounded-xl cursor-pointer transition-all peer-data-[state=checked]:border-[#C9A961] peer-data-[state=checked]:bg-[#C9A961]/5 hover:border-[#C9A961]/50"
                          >
                            <span className="font-semibold text-[#1E3A5F] text-sm">{option.title}</span>
                            <span className="text-[#C9A961] text-sm">{option.ticket}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="amount">Montant envisagé (€)</Label>
                    <Input
                      id="amount"
                      type="text"
                      placeholder="Ex: 25 000 €"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      placeholder="Décrivez votre projet d'investissement..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#C9A961] hover:bg-[#B8994F] text-[#1E3A5F] py-6 text-base font-semibold"
                  >
                    Envoyer ma demande
                    <Send className="ml-2 h-5 w-5" />
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe.
                  </p>
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
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[#1E3A5F] mb-4">
              Votre parcours vers la création de valeur
            </h2>
            <p className="text-gray-600">
              Un parcours en 5 étapes pour devenir associé et participer activement à la croissance
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm min-w-[160px] text-center border border-gray-100">
                  <div className="w-10 h-10 bg-[#C9A961] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#1E3A5F] font-bold">{step.number}</span>
                  </div>
                  <h4 className="font-semibold text-[#1E3A5F] mb-1">{step.title}</h4>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-[#C9A961] hidden md:block" />
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-[#C9A961] rounded-2xl p-6 text-center"
          >
            <p className="text-[#1E3A5F] font-medium">
              Horizon d'investissement recommandé : <strong>5 ans</strong>. Possibilité de rachat dès la deuxième année.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs text-gray-500">
            AVERTISSEMENT : Avant toute souscription, chaque associé doit prendre connaissance des statuts et du Pacte d'Associés. 
            Ce document est à caractère promotionnel et ne constitue pas un conseil en investissement.
          </p>
        </div>
      </section>
    </div>
  );
}