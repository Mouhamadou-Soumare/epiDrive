'use client';

import Link from 'next/link';

export default function Backoffice() {
  return (
    <div>
      <main className="py-10">
        <div className="flex flex-col px-4 sm:px-6 lg:px-8">
          <Link href="/backoffice/utilisateur">Liste des utilisateurs</Link>
          <Link href="/backoffice/product">Liste des produits</Link>
          <Link href="/backoffice/recette">Liste des recettes</Link>
          <Link href="/backoffice/categorie">Liste des catégories</Link>
          <Link href="/backoffice">Liste des sous catégories</Link>
          <Link href="/backoffice">Liste des recettes</Link>
          <Link href="/backoffice">Liste des commandes</Link>
        </div>
      </main>
    </div>
  );
}
