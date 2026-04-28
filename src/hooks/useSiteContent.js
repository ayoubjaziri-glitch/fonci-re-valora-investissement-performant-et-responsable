import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Hook pour lire les contenus éditables du site.
 * Retourne une fonction get(cle, fallback) qui donne la valeur DB ou le fallback statique.
 */
export function useSiteContent() {
  const { data: contents = [] } = useQuery({
    queryKey: ['site-content'],
    queryFn: () => base44.entities.SiteContent.list(),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // Normalise les enregistrements Base44
  const normalized = contents.map(c => ({
    id: c.id,
    cle: c.cle ?? c.data?.cle,
    valeur: c.valeur ?? c.data?.valeur,
  }));

  const get = (cle, fallback = '') => {
    const found = normalized.find(c => c.cle === cle);
    return found?.valeur ?? fallback;
  };

  // Pour les listes (contenu séparé par \n)
  const getList = (cle, fallback = []) => {
    const found = normalized.find(c => c.cle === cle);
    if (!found?.valeur) return fallback;
    return found.valeur.split('\n').filter(l => l.trim());
  };

  return { get, getList, contents };
}