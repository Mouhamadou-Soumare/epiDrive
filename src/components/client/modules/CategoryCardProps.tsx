import { ReactNode } from 'react';
import Image from 'next/image';
import noel from "../../../../public/img/noel-homepage.png";
import repasHiver from "../../../../public/img/repas-hiver.jpg";
import gastronomy from "../../../../public/img/gastronomy.webp";

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
}

const categories = [
  { icon: <Image src={noel} alt='' className='rounded-full w-h-category-card-props '/>, title: 'Recettes de Noël' },
  { icon: <Image src={repasHiver} alt='' className='rounded-full w-h-category-card-props '/>, title: "Repas d'hiver" },
  { icon: <Image src={gastronomy} alt='' className='rounded-full w-h-category-card-props '/>, title: 'La boutique gastronomique' },
  { icon: <Image src={noel} alt='' className='rounded-full w-h-category-card-props '/>, title: 'Meubles & décoration' },
];

const CategoryCard = ({ icon, title }: CategoryCardProps) => (
  <div className="flex flex-col items-center justify-center categoriesCard rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-center w-28	h-28 rounded-full bg-gray-100">{icon}</div>
    <p className="mt-2 text-md text-white font-bold">{title}</p>
  </div>
);

export default function Categories() {
  return (
    <div className="bg-gray-50 py-6 rounded-lg mt-10 categoriesCardGrid">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
        {categories.map((category, index) => (
          <CategoryCard key={index} icon={category.icon} title={category.title} />
        ))}
      </div>
    </div>
  );
}
