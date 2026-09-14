<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useOrderStore } from '@/stores/orderStore';

const orderStore = useOrderStore();
const loading = ref(true);

const orders = computed(() => orderStore.orders);

async function completeOrder(id: string) {
  await orderStore.updateOrder(id, { status: 'completed' });
}

onMounted(async () => {
  await orderStore.getOrders();
  loading.value = false;
});
</script>
<template>
  <div class="orders">
    <div class="orders__header reveal">
      <h2>Gestion des commandes</h2>
      <p class="orders__sub">Suivez et gérez les commandes de vos clients</p>
    </div>

    <p v-if="loading" class="orders__state">
      <span class="orders__spinner"></span>
      Chargement…
    </p>
    <p v-else-if="orders.length === 0" class="orders__state orders__state--empty">
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
      Aucune commande
    </p>

    <div v-else class="orders__table-wrap reveal reveal--d1">
      <table class="orders__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Utilisateur</th>
            <th>Total</th>
            <th>Articles</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td class="orders__id">{{ order.id }}</td>
            <td>{{ order.user?.email ?? order.userId }}</td>
            <td class="orders__price">{{ order.total }} FCFA</td>
            <td>
              <span class="orders__count-badge">{{ order.orderItems.length }}</span>
            </td>
            <td>
              <span class="badge" :class="`badge--${order.status}`">{{ order.status }}</span>
            </td>
            <td>
              <button
                v-if="order.status === 'pending'"
                class="btn btn--primary btn--sm"
                @click="completeOrder(order.id)"
              >
                <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd"/></svg>
                Marquer complétée
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.orders__header {
  margin-bottom: 1.5rem;
}

.orders__header h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-heading);
  margin-bottom: 0.2rem;
}

.orders__sub {
  font-size: 0.88rem;
  color: var(--color-text-soft);
}

.orders__state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 3rem 1rem;
  color: var(--color-text-soft);
  font-weight: 500;
}

.orders__state--empty {
  flex-direction: column;
  color: var(--color-text-soft);
}

.orders__spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.orders__table-wrap {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-background-soft);
  box-shadow: var(--shadow-sm);
}

.orders__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 560px;
}

.orders__table th,
.orders__table td {
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.orders__table th {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-soft);
  background: var(--color-background-soft);
  font-weight: 700;
  white-space: nowrap;
}

.orders__table tbody tr {
  transition: background var(--duration-fast) var(--ease-out);
}

.orders__table tbody tr:hover {
  background: var(--color-primary-soft);
}

.orders__table tbody tr:last-child td {
  border-bottom: none;
}

.orders__id {
  font-family: monospace;
  font-size: 0.82rem;
  color: var(--color-text-soft);
}

.orders__price {
  font-weight: 700;
  color: var(--color-primary);
  white-space: nowrap;
}

.orders__count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.8rem;
  height: 1.6rem;
  padding: 0 0.45rem;
  border-radius: var(--radius-pill);
  font-size: 0.8rem;
  font-weight: 700;
  background: var(--color-background-mute);
  color: var(--color-text);
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.7rem;
  border-radius: var(--radius-pill);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: capitalize;
}

.badge--pending {
  background: var(--color-warning-bg);
  color: var(--color-warning-text);
}

.badge--completed {
  background: var(--color-success-bg);
  color: var(--color-success-text);
}

.badge--cancelled {
  background: var(--color-error-bg);
  color: var(--color-error-text);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.55rem 1rem;
  border: none;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);
}

.btn--primary {
  background: var(--gradient-brand);
  color: var(--color-primary-contrast);
}

.btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-glow);
}

.btn--sm {
  padding: 0.3rem 0.7rem;
  font-size: 0.78rem;
}
</style>
