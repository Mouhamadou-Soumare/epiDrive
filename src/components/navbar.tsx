"use client";

import Image from "next/image";
import logoWhite from "../../public/img/logo_white_bg.png";
import logoSnapAndCook from "../../public/img/scan.png";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
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
  ArrowRightIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  SquaresPlusIcon,
  TicketIcon,
  UserCircleIcon,
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
import { useCart } from "@/context/CartContext";

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
  { name: "Voir la démo", href: "#", icon: PlayCircleIcon },
  { name: "Contactez-nous", href: "#", icon: PhoneIcon },
  { name: "Voir toutes les catégories", href: "#", icon: RectangleGroupIcon },
];

const social = [
  {
    name: "Facebook",
    href: "#",
    icon: (p0: { "aria-hidden": string; className: string }) => (
      <svg
        className="svg-top-nav"
        viewBox="0 0 36 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.2539 34.9971C8.60603 34.9971 0.753906 27.1479 0.753906 17.4971C0.753906 7.8464 8.60603 0 18.2539 0C27.9018 0 35.7539 7.84926 35.7539 17.5C35.7539 27.1507 27.9046 35 18.2539 35V34.9971ZM18.2539 1.3268C9.33806 1.3268 2.08356 8.58129 2.08356 17.5C2.08356 26.4187 9.33806 33.6732 18.2539 33.6732C27.1698 33.6732 34.4271 26.4187 34.4271 17.5C34.4271 8.58129 27.1726 1.3268 18.2539 1.3268Z"
          fill="#bc6c25"
        ></path>
        <path
          d="M23.9299 16.3592L23.6582 18.3237C23.6125 18.6525 23.3036 18.8984 22.9348 18.8984H19.389V27.1108C19.0144 27.1423 18.637 27.1566 18.2538 27.1566C17.3988 27.1566 16.561 27.0794 15.7546 26.9336V18.8984H13.0267C12.775 18.8984 12.572 18.7126 12.572 18.4895V16.0304C12.572 15.8045 12.775 15.6215 13.0267 15.6215H15.7546V11.9356C15.7546 9.67375 17.7906 7.84082 20.3012 7.84082H23.4809C23.7326 7.84082 23.9356 8.02383 23.9356 8.24973V10.706C23.9356 10.9319 23.7326 11.1149 23.4809 11.1149H21.2076C20.204 11.1149 19.389 11.8498 19.389 12.7534V15.6215H23.2064C23.6439 15.6215 23.9842 15.9675 23.9299 16.3592Z"
          fill="#bc6c25"
        ></path>
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: () => (
      <svg
        className="svg-top-nav"
        viewBox="0 0 35 35"
        fill="#fffff"
        stroke="#fffff"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.5 34.9971C7.84926 34.9971 0 27.1479 0 17.5C0 7.85212 7.84926 0 17.5 0C27.1507 0 35 7.84926 35 17.5C35 27.1507 27.1507 35 17.5 35V34.9971ZM17.5 1.3268C8.58129 1.3268 1.3268 8.58129 1.3268 17.5C1.3268 26.4187 8.58129 33.6732 17.4971 33.6732C26.413 33.6732 33.6703 26.4187 33.6703 17.5C33.6703 8.58129 26.4158 1.3268 17.5 1.3268Z"
          fill="#bc6c25"
        ></path>
        <path
          d="M13.9658 11.5294C13.9658 12.6932 13.0117 13.6369 11.8348 13.6369C10.658 13.6369 9.70386 12.6932 9.70386 11.5294C9.70386 10.3656 10.658 9.422 11.8348 9.422C13.0117 9.422 13.9658 10.3656 13.9658 11.5294Z"
          fill="#bc6c25"
        ></path>
        <path
          d="M13.451 25.5753H10.2184C10.1316 25.5753 10.0593 25.5038 10.0593 25.418V15.1954C10.0593 15.1096 10.1316 15.0381 10.2184 15.0381H13.451C13.5377 15.0381 13.61 15.1096 13.61 15.1954V25.418C13.61 25.5038 13.5377 25.5753 13.451 25.5753Z"
          fill="#bc6c25"
        ></path>
        <path
          d="M25.6849 18.904V24.8745C25.6849 25.2606 25.364 25.578 24.9736 25.578H22.8426C22.4523 25.578 22.1313 25.2606 22.1313 24.8745V19.9591C22.1313 18.9897 21.3362 18.2034 20.356 18.2034C19.3758 18.2034 18.5807 18.9897 18.5807 19.9591V24.8745C18.5807 25.2606 18.2597 25.578 17.8694 25.578H15.7384C15.348 25.578 15.0271 25.2606 15.0271 24.8745V15.7442C15.0271 15.3582 15.348 15.0408 15.7384 15.0408H17.8694C18.2597 15.0408 18.5807 15.3582 18.5807 15.7442V16.1932C19.292 15.2839 20.4659 14.6891 21.7757 14.6891C23.7361 14.6891 25.682 16.0931 25.682 18.904"
          fill="#bc6c25"
        ></path>
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "#",
    icon: () => (
      <svg
        className="svg-top-nav"
        viewBox="0 0 36 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.5171 34.9971C7.86922 34.9971 0.0170898 27.1479 0.0170898 17.4971C0.0170898 7.8464 7.86636 0 17.5171 0C27.1678 0 35.0171 7.84926 35.0171 17.5C35.0171 27.1507 27.1678 35 17.5171 35V34.9971ZM17.5171 1.3268C8.60124 1.3268 1.34389 8.58129 1.34389 17.5C1.34389 26.4187 8.59838 33.6732 17.5171 33.6732C26.4358 33.6732 33.6874 26.4187 33.6874 17.5C33.6874 8.58129 26.4329 1.3268 17.5171 1.3268Z"
          fill="#bc6c25"
        ></path>
        <path
          d="M19.7734 18.1062L15.8645 20.0593C15.4127 20.2852 14.8837 19.9563 14.8837 19.4531V15.5441C14.8837 15.0409 15.4156 14.712 15.8645 14.9379L19.7734 16.8938C20.2738 17.1426 20.2738 17.8575 19.7734 18.1062ZM24.5459 10.5858H10.4858C9.09611 10.5858 7.96948 11.7124 7.96948 13.1022V21.8979C7.96948 23.2876 9.09611 24.4142 10.4858 24.4142H24.5459C25.9356 24.4142 27.0622 23.2876 27.0622 21.8979V13.1022C27.0622 11.7124 25.9356 10.5858 24.5459 10.5858Z"
          fill="#bc6c25"
        ></path>
      </svg>
    ),
  },
  {
    name: "X",
    href: "#",
    icon: () => (
      <svg
        className="svg-top-nav"
        viewBox="0 0 36 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.7315 34.9971C8.08357 34.9971 0.231445 27.1479 0.231445 17.4971C0.231445 7.8464 8.08071 0 17.7315 0C27.3822 0 35.2314 7.84926 35.2314 17.5C35.2314 27.1507 27.3822 35 17.7315 35V34.9971ZM17.7315 1.3268C8.8156 1.3268 1.55825 8.58129 1.55825 17.5C1.55825 26.4187 8.81274 33.6732 17.7315 33.6732C26.6502 33.6732 33.9047 26.4187 33.9047 17.5C33.9047 8.58129 26.6502 1.3268 17.7315 1.3268Z"
          fill="#bc6c25"
        ></path>
        <path
          d="M11.6921 10.7374H14.0883L23.7705 24.2599H21.3743L11.6921 10.7374ZM24.1966 8.91595L19.0009 14.4719L15.0234 8.91595H8.14917L15.1091 18.6353L8.14917 26.0785H10.6627L16.1986 20.1565L20.4363 26.0785H27.3105L20.0903 15.9932L26.7072 8.91309H24.1937L24.1966 8.91595Z"
          fill="#bc6c25"
        ></path>
      </svg>
    ),
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    categories,
    loading: categoriesLoading,
    error,
  } = useGetMainCategories();
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartItems, loading: cartLoading } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: session, status } = useSession({
    required: false,
  });
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
    <header className="relative isolate z-10 ">
      <div aria-label="Top">
        {/* Top navigation */}
        <div className="bg-gray-900">
          <div className="mx-auto min-h-11 flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex gap-x-4 ">
              {social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-800 min-w-6"
                >
                  <span className="sr-only">{item.name}</span>
                  {item.icon({ "aria-hidden": "true", className: "size-6" })}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <p className="flex-1 text-base text-sm  a-primary font-bold lg:flex-none">
                5€ offerts dès 50€ d'achat avec le code FIRST
              </p>{" "}
              <TicketIcon className="max-w-6 ticket-svg-top-nav" />{" "}
            </div>

            <div></div>
          </div>
        </div>
      </div>
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <Image alt="" src={logoWhite} className="h-10 w-auto" />
          </a>
        </div>
        <div className="flex items-center lg:hidden space-x-4">
          {/* 🔍 Icône Search : Passe en champ input avec transition fluide */}
          <div className="relative flex items-center">
            {!searchOpen ? (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 transition-transform duration-300 ease-in-out hover:scale-110"
              >
                <MagnifyingGlassIcon className="h-7 w-7 text-gray-700 hover:text-gray-900" />
              </button>
            ) : (
              <div className="fixed top-0 left-0 z-50 w-full bg-white shadow-md px-4 py-3 flex items-center space-x-2">
                <div className="flex-grow">
                  <SearchBar />
                </div>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 transition-transform duration-300 ease-in-out hover:scale-110"
                >
                  <XMarkIcon className="h-7 w-7 text-gray-600 hover:text-gray-900" />
                </button>
              </div>
            )}
          </div>

          {/* 🛒 Panier avec badge dynamique */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 transition-transform duration-300 ease-in-out hover:scale-110"
          >
            <ShoppingCartIcon className="h-7 w-7 text-orange-400 hover:text-gray-500" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {totalItems}
              </span>
            )}
          </button>

          {/* 👤 Connexion/Déconnexion */}
          {status === "loading" ? (
            <div className="text-gray-500">Chargement...</div>
          ) : session ? (
            <button
              onClick={() => signOut()}
              className="p-2 hover:scale-110 transition-transform"
            >
              <UserCircleIcon className="h-7 w-7 text-indigo-500" />
            </button>
          ) : (
            <a
              href="/auth/signin"
              className="p-2 hover:scale-110 transition-transform"
            >
              <UserCircleIcon className="h-7 w-7 text-gray-500" />
            </a>
          )}

          {/* 🍔 Icône Menu Mobile */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 transition-transform duration-300 ease-in-out hover:scale-110"
          >
            <Bars3Icon className="h-7 w-7 text-gray-700 hover:text-gray-900" />
          </button>
        </div>

        <PopoverGroup className="hidden lg:flex lg:gap-x-6 items-center">
          <Popover>
            <Popover.Button
              type="button"
              className={`inline-flex items-center gap-x-2 rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm 
              ${
                open
                  ? "bg-indigo-500 text-dark"
                  : "button-secondary text-dark hover:button-primary"
              } 
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              Rayons
              <Bars3Icon
                aria-hidden="true"
                className={`h-5 w-5 flex-none text-dark ${
                  open ? "rotate-180 transform" : ""
                }`}
              />
            </Popover.Button>

            <PopoverPanel
              transition
              className="absolute inset-x-0 top-0 -z-10 bg-white pt-14 shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:-translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in rounded-lg	mt-navbar w-11/12	mx-auto"
            >
              <div className="flex flex-rpw">
                {/* Première grid avec le titre "Mes courses" */}
                <div className="px-6 py-10 lg:px-8 pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Mes courses
                  </h2>
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
                        <p className="mt-1 text-gray-600">
                          {category.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deuxième grid avec le titre "Maison & loisirs" */}
                <div className="px-6 py-10 lg:px-8 pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Maison & loisirs
                  </h2>
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
                        <p className="mt-1 text-gray-600">
                          {category.description}
                        </p>
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
          <a
            href="/snap-and-cook"
            className="flex items-center gap-2 px-4 py-2.5  text-dark rounded-lg transition-colors duration-200 min-w-40 text-nav-hover"
          >
            <svg
              className="max-w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
            >
              <path d="M13 26H7.16A1.16 1.16 0 0 1 6 24.84V19a1 1 0 0 0-2 0v5.84A3.17 3.17 0 0 0 7.16 28H13a1 1 0 0 0 0-2zM27 18a1 1 0 0 0-1 1v5.84A1.16 1.16 0 0 1 24.84 26H19a1 1 0 0 0 0 2h5.84A3.17 3.17 0 0 0 28 24.84V19a1 1 0 0 0-1-1zM19 6h5.84A1.16 1.16 0 0 1 26 7.16V13a1 1 0 0 0 2 0V7.16A3.17 3.17 0 0 0 24.84 4H19a1 1 0 0 0 0 2zM5 14a1 1 0 0 0 1-1V7.16A1.16 1.16 0 0 1 7.16 6H13a1 1 0 0 0 0-2H7.16A3.17 3.17 0 0 0 4 7.16V13a1 1 0 0 0 1 1z" />
              <path d="M23 14a1 1 0 0 0 1-1v-1.84A3.17 3.17 0 0 0 20.84 8h-9.68A3.17 3.17 0 0 0 8 11.16V13a1 1 0 0 0 2 0v-1.84A1.16 1.16 0 0 1 11.16 10h9.68A1.16 1.16 0 0 1 22 11.16V13a1 1 0 0 0 1 1zM9 18a1 1 0 0 0-1 1v1.84A3.17 3.17 0 0 0 11.16 24h9.68A3.17 3.17 0 0 0 24 20.84V19a1 1 0 0 0-2 0v1.84A1.16 1.16 0 0 1 20.84 22h-9.68A1.16 1.16 0 0 1 10 20.84V19a1 1 0 0 0-1-1zM29 15H3a1 1 0 0 0 0 2h26a1 1 0 0 0 0-2z" />
            </svg>

            <p>Snap & Cook</p>
          </a>

          <SearchBar />

          <button
            onClick={() => setCartOpen(true)}
            className="relative -m-2 flex items-center p-2"
          >
            <ShoppingCartIcon
              aria-hidden="true"
              className={`h-7 w-7 flex-shrink-0 ${
                totalItems > 0
                  ? "text-yellow-500"
                  : "text-orange-400 hover:text-gray-500"
              }`}
            />
            {totalItems > 0 && (
              <span className="ml-2 text-md font-medium text-gray-700 hover:text-gray-800">
                {totalItems}
              </span>
            )}

            <span className="sr-only">Voir le panier</span>
          </button>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {/* Loader uniquement pendant le chargement de la session */}
            {status === "loading" ? (
              <div className="text-gray-500">Chargement...</div>
            ) : session ? (
              <div className="flex items-center gap-2">
                <UserCircleIcon className="h-8 w-8 text-indigo-500" />
                <span className="font-medium text-gray-800">
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2.5 text-dark rounded-lg hover:bg-red-50"
                >
                  <ArrowRightIcon className="h-6 w-6 text-red-500" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <a
                href="/auth/signin"
                className="flex items-center gap-2 px-4 py-2.5 text-dark rounded-lg hover:text-indigo-700"
              >
                <ArrowRightIcon className="h-6 w-6" />
                <span>Se connecter</span>
              </a>
            )}
          </div>
        </PopoverGroup>
      </nav>

      <CartSlideOver open={cartOpen} setOpen={setCartOpen} />

      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <Image alt="Logo" src={logoWhite} className="h-10 w-auto" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-10">
            <div className="mt-6">
              <h2 className="font-semibold text-gray-700">Mes Courses</h2>
              <ul>
                {mesCourses.map((category) => (
                  <li key={category.slug} className="mt-2">
                    <a
                      href={`/category/${category.slug}`}
                      className="text-gray-600 hover:underline"
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
              <h2 className="mt-6 font-semibold text-gray-700">
                Maison & Loisirs
              </h2>
              <ul>
                {maisonLoisirs.map((category) => (
                  <li key={category.slug} className="mt-2">
                    <a
                      href={`/category/${category.slug}`}
                      className="text-gray-600 hover:underline"
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
