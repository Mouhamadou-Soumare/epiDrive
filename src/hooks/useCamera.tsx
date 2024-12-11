"use client";

import { useRef, useState } from "react";
import { CameraError } from "@/lib/errors";

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [streaming, setStreaming] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch (error) {
      throw new CameraError("Erreur lors de l'accès à la caméra");
    }
  };

  const stopCamera = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setStreaming(false);
    }
  };

  return {
    videoRef,
    streaming,
    startCamera,
    stopCamera
  };
};