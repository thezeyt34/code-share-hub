import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Product, products as initialProducts } from "@/data/products";

interface ProductContextType {
  products: Product[];
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addProduct: (product: Product) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [...prev, product]);
  }, []);

  return (
    <ProductContext.Provider value={{ products, updateProduct, deleteProduct, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}
