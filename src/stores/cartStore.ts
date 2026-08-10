import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShopifyProduct, createStorefrontCart } from '@/lib/shopify';

export interface CartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface CartAmount {
  amount: string;
  currencyCode: string;
}

interface CartStore {
  items: CartItem[];
  checkoutUrl: string | null;
  subtotalAmount: CartAmount | null;
  totalAmount: CartAmount | null;
  isSyncing: boolean;
  isLoading: boolean;
  isOpen: boolean;

  // Actions
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
  syncCart: () => Promise<void>;
  createCheckout: () => Promise<string | null>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

let syncToken = 0;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      checkoutUrl: null,
      subtotalAmount: null,
      totalAmount: null,
      isSyncing: false,
      isLoading: false,
      isOpen: false,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.variantId === item.variantId);

        if (existingItem) {
          set({
            items: items.map(i =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          });
        } else {
          set({ items: [...items, item] });
        }
        get().syncCart();
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set({
          items: get().items.map(item =>
            item.variantId === variantId ? { ...item, quantity } : item
          )
        });
        get().syncCart();
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter(item => item.variantId !== variantId)
        });
        get().syncCart();
      },

      clearCart: () => {
        set({ items: [], checkoutUrl: null, subtotalAmount: null, totalAmount: null });
      },

      setLoading: (isLoading) => set({ isLoading }),
      setOpen: (isOpen) => set({ isOpen }),

      // Recreates the Shopify cart from the current local items so the displayed
      // subtotal/total reflect Shopify's own pricing engine (automatic/bundle discounts
      // are only evaluated server-side and are invisible to a naive local price sum).
      syncCart: async () => {
        const { items } = get();
        const token = ++syncToken;

        if (items.length === 0) {
          set({ checkoutUrl: null, subtotalAmount: null, totalAmount: null, isSyncing: false });
          return;
        }

        set({ isSyncing: true });
        try {
          const cart = await createStorefrontCart(
            items.map(item => ({ variantId: item.variantId, quantity: item.quantity }))
          );
          if (token !== syncToken) return; // a newer sync superseded this one
          set({
            checkoutUrl: cart.checkoutUrl,
            subtotalAmount: cart.subtotalAmount,
            totalAmount: cart.totalAmount,
            isSyncing: false,
          });
        } catch (error) {
          console.error('Failed to sync cart with Shopify:', error);
          if (token === syncToken) set({ isSyncing: false });
        }
      },

      createCheckout: async () => {
        const { items, setLoading, syncCart } = get();
        if (items.length === 0) return null;

        setLoading(true);
        try {
          await syncCart();
          return get().checkoutUrl;
        } catch (error) {
          console.error('Failed to create checkout:', error);
          return null;
        } finally {
          setLoading(false);
        }
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
      },
    }),
    {
      name: 'iradah-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state && state.items.length > 0) {
          state.syncCart();
        }
      },
    }
  )
);
