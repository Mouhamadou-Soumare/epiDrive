'use client';

import { useState, useEffect, Key } from "react";
import Link from "next/link";
import { Produit, Categorie } from "../../types";
import { ProductCard } from "../components/ProductCard";

const ProductList = () => {
  const [products, setProducts] = useState<Produit[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Erreur lors du chargement des produits :', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories :', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(product => product.categorieId === Number(selectedCategory));
    }

    if (minPrice !== '') {
      filtered = filtered.filter(product => product.prix >= minPrice);
    }

    if (maxPrice !== '') {
      filtered = filtered.filter(product => product.prix <= maxPrice);
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(parseFloat(e.target.value) || '');
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(parseFloat(e.target.value) || '');
  };

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <h2 className="text-xl font-bold text-gray-900">Liste des produits</h2>
      <div className="flex justify-between items-center mt-4 gap-4">
        <Link
          href={`/backoffice/product/add`}
          className="w-44 flex items-center justify-center rounded-md border border-transparent bg-green-100 py-2 text-sm font-medium text-green-900 hover:bg-green-200"
        >
          Créer un produit
        </Link>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <select
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md"
            value={selectedCategory}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <optgroup key={category.id} label={category.name}>
                {category.subcategories.map((subcategory: { id: Key | null | undefined; name: string | null | undefined; }) => (
                  <option key={subcategory.id} value={String(subcategory.id)}>
                    {subcategory.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <input
            type="number"
            placeholder="Prix min"
            value={minPrice}
            onChange={handleMinPriceChange}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Prix max"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md"
          />
          <button
            onClick={filterProducts}
            className="w-32 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Valider
          </button>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;