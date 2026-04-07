import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { CartItem, formatPrice } from "@/data/products";

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  items: CartItem[];
  totalPrice: number;
  status: "Yangi" | "Tayyor" | "Yetkazildi";
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

// Seed some demo orders so the dashboard isn't empty
const now = new Date();
const demoOrders: Order[] = [
  {
    id: "1",
    orderNumber: "XOZ-20260407-8796",
    customerName: "Nizomiddin",
    phone: "+998947267726",
    items: [],
    totalPrice: 390000,
    status: "Yetkazildi",
    createdAt: new Date(now.getTime() - 60000),
    deliveryMethod: "delivery",
    paymentMethod: "cash",
  },
  {
    id: "2",
    orderNumber: "XOZ-20260402-0744",
    customerName: "Gsusi",
    phone: "+998992592009",
    items: [],
    totalPrice: 165000,
    status: "Yangi",
    createdAt: new Date(2026, 3, 2),
    deliveryMethod: "pickup",
    paymentMethod: "card",
  },
  {
    id: "3",
    orderNumber: "XOZ-20260402-3182",
    customerName: "Shukurullox",
    phone: "+998992592009",
    items: [],
    totalPrice: 840000,
    status: "Yangi",
    createdAt: new Date(2026, 3, 2),
    deliveryMethod: "delivery",
    paymentMethod: "transfer",
  },
  {
    id: "4",
    orderNumber: "XOZ-20260402-4445",
    customerName: "Shukurullox",
    phone: "+998992592009",
    items: [],
    totalPrice: 3900000,
    status: "Yangi",
    createdAt: new Date(2026, 3, 2),
    deliveryMethod: "delivery",
    paymentMethod: "cash",
  },
  {
    id: "5",
    orderNumber: "XOZ-20260331-9079",
    customerName: "nizomiddin",
    phone: "+998947267726",
    items: [],
    totalPrice: 115000,
    status: "Yangi",
    createdAt: new Date(2026, 2, 31),
    deliveryMethod: "pickup",
    paymentMethod: "cash",
  },
  {
    id: "6",
    orderNumber: "XOZ-20260331-9679",
    customerName: "ssss",
    phone: "+998888254803",
    items: [],
    totalPrice: 30000,
    status: "Tayyor",
    createdAt: new Date(2026, 2, 31),
    deliveryMethod: "pickup",
    paymentMethod: "card",
  },
  {
    id: "7",
    orderNumber: "XOZ-20260326-0477",
    customerName: "Шукуруллох",
    phone: "+998992592009",
    items: [],
    totalPrice: 75000,
    status: "Yangi",
    createdAt: new Date(2026, 2, 26),
    deliveryMethod: "delivery",
    paymentMethod: "cash",
  },
];

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(demoOrders);

  const addOrder = useCallback((order: Omit<Order, "id" | "createdAt" | "status">) => {
    const newOrder: Order = {
      ...order,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      status: "Yangi",
    };
    setOrders((prev) => [newOrder, ...prev]);
  }, []);

  const updateOrderStatus = useCallback((id: string, status: Order["status"]) => {
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
