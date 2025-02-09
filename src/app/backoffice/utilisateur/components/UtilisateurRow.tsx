import Link from "next/link";
import { User } from "../../../../../types";
import { EyeIcon } from "@heroicons/react/24/outline";

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
        <Link href={`/backoffice/utilisateur/${utilisateur.id}`} aria-label={`Voir les détails de ${utilisateur.username}`}>
          <EyeIcon className="h-6 w-6 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500" />
        </Link>
      </td>
    </tr>
  );
};

export default UtilisateurRow;
