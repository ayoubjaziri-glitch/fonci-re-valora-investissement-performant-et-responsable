import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Hook pour lire les contenus éditables du site depuis Base44.
 * Les enregistrements ont la structure : { id, data: { cle, valeur, page, label, type_champ } }
 */
export function useSiteContent() {
  const { data: rawContents = [] } = useQuery({
    queryKey: ['site-content-b44'],
    queryFn: () => base44.entities.SiteContent.list(),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // Normalise : extrait data.cle / data.valeur
  const contents = rawContents.map(c => ({
    id: c.id,
    cle: c.data?.cle ?? c.cle,
    valeur: c.data?.valeur ?? c.valeur,
    page: c.data?.page ?? c.page,
    label: c.data?.label ?? c.label,
    type_champ: c.data?.type_champ ?? c.type_champ,
  }));

  const get = (cle, fallback = '') => {
    const found = contents.find(c => c.cle === cle);
    return found?.valeur ?? fallback;
  };

  const getList = (cle, fallback = []) => {
    const found = contents.find(c => c.cle === cle);
    if (!found) return fallback;
    return found.valeur.split('\n').filter(l => l.trim());
  };

  return { get, getList, contents };
}