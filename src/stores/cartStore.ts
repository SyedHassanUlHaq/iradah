import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';
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
  /** Max purchasable for this variant; null/undefined = inventory not tracked. */
  quantityAvailable?: number | null;
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
  addItem: (item: CartItem) => boolean;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
  syncCart: () => Promise<void>;
  createCheckout: () => Promise<string | null>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getVariantQuantityInCart: (variantId: string) => number;
}

let syncToken = 0;

const getMaxQuantity = (quantityAvailable?: number | null) => {
  if (quantityAvailable == null || quantityAvailable < 0) return null;
  return quantityAvailable;
};

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

      getVariantQuantityInCart: (variantId) => {
        return get().items.find((i) => i.variantId === variantId)?.quantity ?? 0;
      },

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i.variantId === item.variantId);
        const max = getMaxQuantity(item.quantityAvailable ?? existingItem?.quantityAvailable);
        const currentQty = existingItem?.quantity ?? 0;
        const requestedTotal = currentQty + item.quantity;

        let nextQty = requestedTotal;
        if (max != null && requestedTotal > max) {
          nextQty = max;
          if (currentQty >= max) {
            toast.error("Only a few left", {
              description: `Only ${max} available for this size/color.`,
              position: "top-center",
            });
            return false;
          }
          toast.message("Limited stock", {
            description: `Only ${max} available — quantity adjusted.`,
            position: "top-center",
          });
        }

        if (nextQty <= 0) return false;

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.variantId === item.variantId
                ? {
                    ...i,
                    quantity: nextQty,
                    quantityAvailable: item.quantityAvailable ?? i.quantityAvailable,
                  }
                : i,
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                ...item,
                quantity: nextQty,
              },
            ],
          });
        }
        get().syncCart();
        return true;
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        const item = get().items.find((i) => i.variantId === variantId);
        if (!item) return;

        const max = getMaxQuantity(item.quantityAvailable);
        let nextQty = quantity;
        if (max != null && quantity > max) {
          nextQty = max;
          toast.message("Limited stock", {
            description: `Only ${max} available for this size/color.`,
            position: "top-center",
          });
        }

        set({
          items: get().items.map((cartItem) =>
            cartItem.variantId === variantId ? { ...cartItem, quantity: nextQty } : cartItem,
          ),
        });
        get().syncCart();
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter((item) => item.variantId !== variantId),
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
            items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
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
        return get().items.reduce(
          (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
          0,
        );
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
    },
  ),
);
