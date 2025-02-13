import Link from "next/link";
import { Categorie } from "../../../../../types";
import { EyeIcon } from "@heroicons/react/24/outline";

interface CategorieRowProps {
  categorie: Categorie;
}

const CategorieRow: React.FC<CategorieRowProps> = ({ categorie }) => {
  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {categorie.id}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {categorie.name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {categorie.slug}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <Link
          href={`/backoffice/categorie/${categorie.slug}`}
          className="a-primary svg-hover"
        >
          <EyeIcon className="h-6 w-6" />
        </Link>
      </td>
    </tr>
  );
};

export default CategorieRow;
