<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import { useAddressStore } from '@/stores/addressStore';
import { usePaymentStore } from '@/stores/paymentStore';

const cartStore = useCartStore();
const paymentStore = usePaymentStore();
const addressStore = useAddressStore();

const items = cartStore.totalPerItem;
const hasAddress = computed(() => addressStore.addresses.length > 0);

onMounted(async () => {
  await addressStore.getAddresses();
});

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
  if (!cartStore.cart?.id) return;

  await paymentStore.createPayment(cartStore.cart.id, { method: 'card' });
  cartStore.clearCart();
}
</script>
<template>
  <div class="cart">
    <h3>Mon panier</h3>

    <p v-if="items.length === 0" class="cart__empty">Votre panier est vide</p>

    <div v-for="item in items" :key="item.id" class="cart-item">
      <h5>{{ item.product.name }}</h5>
      <div class="cart-item__price">{{ item.product.price }} &euro; x {{ item.quantity }}</div>
      <div class="cart-item__actions">
        <button @click="decrease(item.id, item.quantity)">-</button>
        <button @click="increase(item.id, item.quantity)">+</button>
        <button class="cart-item__remove" @click="remove(item.id)">Retirer</button>
      </div>
      <div class="cart-item__total">Total: {{ item.total }} &euro;</div>
    </div>

    <div v-if="items.length > 0" class="cart-footer">
      <span class="cart-footer__total">Total: {{ cartStore.total }} &euro;</span>
      <button class="cart-footer__pay" :disabled="!hasAddress" @click="pay">Payer</button>
      <small v-if="!hasAddress">Ajoutez une adresse avant de payer</small>
    </div>
  </div>
</template>

<style scoped>
.cart__empty {
  color: var(--color-text);
  opacity: 0.7;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1rem;
  margin-bottom: 0.75rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.cart-item h5 {
  flex: 1;
  min-width: 150px;
  color: var(--color-heading);
}

.cart-item__price {
  color: var(--color-text);
  opacity: 0.85;
}

.cart-item__total {
  font-weight: 700;
  color: var(--color-primary);
}

.cart-item__actions {
  display: flex;
  gap: 0.4rem;
}

.cart-item__actions button {
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-background);
  color: var(--color-heading);
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.2s;
}

.cart-item__actions button:hover {
  border-color: var(--color-primary);
}

.cart-item__actions .cart-item__remove {
  width: auto;
  padding: 0 0.8rem;
  border-color: var(--color-danger);
  color: var(--color-danger);
  font-weight: 600;
}

.cart-item__actions .cart-item__remove:hover {
  background-color: var(--color-danger);
  color: var(--color-danger-contrast);
}

.cart-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.cart-footer__total {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-heading);
}

.cart-footer__pay {
  padding: 0.6rem 1.6rem;
  border: none;
  border-radius: var(--radius-sm);
  background-color: var(--color-primary);
  color: var(--color-primary-contrast);
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.2s,
    opacity 0.2s;
}

.cart-footer__pay:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.cart-footer__pay:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.cart-footer small {
  color: var(--color-danger);
}
</style>
