<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const form = reactive({
  fullName: '',
  email: '',
  password: '',
});

const loading = ref(false);

async function handleSubmit() {
  loading.value = true;

  try {
    await userStore.postUser(form);
    form.fullName = '';
    form.email = '';
    form.password = '';
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <form class="user-form" @submit.prevent="handleSubmit">
    <h3>Ajouter un utilisateur</h3>

    <label>
      Nom complet
      <input v-model="form.fullName" type="text" />
    </label>
    <label>
      Email
      <input v-model="form.email" type="email" required />
    </label>
    <label>
      Mot de passe
      <input v-model="form.password" type="password" required />
    </label>

    <button type="submit" :disabled="loading">
      {{ loading ? 'Création...' : 'Créer' }}
    </button>
  </form>
</template>

<style scoped>
.user-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.user-form h3 {
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.user-form label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
}

.user-form input {
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-text);
  outline: none;
  transition: border-color 0.2s;
}

.user-form input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-focus);
}

.user-form button {
  padding: 0.65rem;
  border: none;
  border-radius: var(--radius-md);
  background-color: var(--color-primary);
  color: var(--color-primary-contrast);
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.2s,
    opacity 0.2s;
}

.user-form button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.user-form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>