'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckIcon, ShieldCheckIcon } from '@heroicons/react/20/solid';

import { Produit, Image } from "../../types"

export default function ProductDetailPage() {
  const { slug } = useParams(); 
  const [product, setProduct] = useState<Produit | null>(null);
  const [image, setImage] = useState<Image | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const productSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

      try {
        const res = await fetch(`/api/products/${productSlug}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data);
          console.log("Product found:", data);
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

  if (loading) return <div>Chargement...</div>;
  if (!product) return <div>Produit non trouvé</div>;

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
            <img src={image?.path} alt={image?.path} className="h-full w-full object-cover object-center" />
          </div>
        </div>

        {/* Product form */}
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            <h2 id="options-heading" className="sr-only">Options de produit</h2>

            <form>
              <div className="mt-10">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md px-8 py-3 text-white bg-orange-300 text-dark hover:bg-orange-500 text-black focus:ring-2 focus:ring-indigo-500"
                >
                  Ajouter au panier
                </button>
              </div>

              <div className="mt-6 text-center">
                <a href="#" className="inline-flex items-center text-base font-medium text-gray-500 hover:text-gray-700">
                  <ShieldCheckIcon aria-hidden="true" className="mr-2 h-6 w-6" />
                  Garantie à vie
                </a>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
