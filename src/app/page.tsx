'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { ArrowPathIcon, Bars3Icon, CloudArrowUpIcon, CogIcon, LockClosedIcon, ServerIcon, ShieldCheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

import foodPresentation from "../../public/img/food_presentation.webp";
import groceryDrive from "../../public/img/grocery_drive.webp";
import scanFood from "../../public/img/scan_food.webp";
import whatIWant from "../../public/img/what_i_want.webp";
import epiDrive from "../../public/img/Epidrive.webp";
import RecommendedProducts from '@/components/client/product/RecommendedProducts';
import { useGetAllProducts } from '@/hooks/products/useGetAllProducts';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Categories', href: '/categories' },
  { name: 'Contact', href: '/contact' },
];

export default function HomePage() {
  const { products, loading, error } = useGetAllProducts(); 

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
      name: 'Scan & Shop',
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
    <div className="bg-white min-h-screen">
     

      {/* Hero Section */}
      <main>
      <div className="relative isolate">
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
          >
            <defs>
              <pattern
                x="50%"
                y={-1}
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)" width="100%" height="100%" strokeWidth={0} />
          </svg>
          <div
            aria-hidden="true"
            className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
          >
            <div
              style={{
                clipPath:
                  'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
              }}
              className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
            />
          </div>
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="relative w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Simplifiez vos courses avec EpiDrive.
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                  Découvrez une nouvelle façon de faire vos courses en ligne. Scannez vos plats, reconnaissez instantanément les ingrédients, et faites vos achats en un clic. EpiDrive, c'est la rapidité, la simplicité et la fraîcheur, livrés directement chez vous.
                  </p>
                  <div className="mt-10 flex items-center gap-x-6">
                    <a
                      href="#"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Catalogues
                    </a>
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                      Démo <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
                <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <div className="relative">
                      <Image
                        alt=""
                        src={foodPresentation}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <Image
                        alt=""
                        src={groceryDrive}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <Image
                        alt=""
                        src={scanFood}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <Image
                        alt=""
                        src={whatIWant}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <Image
                        alt=""
                        src={epiDrive}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <RecommendedProducts allProducts={products} />

       
            {/* Featured Products Section */}
        <div className="relative bg-white py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-md px-6 text-center sm:max-w-3xl lg:max-w-7xl lg:px-8">
              <h2 className="text-lg font-semibold text-cyan-600">Plaisir & Praticité</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Les avantages EpiDrive : Des courses innovantes à portée de clic
              </p>
              <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
              Découvrez les fonctionnalités qui font d'EpiDrive votre choix de référence pour des courses simples, rapides et intelligentes.
              </p>
              <div className="mt-12">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {features.map((feature) => (
                    <div key={feature.name} className="pt-6">
                      <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                        <div className="-mt-6">
                          <div>
                            <span className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-teal-500 to-cyan-600 p-3 shadow-lg">
                              <feature.icon aria-hidden="true" className="h-6 w-6 text-white" />
                            </span>
                          </div>
                          <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">{feature.name}</h3>
                          <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
         


        <div className="mx-auto max-w-2xl divide-y divide-gray-900/10 px-6 pb-8 sm:pb-24 sm:pt-12 lg:max-w-7xl lg:px-8 lg:pb-32">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
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

      

          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 pb-16 lg:relative lg:z-10 lg:pb-0">
            <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-8 lg:px-8">
              <div className="relative lg:-my-8">
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1/2 bg-white lg:hidden" />
                <div className="mx-auto max-w-md px-6 sm:max-w-3xl lg:h-full lg:p-0">
                  <div className="aspect-h-6 aspect-w-10 overflow-hidden rounded-xl shadow-xl sm:aspect-h-7 sm:aspect-w-16 lg:aspect-none lg:h-full">
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80"
                      className="object-cover lg:h-full lg:w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-12 lg:col-span-2 lg:m-0 lg:pl-8">
                <div className="mx-auto max-w-md px-6 sm:max-w-2xl lg:max-w-none lg:px-0 lg:py-20">
                  <blockquote>
                    <div>
                      <svg
                        fill="currentColor"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                        className="h-12 w-12 text-white opacity-25"
                      >
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="mt-6 text-2xl font-medium text-white">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed urna nulla vitae laoreet augue.
                        Amet feugiat est integer dolor auctor adipiscing nunc urna, sit.
                      </p>
                    </div>
                    <footer className="mt-6">
                      <p className="text-base font-medium text-white">Judith Black</p>
                      <p className="text-base font-medium text-cyan-100">CEO at PureInsights</p>
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>

        {/* CTA Section */}
        <section className="bg-indigo-600 py-16 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Get Started with EpiDrive Today!</h2>
          <p className="mb-8">Fast delivery, fresh products, and the best online shopping experience.</p>
          <a
            href="/shop"
            className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100"
          >
            Start Shopping
          </a>
        </section>
      </main>
    </div>
  );
}
