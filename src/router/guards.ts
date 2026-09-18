import type { Router, RouteLocationRaw } from 'vue-router';

import { TOKEN_STORAGE_KEYS } from '@/api';
import type { Role } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { useSupplierStore } from '@/stores/supplierStore';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]!)) as { exp?: number };
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

function getRoleFromToken(token: string | null): Role | null {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]!)) as { role?: Role };
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export function setupRouterGuards(router: Router): void {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore();
    let token = authStore.accessToken;

    if (token && isTokenExpired(token)) {
      localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS);
      localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH);
      authStore.accessToken = null;
      authStore.refreshToken = null;
      token = null;
    }

    const role = getRoleFromToken(token);

    if (to.meta.requiresAuth && !token) {
      return { name: 'Login', query: { redirect: to.fullPath } };
    }

    if (to.meta.requiresAdmin && role !== 'admin') {
      if (!token) {
        return { name: 'Login', query: { redirect: to.fullPath } };
      }
      return { name: 'Home' } as RouteLocationRaw;
    }

    if (to.meta.requiresSupplier) {
      if (role !== 'admin') {
        const supplierStore = useSupplierStore();
        if (!supplierStore.isLoaded) {
          await supplierStore.checkMyShop();
        }
        if (!supplierStore.hasShop && role !== 'supplier') {
          return { name: 'Supplier Dashboard' };
        }
      }
    }

    if ((to.name === 'Login' || to.name === 'Register') && token) {
      return { name: 'Home' };
    }

    return true;
  });
}
