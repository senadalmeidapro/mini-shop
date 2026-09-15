<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useSupplierStore } from '@/stores/supplierStore';
import { useShopStore } from '@/stores/shopStore';

const supplierStore = useSupplierStore();
const shopStore = useShopStore();

const creatingShop = ref(false);
const shopForm = reactive({
  name: '',
  slug: '',
  description: '',
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function autofillSlug() {
  if (!shopForm.slug) {
    shopForm.slug = slugify(shopForm.name);
  }
}

async function createShop() {
  creatingShop.value = true;
  await shopStore.createShop({
    name: shopForm.name,
    slug: shopForm.slug || slugify(shopForm.name),
    description: shopForm.description || undefined,
  });
  creatingShop.value = false;

  if (shopStore.myShop) {
    await supplierStore.getDashboard();
  }
}

onMounted(() => {
  supplierStore.getDashboard();
});

function formatPrice(val: number) {
  return val.toLocaleString('fr-FR');
}

function relativeDate(date: string | Date) {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `il y a ${hrs}h`;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
    completed: 'Terminée',
  };
  return map[status] ?? status;
}

function statusClass(status: string) {
  switch (status) {
    case 'pending':
      return 'status--warning';
    case 'confirmed':
      return 'status--info';
    case 'shipped':
      return 'status--shipped';
    case 'delivered':
    case 'completed':
      return 'status--success';
    case 'cancelled':
      return 'status--danger';
    default:
      return '';
  }
}
</script>
<template>
  <div class="sd">
    <!-- ═══════════════ LOADER ═══════════════ -->
    <div v-if="supplierStore.loading" class="sd__loader">
      <span class="sd__spinner" />
    </div>

    <!-- ═══════════════ PAS DE BOUTIQUE ═══════════════ -->
    <div
      v-else-if="!supplierStore.hasShop"
      class="sd__empty"
    >
      <span class="sd__empty-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
          <path d="M9 22V12h6v10" />
        </svg>
      </span>
      <h3>Vous n'avez pas encore de boutique</h3>
      <p>Créez votre boutique pour devenir fournisseur et accéder au tableau de bord.</p>

      <form class="sd__create-form" @submit.prevent="createShop">
        <input
          v-model="shopForm.name"
          type="text"
          placeholder="Nom de la boutique"
          required
          @input="autofillSlug"
        />
        <div class="sd__create-slug">
          <span>/</span>
          <input v-model="shopForm.slug" type="text" placeholder="slug-unique" required />
        </div>
        <input v-model="shopForm.description" type="text" placeholder="Description (optionnel)" />
        <button type="submit" class="sd__create-btn" :disabled="creatingShop">
          {{ creatingShop ? 'Création…' : 'Créer ma boutique' }}
        </button>
      </form>

      <RouterLink class="sd__empty-link" :to="{ name: 'Shops' }">
        Ou parcourir les boutiques existantes
      </RouterLink>
    </div>

    <!-- ═══════════════ DASHBOARD ═══════════════ -->
    <template v-else-if="supplierStore.dashboard">
      <div class="sd__header reveal">
        <h2>Tableau de bord</h2>
        <p class="sd__sub">Vue d'ensemble de votre boutique</p>
      </div>

      <!-- ── Bannière boutique ─────────────────────────── -->
      <div class="sd__shop reveal reveal--d1">
        <span class="sd__shop-avatar" aria-hidden="true">
          {{ supplierStore.dashboard.shop.name.charAt(0).toUpperCase() }}
        </span>
        <div class="sd__shop-info">
          <h3 class="sd__shop-name">{{ supplierStore.dashboard.shop.name }}</h3>
          <span class="sd__shop-slug">/{{ supplierStore.dashboard.shop.slug }}</span>
        </div>
        <span
          class="sd__shop-status"
          :class="supplierStore.dashboard.shop.isActive ? 'sd__shop-status--active' : 'sd__shop-status--inactive'"
        >
          {{ supplierStore.dashboard.shop.isActive ? 'Active' : 'Inactive' }}
        </span>
        <div class="sd__shop-revenue">
          <span class="sd__shop-revenue-label">Revenu total</span>
          <strong class="sd__shop-revenue-value">{{ formatPrice(supplierStore.dashboard.revenue) }} FCFA</strong>
        </div>
      </div>

      <!-- ── KPIs ────────────────────────────────────── -->
      <div class="sd__kpis">
        <div class="sd__kpi reveal reveal--d2">
          <span class="sd__kpi-icon sd__kpi-icon--blue">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          </span>
          <div class="sd__kpi-content">
            <strong>{{ supplierStore.dashboard.products.total }}</strong>
            <span>Produits</span>
          </div>
        </div>
        <div class="sd__kpi reveal reveal--d3">
          <span class="sd__kpi-icon sd__kpi-icon--warning">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </span>
          <div class="sd__kpi-content">
            <strong>{{ supplierStore.dashboard.products.lowStock.length }}</strong>
            <span>Alertes stock</span>
          </div>
        </div>
        <div class="sd__kpi reveal reveal--d4">
          <span class="sd__kpi-icon sd__kpi-icon--success">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </span>
          <div class="sd__kpi-content">
            <strong>{{ formatPrice(supplierStore.dashboard.revenue) }}<small> FCFA</small></strong>
            <span>Revenus</span>
          </div>
        </div>
        <div class="sd__kpi reveal reveal--d5">
          <span class="sd__kpi-icon sd__kpi-icon--danger">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          </span>
          <div class="sd__kpi-content">
            <strong>{{ supplierStore.dashboard.notifications.unread }}</strong>
            <span>Notifications</span>
          </div>
        </div>
      </div>

      <!-- ── Deux colonnes ──────────────────────────────── -->
      <div class="sd__grid">
        <!-- Produits en alerte -->
        <section class="sd__card reveal reveal--d5">
          <div class="sd__card-head">
            <h4 class="sd__card-title">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd"/></svg>
              Produits en alerte stock
            </h4>
            <RouterLink class="sd__card-more" :to="{ name: 'Supplier Products' }">Gérer</RouterLink>
          </div>
          <ul v-if="supplierStore.dashboard.products.lowStock.length" class="sd__alert-list">
            <li v-for="product in supplierStore.dashboard.products.lowStock" :key="product.id" class="sd__alert-item">
              <span class="sd__alert-name">{{ product.name }}</span>
              <span class="sd__alert-stock" :class="product.stock === 0 ? 'sd__alert-stock--out' : 'sd__alert-stock--low'">
                {{ product.stock }} en stock
              </span>
            </li>
          </ul>
          <p v-else class="sd__empty-text">Tout est approvisionné !</p>
        </section>

        <!-- Notifications récentes -->
        <section class="sd__card reveal reveal--d6">
          <h4 class="sd__card-title">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path fill-rule="evenodd" d="M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076 32.91 32.91 0 0 0 3.256.508 3.5 3.5 0 0 0 6.972 0 32.903 32.903 0 0 0 3.256-.508.75.75 0 0 0 .515-1.076A11.448 11.448 0 0 1 16 8a6 6 0 0 0-6-6ZM8.05 14.943a33.54 33.54 0 0 0 3.9 0 2 2 0 0 1-3.9 0Z" clip-rule="evenodd"/></svg>
            Notifications récentes
          </h4>
          <ul v-if="supplierStore.dashboard.notifications.recent.length" class="sd__notif-list">
            <li v-for="notif in supplierStore.dashboard.notifications.recent" :key="notif.id" class="sd__notif-item" :class="{ 'sd__notif-item--unread': !notif.read }">
              <span v-if="!notif.read" class="sd__notif-dot" />
              <div class="sd__notif-body">
                <strong class="sd__notif-title">{{ notif.title }}</strong>
                <p class="sd__notif-msg">{{ notif.message }}</p>
              </div>
              <span class="sd__notif-date">{{ relativeDate(notif.createdAt) }}</span>
            </li>
          </ul>
          <p v-else class="sd__empty-text">Aucune notification.</p>
        </section>
      </div>

      <!-- ── Répartition des commandes ──────────────────── -->
      <section class="sd__card reveal reveal--d6">
        <h4 class="sd__card-title">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path fill-rule="evenodd" d="M1 3.25A2.25 2.25 0 0 1 3.25 1h13.5A2.25 2.25 0 0 1 19 3.25v4.486a2.25 2.25 0 0 1-.659 1.591L11.56 13.03a2.25 2.25 0 0 1-3.12 0L1.659 9.286A2.25 2.25 0 0 1 1 7.736V3.25Zm2.25-.75a.75.75 0 0 0-.75.75v4.486l.218.164a.75.75 0 0 0 .664 0l7.705-5.78a.75.75 0 0 0 .224-.536V3.25a.75.75 0 0 0-.75-.75H3.25Z" clip-rule="evenodd"/></svg>
          Commandes par statut
        </h4>
        <div class="sd__status-grid">
          <span
            v-for="(count, status) in supplierStore.dashboard.ordersByStatus"
            :key="status"
            class="sd__status-chip"
            :class="statusClass(status)"
          >
            {{ statusLabel(status) }}
            <span class="sd__status-count">{{ count }}</span>
          </span>
          <span v-if="!Object.keys(supplierStore.dashboard.ordersByStatus).length" class="sd__empty-text">Aucune commande.</span>
        </div>
      </section>

      <!-- ── Commandes récentes ─────────────────────────── -->
      <section class="sd__card reveal reveal--d7">
        <div class="sd__card-head">
          <h4 class="sd__card-title">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path fill-rule="evenodd" d="M1 3.25A2.25 2.25 0 0 1 3.25 1h13.5A2.25 2.25 0 0 1 19 3.25v4.486a2.25 2.25 0 0 1-.659 1.591L11.56 13.03a2.25 2.25 0 0 1-3.12 0L1.659 9.286A2.25 2.25 0 0 1 1 7.736V3.25Zm2.25-.75a.75.75 0 0 0-.75.75v4.486l.218.164a.75.75 0 0 0 .664 0l7.705-5.78a.75.75 0 0 0 .224-.536V3.25a.75.75 0 0 0-.75-.75H3.25ZM2.25 7v5.677a.75.75 0 0 0 .75.75h13.5a.75.75 0 0 0 .75-.75V7H2.25Z" clip-rule="evenodd"/></svg>
            Commandes récentes
          </h4>
          <RouterLink class="sd__card-more" :to="{ name: 'Supplier Orders' }">Tout voir</RouterLink>
        </div>
        <div class="sd__table-wrap">
          <table class="sd__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Statut</th>
                <th>Client</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in supplierStore.dashboard.recentOrders" :key="order.id">
                <td class="sd__td-id">{{ order.id.slice(0, 8) }}…</td>
                <td>
                  <span class="sd__status-badge" :class="statusClass(order.status)">
                    {{ statusLabel(order.status) }}
                  </span>
                </td>
                <td>{{ order.customerName ?? '—' }}</td>
                <td class="sd__td-price">{{ formatPrice(order.total) }} FCFA</td>
                <td class="sd__td-date">{{ relativeDate(order.createdAt) }}</td>
              </tr>
              <tr v-if="!supplierStore.dashboard.recentOrders.length">
                <td colspan="5" class="sd__empty-cell">Aucune commande récente.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.sd {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ══════════════════ LOADER / EMPTY ══════════════════ */
.sd__loader {
  display: flex;
  justify-content: center;
  padding: 4rem 0;
}

.sd__spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.sd__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.6rem;
  padding: 4rem 1.5rem;
  border: 1px dashed var(--color-border-hover);
  border-radius: var(--radius-xl);
  background: var(--color-background-soft);
  color: var(--color-text-soft);
}

.sd__empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  animation: none;
}

