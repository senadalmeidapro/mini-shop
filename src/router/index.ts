import { createRouter, createWebHistory } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';

import AuthLayout from '@/views/auth/AuthLayout.vue';
import AuthLogin from '@/views/auth/AuthLogin.vue';
import AuthRegister from '@/views/auth/AuthRegister.vue';
import ResetPasswordRequest from '@/views/auth/ResetPasswordRequest.vue';
import ResetPassword from '@/views/auth/ResetPassword.vue';
import VerifyEmail from '@/views/auth/VerifyEmail.vue';
import LayoutVue from '@/views/LayoutVue.vue';
import HomeVue from '@/views/HomeVue.vue';
import ProduitList from '@/views/ProduitList.vue';
import ProductDetail from '@/views/ProductDetail.vue';
import AboutVue from '@/views/AboutVue.vue';
import ContactVue from '@/views/ContactVue.vue';
import ShopList from '@/views/ShopList.vue';
import ShopDetail from '@/views/ShopDetail.vue';
import Notifications from '@/views/Notifications.vue';
import ProfilVue from '@/views/setting/ProfilVue.vue';
import OrderLayout from '@/views/OrderLayout.vue';

import AdminLayout from '@/views/admin/AdminLayout.vue';
import AdminDashboard from '@/views/admin/AdminDashboard.vue';
import AdminUsers from '@/views/admin/AdminUsers.vue';
import AdminCategories from '@/views/admin/AdminCategories.vue';
import AdminProducts from '@/views/admin/AdminProducts.vue';
import AdminOrders from '@/views/admin/AdminOrders.vue';
import AdminPayments from '@/views/admin/AdminPayments.vue';
import AdminReviews from '@/views/admin/AdminReviews.vue';

import SupplierLayout from '@/views/supplier/SupplierLayout.vue';
import SupplierDashboard from '@/views/supplier/SupplierDashboard.vue';
import SupplierProducts from '@/views/supplier/SupplierProducts.vue';
import SupplierOrders from '@/views/supplier/SupplierOrders.vue';

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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutVue,
      children: [
        {
          path: '',
          name: 'Home',
          component: HomeVue,
        },
        {
          path: 'products',
          name: 'Product List',
          component: ProduitList,
        },
        {
          path: 'products/:id',
          name: 'Product Details',
          component: ProductDetail,
        },
        {
          path: 'shops',
          name: 'Shops',
          component: ShopList,
        },
        {
          path: 'shops/:id',
          name: 'Shop Detail',
          component: ShopDetail,
        },
        {
          path: 'about',
          name: 'About',
          component: AboutVue,
        },
        {
          path: 'contact',
          name: 'Contact',
          component: ContactVue,
        },
        {
          path: 'profile',
          name: 'Profile',
          component: ProfilVue,
          meta: { requiresAuth: true },
        },
        {
          path: 'notifications',
          name: 'Notifications',
          component: Notifications,
          meta: { requiresAuth: true },
        },
        {
          path: 'orders',
          name: 'Order Layout',
          component: OrderLayout,
          meta: { requiresAuth: true },
        },
        {
          path: 'admin',
          component: AdminLayout,
          meta: { requiresAuth: true, requiresAdmin: true },
          children: [
            {
              path: '',
              name: 'Admin Dashboard',
              component: AdminDashboard,
            },
            {
              path: 'users',
              name: 'Admin Users',
              component: AdminUsers,
            },
            {
              path: 'categories',
              name: 'Admin Categories',
              component: AdminCategories,
            },
            {
              path: 'products',
              name: 'Admin Products',
              component: AdminProducts,
            },
            {
              path: 'orders',
              name: 'Admin Orders',
              component: AdminOrders,
            },
            {
              path: 'payments',
              name: 'Admin Payments',
              component: AdminPayments,
            },
            {
              path: 'reviews',
              name: 'Admin Reviews',
              component: AdminReviews,
            },
          ],
        },
        {
          path: 'supplier',
          component: SupplierLayout,
          meta: { requiresAuth: true },
          children: [
            {
              path: '',
              name: 'Supplier Dashboard',
              component: SupplierDashboard,
            },
            {
              path: 'products',
              name: 'Supplier Products',
              component: SupplierProducts,
              meta: { requiresSupplier: true },
            },
            {
              path: 'orders',
              name: 'Supplier Orders',
              component: SupplierOrders,
              meta: { requiresSupplier: true },
            },
          ],
        },
      ],
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'Login',
          component: AuthLogin,
        },
        {
          path: 'register',
          name: 'Register',
          component: AuthRegister,
        },
        {
          path: 'reset-password-request',
          name: 'ResetPasswordRequest',
          component: ResetPasswordRequest,
        },
        {
          path: 'reset-password',
          name: 'ResetPassword',
          component: ResetPassword,
        },
        {
          path: 'verify-email',
          name: 'VerifyEmail',
          component: VerifyEmail,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'Home' },
    },
  ],
});

function getRoleFromToken(token: string | null): Role | null {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]!)) as { role?: Role };
    return payload.role ?? null;
  } catch {
    return null;
  }
}

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  let token = authStore.accessToken;

  // Token présent mais expiré : on le purge des deux côtés
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
    // Admin et fournisseur (rôle ou boutique) sont autorisés
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

export default router;
