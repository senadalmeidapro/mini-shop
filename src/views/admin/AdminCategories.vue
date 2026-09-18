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
    <div class="categories__header reveal">
      <h2>Gestion des catégories</h2>
      <p class="categories__sub">Organisez vos produits par catégorie</p>
    </div>

    <form class="categories__form reveal reveal--d1" @submit.prevent="handleSubmit">
      <input v-model="form.name" type="text" placeholder="Nom" required />
      <input v-model="form.slug" type="text" placeholder="Slug" required />

      <div class="categories__form-actions">
        <button type="submit" class="btn btn--primary">
          <svg v-if="!isEditing" viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path
              d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"
            />
          </svg>
          {{ isEditing ? 'Mettre à jour' : 'Créer' }}
        </button>
        <button v-if="isEditing" type="button" class="btn btn--ghost" @click="resetForm">
          Annuler
        </button>
      </div>
    </form>

    <div class="categories__table-wrap reveal reveal--d2">
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
            <td class="categories__name">{{ category.name }}</td>
            <td>
              <code class="categories__slug">{{ category.slug }}</code>
            </td>
            <td>
              <div class="categories__actions">
                <button class="btn btn--primary btn--sm" @click="startEdit(category)">
                  <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
                    <path
                      d="M2.695 14.763l-1.262 3.154a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z"
                    />
                  </svg>
                  Modifier
                </button>
                <button class="btn btn--danger btn--sm" @click="handleDelete(category.id)">
                  <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.519.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                      clip-rule="evenodd"
                    />
                  </svg>
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
.categories__header {
  margin-bottom: 1.5rem;
}

.categories__header h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-heading);
  margin-bottom: 0.2rem;
}

.categories__sub {
  font-size: 0.88rem;
  color: var(--color-text-soft);
}

.categories__form {
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

.categories__form input {
  flex: 1;
  min-width: 160px;
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

.categories__form input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-focus);
}

.categories__form-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.categories__table-wrap {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-background-soft);
  box-shadow: var(--shadow-sm);
}

.categories__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 380px;
}

.categories__table th,
.categories__table td {
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.categories__table th {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-soft);
  background: var(--color-background-soft);
  font-weight: 700;
  white-space: nowrap;
}

.categories__table tbody tr {
  transition: background var(--duration-fast) var(--ease-out);
}

.categories__table tbody tr:hover {
  background: var(--color-primary-soft);
}

.categories__table tbody tr:last-child td {
  border-bottom: none;
}

.categories__name {
  font-weight: 600;
  color: var(--color-heading);
}

.categories__slug {
  display: inline-block;
  background: var(--color-background-mute);
  padding: 0.18rem 0.55rem;
  border-radius: var(--radius-sm);
  font-family: monospace;
  font-size: 0.82rem;
  color: var(--color-text-soft);
}

.categories__actions {
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
