import Link from "next/link";
import { Commande, QuantiteCommande } from "../../../../../types";
import { EyeIcon } from "@heroicons/react/24/outline";

interface CommandeCardProps {
  commande: Commande;
}

const CommandeCard: React.FC<CommandeCardProps> = ({ commande }) => {
  const getPriceCommande = () => {
    return commande.quantites.reduce((total: number, quantite: QuantiteCommande) => total + quantite.prix, 0);
  };

  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{commande.id}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{getPriceCommande()} €</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{commande.status}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <Link href={`/backoffice/commande/${commande.id}`} aria-label={`Voir la commande ${commande.id}`}>
          <EyeIcon className="h-6 w-6 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500" />
        </Link>
      </td>
    </tr>
  );
};

export default CommandeCard;
