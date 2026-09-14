<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { usePaymentStore } from '@/stores/paymentStore';

const paymentStore = usePaymentStore();
const loading = ref(true);

const payments = computed(() => paymentStore.payments);

async function cancelPayment(id: string) {
  await paymentStore.cancelPayment(id);
}

onMounted(async () => {
  await paymentStore.getPayments();
  loading.value = false;
});
</script>
<template>
  <div class="payments">
    <div class="payments__header reveal">
      <h2>Gestion des paiements</h2>
      <p class="payments__sub">Historique et suivi des transactions</p>
    </div>

    <p v-if="loading" class="payments__state">
      <span class="payments__spinner"></span>
      Chargement…
    </p>
    <p v-else-if="payments.length === 0" class="payments__state payments__state--empty">
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
      Aucun paiement
    </p>

    <div v-else class="payments__table-wrap reveal reveal--d1">
      <table class="payments__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Commande</th>
            <th>Montant</th>
            <th>Méthode</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="payment in payments" :key="payment.id">
            <td class="payments__id">{{ payment.id }}</td>
            <td class="payments__id">{{ payment.orderId }}</td>
            <td class="payments__amount">{{ payment.amount }} FCFA</td>
            <td>
              <span class="payments__method-badge">{{ payment.method }}</span>
            </td>
            <td>
              <span class="badge" :class="`badge--${payment.status}`">{{ payment.status }}</span>
            </td>
            <td>
              <button
                v-if="payment.status === 'pending' || payment.status === 'failed'"
                class="btn btn--danger btn--sm"
                @click="cancelPayment(payment.id)"
              >
                <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clip-rule="evenodd"/></svg>
                Annuler
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.payments__header {
  margin-bottom: 1.5rem;
}

.payments__header h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-heading);
  margin-bottom: 0.2rem;
}

.payments__sub {
  font-size: 0.88rem;
  color: var(--color-text-soft);
}

.payments__state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 3rem 1rem;
  color: var(--color-text-soft);
  font-weight: 500;
}

.payments__state--empty {
  flex-direction: column;
  color: var(--color-text-soft);
}

.payments__spinner {
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

.payments__table-wrap {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-background-soft);
  box-shadow: var(--shadow-sm);
}

.payments__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 580px;
}

.payments__table th,
.payments__table td {
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.payments__table th {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-soft);
  background: var(--color-background-soft);
  font-weight: 700;
  white-space: nowrap;
}

.payments__table tbody tr {
  transition: background var(--duration-fast) var(--ease-out);
}

.payments__table tbody tr:hover {
  background: var(--color-primary-soft);
}

.payments__table tbody tr:last-child td {
  border-bottom: none;
}

.payments__id {
  font-family: monospace;
  font-size: 0.82rem;
  color: var(--color-text-soft);
}

.payments__amount {
  font-weight: 700;
  color: var(--color-primary);
  white-space: nowrap;
}

.payments__method-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.65rem;
  border-radius: var(--radius-pill);
  font-size: 0.78rem;
  font-weight: 600;
  background: var(--color-background-mute);
  color: var(--color-text);
  text-transform: capitalize;
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

.badge--succeeded {
  background: var(--color-success-bg);
  color: var(--color-success-text);
}

.badge--failed,
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

.btn--danger {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.btn--danger:hover {
  background: var(--color-danger);
  color: var(--color-danger-contrast);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(224, 48, 48, 0.3);
}

.btn--sm {
  padding: 0.3rem 0.7rem;
  font-size: 0.78rem;
}
</style>
