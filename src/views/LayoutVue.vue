<script setup lang="ts">
import { RouterView } from 'vue-router';
import HeaderVue from '@/components/HeaderVue.vue';
</script>
<template>
  <div class="layout">
    <HeaderVue />

    <main class="layout__main">
      <RouterView />
    </main>
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
</style>
