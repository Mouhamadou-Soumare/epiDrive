import { useState, useEffect } from "react";

// Hook pour récupérer toutes les images
export function useGetImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch("/api/images");
        const data = await res.json();
        if (res.ok) {
          setImages(data);
        } else {
          setError(data.error || "Failed to fetch images");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  return { images, loading, error };
}

// Hook pour récupérer une image spécifique
export function useGetImage(imageId) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imageId) return;

    async function fetchImage() {
      try {
        const res = await fetch(`/api/images/${imageId}`);
        const data = await res.json();
        if (res.ok) {
          setImage(data);
        } else {
          setError(data.error || "Failed to fetch image");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function addImage(path) {
    setIsSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        return data; // Retourner l'image créée
      } else {
        setError(data.error || "Failed to create image");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  }

  return { addImage, isSuccess, error };
}

// Hook pour mettre à jour une image existante
export function useUpdateImage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function updateImage(imageId, path) {
    setIsSuccess(false);
    setError(null);

    try {
      const res = await fetch(`/api/images/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        return data; // Retourner l'image mise à jour
      } else {
        setError(data.error || "Failed to update image");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  }

  return { updateImage, isSuccess, error };
}

// Hook pour supprimer une image
export function useDeleteImage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function deleteImage(imageId) {
    setIsSuccess(false);
    setError(null);

    try {
      const res = await fetch(`/api/images/${imageId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        return data; // Retourner le message de suppression
      } else {
        setError(data.error || "Failed to delete image");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  }

  return { deleteImage, isSuccess, error };
}
