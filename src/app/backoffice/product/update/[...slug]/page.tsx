"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import TextInput from "../../components/TextInput";
import TextareaInput from "../../components/TextareaInput";
import SelectInput from "../../components/SelectInput";
import { Produit, Categorie } from "../../../../types";

export default function UpdateProductPage() {
    const { slug } = useParams() as { slug: string | string[] };
    const [product, setProduct] = useState<Produit | null>(null);
    const [categories, setCategories] = useState<Categorie[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitResult, setSubmitResult] = useState<string>("");

    useEffect(() => {
        async function fetchProduct() {
            const productSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
            const formattedSlug = productSlug ? productSlug.replace("/update", "") : "";

            try {
                const res = await fetch(`/api/products/${formattedSlug}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                } else {
                    console.error("Erreur lors de la récupération du produit :", await res.json());
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du produit :", error);
            } finally {
                setLoading(false);
            }
        }

        async function fetchCategories() {
            try {
                const res = await fetch("http://localhost:3000/api/categories");
                const data = await res.json();
                setCategories(data.flatMap((cat: Categorie) => cat.subcategories));
            } catch (error) {
                console.error("Erreur lors de la récupération des catégories :", error);
            }
        }

        fetchProduct();
        fetchCategories();
    }, [slug]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (product) {
            setProduct({
                ...product,
                [name]: name === "prix" ? parseFloat(value) : ["imageId", "categorieId"].includes(name) ? parseInt(value) : value,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (product) {
            try {
                const res = await fetch(`/api/products/${product.slug}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(product),
                });

                if (res.ok) setSubmitResult("200");
                else {
                    console.error("Erreur lors de la mise à jour du produit :", await res.json());
                    setSubmitResult(res.status.toString());
                }
            } catch (error) {
                console.error("Erreur lors de la mise à jour du produit :", error);
                setSubmitResult("500");
            }
        }
    };

    if (loading) return <div className="lg:pl-72">Chargement...</div>;
    if (!product) return <div className="lg:pl-72">Produit non trouvé</div>;

    return (
        <>
            {submitResult === "200" && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="font-bold">Succès!</span> Le produit a été mis à jour avec succès.
                </div>
            )}
            {(submitResult === "404" || submitResult === "500") && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Erreur!</strong> Une erreur s'est produite lors de la mise à jour du produit.
                </div>
            )}
            <h1 className="text-3xl font-extrabold leading-tight text-gray-900">Mettre à jour le produit</h1>
            <form onSubmit={handleSubmit} className="my-6">
                <TextInput label="Nom" id="name" name="name" value={product.name} onChange={handleInputChange} required />
                <TextareaInput label="Description" id="description" name="description" value={product.description} onChange={handleInputChange} required />
                <TextInput label="Prix" id="prix" name="prix" type="number" value={product.prix} onChange={handleInputChange} min={0} max={1000} step={0.01} required />
                <SelectInput label="Catégorie" id="categorieId" name="categorieId" value={product.categorieId} options={categories.map((cat) => ({ value: cat.id, label: cat.name }))} onChange={handleInputChange} required />
                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                    Mettre à jour le produit
                </button>
            </form>
        </>
    );
}
