import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  active: boolean;
}

interface CategoryContextType {
  categories: Category[];
  addCategory: (cat: Omit<Category, "id">) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");
    if (error) {
      console.error("Failed to fetch categories", error);
      return;
    }
    setCategories(
      (data || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        order: r.sort_order,
        active: r.active,
      }))
    );
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = useCallback(async (cat: Omit<Category, "id">) => {
    const { data, error } = await supabase
      .from("categories")
      .insert({ name: cat.name, slug: cat.slug, sort_order: cat.order, active: cat.active })
      .select()
      .single();
    if (error) {
      console.error("Failed to add category", error);
      return;
    }
    setCategories((prev) => [...prev, { id: data.id, name: data.name, slug: data.slug, order: data.sort_order, active: data.active }]);
  }, []);

  const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
    if (updates.order !== undefined) dbUpdates.sort_order = updates.order;
    if (updates.active !== undefined) dbUpdates.active = updates.active;

    await supabase.from("categories").update(dbUpdates).eq("id", id);
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    await supabase.from("categories").delete().eq("id", id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error("useCategories must be used within CategoryProvider");
  return ctx;
}
