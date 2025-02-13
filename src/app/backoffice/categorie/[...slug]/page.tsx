"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Alert from "../../components/Alert";
import DeleteButton from "../components/DeleteButton";
import { CheckIcon } from "@heroicons/react/20/solid";
import CategorieRow from "../components/CategorieRow";
import { Categorie } from "types";
import {
  useGetCategory,
  useDeleteCategory,
} from "@/hooks/categories/useCategories";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CategoryDetails() {
  const params = useParams();
  const slug = params?.slug as string;

  const {
    category,
    loading: categoryLoading,
    error: categoryError,
  } = useGetCategory(slug) as {
    category: Categorie | null;
    loading: any;
    error: any;
  };
  const {
    deleteCategory,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteCategory();

  const handleDelete = async () => {
    if (category) {
      await deleteCategory(category.slug);
      window.location.href = "/backoffice/categorie";
    }
  };

  if (categoryLoading || deleteLoading) return <LoadingSpinner />;
  if (categoryError)
    return (
      <div className="lg:pl-72 text-red-500">
        Erreur lors de la récupération de la catégorie.
      </div>
    );
  if (!category) return <div className="lg:pl-72">Catégorie non trouvée.</div>;

  return (
    <div className="bg-white">
      {(deleteError || categoryError) && (
        <Alert
          message={
            deleteError
              ? "Erreur lors de la suppression de la catégorie."
              : "Erreur lors de la récupération de la catégorie."
          }
          type="error"
        />
      )}
      <div className="mx-auto p-4 sm:p-6 lg:p-8 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8">
        {/* Détails de la catégorie */}
        <div className="lg:max-w-lg lg:self-end">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {category.name}
          </h1>
          <section aria-labelledby="information-heading" className="mt-4">
            <div className="text-lg text-gray-900 sm:text-xl">
              {category.description}
            </div>
            <div className="mt-6 flex items-center">
              <CheckIcon
                aria-hidden="true"
                className="h-5 w-5 text-green-500"
              />
              <p className="ml-2 text-sm text-gray-500">
                Sous-catégories disponibles
              </p>
            </div>
          </section>
        </div>

        {/* Image de la catégorie */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg h-96">
            <img
              src={
                category.image
                  ? `${category.image.path}`
                  : "https://via.placeholder.com/300"
              }
              alt={`Image de ${category.name}`}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            <div className="flex gap-4 flex-col">
              <Link
                href={`/backoffice/categorie/update/${category.slug}`}
                className="flex w-full items-center justify-center bold rounded-md px-8 py-3 text-white button-primary hover:bg-orange-500 text-black focus:ring-2 focus:ring-indigo-500"
              >
                Modifier la catégorie
              </Link>
              <DeleteButton
                onDelete={handleDelete}
                label="Supprimer la catégorie"
              />
            </div>
          </section>
        </div>
      </div>

      {/* Sous-catégories */}
      <div className="mx-auto p-4 sm:p-6 lg:p-8">
        <div className="sm:flex sm:items-center">
          <h1 className="text-base font-semibold text-gray-900">
            Liste des Sous-catégories
          </h1>
        </div>

        {category.subcategories && category.subcategories.length > 0 ? (
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Nom
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Slug
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Info
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {category.subcategories.map((subcategory) => (
                      <CategorieRow
                        key={subcategory.id}
                        categorie={subcategory}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">
            Aucune sous-catégorie trouvée.
          </p>
        )}
      </div>
    </div>
  );
}
