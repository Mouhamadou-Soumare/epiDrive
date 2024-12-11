"use client";

import { useCamera } from "@/hooks/useCamera";
import { captureImageFromVideo, handleFileUpload } from "@/utils/imageUtils";
import { CameraButton } from "./CameraButton";
import { FileUpload } from "./FileUpload";

type CameraCaptureProps = {
  onImageCaptured: (imageData: string) => void;
};

export default function CameraCapture({ onImageCaptured }: CameraCaptureProps) {
  const { videoRef, streaming, startCamera, stopCamera } = useCamera();

  const handleCapture = () => {
    if (videoRef.current) {
      try {
        const imageData = captureImageFromVideo(videoRef.current);
        onImageCaptured(imageData);
        stopCamera();
      } catch (error) {
        console.error("Erreur lors de la capture:", error);
      }
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const imageData = await handleFileUpload(file);
        onImageCaptured(imageData);
      } catch (error) {
        console.error("Erreur lors du chargement du fichier:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-h-60 mb-4 rounded-lg"
      />
      
      <CameraButton
        streaming={streaming}
        onStartCamera={startCamera}
        onCapture={handleCapture}
      />
      
      <FileUpload onChange={handleFileChange} />
    </div>
  );
}