.sd__empty h3 {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-heading);
}

.sd__empty p {
  max-width: 340px;
  font-size: 0.92rem;
  line-height: 1.55;
}

.sd__create-form {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: 100%;
  max-width: 340px;
  margin-top: 0.75rem;
}

.sd__create-slug {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-background);
}

.sd__create-slug > span {
  color: var(--color-text-soft);
  font-weight: 700;
}

.sd__create-form input {
  padding: 0.6rem 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.9rem;
  outline: none;
  transition:
    border-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.sd__create-form input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-focus);
}

.sd__create-slug input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.6rem 0;
}

.sd__create-slug input:focus {
  box-shadow: none;
}

.sd__create-btn {
  padding: 0.6rem 1.4rem;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--gradient-brand);
  color: #fff;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  box-shadow: var(--shadow-glow);
  transition:
    transform var(--duration) var(--ease-out),
    box-shadow var(--duration);
}

.sd__create-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px var(--color-primary-glow);
}

.sd__create-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sd__empty-link {
  margin-top: 0.75rem;
  font-size: 0.88rem;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
}

.sd__empty-link:hover {
  text-decoration: underline;
}

/* ══════════════════ HEADER ══════════════════ */
.sd__header h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-heading);
  margin-bottom: 0.25rem;
}

.sd__sub {
  font-size: 0.9rem;
  color: var(--color-text-soft);
}

