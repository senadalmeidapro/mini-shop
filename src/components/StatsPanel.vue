<script setup lang="ts">
defineProps<{ totalUsers: number; activeAdmins: number }>();
</script>
<template>
  <div class="stats-panel">
    <div class="stats-panel__item">
      <span>Utilisateurs</span>
      <strong>{{ totalUsers }}</strong>
    </div>
    <div class="stats-panel__item">
      <span>Admins</span>
      <strong>{{ activeAdmins }}</strong>
    </div>
  </div>
</template>

<style scoped>
.stats-panel {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stats-panel__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.stats-panel__item span {
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.7;
}

.stats-panel__item strong {
  font-size: 1.5rem;
  color: #42b883;
}
</style>