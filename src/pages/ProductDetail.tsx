import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingCart, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, formatPrice, ProductVariant } from "@/data/products";
import { useCart } from "@/context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === id);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [variantError, setVariantError] = useState(false);

  if (!product) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Mahsulot topilmadi</p>
      </div>
    );
  }

  const hasVariants = product.variants && product.variants.length > 0;
  const currentPrice = selectedVariant?.price ?? product.price;

  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) {
      setVariantError(true);
      return;
    }
    setVariantError(false);
    addToCart(product, quantity, selectedVariant);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Orqaga
        </button>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Image */}
          <div className="overflow-hidden rounded-xl bg-muted">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>

          {/* Info */}
          <div>
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">{formatPrice(currentPrice)}</span>
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
            </div>

            <p className="mt-3 flex items-center gap-2 text-sm font-medium" style={{ color: "hsl(142, 71%, 45%)" }}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "hsl(142, 71%, 45%)" }} />
              Omborda: {product.stock}
            </p>

            {/* Variants */}
            {hasVariants && (
              <div className="mt-6">
                <h4 className="mb-3 text-sm font-medium">Variantni tanlang</h4>
                <div className="flex flex-wrap gap-2">
                  {product.variants!.map((variant) => (
                    <button
                      key={variant.label}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setVariantError(false);
                      }}
                      className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                        selectedVariant?.label === variant.label
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="font-medium">{variant.label}</span>
                      <span className="ml-2 text-muted-foreground">{formatPrice(variant.price)}</span>
                    </button>
                  ))}
                </div>
                {variantError && (
                  <p className="mt-2 text-sm text-destructive">Iltimos, variant tanlang</p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-medium">Miqdor:</span>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setQuantity((q) => q + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Add to Cart */}
            <Button className="mt-6 w-full gap-2" size="lg" onClick={handleAddToCart}>
              <ShoppingCart className="h-5 w-5" />
              Savatga qo'shish
            </Button>

            {/* Delivery & Payment */}
            <div className="mt-6 flex gap-6 rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <Truck className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Yetkazib berish</p>
                  <p className="text-sm text-muted-foreground">1-3 kun ichida</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">To'lov</p>
                  <p className="text-sm text-muted-foreground">Naqd, karta, o'tkazma</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Tavsif</h3>
                <p className="mt-2 text-muted-foreground">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
