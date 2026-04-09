import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { CartItem, formatPrice } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  items: CartItem[];
  totalPrice: number;
  status: "Yangi" | "Tayyorlanmoqda" | "Tayyor" | "Yetkazildi" | "Bekor qilingan";
  createdAt: Date;
  deliveryMethod: "pickup" | "delivery";
  paymentMethod: "cash" | "card" | "transfer";
  comment?: string;
  address?: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = useCallback(async () => {
    const { data: rows, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to fetch orders", error);
      return;
    }
    const mapped: Order[] = (rows || []).map((r: any) => ({
      id: r.id,
      orderNumber: r.order_number,
      customerName: r.customer_name,
      phone: r.phone,
      totalPrice: r.total_price,
      status: r.status as Order["status"],
      createdAt: new Date(r.created_at),
      deliveryMethod: r.delivery_method as "pickup" | "delivery",
      paymentMethod: r.payment_method as "cash" | "card" | "transfer",
      comment: r.comment || undefined,
      address: r.address || undefined,
      items: (r.order_items || []).map((item: any) => ({
        product: {
          id: "",
          name: item.product_name,
          price: item.product_price,
          costPrice: 0,
          oldPrice: 0,
          discount: 0,
          image: "",
          category: "",
          stock: "",
        },
        quantity: item.quantity,
        selectedVariant: item.variant_label ? { label: item.variant_label, price: item.product_price } : undefined,
      })),
    }));
    setOrders(mapped);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrder = useCallback(async (order: Omit<Order, "id" | "createdAt" | "status">) => {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: order.orderNumber,
        customer_name: order.customerName,
        phone: order.phone,
        total_price: order.totalPrice,
        delivery_method: order.deliveryMethod,
        payment_method: order.paymentMethod,
        comment: order.comment || "",
        address: order.address || "",
      })
      .select()
      .single();
    if (error) {
      console.error("Failed to add order", error);
      return;
    }

    // Insert order items
    if (order.items.length > 0) {
      await supabase.from("order_items").insert(
        order.items.map((item) => ({
          order_id: data.id,
          product_name: item.product.name,
          product_price: item.selectedVariant?.price ?? item.product.price,
          quantity: item.quantity,
          variant_label: item.selectedVariant?.label || "",
        }))
      );
    }

    const newOrder: Order = {
      ...order,
      id: data.id,
      createdAt: new Date(data.created_at),
      status: "Yangi",
    };
    setOrders((prev) => [newOrder, ...prev]);
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: Order["status"]) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}
