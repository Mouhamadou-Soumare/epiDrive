import Link from "next/link";
import { Commande, QuantiteCommande } from "../../../types";

interface CommandeRowProps {
  commande: Commande;
}

const CommandeRow: React.FC<CommandeRowProps> = ({ commande }) => {
  const getPriceCommande = () => {
    return commande.quantites.reduce((total, quantite: QuantiteCommande) => total + quantite.prix, 0);
  };

  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{commande.id}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{getPriceCommande()} €</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{commande.status}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <Link href={`/backoffice/commande/${commande.id}`} className="text-indigo-600">
          Voir la commande
        </Link>
      </td>
    </tr>
  );
};

export default CommandeRow;
