"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';

import Link from "next/link";


import { CheckIcon } from '@heroicons/react/20/solid';
import { Radio, RadioGroup } from '@headlessui/react';

import { Produit, Image } from "../../../types"


export default function ProductDetails() {
  const { slug } = useParams(); 
  const [image, setImage] = useState<Image | null>(null);
  const [product, setProduct] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    async function fetchProduct() {
      const productSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
      console.log('Fetching product for slug:', productSlug);

      try {
        const res = await fetch(`/api/products/${productSlug}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data);
        } else {
          console.error('Error fetching product:', data.error);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }


      if (product) {
        try {
          const res = await fetch(`/api/images/${product.imageId}`);
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

    fetchProduct();
  }, [slug]);

  if (loading) return <div className="lg:pl-72">Chargement...</div>;
  if (!product) return <div className="lg:pl-72">Produit non trouvé</div>;

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/products/${product.slug}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        console.log('Product deleted:', data);
        window.location.assign('/backoffice/product');
      } else {
        console.error('Error deleting product:', data.error);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  return (
    <div className="bg-white">
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
      
      {/* Product details */}
      <div className="lg:max-w-lg lg:self-end">
  

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
      <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center bg-dark-500">
        <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg h-96	">
          <img src={image?.path} alt={product.name} className="h-full w-full object-cover object-center" />
        </div>
      </div>

      {/* Product form */}
      <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
        <section aria-labelledby="options-heading">
          <h2 id="options-heading" className="sr-only">Options de produit</h2>

          <div className="flex gap-4 flex-col">
              <Link
              href={`/backoffice/product/update/${product.slug}`}
              className="flex w-full items-center justify-center bold rounded-md px-8 py-3 text-white bg-orange-300 text-dark hover:bg-orange-500 text-black focus:ring-2 focus:ring-indigo-500"
            >
              Modifier le produit
            </Link>
            <div
              onClick={handleDelete}
              className="flex w-full items-center justify-center bold rounded-md px-8 py-3 text-white bg-red-300 text-dark hover:bg-red-500 text-black focus:ring-2 focus:ring-indigo-500"
            >
              Supprimer le produit  
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
  );
}

