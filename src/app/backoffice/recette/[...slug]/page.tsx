"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import Link from "next/link";
import ImageDisplay from "../components/ImageDisplay";
import ProduitCard from "../components/ProduitCard";
import { Recette, Image } from "../../../types";

export default function RecetteDetails() {
  const { slug } = useParams() as { slug: string | string[] }; 
  const [image, setImage] = useState<Image | null>(null);
  const [recette, setRecette] = useState<Recette | null>(null);
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    async function fetchRecette() {
      const recetteSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
      
      try {
        const res = await fetch(`/api/recettes/${recetteSlug}`);
        const data = await res.json();
        if (res.ok) setRecette(data);
        else console.error('Error fetching recette:', data.error);
        
        if (data.imageId) {
          const imageRes = await fetch(`/api/images/${data.imageId}`);
          const imageData = await imageRes.json();
          if (imageRes.ok) setImage(imageData);
          else console.error('Error fetching image:', imageData.error);
        }
      } catch (error) { console.error('Error fetching recette:', error); } 
      finally { setLoading(false); }
    }
    fetchRecette();
  }, [slug]);

  if (loading) return <div className="lg:pl-72">Chargement...</div>;
  if (!recette) return <div className="lg:pl-72">Recette non trouvée</div>;

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/recettes/${recette.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        console.log('Recette deleted:', data);
        window.location.assign('/backoffice/recette');
      } else { console.error('Error deleting recette:', data.error); }
    } catch (error) { console.error('Error deleting recette:', error); }
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 p-6 sm:p-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        
        <div className="lg:max-w-lg lg:self-end">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{recette.title}</h1>

          <section aria-labelledby="information-heading" className="mt-4">
            <p className="text-lg text-gray-900 sm:text-xl">{recette.description}</p>
            <h3 className="mt-4 text-lg font-bold text-gray-900">Instructions</h3>
            <p className="text-base text-gray-500">{recette.instructions}</p>

            <h3 className="mt-6 text-lg font-bold text-gray-900">Ingrédients</h3>
            <ul role="list" className="divide-y divide-gray-200">
              {recette.produits.map((produit) => (
                <ProduitCard key={produit.id} produit={produit} />
              ))}
            </ul>
          </section>
        </div>

        {image && <ImageDisplay src={image.path} alt={recette.title} />}

        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            <h2 id="options-heading" className="sr-only">Options de recette</h2>
            <div className="flex gap-4 flex-col">
              <Link href={`/backoffice/recette/update/${recette.id}`} className="flex w-full items-center justify-center bold rounded-md px-8 py-3 text-white bg-orange-300 hover:bg-orange-500 text-black focus:ring-2 focus:ring-indigo-500">
                Modifier la recette
              </Link>
              <button onClick={handleDelete} className="flex w-full items-center justify-center bold rounded-md px-8 py-3 text-white bg-red-300 hover:bg-red-500 text-black focus:ring-2 focus:ring-indigo-500">
                Supprimer la recette
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
