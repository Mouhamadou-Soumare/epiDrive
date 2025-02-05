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
      <td className="py-6 pr-2 font-bold">{commande.id}</td>
      <td className="py-6 pr-2 sm:table-cell">{getPriceCommande()} €</td>
      <td className="py-6 pr-2 sm:table-cell">{commande.status}</td>
      <td className="py-6 font-medium">
        <Link href={`/backoffice/commande/${commande.id}`} className="a-primary svg-hover">
        <EyeIcon className="h-6 w-6"/>
        </Link>
      </td>
    </tr>
  );
};

export default CommandeCard;
