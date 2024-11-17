import { Categorie } from "../../../types";

interface CategoryFilterProps {
  categories: Categorie[];
  selectedCategory: string;
  onChange: (value: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onChange }) => {
  return (
    <select
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md"
      value={selectedCategory}
    >
      <option value="">Toutes les catégories</option>
      {categories.map(category => (
        <optgroup key={category.id} label={category.name}>
          {category.subcategories?.map( (subcategory : Categorie) => (
            <option key={subcategory.id} value={String(subcategory.id)}>
              {subcategory.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
};

export default CategoryFilter;
