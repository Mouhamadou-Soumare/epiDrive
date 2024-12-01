"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TextInput from "../components/TextInput";
import TextareaInput from "../components/TextareaInput";
import SelectInput from "../components/SelectInput";
import Alert from "../../components/Alert";
import { useGetCategories } from "@/hooks/categories/useCategories";
import { useAddProduit } from "@/hooks/products/useProduits";
import { Categorie } from "types";

export default function AddProductPage() {
    const router = useRouter();
    const { categories, loading: loadingCategories, error: errorCategories } = useGetCategories();
    const { addProduit, loading: addingProduit, error: addError } = useAddProduit();

    const [product, setProduct] = useState({
        name: "",
        prix: 0,
        imageId: 0,
        description: "",
        categorieId: 0,
    });

    const [imagePath, setImagePath] = useState<string>('');
    const [submitResult, setSubmitResult] = useState<string | null>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const parsedValue = type === "number" ? parseFloat(value) : value;
        if (name === "productImage") {
          setImagePath(value); 
        } else {
            setProduct({
                ...product,
                [name]: name === "categorieId" ? parseInt(value) : parsedValue,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!product.name || !product.description || !product.prix || !product.categorieId) {
            setSubmitResult("400");
            return;
        }

        const success = await addProduit(product, imagePath);
        if (success) {
            setSubmitResult("200");
            setTimeout(() => {
                const slug = product.name.toLowerCase().replace(/ /g, "-");
                router.push(`/backoffice/product/${slug}`);
            }, 2000);
        } else {
            setSubmitResult("500");
        }
    };

    if (loadingCategories) return <p>Chargement des catégories...</p>;

    return (
        <>
            {submitResult === "200" && <Alert message="Produit ajouté avec succès !" type="success" />}
            {submitResult === "400" && (
                <Alert message="Veuillez remplir tous les champs requis." type="warning" />
            )}
            {submitResult === "500" && (
                <Alert message="Une erreur est survenue lors de l'ajout du produit." type="error" />
            )}
            {addError && <Alert message="Erreur lors de l'ajout du produit." type="error" />}
            {errorCategories && <Alert message="Erreur lors du chargement des catégories." type="error" />}

            <h1 className="text-3xl font-extrabold leading-tight text-gray-900">Ajouter un produit</h1>
            <form onSubmit={handleSubmit} className="my-6">
                <TextInput
                    label="Nom"
                    id="name"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    required
                />
                <TextareaInput
                    label="Description"
                    id="description"
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    required
                />
                <TextInput
                    label="Prix"
                    id="prix"
                    name="prix"
                    type="number"
                    value={product.prix}
                    min={0}
                    max={1000}
                    step={0.01}
                    onChange={handleInputChange}
                    required
                />
                <TextInput
                    label="Product Path"
                    id="productImage"
                    name="productImage"
                    value={imagePath}
                    onChange={handleInputChange}
                    required
                />
                <SelectInput
                    label="Catégorie"
                    id="categorieId"
                    name="categorieId"
                    value={product.categorieId}
                    options={categories.map((cat: Categorie) => ({ value: cat.id, label: cat.name }))}
                    onChange={handleInputChange}
                    required
                />
                <button
                    type="submit"
                    disabled={addingProduit}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                    {addingProduit ? "Ajout en cours..." : "Ajouter le produit"}
                </button>
            </form>
        </>
    );
}
