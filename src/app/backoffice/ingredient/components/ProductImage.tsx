import Image from "next/image";
import { Image as ImageType } from "../../../../../types";

interface ProductImageProps {
  image: ImageType | null;
  altText: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ image, altText }) => (
  <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg h-96 bg-gray-200 relative">
    {image ? (
      <Image 
        src={image.path} 
        alt={altText} 
          className="h-full w-full object-cover object-center" 
        priority // Si important pour le chargement initial
      />
    ) : (
      <div className="h-full w-full flex items-center justify-center text-gray-500">
        Aucune image disponible
      </div>
    )}
  </div>
);

export default ProductImage;
