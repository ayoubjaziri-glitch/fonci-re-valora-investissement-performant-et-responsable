import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2 } from 'lucide-react';

const SQL = `-- Colonnes manquantes table investisseurs_crm
ALTER TABLE investisseurs_crm ADD COLUMN IF NOT EXISTS societe TEXT;
ALTER TABLE investisseurs_crm ADD COLUMN IF NOT EXISTS ville TEXT;
ALTER TABLE investisseurs_crm ADD COLUMN IF NOT EXISTS pays TEXT DEFAULT 'France';
ALTER TABLE investisseurs_crm ADD COLUMN IF NOT EXISTS profil_investisseur TEXT;
ALTER TABLE investisseurs_crm ADD COLUMN IF NOT EXISTS capacite_investissement TEXT;
ALTER TABLE investisseurs_crm ADD COLUMN IF NOT EXISTS ticket_vise TEXT;
ALTER TABLE investisseurs_crm ADD COLUMN IF NOT EXISTS montant_investi NUMERIC DEFAULT 0;
ALTER TABLE investisseurs_crm ADD COLUMN IF NOT EXISTS nb_parts NUMERIC DEFAULT 0;
ALTER TABLE investisseurs_crm ADD COLUMN IF NOT EXISTS date_entree DATE;
ALTER TABLE investisseurs_crm ADD COLUMN IF NOT EXISTS date_prochain_contact DATE;
ALTER TABLE investisseurs_crm ADD COLUMN IF NOT EXISTS responsable_suivi TEXT;
ALTER TABLE investisseurs_crm ADD COLUMN IF NOT EXISTS horizon_placement TEXT;
ALTER TABLE investisseurs_crm ADD COLUMN IF NOT EXISTS tolerance_risque TEXT;
ALTER TABLE investisseurs_crm ADD COLUMN IF NOT EXISTS objectifs_investissement TEXT;
ALTER TABLE investisseurs_crm ADD COLUMN IF NOT EXISTS interactions TEXT;
ALTER TABLE investisseurs_crm ADD COLUMN IF NOT EXISTS scoring NUMERIC DEFAULT 0;
ALTER TABLE investisseurs_crm ADD COLUMN IF NOT EXISTS newsletter BOOLEAN DEFAULT true;
ALTER TABLE investisseurs_crm ADD COLUMN IF NOT EXISTS rgpd_consent BOOLEAN DEFAULT false;`;

export default function AdminCRMSchema() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-2xl w-full shadow-lg">
        <h1 className="text-2xl font-bold text-[#1A3A52] mb-2">🔧 Fix Schéma CRM</h1>
        <p className="text-slate-500 text-sm mb-6">
          Copie ce SQL et colle-le dans <strong>Supabase → SQL Editor → New Query</strong> puis clique <strong>Run</strong>.
        </p>

        <div className="steps mb-6 space-y-3">
          {[
            <>Va sur <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">supabase.com/dashboard</a></>,
            <>Sélectionne ton projet <strong>cnulpkwcfpbujojwefah</strong></>,
            <>Dans le menu gauche clique sur <strong>SQL Editor</strong></>,
            <>Clique <strong>New query</strong>, colle le SQL ci-dessous, puis <strong>Run</strong></>,
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#1A3A52] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
              <p className="text-sm text-slate-700">{step}</p>
            </div>
          ))}
        </div>

        <div className="relative bg-slate-900 rounded-xl overflow-hidden">
          <pre className="text-xs text-green-300 p-4 overflow-x-auto leading-relaxed">{SQL}</pre>
          <Button
            onClick={copy}
            size="sm"
            className={`absolute top-3 right-3 gap-1.5 text-xs ${copied ? 'bg-emerald-600 hover:bg-emerald-600' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copié !' : 'Copier'}
          </Button>
        </div>

        <p className="text-xs text-slate-400 mt-4 text-center">
          Une fois exécuté, retourne sur le CRM — tous les champs fonctionneront.
        </p>
      </div>
    </div>
  );
}