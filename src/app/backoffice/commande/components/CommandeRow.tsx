import Link from "next/link";
import { Commande, QuantiteCommande } from "../../../../../types";
import { EyeIcon } from "@heroicons/react/24/outline";

interface CommandeRowProps {
  commande: Commande;
}

const CommandeRow: React.FC<CommandeRowProps> = ({ commande }) => {
  const getPriceCommande = () => {
    return commande.quantites?.reduce((total, quantite: QuantiteCommande) => total + (quantite.prix || 0), 0) || 0;
  };

  return (
    <tr>
      <td className="whitespace-nowrap py-4 px-3 text-sm font-medium text-gray-900">{commande.id}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{getPriceCommande().toFixed(2)} €</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{commande.status || "Inconnu"}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <Link href={`/backoffice/commande/${commande.id}`} className="a-primary svg-hover">
          <EyeIcon className="h-6 w-6 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500" />
        </Link>
      </td>
    </tr>
  );
};

export default CommandeRow;
