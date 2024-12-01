import { Produit } from "../../../../../types";

interface ProduitListProps {
  produits: Produit[];
  onRemoveProduit: (produitId: number) => void;
}

const ProduitList: React.FC<ProduitListProps> = ({ produits, onRemoveProduit }) => (
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
            onClick={() => onRemoveProduit(produit.id)}
          >
            Supprimer
          </button>
        </li>
      ))
    ) : (
      <div>Aucun produit ajouté</div>
    )}
  </ul>
);

export default ProduitList;
