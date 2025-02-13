"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import TextInput from "../components/TextInput";
import TextareaInput from "../components/TextareaInput";
import SelectInput from "../components/SelectInput";
import Alert from "../../components/Alert";
import { useGetCategories } from "@/hooks/categories/useCategories";
import { useAddProduit } from "@/hooks/products/useProduits";
import { Categorie } from "types";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AddProductPage() {
    const router = useRouter();
    const { categories, loading: loadingCategories, error: errorCategories } = useGetCategories();
    const { addProduit, loading: addingProduit, error: addError } = useAddProduit();

    const [product, setProduct] = useState({
        name: "",
        prix: "",
        imageId: "",
        description: "",
        categorieId: "",
    });

    const [submitResult, setSubmitResult] = useState<string | null>(null);
    const [loadingState, setLoadingState] = useState<boolean>(false);
    const [newImage, setNewImage] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewImage(e.target.files[0]);
        }
    };

    // Gestion du changement des champs
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = e.target;

            setProduct((prev) => ({
                ...prev,
                [name]: value,
            }));
        },
        []
    );

    // Validation des champs
    const validateForm = () => {
        if (product.name.length < 3) return "Le nom doit contenir au moins 3 caractères.";
        if (parseFloat(product.prix) <= 0) return "Le prix doit être un nombre positif.";
        if (product.description.length < 10) return "La description doit contenir au moins 10 caractères.";
        if (!product.categorieId) return "Veuillez sélectionner une catégorie.";
        return null;
    };

    // Soumission du formulaire avec affichage du chargement avant la redirection
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setSubmitResult(null);

            const errorMsg = validateForm();
            if (errorMsg) {
                setSubmitResult(errorMsg);
                return;
            }

            const productWithSlug = {
                ...product,
                slug: product.name.toLowerCase().replace(/ /g, "-"),
                prix: parseFloat(product.prix),
                imageId: parseInt(product.imageId, 10),
                categorieId: parseInt(product.categorieId, 10),
                stock: 0, 
            };

            setLoadingState(true);
            const success = await addProduit(productWithSlug, newImage);

            if (success) {
                setSubmitResult("Produit ajouté avec succès !");
                setTimeout(() => {
                    router.push(`/backoffice/product/${productWithSlug.slug}`);
                }, 3000);
            } else {
                setSubmitResult("Une erreur est survenue lors de l'ajout du produit.");
                setLoadingState(false); 
            }
        },
        [product, newImage, addProduit, router]
    );

    if (loadingCategories) return <LoadingSpinner/> ;

    return (
        <>
            {loadingState ? (
                <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                    <div className="text-center">
                        <p className="text-lg font-semibold text-gray-700">🔄 Ajout du produit en cours...</p>
                    </div>
                </div>
            ) : (
                <>
                    {submitResult && <Alert message={submitResult} type={submitResult.includes("succès") ? "success" : "error"} />}
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
                            label="Prix (€)"
                            id="prix"
                            name="prix"
                            type="number"
                            value={product.prix}
                            min={0.01}
                            max={1000}
                            step={0.01}
                            onChange={handleInputChange}
                            required
                        />

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
                            disabled={addingProduit || loadingState} // Désactive le bouton pendant le chargement
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                        >
                            {addingProduit || loadingState ? "Ajout en cours..." : "Ajouter le produit"}
                        </button>
                    </form>
                </>
            )}
        </>
    );
}
