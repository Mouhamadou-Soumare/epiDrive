"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';

import Link from "next/link";


import { CheckIcon, QuestionMarkCircleIcon, StarIcon, ShieldCheckIcon } from '@heroicons/react/20/solid';
import { Radio, RadioGroup } from '@headlessui/react';

type Product = { 
  name: string; 
  price: number; 
  description: string; 
  imageSrc: string; 
  slug: string;  
  imageAlt: string; 
  breadcrumbs: { id: number; name: string; href: string }[]; 
  sizes?: { name: string; description: string }[]; 
  reviews?: { average: number; totalCount: number }; 
};
  

export default function ProductDetails() {
  const { slug } = useParams(); 
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]);
  

  useEffect(() => {
    async function fetchProduct() {
      const productSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
      console.log('Fetching product for slug:', productSlug);

      try {
        const res = await fetch(`/api/products/${productSlug}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data);
          setSelectedSize(data.sizes?.[0]);
        } else {
          console.error('Error fetching product:', data.error);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) return <div className="lg:pl-72">Chargement...</div>;
  if (!product) return <div className="lg:pl-72">Produit non trouvé</div>;


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
              <p className="text-lg text-gray-900 sm:text-xl">{product.price}€</p>

              {product.reviews && (
                <div className="ml-4 border-l border-gray-300 pl-4">
                  <div className="flex items-center">
                  
                  </div>
                </div>
              )}
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
            <img src={product.imageSrc} alt={product.imageAlt} className="h-full w-full object-cover object-center" />
          </div>
        </div>

        {/* Product form */}
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            <h2 id="options-heading" className="sr-only">Options de produit</h2>

            <form>
              {product.sizes && (
                <fieldset className="mt-4">
                  <legend className="block text-sm font-medium text-gray-700">Taille</legend>
                  <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {product.sizes.map((size) => (
                      <Radio key={size.name} value={size} className="group relative block cursor-pointer rounded-lg border p-4">
                        <p className="text-base font-medium text-gray-900">{size.name}</p>
                        <p className="text-sm text-gray-500">{size.description}</p>
                      </Radio>
                    ))}
                  </RadioGroup>
                </fieldset>
              )}

              <div className="mt-10">
                <Link
                  href={`/backoffice/product/update/${product.slug}`}
                  className="flex w-full items-center justify-center bold rounded-md px-8 py-3 text-white bg-orange-300 text-dark hover:bg-orange-500 text-black focus:ring-2 focus:ring-indigo-500"
                >
                  Modifier le produit
                </Link>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
    );
}

