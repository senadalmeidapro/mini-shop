<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  password: '',
  confirm: '',
});

const loading = ref(false);

async function handleSubmit() {
  const token = route.query.token;

  if (!token || typeof token !== 'string') return;

  if (form.password !== form.confirm) {
    authStore.toastWarning('Les mots de passe ne correspondent pas.');
    return;
  }

  loading.value = true;

  try {
    await authStore.resetPassword(token, form.password);
    router.push({ name: 'Login' });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="reset">
    <h2 class="reset__title reveal reveal--d2">Nouveau mot de passe</h2>

    <form class="reset__form" @submit.prevent="handleSubmit">
      <div class="reset__field reveal reveal--d3">
        <label for="password">Nouveau mot de passe</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          autocomplete="new-password"
          placeholder="8+ caractères, chiffres et symboles"
          required
        />
      </div>

      <div class="reset__field reveal reveal--d4">
        <label for="confirm">Confirmation</label>
        <input
          id="confirm"
          v-model="form.confirm"
          type="password"
          autocomplete="new-password"
          placeholder="Répétez le mot de passe"
          required
        />
      </div>

      <button class="reset__submit reveal reveal--d5" type="submit" :disabled="loading">
        <span v-if="loading" class="reset__spinner"></span>
        {{ loading ? 'Enregistrement...' : 'Réinitialiser le mot de passe' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.reset__title {
  text-align: center;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
}

.reset__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reset__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.reset__field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
}

.reset__field input {
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

.reset__field input:hover {
  border-color: var(--color-border-hover);
}

.reset__field input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 var(--ring-width) var(--color-focus);
}

.reset__submit {
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

.reset__submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.reset__submit:active:not(:disabled) {
  transform: translateY(0);
}

.reset__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reset__spinner {
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
</style>
