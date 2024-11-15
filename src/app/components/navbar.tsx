// app/components/Navbar.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  CameraIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  ShoppingBagIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
  RectangleGroupIcon,
} from "@heroicons/react/20/solid";
import SearchBar from "./SearchBar";
import { useGetMainCategories } from "@/hooks/categories/useGetMainCategories";
import CartSlideOver from "./client/product/cart/CartSlideOver";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { signIn, signOut, useSession } from "next-auth/react"; // Importer les fonctions de next-auth

const products = [
  {
    name: "Analytics",
    description: "Get a better understanding where your traffic is coming from",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers with our engagement tool",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Security",
    description: "Your customers’ data will be safe and secure",
    href: "#",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations",
    description: "Your customers’ data will be safe and secure",
    href: "#",
    icon: SquaresPlusIcon,
  },
];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
  { name: "View all products", href: "#", icon: RectangleGroupIcon },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  let session;

  try {
    const { data } = useSession(); // Essayez d'obtenir la session
    session = data;
  } catch {
    session = null; // Gestion d'erreur si useSession() est utilisé hors du contexte de <SessionProvider />
  }

  const { categories, loading: categoriesLoading, error } = useGetMainCategories();
  const { cartItems, loading: cartLoading } = useGetCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantite, 0);

  const mesCoursesCategories = [
    "Produits régionaux et locaux",
    "Bio et Ecologie",
    "Pains et Pâtisseries",
    "Marché frais",
    "Boucherie, Volailles et Poissons",
    "Épicerie Salée",
  ];

  const mesCourses = categories.filter((category) =>
    mesCoursesCategories.includes(category.name)
  );

  const maisonLoisirs = categories.filter(
    (category) => !mesCoursesCategories.includes(category.name)
  );

  return (
    <header className="relative isolate z-10 bg-white">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <div className="h-8 w-auto">
              {/* SVG intégré */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" className="h-8">
                <g>
                  <g>
                    <path d="M48.3515625,26.4202862c1.8193359,0,3.5742188-0.9208984,5.1132813-1.7285156..."></path>
                  </g>
                </g>
                <text
                  x="0"
                  y="79"
                  fill="#000"
                  fontSize="5px"
                  fontWeight="bold"
                  fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
                >
                  Created by Asheeqa
                </text>
                <text
                  x="0"
                  y="84"
                  fill="#000"
                  fontSize="5px"
                  fontWeight="bold"
                  fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
                >
                  from the Noun Project
                </text>
              </svg>
            </div>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12 items-center">
          <Popover>
            <Popover.Button
              type="button"
              className={`inline-flex items-center gap-x-2 rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm ${
                open ? "bg-indigo-500 text-dark" : "bg-orange-300 text-dark hover:bg-orange-500"
              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              Rayons
              <ChevronDownIcon aria-hidden="true" className={`h-5 w-5 flex-none text-white ${open ? "rotate-180 transform" : ""}`} />
            </Popover.Button>
            <PopoverPanel
              className="absolute inset-x-0 top-0 -z-10 bg-white pt-14 shadow-lg ring-1 ring-gray-900/5 transition-transform rounded-lg mt-20 w-11/12 mx-auto"
            >
              <div className="flex">
                {/* Première grid */}
                <div className="px-6 py-10 lg:px-8 pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes courses</h2>
                  <div className="grid grid-cols-2 gap-x-4">
                    {mesCourses.map((category) => (
                      <div key={category.slug} className="group relative rounded-lg p-6 hover:bg-gray-50 flex gap-5">
                        <div className="h-9 w-9 bg-gray-100 group-hover:bg-white flex items-center justify-center rounded-lg">
                          <img
                            src={`/img/category/${category.slug}-nav.webp`}
                            alt={`Image de ${category.name}`}
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <a href={`/category/${category.slug}`} className="block font-semibold text-gray-900">
                          {category.name}
                          <span className="absolute inset-0" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Deuxième grid */}
                <div className="px-6 py-10 lg:px-8 pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Maison & loisirs</h2>
                  <div className="grid grid-cols-1 gap-x-4">
                    {maisonLoisirs.map((category) => (
                      <div key={category.name} className="group relative rounded-lg p-6 hover:bg-gray-50 flex gap-5">
                        <div className="h-11 w-11 bg-gray-100 group-hover:bg-white flex items-center justify-center rounded-lg">
                          <img
                            src={`/img/category/${category.slug}-nav.webp`}
                            alt={`Image de ${category.name}`}
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <a href={`/category/${category.slug}`} className="block font-semibold text-gray-900">
                          {category.name}
                          <span className="absolute inset-0" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverPanel>
          </Popover>
          <a href="/snap-and-cook" className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-200">
            <CameraIcon className="h-6 w-6" />
            Snap & Cook
          </a>
          <SearchBar />
          <button onClick={() => setCartOpen(true)} className="relative -m-2 flex items-center p-2">
            <ShoppingBagIcon className={`h-7 w-7 ${totalItems > 0 ? "text-yellow-500" : "text-orange-400 hover:text-gray-500"}`} />
            {totalItems > 0 && <span className="ml-2 text-md font-medium">{totalItems}</span>}
          </button>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {session ? (
            <button onClick={() => signOut()} className="text-sm font-semibold">
              Sign out &rarr;
            </button>
          ) : (
            <button onClick={() => signIn()} className="text-sm font-semibold">
              Log in &rarr;
            </button>
          )}
        </div>
      </nav>
      <CartSlideOver open={cartOpen} setOpen={setCartOpen} />
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <div className="h-10 w-auto">
                {/* SVG du logo */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" className="h-10">
                  <g>
                    <g>
                      <path d="M48.3515625,26.4202862c1.8193359,0,3.5742188-0.9208984,5.1132813-1.7285156..."></path>
                    </g>
                  </g>
                </svg>
              </div>
            </a>
            <button type="button" onClick={() => setMobileMenuOpen(false)} className="-m-2.5 rounded-md p-2.5 text-gray-700">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure>
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold hover:bg-gray-50">
                    Product
                    <ChevronDownIcon className="h-5 w-5 group-data-[open]:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...products, ...callsToAction].map((item) => (
                      <DisclosureButton key={item.name} as="a" href={item.href} className="block rounded-lg py-2 pl-6 pr-3 font-semibold hover:bg-gray-50">
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <a href="#" className="block rounded-lg px-3 py-2 text-base font-semibold hover:bg-gray-50">
                  Features
                </a>
                <a href="#" className="block rounded-lg px-3 py-2 text-base font-semibold hover:bg-gray-50">
                  Marketplace
                </a>
                <a href="#" className="block rounded-lg px-3 py-2 text-base font-semibold hover:bg-gray-50">
                  Company
                </a>
              </div>
              <div className="py-6">
                <button onClick={() => (session ? signOut() : signIn())} className="block rounded-lg px-3 py-2.5 text-base font-semibold hover:bg-gray-50">
                  {session ? "Sign out" : "Log in"}
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
