import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { ENDPOINTS, http, handleApiError } from '@/api';
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
      handleApiError(error, toast, 'Impossible de charger le panier');
    }
  }

  async function addItem(productId: string, quantity: number) {
    try {
      const response = await http.post<CartItem>(ENDPOINTS.cart.addItem(productId), { quantity });
      items.value.push(response.data);
      toast.success('Produit ajouté au panier');
    } catch (error) {
      handleApiError(error, toast, "Impossible d'ajouter le produit");
    }
  }

  async function updateItem(id: string, quantity: number) {
    try {
      const response = await http.patch<Cart>(ENDPOINTS.cart.updateItem(id), { quantity });

      const index = items.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        items.value[index]!.quantity = quantity;
      }

      if (cart.value) {
        cart.value = response.data;
      }
    } catch (error) {
      handleApiError(error, toast, 'Impossible de mettre à jour le panier');
    }
  }

  async function removeItem(id: string) {
    try {
      await http.delete<void>(ENDPOINTS.cart.removeItem(id));
      items.value = items.value.filter((item) => item.id !== id);
      toast.success('Produit retiré du panier');
    } catch (error) {
      handleApiError(error, toast, 'Impossible de retirer le produit');
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
    addItem,
    updateItem,
    removeItem,
    clearCart,
  };
});
