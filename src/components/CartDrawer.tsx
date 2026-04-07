import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Savat ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground">Savat bo'sh</p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3 rounded-lg border p-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold">{item.product.name}</h4>
                    {item.selectedVariant && (
                      <p className="text-xs text-muted-foreground">{item.selectedVariant.label}</p>
                    )}
                    <p className="text-sm font-bold text-primary">
                      {formatPrice((item.selectedVariant?.price ?? item.product.price) * item.quantity)}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto h-7 w-7 text-destructive"
                        onClick={() => removeFromCart(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Jami:</span>
                <span className="text-lg font-bold text-primary">{formatPrice(totalPrice)}</span>
              </div>
              <Button className="w-full" size="lg">
                Buyurtma berish
              </Button>
              <Button variant="outline" className="w-full" onClick={clearCart}>
                Savatni tozalash
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
