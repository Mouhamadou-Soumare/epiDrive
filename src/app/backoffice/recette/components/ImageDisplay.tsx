import Image from "next/image";
import { useState } from "react";

interface ImageDisplayProps {
  src: string;
  alt: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ src, alt }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg h-96 bg-gray-200 flex items-center justify-center">
      {imageError ? (
        <p className="text-gray-500 text-sm">Image non disponible</p>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center rounded-lg"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
};

export default ImageDisplay;
