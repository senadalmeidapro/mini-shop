<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue';
import { API_CONFIG } from '@/api/config';
import { useSupplierStore } from '@/stores/supplierStore';
import { useCategoryStore } from '@/stores/categoryStore';
import type { Product } from '@/types';

const supplierStore = useSupplierStore();
const categoryStore = useCategoryStore();

const products = computed(() => supplierStore.myProducts);
const categories = computed(() => categoryStore.categories);

const editingId = ref<string | null>(null);
const file = ref<File | null>(null);
const showForm = ref(false);
const deleteId = ref<string | null>(null);

const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  categoryId: '',
});

const isEditing = computed(() => editingId.value !== null);

const categoryName = (categoryId: string) =>
  categories.value.find((c) => c.id === categoryId)?.name ?? '—';

function resetForm() {
  editingId.value = null;
  form.name = '';
  form.description = '';
  form.price = 0;
  form.stock = 0;
  form.categoryId = '';
  file.value = null;
  showForm.value = false;
}

function openCreate() {
  resetForm();
  showForm.value = true;
}

function startEdit(product: Product) {
  editingId.value = product.id;
  form.name = product.name;
  form.description = product.description;
  form.price = product.price;
  form.stock = product.stock;
  form.categoryId = product.categoryId;
  file.value = null;
  showForm.value = true;
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  file.value = input.files?.[0] ?? null;
}

async function handleSubmit() {
  const data = new FormData();
  data.append('name', form.name);
  data.append('description', form.description);
  data.append('price', String(form.price));
  data.append('stock', String(form.stock));
  if (file.value) {
    data.append('file', file.value);
  }

  if (isEditing.value) {
    await supplierStore.updateProduct(editingId.value!, data);
  } else {
    await supplierStore.createProduct(form.categoryId, data);
  }

  resetForm();
}

function confirmDelete(id: string) {
  deleteId.value = id;
}

async function handleDelete() {
  if (!deleteId.value) return;
  await supplierStore.deleteProduct(deleteId.value);
  deleteId.value = null;
}

function formatPrice(val: number) {
  return val.toLocaleString('fr-FR');
}

onMounted(async () => {
  await Promise.all([supplierStore.getMyProducts(), categoryStore.getCategories()]);
});
</script>

<template>
  <div class="sp">
    <div class="sp__header reveal">
      <div>
        <h2>Mes produits</h2>
        <p class="sp__sub">
          {{ products.length }} produit{{ products.length > 1 ? 's' : '' }} dans votre boutique
        </p>
      </div>
      <button class="sp__add-btn" @click="openCreate">
        <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
          <path
            d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"
          />
        </svg>
        Ajouter un produit
      </button>
    </div>

    <form v-if="showForm" class="sp__form reveal reveal--d1" @submit.prevent="handleSubmit">
      <h3 class="sp__form-title">{{ isEditing ? 'Modifier le produit' : 'Nouveau produit' }}</h3>
      <div class="sp__form-grid">
        <div class="sp__form-field">
          <label>Nom *</label>
          <input v-model="form.name" type="text" placeholder="Nom du produit" required />
        </div>
        <div class="sp__form-field">
          <label>Catégorie *</label>
          <select v-model="form.categoryId" required>
            <option value="" disabled>Choisir…</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
        <div class="sp__form-field">
          <label>Prix (FCFA) *</label>
          <input v-model.number="form.price" type="number" min="0" step="0.01" required />
        </div>
        <div class="sp__form-field">
          <label>Stock *</label>
          <input v-model.number="form.stock" type="number" min="0" required />
        </div>
        <div class="sp__form-field sp__form-field--wide">
          <label>Description *</label>
          <input v-model="form.description" type="text" placeholder="Description courte" required />
        </div>
        <div class="sp__form-field sp__form-field--wide">
          <label>Image</label>
          <input
            class="sp__form-file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            @change="handleFileChange"
          />
        </div>
      </div>
      <div class="sp__form-actions">
        <button type="submit" class="sp__btn sp__btn--primary">
          {{ isEditing ? 'Enregistrer' : 'Créer' }}
        </button>
        <button type="button" class="sp__btn sp__btn--ghost" @click="resetForm">Annuler</button>
      </div>
    </form>

    <p v-if="supplierStore.productsLoading" class="sp__state">
      <span class="sp__spinner" />
      Chargement…
    </p>

    <p v-else-if="!products.length && !showForm" class="sp__state sp__state--empty">
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m7.5 4.27 9 5.15" />
        <path
          d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
        />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
      Aucun produit. Commencez par en ajouter un !
    </p>

    <div v-else class="sp__grid">
      <div
        v-for="(product, i) in products"
        :key="product.id"
        class="sp__card reveal"
        :class="`reveal--d${(i % 6) + 1}`"
      >
        <div class="sp__card-img">
          <img
            v-if="product.imageUrl"
            :src="`${API_CONFIG.baseURL}${product.imageUrl}`"
            :alt="product.name"
          />
          <span v-else class="sp__card-img-fallback">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </span>
        </div>

        <div class="sp__card-body">
          <div class="sp__card-top">
            <span class="sp__card-cat">{{ categoryName(product.categoryId) }}</span>
            <span
              class="sp__card-stock"
              :class="
                product.stock === 0
                  ? 'sp__card-stock--out'
                  : product.stock <= (product.lowStockThreshold ?? 5)
                    ? 'sp__card-stock--low'
                    : 'sp__card-stock--ok'
              "
            >
              {{ product.stock }} en stock
            </span>
          </div>
          <h4 class="sp__card-name">{{ product.name }}</h4>
          <p class="sp__card-desc">{{ product.description }}</p>
          <strong class="sp__card-price">{{ formatPrice(product.price) }} FCFA</strong>
        </div>

        <div class="sp__card-actions">
          <button class="sp__action sp__action--edit" title="Modifier" @click="startEdit(product)">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path
                d="M2.695 14.763l-1.262 3.154a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z"
              />
            </svg>
          </button>
          <button
            class="sp__action sp__action--delete"
            title="Supprimer"
            @click="confirmDelete(product.id)"
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div v-if="deleteId === product.id" class="sp__confirm">
          <p>Supprimer « {{ product.name }} » ?</p>
          <div class="sp__confirm-btns">
            <button class="sp__btn sp__btn--danger" @click="handleDelete">Confirmer</button>
            <button class="sp__btn sp__btn--ghost" @click="deleteId = null">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sp {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sp__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}

