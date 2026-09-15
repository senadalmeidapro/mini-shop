<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { API_CONFIG } from '@/api/config';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';
import { syncAfterCartChange } from '@/utils/sync';

const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();

const quantity = ref(1);

async function loadProduct(id: string) {
  await productStore.getProduct(id);
}

async function addProduct() {
  const ok = await cartStore.addItem(route.params.id as string, quantity.value);
  if (ok) {
    // Le stock réservé a changé côté serveur : on rafraîchit la fiche + le catalogue
    await syncAfterCartChange();
  }
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
    <!-- ═══════════════ VISUEL PRODUIT ═══════════════ -->
    <div class="detail__visual reveal">
      <div
        class="detail__media"
        :class="{ 'detail__media--out': productStore.product.stock === 0 }"
      >
        <img
          v-if="productStore.product.imageUrl"
          class="detail__image"
          :src="`${API_CONFIG.baseURL}${productStore.product.imageUrl}`"
          :alt="productStore.product.name"
        />
        <div v-else class="detail__placeholder" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="46"
            height="46"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <div class="detail__shine" aria-hidden="true" />
      </div>

      <span
        class="detail__badge"
        :class="{
          'detail__badge--low': productStore.product.stock > 0 && productStore.product.stock < 5,
          'detail__badge--out': productStore.product.stock === 0,
        }"
      >
        <span class="detail__badge-dot" aria-hidden="true" />
        <span v-if="productStore.product.stock === 0">Rupture de stock</span>
        <span v-else-if="productStore.product.stock < 5">Stock limité</span>
        <span v-else>En stock</span>
      </span>

      <div class="detail__blob" aria-hidden="true" />
    </div>

    <!-- ═══════════════ INFOS PRODUIT ═══════════════ -->
    <div class="detail__content reveal reveal--d1">
      <span class="detail__eyebrow">Détail produit</span>
      <h1 class="detail__title">{{ productStore.product.name }}</h1>

      <div class="detail__pricing">
        <span class="detail__price">{{ productStore.product.price }} FCFA</span>
        <small class="detail__stock">Stock : {{ productStore.product.stock }}</small>
      </div>

      <p class="detail__description">{{ productStore.product.description }}</p>

      <div class="detail__buy">
        <div class="detail__qty">
          <label for="qty">Qte :</label>
          <input
            id="qty"
            v-model.number="quantity"
            type="number"
            min="1"
            :max="productStore.product.stock"
          />
        </div>

        <button type="button" class="detail__btn" @click="addProduct">
          <svg
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          Commander
        </button>
      </div>
    </div>
  </div>

  <!-- ═══════════════ CHARGEMENT ═══════════════ -->
  <div v-else class="detail__loading">
    <span class="detail__spinner" aria-hidden="true" />
    <span>Chargement...</span>
  </div>
</template>

<style scoped>
/* ==========================================================================
   DÉTAIL PRODUIT
   ========================================================================== */
.detail {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: start;
  max-width: 1000px;
  margin: 0 auto;
}

/* ══════════════════ VISUEL ══════════════════ */
.detail__visual {
  position: relative;
}

.detail__media {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  background: var(--color-background-mute);
  box-shadow: var(--shadow-md);
  transition: box-shadow var(--duration) var(--ease-out);
}

.detail__media:hover {
  box-shadow: var(--shadow-lg);
}

.detail__media--out {
  opacity: 0.85;
}

.detail__image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  background: var(--color-background-mute);
  transition: transform 0.7s var(--ease-out);
}

.detail__media:hover .detail__image {
  transform: scale(1.05);
}

.detail__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 4 / 3;
  color: var(--color-text-soft);
  opacity: 0.5;
}

.detail__shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 25%,
    rgba(255, 255, 255, 0.18) 50%,
    transparent 75%
  );
  transform: translateX(-120%) skewX(-18deg);
  pointer-events: none;
}

.detail__media:hover .detail__shine {
  animation: shine-sweep 1.1s var(--ease-out) both;
}

.detail__badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.38rem 0.9rem;
  border-radius: var(--radius-pill);
  background: var(--color-success-bg);
  color: var(--color-success-text);
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: var(--shadow-sm);
}

.detail__badge--low {
  background: var(--color-warning-bg);
  color: var(--color-warning-text);
}

.detail__badge--out {
  background: var(--color-error-bg);
  color: var(--color-error-text);
}

.detail__badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse-dot 2.4s var(--ease-out) infinite;
}

.detail__blob {
  position: absolute;
  z-index: -1;
  width: 65%;
  height: 55%;
  bottom: -12%;
  right: -10%;
  border-radius: var(--radius-pill);
  background: var(--gradient-brand);
  opacity: 0.08;
  filter: blur(36px);
}

/* ══════════════════ CONTENU ══════════════════ */
.detail__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.detail__eyebrow {
  padding: 0.28rem 0.85rem;
  border-radius: var(--radius-pill);
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.detail__title {
  margin-top: 0.8rem;
  font-size: clamp(1.7rem, 3.2vw, 2.4rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--color-heading);
}

.detail__pricing {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-wrap: wrap;
  margin-top: 1.1rem;
}

.detail__price {
  font-size: 1.75rem;
  font-weight: 800;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.detail__stock {
  padding: 0.3rem 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-text-soft);
  font-size: 0.82rem;
  font-weight: 600;
}

.detail__description {
  margin-top: 1.2rem;
  font-size: 1rem;
  line-height: 1.75;
  color: var(--color-text);
}

/* ══════════════════ ACHAT ══════════════════ */
.detail__buy {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 1.8rem;
  padding-top: 1.4rem;
  border-top: 1px solid var(--color-border);
}

.detail__qty {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.detail__qty label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-soft);
}

.detail__qty input {
  width: 5.2rem;
  padding: 0.68rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-text);
  font-weight: 600;
  outline: none;
  transition:
    border-color var(--duration),
    box-shadow var(--duration);
}

.detail__qty input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 var(--ring-width) var(--color-focus);
}

.detail__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 180px;
  padding: 0.8rem 1.8rem;
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
    box-shadow var(--duration);
}

.detail__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 38px var(--color-primary-glow);
}

.detail__btn:active {
  transform: translateY(0);
}

/* ══════════════════ CHARGEMENT ══════════════════ */
.detail__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  padding: 4rem 1.5rem;
  color: var(--color-text-soft);
  font-weight: 600;
}

.detail__spinner {
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  animation: detail-spin 0.8s linear infinite;
}

@keyframes detail-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ══════════════════ RESPONSIVE ══════════════════ */
@media (max-width: 860px) {
  .detail {
    grid-template-columns: 1fr;
  }

  .detail__visual {
    max-width: 560px;
    width: 100%;
    margin-inline: auto;
  }
}
</style>