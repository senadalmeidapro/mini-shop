<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import type { User } from '@/types';
import { roleLabel } from '@/utils/roles';

const userStore = useUserStore();

const users = computed(() => userStore.users?.items ?? []);

const editingId = ref<string | null>(null);
const form = reactive({
  fullName: '',
  email: '',
  password: '',
});

const isEditing = computed(() => editingId.value !== null);

function resetForm() {
  editingId.value = null;
  form.fullName = '';
  form.email = '';
  form.password = '';
}

function startEdit(user: User) {
  editingId.value = user.id;
  form.fullName = user.fullName ?? '';
  form.email = user.email;
  form.password = '';
}

async function handleSubmit() {
  if (isEditing.value) {
    await userStore.updateUser(editingId.value!, {
      fullName: form.fullName || undefined,
      email: form.email || undefined,
      password: form.password || undefined,
    });
  } else {
    await userStore.postUser({
      fullName: form.fullName || undefined,
      email: form.email,
      password: form.password,
    });
  }

  resetForm();
}

async function handleDelete(id: string) {
  await userStore.deleteUser(id);
}

onMounted(async () => {
  await userStore.getUsers();
});
</script>
<template>
  <div class="users">
    <div class="users__header reveal">
      <h2>Gestion des utilisateurs</h2>
      <p class="users__sub">Administrez les comptes de votre boutique</p>
    </div>

    <form class="users__form reveal reveal--d1" @submit.prevent="handleSubmit">
      <input v-model="form.fullName" type="text" placeholder="Nom complet" />
      <input v-model="form.email" type="email" placeholder="Email" required />
      <input
        v-model="form.password"
        type="password"
        :placeholder="isEditing ? 'Nouveau mot de passe' : 'Mot de passe'"
        :required="!isEditing"
      />

      <div class="users__form-actions">
        <button type="submit" class="btn btn--primary">
          <svg v-if="!isEditing" viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/></svg>
          {{ isEditing ? 'Mettre à jour' : 'Créer' }}
        </button>
        <button v-if="isEditing" type="button" class="btn btn--ghost" @click="resetForm">Annuler</button>
      </div>
    </form>

    <div class="users__table-wrap reveal reveal--d2">
      <table class="users__table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td class="users__name">{{ user.fullName ?? '—' }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="badge" :class="`badge--${user.role}`">{{ roleLabel(user.role) }}</span>
            </td>
            <td>
              <div class="users__actions">
                <button class="btn btn--primary btn--sm" @click="startEdit(user)">
                  <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z"/></svg>
                  Modifier
                </button>
                <button class="btn btn--danger btn--sm" @click="handleDelete(user.id)">
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
.users__header {
  margin-bottom: 1.5rem;
}

.users__header h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-heading);
  margin-bottom: 0.2rem;
}

.users__sub {
  font-size: 0.88rem;
  color: var(--color-text-soft);
}

.users__form {
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

.users__form input {
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

.users__form input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-focus);
}

.users__form-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.users__table-wrap {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-background-soft);
  box-shadow: var(--shadow-sm);
}

.users__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 420px;
}

.users__table th,
.users__table td {
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.users__table th {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-soft);
  background: var(--color-background-soft);
  font-weight: 700;
  white-space: nowrap;
}

.users__table tbody tr {
  transition: background var(--duration-fast) var(--ease-out);
}

.users__table tbody tr:hover {
  background: var(--color-primary-soft);
}

.users__table tbody tr:last-child td {
  border-bottom: none;
}

.users__name {
  font-weight: 600;
  color: var(--color-heading);
}

.users__actions {
  display: flex;
  gap: 0.35rem;
  align-items: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.7rem;
  border-radius: var(--radius-pill);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: capitalize;
  background: var(--color-background-mute);
  color: var(--color-text);
}

.badge--admin {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.badge--supplier {
  background: var(--color-warning-soft, var(--color-background-mute));
  color: var(--color-warning, var(--color-text));
}

.badge--user {
  background: var(--color-background-mute);
  color: var(--color-text);
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
