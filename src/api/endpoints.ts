/**
 * endpoints.ts
 * Source unique de vérité pour tous les chemins d'API.
 * Modifier ici se répercute partout.
 */
export const ENDPOINTS = {
  users: {
    list: '/users',
    create: '/users',
    detail: (id: number) => `/users/${id}`,
    update: (id: number) => `/users/${id}`,
    delete: (id: number) => `/users/${id}`,
  },
  orders: {
    list: '/orders',
    create: '/orders',
    detail: (id: number) => `/orders/${id}`,
    update: (id: number) => `/orders/${id}`,
    delete: (id: number) => `/orders/${id}`,
  },
  products: {
    list: '/products',
    create: '/products',
    detail: (id: number) => `/products/${id}`,
    update: (id: number) => `/products/${id}`,
    delete: (id: number) => `/products/${id}`,
  },
  payments: {
    list: '/payments',
    create: '/payments',
    detail: (id: number) => `/payments/${id}`,
    update: (id: number) => `/payments/${id}`,
    delete: (id: number) => `/payments/${id}`,
  },
  addressess: {
    list: '/addressess',
    create: '/addressess',
    detail: (id: number) => `/addressess/${id}`,
    update: (id: number) => `/addressess/${id}`,
    delete: (id: number) => `/addressess/${id}`,
  },
  orderItems: {
    list: '/order-items',
    create: '/order-items',
    detail: (id: number) => `/order-items/${id}`,
    update: (id: number) => `/order-items/${id}`,
    delete: (id: number) => `/order-items/${id}`,
  },
} as const;
