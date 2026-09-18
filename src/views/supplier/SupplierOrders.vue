<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useOrderStore } from '@/stores/orderStore';
import type { OrderStatus } from '@/types';

const orderStore = useOrderStore();
const loading = ref(true);

const orders = computed(() => orderStore.orders);

const statusLabel: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

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

function nextStatusLabel(status: string) {
  switch (status) {
    case 'pending':
      return 'Confirmer';
    case 'confirmed':
      return 'Expédier';
    case 'shipped':
      return 'Marquer livrée';
    case 'delivered':
      return 'Terminer';
    default:
      return '';
  }
}

function nextStatus(status: string): OrderStatus | undefined {
  switch (status) {
    case 'pending':
      return 'confirmed';
    case 'confirmed':
      return 'shipped';
    case 'shipped':
      return 'delivered';
    case 'delivered':
      return 'completed';
    default:
      return undefined;
  }
}

const trackingInputs = ref<Record<string, string>>({});

async function advanceStatus(id: string, current: string) {
  const next = nextStatus(current);
  if (!next) return;
  const data: { status: OrderStatus; trackingNumber?: string } = { status: next };
  if (next === 'shipped' && trackingInputs.value[id]?.trim()) {
    data.trackingNumber = trackingInputs.value[id]!.trim();
  }
  await orderStore.updateOrder(id, data);
  if (next === 'shipped') {
    trackingInputs.value[id] = '';
  }
}

async function cancelOrder(id: string) {
  await orderStore.updateOrder(id, { status: 'cancelled' });
}

function formatPrice(val: number) {
  return val.toLocaleString('fr-FR');
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function canCancel(status: string) {
  return status === 'pending' || status === 'confirmed';
}

onMounted(async () => {
  await orderStore.getOrders();
  loading.value = false;
});
</script>

<template>
  <div class="so">
    <div class="so__header reveal">
      <h2>Commandes de ma boutique</h2>
      <p class="so__sub">Suivez et gérez l'avancement des commandes</p>
    </div>

    
    <p v-if="loading" class="so__state">
      <span class="so__spinner" />
      Chargement…
    </p>

    
    <p v-else-if="!orders.length" class="so__state so__state--empty">
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
      Aucune commande pour le moment.
    </p>

    
    <div v-else class="so__table-wrap reveal reveal--d1">
      <table class="so__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Articles</th>
            <th>Total</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td class="so__td-id">{{ order.id.slice(0, 8) }}…</td>
            <td>
              <div class="so__customer">
                <strong>{{ order.user?.fullName ?? '—' }}</strong>
                <span v-if="order.user?.email" class="so__email">{{ order.user.email }}</span>
              </div>
            </td>
            <td>
              <span class="so__count">{{ order.orderItems.length }}</span>
            </td>
            <td class="so__td-price">{{ formatPrice(order.total) }} FCFA</td>
            <td class="so__td-date">{{ formatDate(order.createdAt) }}</td>
            <td>
              <span class="so__badge" :class="statusClass(order.status)">
                {{ statusLabel[order.status] ?? order.status }}
              </span>
            </td>
            <td>
              <div v-if="order.status !== 'cancelled' && order.status !== 'completed'" class="so__actions">
                
                <input
                  v-if="order.status === 'confirmed'"
                  v-model="trackingInputs[order.id]"
                  class="so__tracking-input"
                  type="text"
                  placeholder="N° tracking"
                />
                <button
                  v-if="nextStatus(order.status)"
                  class="so__btn so__btn--primary"
                  @click="advanceStatus(order.id, order.status)"
                >
                  {{ nextStatusLabel(order.status) }}
                </button>
                <button
                  v-if="canCancel(order.status)"
                  class="so__btn so__btn--danger"
                  @click="cancelOrder(order.id)"
                >
                  Annuler
                </button>
              </div>
              <span v-else class="so__td-date">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.so {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.so__header h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-heading);
  margin-bottom: 0.15rem;
}

.so__sub {
  font-size: 0.88rem;
  color: var(--color-text-soft);
}

.so__state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 3rem 1rem;
  color: var(--color-text-soft);
  font-weight: 500;
}

.so__state--empty {
  flex-direction: column;
}

.so__spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.so__table-wrap {
  overflow-x: auto;
}

.so__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.so__table th {
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-soft);
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.so__table td {
  padding: 0.7rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-heading);
}

.so__table tbody tr:hover {
  background: var(--color-primary-soft);
}

.so__td-id {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.82rem;
  color: var(--color-text-soft);
  white-space: nowrap;
}

.so__customer {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.so__customer strong {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-heading);
}

.so__email {
  font-size: 0.78rem;
  color: var(--color-text-soft);
}

.so__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.4rem;
  height: 1.4rem;
  padding: 0 0.35rem;
  border-radius: var(--radius-pill);
  background: var(--color-background-mute);
  font-size: 0.76rem;
  font-weight: 700;
}

.so__td-price {
  font-weight: 700;
  color: var(--color-primary);
  white-space: nowrap;
}

.so__td-date {
  font-size: 0.82rem;
  color: var(--color-text-soft);
  white-space: nowrap;
}

.so__badge {
  display: inline-flex;
  padding: 0.22rem 0.7rem;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 700;
}

.status--warning {
  background: var(--color-warning-bg);
  color: var(--color-warning-text);
}

.status--info {
  background: rgba(83, 128, 247, 0.12);
  color: var(--c-blue);
}

.status--shipped {
  background: rgba(34, 198, 166, 0.12);
  color: var(--c-teal);
}

.status--success {
  background: var(--color-success-bg);
  color: var(--color-success-text);
}

.status--danger {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.so__actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.so__tracking-input {
  width: 110px;
  padding: 0.35rem 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-heading);
  font-size: 0.82rem;
}

.so__tracking-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.so__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-pill);
  border: none;
  font-weight: 700;
  font-size: 0.76rem;
  cursor: pointer;
  transition: background var(--duration-fast), color var(--duration-fast), transform var(--duration-fast);
}

.so__btn--primary {
  background: var(--gradient-brand);
  color: #fff;
}

.so__btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px var(--color-primary-glow);
}

.so__btn--danger {
  background: transparent;
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
}

.so__btn--danger:hover {
  background: var(--color-danger);
  color: var(--color-danger-contrast);
}

@media (max-width: 800px) {
  .so__table th:nth-child(3),
  .so__table td:nth-child(3),
  .so__table th:nth-child(4),
  .so__table td:nth-child(4),
  .so__table th:nth-child(5),
  .so__table td:nth-child(5) {
    display: none;
  }
}
</style>