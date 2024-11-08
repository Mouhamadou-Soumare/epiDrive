interface ImageDisplayProps {
    src: string;
    alt: string;
  }
  
  const ImageDisplay: React.FC<ImageDisplayProps> = ({ src, alt }) => (
    <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg h-96">
      <img src={src} alt={alt} className="h-full w-full object-cover object-center" />
    </div>
  );
  
  export default ImageDisplay;
  