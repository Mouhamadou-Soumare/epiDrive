import Link from "next/link";
import { Produit } from "../../../types";

interface ProduitRowProps {
  produit: Produit;
}

const ProduitRow: React.FC<ProduitRowProps> = ({ produit }) => (
  <tr>
    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{produit.id}</td>
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{produit.name}</td>
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{produit.prix} €</td>
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
      <Link href={`/backoffice/product/${produit.slug}`} className="text-indigo-600">
        Voir le produit
      </Link>
    </td>
  </tr>
);

export default ProduitRow;
