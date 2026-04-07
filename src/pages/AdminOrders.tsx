import { useState } from "react";
import { ArrowLeft, User, Phone, CreditCard, Truck, MapPin, ExternalLink } from "lucide-react";
import { useOrders, Order } from "@/context/OrderContext";
import { formatPrice } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/AdminLayout";

const statusColor = (status: string) => {
  switch (status) {
    case "Yangi": return "bg-blue-100 text-blue-700";
    case "Tayyorlanmoqda": return "bg-orange-100 text-orange-700";
    case "Tayyor": return "bg-yellow-100 text-yellow-700";
    case "Yetkazildi": return "bg-green-100 text-green-700";
    case "Bekor qilingan": return "bg-red-100 text-red-700";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const paymentLabel = (m: string) => {
  switch (m) {
    case "cash": return "Naqd pul";
    case "card": return "Karta";
    case "transfer": return "O'tkazma";
    default: return m;
  }
};

const deliveryLabel = (m: string) => {
  switch (m) {
    case "pickup": return "Olib ketish";
    case "delivery": return "Yetkazib berish";
    default: return m;
  }
};

const formatDate = (date: Date) => {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}, ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
};

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = orders.find((o) => o.id === selectedId);

  if (selected) {
    return (
      <AdminLayout>
        <div>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedId(null)} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{selected.orderNumber}</h1>
                <p className="text-sm text-muted-foreground">{formatDate(selected.createdAt)}</p>
              </div>
            </div>
            <span className={`rounded-full px-4 py-1.5 text-sm font-medium ${statusColor(selected.status)}`}>
              {selected.status}
            </span>
          </div>

          {/* Status buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            {(["Tayyorlanmoqda", "Tayyor", "Yetkazildi"] as const).map((s) => (
              <Button
                key={s}
                size="sm"
                onClick={() => updateOrderStatus(selected.id, s as Order["status"])}
                className={
                  s === "Tayyorlanmoqda" ? "bg-orange-500 hover:bg-orange-600 text-white" :
                  s === "Tayyor" ? "bg-yellow-500 hover:bg-yellow-600 text-white" :
                  "bg-green-500 hover:bg-green-600 text-white"
                }
              >
                {s}
              </Button>
            ))}
            <Button
              size="sm"
              variant="destructive"
              onClick={() => updateOrderStatus(selected.id, "Bekor qilingan" as Order["status"])}
            >
              Bekor qilish
            </Button>
          </div>

          {/* Content */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Customer info */}
            <div className="rounded-xl border bg-background p-6">
              <h2 className="text-lg font-bold">Mijoz ma'lumotlari</h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{selected.customerName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${selected.phone}`} className="text-primary hover:underline">{selected.phone}</a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>{paymentLabel(selected.paymentMethod)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span>{deliveryLabel(selected.deliveryMethod)}</span>
                </div>

                {selected.address && (
                  <>
                    <div className="my-3 border-t" />
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <span>{selected.address}</span>
                    </div>
                    <div className="mt-2 rounded-lg bg-muted p-4">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(selected.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        Open in Maps <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </>
                )}
              </div>

              {selected.comment && (
                <>
                  <div className="my-4 border-t" />
                  <div>
                    <p className="text-sm text-muted-foreground">Izoh:</p>
                    <p className="mt-1 text-sm">{selected.comment}</p>
                  </div>
                </>
              )}
            </div>

            {/* Order items */}
            <div className="rounded-xl border bg-background p-6">
              <h2 className="text-lg font-bold">Buyurtma tarkibi</h2>
              <div className="mt-4 space-y-3">
                {selected.items.length > 0 ? (
                  selected.items.map((item, i) => {
                    const price = item.selectedVariant?.price ?? item.product.price;
                    return (
                      <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × {formatPrice(price)}
                          </p>
                        </div>
                        <p className="font-medium">{formatPrice(price * item.quantity)}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">Ma'lumot mavjud emas</p>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <span className="font-bold">Jami:</span>
                <span className="text-xl font-bold text-primary">{formatPrice(selected.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold">Buyurtmalar</h1>
      <div className="mt-6 rounded-xl border bg-background">
        <div className="divide-y">
          {orders.length === 0 && (
            <div className="px-6 py-12 text-center text-muted-foreground">Buyurtmalar yo'q</div>
          )}
          {orders.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedId(order.id)}
              className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{order.orderNumber}</span>
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {order.customerName} • {order.phone}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(order.totalPrice)}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
