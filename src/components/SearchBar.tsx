'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  prix: number;
  imageSrc: string;
  imageAlt: string;
};

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/products/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();

      if (res.ok) {
        setResults(data);
      } else {
        console.error("Erreur de recherche:", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setResults([]);  
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setResults([]); 
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <form className="max-w min-w-96 relative" onSubmit={handleSubmit}>
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          value={query}
          onChange={handleSearch}
          placeholder="Search Mockups, Logos..."
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
        <button
          type="submit"
          className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Search
        </button>
      </div>

      {results.length > 0 && (
        <div ref={dropdownRef} className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-10">
          {results.map((product) => (
            <a
              key={product.id}
              href={`/product/${product.slug}`}
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setResults([])}  // Ferme le dropdown au clic sur un produit
            >
              <div className="flex items-center">
                <img
                  src={product.imageSrc || 'https://via.placeholder.com/100'}
                  alt={product.imageAlt || `Image de ${product.name}`}
                  className="w-10 h-10 object-cover rounded mr-4"
                />
                <div>
                  <h3 className="text-sm font-semibold">{product.name}</h3>
                  <p className="text-xs text-gray-500">{product.prix} €</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </form>
  );
}
