"use client";
import React from "react";

const categories = [
  {
    title: "Produits régionaux et locaux",
    description:
      "Découvrez les produits authentiques de nos régions, avec une traçabilité complète pour vous garantir le meilleur de chez nous.",
    linkText: "Voir tout",
  },
  {
    title: "Marché frais",
    subcategories: [
      {
        name: "Fruits et Légumes",
        description:
          "Les meilleurs produits de saison directement de nos producteurs.",
      },
      {
        name: "Viandes et Poissons",
        description:
          "Sélection de viandes locales et poissons frais pour tous vos repas.",
      },
      {
        name: "Pains et Pâtisseries",
        description:
          "Le plaisir du bon pain et des pâtisseries maison tous les jours.",
      },
      {
        name: "Crèmerie et Produits laitiers",
        description: "Tous les produits laitiers pour une fraîcheur garantie.",
      },
      {
        name: "Charcuterie et Traiteur",
        description:
          "Une sélection de charcuterie et plats traiteur à savourer.",
      },
    ],
  },
  {
    title: "Bio et Ecologie",
    description:
      "Un large choix de produits respectueux de l’environnement, pour une consommation plus responsable.",
    linkText: "Voir tout",
  },
  {
    title: "Epicerie et boissons",
    subcategories: [
      {
        name: "Epicerie salée",
        description:
          "Vos indispensables salés : pâtes, riz, conserves et plus encore.",
      },
      {
        name: "Epicerie sucrée",
        description:
          "Gâteaux, biscuits et douceurs pour les petits et grands gourmands.",
      },
      {
        name: "Boissons",
        description:
          "Jus, sodas, vins, et boissons fraîches pour accompagner chaque repas.",
      },
    ],
  },
  {
    title: "Nutrition et diététique",
    description:
      "Des produits pour une alimentation équilibrée et adaptée à vos besoins spécifiques.",
    linkText: "Voir tout",
  },
  {
    title: "Univers bébé",
    description: "Tout le nécessaire pour bébé : couches, soins, alimentation.",
    linkText: "Voir tout",
  },
  {
    title: "Maison et hygiène",
    subcategories: [
      {
        name: "Entretien et Nettoyage",
        description: "Produits d'entretien pour une maison impeccable.",
      },
      {
        name: "Hygiène et Beauté",
        description:
          "Soins pour le corps, cheveux et visage pour toute la famille.",
      },
      {
        name: "Parapharmacie",
        description:
          "Produits de parapharmacie pour le bien-être au quotidien.",
      },
    ],
  },
  {
    title: "Animalerie",
    description:
      "Tout ce qu’il vous faut pour vos animaux de compagnie : alimentation, accessoires, soins.",
    linkText: "Voir tout",
  },
  {
    title: "Commande traiteur",
    description:
      "Organisez vos événements avec notre service traiteur, pour des plats savoureux livrés directement chez vous.",
    linkText: "Voir tout",
  },
];

export default function CategoriesPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Nos catégories de produits
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, idx) => (
            <div key={idx} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {category.title}
              </h2>
              {category.subcategories ? (
                <ul className="space-y-3">
                  {category.subcategories.map((sub, index) => (
                    <li key={index} className="border-b pb-2">
                      <h3 className="font-semibold text-gray-700">
                        {sub.name}
                      </h3>
                      <p className="text-sm text-gray-600">{sub.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">{category.description}</p>
              )}
              {category.linkText && (
                <a href="#" className="text-indigo-600 mt-4 block">
                  {category.linkText}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
