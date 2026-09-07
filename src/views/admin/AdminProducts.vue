<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue';
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
const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  categoryId: '',
});

const isEditing = computed(() => editingId.value !== null);

function resetForm() {
  editingId.value = null;
  form.name = '';
  form.description = '';
  form.price = 0;
  form.stock = 0;
  form.categoryId = '';
}

function startEdit(product: Product) {
  editingId.value = product.id;
  form.name = product.name;
  form.description = product.description;
  form.price = product.price;
  form.stock = product.stock;
  form.categoryId = product.categoryId;
}

async function handleSubmit() {
  const data = {
    name: form.name,
    description: form.description,
    price: form.price,
    stock: form.stock,
  };

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

onMounted(async () => {
  await Promise.all([productStore.getProducts(), categoryStore.getCategories()]);
});
</script>
<template>
  <div class="products">
    <h2>Gestion des produits</h2>

    <form class="products__form" @submit.prevent="handleSubmit">
      <input v-model="form.name" type="text" placeholder="Nom" required />
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
        <button type="submit">{{ isEditing ? 'Mettre à jour' : 'Créer' }}</button>
        <button v-if="isEditing" type="button" class="secondary" @click="resetForm">Annuler</button>
      </div>
    </form>

    <table class="products__table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Catégorie</th>
          <th>Prix</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ categoryName(product.categoryId) }}</td>
          <td>{{ product.price }} &euro;</td>
          <td>{{ product.stock }}</td>
          <td>
            <button @click="startEdit(product)">Modifier</button>
            <button class="danger" @click="handleDelete(product.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.products h2 {
  margin-bottom: 1.5rem;
}

.products__form {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 1rem;
  margin-bottom: 1.5rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.products__form input,
.products__form select {
  flex: 1;
  min-width: 140px;
  padding: 0.55rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-text);
  outline: none;
  transition: border-color 0.2s;
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

.products__form button,
.products__table button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--radius-sm);
  background-color: var(--color-primary);
  color: var(--color-primary-contrast);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.products__form button:hover,
.products__table button:hover {
  background-color: var(--color-primary-hover);
}

.products__form button.secondary,
.products__table button.danger {
  background-color: transparent;
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
}

.products__form button.secondary:hover,
.products__table button.danger:hover {
  background-color: var(--color-danger);
  color: var(--color-danger-contrast);
}

.products__table {
  width: 100%;
  border-collapse: collapse;
}

.products__table th,
.products__table td {
  text-align: left;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.products__table th {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text);
  opacity: 0.7;
}
</style>
