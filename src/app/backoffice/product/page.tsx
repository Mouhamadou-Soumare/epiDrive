'use client';

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import SearchInput from "../components/SearchInput";
import ProductRow from "./components/ProductRow";
import Alert from "../components/Alert";
import { useGetProduits } from "@/hooks/products/useProduits";
import { Produit } from "types";

const ProductList = () => {
  const { produits, loading, error } = useGetProduits();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Filtrage des produits
  const filteredProducts = useMemo(() => {
    return produits
      ?.filter((product: Produit) => {
        const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchMinPrice = minPrice ? product.prix >= parseFloat(minPrice) : true;
        const matchMaxPrice = maxPrice ? product.prix <= parseFloat(maxPrice) : true;
        return matchSearch && matchMinPrice && matchMaxPrice;
      })
      .sort((a, b) => (sortOrder === "asc" ? a.prix - b.prix : b.prix - a.prix)) || [];
  }, [searchQuery, minPrice, maxPrice, sortOrder, produits]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Pagination des produits
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [currentPage, filteredProducts]);

  // Gestion des événements
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value);
    setCurrentPage(1);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handlePrevPage = useCallback(() => setCurrentPage((prev) => Math.max(prev - 1, 1)), []);
  const handleNextPage = useCallback(() => setCurrentPage((prev) => Math.min(prev + 1, totalPages)), [totalPages]);

  if (loading) {
    return <div className="text-center text-lg font-medium">🔄 Chargement des produits...</div>;
  }

  if (error) {
    return <Alert message="Erreur lors du chargement des produits" type="error" />;
  }

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Liste des produits</h1>
          <p className="mt-2 text-sm text-gray-700">Listing des produits du commerce</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/backoffice/product/add"
            className="block rounded-md button-secondary px-3 py-2 text-center text-sm font-semibold shadow-sm text-dark focus:ring-2 focus:ring-indigo-500"
          >
            Créer un produit
          </Link>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col mt-4 sm:flex-row gap-4 w-full">
        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          placeholder="Rechercher un produit"
          aria_label="Rechercher un produit"
        />

        {/* Filtre Prix Min */}
        <input
          type="number"
          value={minPrice}
          onChange={handleMinPriceChange}
          placeholder="Prix min"
          className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          aria-label="Filtrer par prix minimum"
        />

        {/* Filtre Prix Max */}
        <input
          type="number"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          placeholder="Prix max"
          className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          aria-label="Filtrer par prix maximum"
        />

        {/* Tri par Prix */}
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          aria-label="Trier par prix"
        >
          <option value="asc">Prix croissant</option>
          <option value="desc">Prix décroissant</option>
        </select>
      </div>

      {/* Table des produits */}
      {paginatedProducts.length > 0 ? (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Id</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nom</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Slug</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Prix</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Info</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedProducts.map((product: Produit) => (
                    <ProductRow key={product.id} product={product} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center items-center space-x-4">
            <button
              className="px-4 py-2 border rounded-md disabled:opacity-50 focus:ring-2 focus:ring-indigo-500"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              aria-label="Page précédente"
            >
              Précédent
            </button>
            <span>Page {currentPage} sur {totalPages}</span>
            <button
              className="px-4 py-2 border rounded-md disabled:opacity-50 focus:ring-2 focus:ring-indigo-500"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              aria-label="Page suivante"
            >
              Suivant
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500">Aucun produit trouvé</div>
      )}
    </div>
  );
};

export default ProductList;
