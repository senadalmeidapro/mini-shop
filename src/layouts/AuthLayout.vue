<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>
<template>
  <div class="auth-layout">
    <span class="auth-layout__blob auth-layout__blob--a"></span>
    <span class="auth-layout__blob auth-layout__blob--b"></span>

    <div class="auth-layout__card reveal">
      <div class="auth-layout__brand reveal reveal--d1">
        <span class="auth-layout__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </span>
        <span class="auth-layout__name">Mini Shop</span>
      </div>

      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: var(--color-background);
  background-image: var(--gradient-hero);
  overflow: hidden;
}

.auth-layout__blob {
  position: absolute;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.35;
  pointer-events: none;
  will-change: transform;
}

.auth-layout__blob--a {
  top: -60px;
  left: -80px;
  background: var(--c-green);
  animation: none;
}

.auth-layout__blob--b {
  bottom: -70px;
  right: -60px;
  background: var(--c-teal);
  animation: none;
}

.auth-layout__card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 2.5rem 2rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(6px);
}

.auth-layout__brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 2rem;
}

.auth-layout__icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: var(--radius-lg);
  background: var(--gradient-brand);
  color: var(--color-primary-contrast);
  box-shadow: var(--shadow-glow);
}

.auth-layout__name {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@media (max-width: 480px) {
  .auth-layout__card {
    padding: 2rem 1.25rem;
  }
}
</style>
