'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Produit, Categorie } from "../../types";

export const ProductCard = ({ product }: { product: Produit }) => {
  const [categorie, setCategorie] = useState<Categorie | null>(null);

  useEffect(() => {
    const fetchCategorie = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/categories/${product.categorieId}`);
        if (!response.ok) {
          throw new Error('Erreur de chargement de la catégorie');
        }
        const data = await response.json();
        setCategorie(data);
      } catch (error) {
        console.error('Erreur lors du chargement de la catégorie :', error);
      }
    };

    if (product.categorieId) {
      fetchCategorie();
    }
  }, [product.categorieId]);

  return (
    <>
      {categorie && (
        <article className="flex max-w-xl flex-col items-start justify-between">
          <div className="flex items-center gap-x-4 text-xs">
            <Link
              href={`/backoffice/categorie/${categorie.slug}`}
              className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
            >
              {categorie.name}
            </Link>
          </div>
          <div className="group relative">
            <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-gray-600">
              <Link href={`/backoffice/product/${product.slug}`}>
                {product.name}
              </Link>
            </h3>
            <p className="mt-5 line-clamp-3 text-sm text-gray-600">{product.description}</p>
          </div>
          <div className="relative mt-8 flex items-center gap-x-4">
            <div className="text-sm">
              <p className="font-semibold text-gray-900">{product.prix} €</p>
              <Link
                href={`/backoffice/product/${product.slug}`}
                className="relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
              >
                Voir le produit<span className="sr-only">, {product.name}</span>
              </Link>
            </div>
          </div>
        </article>
      )}
    </>
  );
};
