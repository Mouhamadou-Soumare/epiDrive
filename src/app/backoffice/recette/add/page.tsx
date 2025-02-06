"use client";

import { useState } from "react";
import { Produit, Recette, Role, Ingredient } from "../../../../../types";
import FormInputField from "../components/FormInputField";
import ProduitList from "../components/ProduitList";
import Alert from "../components/Alert";
import { useAddRecette } from "@/hooks/recettes/useRecettes";
import { useGetProduits } from "@/hooks/products/useProduits";

export default function AddRecettePage() {
  const [recette, setRecette] = useState<Recette>({
    id: 0,
    title: '',
    description: '',
    instructions: '',
    produits: [],
    ingredients: [], // ✅ Ajout de `ingredients` pour correspondre au type `Recette`
    image: "",
    user: {
      id: 1,
      username: "",
      email: "",
      password: "",
      role: Role.USER,
      commandes: [],
      recettes: [],
      livraisons: [],
      logs: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  });

  const { produits, loading: produitsLoading, error: produitsError } = useGetProduits();
  const { addRecette, loading: addRecetteLoading, error: addRecetteError } = useAddRecette();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecette({ ...recette, [name]: name === "imageId" || name === "userId" ? parseInt(value) : value });
  };

  const handleAddProduit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const produitId = parseInt(e.target.value);
    const produit = produits?.find((p: Produit) => p.id === produitId);
    if (produit && !recette.produits.some((p) => p.id === produitId)) {
      setRecette({ ...recette, produits: [...recette.produits, produit] });
    }
    e.target.value = ''; // Reset selection
  };

  const handleRemoveProduit = (produitId: number) => {
    setRecette({ ...recette, produits: recette.produits.filter((p) => p.id !== produitId) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRecette(recette);
    window.location.href = "/backoffice/recette";
  };

  return (
    <>
      {addRecetteError && <Alert message="Une erreur est survenue lors de l'ajout de la recette." type="error" />}
      
      <h1 className="text-3xl font-extrabold leading-tight text-gray-900">Ajouter une recette</h1>
      
      <form onSubmit={handleSubmit} className="my-6">
        <FormInputField id="title" name="title" value={recette.title} label="Titre" onChange={handleInputChange} />
        <FormInputField id="description" name="description" value={recette.description} label="Description" type="textarea" onChange={handleInputChange} />
        <FormInputField id="instructions" name="instructions" value={recette.instructions} label="Instructions" type="textarea" onChange={handleInputChange} />
        
        <div className="mb-5">
          <label htmlFor="produit" className="block mb-2 text-sm font-medium text-gray-900">Ingrédients</label>
          {produitsLoading ? (
            <div>Chargement des produits...</div>
          ) : produitsError ? (
            <Alert message="Erreur lors de la récupération des produits." type="error" />
          ) : (
            <select
              id="produit"
              name="produit"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={handleAddProduit}
            >
              <option value="">Ajouter un produit</option>
              {produits?.map((produit: Produit) => (
                <option key={produit.id} value={produit.id}>
                  {produit.name}
                </option>
              ))}
            </select>
          )}
          <ProduitList produits={recette.produits} onRemoveProduit={handleRemoveProduit} />
        </div>
        
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          disabled={addRecetteLoading}
        >
          {addRecetteLoading ? "Ajout en cours..." : "Ajouter la recette"}
        </button>
      </form>
    </>
  );
}
