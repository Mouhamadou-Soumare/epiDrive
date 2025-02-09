import { Produit } from "../../../../../types";
import { useMemo } from "react";

interface ProduitCardProps {
  produit: Produit;
}

const ProduitCard: React.FC<ProduitCardProps> = ({ produit }) => {
  const produitInfo = useMemo(() => (
    <>
      <p className="text-base text-gray-700 font-semibold">{produit.name}</p>
      <p className="text-sm text-gray-500">{produit.prix} €</p>
    </>
  ), [produit]);

  return (
    <li className="py-2 px-4 flex items-center justify-between bg-gray-100 rounded-md hover:bg-gray-200 transition">
      {produitInfo}
    </li>
  );
};

export default ProduitCard;
