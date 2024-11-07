// components/ProductImage.tsx
import { Image } from "../../../types";

interface ProductImageProps {
  image: Image | null;
  altText: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ image, altText }) => (
  <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg h-96 bg-gray-200">
    {image ? (
      <img src={image.path} alt={altText} className="h-full w-full object-cover object-center" />
    ) : (
      <div className="h-full w-full flex items-center justify-center text-gray-500">
        Aucune image disponible
      </div>
    )}
  </div>
);

export default ProductImage;
