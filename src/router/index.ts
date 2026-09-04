import { createRouter, createWebHistory } from 'vue-router';

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
import { TOKEN_STORAGE_KEYS } from '@/api';

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

router.beforeEach((to) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS);

  if (to.meta.requiresAuth && !token) {
    return { name: 'Login' };
  }

  if (to.name === 'Login' && token) {
    return { name: 'Home' };
  }

  return true;
});

export default router;