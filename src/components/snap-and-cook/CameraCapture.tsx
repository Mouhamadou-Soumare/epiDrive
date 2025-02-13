"use client";

import { useRef, useState } from "react";

type CameraCaptureProps = {
  onImageCaptured: (imageData: string) => void;
};

export default function CameraCapture({ onImageCaptured }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [streaming, setStreaming] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch (error) {
      console.error("Erreur lors de l'accès à la caméra :", error);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL("image/png");
      onImageCaptured(imageData);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        onImageCaptured(imageData); 
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline className="w-full max-h-60 mb-4" />
      {!streaming ? (
        <button onClick={startCamera} className="px-4 py-2 button-primary text-white rounded-md">
          Activer la caméra
        </button>
      ) : (
        <button onClick={capturePhoto} className="px-4 py-2 bg-green-600 text-white rounded-md">
          Prendre une photo
        </button>
      )}
      <div className="mt-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">Importer une image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
        />
      </div>
    </div>
  );
}
