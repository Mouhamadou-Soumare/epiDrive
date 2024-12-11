import { useState } from "react";
import { ImageAnalysisService } from "@/services/image-analysis.service";
import { Ingredient, Product } from "@/types/types";

export const useImageAnalysis = () => {
  const [dish, setDish] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = async (imageData: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const analysisResult = await ImageAnalysisService.analyzeImage(imageData);
      setDish(analysisResult.dish);
      setIngredients(analysisResult.ingredients);

      const productsResult = await ImageAnalysisService.fetchMatchingProducts(
        analysisResult.ingredients
      );
      setProducts(productsResult.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setDish(null);
      setIngredients([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    dish,
    ingredients,
    products,
    loading,
    error,
    analyzeImage,
  };
};