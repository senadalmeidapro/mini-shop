<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';

const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();

const quantity = ref(1);

async function loadProduct(id: string) {
  await productStore.getProduct(id);
}

async function addProduct() {
  await cartStore.addItem(route.params.id as string, quantity.value);
}

onMounted(() => {
  loadProduct(route.params.id as string);
});

watch(
  () => route.params.id,
  (id) => {
    if (id) {
      loadProduct(id as string);
    }
  },
);
</script>

<template>
  <div v-if="productStore.product" class="detail">
    <h1>{{ productStore.product.name }}</h1>
    <p class="detail__description">{{ productStore.product.description }}</p>
    <span class="detail__price">{{ productStore.product.price }} &euro;</span>
    <small class="detail__stock">Stock : {{ productStore.product.stock }}</small>

    <div class="detail__buy">
      <label for="qty">Qte :</label>
      <input
        id="qty"
        v-model.number="quantity"
        type="number"
        min="1"
        :max="productStore.product.stock"
      />

      <button type="button" @click="addProduct">Commander</button>
    </div>
  </div>

  <div v-else class="detail__loading">Chargement...</div>
</template>

<style scoped>
.detail {
  max-width: 640px;
  margin: 0 auto;
}

.detail h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.detail__description {
  color: var(--color-text);
  opacity: 0.85;
  margin-bottom: 1rem;
}

.detail__price {
  font-size: 1.6rem;
  font-weight: 700;
  color: #42b883;
}

.detail__stock {
  display: block;
  margin-top: 0.25rem;
  color: var(--color-text);
  opacity: 0.7;
}

.detail__buy {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.detail__buy input {
  width: 5rem;
  padding: 0.55rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
}

.detail__buy button {
  padding: 0.6rem 1.6rem;
  border: none;
  border-radius: 6px;
  background-color: #42b883;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
}

.detail__buy button:hover {
  background-color: #35a06c;
}

.detail__loading {
  padding: 3rem;
  text-align: center;
  color: var(--color-text);
  opacity: 0.7;
}
</style>
