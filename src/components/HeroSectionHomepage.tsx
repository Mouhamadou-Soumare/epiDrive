'use client';

import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import epiDriveLogo from '/public/img/Epidrive.webp';
import CategoriesCard from '../components/client/modules/CategoryCardProps'

const navigation = [
  { name: 'Notre Vision', href: '#vision' },
  { name: 'Services', href: '#services' },
  { name: 'Partenaires Locaux', href: '#partners' },
  { name: 'Contactez-nous', href: '#contact' },
];

export default function HeroSectionHomepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white">
      <div className="relative isolate pt-14">
        {/* Top Blur Background */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ee9b00] to-[#f0a963] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        {/* Content Section */}
        <div className=" lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 herosectionHome">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
              Epidrive: <span className="title-primary">Vos courses réinventées </span>
              </h1>
              <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl">
              Découvrez des produits locaux, simplifiez vos achats, gagnez du temps.</p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="/"
                  className="rounded-md button-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Commencez dès maintenant
                </a>
              </div>

              <CategoriesCard/>

            </div>
          </div>
        </div>

        {/* Bottom Blur Background */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ee9b00] to-[#f2e1cf] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        
      </div>
    </div>
  );
}
