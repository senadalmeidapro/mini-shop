<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  email: '',
  password: '',
});

const loading = ref(false);

async function handleSubmit() {
  loading.value = true;

  try {
    await authStore.login(form);
    router.push({ name: 'Home' });
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <div class="login">
    <h2>Se connecter</h2>

    <form @submit.prevent="handleSubmit">
      <div class="login__field">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          autocomplete="email"
          placeholder="example@email.com"
          required
        />
      </div>
      <div class="login__field">
        <label for="password">Mot de passe</label>
        <input id="password" v-model="form.password" type="password" required />
      </div>

      <button class="login__submit" type="submit" :disabled="loading">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </form>

    <p class="login__switch">
      Pas encore de compte ? <RouterLink :to="{ name: 'Register' }">Créer un compte</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.login h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login__field {
  margin-bottom: 1rem;
}

.login__field label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.login__field input {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-text);
  outline: none;
  transition: border-color 0.2s;
}

.login__field input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-focus);
}

.login__submit {
  width: 100%;
  padding: 0.7rem;
  margin-top: 0.5rem;
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

.login__submit:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.login__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login__switch {
  margin-top: 1.25rem;
  text-align: center;
  font-size: 0.9rem;
}

.login__switch a {
  color: var(--color-primary);
  font-weight: 600;
}
</style>
