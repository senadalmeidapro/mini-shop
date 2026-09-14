<script setup lang="ts">
import { RouterView } from 'vue-router';
import HeaderVue from '@/components/HeaderVue.vue';
import FooterVue from '@/components/FooterVue.vue';
</script>
<template>
  <div class="layout">
    <HeaderVue />

    <main class="layout__main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <FooterVue />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout__main {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* ── Transition de page ─────────────────────────────────────── */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.28s var(--ease-out),
    transform 0.28s var(--ease-out);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(14px) scale(0.99);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.995);
}
</style>