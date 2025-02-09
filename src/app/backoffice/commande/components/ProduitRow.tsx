import Link from "next/link";
import { Produit } from "../../../../../types";
import { EyeIcon } from "@heroicons/react/24/outline";

interface ProduitRowProps {
  produit: Produit;
}

const ProduitRow: React.FC<ProduitRowProps> = ({ produit }) => (
  <tr>
    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{produit.id}</td>
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{produit.name}</td>
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{produit.prix} €</td>
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
      <Link href={`/backoffice/product/${produit.slug}`} className="a-primary svg-hover">
        <EyeIcon className="h-6 w-6 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500" />
      </Link>
    </td>
  </tr>
);

export default ProduitRow;
