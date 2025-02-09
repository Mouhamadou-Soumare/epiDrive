'use client';
import Image from 'next/image';

import { CloudArrowUpIcon, LockClosedIcon, ArrowPathIcon, ShieldCheckIcon, CogIcon, ServerIcon } from '@heroicons/react/24/outline';
import RecommendedProducts from '@/components/client/product/RecommendedProducts';
import { useGetAllProducts } from '@/hooks/products/useGetAllProducts';
import HeroSectionHomepage from '@/components/HeroSectionHomepage';
import adventCalendar from "../../public/img/adventcalendar.png";
import donation from "../../public/img/donation_png.png";


export default function HomePage() {
  const { products } = useGetAllProducts(); 

  const faqs = [
    {
      id: 1,
      question: "Comment fonctionne la reconnaissance d'ingrédients sur EpiDrive ?",
      answer:
        "Vous pouvez simplement scanner un plat ou un produit via notre application, et notre IA identifiera les ingrédients pour les ajouter à votre liste de courses.",
    },
    {
      id: 2,
      question: "Quels sont les modes de livraison disponibles ?",
      answer:
        "EpiDrive propose deux options : la livraison à domicile ou le retrait en drive, selon votre préférence et votre localisation.",
    },
    {
      id: 3,
      question: "Dois-je créer un compte pour faire des achats ?",
      answer:
        "Non, vous pouvez rechercher des produits sans être connecté. Toutefois, un compte est requis pour passer commande, accéder à vos favoris et consulter votre historique d'achats.",
    },
    {
      id: 4,
      question: "Puis-je suivre ma commande en temps réel ?",
      answer:
        "Oui, dès que vous passez commande, vous pouvez suivre chaque étape, de la préparation à la livraison, directement depuis votre espace client.",
    },
    {
      id: 5,
      question: "Quels modes de paiement sont acceptés ?",
      answer:
        "Nous acceptons plusieurs moyens de paiement, dont les cartes bancaires, PayPal, et d'autres solutions locales sécurisées.",
    },
  ];
  

  const features = [
    {
      name: 'Snap & Cook',
      description: "Scannez vos plats, l'IA identifie les ingrédients et les ajoute automatiquement à votre liste de courses.",
      icon: CloudArrowUpIcon,
    },
    {
      name: 'Livraison Rapide',
      description: 'Choisissez entre livraison à domicile ou retrait en drive avec des délais de livraison rapides et garantis.',
      icon: LockClosedIcon,
    },
    {
      name: 'Recommandations Personnalisées',
      description: "Profitez de suggestions de produits basées sur vos habitudes d'achats et préférences alimentaires.",
      icon: ArrowPathIcon,
    },
    {
      name: 'Paiements Sécurisés',
      description: 'Des solutions de paiement rapides et sécurisées avec plusieurs options (carte, PayPal, etc.).',
      icon: ShieldCheckIcon,
    },
    {
      name: 'Recettes Inspirantes',
      description:
        'Recevez des idées de recettes personnalisées en fonction des ingrédients déjà présents dans votre panier.',
      icon: CogIcon,
    },
    {
      name: 'Suivi de Commande en Temps Réel',
      description: 'Restez informé de chaque étape, de la préparation à la livraison de vos courses.',
      icon: ServerIcon,
    },
  ]
  return (
    <div className="min-h-screen">
     

      {/* Hero Section */}
      <main>
        <HeroSectionHomepage />
        
        <RecommendedProducts 
          allProducts={products.map(product => ({
            ...product,
            prix: product.prix,
            categorieId: product.categorieId
          }))} 
        />

        <div className='flex flex-col md:flex-row'>
          <section aria-labelledby="advent-heading" className="mx-auto max-w-full px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <h2 id="advent-heading" className="sr-only">Calendrier de l'Avent</h2>
            <div className="relative overflow-hidden rounded-lg">
              <Image src={adventCalendar} alt="Calendrier de l'Avent EpiDrive" className="size-full object-cover" />
              <div className="relative bg-gray-900/75 px-6 py-32 sm:px-12 sm:py-40 lg:px-16">
                <h3 className="text-3xl font-bold text-white sm:text-4xl">Calendrier de l'Avent</h3>
                <p className="mt-3 text-xl text-white">
                  Découvrez une surprise chaque jour jusqu'à Noël ! Des offres exclusives, des produits locaux à prix réduits et bien plus encore.
                </p>
                <a href="#" className="mt-8 block w-full rounded-md border border-transparent bg-white px-8 py-3 text-gray-900 hover:bg-gray-100 sm:w-auto">
                  Découvrir les surprises du jour
                </a>
              </div>
            </div>
          </section>

          <section aria-labelledby="comfort-heading" className="mx-auto max-w-full px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="relative overflow-hidden rounded-lg">
              <div className="absolute inset-0">
                <Image
                  alt=""
                  src={donation}
                  className="size-full object-cover"
                />
              </div>
              <div className="relative bg-gray-900/75 px-6 py-32 sm:px-12 sm:py-40 lg:px-16">
                <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                  <h2 id="comfort-heading" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Soutenons ensemble le Téléthon
                  </h2>
                  <p className="mt-3 text-xl text-white">
                  Participez à une action solidaire en faisant vos courses chez Epidrive. Une partie de vos achats sera reversée pour soutenir la recherche et l’innovation médicale.
                  </p>
                  <a
                    href="#"
                    className="mt-8 block w-full rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
                  >
                    En savoir plus et participer
                  </a>
                </div>
              </div>
            </div>
          </section>

        </div>
       
        {/* Featured Products Section */}
        <section className="bg-white py-16 sm:py-24 lg:py-32">
          <h2 className="text-lg font-semibold text-black-600 text-center">Plaisir & Praticité</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900 text-center sm:text-4xl">
            Les avantages EpiDrive : Des courses innovantes à portée de clic
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <span className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-orange-500 to-yellow-400 p-3 shadow-lg">
                      <feature.icon aria-hidden="true" className="h-6 w-6 text-white" />
                    </span>
                    <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">{feature.name}</h3>
                    <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
         
        {/* FAQ Section */}
        <div className="mx-auto max-w-2xl divide-y divide-gray-900/10 px-6 pb-8 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">FAQ</h2>
          <dl className="mt-10 space-y-8 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <div key={faq.id} className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
                <dt className="text-base font-semibold leading-7 text-gray-900 lg:col-span-5">{faq.question}</dt>
                <dd className="mt-4 lg:col-span-7 lg:mt-0">
                  <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* CTA Section */}
        <section className="button-secondary py-16 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Commencez avec EpiDrive dès aujourd'hui !</h2>
          <p className="mb-8">Livraison rapide, produits frais et une expérience d'achat en ligne exceptionnelle.</p>
          <a href="/shop" className="bg-white a-primary px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
            Découvrez nos produits
          </a>
        </section>
      </main>
    </div>
  );
}
