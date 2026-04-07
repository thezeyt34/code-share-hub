import { useNavigate } from "react-router-dom";
import { ShoppingCart, Package, Box, DollarSign, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/context/AdminContext";
import { useOrders } from "@/context/OrderContext";
import { products, formatPrice } from "@/data/products";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAdmin();
  const { orders } = useOrders();

  if (!isAdmin) {
    navigate("/admin/login");
    return null;
  }

  const newOrders = orders.filter((o) => o.status === "Yangi").length;
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  const statusColor = (status: string) => {
    switch (status) {
      case "Yangi": return "bg-blue-100 text-blue-700";
      case "Tayyor": return "bg-yellow-100 text-yellow-700";
      case "Yetkazildi": return "bg-green-100 text-green-700";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} daqiqa oldin`;
    const d = date;
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <div className="border-b bg-background">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-lg font-bold text-primary">Xoztovars</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">admin</span>
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate("/"); }}>
              <LogOut className="mr-1 h-4 w-4" />
              Chiqish
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Stat Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="flex items-center justify-between rounded-xl border bg-background p-5">
            <div>
              <p className="text-sm text-muted-foreground">Yangi buyurtmalar</p>
              <p className="mt-1 text-2xl font-bold">{newOrders}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "hsl(217, 91%, 60%)" }}>
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border bg-background p-5">
            <div>
              <p className="text-sm text-muted-foreground">Jami buyurtmalar</p>
              <p className="mt-1 text-2xl font-bold">{totalOrders}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "hsl(262, 83%, 58%)" }}>
              <Package className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border bg-background p-5">
            <div>
              <p className="text-sm text-muted-foreground">Mahsulotlar</p>
              <p className="mt-1 text-2xl font-bold">{totalProducts}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "hsl(152, 69%, 45%)" }}>
              <Box className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border bg-background p-5">
            <div>
              <p className="text-sm text-muted-foreground">Daromad</p>
              <p className="mt-1 text-2xl font-bold">{formatPrice(totalRevenue)}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "hsl(25, 95%, 53%)" }}>
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Recent Orders */}
          <div className="rounded-xl border bg-background">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="font-bold">So'nggi buyurtmalar</h2>
              <button className="text-sm text-muted-foreground hover:text-foreground">Barchasi</button>
            </div>
            <div className="divide-y">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between px-6 py-4">
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
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      ⏱ {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock */}
          <div className="rounded-xl border bg-background">
            <div className="border-b px-6 py-4">
              <h2 className="font-bold">Kam qolgan mahsulotlar</h2>
            </div>
            <div className="px-6 py-6 text-center text-sm text-muted-foreground">
              Hammasi yetarli
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
