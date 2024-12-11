import { ApiClient } from "@/lib/api-client";
import { Ingredient } from "@/types/types";

export interface ImageAnalysisResponse {
  dish: string;
  ingredients: Ingredient[];
}

export interface ProductsResponse {
  products: Array<{
    id: number;
    name: string;
    prix: number;
    imageSrc: string;
    slug: string;
  }>;
}

export class ImageAnalysisService {
  static async analyzeImage(imageData: string): Promise<ImageAnalysisResponse> {
    try {
      return await ApiClient.post<ImageAnalysisResponse>("/api/snap-and-cook", {
        image: imageData,
      });
    } catch (error) {
      console.error("Erreur lors de l'analyse de l'image:", error);
      throw new Error("Impossible d'analyser l'image. Veuillez réessayer.");
    }
  }

  static async fetchMatchingProducts(ingredients: Ingredient[]): Promise<ProductsResponse> {
    try {
      const ingredientNames = ingredients.map((ing) => ing.name);
      return await ApiClient.post<ProductsResponse>("/api/products", {
        ingredients: ingredientNames,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      throw new Error("Impossible de récupérer les produits. Veuillez réessayer.");
    }
  }
}