/* ══════════════════ BANNIÈRE BOUTIQUE ══════════════════ */
.sd__shop {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1.5rem 1.75rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.sd__shop-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--c-blue), var(--c-teal));
  color: #fff;
  font-weight: 800;
  font-size: 1.2rem;
}

.sd__shop-info {
  display: flex;
  flex-direction: column;
}

.sd__shop-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-heading);
}

.sd__shop-slug {
  font-size: 0.82rem;
  color: var(--color-text-soft);
}

.sd__shop-status {
  padding: 0.25rem 0.8rem;
  border-radius: var(--radius-pill);
  font-size: 0.78rem;
  font-weight: 700;
  margin-left: auto;
}

.sd__shop-status--active {
  background: var(--color-success-bg);
  color: var(--color-success-text);
}

.sd__shop-status--inactive {
  background: var(--color-warning-bg);
  color: var(--color-warning-text);
}

.sd__shop-revenue {
  display: flex;
  flex-direction: column;
}

.sd__shop-revenue-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-soft);
}

.sd__shop-revenue-value {
  font-size: 1.2rem;
  font-weight: 800;
  background: linear-gradient(120deg, var(--c-blue), var(--c-green));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ══════════════════ KPIs ══════════════════ */
.sd__kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

@media (max-width: 900px) {
  .sd__kpis {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .sd__kpis {
    grid-template-columns: 1fr;
  }
}

.sd__kpi {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1.1rem 1.2rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition:
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out);
}

.sd__kpi:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-glow);
  border-color: var(--color-primary);
}

