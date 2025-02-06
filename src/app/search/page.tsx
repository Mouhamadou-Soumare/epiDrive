// SearchPageWrapper.tsx (Gère le Suspense sans 'use client')
import { Suspense } from "react";
import SearchResultsPage from "../../components/SearchResultsPage"; // Importation propre

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div>Chargement de la recherche...</div>}>
      <SearchResultsPage />
    </Suspense>
  );
}
