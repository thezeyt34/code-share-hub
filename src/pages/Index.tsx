import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import { products, categories } from "@/data/products";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("Hammasi");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "Hammasi" || p.category === activeCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      {/* Hero */}
      <section className="py-12 text-center">
        <div className="container">
          <h1 className="text-4xl font-bold text-primary md:text-5xl">
            Xoztovarsga xush kelibsiz!
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Eng sifatli xo'jalik tovarlari bir joyda. Tez yetkazib berish va qulay narxlar.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="pb-16">
        <div className="container">
          <div className="mb-8 flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">Mahsulotlar topilmadi</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-sm text-muted-foreground">© 2024 Xoztovars. Barcha huquqlar himoyalangan.</p>
          <p className="text-sm text-muted-foreground">+998 90 123 45 67</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
