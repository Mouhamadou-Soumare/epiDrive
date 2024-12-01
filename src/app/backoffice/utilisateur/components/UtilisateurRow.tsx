import Link from "next/link";
import { User } from "../../../../../types";

interface UtilisateurRowProps {
  utilisateur: User;
}

const UtilisateurRow: React.FC<UtilisateurRowProps> = ({ utilisateur }) => {

  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{utilisateur.id}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{utilisateur.username}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{utilisateur.email}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{utilisateur.role}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <Link href={`/backoffice/utilisateur/${utilisateur.id}`} className="text-indigo-600">
          Voir l'utilisateur
        </Link>
      </td>
    </tr>
  );
};

export default UtilisateurRow;
