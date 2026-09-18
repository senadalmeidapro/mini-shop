import { useCartStore } from '@/stores/cartStore';
import { useProductStore } from '@/stores/productStore';
import { useOrderStore } from '@/stores/orderStore';
import { usePaymentStore } from '@/stores/paymentStore';
import { useNotificationStore } from '@/stores/notificationStore';

async function refreshCatalog() {
  const productStore = useProductStore();
  await productStore.getProducts();
  if (productStore.product) {
    await productStore.getProduct(productStore.product.id);
  }
}

export async function syncAfterCartChange() {
  await Promise.all([useCartStore().getMyCart(), refreshCatalog()]);
}

export async function syncAfterCheckout() {
  await Promise.all([
    useCartStore().getMyCart(),
    refreshCatalog(),
    useOrderStore().getOrders(),
    usePaymentStore().getMyPayments(),
    useNotificationStore().refreshUnreadCount(),
  ]);
}

export async function syncAfterCancel() {
  await Promise.all([
    useOrderStore().getOrders(),
    usePaymentStore().getMyPayments(),
    refreshCatalog(),
  ]);
}

export async function syncOnLogin() {
  await useCartStore().getMyCart();
  await useNotificationStore().refreshUnreadCount();
}

export function resetUserData() {
  useCartStore().clearCart();
  useOrderStore().orders = [];
  usePaymentStore().payments = [];
  useNotificationStore().notifications = [];
  useNotificationStore().unreadCount = 0;
}
