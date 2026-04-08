import { createContext, useContext, useState, useCallback, ReactNode } from "react";

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

const initialCategories: Category[] = [
  { id: "1", name: "Qurilish mollari", slug: "qurilish-mollari", order: 0, active: true },
];

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const addCategory = useCallback((cat: Omit<Category, "id">) => {
    setCategories((prev) => [...prev, { ...cat, id: crypto.randomUUID() }]);
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteCategory = useCallback((id: string) => {
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
