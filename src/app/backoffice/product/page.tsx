'use client';

import Link from "next/link";

import { useState, useEffect } from "react";

import { Produit } from "../../types";

const ProductList = () => {
    const [searchValue, setSearchValue] = useState('')
    const [products, setProduct] = useState<Produit[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Produit[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/products")
            .then((response) => response.json())
            .then((data) => {
                setProduct(data)
                setFilteredProducts(data)
            });
    }, []);

    const handleSearch = (e: any) => { 
        const searchTerm = e.target.value;
        setSearchValue(searchTerm)
    
        const filteredItems = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        setFilteredProducts(filteredItems);
    }

    return (
      <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
        <h2 className="text-xl font-bold text-gray-900">Liste des produits</h2>
        <div className="flex justify-between items-center mt-4 gap-4">
          <Link
            href="/backoffice/product/add"
            className="w-44 flex items-center justify-center rounded-md border border-transparent bg-green-100 py-2 text-sm font-medium text-green-900 hover:bg-green-200"
          >
            Créer un produit
          </Link>
          <input
            type="text"
            placeholder="Rechercher un produit"
            value={searchValue}
            onChange={handleSearch}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          /> 
        </div>
        <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {filteredProducts.map((product) => (
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
                  <p className="relative text-lg font-semibold text-white">{product.prix}€</p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href={`/backoffice/product/${product.slug}`}
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

export default ProductList;