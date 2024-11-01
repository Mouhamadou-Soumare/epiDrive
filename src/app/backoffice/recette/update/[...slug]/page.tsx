"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { Produit, Recette } from "../../../../types"

export default function UpdateRecettePage() {
    const { slug } = useParams(); 
    const [recette, setRecette] = useState<Recette | null>(null);
    const [produits, setProduits] = useState<Produit[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitResult, setSubmitResult] = useState<string>('');

    useEffect(() => {    
        async function fetchRecette() {
            const recetteSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
            const formattedSlug = recetteSlug ? recetteSlug.replace('/update', '') : '';
            console.log('Fetching recette for slug:', recetteSlug);

            try {
                const res = await fetch(`/api/recettes/${formattedSlug}`);
                const data = await res.json();
                if (res.ok) {
                    setRecette(data);
                } else {
                    console.error('Error fetching recette:', data.error);
                }
            } catch (error) {
                console.error('Error fetching recette:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchRecette();

        fetch("http://localhost:3000/api/products")
        .then((response) => response.json())
        .then((data) => {
            setProduits(data);
            console.log('Produits:', produits);
        });
    }, [slug]);

    if (loading) return <div className="lg:pl-72">Chargement...</div>;
    if (!recette) return <div className="lg:pl-72">Recette non trouvée</div>;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (recette) {
            setRecette({ ...recette, [name]: name === "imageId" || name === "userId" ? parseInt(value) : value });
        }
    };

    const handleAddProduit = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const produitId = parseInt(e.target.value);
        const produit = produits.find(p => p.id === produitId);
        if (produit && recette) {
            setRecette({ ...recette, produits: [...recette.produits, produit] });
        }
    };

    const handleRemoveProduit = (produitId: number) => {
        if (recette) {
            setRecette({ ...recette, produits: recette.produits.filter(p => p.id !== produitId) });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (recette) {
            try {
                console.log('Updating recette:', recette);
                const res = await fetch(`/api/recettes/${recette.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(recette),
                });

                const data = await res.json();
                if (res.ok) {
                    setSubmitResult('200');
                } else {
                    console.error('Error updating recette:', data.error);
                    setSubmitResult(res.status.toString());
                }
            } catch (error) {
                console.error('Error updating recette:', error);
                setSubmitResult('500');
            }
        }
    };

    return (
        <>
            {
                submitResult === '200' && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="font-bold">Success!</span>
                    <span className="block sm:inline"> Recette updated successfully</span>
                </div>
            }
            {
                submitResult === '404' || submitResult === '500' && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline">Recette not found</span>
                </div>
            }
            <h1 className='text-3xl font-extrabold leading-tight text-gray-900'>Update Recette</h1>
            <form onSubmit={handleSubmit} className="my-6">
                <div className="mb-5">
                    <label htmlFor="title" 
                        className="block mb-2 text-sm font-medium text-gray-900">Title</label>
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
                    <label htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={recette.description}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="instructions" 
                        className="block mb-2 text-sm font-medium text-gray-900">Instructions</label>
                    <textarea
                        id="instructions"
                        name="instructions"
                        value={recette.instructions}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="produit" 
                        className="block mb-2 text-sm font-medium text-gray-900">Ingrédient</label>
                    
                    <select
                        id="produit"
                        name="produit"
                        value={''}
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
                        {recette.produits.map((produit) => (
                            <li key={produit.id} className="py-1 flex items-center justify-between">
                                <div className="flex w-full items-center justify-between">
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
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <button type="submit" 
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Update Recette</button>
            </form>
        </>
    );
}
