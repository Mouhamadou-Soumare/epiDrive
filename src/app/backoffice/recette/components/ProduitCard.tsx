import { Produit } from "../../../../../types";

interface ProduitCardProps {
  produit: Produit;
}

const ProduitCard: React.FC<ProduitCardProps> = ({ produit }) => (
  <li className="py-1 flex items-center justify-between">
    <p className="text-base text-gray-500">{produit.name}</p>
    <p className="text-base text-gray-500">{produit.prix} €</p>
  </li>
);

export default ProduitCard;
