"use client";

import { useState, useCallback, useMemo } from "react";
import { Produit, Recette, Role, Ingredient } from "../../../../../types";
import FormInputField from "../components/FormInputField";
import ProduitList from "../components/ProduitList";
import Alert from "../components/Alert";
import { useAddRecette } from "@/hooks/recettes/useRecettes";
import { useGetProduits } from "@/hooks/products/useProduits";

export default function AddRecettePage() {
  const { produits, loading: produitsLoading, error: produitsError } = useGetProduits();
  const { addRecette, loading: addRecetteLoading, error: addRecetteError } = useAddRecette();

  const [recette, setRecette] = useState<Recette>({
    id: 0,
    title: '',
    description: '',
    instructions: '',
    produits: [],
    ingredients: [], 
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

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecette((prev) => ({ ...prev, [name]: value }));
  }, []);

  const [newImage, setNewImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setNewImage(e.target.files[0]);
      }
  };

  const handleAddProduit = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const produitId = parseInt(e.target.value);
    const produit = produits?.find((p: Produit) => p.id === produitId);

    if (produit && !recette.produits.some((p) => p.id === produitId)) {
      setRecette((prev) => ({
        ...prev,
        produits: [...prev.produits, produit],
      }));
    }

    e.target.value = ''; 
  }, [recette.produits, produits]);

  const handleRemoveProduit = useCallback((produitId: number) => {
    setRecette((prev) => ({
      ...prev,
      produits: prev.produits.filter((p) => p.id !== produitId),
    }));
  }, []);

  // Validation avant soumission
  const validateForm = () => {
    if (!recette.title.trim()) return "Le titre est requis.";
    if (!recette.description.trim()) return "La description est requise.";
    if (!recette.instructions.trim()) return "Les instructions sont requises.";
    if (recette.produits.length === 0) return "Veuillez ajouter au moins un produit.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const errorMsg = validateForm();
    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }

    const success = await addRecette(recette, newImage);
    if (success) {
      setSubmitSuccess(true);
      setTimeout(() => {
        window.location.href = "/backoffice/recette";
      }, 2000);
    }
  };

  return (
    <>
      {submitSuccess && <Alert message="Recette ajoutée avec succès !" type="success" />}
      {addRecetteError && <Alert message="Erreur lors de l'ajout de la recette." type="error" />}
      {validationError && <Alert message={validationError} type="error" />}
      
      <h1 className="text-3xl font-extrabold leading-tight text-gray-900">Ajouter une recette</h1>
      
      <form onSubmit={handleSubmit} className="my-6">
        <FormInputField id="title" name="title" value={recette.title} label="Titre" onChange={handleInputChange} />
        <FormInputField id="description" name="description" value={recette.description} label="Description" type="textarea" onChange={handleInputChange} />
        <FormInputField id="instructions" name="instructions" value={recette.instructions} label="Instructions" type="textarea" onChange={handleInputChange} />

        <div className="mb-5">
            <label htmlFor="productImage" className="block mb-2 text-sm font-medium text-gray-900">Chemin de l'image</label>
            <input
            type="file"
            id="productImage"
            name="productImage"
            accept="image/*"
            
            className="mt-1 block w-full text-sm text-gray-500 border-gray-300 rounded-md"
            onChange={handleImageChange}
            />
        </div>

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
