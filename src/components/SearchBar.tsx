"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Produit } from "types";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `/api/products/search?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();

      if (res.ok && Array.isArray(data.products)) {
        setResults(data.products);
      } else {
        console.error("Erreur dans les données reçues :", data);
        setResults([]);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setResults([]);
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <form className="max-w lg:min-w-96 relative" onSubmit={handleSubmit}>
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Recherche
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 26 26"
          >
            <path d="M 10 0.1875 C 4.578125 0.1875 0.1875 4.578125 0.1875 10 C 0.1875 15.421875 4.578125 19.8125 10 19.8125 C 12.289063 19.8125 14.394531 19.003906 16.0625 17.6875 L 16.9375 18.5625 C 16.570313 19.253906 16.699219 20.136719 17.28125 20.71875 L 21.875 25.34375 C 22.589844 26.058594 23.753906 26.058594 24.46875 25.34375 L 25.34375 24.46875 C 26.058594 23.753906 26.058594 22.589844 25.34375 21.875 L 20.71875 17.28125 C 20.132813 16.695313 19.253906 16.59375 18.5625 16.96875 L 17.6875 16.09375 C 19.011719 14.421875 19.8125 12.300781 19.8125 10 C 19.8125 4.578125 15.421875 0.1875 10 0.1875 Z M 10 2 C 14.417969 2 18 5.582031 18 10 C 18 14.417969 14.417969 18 10 18 C 5.582031 18 2 14.417969 2 10 C 2 5.582031 5.582031 2 10 2 Z M 4.9375 7.46875 C 4.421875 8.304688 4.125 9.289063 4.125 10.34375 C 4.125 13.371094 6.566406 15.8125 9.59375 15.8125 C 10.761719 15.8125 11.859375 15.433594 12.75 14.8125 C 12.511719 14.839844 12.246094 14.84375 12 14.84375 C 8.085938 14.84375 4.9375 11.695313 4.9375 7.78125 C 4.9375 7.675781 4.933594 7.574219 4.9375 7.46875 Z"></path>
          </svg>{" "}
        </div>
        <input
          type="search"
          id="default-search"
          value={query}
          onChange={handleInputChange}
          placeholder="Rechercher un produit..."
          className="block w-full py-2.5 px-4 ps-10 text-sm text-gray-900 border-gray-500 rounded-lg bg-gray-300 focus:ring-orange-500 focus:border-orange-500  "
        />
        <button
          type="submit"
          className="text-white absolute end-2.5 bottom-2.5 bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800 focus-visible:bg-transparent hidden"
        >
          Rechercher
        </button>
      </div>

      {loading && (
        <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-10 p-4 text-gray-500 text-sm">
          Recherche en cours...
        </div>
      )}

      {results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-10"
        >
          {results.map((product) => (
            <a
              key={product.id}
              href={`/product/${product.slug}`}
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setResults([])}
            >
              <div className="flex items-center">
                <img
                  src={product.image?.path || "https://via.placeholder.com/100"}
                  alt={`Image de ${product.name}`}
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
