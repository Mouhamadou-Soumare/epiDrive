'use client';

import Link from "next/link";
import { useState } from "react";
import { Categorie } from "../../../../types";
import SearchInput from "../components/SearchInput";
import CategorieRow from "./components/CategorieRow";
import { useGetCategories } from "@/hooks/categories/useCategories";

const CategoryList = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { categories, loading, error } = useGetCategories();

  const filteredCategories = categories?.filter((categorie: Categorie) =>
    categorie.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Liste des catégories</h1>
          <p className="mt-2 text-sm text-gray-700">
            Listing des catégories du commerce.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/backoffice/categorie/add"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Créer une catégorie
          </Link>
        </div>
      </div>

      <div className="flex flex-col mt-4 sm:flex-row gap-4 w-full">
        <SearchInput 
          searchQuery={searchQuery} 
          onSearchChange={handleSearchChange} 
          placeholder="Rechercher une catégorie"
        />
      </div>

      {loading ? (
        <div className="mt-8">Chargement des catégories...</div>
      ) : error ? (
        <div className="mt-8 text-red-500">Erreur lors de la récupération des catégories.</div>
      ) : filteredCategories.length > 0 ? (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">ID</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nom</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Slug</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Info</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCategories.map((categorie: Categorie) => (
                    <CategorieRow key={categorie.id} categorie={categorie} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8">Aucune catégorie trouvée</div>
      )}
    </div>
  );
};

export default CategoryList;
