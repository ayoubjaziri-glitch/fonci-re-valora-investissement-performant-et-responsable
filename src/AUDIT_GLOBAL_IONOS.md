# 🔍 AUDIT GLOBAL MIGRATION IONOS — La Foncière Valora

**Date:** 2026-05-08  
**Analyse:** Identification des dépendances Base44, blocages potentiels et plan de migration

---

## 📊 RÉSUMÉ EXÉCUTIF

| Critère | Status | Risque | Impact |
|---------|--------|--------|--------|
| **Base44 SDK** | 🔴 CRITIQUE | Très haut | Impossible sans remplacement |
| **Supabase** | 🟡 CONTRÔLABLE | Moyen | Portable (BD indépendante) |
| **APIs externes** | 🟢 ISOLÉES | Bas | Transférables (Resend, Gemini) |
| **Auth** | 🟡 DÉPENDANT | Moyen | Supabase Auth portable |
| **Backend (Deno)** | 🔴 CRITIQUE | Très haut | Pas d'équivalent direct IONOS |

---

## 🔴 BLOCAGES CRITIQUES (NON-MIGRABLES SANS REFONTE)

### 1. **Base44 SDK (@base44/sdk)**
**Fichiers affectés:** 
- `api/base44Client.js` (configuration)
- Toutes les pages admin (AdminEspaceAssocie, AdminBackOffice, etc.)
- Composants avec `base44.functions.invoke()`

**Utilisation actuelle:**
```javascript
// base44Client.js
import { createClient } from '@base44/sdk';
export const base44 = createClient({ appId: "699460f1b03f6285dc8513a7" });

// Appels de backend functions
const res = await base44.functions.invoke('insertDocumentAssocie', payload);
const res = await base44.functions.invoke('generateBlogArticle', { sujet, ... });
```

**Problème:** 
- Base44 SDK est propriétaire et spécifique à la plateforme
- Appels de fonctions serverless gérées par Base44
- Impossibilité d'avoir l'équivalent exact sur IONOS

**Impact sur app:**
- ❌ Toutes les mutations de données via backend
- ❌ Génération d'articles AI (generateBlogArticle)
- ❌ Envoi d'emails (sendContactEmail)
- ❌ Upload de fichiers (ensureBucket, uploadDocumentAssocie)

**Coût de migration:** ⚠️ **TRÈS ÉLEVÉ** — Refonte complète du backend

---

### 2. **Backend Functions (Deno Deploy)**
**Fichiers actuels:**
- `functions/insertDocumentAssocie` — Insert avec service role RLS bypass
- `functions/sendContactEmail` — Envoi d'emails via Resend
- `functions/generateBlogArticle` — AI generation avec Gemini
- `functions/uploadDocumentAssocie` — Upload Supabase
- `functions/ensureBucket` — Gestion buckets Supabase
- `functions/checkOverdueTaches` — Scheduled tasks
- `functions/notifyResponsable` — Notifications
- `functions/createDocument`, `createBucketIfNeeded`
- `functions/valoraAiExecutor`, `valoraAiProxy`

**Utilisation:**
```javascript
// AdminEspaceAssocie.jsx
const res = await base44.functions.invoke('insertDocumentAssocie', data);
const res = await base44.functions.invoke('generateBlogArticle', { sujet, ... });
```

**Problème:**
- Deno Deploy est un runtime serverless Base44-specific
- Pas d'équivalent direct sur IONOS (hébergement classique)
- Nécessiterait un API Node.js/Express classique à la place

**Options de migration:**
1. **Refonte complète en Express/Node.js** (2-3 semaines)
2. **Garder Deno Deploy externe** (coût additionnel, moins idéal)
3. **Utiliser Vercel/Netlify Functions** (plus portable que Base44)

**Impact:** 🔴 **BLOQUANT** — 30% de la logique métier

---

## 🟡 DÉPENDANCES CONTRÔLABLES (MIGRABLES)

### 3. **Supabase (PostgreSQL + Auth + Storage)**

**Configuration actuelle:**
```javascript
// lib/supabaseClient.js
const SUPABASE_URL = 'https://cnulpkwcfpbujojwefah.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5NLD8wzCMdxN4TCiuSYK-w_mDQ1aQFO';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: { params: { eventsPerSecond: 10 } }
});
```

**Utilisation:**
- **PostgreSQL:** Stockage de tous les données (26 tables identifiées)
- **Auth:** `supabase.auth.signInWithPassword()`, `supabase.auth.getSession()`
- **Storage:** Bucket 'documents' pour les uploads PDF
- **Realtime:** Subscriptions à `documents_associes`, channels en-app agent

**Tables critiques:**
```
- documents_associes (RLS — service role bypass nécessaire)
- contact_requests, contact_config
- articles_blog, site_content, site_images, site_sections
- taches, projets, responsables
- investisseurs_crm, levees_fonds
- actualites_associes, acquisitions_associes, roadmap_associes
- espace_associe_config, page_views
- acces_admin, acces_associes
- membres_equipe, realisations_biens, map_locations
- valora_ai_memoire
```

