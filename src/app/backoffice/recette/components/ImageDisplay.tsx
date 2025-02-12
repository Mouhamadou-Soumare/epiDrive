import Image from "next/image";
import { useState } from "react";

interface ImageDisplayProps {
  src: string;
  alt: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ src, alt }) => {
  return (
    <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg h-96 bg-gray-200">
      <img src={src} alt={alt} className="h-full w-full object-cover object-center" />
    </div>
  );
};

export default ImageDisplay;
