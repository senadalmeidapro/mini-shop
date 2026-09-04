<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: '',
  fullName: '',
});

const loading = ref(false);

async function handleSubmit() {
  loading.value = true;

  try {
    await authStore.register(form);
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <div class="register">
    <h2>Créer un compte</h2>

    <form @submit.prevent="handleSubmit">
      <div class="register__field">
        <label for="fullname">Nom complet</label>
        <input id="fullname" v-model="form.fullName" type="text" autocomplete="name" />
      </div>
      <div class="register__field">
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
      <div class="register__field">
        <label for="password">Mot de passe</label>
        <input id="password" v-model="form.password" type="password" required />
      </div>

      <button class="register__submit" type="submit" :disabled="loading">
        {{ loading ? 'Inscription...' : "S'inscrire" }}
      </button>
    </form>

    <p class="register__switch">
      Déjà un compte ? <RouterLink :to="{ name: 'Login' }">Se connecter</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.register h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.register__field {
  margin-bottom: 1rem;
}

.register__field label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.register__field input {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text);
  outline: none;
  transition: border-color 0.2s;
}

.register__field input:focus {
  border-color: #42b883;
}

.register__submit {
  width: 100%;
  padding: 0.7rem;
  margin-top: 0.5rem;
  border: none;
  border-radius: 8px;
  background-color: #42b883;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.2s,
    opacity 0.2s;
}

.register__submit:hover:not(:disabled) {
  background-color: #35a06c;
}

.register__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.register__switch {
  margin-top: 1.25rem;
  text-align: center;
  font-size: 0.9rem;
}

.register__switch a {
  color: #42b883;
  font-weight: 600;
}
</style>