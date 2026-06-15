"use client";

import { useState, useEffect, useCallback } from "react";
import { Product } from "./types";
import { defaultProducts } from "./products";

const STORAGE_KEY = "taxwise_products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Product[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => {
      const updated = [...prev, product];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateProduct = useCallback((id: string, product: Product) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? product : p));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProducts(defaultProducts);
  }, []);

  return { products, addProduct, updateProduct, deleteProduct, resetToDefaults };
}
