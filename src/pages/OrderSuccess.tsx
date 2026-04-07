import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderNumber = (location.state as any)?.orderNumber || "XOZ-00000000-0000";

  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-10 w-10" style={{ color: "hsl(152, 69%, 45%)" }} />
      </div>

      <h1 className="mt-6 text-2xl font-bold md:text-3xl">Buyurtma qabul qilindi!</h1>

      <p className="mt-4 text-muted-foreground">Buyurtma raqami:</p>
      <p className="mt-1 text-xl font-bold text-primary md:text-2xl">{orderNumber}</p>

      <p className="mt-6 max-w-md text-muted-foreground">
        Tez orada operatorimiz siz bilan bog'lanadi va buyurtmani tasdiqlaydi.
      </p>

      <div className="mt-8 rounded-xl border px-8 py-5 text-center">
        <p className="text-sm text-muted-foreground">Savollar bo'lsa:</p>
        <a
          href="tel:+998901234567"
          className="mt-2 inline-flex items-center gap-2 text-primary hover:underline"
        >
          <Phone className="h-4 w-4" />
          +998 90 123 45 67
        </a>
      </div>

      <Button className="mt-8 gap-2" size="lg" onClick={() => navigate("/")}>
        <ArrowLeft className="h-4 w-4" />
        Bosh sahifaga qaytish
      </Button>
    </div>
  );
};

export default OrderSuccess;
