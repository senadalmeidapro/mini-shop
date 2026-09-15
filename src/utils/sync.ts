/**
 * sync.ts
 * Synchronisation automatique des données entre les stores après une action.
 * ─ après ajout au panier    → panier + stock du catalogue
 * ─ après commande (checkout) → panier + stock + commandes + paiements + notifications
 * ─ après annulation         → stock (restock) + commandes + paiements
 * ─ après login/logout       → chargement / purge des données de l'utilisateur
 */
import { useCartStore } from '@/stores/cartStore';
import { useProductStore } from '@/stores/productStore';
import { useOrderStore } from '@/stores/orderStore';
import { usePaymentStore } from '@/stores/paymentStore';
import { useNotificationStore } from '@/stores/notificationStore';

// Rafraîchit le catalogue (stock/prix) et la fiche produit ouverte
async function refreshCatalog() {
  const productStore = useProductStore();
  await productStore.getProducts();
  if (productStore.product) {
    await productStore.getProduct(productStore.product.id);
  }
}

// Après ajout / mise à jour / suppression d'un article du panier
export async function syncAfterCartChange() {
  await Promise.all([useCartStore().getMyCart(), refreshCatalog()]);
}

// Après le paiement d'une commande : panier vidé, stock baissé, nouvelle commande
export async function syncAfterCheckout() {
  await Promise.all([
    useCartStore().getMyCart(),
    refreshCatalog(),
    useOrderStore().getOrders(),
    usePaymentStore().getPayments(),
    useNotificationStore().refreshUnreadCount(),
  ]);
}

// Après l'annulation d'une commande : le stock est recrédité
export async function syncAfterCancel() {
  await Promise.all([
    useOrderStore().getOrders(),
    usePaymentStore().getPayments(),
    refreshCatalog(),
  ]);
}

// Après connexion : charge le panier en cours et le compteur de notifications
export async function syncOnLogin() {
  await useCartStore().getMyCart();
  await useNotificationStore().refreshUnreadCount();
}

// Déconnexion / session expirée : purge les données du compte précédent
export function resetUserData() {
  useCartStore().clearCart();
  useOrderStore().orders = [];
  usePaymentStore().payments = [];
  useNotificationStore().notifications = [];
  useNotificationStore().unreadCount = 0;
}