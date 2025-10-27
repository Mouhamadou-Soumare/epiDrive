import { ReactNode } from "react";
import Image from "next/image";
import epicerieFine from "../../../../public/img/category/epicerie-fine-regionale.webp";
import patisseries from "../../../../public/img/category/patisseries.webp";
import maison from "../../../../public/img/category/maison-et-hygiene.webp";
import cadeaux from "../../../../public/img/category/produits-regionaux-et-locaux.webp";

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
}

const categories = [
  {
    icon: (
      <Image
        src={epicerieFine}
        alt="Épicerie fine"
        className="rounded-full w-h-category-card-props"
      />
    ),
    title: "Épicerie fine",
  },
  {
    icon: (
      <Image
        src={patisseries}
        alt="Pâtisseries"
        className="rounded-full w-h-category-card-props"
      />
    ),
    title: "Pâtisseries",
  },
  {
    icon: (
      <Image
        src={maison}
        alt="Maison & hygiène"
        className="rounded-full w-h-category-card-props"
      />
    ),
    title: "Maison & Hygiène",
  },
  {
    icon: (
      <Image
        src={cadeaux}
        alt="Produits régionaux"
        className="rounded-full w-h-category-card-props"
      />
    ),
    title: "Produits régionaux",
  },
];

const CategoryCard = ({ icon, title }: CategoryCardProps) => (
  <div className="flex flex-col items-center justify-center categoriesCard rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-center w-28 h-28 rounded-full bg-gray-100">
      {icon}
    </div>
    <p className="mt-2 text-md text-white font-bold">{title}</p>
  </div>
);

export default function Categories() {
  return (
    <div className="bg-white py-6 rounded-lg mt-10 categoriesCardGrid">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            icon={category.icon}
            title={category.title}
          />
        ))}
      </div>
    </div>
  );
}
