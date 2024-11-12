'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckIcon, ShieldCheckIcon } from '@heroicons/react/20/solid';
import { RadioGroup } from '@headlessui/react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import useAddCart from '@/hooks/cart/useAddCart';

type Product = {
  id: number;
  name: string;
  prix: number;
  description: string;
  image: { path: string };
  sizes?: { name: string; description: string }[];
  reviews?: { average: number; totalCount: number };
};

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const { addToCart } = useAddCart();

  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId');
    if (!storedSessionId) {
      const newSessionId = uuidv4();
      localStorage.setItem('sessionId', newSessionId);
      setSessionId(newSessionId);
    } else {
      setSessionId(storedSessionId);
    }
  }, []);

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
          console.error('Erreur lors de la récupération du produit:', data.error);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      productId: product.id,
      quantity,
      size: selectedSize?.name,
      price: product.prix,
    });
  };

  if (loading) return <div>Chargement...</div>;
  if (!product) return <div>Produit non trouvé</div>;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product details */}
        <div className="lg:max-w-lg lg:self-end">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
          <section aria-labelledby="information-heading" className="mt-4">
            <p className="text-lg text-gray-900 sm:text-xl">{product.prix}€</p>
            <p className="mt-4 text-base text-gray-500">{product.description}</p>
            <div className="mt-6 flex items-center">
              <CheckIcon aria-hidden="true" className="h-5 w-5 text-green-500" />
              <p className="ml-2 text-sm text-gray-500">En stock et prêt à être expédié</p>
            </div>
          </section>
        </div>

        {/* Product image */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg h-96">
            <img src={product.image.path} alt={product.name} className="h-full w-full object-cover object-center" />
          </div>
        </div>

        {/* Product form */}
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <form onSubmit={(e) => { e.preventDefault(); handleAddToCart(); }}>
            {product.sizes && (
              <fieldset className="mt-4">
                <legend className="block text-sm font-medium text-gray-700">Taille</legend>
                <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {product.sizes.map((size) => (
                    <RadioGroup.Option key={size.name} value={size} className="group relative block cursor-pointer rounded-lg border p-4">
                      <p className="text-base font-medium text-gray-900">{size.name}</p>
                      <p className="text-sm text-gray-500">{size.description}</p>
                    </RadioGroup.Option>
                  ))}
                </RadioGroup>
              </fieldset>
            )}

            <div className="mt-10">
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-md px-8 py-3 text-white bg-orange-300 hover:bg-orange-500 text-black focus:ring-2 focus:ring-indigo-500"
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
        </div>
      </div>
    </div>
  );
}
