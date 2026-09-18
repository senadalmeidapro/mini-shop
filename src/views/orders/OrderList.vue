<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useOrderStore } from '@/stores/orderStore';
import { usePaymentStore } from '@/stores/paymentStore';
import { ENDPOINTS } from '@/api';
import { http } from '@/api/http';
import { syncAfterCancel } from '@/utils/sync';

const orderStore = useOrderStore();
const paymentStore = usePaymentStore();

const orders = computed(() => orderStore.orders);
const downloadingOrderId = ref<string | null>(null);

const paymentByOrder = computed(() => {
  const map = new Map<string, string>();
  for (const payment of paymentStore.payments) {
    map.set(payment.orderId, payment.id);
  }
  return map;
});

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

async function downloadInvoice(orderId: string) {
  downloadingOrderId.value = orderId;
  try {
    const response = await http.get<Blob>(ENDPOINTS.orders.invoice(orderId), {
      responseType: 'blob',
    });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `facture-${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } finally {
    downloadingOrderId.value = null;
  }
}

onMounted(async () => {
  await Promise.all([orderStore.getOrders(), paymentStore.getMyPayments()]);
});

async function cancelOrder(orderId: string) {
  const paymentId = paymentByOrder.value.get(orderId);
  if (!paymentId) return;

  const ok = await paymentStore.cancelPayment(paymentId);
  if (ok) {
    
    await syncAfterCancel();
  }
}
</script>
<template>
  <div class="orders">
    
    <header class="orders__header reveal">
      <span class="orders__logo" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="M3.3 7.23 12 12l8.7-4.77" />
          <path d="M12 22V12" />
        </svg>
      </span>

      <div class="orders__heading">
        <h3 class="orders__title">Mes commandes</h3>
        <p class="orders__subtitle">Retrouvez vos commandes et téléchargez vos factures.</p>
      </div>
    </header>

    
    <div v-if="orders.length === 0" class="orders__empty">
      <span class="orders__empty-icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
          <path d="M9 9h6" />
        </svg>
      </span>
      <strong>Aucune commande</strong>
    </div>

    
    <div v-for="order in orders" :key="order.id" class="order">
      <div class="order__main">
        <div class="order__row">
          <span class="order__ref">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Commande #{{ order.id }}
          </span>

          <span
            class="order__status"
            :class="`order__status--${order.status}`"
          >
            <span class="order__dot" aria-hidden="true" />
            {{ statusLabel(order.status) }}
          </span>
        </div>

        <div class="order__info">
          <span class="order__meta">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="M3.3 7.23 12 12l8.7-4.77" />
              <path d="M12 22V12" />
            </svg>
            {{ order.orderItems.length }} article(s)
          </span>
          <span class="order__meta order__meta--price">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.42 0l8.58-8.58a1 1 0 0 0 0-1.42L12 2Z" />
              <path d="M7 7h.01" />
            </svg>
            Total: {{ order.total }} FCFA
          </span>
        </div>
      </div>

      <div class="order__actions">
        <button
          type="button"
          class="order__invoice"
          :disabled="downloadingOrderId === order.id"
          @click="downloadInvoice(order.id)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M12 11v6" />
            <path d="m8 14 4 4 4-4" />
          </svg>
          {{ downloadingOrderId === order.id ? 'Téléchargement…' : 'Facture PDF' }}
        </button>
        <button
          v-if="order.status === 'pending'"
          class="order__cancel"
          @click="cancelOrder(order.id)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.orders {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.orders__header {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1.1rem 1.25rem;
  margin-bottom: 0.4rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: linear-gradient(180deg, var(--color-background-soft), var(--color-background));
  box-shadow: var(--shadow-sm);
}

.orders__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.9rem;
  height: 2.9rem;
  flex-shrink: 0;
  border-radius: var(--radius-lg);
  background: var(--gradient-brand);
  color: var(--color-primary-contrast);
  box-shadow: var(--shadow-glow);
}

.orders__heading {
  display: flex;
  flex-direction: column;
}

.orders__title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-heading);
}

.orders__subtitle {
  font-size: 0.88rem;
  color: var(--color-text-soft);
}

.orders__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  padding: 3rem 1.5rem;
  text-align: center;
  border: 1px dashed var(--color-border-hover);
  border-radius: var(--radius-xl);
  background: var(--color-background-soft);
  color: var(--color-text-soft);
}

.orders__empty strong {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-heading);
}

.orders__empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  margin-bottom: 0.3rem;
  border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  animation: none;
}

.order {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1.15rem 1.25rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  transition:
    transform var(--duration) var(--ease-out),
    border-color var(--duration),
    box-shadow var(--duration);
}

.order:hover {
  transform: translateY(-3px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

.order__main {
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.order__row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-wrap: wrap;
}

.order__ref {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-heading);
}

.order__ref svg {
  width: 16px;
  height: 16px;
  color: var(--color-primary);
}

.order__status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-left: auto;
  padding: 0.28rem 0.8rem;
  border-radius: var(--radius-pill);
  background: var(--color-success-bg);
  color: var(--color-success-text);
  font-size: 0.78rem;
  font-weight: 700;
}

.order__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.order__status--pending {
  background: var(--color-warning-bg);
  color: var(--color-warning-text);
}

.order__status--cancelled {
  background: var(--color-error-bg);
  color: var(--color-error-text);
}

.order__info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.order__meta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-text-soft);
  font-size: 0.9rem;
  font-weight: 600;
}

.order__meta svg {
  width: 15px;
  height: 15px;
  color: var(--color-primary);
}

.order__meta--price {
  color: var(--color-heading);
  font-size: 1rem;
  font-weight: 800;
}

.order__meta--price svg {
  width: 15px;
  height: 15px;
}

.order__actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.order__invoice {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1.1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-text);
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition:
    border-color var(--duration),
    color var(--duration),
    transform var(--duration) var(--ease-out),
    box-shadow var(--duration);
}

.order__invoice svg {
  width: 15px;
  height: 15px;
  color: var(--color-primary);
}

.order__invoice:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.order__invoice:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.order__cancel {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1.1rem;
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-danger);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color var(--duration),
    color var(--duration),
    transform var(--duration) var(--ease-out);
}

.order__cancel svg {
  width: 15px;
  height: 15px;
}

.order__cancel:hover {
  background: var(--color-danger);
  color: var(--color-danger-contrast);
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .order {
    flex-direction: column;
    align-items: stretch;
  }

  .order__row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .order__status {
    margin-left: 0;
  }

  .order__actions {
    justify-content: flex-end;
  }
}
</style>
