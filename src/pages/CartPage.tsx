import { Minus, Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold">Savat bo'sh</h1>
        <p className="mt-2 text-muted-foreground">Hali hech narsa qo'shilmagan</p>
        <Button className="mt-6" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Xaridni boshlash
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Savat ({items.length})</h1>
        <button
          onClick={clearCart}
          className="flex items-center gap-2 text-sm text-destructive hover:underline"
        >
          <Trash2 className="h-4 w-4" />
          Tozalash
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* Cart Items */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 rounded-xl border p-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-20 w-20 rounded-lg object-cover"
              />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{item.product.name}</h3>
                    {item.selectedVariant && (
                      <p className="text-sm text-muted-foreground">{item.selectedVariant.label}</p>
                    )}
                    <p className="mt-1 font-bold text-primary">
                      {formatPrice(item.selectedVariant?.price ?? item.product.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-bold">Buyurtma</h2>
          <div className="mt-4 space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.product.name} × {item.quantity}
                </span>
                <span>
                  {formatPrice(
                    (item.selectedVariant?.price ?? item.product.price) * item.quantity
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <span className="font-semibold">Jami:</span>
            <span className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
          </div>
          <Button
            className="mt-4 w-full gap-2"
            size="lg"
            onClick={() => navigate("/checkout")}
          >
            Buyurtma berish
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="mt-2 w-full gap-2"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            Xaridni davom ettirish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
