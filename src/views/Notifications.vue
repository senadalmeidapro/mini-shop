<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore';

const notificationStore = useNotificationStore();

const notifications = computed(() => notificationStore.notifications);

function formatDate(value: Date): string {
  return new Date(value).toLocaleString('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

onMounted(async () => {
  await notificationStore.getNotifications();
});
</script>

<template>
  <div class="notifications">
    <div class="notifications__header">
      <div class="notifications__title-wrap">
        <h1>Notifications</h1>
        <span v-if="notifications.length" class="notifications__count">{{ notifications.length }}</span>
      </div>
      <button
        v-if="notifications.length"
        class="notifications__read-all"
        type="button"
        @click="notificationStore.markAllAsRead"
      >
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M4 9l4 4 8-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Tout marquer comme lu
      </button>
    </div>

    <div v-if="notifications.length" class="notifications__list">
      <article
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="{ 'notification--unread': !notification.read }"
      >
        <span class="notification__dot" aria-hidden="true"></span>
        <div class="notification__badge" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M10 3a7 7 0 014.9 11.9c.14.84-.43 1.6-1.4 1.6H6.5c-.97 0-1.54-.76-1.4-1.6A7 7 0 0110 3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M8.5 16.5a1.5 1.5 0 003 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="notification__body">
          <div class="notification__head">
            <h3>{{ notification.title }}</h3>
            <time>{{ formatDate(notification.createdAt) }}</time>
          </div>
          <p class="notification__message">{{ notification.message }}</p>
          <div v-if="!notification.read" class="notification__actions">
            <button
              class="notification__mark"
              type="button"
              @click="notificationStore.markAsRead(notification.id)"
            >
              Marquer comme lu
            </button>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="notifications__empty">
      <svg class="notifications__empty-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2"/>
        <path d="M15.5 26c1.2-4 4.4-6 8.5-6s7.3 2 8.5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M24 14v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      Aucune notification pour le moment.
    </div>
  </div>
</template>

<style scoped>
/* ── Header ───────────────────────────────────────────────── */
.notifications__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.75rem;
}

.notifications__title-wrap {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.notifications__header h1 {
  font-size: 1.9rem;
  font-weight: 800;
  color: var(--color-heading);
}

.notifications__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding-inline: 0.5rem;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 0.85rem;
  font-weight: 800;
  border-radius: var(--radius-pill);
}

/* ── Bouton tout lire ─────────────────────────────────────── */
.notifications__read-all {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1.2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition:
    border-color var(--duration),
    color var(--duration),
    background var(--duration),
    transform var(--duration) var(--ease-out);
}

.notifications__read-all svg {
  width: 16px;
  height: 16px;
}

.notifications__read-all:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-soft);
  transform: translateY(-2px);
}

/* ── Liste ────────────────────────────────────────────────── */
.notifications__list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

/* ── Item ─────────────────────────────────────────────────── */
.notification {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.15rem 1.25rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition:
    transform var(--duration) var(--ease-out),
    box-shadow var(--duration),
    border-color var(--duration);
}

.notification:hover {
  transform: translateY(-3px);
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
}

.notification:focus-within {
  outline: var(--ring-width) solid var(--color-focus);
  outline-offset: var(--ring-offset);
}

/* ── Point non-lu pulsant ─────────────────────────────────── */
.notification__dot {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: transparent;
}

.notification--unread .notification__dot {
  background: var(--color-primary);
  animation: pulse-dot 2s var(--ease-out) infinite;
}

/* ── Badge pastille ───────────────────────────────────────── */
.notification__badge {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  background: var(--gradient-brand);
  color: var(--color-primary-contrast);
  box-shadow: var(--shadow-sm);
}

.notification__badge svg {
  width: 20px;
  height: 20px;
}

.notification--unread .notification__badge {
  box-shadow: var(--shadow-glow);
}

/* ── Corps ────────────────────────────────────────────────── */
.notification__body {
  flex: 1;
  min-width: 0;
}

.notification__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.25rem;
  padding-right: 1.5rem;
}

.notification__head h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-heading);
}

.notification__head time {
  font-size: 0.8rem;
  color: var(--color-text-soft);
}

.notification__message {
  color: var(--color-text);
  opacity: 0.82;
  font-size: 0.92rem;
  line-height: 1.6;
}

/* ── Actions ──────────────────────────────────────────────── */
.notification__actions {
  margin-top: 0.7rem;
}

.notification__mark {
  padding: 0.4rem 1rem;
  border: 1px solid var(--color-primary-soft);
  border-radius: var(--radius-pill);
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  transition:
    background var(--duration),
    color var(--duration),
    transform var(--duration) var(--ease-out);
}

.notification__mark:hover {
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  transform: translateY(-1px);
}

/* ── Fond non-lu ──────────────────────────────────────────── */
.notification--unread {
  border-color: var(--color-primary-soft);
  background: var(--color-primary-soft);
}

.notification--unread .notification__head h3 {
  color: var(--color-heading);
}

.notification--unread:hover {
  border-color: var(--color-primary-glow);
}

/* ── Empty state ──────────────────────────────────────────── */
.notifications__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 5rem 1rem;
  text-align: center;
  color: var(--color-text-soft);
  font-size: 1rem;
}

.notifications__empty-icon {
  width: 56px;
  height: 56px;
  color: var(--color-border-hover);
}

/* ── Responsive ───────────────────────────────────────────── */
@media (max-width: 600px) {
  .notification {
    padding: 1rem;
  }
}
</style>