import { createRouter, createWebHistory } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';

import AuthLayout from '@/views/auth/AuthLayout.vue';
import AuthLogin from '@/views/auth/AuthLogin.vue';
import AuthRegister from '@/views/auth/AuthRegister.vue';
import LayoutVue from '@/views/LayoutVue.vue';
import HomeVue from '@/views/HomeVue.vue';
import ProduitList from '@/views/ProduitList.vue';
import ProductDetail from '@/views/ProductDetail.vue';
import AboutVue from '@/views/AboutVue.vue';
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

import { TOKEN_STORAGE_KEYS } from '@/api';
import type { Role } from '@/types';

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
          path: 'about',
          name: 'About',
          component: AboutVue,
        },
        {
          path: 'profile',
          name: 'Profile',
          component: ProfilVue,
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

router.beforeEach((to) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS);
  const role = getRoleFromToken(token);

  if (to.meta.requiresAuth && !token) {
    return { name: 'Login' };
  }

  if (to.meta.requiresAdmin && role !== 'admin') {
    return { name: 'Home' } as RouteLocationRaw;
  }

  if (to.name === 'Login' && token) {
    return { name: 'Home' };
  }

  return true;
});

export default router;