import { useState } from "react";
import { DollarSign, TrendingUp, ShoppingCart, BarChart3, Package } from "lucide-react";
import { useOrders } from "@/context/OrderContext";
import { formatPrice } from "@/data/products";
import AdminLayout from "@/components/AdminLayout";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area,
} from "recharts";

const PERIODS = ["7 kun", "30 kun", "90 kun", "Barchasi"] as const;

const AdminFinance = () => {
  const { orders } = useOrders();
  const [period, setPeriod] = useState<string>("30 kun");

  const now = new Date();
  const daysMap: Record<string, number> = { "7 kun": 7, "30 kun": 30, "90 kun": 90 };
  const days = daysMap[period] || 9999;
  const cutoff = new Date(now.getTime() - days * 86400000);

  const filtered = orders.filter((o) => new Date(o.createdAt) >= cutoff);
  const completed = filtered.filter((o) => o.status === "Yetkazildi" || o.status === "Tayyor");

  // Stats
  const totalRevenue = completed.reduce((s, o) => s + o.totalPrice, 0);
  const totalCost = completed.reduce((s, o) => {
    return s + o.items.reduce((c, item) => c + (item.product.costPrice || 0) * item.quantity, 0);
  }, 0);
  const profit = totalRevenue - totalCost;
  const avgCheck = completed.length > 0 ? Math.round(totalRevenue / completed.length) : 0;
  const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : "0";

  // Daily chart data
  const dailyMap = new Map<string, { revenue: number; profit: number }>();
  completed.forEach((o) => {
    const key = new Date(o.createdAt).toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit" });
    const prev = dailyMap.get(key) || { revenue: 0, profit: 0 };
    const orderCost = o.items.reduce((c, item) => c + (item.product.costPrice || 0) * item.quantity, 0);
    dailyMap.set(key, {
      revenue: prev.revenue + o.totalPrice,
      profit: prev.profit + (o.totalPrice - orderCost),
    });
  });
  const dailyData = Array.from(dailyMap, ([date, v]) => ({ date, ...v }));

  // Product profit table
  const productMap = new Map<string, { name: string; qty: number; revenue: number; cost: number }>();
  completed.forEach((o) => {
    o.items.forEach((item) => {
      const prev = productMap.get(item.product.id) || { name: item.product.name, qty: 0, revenue: 0, cost: 0 };
      productMap.set(item.product.id, {
        name: item.product.name,
        qty: prev.qty + item.quantity,
        revenue: prev.revenue + item.product.price * item.quantity,
        cost: prev.cost + (item.product.costPrice || 0) * item.quantity,
      });
    });
  });
  const productData = Array.from(productMap.values())
    .map((p) => ({ ...p, profit: p.revenue - p.cost, margin: p.revenue > 0 ? ((p.revenue - p.cost) / p.revenue * 100).toFixed(1) : "0" }))
    .sort((a, b) => b.revenue - a.revenue);

  // Order status pie
  const statusCounts = new Map<string, number>();
  filtered.forEach((o) => statusCounts.set(o.status, (statusCounts.get(o.status) || 0) + 1));
  const statusData = Array.from(statusCounts, ([name, value]) => ({ name, value }));
  const PIE_COLORS = ["hsl(var(--primary))", "#f97316", "#22c55e", "#ef4444", "#6b7280"];

  // Top products bar
  const topProducts = productData.slice(0, 5).map((p) => ({
    name: p.name,
    daromad: p.revenue,
    foyda: p.profit,
  }));

  // Trend calc
  const prevCutoff = new Date(cutoff.getTime() - days * 86400000);
  const prevCompleted = orders.filter(
    (o) => (o.status === "Yetkazildi" || o.status === "Tayyor") &&
      new Date(o.createdAt) >= prevCutoff && new Date(o.createdAt) < cutoff
  );
  const prevRevenue = prevCompleted.reduce((s, o) => s + o.totalPrice, 0);
  const trend = prevRevenue > 0 ? (((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(0) : totalRevenue > 0 ? "+100" : "0";

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Moliya</h1>
          <p className="text-sm text-muted-foreground">Daromad, xarajat va foyda tahlili</p>
        </div>
        <div className="flex gap-1 rounded-lg border p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        {[
          { label: "Umumiy daromad", value: formatPrice(totalRevenue), icon: DollarSign, color: "bg-primary/10 text-primary" },
          { label: "Umumiy tannarx", value: formatPrice(totalCost), icon: Package, color: "bg-orange-100 text-orange-600" },
          { label: "Sof foyda", value: formatPrice(profit), icon: TrendingUp, color: "bg-green-100 text-green-600" },
          { label: "O'rtacha chek", value: formatPrice(avgCheck), icon: ShoppingCart, color: "bg-purple-100 text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-background p-5">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Mini stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-background p-4 flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Foyda foizi</p>
            <p className="text-lg font-bold">{profitMargin}%</p>
          </div>
        </div>
        <div className="rounded-xl border bg-background p-4 flex items-center gap-3">
          <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Buyurtmalar</p>
            <p className="text-lg font-bold">{completed.length}</p>
          </div>
        </div>
        <div className="rounded-xl border bg-background p-4 flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Trend</p>
            <p className="text-lg font-bold text-green-600">+{trend}%</p>
          </div>
        </div>
      </div>

      {/* Daily chart */}
      <div className="mt-6 rounded-xl border bg-background p-6">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <BarChart3 className="h-5 w-5 text-muted-foreground" /> Kunlik daromad va foyda
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => formatPrice(v)} />
            <Legend />
            <Area type="monotone" dataKey="revenue" name="Daromad" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} />
            <Area type="monotone" dataKey="profit" name="Foyda" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Product table + Pie */}
      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-xl border bg-background p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <Package className="h-5 w-5 text-muted-foreground" /> Mahsulot bo'yicha foyda
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="pb-2 text-left font-medium">Mahsulot</th>
                <th className="pb-2 text-left font-medium">Soni</th>
                <th className="pb-2 text-left font-medium">Daromad</th>
                <th className="pb-2 text-left font-medium">Foyda</th>
                <th className="pb-2 text-left font-medium">Marja</th>
              </tr>
            </thead>
            <tbody>
              {productData.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Ma'lumot yo'q</td></tr>
              )}
              {productData.map((p) => (
                <tr key={p.name} className="border-b last:border-0">
                  <td className="py-3 font-medium">{p.name}</td>
                  <td className="py-3">{p.qty}</td>
                  <td className="py-3">{formatPrice(p.revenue)}</td>
                  <td className="py-3 font-medium text-green-600">{formatPrice(p.profit)}</td>
                  <td className="py-3">{p.margin}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border bg-background p-6">
          <h2 className="mb-4 font-semibold">Buyurtma holatlari</h2>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">Ma'lumot yo'q</p>
          )}
        </div>
      </div>

      {/* Top products bar */}
      {topProducts.length > 0 && (
        <div className="mt-6 rounded-xl border bg-background p-6">
          <h2 className="mb-4 font-semibold">Top mahsulotlar (daromad bo'yicha)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => formatPrice(v)} />
              <Legend />
              <Bar dataKey="daromad" name="Daromad" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              <Bar dataKey="foyda" name="Foyda" fill="#22c55e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminFinance;
