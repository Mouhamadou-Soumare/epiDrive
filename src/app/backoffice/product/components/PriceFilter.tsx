interface PriceFilterProps {
    minPrice: number | '';
    maxPrice: number | '';
    onMinPriceChange: (value: number | '') => void;
    onMaxPriceChange: (value: number | '') => void;
}
  
const PriceFilter: React.FC<PriceFilterProps> = ({ minPrice, maxPrice, onMinPriceChange, onMaxPriceChange }) => {
    return (
      <>
        <input
          type="number"
          placeholder="Prix min"
          value={minPrice}
          onChange={e => onMinPriceChange(parseFloat(e.target.value) || '')}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md"
        />
        <input
          type="number"
          placeholder="Prix max"
          value={maxPrice}
          onChange={e => onMaxPriceChange(parseFloat(e.target.value) || '')}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md"
        />
      </>
    );
  };
  
export default PriceFilter;
  