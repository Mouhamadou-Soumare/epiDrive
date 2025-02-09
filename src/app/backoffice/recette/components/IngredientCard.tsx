import Link from "next/link";
import { Ingredient } from "../../../../../types";

interface IngredientCardProps {
  ingredient: Ingredient;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient }) => (
  <li className="py-2 px-4 flex items-center justify-between bg-gray-50 rounded-md hover:bg-gray-100 transition">
    <Link
      href={`/backoffice/ingredient/${ingredient.id}`}
      className="text-gray-700 hover:text-indigo-600 font-medium"
      aria-label={`Voir l'ingrédient ${ingredient.name}`}
    >
      {ingredient.name}
    </Link>
  </li>
);

export default IngredientCard;
