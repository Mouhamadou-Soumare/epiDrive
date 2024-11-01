"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';

import Link from "next/link";

import { CheckIcon } from '@heroicons/react/20/solid';
import { Radio, RadioGroup } from '@headlessui/react';

import { Recette, Image } from "../../../types"

export default function RecetteDetails() {
  const { slug } = useParams(); 
  const [image, setImage] = useState<Image | null>(null);
  const [recette, setRecette] = useState<Recette | null>(null);
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    async function fetchRecette() {
      const recetteSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
      console.log('Fetching recette for slug:', recetteSlug);

      try {
        const res = await fetch(`/api/recettes/${recetteSlug}`);
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

      if (recette && recette.imageId) {
        try {
          const res = await fetch(`/api/images/${recette.imageId}`);
          const data = await res.json();
          if (res.ok) {
            setImage(data);
          } else {
            console.error('Error fetching image:', data.error);
          }
        } catch (error) {
          console.error('Error fetching image:', error);
        } finally {
          setLoading(false);
        }
      }
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
      } else {
        console.error('Error deleting recette:', data.error);
      }
    } catch (error) {
      console.error('Error deleting recette:', error);
    }
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        
        {/* Recette details */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{recette.title}</h1>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            <div className="flex items-center">
              <p className="text-lg text-gray-900 sm:text-xl">{recette.description}</p>
            </div>

            <div className="mt-4 space-y-2">
              <h3 id="instructions-heading" className="text-lg font-bold text-gray-900">Instructions</h3>
              <p className="text-base text-gray-500">{recette.instructions}</p>
            </div>

            {/* Recette produit */}
            <div className="mt-6 space-y-2">
              <h3 id="produits-heading" className="text-lg font-bold text-gray-900">Ingrédients</h3>
              <ul role="list" className="divide-y divide-gray-200">
                {recette.produits.map((produit) => (
                  <li key={produit.id} className="py-1 flex items-center justify-between">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex w-full items-center justify-between">
                        <p className="text-base text-gray-500">{produit.name}</p>
                        <p className="text-base text-gray-500">{produit.prix} €</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </section>
        </div>

        {/* Recette image */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center bg-dark-500">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg h-96">
            <img src={image?.path} alt={recette.title} className="h-full w-full object-cover object-center" />
          </div>
        </div>

        {/* Recette form */}
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            <h2 id="options-heading" className="sr-only">Options de recette</h2>

            <div className="flex gap-4 flex-col">
              <Link
                href={`/backoffice/recette/update/${recette.id}`}
                className="flex w-full items-center justify-center bold rounded-md px-8 py-3 text-white bg-orange-300 text-dark hover:bg-orange-500 text-black focus:ring-2 focus:ring-indigo-500"
              >
                Modifier la recette
              </Link>
              <div
                onClick={handleDelete}
                className="flex w-full items-center justify-center bold rounded-md px-8 py-3 text-white bg-red-300 text-dark hover:bg-red-500 text-black focus:ring-2 focus:ring-indigo-500"
              >
                Supprimer la recette  
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
