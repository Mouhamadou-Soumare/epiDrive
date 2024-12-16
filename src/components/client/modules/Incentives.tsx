'use client';

const incentives = [
  {
    name: 'Livraison rapide et locale',
    description: "Recevez vos courses chez vous en un temps record, simple et pratique.",
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce/icons/icon-delivery-light.svg',
  },
  {
    name: 'Support client 24/7',
    description: "Besoin d’aide ? Nos experts sont disponibles à tout moment.",
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce/icons/icon-chat-light.svg',
  },
  {
    name: 'Commande express',
    description: "Ajoutez vos produits en un clic et recevez-les rapidement, sans stress.",
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce/icons/icon-fast-checkout-light.svg',
  },
  {
    name: 'Suggérez un produit/recette',
    description: "Partagez vos suggestions, et nous enrichirons notre catalogue pour vous.",
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce/icons/icon-warranty-light.svg',
  },
];

export default function Incentives() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
          {incentives.map((incentive) => (
            <div
              key={incentive.name}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <img
                src={incentive.imageSrc}
                alt={incentive.name}
                className="h-16 w-16 mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900">
                {incentive.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{incentive.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
