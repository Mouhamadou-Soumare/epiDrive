// hooks/commandes/useCommandeUpdates.ts

import { useEffect, useState } from "react";
import { Commande } from "types";

export function useCommandeUpdates() {
  const [updatedCommande, setUpdatedCommande] = useState<Commande | null>(null);

  useEffect(() => {
    const eventSource = new EventSource("/api/commande/updates");

    eventSource.onmessage = (event) => {
      try {
        const commande = JSON.parse(event.data);
        console.log("📢 Mise à jour de la commande reçue:", commande);
        setUpdatedCommande(commande);
      } catch (error) {
        console.error("❌ Erreur de parsing SSE:", error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { updatedCommande };
}
