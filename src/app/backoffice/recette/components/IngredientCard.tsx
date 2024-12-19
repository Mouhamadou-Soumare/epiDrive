import Link from "next/link";
import { Ingredient } from "../../../../../types";

interface IngredientCardProps {
  ingredient: Ingredient;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient }) => (
  <li className="py-1 flex items-center justify-between">
  <Link href={`/backoffice/ingredient/${ingredient.id}`}>
    <p className="text-base text-gray-500">{ingredient.name}</p>
  </Link>
  </li>
);

export default IngredientCard;
