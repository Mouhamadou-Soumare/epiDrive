import Link from "next/link";

interface ProductActionsProps {
  productSlug: string;
  onDelete: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ productSlug, onDelete }) => (
  <div className="flex gap-4 flex-col">
    <Link
      href={`/backoffice/product/update/${productSlug}`}
      className="flex w-full items-center justify-center rounded-md px-8 py-3 text-white bg-orange-300 hover:bg-orange-500 focus:ring-2 focus:ring-indigo-500"
    >
      Modifier le produit
    </Link>
    <button
      onClick={onDelete}
      className="flex w-full items-center justify-center rounded-md px-8 py-3 text-white bg-red-300 hover:bg-red-500 focus:ring-2 focus:ring-indigo-500"
    >
      Supprimer le produit
    </button>
  </div>
);

export default ProductActions;
