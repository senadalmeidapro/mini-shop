<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue';
import { API_CONFIG } from '@/api/config';
import { useProductStore } from '@/stores/productStore';
import { useCategoryStore } from '@/stores/categoryStore';
import type { Product } from '@/types';

const productStore = useProductStore();
const categoryStore = useCategoryStore();

const products = computed(() => productStore.products);
const categories = computed(() => categoryStore.categories);

const categoryName = (categoryId: string) =>
  categories.value.find((c) => c.id === categoryId)?.name ?? '—';

const editingId = ref<string | null>(null);
const file = ref<File | null>(null);
const stockAdjust = ref<Record<string, number>>({});

const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  categoryId: '',
});

const isEditing = computed(() => editingId.value !== null);

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  file.value = input.files?.[0] ?? null;
};

function resetForm() {
  editingId.value = null;
  form.name = '';
  form.description = '';
  form.price = 0;
  form.stock = 0;
  form.categoryId = '';
  file.value = null;
}

function startEdit(product: Product) {
  editingId.value = product.id;
  form.name = product.name;
  form.description = product.description;
  form.price = product.price;
  form.stock = product.stock;
  form.categoryId = product.categoryId;
  file.value = null;
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
    await productStore.updateProduct(editingId.value!, data);
  } else {
    await productStore.createProduct(form.categoryId, data);
  }

  resetForm();
}

async function handleDelete(id: string) {
  await productStore.deleteProduct(id);
}

async function adjustStock(product: Product) {
  const delta = stockAdjust.value[product.id];
  if (!delta || delta === 0) return;

  const data = new FormData();
  data.append('stock', String(product.stock + delta));

  await productStore.updateProduct(product.id, data);
  stockAdjust.value[product.id] = 0;
}

onMounted(async () => {
  await Promise.all([productStore.getProducts(), categoryStore.getCategories()]);
});
</script>
<template>
  <div class="products">
    <div class="products__header reveal">
      <h2>Gestion des produits</h2>
      <p class="products__sub">Ajoutez, modifiez ou supprimez vos articles</p>
    </div>

    <form class="products__form reveal reveal--d1" @submit.prevent="handleSubmit">
      <input v-model="form.name" type="text" placeholder="Nom" required />
      <input
        class="products__form-file"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        @change="handleFileChange"
      />
      <input v-model="form.description" type="text" placeholder="Description" required />
      <input
        v-model.number="form.price"
        type="number"
        min="0"
        step="0.01"
        placeholder="Prix"
        required
      />
      <input v-model.number="form.stock" type="number" min="0" placeholder="Stock" required />

      <select v-model="form.categoryId" :required="!isEditing">
        <option value="" disabled>Catégorie</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>

      <div class="products__form-actions">
        <button type="submit" class="btn btn--primary">
          <svg v-if="!isEditing" viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/></svg>
          {{ isEditing ? 'Mettre à jour' : 'Créer' }}
        </button>
        <button v-if="isEditing" type="button" class="btn btn--ghost" @click="resetForm">Annuler</button>
      </div>
    </form>

    <div class="products__table-wrap reveal reveal--d2">
      <table class="products__table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Ajuster stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>
              <img
                v-if="product.imageUrl"
                class="products__table-img"
                :src="`${API_CONFIG.baseURL}${product.imageUrl}`"
                :alt="product.name"
              />
              <span v-else class="products__no-img">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
              </span>
            </td>
            <td class="products__name">{{ product.name }}</td>
            <td>{{ categoryName(product.categoryId) }}</td>
            <td class="products__price">{{ product.price }} FCFA</td>
            <td>
              <span class="products__stock-badge" :class="{ 'products__stock-badge--out': product.stock === 0 }">{{ product.stock }}</span>
            </td>
            <td>
              <div class="products__stock-adjust">
                <input
                  v-model.number="stockAdjust[product.id]"
                  type="number"
                  class="products__stock-input"
                  placeholder="+/-"
                />
                <button
                  class="btn btn--primary btn--sm"
                  :disabled="!stockAdjust[product.id]"
                  @click="adjustStock(product)"
                >
                  OK
                </button>
              </div>
            </td>
            <td>
              <div class="products__actions">
                <button class="btn btn--primary btn--sm" @click="startEdit(product)">
                  <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z"/></svg>
                  Modifier
                </button>
                <button class="btn btn--danger btn--sm" @click="handleDelete(product.id)">
                  <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor"><path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.519.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd"/></svg>
                  Supprimer
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.products__header {
  margin-bottom: 1.5rem;
}

.products__header h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-heading);
  margin-bottom: 0.2rem;
}

.products__sub {
  font-size: 0.88rem;
  color: var(--color-text-soft);
}

.products__form {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.products__form input,
.products__form select {
  flex: 1;
  min-width: 140px;
  padding: 0.6rem 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.9rem;
  outline: none;
  transition:
    border-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

.products__form input[type='file'] {
  flex: 0 1 auto;
  min-width: 0;
  padding: 0.45rem 0.55rem;
  font-size: 0.82rem;
}

.products__form input:focus,
.products__form select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-focus);
}

.products__form-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.products__table-wrap {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-background-soft);
  box-shadow: var(--shadow-sm);
}

.products__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

.products__table th,
.products__table td {
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.products__table th {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-soft);
  background: var(--color-background-soft);
  font-weight: 700;
  white-space: nowrap;
}

.products__table tbody tr {
  transition: background var(--duration-fast) var(--ease-out);
}

.products__table tbody tr:hover {
  background: var(--color-primary-soft);
}

.products__table tbody tr:last-child td {
  border-bottom: none;
}

.products__name {
  font-weight: 600;
  color: var(--color-heading);
}

.products__price {
  font-weight: 700;
  color: var(--color-primary);
  white-space: nowrap;
}

.products__stock-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  padding: 0.15rem 0.55rem;
  border-radius: var(--radius-pill);
  font-size: 0.82rem;
  font-weight: 700;
  background: var(--color-success-bg);
  color: var(--color-success-text);
}

.products__stock-badge--out {
  background: var(--color-error-bg);
  color: var(--color-error-text);
}

.products__table-img {
  width: 44px;
  height: 44px;
  object-fit: contain;
  padding: 2px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-background-mute);
}

.products__no-img {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--color-background-mute);
  color: var(--color-text-soft);
}

.products__stock-adjust {
  display: flex;
  gap: 0.35rem;
  align-items: center;
}

.products__stock-input {
  width: 3.8rem;
  padding: 0.35rem 0.45rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.85rem;
  text-align: center;
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-out);
}

.products__stock-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-focus);
}

.products__actions {
  display: flex;
  gap: 0.35rem;
  align-items: center;
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

.btn--primary:disabled {
  opacity: 0.45;
  pointer-events: none;
}

.btn--ghost {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-soft);
}

.btn--ghost:hover {
  border-color: var(--color-border-hover);
  color: var(--color-text);
  background: var(--color-background-mute);
}

.btn--danger {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.btn--danger:hover {
  background: var(--color-danger);
  color: var(--color-danger-contrast);
}

.btn--sm {
  padding: 0.3rem 0.7rem;
  font-size: 0.78rem;
}
</style>
