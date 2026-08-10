"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { priceFor, Tier, Unit } from "./pricing"

// A line is a product and how much of it — never a price the caller passed in.
// The old shape carried `weight: "7G"` alongside a `price` decided by whoever
// called addItem, which is how a 5g line ended up costing one gram's worth, and
// how the receipt printed "7Gg".
export interface CartItem {
  id: string;
  name: string;
  qty: number;
  unit: Unit;
  tiers: Tier[];
  discountPercent: number;
  image?: string;
  type?: string;
  category?: string;
}

interface CartStore {
  items: CartItem[];
  lang: 'en' | 'ru' | 'th';
  setLang: (lang: 'en' | 'ru' | 'th') => void;
  addItem: (product: Omit<CartItem, 'qty'>, qty: number) => void;
  setQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getLinePrice: (item: CartItem) => number;
  getTotal: () => number;
}

function linePrice(item: CartItem): number {
  return priceFor(item.qty, item).price;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      lang: 'en',

      setLang: (lang) => set({ lang }),

      addItem: (product, qty) => set((state) => {
        if (!product?.id || !Number.isFinite(qty) || qty <= 0) return state;

        const index = state.items.findIndex(i => i.id === product.id);

        // Adding 2g to an existing 5g line makes it a 7g line, repriced as
        // one — the ladder applies to what the customer walks out with, not to
        // the order they happened to tap things in.
        if (index > -1) {
          const items = [...state.items];
          items[index] = { ...items[index], qty: items[index].qty + qty };
          return { items };
        }

        return { items: [...state.items, { ...product, qty }] };
      }),

      setQty: (id, qty) => set((state) => ({
        items: qty > 0
          ? state.items.map(i => (i.id === id ? { ...i, qty } : i))
          : state.items.filter(i => i.id !== id),
      })),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id),
      })),

      clearCart: () => set({ items: [] }),

      getLinePrice: linePrice,

      // Derived on read from the ladder, so a price can never drift from the
      // quantity it belongs to, and a stale cart cannot outlive a price change.
      getTotal: () => (get().items || []).reduce((sum, item) => sum + linePrice(item), 0),
    }),
    {
      // v2: lines from v1 carry a different shape (weight strings, baked-in
      // prices) and would be mispriced if they survived the upgrade.
      name: "buds-digital-cart-v2",
      partialize: (state) => ({ items: state.items, lang: state.lang }),
    }
  )
);
