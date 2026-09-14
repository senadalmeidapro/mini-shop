import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { ENDPOINTS, http, handleApiError, TOKEN_STORAGE_KEYS } from '@/api';
import type { Role, User } from '@/types';
import { useToast } from 'vue-toastification';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
  const toast = useToast();

  const accessToken = ref<string | null>(localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS));
  const refreshToken = ref<string | null>(localStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH));
  const user = ref<User | null>(null);

  function toastWarning(message: string) {
    toast.warning(message);
  }

  const role = computed<Role | null>(() => {
    const token = accessToken.value;
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]!)) as { role?: Role };
      return payload.role ?? null;
    } catch {
      return null;
    }
  });

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
        accessToken: string;
        refreshToken: string;
        user: User;
      }>(ENDPOINTS.auth.login, option);

      const data = response.data;

      accessToken.value = data.accessToken;
      refreshToken.value = data.refreshToken;
      localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS, data.accessToken);
      localStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH, data.refreshToken);
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
      refreshToken.value = null;
      user.value = null;
      localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS);
      localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH);

      toast.success('Déconnexion réussie');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de se déconnecter');
    }
  }

  async function requestPasswordReset(email: string) {
    try {
      await http.post(ENDPOINTS.auth.resetPasswordRequest, { email });
      toast.success('Lien de réinitialisation envoyé');
    } catch (error) {
      handleApiError(error, toast, "Impossible d'envoyer le lien de réinitialisation");
    }
  }

  async function resetPassword(token: string, newPassword: string) {
    try {
      await http.post(ENDPOINTS.auth.resetPassword, { token, newPassword });
      toast.success('Mot de passe réinitialisé, vous pouvez vous connecter');
      return true;
    } catch (error) {
      handleApiError(error, toast, 'Impossible de réinitialiser le mot de passe');
      return false;
    }
  }

  async function verifyEmail(token: string): Promise<boolean> {
    try {
      await http.post(ENDPOINTS.auth.verifyEmail, { token });
      toast.success('Email vérifié avec succès');
      return true;
    } catch (error) {
      handleApiError(error, toast, 'Lien de vérification invalide ou expiré');
      return false;
    }
  }

  function forceLogout() {
    const current = router.currentRoute.value;
    const requiresAuth = current.meta.requiresAuth || current.meta.requiresAdmin;

    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH);

    // On est sur une page publique : on nettoie la session sans interrompre la navigation
    if (!requiresAuth) {
      return;
    }

    toast.warning('Session expirée, veuillez vous reconnecter.');
    router.push({ name: 'Login', query: { redirect: current.fullPath } });
  }

  return {
    accessToken,
    refreshToken,
    user,
    role,
    component: null,
    register,
    login,
    logout,
    forceLogout,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    toastWarning,
  };
});
