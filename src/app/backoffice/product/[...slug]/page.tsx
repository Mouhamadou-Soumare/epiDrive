"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';

import Link from "next/link";

type Product = { 
  id: number; 
  name: string; 
  price: number; 
  imageSrc: string; 
  imageAlt: string; 
  slug: string;  
  description: string; 
};
  

export default function ProductDetails() {
  const { slug } = useParams(); 
  const [product, setProduct] = useState<Product | null>(null);
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
    }

    fetchProduct();
  }, [slug]);

  if (loading) return <div className="lg:pl-72">Chargement...</div>;
  if (!product) return <div className="lg:pl-72">Produit non trouvé</div>;


    return (
        <div className="lg:pl-72">
          <div key={product.name}>
            <div className="relative">
              <div className="relative h-72 w-full overflow-hidden rounded-lg">
                <img
                  alt={product.name}
                  src={'https://via.placeholder.com/300x300'} 
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="relative mt-4">
                <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{product.description}</p>
              </div>
              <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                />
                <p className="relative text-lg font-semibold text-white">{product.price}€</p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href={`/backoffice/product/update/${product.slug}`}
                className="relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
              >
                Modifier le produit
              </Link>
            </div>
          </div>
        </div>
    );
}

