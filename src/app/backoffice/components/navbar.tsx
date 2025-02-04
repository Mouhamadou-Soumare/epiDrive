'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react'
import { Bars3Icon, BellIcon, ChartPieIcon, Cog6ToothIcon, FolderIcon, HomeIcon, Squares2X2Icon, UsersIcon, XMarkIcon, CakeIcon } from '@heroicons/react/24/outline'
import logo from "../../../../public/img/logo_white_bg.png"

import Link from 'next/link';

const initialNavigation = [
  { name: 'Dashboard', href: '/backoffice', icon: HomeIcon, current: true },
  { name: 'Utilisateurs', href: '/backoffice/utilisateur', icon: UsersIcon, current: false },
  { name: 'Produits', href: '/backoffice/product', icon: Squares2X2Icon, current: false },
  { name: 'Recettes', href: '/backoffice/recette', icon: CakeIcon, current: false },
  { name: 'Commandes', href: '/backoffice/commande', icon: ChartPieIcon, current: false },
  { name: 'Catégories', href: '/backoffice/categorie', icon: FolderIcon, current: false },
  { name: 'Ingredients', href: '/backoffice/ingredient', icon: BellIcon, current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navigation, setNavigation] = useState(initialNavigation);

  // Mise à jour dynamique de la propriété `current`
  useEffect(() => {
    const updatedNavigation = initialNavigation.map((item) => ({
      ...item,
      current: window.location.pathname === item.href,
    }));
    setNavigation(updatedNavigation);
    
  }, []);

  return (
    <div>
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
                </button>
              </div>
            </TransitionChild>
            
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
              <Link href={"/"} className="flex h-16 shrink-0 items-center">
                <Image
                  alt="Your Company"
                  src={logo}
                  className="h-8 w-auto"
                />
              </Link>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-gray-50 text-indigo-600'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className={classNames(
                                item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                'h-6 w-6 shrink-0',
                              )}
                            />
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="mt-auto">
                    <a
                      href="#"
                      className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    >
                      <Cog6ToothIcon
                        aria-hidden="true"
                        className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                      />
                      Settings
                    </a>

                    <a
                      href="#"
                      className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    >
                      <BellIcon
                        aria-hidden="true"
                        className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                      />
                      Notifications
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for mobile */}
      <div className="lg:hidden mb:hidden sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon aria-hidden="true" className="h-6 w-6" />
        </button>

        {/* Separator */}
        <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden" />

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <Link href={"/"} className="flex h-16 shrink-0 items-center">
            <Image
              alt="Your Company"
              src={logo}
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */} 
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <Link href={"/"} className="flex h-16 shrink-0 items-center">
            <Image
              alt="Your Company"
              src={logo}
              className="h-8 w-auto"
            />
          </Link>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gray-50 a-primary'
                            : 'text-gray-700 hover:bg-gray-50 a-primary-hover',
                          'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                        )}
                      >
                        <item.icon
                          aria-hidden="true"
                          className={classNames(
                            item.current ? 'a-primary' : 'text-gray-400 ',
                            'h-6 w-6 shrink-0',
                          )}
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <a
                  href="#"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 a-primary-hover"
                >
                  <Cog6ToothIcon
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0 "
                  />
                  Settings
                </a>

                <a
                  href="#"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 a-primary-hover"
                >
                  <BellIcon
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0 text-gray-400 "
                  />
                  Notifications
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
