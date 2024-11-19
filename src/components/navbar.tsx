"use client";

import Image from "next/image";
import logoWhite from "../../public/img/logo_white_bg.png";
import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
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
  const { categories, loading: categoriesLoading, error } = useGetMainCategories();
  const [open, setOpen] = useState(false); 
  const [cartOpen, setCartOpen] = useState(false);
  const { cartItems, loading: cartLoading  } = useGetCart(); 

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantite, 0);

  const mesCoursesCategories = [
    "Produits régionaux et locaux",
    "Bio et Ecologie",
    "Pains et Pâtisseries",
    "Marché frais",
    "Boucherie, Volailles et Poissons",
    "Épicerie Salée"
  ];

  const mesCourses = categories.filter((category) =>
    mesCoursesCategories.includes(category.name)
  );

  const maisonLoisirs = categories.filter(
    (category) => !mesCoursesCategories.includes(category.name)
  );

  return (
    <header className="relative isolate z-10 bg-white">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <Image alt="" src={logoWhite} className="h-8 w-auto" />
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
              className={`inline-flex items-center gap-x-2 rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm 
              ${
                open

                  ? "bg-indigo-500 text-dark"
                  : "bg-orange-300 text-dark hover:bg-orange-500"
              } 
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              Rayons
              <ChevronDownIcon
                aria-hidden="true"
                className={`h-5 w-5 flex-none text-white ${
                  open ? "rotate-180 transform" : ""
                }`}
              />
            </Popover.Button>

            <PopoverPanel
              transition
              className="absolute inset-x-0 top-0 -z-10 bg-white pt-14 shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:-translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in rounded-lg	mt-20 w-11/12	mx-auto"
            >
              <div className="flex flex-rpw">
  {/* Première grid avec le titre "Mes courses" */}
  <div className="px-6 py-10 lg:px-8 pt-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes courses</h2>
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4  xl:gap-x-8">
    {mesCourses.map((category) => (
                        <div
                          key={category.slug}
                          className="group relative rounded-lg p-6 pl-0 text-sm leading-6 hover:bg-gray-50 flex items-center gap-5 pl-0 "
                        >
                           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-white ">
                           <Image
                            src={`/img/category/${category.slug}-nav.webp`}
                            alt={`Image de ${category.name}`}
                            width={44}
                            height={44}
                            className="object-cover rounded-lg"
                          />

           </div>
                          <a
                            href={`/category/${category.slug}`}
                            className=" block font-semibold text-gray-900"
                          >
                            {category.name}
                            <span className="absolute inset-0" />
                          </a>
                          <p className="mt-1 text-gray-600">{category.description}</p>
                        </div>
                      ))}
    </div>
  </div>

  {/* Deuxième grid avec le titre "Maison & loisirs" */}
  <div className="px-6 py-10 lg:px-8 pt-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Maison & loisirs</h2>
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-4  xl:gap-x-8">
      {maisonLoisirs.map((category) => (
        <div
          key={category.name}
          className="group relative rounded-lg p-6 text-sm leading-6 hover:bg-gray-50 flex items-center gap-5 pl-0"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-white">
          <Image
                            src={`/img/category/${category.slug}-nav.webp`}
                            alt={`Image de ${category.name}`}
                            width={44}
                            height={44}
                            className="object-cover rounded-lg"
                          />

          </div>
          <a
                            href={`/category/${category.slug}`}
                            className="block font-semibold text-gray-900"
          >
            {category.name}
            <span className="absolute inset-0" />
          </a>
          <p className="mt-1 text-gray-600">{category.description}</p>
        </div>
      ))}
    </div>
  </div>
</div>

              <div className="bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="grid grid-cols-3 divide-x divide-gray-900/5 border-x border-gray-900/5">
                    {callsToAction.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
                      >
                        <item.icon
                          aria-hidden="true"
                          className="h-5 w-5 flex-none text-gray-400"
                        />
                        {item.name}
                      </a>
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
        
          <SearchBar/>

          <button
            onClick={() => setCartOpen(true)} 
            className="relative -m-2 flex items-center p-2"
          >
            <ShoppingBagIcon aria-hidden="true" className={`h-7 w-7 flex-shrink-0 ${
              totalItems > 0 ? "text-yellow-500" : "text-orange-400 hover:text-gray-500"
            }`} />
            {totalItems > 0 && (
              <span className="ml-2 text-md font-medium text-gray-700 hover:text-gray-800">
                {totalItems}
              </span>
            )}            <span className="sr-only">Voir le panier</span>
          </button>
          
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="/auth/signin" className="text-sm font-semibold leading-6 text-gray-900">
          Se connecter
          <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>

      <CartSlideOver open={cartOpen} setOpen={setCartOpen} />

      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Image alt="" src={logoWhite} className="h-10 w-auto" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    Product
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="h-5 w-5 flex-none group-data-[open]:rotate-180"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...products, ...callsToAction].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Marketplace
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Company
                </a>
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>

    </header>
  );
}