# Mini-Shop — E-commerce

Boutique e-commerce complète : **API NestJS + PostgreSQL** côté serveur et **application Vue 3 + Pinia** côté client, avec gestion des clients, fournisseurs (boutiquiers) et administrateurs.

> Ce fichier fait le point sur le projet : son architecture, les accès par rôle et l'ensemble des travaux réalisés jusqu'à présent.

---

## 1. Structure du projet

Le projet est découpé en deux dépôts distincts :

```
TypeScript/
├── NestJs/
│   └── mini-shop-api/          → API (NestJS 12, TypeORM, PostgreSQL)
└── Vue/
    └── mini-shop/              → Front (Vue 3, Vite, Pinia, Vue Router) ← ce dépôt
```

| Dépôt | Stack | Rôle |
|---|---|---|
| `mini-shop-api` | NestJS 12, TypeORM, PostgreSQL, JWT, PDFKit, Nodemailer | Contrat API, sécurité, métier |
| `mini-shop` | Vue 3, Vite 8, TypeScript, Pinia, Vue Router, Vitest | Interface utilisateur |

### 1.1 Arborescence du front (`mini-shop/src`)

```
src/
├── api/          → couche HTTP (http, client, interceptors, endpoints, config, types, errors)
├── assets/       → styles globaux (base.css, main.css) + logo
├── components/   → composants réutilisables (AppHeader, AppFooter, ProductCard)
├── layouts/      → gabarits de page (Main, Auth, Admin, Supplier)
├── router/       → routes (index.ts) + gardes d'accès (guards.ts)
├── stores/       → stores Pinia (auth, cart, supplier, payments, …)
├── types/        → types partagés
├── utils/        → helpers (sync, libellés de rôles)
└── views/        → pages
    ├── HomeView, ProductList, ProductDetail, ShopList, ShopDetail, AboutView, ContactView
    ├── auth/     → authentification (login, register, reset, vérification)
    ├── account/  → profil, notifications
    ├── orders/   → panier + commandes (OrdersView, CartList, OrderList, OrdersNav)
    ├── admin/    → espace administrateur
    └── supplier/ → espace fournisseur
```

Documentation d'API complète (non importée par le code) : `docs/api-endpoints.ts` en racine de dépôt.

---

## 2. Rôles et accès

Trois rôles sont gérés par l'application :

| Rôle | Code | Description |
|---|---|---|
| Client | `user` | Achete sur le catalogue, gère son panier / commandes / avis |
| Fournisseur | `supplier` | Possède une boutique, vend ses produits, traite ses commandes |
| Administrateur | `admin` | Gère l'ensemble de la plateforme |

**Règle de promotion :** un utilisateur devient `supplier` dès qu'il crée une boutique ; il redevient `user` s'il la supprime (jamais un `admin` n'est rétrogradé). Le rôle est porté dans le JWT au login, mais l'API **relit toujours le rôle en base à chaque requête** (garde-fou en cas de token périmé).

### 2.1 Matrice des accès backend

Accès contrôlés par des gardes globaux : `JwtAuthGuard` (tout requiert un JWT sauf `@Public()`), `RolesGuard` (`@roles(...)`), `RateLimiterGuard` (anti-abus).

| Endpoint | Accès |
|---|---|
| Auth (login, register, mails, vérification) | `@Public()` |
| Catalogue en lecture (products, categories, shops, reviews) | `@Public()` |
| Gestion produits (create/update/stock/`me`/delete) | `@roles('supplier', 'admin')` + propriété |
| Gestion boutique (update/delete) | `@roles('supplier', 'admin')` + propriété |
| Dashboard fournisseur | `@roles('supplier', 'admin')` |
| Utilisateurs (list/create/update/delete) | `@roles('admin')` |
| Catégories (create/update/delete) | `@roles('admin')` |
| Listes globales paiements & paniers | `@roles('admin')` |
| Dashboard admin | `@roles('admin')` |
| Panier, commandes, paiements, notifications, profil, avis | Authentifié + propriété dans le service |

### 2.2 Accès frontend

- `/admin/*` : réservé à l'admin (`requiresAdmin`, garde centrale dans `src/router/guards.ts`).
- `/supplier/*` : accessible à tout utilisateur connecté ; les onglets **Produits** et **Commandes** exigent une boutique (`requiresSupplier`), redirigent sinon vers le dashboard.
- L'en-tête (`src/components/AppHeader.vue`) : lien **Admin** admin-only, lien **Fournisseur** visible pour tous les connectés (point d'entrée vers la création de boutique).
- `SupplierDashboard` : un utilisateur sans boutique y voit un formulaire de création (nom + slug auto-généré + description) qui le fait passer `supplier`.

