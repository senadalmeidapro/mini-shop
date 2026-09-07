<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue';
import { useCategoryStore } from '@/stores/categoryStore';
import type { Category } from '@/types';

const categoryStore = useCategoryStore();

const categories = computed(() => categoryStore.categories);

const editingId = ref<string | null>(null);
const form = reactive({
  name: '',
  slug: '',
});

const isEditing = computed(() => editingId.value !== null);

function resetForm() {
  editingId.value = null;
  form.name = '';
  form.slug = '';
}

function startEdit(category: Category) {
  editingId.value = category.id;
  form.name = category.name;
  form.slug = category.slug;
}

async function handleSubmit() {
  if (isEditing.value) {
    await categoryStore.updateCategory(editingId.value!, {
      name: form.name || undefined,
      slug: form.slug || undefined,
    });
  } else {
    await categoryStore.createCategory({ name: form.name, slug: form.slug });
  }

  resetForm();
}

async function handleDelete(id: string) {
  await categoryStore.deleteCategory(id);
}

onMounted(async () => {
  await categoryStore.getCategories();
});
</script>
<template>
  <div class="categories">
    <h2>Gestion des catégories</h2>

    <form class="categories__form" @submit.prevent="handleSubmit">
      <input v-model="form.name" type="text" placeholder="Nom" required />
      <input v-model="form.slug" type="text" placeholder="Slug" required />

      <div class="categories__form-actions">
        <button type="submit">{{ isEditing ? 'Mettre à jour' : 'Créer' }}</button>
        <button v-if="isEditing" type="button" class="secondary" @click="resetForm">
          Annuler
        </button>
      </div>
    </form>

    <table class="categories__table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Slug</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category.id">
          <td>{{ category.name }}</td>
          <td><code>{{ category.slug }}</code></td>
          <td>
            <button @click="startEdit(category)">Modifier</button>
            <button class="danger" @click="handleDelete(category.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.categories h2 {
  margin-bottom: 1.5rem;
}

.categories__form {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 1rem;
  margin-bottom: 1.5rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.categories__form input {
  flex: 1;
  min-width: 160px;
  padding: 0.55rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text);
  outline: none;
  transition: border-color 0.2s;
}

.categories__form input:focus {
  border-color: #42b883;
}

.categories__form-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.categories__form button,
.categories__table button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background-color: #42b883;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.categories__form button:hover,
.categories__table button:hover {
  background-color: #35a06c;
}

.categories__form button.secondary,
.categories__table button.danger {
  background-color: transparent;
  border: 1px solid #e03030;
  color: #e03030;
}

.categories__form button.secondary:hover,
.categories__table button.danger:hover {
  background-color: #e03030;
  color: #fff;
}

.categories__table {
  width: 100%;
  border-collapse: collapse;
}

.categories__table th,
.categories__table td {
  text-align: left;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.categories__table th {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text);
  opacity: 0.7;
}

.categories__table code {
  background: var(--color-background-mute);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}
</style>