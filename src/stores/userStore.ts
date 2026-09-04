import { ref } from 'vue';
import { defineStore } from 'pinia';

import type { Paginate, User } from '@/types';

import { ENDPOINTS, http, handleApiError } from '@/api';
import { useToast } from 'vue-toastification';

export const useUserStore = defineStore('users', () => {
  const toast = useToast();

  const user = ref<User | null>(null);
  const users = ref<Paginate<User> | null>(null);

  async function getUser(id: string) {
    try {
      const response = await http.get<User>(ENDPOINTS.users.detail(id));

      user.value = response.data;
    } catch (error) {
      handleApiError(error, toast, 'Impossible de charger l\'utilisateur');
    }
  }

  async function getUsers(params?: {
    search?: string;
    page?: number;
    limit?: number;
    role?: string;
    active?: boolean;
  }) {
    try {
      const response = await http.get<Paginate<User>>(ENDPOINTS.users.list, {
        params,
      });

      users.value = response.data;
    } catch (error) {
      handleApiError(error, toast, 'Impossible de charger les utilisateurs');
    }
  }

  async function postUser(data: { email: string; password: string; fullName?: string }) {
    try {
      const response = await http.post<User>(ENDPOINTS.users.create, data);

      users.value?.items.push(response.data);
      toast.success('Utilisateur créé');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de créer l\'utilisateur');
    }
  }

  async function updateUser(id: string, data: { email?: string; password?: string; fullName?: string }) {
    try {
      const response = await http.patch<User>(ENDPOINTS.users.update(id), data);

      if (users.value) {
        const index = users.value.items.findIndex((u) => u.id === id);

        if (index !== -1) {
          users.value.items[index] = response.data;
        }
      }

      if (user.value?.id === id) {
        user.value = response.data;
      }

      toast.success('Utilisateur mis à jour');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de mettre à jour l\'utilisateur');
    }
  }

  async function deleteUser(id: string) {
    try {
      await http.delete<void>(ENDPOINTS.users.delete(id));

      if (users.value) {
        users.value.items = users.value.items.filter((u) => u.id !== id);
      }

      if (user.value?.id === id) {
        user.value = null;
      }

      toast.success('Utilisateur supprimé');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de supprimer l\'utilisateur');
    }
  }

  return {
    user,
    users,
    getUser,
    getUsers,
    postUser,
    updateUser,
    deleteUser,
  };
});
