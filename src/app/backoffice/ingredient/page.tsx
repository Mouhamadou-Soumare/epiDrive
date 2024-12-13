'use client';

import { useState, useEffect } from "react";
import SearchInput from "../components/SearchInput";
import { useGetIngredients, useDeleteIngredient } from "@/hooks/ingredients/useIngredients"; // Import des hooks
import { Ingredient } from "types"; // Assurez-vous que le type est défini dans vos types
import Link from "next/link";

const IngredientList = () => {
  const { ingredients, loading, error } = useGetIngredients(); // Hook pour récupérer les ingrédients
  const { deleteIngredient } = useDeleteIngredient(); // Hook pour supprimer un ingrédient

  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Mise à jour de la liste filtrée lorsque les ingrédients sont récupérés
  useEffect(() => {
    if (ingredients.length > 0) {
      setFilteredIngredients(ingredients);
    }
  }, [ingredients]);

  // Filtrage des ingrédients en fonction de la recherche
  useEffect(() => {
    const filtered = ingredients.filter((ingredient: Ingredient) =>
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredIngredients(filtered);
  }, [searchQuery, ingredients]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
    return <div className="text-center">Chargement des ingrédients...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-4 lg:max-w-7xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Liste des ingrédients</h1>
          <p className="mt-2 text-sm text-gray-700">
            Listing des ingrédients disponibles
          </p>
        </div>
      </div>

      <div className="flex flex-col mt-4 sm:flex-row gap-4 w-full">
        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          placeholder="Rechercher un ingrédient"
        />
      </div>

      {filteredIngredients.length > 0 ? (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Id
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Nom
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Prix (€)
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Catégorie
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredIngredients.map((ingredient) => (
                    <tr key={ingredient.id}>
                      <td className="py-4 pl-4 pr-3 text-sm sm:pl-0">{ingredient.id}</td>
                      <td className="px-3 py-4 text-sm">{ingredient.name}</td>
                      <td className="px-3 py-4 text-sm">{ingredient.description}</td>
                      <td className="px-3 py-4 text-sm">{ingredient.prix.toFixed(2)}</td>
                      <td className="px-3 py-4 text-sm">{ingredient.categorie}</td>
                      <td className="px-3 py-4 text-sm">
                        <Link href={`/backoffice/ingredient/${ingredient.id}`}
                          className="flex text-green-600 hover:text-red-900"
                        >
                          Ajouter
                        </Link>
                        <button
                          onClick={() => handleDeleteIngredient(ingredient.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500">Aucun ingrédient trouvé</div>
      )}
    </div>
  );
};

export default IngredientList;
