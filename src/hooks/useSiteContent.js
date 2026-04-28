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

  const get = (cle, fallback = '') => {
    const found = contents.find(c => (c.cle === cle) || (c.data?.cle === cle));
    const valeur = found?.valeur ?? found?.data?.valeur;
    return valeur ?? fallback;
  };

  // Pour les listes (contenu séparé par \n)
  const getList = (cle, fallback = []) => {
    const found = contents.find(c => (c.cle === cle) || (c.data?.cle === cle));
    const valeur = found?.valeur ?? found?.data?.valeur;
    if (!valeur) return fallback;
    return valeur.split('\n').filter(l => l.trim());
  };

  return { get, getList, contents };
}