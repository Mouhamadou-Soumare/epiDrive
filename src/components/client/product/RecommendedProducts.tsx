import { useEffect, useState } from 'react';
import Link from 'next/link';
import React from 'react';

import { Produit } from "../../../../types";

const RecommendedProducts = ({ allProducts }: { allProducts: Produit[] }) => {
  const [recommendedProducts, setRecommendedProducts] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (allProducts.length > 0) {
      const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
      setRecommendedProducts(shuffled.slice(0, 4)); 
      setLoading(false);
    }
  }, [allProducts]);

  return (
      <div className="mx-auto max-w-2xl pt-0 px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">Epidrive vous recommande</h2>

        <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {loading
          ? Array(4)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="loader-recommended-products mt-4"></div>
              ))
          : recommendedProducts.map((product) => (
              <div key={product.id}>
                <div className="relative">
                  <div className="relative h-72 w-full overflow-hidden rounded-lg mt-4">
                    <img
                      alt={product.name}
                      src={product.image?.path}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="relative mt-4">
                    <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                  </div>
                  <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-orange-epidrive opacity-25"
                    />
                    <p className="relative text-lg font-semibold text-white">{product.prix}€</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                  >
                    Voir le produit<span className="sr-only">, {product.name}</span>
                  </Link>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
