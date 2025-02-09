'use client';

import Image from 'next/image';

// Import des images (amélioration pour Next.js)
import logo from '../../public/img/logo.png';
import scanFood from '../../public/img/scan_food.webp';
import foodBak from '../../public/img/food-bak.webp';
import epiDrive from '../../public/img/Epidrive.webp';
import produitsRegionaux from '../../public/img/category/produits-regionaux-et-locaux-nav.webp';
import groceryDrive from '../../public/img/grocery_drive.webp';
import viennoiseries from '../../public/img/category/pains-et-patisseries.webp';
import foodPresentation from '../../public/img/food_presentation.webp';
import charcuterieTraiteur from '../../public/img/category/charcuterie-et-traiteur.webp';
import epicerieFineRegionale from '../../public/img/category/epicerie-fine-regionale.webp';
import grocery from '../../public/img/grocerystore.webp';
import marketbasket from '../../public/img/market_bakset.webp';

export default function AuthenticatorCards() {
  const images = [
    [scanFood, grocery, foodBak, marketbasket],
    [epiDrive, produitsRegionaux, charcuterieTraiteur, logo],
    [foodPresentation, viennoiseries, groceryDrive, epicerieFineRegionale],
  ];

  return ( 
    <div className="authenticator-cards-container w-full md:w-1/2 lg:w-1/2  flex flex-wrap justify-center gap-6 mt-12">
      {images.map((column, columnIndex) => (
        <div key={`column-${columnIndex}`} className="flex flex-col gap-4">
          {column.map((src, imgIndex) => (
            <div key={`img-${columnIndex}-${imgIndex}`} className="p-2 rounded-lg shadow-md bg-white">
              <Image
                src={src}
                alt={`image-${columnIndex}-${imgIndex}`}
                width={50} // Optimisation : Largeur définie
                height={50} // Optimisation : Hauteur définie
                className="rounded-md object-cover"
                priority // Charge certaines images en priorité
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
