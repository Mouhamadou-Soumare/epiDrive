'use client';

import { useState, useEffect } from "react";
import Link from 'next/link';

import { User, Commande, Produit } from "../../../types";

/**
 * Page principale du backoffice.
 * Fournit des liens vers les différentes sections du backoffice.
 */
export default function Backoffice() {

  const [utilisateurs, setUtilisateurs] = useState<User[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [products, setProducts] = useState<Produit[]>([]);

  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        if (!response.ok) throw new Error('Erreur lors du chargement des utilisateurs');
        const data = await response.json();
        setUtilisateurs(data);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs :', error);
      }
    };
    
    const fetchCommandes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/commande");
        const data = await response.json();
        setCommandes(data);
      } catch (error) {
        console.error('Erreur lors du chargement des commandes :', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Erreur lors du chargement des produits :', error);
      }
    };
    
    fetchProducts();
    fetchUtilisateurs();
    fetchCommandes();
  }, []);
  return (
    <div>
      <main className="py-10">

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {utilisateurs ? (
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <Link href={"/backoffice/utilisateur"} className="truncate text-sm font-medium text-gray-500">Total d'utilisateurs</Link>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{utilisateurs.length}</dd>
            </div>
          ) : null}
          {commandes ? (
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <Link href={"/backoffice/commande"} className="truncate text-sm font-medium text-gray-500">Total des commandes</Link>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{commandes.length}</dd>
            </div>
          ) : null}
          {products ? (
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <Link href={"/backoffice/product"} className="truncate text-sm font-medium text-gray-500">Total des products</Link>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{products.length}</dd>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
