// api/base44Client.js
// VERSION INDÉPENDANTE — Sans dépendance @base44/sdk
// Utilise Supabase comme backend. Configurer .env.local :
//   VITE_SUPABASE_URL=https://xxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJ...
//
// Si les variables d'env ne sont pas définies, les appels retournent des tableaux vides
// (l'app reste fonctionnelle, les données ne seront simplement pas chargées).

import { base44, db } from '@/lib/supabaseClient';

export { base44, db };