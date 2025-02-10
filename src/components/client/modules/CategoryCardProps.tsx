import { ReactNode } from "react";
import Image from "next/image";
import chocolates from "../../../../public/img/chocolates-stvalentin.webp";
import romanticDinner from "../../../../public/img/diner_stvalentin.webp";
import loveDecor from "../../../../public/img/deco_stvalentin.webp";
import valentineGift from "../../../../public/img/cadeaux_stvalentin.webp";

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
}

const categories = [
  {
    icon: (
      <Image
        src={chocolates}
        alt="Chocolats de Saint-Valentin"
        className="rounded-full w-h-category-card-props"
      />
    ),
    title: "Délices chocolatés",
  },
  {
    icon: (
      <Image
        src={romanticDinner}
        alt="Dîner romantique"
        className="rounded-full w-h-category-card-props"
      />
    ),
    title: "Dîner en amoureux",
  },
  {
    icon: (
      <Image
        src={loveDecor}
        alt="Décoration romantique"
        className="rounded-full w-h-category-card-props"
      />
    ),
    title: "Ambiance romantique",
  },
  {
    icon: (
      <Image
        src={valentineGift}
        alt="Cadeaux de Saint-Valentin"
        className="rounded-full w-h-category-card-props"
      />
    ),
    title: "Cadeaux & surprises",
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
    <div className="bg-pink-50 py-6 rounded-lg mt-10 categoriesCardGrid">
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
