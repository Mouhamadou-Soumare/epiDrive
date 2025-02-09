import Link from "next/link";
import { Recette } from "../../../../../types";
import { EyeIcon } from "@heroicons/react/24/outline";

interface RecetteRowProps {
  recette: Recette;
}

const RecetteRow: React.FC<RecetteRowProps> = ({ recette }) => {
  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {recette.id}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {recette.title}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <Link 
          href={`/backoffice/recette/${recette.id}`} 
          aria-label={`Voir la recette ${recette.title}`}
          className="a-primary svg-hover"
        >
          <EyeIcon className="h-6 w-6 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500" />
        </Link>
      </td>
    </tr>
  );
};

export default RecetteRow;