---

## 3. Travaux réalisés

### 3.1 Audit complet (P0 / P1 / P2)

Audit de l'API et du front : sécurité, intégrité des stocks, cohérence des statuts, monnaie, performance. Corrections appliquées ci-dessous.

### 3.2 P0 — Intégrité du stock et des annulations

- `orders.service.ts` : chargement des `orderItems.product` pour discriminer commandes fournisseur ; statuts verrouillés (`pending → confirmed → shipped → delivered → completed`, `cancelled` terminal).
- Annulation unifiée et **transactionnelle** dans `cancelWithRestock` : le stock est **toujours** recrédité (via annulation utilisateur ou fournisseur).
- Panier : `updateCartItem` / `remove` réconcilient le stock avec des transactions et verrous `pessimistic_write` ; `addCartItem` vérifie le stock cumulé ; quantité `@Min(1)`.
- Création de commande supprimée côté API (`POST /orders`) : les commandes naissent **exclusivement du flux de paiement**.

### 3.3 P1 — Sécurité

- Catégories : `@roles('admin')` sur create/update/delete + `findOne(id)` corrigé (404 idem catégorie).
- Facture (`GET /orders/:id/invoice`) : contrôle d'appartenance (client, fournisseur concerné ou admin).
- Rotation du refresh token : le token présenté est comparé au token stocké avant tout renouvellement.
- Fuites de données colmatées : `GET /payments` et `GET /cart` (listes globales) passés en admin-only.

### 3.4 P2 — Monnaie, UX et robustesse

- **Monnaie** : tout est en **FCFA** (factures PDF, e-mails, événement `order-paid`). Aucun `€` résiduel.
- **AdminOrders** : bouton « Confirmer » (envoie `confirmed`, transition valide) + badges `confirmed / shipped / delivered`.
- **Rate limiting** maison : `RateLimiterGuard` + décorateur `@RateLimit(windowMs, max)` (login 10/min, register 5/min, reset 3 et 5/min, renvoi vérification 3/min). Implémenté car `@nestjs/throttler` n'est pas compatible avec NestJS 12.
- **Renvoi de vérification** : `POST /auth/resend-verification` (anti-énumération, token régénéré).
- **Avis** : un seul avis par utilisateur/produit (409), achat requis (commande `delivered`/`completed` sinon 403), note 1–5.
- **Pagination** uniforme : produits, utilisateurs, paiements, **commandes** (admin / fournisseur / client), catégories, boutiques, avis, notifications.
  - Forme alignée sur le front : `{ items, page, limit, total, totalPages, hasNextPage, hasPreviousPage }`.
  - Stores front qui « déballent » `.items` (limit 100, 50 pour les notifications).

### 3.5 Rôle Fournisseur

- Enum `UserRole.SUPPLIER = 'supplier'` (entité + types `RoleLike` / `JwtPayload` élargis dans tous les controllers et services).
- Promotion/démotion automatique dans `ShopsService` (create/remove), avec injection du repo `User`.
- Deux migrations PostgreSQL :
  - `1789700000000-AddSupplierRole` : `ALTER TYPE ... ADD VALUE 'supplier'` (isolée, contrainte Postgres « safe enum use »).
  - `1789800000000-PromoteShopOwnersToSupplier` : backfill des propriétaires de boutique existants.
