import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'valora_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);

    const open = () => setVisible(true);
    window.addEventListener('open-cookie-consent', open);
    return () => window.removeEventListener('open-cookie-consent', open);
  }, []);

  const choose = (value) => {
    localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new CustomEvent('cookie-consent-change', { detail: value }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:right-6 md:bottom-6 md:max-w-2xl">
      <div className="bg-[#1A3A52] text-white rounded-2xl shadow-2xl border border-white/10 p-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex w-11 h-11 rounded-xl bg-[#C9A961]/15 items-center justify-center flex-shrink-0">
            <Cookie className="h-6 w-6 text-[#C9A961]" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-lg mb-2">Votre consentement</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              Nous utilisons des cookies pour assurer le bon fonctionnement du site et mesurer son audience. Vous pouvez accepter ou refuser leur utilisation. Votre choix est conservé et peut être modifié à tout moment.
              <Link to={createPageUrl('PolitiqueConfidentialite')} className="text-[#C9A961] underline ml-1 hover:text-[#B8994F]">
                Politique de confidentialité
              </Link>
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => choose('accepted')}
                className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold flex-1"
              >
                Accepter
              </Button>
              <Button
                onClick={() => choose('refused')}
                variant="outline"
                className="border-white/30 text-white bg-transparent hover:bg-white/10 flex-1"
              >
                Refuser
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}