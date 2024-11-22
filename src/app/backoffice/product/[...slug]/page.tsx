"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { CheckIcon } from '@heroicons/react/20/solid';

import ProductImage from "../components/ProductImage";
import ProductActions from "../components/ProductActions";
import { Produit, Image } from "../../../../../types";

export default function ProductDetails() {
  const params = useParams();
  const slug = params ? (Array.isArray(params.slug) ? params.slug[params.slug.length - 1] : params.slug) : null;
  const [product, setProduct] = useState<Produit | null>(null);
  const [image, setImage] = useState<Image | null>(null);
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    const fetchProduct = async () => {
      const productSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
      try {
        const res = await fetch(`/api/products/${productSlug}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data);
          if (data.imageId) {
            await fetchImage(data.imageId);
          }
        } else {
          console.error("Erreur lors de la récupération du produit :", data.error);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du produit :", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchImage = async (imageId: number) => {
      try {
        const res = await fetch(`/api/images/${imageId}`);
        const data = await res.json();
        if (res.ok) {
          setImage(data);
        } else {
          console.error("Erreur lors de la récupération de l'image :", data.error);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'image :", error);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleDelete = async () => {
    if (!product) return;
    try {
      const res = await fetch(`/api/products/${product.slug}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        console.log("Produit supprimé avec succès");
        window.location.assign('/backoffice/product');
      } else {
        const data = await res.json();
        console.error("Erreur lors de la suppression du produit :", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    }
  };

  if (loading) return <div className="lg:pl-72">Chargement...</div>;
  if (!product) return <div className="lg:pl-72">Produit non trouvé</div>;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        
        {/* Product details */}
        <div className="lg:max-w-lg">
          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            <div className="flex items-center">
              <p className="text-lg text-gray-900 sm:text-xl">{product.prix}€</p>
            </div>
            <div className="mt-4 space-y-6">
              <p className="text-base text-gray-500">{product.description}</p>
            </div>
            <div className="mt-6 flex items-center">
              <CheckIcon aria-hidden="true" className="h-5 w-5 text-green-500" />
              <p className="ml-2 text-sm text-gray-500">En stock et prêt à être expédié</p>
            </div>
          </section>
        </div>

        {/* Product image */}
        <ProductImage image={image} altText={product.name} />

        {/* Product actions */}
        <ProductActions productSlug={product.slug} onDelete={handleDelete} />
      </div>
    </div>
  );
}
