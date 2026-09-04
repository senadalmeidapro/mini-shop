import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ENDPOINTS, http, handleApiError, TOKEN_STORAGE_KEYS } from '@/api';
import type { User } from '@/types';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const toast = useToast();

  const accessToken = ref<string | null>(localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS));
  const user = ref<User | null>(null);

  async function register(dto: { email: string; password: string; fullName?: string }) {
    try {
      await http.post(ENDPOINTS.auth.register, dto);

      toast.success('Compte créé avec succès');
      setTimeout(() => {
        router.push({ name: 'Login' });
      }, 2000);
    } catch (error) {
      handleApiError(error, toast, 'Impossible de créer le compte');
    }
  }

  async function login(option: { email: string; password: string }) {
    try {
      const response = await http.post<{
        token: string;
        user: User;
      }>(ENDPOINTS.auth.login, option);

      const data = response.data;

      accessToken.value = data.token;
      localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS, data.token);
      user.value = data.user;

      toast.success('Connexion réussie');
    } catch (error) {
      handleApiError(error, toast, 'Identifiants incorrects');
    }
  }

  async function logout() {
    try {
      await http.post(ENDPOINTS.auth.logout);

      accessToken.value = null;
      user.value = null;
      localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS);
      localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH);

      toast.success('Déconnexion réussie');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de se déconnecter');
    }
  }

  return {
    accessToken,
    user,
    register,
    login,
    logout,
  };
});
