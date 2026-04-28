import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/supabaseClient';
import { createPageUrl } from '../utils';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';

export default function InvestirDansFonciere() {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['blog-articles'],
    queryFn: () => db.ArticleBlog.filter({ publie: true }),
  });

  const article = articles.find(a => a.slug === 'investissement-immobilier-2026-guide-fonciere-valora');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9A961] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-600">Article non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#1A3A52] to-[#2A4A6F]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-[#C9A961]" />
              <span className="text-[#C9A961] font-medium tracking-wider uppercase text-sm">
                Article Blog
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
              {article.titre}
            </h1>
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              {article.extrait}
            </p>
            <div className="flex items-center gap-4 text-white/70 text-sm">
              <span>{new Date(article.date_publication).toLocaleDateString('fr-FR')}</span>
              <span>•</span>
              <span>{article.temps_lecture}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className="py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="prose prose-lg max-w-none mb-16">
            <ReactMarkdown
              components={{
                h2: ({node, ...props}) => <h2 className="text-4xl font-serif text-[#1A3A52] mb-8 mt-12" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-2xl font-serif text-[#1A3A52] mb-6 mt-10" {...props} />,
                p: ({node, ...props}) => <p className="text-lg text-slate-700 leading-relaxed mb-6" {...props} />,
                ul: ({node, ...props}) => <ul className="space-y-3 mb-8 list-disc list-inside" {...props} />,
                li: ({node, ...props}) => <li className="text-slate-700" {...props} />,
                strong: ({node, ...props}) => <strong className="text-[#1A3A52] font-semibold" {...props} />,
                code: ({node, inline, ...props}) => inline ? 
                  <code className="bg-[#C9A961]/10 text-[#C9A961] px-2 py-1 rounded" {...props} /> :
                  <code className="bg-slate-100 p-4 rounded block mb-6" {...props} />,
              }}
            >
              {article.contenu}
            </ReactMarkdown>
          </div>

          {/* CTA */}
          <section className="my-16">
            <div className="bg-gradient-to-r from-[#1A3A52] to-[#2A4A6F] rounded-3xl p-12 text-center">
              <h3 className="text-3xl font-serif text-white mb-4">
                Prêt à investir dans l'immobilier résidentiel structuré ?
              </h3>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                Découvrez notre stratégie d'investissement et comment devenir associé de La Foncière Patrimoniale.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to={createPageUrl("Contact")}>
                  <Button className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold px-8 py-6 text-lg">
                    Prendre Contact
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to={createPageUrl("StrategyPerformance")}>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#1A3A52] font-semibold px-8 py-6 text-lg">
                    Notre Stratégie
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </article>

      {/* Footer CTA */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-600">
            <strong>Avertissement :</strong> Tout investissement immobilier comporte des risques de perte en capital. 
            Les performances passées ne préjugent pas des performances futures. Ce contenu est fourni à titre informatif 
            uniquement et ne constitue pas un conseil en investissement.
          </p>
        </div>
      </section>
    </div>
  );
}