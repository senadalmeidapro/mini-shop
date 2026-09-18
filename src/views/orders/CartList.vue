<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import { usePaymentStore } from '@/stores/paymentStore';
import { useAuthStore } from '@/stores/authStore';
import { syncAfterCheckout } from '@/utils/sync';

const cartStore = useCartStore();
const paymentStore = usePaymentStore();
const authStore = useAuthStore();

const items = cartStore.totalPerItem;
const paying = ref(false);

function increase(itemId: string, quantity: number) {
  cartStore.updateItem(itemId, quantity + 1);
}

function decrease(itemId: string, quantity: number) {
  if (quantity > 1) cartStore.updateItem(itemId, quantity - 1);
}

function remove(itemId: string) {
  cartStore.removeItem(itemId);
}

async function pay() {
  if (!cartStore.cart?.id || paying.value) return;
  const cartId = cartStore.cart.id;

  paying.value = true;
  try {
    const ok = await paymentStore.createPayment(cartId, {
      method: 'card',
      shippingAddress: {
        fullName: authStore.user?.fullName ?? 'Client',
      },
    });

    if (ok) {
      await syncAfterCheckout();
    }
  } finally {
    paying.value = false;
  }
}
</script>
<template>
  <div class="cart">
    <header class="cart__header reveal">
      <span class="cart__logo" aria-hidden="true">
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
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </span>

      <div class="cart__heading">
        <h3 class="cart__title">Mon panier</h3>
        <p v-if="items.length" class="cart__subtitle">
          {{ items.length }} article{{ items.length > 1 ? 's' : '' }} dans votre panier
        </p>
      </div>

      <span v-if="items.length" class="cart__chip">{{ cartStore.itemCount }}</span>
    </header>

    <div v-if="items.length === 0" class="cart__empty">
      <span class="cart__empty-icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="26"
          height="26"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path
            d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
          />
        </svg>
      </span>
      <strong>Votre panier est vide</strong>
    </div>

    <div v-for="item in items" :key="item.id" class="cart-item">
      <span class="cart-item__media" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </span>

      <div class="cart-item__body">
        <h5 class="cart-item__name">{{ item.product.name }}</h5>
        <div class="cart-item__price">
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
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
          {{ item.product.price }} FCFA <span class="cart-item__times">×</span>
          {{ item.quantity }}
        </div>
      </div>

      <div class="cart-item__stepper">
        <button
          class="cart-item__step"
          :disabled="item.quantity <= 1"
          @click="decrease(item.id, item.quantity)"
          aria-label="Diminuer la quantité"
        >
          -
        </button>
        <span class="cart-item__qty">{{ item.quantity }}</span>
        <button
          class="cart-item__step"
          @click="increase(item.id, item.quantity)"
          aria-label="Augmenter la quantité"
        >
          +
        </button>
      </div>

      <div class="cart-item__side">
        <div class="cart-item__total">Total: {{ item.total }} FCFA</div>
        <button class="cart-item__remove" @click="remove(item.id)">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
          </svg>
          Retirer
        </button>
      </div>
    </div>

    <div v-if="items.length > 0" class="cart-footer">
      <div class="cart-footer__total">
        <span class="cart-footer__label">Total</span>
        <span class="cart-footer__amount">{{ cartStore.total }} FCFA</span>
      </div>

      <div class="cart-footer__actions">
        <span class="cart-footer__secure">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Paiement sécurisé
        </span>
        <button class="cart-footer__pay" :disabled="paying" @click="pay">
          <span v-if="paying" class="cart-footer__spinner" aria-hidden="true" />
          <template v-else>
            Payer
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart__header {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1.25rem 1.35rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: linear-gradient(180deg, var(--color-background-soft), var(--color-background));
  box-shadow: var(--shadow-sm);
}

.cart__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  border-radius: var(--radius-lg);
  background: var(--gradient-brand);
  color: var(--color-primary-contrast);
  box-shadow: var(--shadow-glow);
}

.cart__heading {
  display: flex;
  flex-direction: column;
}

.cart__title {
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--color-heading);
}

.cart__subtitle {
  font-size: 0.88rem;
  color: var(--color-text-soft);
}

.cart__chip {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.6rem;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  font-size: 0.9rem;
  font-weight: 800;
  box-shadow: var(--shadow-sm);
}

.cart__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  padding: 3.5rem 1.5rem;
  text-align: center;
  border: 1px dashed var(--color-border-hover);
  border-radius: var(--radius-xl);
  background: var(--color-background-soft);
  color: var(--color-text-soft);
}

.cart__empty strong {
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--color-heading);
}

.cart__empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.4rem;
  height: 3.4rem;
  margin-bottom: 0.3rem;
  border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  animation: none;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.15rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition:
    transform var(--duration) var(--ease-out),
    border-color var(--duration),
    box-shadow var(--duration);
}

.cart-item:hover {
  transform: translateY(-2px);
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
}

.cart-item__media {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.cart-item__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.cart-item__name {
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--color-heading);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item__price {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--color-text-soft);
  font-size: 0.9rem;
}

.cart-item__price svg {
  color: var(--color-primary);
}

.cart-item__times {
  color: var(--color-text-soft);
  opacity: 0.8;
}

.cart-item__stepper {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  padding: 0.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-background-mute);
}

.cart-item__step {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  height: 1.9rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-heading);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition:
    background-color var(--duration),
    color var(--duration),
    transform var(--duration) var(--ease-out);
}

.cart-item__step:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  transform: translateY(-1px);
}

.cart-item__step:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.cart-item__qty {
  min-width: 1.6rem;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--color-heading);
}

.cart-item__side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  min-width: 150px;
}

.cart-item__total {
  font-size: 1.02rem;
  font-weight: 800;
  color: var(--color-primary);
  white-space: nowrap;
}

.cart-item__remove {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-danger);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color var(--duration),
    color var(--duration),
    transform var(--duration) var(--ease-out);
}

.cart-item__remove svg {
  width: 14px;
  height: 14px;
}

.cart-item__remove:hover {
  background: var(--color-danger);
  color: var(--color-danger-contrast);
  transform: translateY(-1px);
}

.cart-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1.4rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background-soft);
  box-shadow: var(--shadow-sm);
}

.cart-footer__total {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.cart-footer__label {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-soft);
}

.cart-footer__amount {
  font-size: 1.6rem;
  font-weight: 800;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.cart-footer__actions {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-wrap: wrap;
}

.cart-footer__secure {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--color-text-soft);
  font-size: 0.82rem;
  font-weight: 600;
}

.cart-footer__secure svg {
  width: 14px;
  height: 14px;
  color: var(--color-primary);
}

.cart-footer__pay {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.9rem;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--gradient-brand);
  color: var(--color-primary-contrast);
  font-size: 0.98rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: var(--shadow-glow);
  transition:
    transform var(--duration) var(--ease-out),
    box-shadow var(--duration),
    opacity var(--duration);
}

.cart-footer__pay svg {
  width: 16px;
  height: 16px;
}

.cart-footer__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.cart-footer__pay:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 16px 38px var(--color-primary-glow);
}

.cart-footer__pay:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 700px) {
  .cart-item {
    flex-wrap: wrap;
    padding: 0.9rem;
  }

  .cart-item__body {
    flex-basis: calc(100% - 4.2rem);
  }

  .cart-item__stepper {
    margin-left: auto;
  }

  .cart-item__side {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-width: 0;
  }
}

@media (max-width: 480px) {
  .cart-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .cart-footer__actions {
    justify-content: space-between;
  }
}
</style>
