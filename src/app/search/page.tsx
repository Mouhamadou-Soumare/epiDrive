// SearchPageWrapper.tsx (Gère le Suspense sans 'use client')
import { Suspense } from "react";
import SearchResultsPage from "../../components/SearchResultsPage"; // Importation propre
import LoaderComponent from "@/components/LoaderComponent";

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<LoaderComponent/>}>
      <SearchResultsPage />
    </Suspense>
  );
}
