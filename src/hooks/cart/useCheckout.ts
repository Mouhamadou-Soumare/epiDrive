import { useState } from "react";
import { CartItem, Livraison_Type } from "types";

export function useCheckout(cartItems: CartItem[]) {
  const [formData, setFormData] = useState({
    adresse: "",
    ville: "",
    codePostal: "",
    pays: "",
  });
  const [livraisonType, setLivraisonType] = useState<Livraison_Type | null>(null);
  const [errors, setErrors] = useState({
    adresse: "",
    ville: "",
    codePostal: "",
    pays: "",
    livraisonType: "",
  });

  // 🔹 Nouvelle fonction pour mettre à jour tout le formulaire (utile pour les adresses enregistrées)
  const setFullFormData = (newData: {
    adresse: string;
    ville: string;
    codePostal: string;
    pays: string;
  }) => {
    setFormData(newData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "livraisonType") {
      setLivraisonType(value as unknown as Livraison_Type);
    }
  };

  const validateForm = () => {
    const newErrors = {
      adresse: formData.adresse ? "" : "Adresse est requise.",
      ville: formData.ville ? "" : "Ville est requise.",
      codePostal: /^[0-9]{5}$/.test(formData.codePostal) ? "" : "Code postal invalide.",
      pays: formData.pays ? "" : "Pays est requis.",
      livraisonType: livraisonType ? "" : "Méthode de livraison requise.",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const produits = cartItems.map((item) => ({
        id: item.produit.id,
        name: item.produit.name,
        quantity: item.quantite,
        price: item.produit.prix,
        image: item.produit.image.path,
        total: item.produit.prix * item.quantite,
      }));

      const orderSummary = {
        items: produits,
        totalAmount: produits.reduce((total, item) => total + item.total, 0),
        shippingAddress: formData,
        livraisonType,
      };

      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderSummary }),
        });

        const data = await response.json();
        if (data.url) {
          localStorage.setItem("orderSummary", JSON.stringify(orderSummary));
          window.location.href = data.url;
        } else {
          alert("Erreur lors de la création de la session Stripe.");
        }
      } catch (error) {
        console.error("Erreur lors de la validation du formulaire:", error);
      }
    } else {
      alert("Veuillez corriger les erreurs du formulaire.");
    }
  };

  return {
    formData,
    setFullFormData, // 🔹 Ajout de la fonction ici
    livraisonType,
    errors,
    handleInputChange,
    handleSubmit,
  };
}
