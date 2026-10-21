"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: number;
  codigo: string;
  nombre: string;
  label: string | null;
  precio: number;
  imagen: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
};

const CART_STORAGE_KEY = "quibro_cart_v1";

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readStoredCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((entry) => entry.productId === item.productId);
        if (existing) {
          return current.map((entry) =>
            entry.productId === item.productId
              ? { ...entry, quantity: entry.quantity + quantity }
              : entry,
          );
        }
        return [...current, { ...item, quantity }];
      });
    },
    [],
  );

  const removeItem = useCallback((productId: number) => {
    setItems((current) => current.filter((entry) => entry.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setItems((current) =>
      current
        .map((entry) =>
          entry.productId === productId
            ? { ...entry, quantity: Math.max(0, quantity) }
            : entry,
        )
        .filter((entry) => entry.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, entry) => sum + entry.quantity, 0),
      addItem,
      removeItem,
      updateQuantity,
      clear,
    }),
    [items, addItem, removeItem, updateQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}
