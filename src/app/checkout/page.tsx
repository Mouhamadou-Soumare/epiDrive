"use client";

import { useSession } from "next-auth/react";
import { useGetLivraisons } from "@/hooks/livraisons/useLivraisons";
import { useCartData } from "@/hooks/cart/useCartData";
import { useCheckout } from "@/hooks/cart/useCheckout";
import LoaderComponent from "@/components/LoaderComponent";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Récupération des données du panier et livraisons
  const { cartItems, loading: loadingCart, error: cartError } = useCartData();
  const {
    livraisons,
    loading: loadingLivraisons,
    error: livraisonsError,
  } = useGetLivraisons();

  // Gestion du checkout
  const {
    formData,
    setFullFormData,
    livraisonType,
    errors,
    handleInputChange,
    handleSubmit,
  } = useCheckout(cartItems);

  // Filtrer les adresses de l'utilisateur si connecté
  const userLivraisons =
    livraisons?.filter(
      (livraison) => livraison.fk_userId === parseInt(userId)
    ) || [];

  // 🔹 Mise à jour automatique des champs quand une adresse est sélectionnée
  const handleAdresseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const selectedAdresse = userLivraisons.find((a) => a.id === selectedId);

    if (selectedAdresse) {
      setFullFormData({
        adresse: selectedAdresse.adresse,
        ville: selectedAdresse.ville,
        codePostal: selectedAdresse.codePostal,
        pays: selectedAdresse.pays,
      });
    }
  };

  if (loadingCart || loadingLivraisons) return <LoaderComponent />;
  if (cartError) return <div className="text-red-600">{cartError}</div>;
  if (livraisonsError)
    return <div className="text-red-600">{livraisonsError}</div>;
  if (cartItems.length === 0) return <div>Votre panier est vide</div>;

  return (
    <div className="bg-white p-8 mx-10">
      <h2 className="text-2xl font-bold mb-4">Informations de Livraison</h2>
      <form onSubmit={handleSubmit}>
        {/*  Dropdown des adresses enregistrées si disponible */}
        {userId && userLivraisons.length > 0 && (
          <div className="mb-4">
            <label
              htmlFor="adresseExistante"
              className="block text-sm font-medium text-gray-700"
            >
              Choisissez une adresse enregistrée :
            </label>
            <select
              id="adresseExistante"
              onChange={handleAdresseChange} 
              className="mt-1 block w-full border rounded-md p-2"
            >
              <option value="">Sélectionner une adresse</option>
              {userLivraisons.map((adresse) => (
                <option key={adresse.id} value={adresse.id}>
                  {adresse.adresse}, {adresse.ville}, {adresse.codePostal},{" "}
                  {adresse.pays}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Formulaire classique d'adresse */}
        {["adresse", "ville", "codePostal", "pays"].map((field) => (
          <div key={field} className="mb-4">
            <label
              htmlFor={field}
              className="block text-sm font-medium text-gray-700"
            >
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

        {/* Dropdown pour le type de livraison */}
        <div className="mb-4">
          <label
            htmlFor="livraisonType"
            className="block text-sm font-medium text-gray-700"
          >
            Méthode de Livraison
          </label>
          <select
            id="livraisonType"
            name="livraisonType"
            value={livraisonType || ""}
            onChange={handleInputChange}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.livraisonType ? "border-red-500" : "border-gray-300"
            }`}
            required
          >
            <option value="">Sélectionnez une méthode</option>
            <option value="DOMICILE">DOMICILE</option>
            <option value="DRIVE">DRIVE</option>
            <option value="EMPORTER">EMPORTER</option>
          </select>
        </div>

        {/*  Bouton de validation */}
        <button
          type="submit"
          className="w-auto text-white button-primary py-2 px-4 rounded-md"
        >
          Soumettre
        </button>
      </form>
    </div>
  );
}
