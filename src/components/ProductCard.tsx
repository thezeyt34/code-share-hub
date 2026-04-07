import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, formatPrice } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <div className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
          -{product.discount}%
        </span>
        {product.variants && (
          <span className="absolute right-3 top-3 rounded-full bg-foreground/70 px-2.5 py-1 text-xs font-semibold text-background">
            {product.variants} variant
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-card-foreground">{product.name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
          <span className="text-sm text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
        </div>
        <Button
          onClick={() => onAddToCart(product)}
          className="mt-3 w-full gap-2"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4" />
          {product.variants ? "Tanlash" : "Savatga"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
