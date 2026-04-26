import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminContactConfig() {
  const qc = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data: config = [], isLoading } = useQuery({
    queryKey: ['contact-config'],
    queryFn: () => db.ContactConfig.list(),
    staleTime: 0,
  });

  const emailConfig = config.find(c => c.cle === 'email_destinataires');
  const [emailsInput, setEmailsInput] = useState('');

  // Initialiser l'input quand les données chargent
  useEffect(() => {
    if (emailConfig) setEmailsInput(emailConfig.valeur);
  }, [emailConfig?.valeur]);

  const updateMutation = useMutation({
    mutationFn: async (newValeur) => {
      if (emailConfig) {
        return db.ContactConfig.update(emailConfig.id, { valeur: newValeur });
      } else {
        return db.ContactConfig.create({
          cle: 'email_destinataires',
          valeur: newValeur,
          description: 'Adresses email qui reçoivent les demandes de contact (séparées par virgule)'
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contact-config'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  });

  const emails = emailsInput.split(',').map(e => e.trim()).filter(Boolean);

  const handleRemoveEmail = (emailToRemove) => {
    const updated = emails.filter(e => e !== emailToRemove).join(', ');
    setEmailsInput(updated);
  };

  const handleSave = () => {
    const cleaned = emails.join(',');
    updateMutation.mutate(cleaned);
  };

  if (isLoading) return <div className="text-slate-400 text-sm p-4">Chargement...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1A3A52]">Paramètres des contacts</h2>
        <p className="text-slate-500 text-sm mt-1">Gérez les adresses email qui reçoivent les demandes du formulaire de contact.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 bg-[#C9A961]/10 rounded-xl flex items-center justify-center">
            <Mail className="h-5 w-5 text-[#C9A961]" />
          </div>
          <div>
            <p className="font-semibold text-[#1A3A52]">Destinataires des demandes de contact</p>
            <p className="text-xs text-slate-500">Ces adresses recevront un email à chaque nouvelle demande.</p>
          </div>
        </div>

        {/* Tags des emails actuels */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">Adresses actives :</p>
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {emails.length === 0 && (
              <span className="text-sm text-slate-400 italic">Aucune adresse configurée</span>
            )}
            {emails.map((email, i) => (
              <div key={i} className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-3 py-1.5 text-sm">
                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{email}</span>
                <button onClick={() => handleRemoveEmail(email)}
                  className="text-blue-400 hover:text-red-500 transition-colors ml-1">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Champ d'édition */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Modifier la liste (emails séparés par virgule) :</p>
          <Input
            value={emailsInput}
            onChange={(e) => setEmailsInput(e.target.value)}
            placeholder="email1@exemple.com, email2@exemple.com"
            className="font-mono text-sm"
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Séparez les adresses par une virgule. Ex : ayoubjaziri@gmail.com, contact@valora.fr
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-[#1A3A52] hover:bg-[#2A4A6F] text-white gap-2"
          >
            {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? 'Sauvegardé !' : updateMutation.isPending ? 'Sauvegarde...' : 'Enregistrer'}
          </Button>
          {saved && <span className="text-sm text-emerald-600 font-medium">✓ Les changements sont actifs</span>}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <strong>ℹ️ Info :</strong> Les modifications sont immédiatement prises en compte pour les prochaines demandes de contact.
        </p>
      </div>
    </div>
  );
}