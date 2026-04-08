import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { ProductProvider } from "@/context/ProductContext";
import { AdminProvider } from "@/context/AdminContext";
import { CategoryProvider } from "@/context/CategoryContext";
import Header from "@/components/Header";
import Index from "./pages/Index.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import CartPage from "./pages/CartPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import OrderSuccess from "./pages/OrderSuccess.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminOrders from "./pages/AdminOrders.tsx";
import AdminProducts from "./pages/AdminProducts.tsx";
import AdminCategories from "./pages/AdminCategories.tsx";
import AdminFinance from "./pages/AdminFinance.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminProvider>
          <OrderProvider>
            <ProductProvider>
            <CategoryProvider>
            <CartProvider>
              <Routes>
                {/* Admin routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/finance" element={<AdminFinance />} />
                <Route path="/admin/login" element={<><Header /><AdminLogin /></>} />

                {/* Public routes */}
                <Route path="*" element={
                  <>
                    <Header />
                    <main>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/order-success" element={<OrderSuccess />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <footer className="border-t py-6">
                      <div className="container flex flex-col items-center justify-between gap-2 sm:flex-row">
                        <p className="text-sm text-muted-foreground">© 2024 Xoztovars. Barcha huquqlar himoyalangan.</p>
                        <p className="text-sm text-muted-foreground">+998 90 123 45 67</p>
                      </div>
                    </footer>
                  </>
                } />
              </Routes>
            </CartProvider>
            </CategoryProvider>
            </ProductProvider>
          </OrderProvider>
        </AdminProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
