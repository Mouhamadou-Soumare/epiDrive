'use client';

import { useState, useEffect } from "react";
import SearchInput from "../components/SearchInput";
import { useGetIngredients, useDeleteIngredient } from "@/hooks/ingredients/useIngredients";
import { Ingredient } from "types";
import Link from "next/link";
import LoadingSpinner from "../components/LoadingSpinner";

const IngredientList = () => {
  const { ingredients, loading, error } = useGetIngredients();
  const { deleteIngredient } = useDeleteIngredient();

  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("desc"); // Ajout du tri par date
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (ingredients.length > 0) {
      setFilteredIngredients(ingredients);
    }
  }, [ingredients]);

  useEffect(() => {
    let filtered = ingredients.filter((ingredient: Ingredient) =>
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Trier par date `createdAt`
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredIngredients(filtered);
  }, [searchQuery, ingredients, sortOrder]);

  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
  const paginatedIngredients = filteredIngredients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteIngredient = async (id: number) => {
    try {
      await deleteIngredient(id);
      setFilteredIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression de l'ingrédient :", err);
    }
  };

  if (loading) {
    return <LoadingSpinner/>  ;
  }

  if (error) {
    return <div className="text-center text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Liste des ingrédients</h1>
          <p className="mt-2 text-sm text-gray-700">Listing des ingrédients disponibles</p>
        </div>
      </div>

      {/* Barre de recherche et tri */}
      <div className="flex flex-col mt-4 sm:flex-row gap-4 w-full">
        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          placeholder="Rechercher un ingrédient"
          aria_label="Rechercher un ingrédient"
        />

        {/* Tri par date */}
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          aria-label="Trier par date"
        >
          <option value="desc">Du plus récent au plus ancien</option>
          <option value="asc">Du plus ancien au plus récent</option>
        </select>
      </div>

      {paginatedIngredients.length > 0 ? (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 text-left text-sm font-semibold text-gray-900">Id</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nom</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Prix</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Catégorie</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Créé le</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedIngredients.map((ingredient) => (
                    <tr key={ingredient.id}>
                      <td className="py-4 pl-4 pr-3 text-sm sm:pl-0">{ingredient.id}</td>
                      <td className="px-3 py-4 text-sm">{ingredient.name}</td>
                      <td className="px-3 py-4 text-sm">{ingredient.description}</td>
                      <td className="px-3 py-4 text-sm">{ingredient.prix.toFixed(2)}</td>
                      <td className="px-3 py-4 text-sm">{ingredient.categorie}</td>
                      <td className="px-3 py-4 text-sm">{new Date(ingredient.createdAt).toLocaleDateString()}</td>
                      <td className="px-3 py-4 text-sm">
                        <Link href={`/backoffice/ingredient/${ingredient.id}`} className="flex text-green-600 hover:text-green-900">Ajouter</Link>
                        <button onClick={() => handleDeleteIngredient(ingredient.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center items-center space-x-4">
            <button className="px-4 py-2 border rounded-md disabled:opacity-50" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Précédent</button>
            <span>Page {currentPage} sur {totalPages}</span>
            <button className="px-4 py-2 border rounded-md disabled:opacity-50" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Suivant</button>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500">Aucun ingrédient trouvé</div>
      )}
    </div>
  );
};

export default IngredientList;
