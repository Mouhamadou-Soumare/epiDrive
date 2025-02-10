'use client';

import Image from 'next/image';
import logo from "../../public/img/logo.png";
import scanFood from "../../public/img/scan_food.webp";
import foodBak from "../../public/img/food-bak.webp";
import epiDrive from "../../public/img/Epidrive.webp";
import produitsRegionaux from "../../public/img/category/produits-regionaux-et-locaux-nav.webp";
import groceryDrive from "../../public/img/grocery_drive.webp";
import viennoiseries from "../../public/img/category/pains-et-patisseries.webp";
import foodPresentation from "../../public/img/food_presentation.webp";
import charcuterieTraiteur from "../../public/img/category/charcuterie-et-traiteur.webp";
import epicerieFineRegionale from "../../public/img/category/epicerie-fine-regionale.webp";
import grocery from "../../public/img/grocerystore.webp";
import drive from "../../public/img/drive.webp";
import marketbasket from "../../public/img/market_bakset.webp";



export default function AuthenticatorCards() {
  const images = [
    [logo],
    [scanFood, grocery],
    [epiDrive, produitsRegionaux, charcuterieTraiteur],
    [foodPresentation, viennoiseries, groceryDrive, epicerieFineRegionale],
    [
      foodBak,marketbasket,drive
    ],
  ];

  return (
    <div className="authenticator-cards-container flex-form-auth">
      {images.map((column, columnIndex) => (
        <div key={columnIndex} className="column">
          {column.map((src, imgIndex) => (
            <div key={imgIndex} className="card">
              {typeof src === 'string' ? (
                <img src={src} alt={`image-${imgIndex}`} />
              ) : (
                <Image src={src} alt={`image-${imgIndex}`} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}