- Annonce **appliquée en base** avec `migrationsTransactionMode: 'each'` (TypeORM groupait toutes les migrations en une seule transaction).
- Front : libellés FR (Client / Administrateur / Fournisseur) sur le profil, le gestionnaire d'utilisateurs et les badges admin.

---

## 4. Base de données

- **PostgreSQL** + TypeORM, `synchronize: false` : le schéma évolue uniquement via des **migrations**.
- Commande de migration :

```sh
npm run migration:run        # applique les migrations en attente
npm run migration:generate -- migrations/NewChange
npm run migration:revert     # annule la dernière
```

> ⚠️ Toute nouvelle valeur d'enum doit être ajoutée par `ALTER TYPE ... ADD VALUE` dans sa **propre** migration (Postgres interdit de l'utiliser dans la même transaction que sa création).

---

## 5. Commandes utiles

### Backend (`...\TypeScript\NestJs\mini-shop-api`)

```sh
npm run start:dev      # serveur en mode watch
npm run lint           # ESLint + autofix
npm run build          # compilation Nest
npm run migration:run  # applique les migrations
npm run seed           # charge les données de démo
```

### Front (`...\TypeScript\Vue\mini-shop`)

```sh
npm run dev            # dev server (Vite)
npm run type-check     # vue-tsc
npm run lint           # oxlint + eslint
npm run build-only     # build de production
npm run test:unit      # tests Vitest
```

Comptes seed : `admin@minishop.com` (admin) et `johndoe@minishop.com` — mot de passe `Password!123`.

---

## 6. Notes techniques

- **Tests Jest (API) injoignables** : échec pré-existant lié à un conflit ESM/CJS (`@nestjs/testing` sous Node 24). La validation passe par `lint` + `build` + type-check front.
- **Rate limiter** : clé `IP:method:path`, fœnetre glissante nettoyée toutes les 60 s (aucune dépendance externe).
- **Colonnes DB en snake_case** (`order_id`, `shop_id`, …) : les requêtes raw (`orderItems`, dashboards) les utilisent telles quelles ; les entités TypeORM mappent les propriétés camelCase.
- **Aucune mise en place de CI/CD** pour l'instant ; aucune procédure de commit n'a été définie (aucun commit effectué par l'assistant).

---

## 7. Évolutions envisagées (roadmap)

Suggestions d'ajouts, classées par domaine d'impact.

### 7.1 Catalogue & achat
- Recherche plein texte + filtres (catégorie, prix, note, boutique, tri).
- Favoris / liste de souhaits.
- Multi-produits + quantités au checkout (aujourd'hui : commande = panier complet).
- Fiches produit enrichies : variantes, promotions, certificats de garantie.

### 7.2 Fournisseur
- Graphique de ventes par mois + statistiques boutique (CA, top produits).
- Export CSV des produits et des ventes.
- Logo + image de couverture de boutique, URL personnalisée.
- Multi-boutiques par compte (éventuelle limite par abonnement).

### 7.3 Client / commandes
- Suivi de livraison avec étapes visuelles + numéro de tracking.
- Réservation de panier (temps limité avant paiement).
- Évaluations produit avec photos et réponses des vendeurs.
- Reçu de paiement séparé de la facture ; option « racheter un produit ».

### 7.4 Administration
- Tableau de bord avancé : CA total, tendances, top boutiques/produits, graphiques.
- Codes promo / remises par produit ou boutique.
- Modération des avis et gestion des litiges.
- Statistiques géographiques des commandes.

### 7.5 Plateforme / technique
- Notifications temps réel (WebSocket / Socket.io) au lieu du polling.
- Paiement réel en ligne (Mobile Money / carte) au lieu du flux simulé.
- SEO : rendu côté serveur (Nuxt) + sitemap.
- E-mails transactionnels en français et facture au monogramme de la plateforme.
- Sécurité : 2FA, journal d'activité admin, audit trails.

**Priorité suggérée** : recherche + filtres, statistiques fournisseur, codes promo, paiement réel.