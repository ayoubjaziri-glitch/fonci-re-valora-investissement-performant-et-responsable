import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { CheckCircle2, Quote, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Affiche les sections dynamiques pour une page et une plage d'ordre donnée.
 * minOrdre (inclus) et maxOrdre (exclus) permettent d'insérer les sections
 * au bon endroit dans la page selon leur numéro d'ordre.
 */
export default function DynamicSections({ page, minOrdre = 0, maxOrdre = Infinity }) {
  const { data: allSections = [] } = useQuery({
    queryKey: ['site-sections'],
    queryFn: () => db.SiteSection.list('ordre', 200),
    staleTime: 30000,
  });

  const sections = allSections
    .filter(s => s.page === page && s.actif !== false && s.ordre >= minOrdre && s.ordre < maxOrdre)
    .sort((a, b) => a.ordre - b.ordre);

  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section, i) => (
        <SectionRenderer key={section.id} section={section} index={i} />
      ))}
    </>
  );
}

function SectionRenderer({ section, index }) {
  const { type_section, titre, sous_titre, contenu, image_url } = section;
  const delay = (index % 3) * 0.1;

  const lignes = contenu ? contenu.split('\n').filter(l => l.trim()) : [];

  switch (type_section) {
    case 'texte':
      return (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay }}
              className="max-w-3xl mx-auto text-center"
            >
              {sous_titre && (
                <div className="flex items-center justify-center gap-3 mb-5">
                  <div className="w-10 h-0.5 bg-[#C9A961]" />
                  <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">{sous_titre}</span>
                  <div className="w-10 h-0.5 bg-[#C9A961]" />
                </div>
              )}
              {titre && <h2 className="text-3xl md:text-4xl font-serif text-[#1A3A52] mb-6">{titre}</h2>}
              {contenu && (
                <div className="text-slate-600 leading-relaxed space-y-3">
                  {lignes.map((l, i) => <p key={i}>{l}</p>)}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      );

    case 'texte_image':
      return (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay }}
              >
                {sous_titre && (
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-0.5 bg-[#C9A961]" />
                    <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">{sous_titre}</span>
                  </div>
                )}
                {titre && <h2 className="text-3xl md:text-4xl font-serif text-[#1A3A52] mb-5">{titre}</h2>}
                {contenu && (
                  <div className="text-slate-600 leading-relaxed space-y-3">
                    {lignes.map((l, i) => <p key={i}>{l}</p>)}
                  </div>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay }}
              >
                {image_url ? (
                  <img src={image_url} alt={titre} className="rounded-3xl shadow-2xl w-full h-80 object-cover" />
                ) : (
                  <div className="rounded-3xl bg-gradient-to-br from-[#1A3A52] to-[#2A4A6F] w-full h-80 flex items-center justify-center">
                    <div className="w-16 h-1 bg-[#C9A961]" />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      );

    case 'chiffres': {
      const chiffres = lignes.map(l => {
        const parts = l.split('|');
        return { valeur: parts[0]?.trim(), libelle: parts[1]?.trim() || '' };
      }).filter(c => c.valeur);

      return (
        <section className="py-16 bg-slate-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {(titre || sous_titre) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                {sous_titre && <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">{sous_titre}</span>}
                {titre && <h2 className="text-3xl md:text-4xl font-serif text-white mt-2">{titre}</h2>}
              </motion.div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {chiffres.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
                >
                  <p className="text-3xl font-bold text-[#C9A961] mb-1">{c.valeur}</p>
                  <p className="text-sm text-white/60">{c.libelle}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'cta':
      return (
        <section className="py-12 bg-[#C9A961]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {titre && <h2 className="text-2xl md:text-3xl font-serif text-[#1A3A52] mb-3">{titre}</h2>}
              {sous_titre && <p className="text-[#1A3A52]/80 mb-6 text-base">{sous_titre}</p>}
              {contenu && <p className="text-[#1A3A52]/70 mb-6">{contenu}</p>}
              <Link to={createPageUrl('Contact')}>
                <Button className="bg-[#1A3A52] text-white hover:bg-[#2A4A6F] px-8 py-6 text-base font-semibold">
                  Entrer en relation <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      );

    case 'temoignage':
      return (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 rounded-3xl p-10 relative"
            >
              <Quote className="h-12 w-12 text-[#C9A961]/20 absolute top-6 right-8" />
              {contenu && <p className="text-slate-700 text-lg leading-relaxed italic mb-6">"{contenu}"</p>}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#1A3A52] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C9A961] font-bold text-lg">{titre?.charAt(0) || 'A'}</span>
                </div>
                <div>
                  {titre && <p className="font-semibold text-[#1A3A52] text-lg">{titre}</p>}
                  {sous_titre && <p className="text-slate-500 text-sm">{sous_titre}</p>}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      );

    case 'liste':
      return (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {sous_titre && (
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-0.5 bg-[#C9A961]" />
                  <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">{sous_titre}</span>
                </div>
              )}
              {titre && <h2 className="text-3xl md:text-4xl font-serif text-[#1A3A52] mb-8">{titre}</h2>}
              <ul className="space-y-4">
                {lignes.map((l, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl"
                  >
                    <CheckCircle2 className="h-5 w-5 text-[#C9A961] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{l.replace(/^[-•*]\s*/, '')}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>
      );

    default:
      return null;
  }
}