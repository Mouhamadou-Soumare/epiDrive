import { useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const sortOptions = [
  { id: 'relevance', name: 'Pertinence' },
  { id: 'name', name: 'Nom' },
  { id: 'price-asc', name: 'Prix croissant' },
  { id: 'price-desc', name: 'Prix décroissant' },
];

interface SortDropdownProps {
  sortOption: string;
  setSortOption: (option: string) => void;
}

export default function SortDropdown({ sortOption, setSortOption }: SortDropdownProps) {
  const selectedOption = sortOptions.find((option) => option.id === sortOption);

  return (
    <Listbox value={selectedOption} onChange={(option) => setSortOption(option.id)}>
      <Listbox.Label className="block text-sm font-medium text-gray-700">Trier par</Listbox.Label>
      <div className="relative mt-2">
  <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-sm">
          <span className="block truncate">{selectedOption?.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
          </span>
        </ListboxButton>

        <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {sortOptions.map((option) => (
            <ListboxOption
              key={option.id}
              value={option}
              className="group relative cursor-default select-none py-2 pl-8 pr-4 text-gray-900 hover:bg-orange-600 hover:text-white"
            >
              <span className="block truncate font-normal group-data-[selected]:font-semibold">{option.name}</span>

              {selectedOption?.id === option.id && (
                <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-orange-600 group-data-[selected]:text-orange group-data-[focus]:text-orange">
                  <CheckIcon aria-hidden="true" className="h-5 w-5" />
                </span>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
