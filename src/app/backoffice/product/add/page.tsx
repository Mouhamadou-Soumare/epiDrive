"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TextInput from "../components/TextInput";
import TextareaInput from "../components/TextareaInput";
import SelectInput from "../components/SelectInput";
import { Produit, Categorie } from "../../../types";

export default function AddProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Categorie[]>([]);
    const [product, setProduct] = useState<Produit>({
        id: 0,
        name: '',
        prix: 0,
        imageId: 0,
        slug: '',
        description: '',
        categorieId: 0,
    });
    const [submitResult, setSubmitResult] = useState<string>('');
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/categories");
                const data = await response.json();
                setCategories(data.flatMap((category: Categorie) => category.subcategories));
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === "number" ? parseFloat(value) : value; 
        setProduct({
            ...product,
            [name]: parsedValue,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product.name || !product.description || !product.prix || !product.categorieId) {
            setSubmitResult("400");
            return;
        }

        try {
            const res = await fetch(`/api/products/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product),
            });
            if (res.ok) {
                setSubmitResult("200");
                setTimeout(() => {
                    const slug = product.name.toLowerCase().replace(/ /g, '-');
                    router.push(`/backoffice/product/${slug}`);
                }, 2000);
            } else {
                const data = await res.json();
                console.error("Error adding product:", data.error);
                setSubmitResult(res.status.toString());
            }
        } catch (error) {
            console.error("Error adding product:", error);
            setSubmitResult("500");
        }
    };

    return (
        <>
            {submitResult === "200" && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="font-bold">Succès!</span>
                    <span className="block sm:inline"> Le produit a été ajouté avec succès.</span>
                </div>
            )}
            {submitResult === "500" && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Erreur!</strong>
                    <span className="block sm:inline"> Une erreur s'est produite lors de l'ajout du produit.</span>
                </div>
            )}
            {submitResult === "400" && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Attention!</strong>
                    <span className="block sm:inline"> Veuillez remplir tous les champs requis.</span>
                </div>
            )}

            <h1 className="text-3xl font-extrabold leading-tight text-gray-900">Ajouter un produit</h1>
            <form onSubmit={handleSubmit} className="my-6">
                <TextInput label="Nom" id="name" name="name" value={product.name} onChange={handleInputChange} required />
                <TextareaInput label="Description" id="description" name="description" value={product.description} onChange={handleInputChange} required />
                <TextInput label="Prix" id="prix" name="prix" type="number" value={product.prix} min={0} max={1000} step={0.01} onChange={handleInputChange} required />
                {loadingCategories ? (
                    <p>Chargement des catégories...</p>
                ) : (
                    <SelectInput label="Catégorie" id="categorieId" name="categorieId" value={product.categorieId} options={categories.map((cat) => ({ value: cat.id, label: cat.name }))} onChange={handleInputChange} required />
                )}
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                    Ajouter le produit
                </button>
            </form>
        </>
    );
}
