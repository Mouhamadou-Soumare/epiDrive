import Link from "next/link";
import { Produit } from "../../../../../types";

interface ProductRowProps {
  product: Produit;
}

const ProductRow: React.FC<ProductRowProps> = ({ product }) => {

  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{product.id}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.name}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.slug}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.prix} €</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <Link href={`/backoffice/product/${product.slug}`} className="text-indigo-600">
          Voir le produit
        </Link>
      </td>
    </tr>
  );
};

export default ProductRow;
