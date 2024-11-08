interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchQuery, onSearchChange, placeholder }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={searchQuery}
    onChange={onSearchChange}
    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md"
  />
);

export default SearchInput;
