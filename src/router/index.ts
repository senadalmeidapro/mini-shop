import { createRouter, createWebHistory } from 'vue-router';

import MainLayout from '@/layouts/MainLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import HomeView from '@/views/HomeView.vue';
import ProductList from '@/views/ProductList.vue';
import ProductDetail from '@/views/ProductDetail.vue';
import AboutView from '@/views/AboutView.vue';
import ContactView from '@/views/ContactView.vue';
import ShopList from '@/views/ShopList.vue';
import ShopDetail from '@/views/ShopDetail.vue';
import Notifications from '@/views/account/Notifications.vue';
import ProfileView from '@/views/account/ProfileView.vue';
import OrdersView from '@/views/orders/OrdersView.vue';
import AuthLogin from '@/views/auth/AuthLogin.vue';
import AuthRegister from '@/views/auth/AuthRegister.vue';
import ResetPasswordRequest from '@/views/auth/ResetPasswordRequest.vue';
import ResetPassword from '@/views/auth/ResetPassword.vue';
import VerifyEmail from '@/views/auth/VerifyEmail.vue';

import AdminLayout from '@/layouts/AdminLayout.vue';
import AdminDashboard from '@/views/admin/AdminDashboard.vue';
import AdminUsers from '@/views/admin/AdminUsers.vue';
import AdminCategories from '@/views/admin/AdminCategories.vue';
import AdminProducts from '@/views/admin/AdminProducts.vue';
import AdminOrders from '@/views/admin/AdminOrders.vue';
import AdminPayments from '@/views/admin/AdminPayments.vue';
import AdminReviews from '@/views/admin/AdminReviews.vue';

import SupplierLayout from '@/layouts/SupplierLayout.vue';
import SupplierDashboard from '@/views/supplier/SupplierDashboard.vue';
import SupplierProducts from '@/views/supplier/SupplierProducts.vue';
import SupplierOrders from '@/views/supplier/SupplierOrders.vue';

import { setupRouterGuards } from './guards';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: HomeView,
        },
        {
          path: 'products',
          name: 'Product List',
          component: ProductList,
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
          component: AboutView,
        },
        {
          path: 'contact',
          name: 'Contact',
          component: ContactView,
        },
        {
          path: 'profile',
          name: 'Profile',
          component: ProfileView,
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
          component: OrdersView,
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

setupRouterGuards(router);

export default router;