import { defineStore } from 'pinia';

/**
 * Interface for an item in the shopping cart.
 */
export interface CartItem {
  id: number; // For local identification
  productId: number;
  title: string;
  variantName: string;
  variantId: number;
  price: number;
  quantity: number;
  imageUrl: string;
}

/**
 * Pinia Store for managing the shopping cart state.
 * Syncs with LocalStorage via pinia-plugin-persistedstate.
 */
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isOpen: false, // For the Sidebar Drawer
  }),
  
  actions: {
    /**
     * Adds an item to the cart or increments quantity if it exists.
     */
    addItem(item: CartItem) {
      const existing = this.items.find(i => i.variantId === item.variantId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        this.items.push({ ...item });
      }
    },

    /**
     * Removes an item from the cart by variant ID.
     */
    removeItem(variantId: number) {
      this.items = this.items.filter(i => i.variantId !== variantId);
    },

    /**
     * Increments quantity of an item.
     */
    incrementQuantity(variantId: number) {
      const item = this.items.find(i => i.variantId === variantId);
      if (item) item.quantity++;
    },

    /**
     * Decrements quantity of an item. Removes if it reaches 0.
     */
    decrementQuantity(variantId: number) {
      const item = this.items.find(i => i.variantId === variantId);
      if (item) {
        item.quantity--;
        if (item.quantity <= 0) {
          this.removeItem(variantId);
        }
      }
    },

    /**
     * Clears all items from the cart.
     */
    clear() {
      this.items = [];
    },

    /**
     * Toggles the cart sidebar visibility.
     */
    toggleCart(state?: boolean) {
      this.isOpen = state !== undefined ? state : !this.isOpen;
    }
  },

  getters: {
    /**
     * Total number of items in the cart.
     */
    totalItems: (state) => state.items.reduce((acc, item) => acc + item.quantity, 0),

    /**
     * Total price of all items in the cart.
     */
    totalPrice: (state) => state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
  },

  // Enable persistence to LocalStorage
  persist: true,
});
