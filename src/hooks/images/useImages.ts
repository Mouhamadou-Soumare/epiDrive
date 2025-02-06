import { useState, useEffect } from "react";

// Définition des types
interface Image {
  id: number;
  path: string;
}

interface FetchError {
  message: string;
}

// Hook pour récupérer toutes les images
export function useGetImages() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch("/api/images");
        const data: Image[] = await res.json();
        if (res.ok) {
          setImages(data);
        } else {
          setError((data as unknown as FetchError).message || "Failed to fetch images");
        }
      } catch (err) {
        setError((err as Error).message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  return { images, loading, error };
}

// Hook pour récupérer une image spécifique
export function useGetImage(imageId: number | null) {
  const [image, setImage] = useState<Image | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageId) return;

    async function fetchImage() {
      try {
        const res = await fetch(`/api/images/${imageId}`);
        const data: Image = await res.json();
        if (res.ok) {
          setImage(data);
        } else {
          setError((data as unknown as FetchError).message || "Failed to fetch image");
        }
      } catch (err) {
        setError((err as Error).message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchImage();
  }, [imageId]);

  return { image, loading, error };
}

// Hook pour ajouter une nouvelle image
export function useAddImage() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function addImage(path: string): Promise<Image | void> {
    setIsSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      const data: Image = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        return data; // Retourner l'image créée
      } else {
        setError((data as unknown as FetchError).message || "Failed to create image");
      }
    } catch (err) {
      setError((err as Error).message || "An error occurred");
    }
  }

  return { addImage, isSuccess, error };
}

// Hook pour mettre à jour une image existante
export function useUpdateImage() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function updateImage(imageId: number, path: string): Promise<Image | void> {
    setIsSuccess(false);
    setError(null);

    try {
      const res = await fetch(`/api/images/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      const data: Image = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        return data; // Retourner l'image mise à jour
      } else {
        setError((data as unknown as FetchError).message || "Failed to update image");
      }
    } catch (err) {
      setError((err as Error).message || "An error occurred");
    }
  }

  return { updateImage, isSuccess, error };
}

// Hook pour supprimer une image
export function useDeleteImage() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteImage(imageId: number): Promise<string | void> {
    setIsSuccess(false);
    setError(null);

    try {
      const res = await fetch(`/api/images/${imageId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        return data.message; // Retourner le message de suppression
      } else {
        setError((data as unknown as FetchError).message || "Failed to delete image");
      }
    } catch (err) {
      setError((err as Error).message || "An error occurred");
    }
  }

  return { deleteImage, isSuccess, error };
}
