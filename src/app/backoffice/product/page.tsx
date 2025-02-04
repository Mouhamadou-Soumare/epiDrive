'use client';

import { useState } from "react";
import Link from "next/link";
import SearchInput from "../components/SearchInput";
import ProductRow from "./components/ProductRow";
import Alert from "../components/Alert";
import { useGetProduits } from "@/hooks/products/useProduits";
import { Produit } from "types";

const ProductList = () => {
  const { produits, loading, error } = useGetProduits();
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtrage des produits en fonction de la recherche
  const filteredProducts = produits?.filter((product: Produit) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">Chargement des produits...</div>;
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
            className="block rounded-md button-secondary px-3 py-2 text-center text-sm font-semibold  shadow-sm text-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Créer un produit
          </Link>
        </div>
      </div>

      <div className="flex flex-col mt-4 sm:flex-row gap-4 w-full">
        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          placeholder="Rechercher un produit"
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Id
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Nom
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Slug
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Prix
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Info
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product: Produit) => (
                    <ProductRow key={product.id} product={product} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500">Aucun produit trouvé</div>
      )}
    </div>
  );
};

export default ProductList;
