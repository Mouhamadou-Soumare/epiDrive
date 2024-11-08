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
      <td className="py-6 pr-2 font-bold">{commande.id}</td>
      <td className="py-6 pr-2 sm:table-cell">{getPriceCommande()} €</td>
      <td className="py-6 pr-2 sm:table-cell">{commande.status}</td>
      <td className="py-6 font-medium">
        <Link href={`/backoffice/commande/${commande.id}`} className="text-indigo-600">
          Voir la commande
        </Link>
      </td>
    </tr>
  );
};

export default CommandeRow;