.sd__kpi-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.6rem;
  height: 2.6rem;
  flex-shrink: 0;
  border-radius: var(--radius-md);
}

.sd__kpi-icon--blue {
  background: rgba(83, 128, 247, 0.12);
  color: var(--c-blue);
}

.sd__kpi-icon--warning {
  background: var(--color-warning-bg);
  color: var(--color-warning-text);
}

.sd__kpi-icon--success {
  background: var(--color-success-bg);
  color: var(--color-success-text);
}

.sd__kpi-icon--danger {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.sd__kpi-content {
  display: flex;
  flex-direction: column;
}

.sd__kpi-content strong {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-heading);
  line-height: 1.2;
}

.sd__kpi-content strong small {
  font-size: 0.85rem;
  font-weight: 600;
}

.sd__kpi-content span {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-soft);
}

/* ══════════════════ GRILLE 2 COLONNES ══════════════════ */
.sd__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 860px) {
  .sd__grid {
    grid-template-columns: 1fr;
  }
}

/* ══════════════════ CARTE GÉNÉRIQUE ══════════════════ */
.sd__card {
  padding: 1.4rem 1.5rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.sd__card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.sd__card-head .sd__card-title {
  margin-bottom: 0;
}

.sd__card-more {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-pill);
  transition: background-color var(--duration-fast);
}

