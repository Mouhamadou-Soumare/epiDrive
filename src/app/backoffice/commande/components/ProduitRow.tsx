import Link from "next/link";
import { Produit } from "../../../types";

interface ProduitRowProps {
  produit: Produit;
}

const ProduitRow: React.FC<ProduitRowProps> = ({ produit }) => (
  <tr>
    <td className="py-6 pr-2 font-bold">{produit.id}</td>
    <td className="py-6 pr-2 sm:table-cell">{produit.name}</td>
    <td className="py-6 pr-2 sm:table-cell">{produit.prix} €</td>
    <td className="py-6 font-medium">
      <Link href={`/backoffice/product/${produit.slug}`} className="text-indigo-600">
        Voir le produit
      </Link>
    </td>
  </tr>
);

export default ProduitRow;
