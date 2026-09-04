/**
 * endpoints.ts
 * Source unique de vérité pour tous les chemins d'API.
 * Modifier ici se répercute partout.
 */
export const ENDPOINTS = {
  app: {
    getHello: '/',
  },
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  users: {
    list: '/users',
    create: '/users',
    detail: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
  addresses: {
    list: '/addresses',
    create: '/addresses',
    detail: (id: string) => `/addresses/${id}`,
    update: (id: string) => `/addresses/${id}`,
    delete: (id: string) => `/addresses/${id}`,
  },
  categories: {
    list: '/categories',
    create: '/categories',
    detail: (id: string) => `/categories/${id}`,
    update: (id: string) => `/categories/${id}`,
    delete: (id: string) => `/categories/${id}`,
  },
  products: {
    list: '/products',
    create: (categoryId: string) => `/products/${categoryId}`,
    detail: (id: string) => `/products/${id}`,
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
  },
  cart: {
    list: '/cart',
    addItem: (productId: string) => `/cart/${productId}`,
    detail: (id: string) => `/cart/${id}`,
    updateItem: (id: string) => `/cart/${id}`,
    removeItem: (id: string) => `/cart/${id}`,
  },
  orders: {
    list: '/orders',
    create: '/orders',
    detail: (id: string) => `/orders/${id}`,
    update: (id: string) => `/orders/${id}`,
  },
  payments: {
    list: '/payments',
    create: (cartId: string) => `/payments/${cartId}`,
    detail: (id: string) => `/payments/${id}`,
    update: (id: string) => `/payments/${id}`,
    cancel: (id: string) => `/payments/${id}`,
  },
  reviews: {
    list: '/reviews',
    create: (productId: string) => `/reviews/${productId}`,
    detail: (id: string) => `/reviews/${id}`,
    update: (id: string) => `/reviews/${id}`,
    delete: (id: string) => `/reviews/${id}`,
  },
} as const;
