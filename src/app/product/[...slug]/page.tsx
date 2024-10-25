'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckIcon, QuestionMarkCircleIcon, StarIcon, ShieldCheckIcon } from '@heroicons/react/20/solid';
import { Radio, RadioGroup } from '@headlessui/react';

type Product = { 
  name: string; 
  price: number; 
  description: string; 
  imageSrc: string; 
  imageAlt: string; 
  breadcrumbs: { id: number; name: string; href: string }[]; 
  sizes?: { name: string; description: string }[]; 
  reviews?: { average: number; totalCount: number }; 
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductDetailPage() {
  const { slug } = useParams(); 
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]);

  useEffect(() => {
    async function fetchProduct() {
      const productSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

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
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
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
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-8 py-3 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
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
