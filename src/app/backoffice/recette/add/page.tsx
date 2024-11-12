"use client";

import { useState, useEffect } from 'react';
import { Produit, Recette } from "../../../types";
import FormInputField from "../components/FormInputField";
import ProduitList from "../components/ProduitList";
import Alert from "../components/Alert";

export default function AddRecettePage() {
  const [recette, setRecette] = useState<Recette>({
    id: 0,
    title: '',
    description: '',
    instructions: '',
    produits: [],
    imageId: 0,
    userId: 0,
  });
  const [produits, setProduits] = useState<Produit[]>([]);
  const [submitResult, setSubmitResult] = useState<string>('');

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products");
        const data = await res.json();
        setProduits(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    };

    fetchProduits();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecette({ ...recette, [name]: name === "imageId" || name === "userId" ? parseInt(value) : value });
  };

  const handleAddProduit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const produitId = parseInt(e.target.value);
    const produit = produits.find(p => p.id === produitId);
    if (produit && !recette.produits.some(p => p.id === produitId)) {
      setRecette({ ...recette, produits: [...recette.produits, produit] });
    }
    e.target.value = ''; 
  };

  const handleRemoveProduit = (produitId: number) => {
    setRecette({ ...recette, produits: recette.produits.filter(p => p.id !== produitId) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/recettes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recette),
      });

      if (res.ok) {
        setSubmitResult('200');
      } else {
        console.error('Erreur lors de l\'ajout de la recette');
        setSubmitResult('error');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la recette:', error);
      setSubmitResult('error');
    }
  };

  return (
    <>
      {submitResult && (
        <Alert
          message={submitResult === '200' ? 'Recette ajoutée avec succès!' : 'Une erreur est survenue.'}
          type={submitResult === '200' ? 'success' : 'error'}
        />
      )}
      <h1 className='text-3xl font-extrabold leading-tight text-gray-900'>Ajouter une recette</h1>
      <form onSubmit={handleSubmit} className="my-6">
        <FormInputField id="title" name="title" value={recette.title} label="Titre" onChange={handleInputChange} />
        <FormInputField id="description" name="description" value={recette.description} label="Description" type="textarea" onChange={handleInputChange} />
        <FormInputField id="instructions" name="instructions" value={recette.instructions} label="Instructions" type="textarea" onChange={handleInputChange} />
        
        <div className="mb-5">
          <label htmlFor="produit" className="block mb-2 text-sm font-medium text-gray-900">Ingrédients</label>
          <select
            id="produit"
            name="produit"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            onChange={handleAddProduit}
          >
            <option value="">Ajouter un produit</option>
            {produits.map((produit) => (
              <option key={produit.id} value={produit.id}>{produit.name}</option>
            ))}
          </select>
          <ProduitList produits={recette.produits} onRemoveProduit={handleRemoveProduit} />
        </div>
        
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
          Ajouter la recette
        </button>
      </form>
    </>
  );
}
