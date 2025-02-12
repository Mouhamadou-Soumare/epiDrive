'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Dialog, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Pagination from './Pagination';
import SortDropdown from './client/product/search/SortDropdown';
import { Produit } from 'types';
import LoaderComponent from './LoaderComponent';

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  prix: number;
  imageSrc: string;
  imageAlt: string;
  categorieSlug: string;
};

type Category = {
  id: number;
  name: string;
  slug: string;
};

const ITEMS_PER_PAGE = 12;

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams ? searchParams.get('query') : '';
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('relevance');  

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const sortedAndFilteredProducts = products
    .filter(product => 
      selectedCategories.length === 0 || selectedCategories.includes(product.categorieSlug)
    )
    .sort((a, b) => {
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      if (sortOption === 'price-asc') return a.prix - b.prix;
      if (sortOption === 'price-desc') return b.prix - a.prix;
      return 0;
    });

  const displayedProducts = sortedAndFilteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleCategorySelection = (categorySlug: string) => {
    setSelectedCategories(prev =>
      prev.includes(categorySlug)
        ? prev.filter(slug => slug !== categorySlug)
        : [...prev, categorySlug]
    );
  };

  useEffect(() => {
    async function fetchProducts() {
      if (!query) return;

      try {
        const res = await fetch(`/api/products/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (res.ok) {
          setProducts(
            data.products.map((product: { categorie: { slug: any; }; }) => ({
              ...product,
              categorieSlug: product.categorie.slug,
            }))
          );
          setCategories(data.categories);
        } else {
          console.error('Erreur lors de la récupération des produits:', data.error);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [query]);

  if (loading) return <LoaderComponent/>;
  if (products.length === 0) return <div>Aucun produit trouvé pour la recherche "{query}"</div>;

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
          <div className="fixed inset-0 z-40 flex">
            <Dialog.Panel className="relative ml-auto h-full w-full max-w-xs bg-white p-4 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filtres</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <form className="mt-4">
                {/* Catégorie Filter */}
                <Disclosure as="div" className="border-t border-gray-200 pt-4 pb-4">
                  <DisclosureButton className="flex items-center justify-between w-full text-gray-400 hover:text-gray-500">
                    <span className="text-sm font-medium text-gray-900">Catégorie</span>
                    <ChevronDownIcon className="h-5 w-5 transform group-data-[open]:-rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="pt-4">
                    <div className="space-y-4">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`category-${category.slug}-mobile`}
                            name="category"
                            value={category.slug}
                            checked={selectedCategories.includes(category.slug)}
                            onChange={() => toggleCategorySelection(category.slug)}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor={`category-${category.slug}-mobile`} className="ml-3 text-sm text-gray-700">
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200 pb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 mt-8">Résultats pour "{query}"</h1>
            <p className="text-sm text-gray-600">{displayedProducts.length} produits trouvés</p>
          </div>

          {/* Tri */}

          <div className="lg:grid lg:grid-cols-4 lg:gap-6 mt-6">
            {/* Sidebar filters */}
            <aside className="hidden lg:block">
              <h2 className="sr-only">Filtres</h2>
              <form className="space-y-10 divide-y divide-gray-200">
              <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />

                {/* Catégorie Filter */}
                <div className="pt-10">
                  <fieldset>

                    <legend className="text-sm font-medium text-gray-900">Catégorie</legend>
                    <div className="space-y-4 pt-6">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`category-${category.slug}`}
                            name="category"
                            value={category.slug}
                            checked={selectedCategories.includes(category.slug)}
                            onChange={() => toggleCategorySelection(category.slug)}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor={`category-${category.slug}`} className="ml-3 text-sm text-gray-600">
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </form>
            </aside>

            {/* Product grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {displayedProducts.map((product) => (
                  <a key={product.id} href={`/product/${product.slug}`} className="group">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                      <img
                        src={product.imageSrc || 'https://via.placeholder.com/300'}
                        alt={product.imageAlt}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                    <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">{product.prix} €</p>
                  </a>
                ))}
              </div>

              {/* Pagination controls */}
              <Pagination
                totalItems={sortedAndFilteredProducts.length}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
