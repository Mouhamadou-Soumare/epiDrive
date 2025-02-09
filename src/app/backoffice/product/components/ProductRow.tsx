import Link from "next/link";
import { Produit } from "../../../../../types";
import { EyeIcon } from "@heroicons/react/24/outline";

interface ProductRowProps {
  product: Produit;
}

const ProductRow: React.FC<ProductRowProps> = ({ product }) => {
  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{product.id}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.name}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.slug}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.prix} €</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <Link href={`/backoffice/product/${product.slug}`} aria-label={`Voir le produit ${product.name}`}>
          <EyeIcon className="h-6 w-6 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500" />
        </Link>
      </td>
    </tr>
  );
};

export default ProductRow;