.sp__header h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-heading);
  margin-bottom: 0.15rem;
}

.sp__sub {
  font-size: 0.88rem;
  color: var(--color-text-soft);
}

.sp__add-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-pill);
  border: none;
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

.sp__add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px var(--color-primary-glow);
}

.sp__form {
  padding: 1.5rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
}

.sp__form-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.sp__form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.sp__form-field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.sp__form-field--wide {
  grid-column: 1 / -1;
}

.sp__form-field label {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-soft);
}

.sp__form-field input,
.sp__form-field select {
  padding: 0.55rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-heading);
  font-size: 0.9rem;
  transition: border-color var(--duration-fast);
}

.sp__form-field input:focus,
.sp__form-field select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.sp__form-file {
  cursor: pointer;
}

.sp__form-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.1rem;
}

.sp__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-heading);
  transition:
    background var(--duration-fast),
    color var(--duration-fast),
    border-color var(--duration-fast);
}

.sp__btn--primary {
  background: var(--gradient-brand);
  color: #fff;
  border-color: transparent;
}

.sp__btn--danger {
  background: var(--color-danger);
  color: var(--color-danger-contrast);
  border-color: transparent;
}

.sp__btn--ghost {
  background: transparent;
  border-color: var(--color-border);
  color: var(--color-text-soft);
}

.sp__btn--danger:hover {
  background: var(--color-danger-hover);
}

.sp__state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 3rem 1rem;
  color: var(--color-text-soft);
  font-weight: 500;
}

.sp__state--empty {
  flex-direction: column;
}

.sp__spinner {
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

.sp__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.sp__card {
  position: relative;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition:
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out);
}

.sp__card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-glow);
  border-color: var(--color-primary);
}

.sp__card-img {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
  background: var(--color-background-mute);
  overflow: hidden;
}

.sp__card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s var(--ease-out);
}

.sp__card:hover .sp__card-img img {
  transform: scale(1.06);
}

.sp__card-img-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.sp__card-body {
  padding: 1rem 1.15rem 0.85rem;
}

.sp__card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.45rem;
}

.sp__card-cat {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--c-blue);
  background: rgba(83, 128, 247, 0.1);
  padding: 0.18rem 0.55rem;
  border-radius: var(--radius-pill);
}

.sp__card-stock {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-pill);
}

.sp__card-stock--ok {
  background: var(--color-success-bg);
  color: var(--color-success-text);
}

.sp__card-stock--low {
  background: var(--color-warning-bg);
  color: var(--color-warning-text);
}

.sp__card-stock--out {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.sp__card-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.sp__card-desc {
  font-size: 0.82rem;
  color: var(--color-text-soft);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.6rem;
}

.sp__card-price {
  display: block;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--color-primary);
}

.sp__card-actions {
  display: flex;
  gap: 0.35rem;
  padding: 0.65rem 1.15rem;
  border-top: 1px solid var(--color-border);
}

.sp__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-soft);
  cursor: pointer;
  transition:
    background var(--duration-fast),
    color var(--duration-fast),
    border-color var(--duration-fast),
    transform var(--duration-fast);
}

.sp__action:hover {
  transform: translateY(-1px);
}

.sp__action--edit:hover {
  border-color: var(--c-blue);
  background: rgba(83, 128, 247, 0.08);
  color: var(--c-blue);
}

.sp__action--delete:hover {
  border-color: var(--color-danger);
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.sp__confirm {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 1rem;
  background: color-mix(in srgb, var(--color-background) 92%, transparent);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: inherit;
  z-index: 5;
}

.sp__confirm p {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-heading);
  text-align: center;
}

.sp__confirm-btns {
  display: flex;
  gap: 0.4rem;
}
</style>
