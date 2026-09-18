import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ENDPOINTS, http, handleApiError, logApiError } from '@/api';
import type { Notification } from '@/types';
import type { Paginate } from '@/types';
import { useToast } from 'vue-toastification';

export const useNotificationStore = defineStore('notifications', () => {
  const toast = useToast();

  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);

  async function getNotifications() {
    try {
      const response = await http.get<Paginate<Notification>>(ENDPOINTS.notifications.list, {
        params: { page: 1, limit: 50 },
      });
      notifications.value = response.data.items;
      await refreshUnreadCount();
    } catch (error) {
      logApiError(error, 'Impossible de charger les notifications');
    }
  }

  async function refreshUnreadCount() {
    try {
      const response = await http.get<number>(ENDPOINTS.notifications.unreadCount);
      unreadCount.value = response.data;
    } catch {
      
    }
  }

  async function markAsRead(id: string) {
    try {
      await http.patch<void>(ENDPOINTS.notifications.read(id));

      const target = notifications.value.find((n) => n.id === id);
      if (target && !target.read) {
        target.read = true;
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    } catch (error) {
      handleApiError(error, toast, 'Impossible de marquer la notification comme lue');
    }
  }

  async function markAllAsRead() {
    try {
      await http.patch<void>(ENDPOINTS.notifications.readAll);

      notifications.value.forEach((n) => {
        n.read = true;
      });
      unreadCount.value = 0;
      toast.success('Toutes les notifications sont marquées comme lues');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de marquer les notifications comme lues');
    }
  }

  return {
    notifications,
    unreadCount,
    getNotifications,
    refreshUnreadCount,
    markAsRead,
    markAllAsRead,
  };
});