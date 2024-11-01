"use client";

import { useState, useEffect } from 'react';
import { Produit, Recette } from "../../../types";

export default function AddRecettePage() {
    const [recette, setRecette] = useState<Recette>({
        id: 0, // Pas nécessaire pour l'ajout, mais peut être laissé ici pour la structure
        title: '',
        description: '',
        instructions: '',
        produits: [],
        imageId: 0, // Si vous avez des images à gérer, adaptez cela
        userId: 0 // Si vous devez associer un utilisateur, sinon, supprimez cette ligne
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
                console.error('Error fetching produits:', error);
            }
        };

        fetchProduits();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRecette({ ...recette, [name]: name === "imageId" || name === "userId" ? parseInt(value) : value });
    };

    const handleAddProduit = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const produitId = parseInt(e.target.value);
        const produit = produits.find(p => p.id === produitId);
        if (produit) {
            // Empêcher l'ajout de doublons
            if (!recette.produits.some(p => p.id === produitId)) {
                setRecette({ ...recette, produits: [...recette.produits, produit] });
            }
        }
        e.target.value = ''; // Réinitialiser la sélection après l'ajout
    };

    const handleRemoveProduit = (produitId: number) => {
        setRecette({ ...recette, produits: recette.produits.filter(p => p.id !== produitId) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('Adding recette:', recette);
            const res = await fetch(`/api/recettes`, {
                method: "POST", // Utiliser la méthode POST pour l'ajout
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(recette),
            });

            const data = await res.json();
            if (res.ok) {
                setSubmitResult('200');
            } else {
                console.error('Error adding recette:', data.error);
                setSubmitResult(res.status.toString());
            }
        } catch (error) {
            console.error('Error adding recette:', error);
            setSubmitResult('500');
        }
    };

    return (
        <>
            {submitResult === '200' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="font-bold">Success!</span>
                    <span className="block sm:inline"> Recette added successfully</span>
                </div>
            )}
            {(submitResult === '404' || submitResult === '500') && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline">An error occurred while adding the recette</span>
                </div>
            )}
            <h1 className='text-3xl font-extrabold leading-tight text-gray-900'>Ajouter une recette</h1>
            <form onSubmit={handleSubmit} className="my-6">
                <div className="mb-5">
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={recette.title}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={recette.description}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="instructions" className="block mb-2 text-sm font-medium text-gray-900">Instructions</label>
                    <textarea
                        id="instructions"
                        name="instructions"
                        value={recette.instructions}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="produit" className="block mb-2 text-sm font-medium text-gray-900">Ingrédient</label>
                    <select
                        id="produit"
                        name="produit"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleAddProduit}
                    >
                        <option value="">Ajouter un produit</option>
                        {produits.map((produit) => (
                            <option key={produit.id} value={produit.id}>
                                {produit.name}
                            </option>
                        ))}
                    </select>
                    <ul role="list" className="divide-y divide-gray-200 my-4">
                        {recette.produits.length > 0 ? (
                            recette.produits.map((produit) => (
                                <li key={produit.id} className="py-1 flex items-center justify-between">
                                    <div className="flex w-full items-center justify-between">
                                        <p className="text-base text-gray-500">{produit.name}</p>
                                        <p className="text-base text-gray-500">{produit.prix} €</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700 ml-4"
                                        onClick={() => handleRemoveProduit(produit.id)}
                                    >
                                        Supprimer
                                    </button>
                                </li>
                            ))
                        ) : (
                            <div>Aucun produit ajouté</div>
                        )}
                    </ul>
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                    Ajouter la recette
                </button>
            </form>
        </>
    );
}
