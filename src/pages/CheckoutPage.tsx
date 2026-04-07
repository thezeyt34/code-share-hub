import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Store, Truck, Banknote, CreditCard, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { toast } from "sonner";
import DeliveryMap from "@/components/DeliveryMap";

type DeliveryMethod = "pickup" | "delivery";
type PaymentMethod = "cash" | "card" | "transfer";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998 90 123 45 67");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("pickup");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [comment, setComment] = useState("");
  const [address, setAddress] = useState("");
  const [mapPosition, setMapPosition] = useState<[number, number]>([41.311081, 69.240562]);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Iltimos, ismingizni kiriting");
      return;
    }
    if (!phone.trim()) {
      toast.error("Iltimos, telefon raqamingizni kiriting");
      return;
    }

    toast.success("Buyurtma qabul qilindi! Tez orada siz bilan bog'lanamiz.");
    clearCart();
    navigate("/");
  };

  return (
    <div className="container py-6">
      <button
        onClick={() => navigate("/cart")}
        className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Savatga qaytish
      </button>

      <h1 className="text-2xl font-bold md:text-3xl">Buyurtmani rasmiylashtirish</h1>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="rounded-xl border p-6">
              <h2 className="text-lg font-bold">Aloqa ma'lumotlari</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">
                    Ism <span className="text-destructive">*</span>
                  </label>
                  <Input
                    className="mt-1"
                    placeholder="To'liq ismingiz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Telefon <span className="text-destructive">*</span>
                  </label>
                  <Input
                    className="mt-1"
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={20}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="rounded-xl border p-6">
              <h2 className="text-lg font-bold">Yetkazib berish</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors ${
                    deliveryMethod === "pickup"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Store className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">Olib ketish</p>
                    <p className="text-sm text-muted-foreground">Do'kondan o'zingiz olasiz</p>
                  </div>
                  {deliveryMethod === "pickup" && (
                    <span className="text-primary">✓</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("delivery")}
                  className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors ${
                    deliveryMethod === "delivery"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">Yetkazib berish</p>
                    <p className="text-sm text-muted-foreground">Manzilingizga yetkazamiz</p>
                  </div>
                  {deliveryMethod === "delivery" && (
                    <span className="text-primary">✓</span>
                  )}
                </button>
              </div>

              {deliveryMethod === "delivery" && (
                <div className="mt-4">
                  <DeliveryMap
                    position={mapPosition}
                    onPositionChange={setMapPosition}
                    address={address}
                    onAddressChange={setAddress}
                  />
                  <p className="mt-2 flex items-center gap-1 text-sm text-destructive">
                    <MapPin className="h-3 w-3" />
                    Xaritadagi istalgan joyni bosing yoki ⊕ tugmasini bosib joriy joylashuvingizni aniqlang
                  </p>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="rounded-xl border p-6">
              <h2 className="text-lg font-bold">To'lov usuli</h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { id: "cash" as const, label: "Naqd", icon: Banknote },
                  { id: "card" as const, label: "Karta", icon: CreditCard },
                  { id: "transfer" as const, label: "O'tkazma", icon: Building2 },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPaymentMethod(id)}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors ${
                      paymentMethod === id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="rounded-xl border p-6">
              <h2 className="text-lg font-bold">Izoh (ixtiyoriy)</h2>
              <Textarea
                className="mt-4"
                placeholder="Buyurtma bo'yicha qo'shimcha ma'lumot..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                rows={4}
              />
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
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
              <Button type="submit" className="mt-4 w-full" size="lg">
                Buyurtmani tasdiqlash
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
