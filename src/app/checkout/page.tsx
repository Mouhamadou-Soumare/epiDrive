'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Livraison_Type } from "../../../types";
import { useAddCommande } from '@/hooks/commandes/useCommandes';
import { useGetLivraisons } from '@/hooks/livraisons/useLivraisons';

type CartItem = {
  id: number;
  produit: {
    id: number;
    name: string;
    prix: number;
    description: string;
    image: { path: string };
  };
  quantite: number;
};

export default function SearchResultsPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id; // ID utilisateur
  const { livraisons, loading: loadingLivraisons, error } = useGetLivraisons(); // Utilisation du hook
  const { loading: addingCommande, error: addError } = useAddCommande();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [livraisonType, setLivraisonType] = useState<Livraison_Type | null>(null);
  const [selectedAdresseId, setSelectedAdresseId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    adresse: '',
    ville: '',
    codePostal: '',
    pays: '',
  });

  const [errors, setErrors] = useState({
    adresse: '',
    ville: '',
    codePostal: '',
    pays: '',
    livraisonType: '',
  });

  const router = useRouter();

  function getOrCreateSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }
  
  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch(`/api/cart?sessionId=${getOrCreateSessionId()}`);
        const data = await res.json();
        if (res.ok) setCartItems(data);
        else console.error('Erreur de récupération du panier:', data.error);
      } catch (error) {
        console.error("Erreur lors de la récupération du panier:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  // 🔹 Filtrer les adresses pour ne récupérer que celles de l'utilisateur connecté
  const userLivraisons = livraisons?.filter(livraison => livraison.fk_userId === parseInt(userId)) || [];

  // 🔹 Remplir le formulaire quand une adresse est sélectionnée
  const handleAdresseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    setSelectedAdresseId(selectedId);
    const selectedAdresse = userLivraisons.find(a => a.id === selectedId);
    if (selectedAdresse) {
      setFormData({
        adresse: selectedAdresse.adresse,
        ville: selectedAdresse.ville,
        codePostal: selectedAdresse.codePostal,
        pays: selectedAdresse.pays,
      });
    }
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
      adresse: formData.adresse ? '' : 'Adresse est requise.',
      ville: formData.ville ? '' : 'Ville est requise.',
      codePostal: /^[0-9]{5}$/.test(formData.codePostal) ? '' : 'Code postal invalide.',
      pays: formData.pays ? '' : 'Pays est requis.',
      livraisonType: livraisonType ? '' : 'Méthode de livraison requise.',
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Données soumises :", formData);

      const produits = cartItems.map((item) => ({
        id: item.produit.id,
        name: item.produit.name,
        quantity: item.quantite,
        price: item.produit.prix,
        image: item.produit.image.path,
        total: item.produit.prix * item.quantite,
      }));

      console.log("Produits envoyés à l'API Checkout :", produits);

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

  if (loading || loadingLivraisons || addingCommande) return <div>Chargement ...</div>;
  if (addError) return <div>Erreur lors de la soumission de la commande</div>;
  if (cartItems.length === 0) return <div>Votre panier est vide</div>;

  return (
    <div className="bg-white p-8 mx-10">
      <h2 className="text-2xl font-bold mb-4">Informations de Livraison</h2>
      <form onSubmit={handleSubmit}>

        {/* 🔹 Dropdown des adresses enregistrées si disponible */}
        {userId && userLivraisons.length > 0 && (
          <div className="mb-4">
            <label htmlFor="adresseExistante" className="block text-sm font-medium text-gray-700">
              Choisissez une adresse enregistrée :
            </label>
            <select
              id="adresseExistante"
              value={selectedAdresseId || ""}
              onChange={handleAdresseChange}
              className="mt-1 block w-full border rounded-md p-2"
            >
              <option value="">Sélectionner une adresse</option>
              {userLivraisons.map((adresse) => (
                <option key={adresse.id} value={adresse.id}>
                  {adresse.adresse}, {adresse.ville}, {adresse.codePostal}, {adresse.pays}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Formulaire classique d'adresse */}
        {["adresse", "ville", "codePostal", "pays"].map((field) => (
          <div key={field} className="mb-4">
            <label htmlFor={field} className="block text-sm font-medium text-gray-700">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
        ))}

        {/* 🔹 Dropdown pour le type de livraison */}
        <div className="mb-4">
          <label htmlFor="livraisonType" className="block text-sm font-medium text-gray-700">Méthode de Livraison</label>
          <select
            id="livraisonType"
            name="livraisonType"
            value={livraisonType || ""}
            onChange={handleInputChange}
            className={`mt-1 block w-full border rounded-md p-2 ${errors.livraisonType ? 'border-red-500' : 'border-gray-300'}`}
            required
          >
            <option value="">Sélectionnez une méthode</option>
            <option value="DOMICILE">DOMICILE</option>
            <option value="DRIVE">DRIVE</option>
            <option value="EMPORTER">EMPORTER</option>
          </select>
          {errors.livraisonType && <p className="text-red-500 text-sm mt-1">{errors.livraisonType}</p>}
        </div>

        <button type="submit" className="w-auto text-white bg-orange-300 py-2 px-4 rounded-md">Soumettre</button>
      </form>
    </div>
  );
}
