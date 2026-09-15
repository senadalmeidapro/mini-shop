<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const route = useRoute();
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

    const redirect = route.query.redirect;
    if (typeof redirect === 'string' && redirect.startsWith('/')) {
      router.push(redirect);
    } else {
      router.push({ name: 'Home' });
    }
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <div class="login">
    <h2 class="login__title reveal reveal--d2">Se connecter</h2>

    <form class="login__form" @submit.prevent="handleSubmit">
      <div class="login__field reveal reveal--d3">
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
      <div class="login__field reveal reveal--d4">
        <label for="password">Mot de passe</label>
        <input id="password" v-model="form.password" type="password" required />
        <RouterLink class="reset-password-request__link" :to="{ name: 'ResetPasswordRequest' }">
          Mot de passe oublié ?
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </RouterLink>
      </div>

      <button class="login__submit reveal reveal--d5" type="submit" :disabled="loading">
        <span v-if="loading" class="login__spinner"></span>
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </form>

    <p class="login__switch reveal reveal--d6">
      Pas encore de compte ?
      <RouterLink class="login__link" :to="{ name: 'Register' }">
        Créer un compte
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </RouterLink>
    </p>
  </div>
</template>

<style scoped>
.login__title {
  text-align: center;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
}

.login__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.login__field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
}

.login__field input {
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.95rem;
  outline: none;
  transition:
    border-color var(--duration) var(--ease-out),
    box-shadow var(--duration) var(--ease-out);
}

.login__field input:hover {
  border-color: var(--color-border-hover);
}

.login__field input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 var(--ring-width) var(--color-focus);
}

.login__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--gradient-brand);
  color: var(--color-primary-contrast);
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform var(--duration) var(--ease-out),
    box-shadow var(--duration) var(--ease-out),
    opacity var(--duration-fast);
}

.login__submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.login__submit:active:not(:disabled) {
  transform: translateY(0);
}

.login__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login__switch {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.88rem;
  color: var(--color-text-soft);
}

.login__link {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  transition: color var(--duration-fast);
}

.reset-password-request__link{
  display: inline-flex;
  align-items: left;
  gap: 0.2rem;
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  transition: color var(--duration-fast);
}

.login__link svg,
.reset-password-request__link svg {
  transition: transform var(--duration-fast) var(--ease-out);
}

.login__link:hover,
.reset-password-request__link:hover {
  color: var(--color-primary-hover);
}

.login__link:hover svg
.reset-password-request__link:hover svg {
  transform: translateX(3px);
}
</style>
