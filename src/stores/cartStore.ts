import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { ENDPOINTS, http, handleApiError, logApiError } from '@/api';
import type { Cart, CartItem } from '@/types';
import { useToast } from 'vue-toastification';

export const useCartStore = defineStore('cart', () => {
  const toast = useToast();

  const cart = ref<Cart | null>(null);
  const items = ref<CartItem[]>([]);

  const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0));
  const totalPerItem = computed(()=> items.value.map((item)=>({...item, total: item.quantity * item.product.price})))
  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity * item.product.price, 0),
  );

  async function getCart(id: string) {
    try {
      const response = await http.get<Cart>(ENDPOINTS.cart.detail(id));
      cart.value = response.data;
      items.value = response.data.cartItems;
    } catch (error) {
      logApiError(error, 'Impossible de charger le panier');
    }
  }

  async function getMyCart() {
    try {
      const response = await http.get<Cart | null>(ENDPOINTS.cart.mine);
      cart.value = response.data;
      items.value = response.data?.cartItems ?? [];
    } catch (error) {
      logApiError(error, 'Impossible de charger le panier');
    }
  }

  async function addItem(productId: string, quantity: number) {
    try {
      await http.post<CartItem>(ENDPOINTS.cart.addItem(productId), { quantity });
      await getMyCart();
      toast.success('Produit ajouté au panier');
      return true;
    } catch (error) {
      handleApiError(error, toast, "Impossible d'ajouter le produit");
      return false;
    }
  }

  async function updateItem(id: string, quantity: number) {
    try {
      await http.patch<Cart>(ENDPOINTS.cart.updateItem(id), { quantity });
      await getMyCart();
      return true;
    } catch (error) {
      logApiError(error, 'Impossible de mettre à jour le panier');
      return false;
    }
  }

  async function removeItem(id: string) {
    try {
      await http.delete<void>(ENDPOINTS.cart.removeItem(id));
      await getMyCart();
      toast.success('Produit retiré du panier');
      return true;
    } catch (error) {
      handleApiError(error, toast, 'Impossible de retirer le produit');
      return false;
    }
  }

  function clearCart() {
    cart.value = null;
    items.value = [];
  }

  return {
    cart,
    items,
    totalPerItem,
    total,
    itemCount,
    getCart,
    getMyCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  };
});