**✅ Portabilité:** 
- Supabase est indépendant de Base44
- Peut rester sur Supabase.co (recommandé)
- OU migrer vers PostgreSQL self-hosted sur IONOS
- Auth Supabase peut rester externe

**Coût:** 📦 **FAIBLE** — 2-3 jours si PostgreSQL IONOS

---

### 4. **Intégrations API Externes (Portables)**

#### 4a. **Resend (Email)**
```javascript
// functions/sendContactEmail
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
await fetch('https://api.resend.com/emails', { 
  headers: { 'Authorization': `Bearer ${RESEND_API_KEY}` }
});
```
✅ **Portable:** Déplacement trivial vers Node.js/Express  
⚠️ **Note:** Domaine non vérifié → emails envoyés à `ayoubjaziri@gmail.com` uniquement

#### 4b. **Google Gemini (AI Generation)**
```javascript
// functions/generateBlogArticle
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`);
```
✅ **Portable:** API HTTP standard  
💰 **Coût:** ~$0.075/article (modèles utilisés: gemini-2.5-flash)

#### 4c. **Géolocalisation (3 APIs en fallback)**
```javascript
// lib/NavigationTracker.jsx
// API 1: ip-api.com
// API 2: ipapi.co
// API 3: freeipapi.com
```
✅ **Portable:** Appels HTTP direct, pas de clé  
⚠️ **Risk:** Limites de taux (free tier)

---

## 🏗️ ARCHITECTURE ACTUELLE

```
┌─────────────────────────────────────────┐
│           FRONTEND (React)              │
│  ├─ pages/*                             │
│  ├─ components/*                        │
│  └─ lib/ (CustomAuthContext, Tracker)   │
└──────────┬──────────────────────────────┘
           │
     ┌─────┴────────┐
     │              │
┌────▼─────┐  ┌────▼──────────────┐
│ Supabase  │  │  Base44 Backend   │
│ (BD)      │  │  (Deno Deploy)    │
│           │  │                   │
│ Auth      │  │ - sendContactEmail│
│ Storage   │  │ - generateBlog    │
│ REST API  │  │ - insertDocument  │
│ Realtime  │  │ - 9+ autres funcs │
└─────┬─────┘  └─────┬──────────────┘
      │              │
      │        ┌─────┴────────┬──────────────┐
      │        │              │              │
      │    ┌───▼──┐    ┌──────▼─┐    ┌──────▼──┐
      │    │Resend│    │ Gemini │    │ ip-api  │
      │    │(Email)    │ (AI)   │    │(GeoLoc) │
      └────┴──────┘    └────────┘    └─────────┘
```

**Critique:** Base44 SDK est le point d'accès pour:
- ❌ Appels de backend functions
- ❌ Auth (partagé avec Supabase Auth)
- ❌ Stockage de fichiers

---

## 📋 LISTE DÉTAILLÉE DES APPELS BASE44

### Frontend (`base44.functions.invoke()`)

| Fichier | Fonction | Fréquence | Criticité |
|---------|----------|-----------|-----------|
| AdminEspaceAssocie.jsx | `insertDocumentAssocie` | À chaque upload doc | CRITIQUE |
| AdminEspaceAssocie.jsx | N/A (utilisait anciennement ensureBucket) | Archive | - |
| AdminBlog.jsx | `generateBlogArticle` | À la création article AI | HAUTE |
| ContactForm (implicite) | `sendContactEmail` | À chaque soumission contact | HAUTE |
| Taches (implicite) | `checkOverdueTaches` | Scheduled (quotidien) | MOYENNE |
| ValoraAI | `valoraAiExecutor`, `valoraAiProxy` | Occasionnel | MOYENNE |

**TOTAL:** 6+ fonctions critiques dépendant du Base44 SDK

---

## 🛑 ARCHITECTURE BLOQUANTE POUR IONOS

### Les 3 piliers à refondre:

1. **SDK Client** (api/base44Client.js)
   - ❌ Impossible de le garder
   - 💡 À remplacer par: Axios/Fetch vers `/api/*` local

2. **Backend Functions** (functions/*)
   - ❌ Deno Deploy n'existe pas sur IONOS
   - 💡 À remplacer par: Express.js routes sur même serveur

3. **Auth Context** (lib/CustomAuthContext.jsx)
   - 🟡 Partiellement dépendant de Base44
   - 💡 Peut rester Supabase Auth (externe)

**Estimation effort:**
```
- Refonte Deno → Express: 150-200h
- Tests + debug: 50-80h
- Migration données: 30-50h
───────────────────────
TOTAL: 230-330 heures (~6-8 semaines)
```

---

## 💾 PLAN DE MIGRATION DÉTAILLÉ

### Phase 1: Préparation (1 semaine)
```
☐ Exporter toutes les données Supabase (dump PostgreSQL)
☐ Configurer PostgreSQL sur IONOS
☐ Vérifier compatibilité schéma
☐ Tester connexion Supabase → IONOS (optionnel)
```

### Phase 2: Backend (3-4 semaines)
```
☐ Setup Express.js + Node.js sur IONOS
☐ Transférer logic de functions/sendContactEmail → POST /api/email
☐ Transférer logic de functions/generateBlogArticle → POST /api/blog/generate
☐ Transférer logic de functions/insertDocumentAssocie → POST /api/documents
☐ Transférer logic de functions/uploadDocumentAssocie → POST /api/upload
☐ Transférer logic de functions/checkOverdueTaches → POST /api/tasks/check (+ cron)
☐ Tests unitaires pour chaque endpoint
```

### Phase 3: Frontend (1-2 semaines)
```
☐ Remplacer base44.functions.invoke() par fetch('/api/*')
☐ Adapter tous les composants Admin
☐ Tester chaîne complète upload → email → DB
☐ Vérifier géolocalisation (fallback APIs)
☐ Tester AI blog generation
```

### Phase 4: Infra & Tests (1-2 semaines)
```
☐ Configurer scheduled tasks (cron IONOS)
☐ Backup automatique PostgreSQL
☐ Tests de charge + performance
☐ Sécurité (CORS, auth tokens, RLS)
☐ Rollback plan
```

---

## ⚠️ RISQUES & MITIGATIONS

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|-----------|
| Perte de données en migration | 🟡 Moyen | 🔴 CRITIQUE | Backup x3, test de restauration |
| Timeout upload gros fichiers | 🟡 Moyen | 🟡 HAUTE | Streaming multipart, retry logic |
| RLS policy bypass cassée | 🔴 HAUT | 🔴 CRITIQUE | Tester avant migration |
| Dépendance Gemini inaccessible | 🟡 Moyen | 🟡 HAUTE | Fallback, queue système |
| Performance auth Supabase | 🟢 Bas | 🟡 MOYENNE | Garder Supabase external, utiliser JWT |

---

## 🎯 RECOMMANDATIONS

### ✅ À FAIRE

1. **Garder Supabase externe** (recommandé)
   - Coût: ~$100/mois
   - Effort: minimal
   - Évite refonte PostgreSQL

2. **Créer API Node.js** sur IONOS
   - Framework: Express.js
   - Port: 3001 (ou reverse proxy)
   - Replicate logic from functions/*

3. **Migrer fichier par fichier**
   - Commencer par sendContactEmail (plus simple)
   - Puis insertDocumentAssocie (avec RLS handling)
   - Puis generateBlogArticle (complexe, plus haut risque)

### ❌ À ÉVITER

- ❌ Essayer de garder Base44 SDK
- ❌ Migrer PostgreSQL sur IONOS immédiatement (trop risqué)
- ❌ Refondre sans tests préalables
- ❌ Négliger les scheduled tasks

---

## 📦 DÉPENDANCES NPM À AVOIR SUR IONOS

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "dotenv": "^16.0.0",
    "@supabase/supabase-js": "^2.104.1",
    "axios": "^1.4.0",
    "cors": "^2.8.5",
    "node-cron": "^3.0.0",
    "resend": "^2.0.0"
  }
}
```

---

## 🔐 SÉCURITÉ À VÉRIFIER

```javascript
// AVANT MIGRATION
☐ Service role key pas exposée en frontend ❌ ACTUELLEMENT FIXÉ
☐ API keys (Gemini, Resend) dans env seulement ✅ OK
☐ CORS whitelist pour app frontend ☐ À CONFIG
☐ JWT signature pour inter-service auth ☐ À CONFIG
☐ Rate limiting sur POST /api/* ☐ À CONFIG
☐ Validation input stricte ☐ À AJOUTER
☐ HTTPS obligatoire ✅ IONOS le fournit
```

---

## 💡 QUESTIONS OUVERTES

1. **Domaine email Resend:**
   - Actuellement hardcoded `ayoubjaziri@gmail.com`
   - Sur IONOS, utiliser domaine propre? (lafoncierepatrimoniale.com)
   - Refonte de sendContactEmail nécessaire

2. **Scheduled tasks:**
   - `checkOverdueTaches` s'exécute comment actuellement?
   - Deno cron? Base44 scheduler?
   - Sur IONOS: utiliser node-cron ou task classique du serveur

3. **Realtime Supabase:**
   - Actuellement utilisé pour `documents_associes` live updates
   - Peut rester (Supabase external)
   - Vérifier performance avec IONOS latency

4. **Performance:**
   - API Base44 était-elle rapide?
   - Quelle latency on accept pour IONOS?
   - Besoin de CDN supplémentaire?

---

## 📞 PROCHAINES ÉTAPES

1. **Valider choix:** Supabase external vs self-hosted?
2. **Prototyper:** Créer 1 endpoint Express (sendContactEmail)
3. **Tester:** Upload, génération article, email test
4. **Budget:** Évaluer coût hébergement IONOS vs gains
5. **Timeline:** Planifier phases (6-8 semaines minimum)

---

**Audit par:** Base44 AI Agent  
**Date:** 2026-05-08  
**Confidentiel:** La Foncière Valora