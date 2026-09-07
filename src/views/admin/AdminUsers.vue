<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import type { User } from '@/types';

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
    <h2>Gestion des utilisateurs</h2>

    <form class="users__form" @submit.prevent="handleSubmit">
      <input v-model="form.fullName" type="text" placeholder="Nom complet" />
      <input v-model="form.email" type="email" placeholder="Email" required />
      <input
        v-model="form.password"
        type="password"
        :placeholder="isEditing ? 'Nouveau mot de passe' : 'Mot de passe'"
        :required="!isEditing"
      />

      <div class="users__form-actions">
        <button type="submit">{{ isEditing ? 'Mettre à jour' : 'Créer' }}</button>
        <button v-if="isEditing" type="button" class="secondary" @click="resetForm">Annuler</button>
      </div>
    </form>

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
          <td>{{ user.fullName ?? '—' }}</td>
          <td>{{ user.email }}</td>
          <td>
            <span class="badge">{{ user.role }}</span>
          </td>
          <td>
            <button @click="startEdit(user)">Modifier</button>
            <button class="danger" @click="handleDelete(user.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.users h2 {
  margin-bottom: 1.5rem;
}

.users__form {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 1rem;
  margin-bottom: 1.5rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.users__form input {
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

.users__form input:focus {
  border-color: #42b883;
}

.users__form-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.users__form button,
.users__table button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background-color: #42b883;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.users__form button:hover,
.users__table button:hover {
  background-color: #35a06c;
}

.users__form button.secondary,
.users__table button.danger {
  background-color: transparent;
  border: 1px solid #e03030;
  color: #e03030;
}

.users__form button.secondary:hover,
.users__table button.danger:hover {
  background-color: #e03030;
  color: #fff;
}

.users__table {
  width: 100%;
  border-collapse: collapse;
}

.users__table th,
.users__table td {
  text-align: left;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.users__table th {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text);
  opacity: 0.7;
}

.users__table .badge {
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: var(--color-background-mute);
  font-size: 0.8rem;
}
</style>
