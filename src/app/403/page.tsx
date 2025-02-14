"use client";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <h1 className="text-6xl font-bold text-red-600">403</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">Accès interdit</h2>
      <p className="text-gray-600 mt-2 text-center max-w-md">
        Vous n'avez pas la permission d'accéder à cette page.
      </p>

      <button
        onClick={() => router.back()}
        className="mt-6 px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
      >
        Retour
      </button>
    </div>
  );
}