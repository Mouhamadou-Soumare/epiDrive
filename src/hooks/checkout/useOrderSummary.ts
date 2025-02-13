import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
  image: string;
}

interface ShippingAddress {
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
}

interface OrderSummary {
  items: OrderItem[];
  totalAmount: number;
  livraisonType: string;
  shippingAddress: ShippingAddress;
}

export function useOrderSummary() {
  const { status } = useSession();
  const router = useRouter();
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    const savedOrder = localStorage.getItem("orderSummary");
    if (savedOrder) {
      setOrderSummary(JSON.parse(savedOrder));
      localStorage.removeItem("orderSummary");
    }

    localStorage.removeItem("sessionId");
    setLoading(false);
  }, [status]);

  return { orderSummary, loading };
}