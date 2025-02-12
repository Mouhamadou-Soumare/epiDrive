import { useState, useEffect } from "react";
import { Categorie } from "types";


interface FetchError {
  error: string;
}

const API_BASE_URL = "/api/categories";

// Hook pour récupérer toutes les catégories
export function useGetCategories() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        const data = (await response.json()) as Categorie[];
        if (!response.ok) throw new Error((data as unknown as FetchError).error || "Failed to fetch categories");
        setCategories(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

// Hook pour récupérer une catégorie spécifique
export function useGetCategory(slug: string) {
  const [category, setCategory] = useState<Categorie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${slug}`);
        const data = (await response.json()) as Categorie;
        if (!response.ok) throw new Error((data as unknown as FetchError).error || "Failed to fetch category");
        setCategory(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCategory();
  }, [slug]);

  return { category, loading, error };
}

// Hook pour ajouter une catégorie
export function useAddCategory() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addCategory = async (newCategory: Omit<Categorie, "id">, newImage?: File): Promise<Categorie> => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", newCategory.name);
      formData.append("description", newCategory.description);
      formData.append("parentId", newCategory.parentId.toString());
      formData.append("newImage", newImage);

      const response = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de la création de la catégorie");
      }

      return await response.json();
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addCategory, loading, error };
}

// Hook pour mettre à jour une catégorie
export function useUpdateCategory() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateCategory = async (slug: string, updatedCategory: Partial<Categorie>, newImage?: File): Promise<Categorie> => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("updatedCategory", JSON.stringify(updatedCategory));
      if (newImage) {
        formData.append("newImage", newImage);
      }

      const response = await fetch(`${API_BASE_URL}/${slug}`, {
        method: "PATCH",
        body: formData, 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update category");
      }

      return await response.json();
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateCategory, loading, error };
}

// Hook pour supprimer une catégorie
export function useDeleteCategory() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCategory = async (slug: string): Promise<string> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${slug}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { message: string };
      if (!response.ok) throw new Error((data as unknown as FetchError).error || "Failed to delete category");
      return data.message;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCategory, loading, error };
}
