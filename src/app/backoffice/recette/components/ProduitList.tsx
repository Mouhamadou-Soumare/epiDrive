import { Produit } from "../../../../../types";
import { useCallback } from "react";

interface ProduitListProps {
  produits: Produit[];
  onRemoveProduit: (produitId: number) => void;
}

const ProduitList: React.FC<ProduitListProps> = ({ produits, onRemoveProduit }) => {
  const handleRemove = useCallback((id: number) => {
    onRemoveProduit(id);
  }, [onRemoveProduit]);

  return (
    <ul role="list" className="divide-y divide-gray-200 my-4">
      {produits.length > 0 ? (
        produits.map((produit) => (
          <li key={produit.id} className="py-1 flex items-center justify-between">
            <div className="flex w-full items-center justify-between">
              <p className="text-base text-gray-500">{produit.name}</p>
              <p className="text-base text-gray-500">{produit.prix} €</p>
            </div>
            <button
              type="button"
              className="text-red-500 hover:text-red-700 ml-4"
              onClick={() => handleRemove(produit.id)}
              aria-label={`Supprimer ${produit.name}`}
            >
              Supprimer
            </button>
          </li>
        ))
      ) : (
        <div className="text-gray-500 text-sm">Aucun produit ajouté</div>
      )}
    </ul>
  );
};

export default ProduitList;
