import { ref } from 'vue';
import { defineStore } from 'pinia';

import type { Paginate, User } from '@/types';

import { ENDPOINTS, http } from '@/api';

export const useUserStore = defineStore('users', () => {
  const user = ref<User | null>(null);
  const users = ref<Paginate<User> | null>(null);

  async function getUser(id: number) {
    try {
      const response = await http.get<User>(ENDPOINTS.users.detail(id));

      user.value = response.data;
    } catch (error) {
      console.error('Failed to get user:', error);
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
      console.error('Failed to get users:', error);
    }
  }

  async function postUser(data: Omit<User, 'id'>) {
    try {
      const response = await http.post<User>(ENDPOINTS.users.create, data);

      users.value?.items.push(response.data);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  }

  async function updateUser(id: number, data: Partial<Omit<User, 'id'>>) {
    try {
      const response = await http.patch<User>(ENDPOINTS.users.update(id), data);

      if (users.value) {
        const index = users.value.items.findIndex((user) => user.id === id);

        if (index !== -1) {
          users.value.items[index] = response.data;
        }
      }

      if (user.value?.id === id) {
        user.value = response.data;
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  }

  async function deleteUser(id: number) {
    try {
      await http.delete<void>(ENDPOINTS.users.delete(id));

      if (users.value) {
        users.value.items = users.value.items.filter((user) => user.id !== id);
      }

      if (user.value?.id === id) {
        user.value = null;
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
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
