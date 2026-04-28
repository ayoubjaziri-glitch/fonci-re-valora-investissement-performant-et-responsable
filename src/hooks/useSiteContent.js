import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/supabaseClient';

/**
 * Hook pour lire les contenus éditables du site depuis Supabase.
 */
export function useSiteContent() {
  const { data: contents = [] } = useQuery({
    queryKey: ['site-content'],
    queryFn: () => db.SiteContent.list(),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const get = (cle, fallback = '') => {
    const found = contents.find(c => c.cle === cle);
    return found?.valeur ?? fallback;
  };

  const getList = (cle, fallback = []) => {
    const found = contents.find(c => c.cle === cle);
    if (!found?.valeur) return fallback;
    return found.valeur.split('\n').filter(l => l.trim());
  };

  return { get, getList, contents };
}