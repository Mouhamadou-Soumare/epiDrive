import { useEffect, useState } from "react";

function getOrCreateSessionId() {
  const sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    const newSessionId = `session-${Date.now()}`;
    localStorage.setItem("sessionId", newSessionId);
    return newSessionId;
  }
  return sessionId;
}

type CartItem = {
  quantite: number;
  produit: any;
  prix: number;
  id: number;
  name: string;
  imageSrc: string;
  imageAlt: string;
};

export function useGetCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchCart() {
    const sessionId = getOrCreateSessionId();

    try {
      const res = await fetch(`/api/cart?sessionId=${sessionId}`);
      const data = await res.json();

      if (res.ok) {
        setCartItems(data);
      } else {
        console.error(
          "Erreur de récupération du panier:",
          data.error || "Erreur de réponse non spécifiée"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du panier:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCart(); // Chargement initial du panier

    // Initialisation du SSE
    const eventSource = new EventSource("/api/cart/updates");

    eventSource.onmessage = (event) => {
      console.log("📢 Mise à jour du panier reçue via SSE:", event.data);
      try {
        const updatedCart = JSON.parse(event.data);
        setCartItems(updatedCart);
      } catch (error) {
        console.error("Erreur de parsing du panier SSE:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("❌ Erreur SSE:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close(); // Fermeture de la connexion SSE à la destruction du composant
    };
  }, []);

  return { cartItems, loading, refreshCart: fetchCart };
}
