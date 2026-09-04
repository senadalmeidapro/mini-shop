<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
<template>
  <div class="auth-layout">
    <div class="auth-layout__card">
      <h1 class="auth-layout__logo">Mini Shop</h1>
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: var(--color-background);
}

.auth-layout__card {
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.auth-layout__logo {
  text-align: center;
  font-size: 1.8rem;
  color: #42b883;
  margin-bottom: 1.5rem;
}
</style>
