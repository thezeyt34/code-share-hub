import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, Tags, DollarSign, LogOut } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Buyurtmalar", url: "/admin/orders", icon: ShoppingCart },
  { title: "Mahsulotlar", url: "/admin/products", icon: Package },
  { title: "Kategoriyalar", url: "/admin/categories", icon: Tags },
  { title: "Moliya", url: "/admin/finance", icon: DollarSign },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, logout } = useAdmin();

  if (!isAdmin) {
    navigate("/admin/login");
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-[200px] flex-col border-r bg-background">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">X</div>
          <span className="text-lg font-bold">Xoztovars</span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = location.pathname === item.url;
            return (
              <button
                key={item.url}
                onClick={() => navigate(item.url)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </button>
            );
          })}
        </nav>

        <div className="border-t p-3">
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Chiqish
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="flex h-14 items-center justify-end border-b px-6">
          <span className="text-sm text-muted-foreground">admin</span>
        </header>
        <main className="flex-1 bg-muted/30 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
