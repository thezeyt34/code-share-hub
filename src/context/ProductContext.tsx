import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Product } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addProduct: (product: Product) => void;
  refetch: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    const { data: rows, error } = await supabase
      .from("products")
      .select("*, product_variants(*)");
    if (error) {
      console.error("Failed to fetch products", error);
      return;
    }
    const mapped: Product[] = (rows || []).map((r: any) => ({
      id: r.slug,
      dbId: r.id,
      name: r.name,
      price: r.price,
      costPrice: r.cost_price,
      oldPrice: r.old_price,
      discount: r.discount,
      image: r.image,
      category: r.category,
      stock: r.stock,
      description: r.description || "",
      variants: (r.product_variants || []).map((v: any) => ({
        label: v.label,
        price: v.price,
      })),
    }));
    setProducts(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateProduct = useCallback(async (slug: string, updates: Partial<Product>) => {
    // Find dbId
    const product = products.find((p) => p.id === slug);
    if (!product) return;
    const dbId = (product as any).dbId;

    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.costPrice !== undefined) dbUpdates.cost_price = updates.costPrice;
    if (updates.oldPrice !== undefined) dbUpdates.old_price = updates.oldPrice;
    if (updates.discount !== undefined) dbUpdates.discount = updates.discount;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
    if (updates.description !== undefined) dbUpdates.description = updates.description;

    await supabase.from("products").update(dbUpdates).eq("id", dbId);
    // Optimistic update
    setProducts((prev) => prev.map((p) => (p.id === slug ? { ...p, ...updates } : p)));
  }, [products]);

  const deleteProduct = useCallback(async (slug: string) => {
    const product = products.find((p) => p.id === slug);
    if (!product) return;
    const dbId = (product as any).dbId;
    await supabase.from("products").delete().eq("id", dbId);
    setProducts((prev) => prev.filter((p) => p.id !== slug));
  }, [products]);

  const addProduct = useCallback(async (product: Product) => {
    const { data, error } = await supabase
      .from("products")
      .insert({
        slug: product.id,
        name: product.name,
        price: product.price,
        cost_price: product.costPrice,
        old_price: product.oldPrice,
        discount: product.discount,
        image: product.image,
        category: product.category,
        stock: product.stock,
        description: product.description || "",
      })
      .select()
      .single();
    if (error) {
      console.error("Failed to add product", error);
      return;
    }
    // Add variants if any
    if (product.variants && product.variants.length > 0) {
      await supabase.from("product_variants").insert(
        product.variants.map((v) => ({
          product_id: data.id,
          label: v.label,
          price: v.price,
        }))
      );
    }
    setProducts((prev) => [...prev, { ...product, dbId: data.id } as any]);
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, updateProduct, deleteProduct, addProduct, refetch: fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}
