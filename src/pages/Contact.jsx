import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useToast } from "@/components/ui/use-toast";
import {
  Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight, Clock, Loader2 } from
'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const investmentOptions = [
{ id: "information", title: "Demande d'informations" },
{ id: "investisseur", title: "Associé Investisseur" },
{ id: "obligataire", title: "Obligataire" },
{ id: "operationnel", title: "Associé Opérationnel" },
{ id: "partenariat", title: "Partenariat" },
{ id: "autre", title: "Autre" }];


const steps = [
{ number: "1", title: "Prise de contact", desc: "Échange avec les fondateurs" },
{ number: "2", title: "Questions / Réponses", desc: "Compréhension du modèle" },
{ number: "3", title: "Souscription", desc: "Signature électronique" },
{ number: "4", title: "Intégration", desc: "Accès plateforme" },
{ number: "5", title: "Création de valeur", desc: "Participation active" }];


export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    investmentType: 'information',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    const typeLabel = investmentOptions.find((o) => o.id === formData.investmentType)?.title || formData.investmentType;
    const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

    // 1. Sauvegarder la demande en base de données
    await base44.entities.ContactRequest.create({
      prenom: formData.firstName,
      nom: formData.lastName,
      email: formData.email,
      telephone: formData.phone || '',
      type_demande: typeLabel,
      message: formData.message
    });

    // 2. Récupérer les destinataires configurés
    let destinataires = ['Ayoubcontact33@gmail.com', 'Ayoubjaziri@gmail.com'];
    try {
      const configs = await base44.entities.ContactConfig.filter({ cle: 'email_destinataires' });
      if (configs && configs.length > 0 && configs[0].valeur) {
        destinataires = configs[0].valeur.split(',').map(e => e.trim()).filter(Boolean);
      }
    } catch (e) { /* fallback */ }

    // 3. Envoyer l'email de notification à tous les destinataires
    const emailBody = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#1A3A52;padding:32px 40px;text-align:center;">
            <h1 style="color:#C9A961;font-size:22px;margin:0;font-weight:bold;letter-spacing:1px;">LA FONCIÈRE VALORA</h1>
            <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:8px 0 0;">Nouvelle demande de contact reçue</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 0;text-align:center;">
            <span style="background:#C9A961;color:#1A3A52;font-weight:bold;font-size:13px;padding:6px 20px;border-radius:20px;display:inline-block;">${typeLabel}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 40px 0;">
            <h2 style="color:#1A3A52;font-size:16px;margin:0 0 16px;border-bottom:2px solid #C9A961;padding-bottom:10px;">Coordonnées du contact</h2>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:8px 0;width:40%;"><span style="color:#888;font-size:13px;">👤 Prénom &amp; Nom</span></td>
                <td style="padding:8px 0;"><strong style="color:#1A3A52;font-size:14px;">${formData.firstName} ${formData.lastName}</strong></td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding:8px 12px;border-radius:6px;"><span style="color:#888;font-size:13px;">✉️ Email</span></td>
                <td style="padding:8px 12px;"><a href="mailto:${formData.email}" style="color:#C9A961;font-size:14px;text-decoration:none;font-weight:bold;">${formData.email}</a></td>
              </tr>
              <tr>
                <td style="padding:8px 0;"><span style="color:#888;font-size:13px;">📞 Téléphone</span></td>
                <td style="padding:8px 0;"><strong style="color:#1A3A52;font-size:14px;">${formData.phone || 'Non renseigné'}</strong></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 40px 0;">
            <h2 style="color:#1A3A52;font-size:16px;margin:0 0 12px;border-bottom:2px solid #C9A961;padding-bottom:10px;">Message</h2>
            <div style="background:#f8f6f1;border-left:4px solid #C9A961;border-radius:6px;padding:20px;color:#333;font-size:14px;line-height:1.7;">
              ${formData.message.replace(/\n/g, '<br>')}
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 40px;text-align:center;">
            <a href="mailto:${formData.email}?subject=Re: ${typeLabel} - La Foncière Valora" style="background:#C9A961;color:#1A3A52;font-weight:bold;font-size:14px;padding:14px 32px;border-radius:8px;text-decoration:none;display:inline-block;">
              ↩ Répondre à ${formData.firstName}
            </a>
          </td>
        </tr>
        <tr>
          <td style="background:#f4f4f4;padding:20px 40px;text-align:center;border-top:1px solid #e0e0e0;">
            <p style="color:#aaa;font-size:12px;margin:0;">Reçu le ${dateStr} via lafoncierepatrimoniale.com</p>
            <p style="color:#aaa;font-size:11px;margin:6px 0 0;">16 Rue de la Laure, 03200 Vichy — La Foncière Valora</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      await Promise.all(
        destinataires.map(to =>
          base44.integrations.Core.SendEmail({
            to,
            subject: `📩 Nouvelle demande - ${typeLabel} | La Foncière Valora`,
            body: emailBody,
          })
        )
      );
    } catch (err) {
      console.error('Email send error:', err);
    }

    setSending(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto w-full">
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-100 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#C9A961] to-[#B8994F] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-serif text-[#1A3A52] mb-4">Votre demande a été transmise</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Merci pour votre intérêt. Notre équipe étudiera votre demande et vous contactera dans les prochains jours.
            </p>
            <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-[#1A3A52] mb-4">Prochaines étapes</h3>
              <div className="space-y-3">
                {["Étude de votre profil par notre équipe", "Prise de contact sous 48h ouvrées", "Échange détaillé sur votre projet"].map((step, i) =>
                <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-[#C9A961] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                    <p className="text-sm text-slate-600">{step}</p>
                  </div>
                )}
              </div>
            </div>
            <Button onClick={() => setSubmitted(false)} variant="outline" className="border-[#1A3A52] text-[#1A3A52] hover:bg-[#1A3A52] hover:text-white font-semibold">
              Envoyer un nouveau message
            </Button>
          </div>
        </motion.div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-[#1A3A52] overflow-hidden">
        <div className="bg-slate-900 absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A961]/5 rounded-full transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full transform -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">Contact</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">Échanger avec la foncière</h1>
            <p className="text-xl text-white/70">Prenez contact avec notre équipe pour découvrir notre stratégie d'investissement structuré.</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Left Column - Info */}
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-slate-900 mb-8 text-2xl font-serif">Nous contacter</h2>
                <div className="space-y-5 mb-10">
                  {[
                  { icon: Mail, label: 'Email', content: <a href="mailto:ayoubjaziri@gmail.com" className="text-slate-600 hover:text-[#C9A961] transition-colors">ayoubjaziri@gmail.com</a> },
                  { icon: Phone, label: 'Téléphone', content: <a href="tel:+33758736580" className="text-slate-600 hover:text-[#C9A961] transition-colors">+33 7 58 73 65 80</a> },
                  { icon: MapPin, label: 'Adresse', content: <p className="text-slate-600">16 Rue de la Laure<br />03200 Vichy</p> },
                  { icon: Clock, label: 'Horaires', content: <p className="text-slate-600">Lun – Ven : 9h – 18h<br />Sam : 10h – 15h</p> }].
                  map(({ icon: Icon, label, content }) =>
                  <div key={label} className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-[#C9A961]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-[#C9A961]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A3A52] text-sm mb-0.5">{label}</p>
                        {content}
                      </div>
                    </div>
                  )}
                </div>

                {/* Réseaux sociaux */}
                <div className="pt-6 border-t border-slate-200">
                  <p className="font-semibold text-[#1A3A52] text-sm mb-4">Suivez-nous</p>
                  <div className="flex items-center gap-3">
                    <a href="https://www.linkedin.com/company/la-fonciere-patrimoniale" target="_blank" rel="noopener noreferrer"
                    className="w-11 h-11 bg-[#C9A961]/10 hover:bg-[#C9A961] rounded-xl flex items-center justify-center transition-colors group">
                      <svg className="w-5 h-5 text-[#C9A961] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/lafoncierepatrimoniale" target="_blank" rel="noopener noreferrer"
                    className="w-11 h-11 bg-[#C9A961]/10 hover:bg-[#C9A961] rounded-xl flex items-center justify-center transition-colors group">
                      <svg className="w-5 h-5 text-[#C9A961] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Bloc confiance */}
                <div className="bg-slate-900 mt-8 p-6 rounded-2xl">
                  <p className="text-[#C9A961] font-semibold text-sm mb-2">Réponse garantie sous 48h</p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Chaque demande est traitée personnellement par les fondateurs. Confidentialité et discrétion assurées.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-3">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
                {/* Form header */}
                <div className="bg-slate-900 px-8 py-6 from-[#1A3A52] to-[#2A4A6F]">
                  <h3 className="text-xl font-serif text-white">Entrer en relation</h3>
                  <p className="text-white/60 text-sm mt-1">Remplissez ce formulaire, nous vous répondons rapidement.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-slate-700 font-medium text-sm">Prénom <span className="text-red-400">*</span></Label>
                      <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="mt-1.5 border-slate-200 focus:border-[#C9A961] focus:ring-[#C9A961]" placeholder="Votre prénom" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-slate-700 font-medium text-sm">Nom <span className="text-red-400">*</span></Label>
                      <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="mt-1.5 border-slate-200 focus:border-[#C9A961] focus:ring-[#C9A961]" placeholder="Votre nom" required />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-slate-700 font-medium text-sm">Email <span className="text-red-400">*</span></Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1.5 border-slate-200 focus:border-[#C9A961] focus:ring-[#C9A961]" placeholder="vous@email.com" required />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-slate-700 font-medium text-sm">Téléphone</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1.5 border-slate-200 focus:border-[#C9A961] focus:ring-[#C9A961]" placeholder="+33 6 00 00 00 00" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="investmentType" className="text-slate-700 font-medium text-sm">Objet de votre demande <span className="text-red-400">*</span></Label>
                    <select id="investmentType" value={formData.investmentType}
                    onChange={(e) => setFormData({ ...formData, investmentType: e.target.value })}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9A961] focus:border-transparent text-slate-800 bg-white text-sm">
                      {investmentOptions.map((option) =>
                      <option key={option.id} value={option.id}>{option.title}</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-slate-700 font-medium text-sm">Message <span className="text-red-400">*</span></Label>
                    <Textarea id="message" rows={5} placeholder="Décrivez votre projet, vos attentes ou vos questions..." value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-1.5 border-slate-200 focus:border-[#C9A961] focus:ring-[#C9A961] resize-none" required />
                  </div>

                  <Button type="submit" disabled={sending}
                  className="w-full bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] py-6 text-base font-semibold rounded-xl transition-all duration-300 hover:shadow-lg">
                    {sending ?
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Envoi en cours...</> :

                    <><Send className="mr-2 h-5 w-5" /> Envoyer ma demande</>
                    }
                  </Button>

                  <p className="text-xs text-slate-500 text-center leading-relaxed">
                    Ce formulaire facilite une mise en relation et ne constitue pas une offre de titres financiers.
                    Vos données sont traitées de manière confidentielle.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-slate-900 mb-4 text-3xl font-serif md:text-4xl">Votre parcours vers la création de valeur</h2>
            <p className="text-slate-600">Un parcours en 5 étapes pour devenir associé et participer activement à la croissance</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {steps.map((step, index) =>
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: index * 0.1 }} className="flex items-center gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm min-w-[150px] text-center border border-slate-100">
                  <div className="w-10 h-10 bg-[#C9A961] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#1A3A52] font-bold text-sm">{step.number}</span>
                  </div>
                  <h4 className="font-semibold text-[#1A3A52] mb-1 text-sm">{step.title}</h4>
                  <p className="text-xs text-slate-500">{step.desc}</p>
                </div>
                {index < steps.length - 1 && <ArrowRight className="h-5 w-5 text-[#C9A961] hidden md:block flex-shrink-0" />}
              </motion.div>
            )}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-12 bg-[#C9A961] rounded-2xl p-6 text-center">
            <p className="text-[#1A3A52] font-medium text-sm">
              Ce formulaire a pour seul objet de permettre une prise de contact à l'initiative des personnes intéressées
              et ne constitue pas une offre de titres financiers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-6 bg-slate-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs text-slate-500">AVERTISSEMENT : Avant toute souscription, chaque associé doit prendre connaissance des statuts et du Pacte d'Associés. Ce site est à caractère promotionnel et ne constitue pas un conseil en investissement.</p>
        </div>
      </section>
    </div>);

}