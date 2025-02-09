interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  aria_label: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchQuery, onSearchChange, placeholder, aria_label }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={searchQuery}
    onChange={onSearchChange}
    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
    aria-label={aria_label}
  />
);

export default SearchInput;