.sd__card-more:hover {
  background: var(--color-primary-soft);
}

.sd__card-title {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.sd__empty-text {
  font-size: 0.88rem;
  color: var(--color-text-soft);
}

/* ══════════════════ ALERTES STOCK ══════════════════ */
.sd__alert-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.sd__alert-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.85rem;
  border-radius: var(--radius-md);
  background: var(--color-background);
  border: 1px solid var(--color-border);
}

.sd__alert-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-heading);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sd__alert-stock {
  flex-shrink: 0;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-pill);
  font-size: 0.72rem;
  font-weight: 700;
}

.sd__alert-stock--low {
  background: var(--color-warning-bg);
  color: var(--color-warning-text);
}

.sd__alert-stock--out {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

/* ══════════════════ NOTIFICATIONS ══════════════════ */
.sd__notif-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.sd__notif-item {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-md);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  transition: background-color var(--duration-fast);
}

.sd__notif-item--unread {
  background: var(--color-primary-soft);
}

.sd__notif-dot {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  margin-top: 5px;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-soft);
}

.sd__notif-body {
  flex: 1;
  min-width: 0;
}

.sd__notif-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-heading);
}

.sd__notif-msg {
  font-size: 0.82rem;
  color: var(--color-text-soft);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.sd__notif-date {
  flex-shrink: 0;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-text-soft);
  white-space: nowrap;
}

/* ══════════════════ STATUS CHIPS ══════════════════ */
.sd__status-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.sd__status-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-pill);
  font-size: 0.8rem;
  font-weight: 700;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-heading);
}

.sd__status-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.3rem;
  border-radius: var(--radius-pill);
  background: var(--color-background-mute);
  font-size: 0.7rem;
}

.status--warning {
  background: var(--color-warning-bg);
  color: var(--color-warning-text);
  border-color: var(--color-warning-bg);
}

.status--info {
  background: rgba(83, 128, 247, 0.12);
  color: var(--c-blue);
  border-color: rgba(83, 128, 247, 0.2);
}

.status--shipped {
  background: rgba(34, 198, 166, 0.12);
  color: var(--c-teal);
  border-color: rgba(34, 198, 166, 0.2);
}

.status--success {
  background: var(--color-success-bg);
  color: var(--color-success-text);
  border-color: var(--color-success-bg);
}

.status--danger {
  background: var(--color-danger-soft);
  color: var(--color-danger);
  border-color: var(--color-danger-soft);
}

/* ══════════════════ TABLEAU ══════════════════ */
.sd__table-wrap {
  overflow-x: auto;
}

.sd__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.sd__table th {
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-soft);
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.sd__table td {
  padding: 0.7rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-heading);
}

.sd__table tbody tr:hover {
  background: var(--color-primary-soft);
}

.sd__td-id {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.82rem;
  color: var(--color-text-soft);
}

.sd__td-price {
  font-weight: 700;
  color: var(--color-primary);
  white-space: nowrap;
}

.sd__td-date {
  font-size: 0.82rem;
  color: var(--color-text-soft);
  white-space: nowrap;
}

.sd__status-badge {
  display: inline-flex;
  padding: 0.22rem 0.7rem;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 700;
}

.sd__empty-cell {
  text-align: center;
  color: var(--color-text-soft);
  font-style: italic;
}
</style>
