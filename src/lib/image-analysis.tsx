import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export class ImageAnalyzer {
  private static model: cocoSsd.ObjectDetection | null = null;

  static async initialize(): Promise<void> {
    if (!this.model) {
      this.model = await cocoSsd.load();
    }
  }

  static async analyzeImage(imageElement: HTMLImageElement): Promise<{
    ingredients: Array<{ name: string; quantity: number }>;
    dish: string | null;
  }> {
    if (!this.model) {
      await this.initialize();
    }

    try {
      const predictions = await this.model!.detect(imageElement);
      
      // Convertir les prédictions en ingrédients
      const ingredients = predictions
        .filter(pred => pred.score > 0.5) // Filtre les prédictions avec un score > 50%
        .map(pred => ({
          name: pred.class,
          // Estimation de la quantité basée sur la taille de la boîte de détection
          quantity: Math.round((pred.bbox[2] * pred.bbox[3]) / 100)
        }));

      // Déduire le plat à partir des ingrédients détectés
      const dish = this.deduceDish(ingredients);

      return {
        ingredients,
        dish
      };
    } catch (error) {
      console.error('Erreur lors de l\'analyse de l\'image:', error);
      throw new Error('Impossible d\'analyser l\'image');
    }
  }

  private static deduceDish(ingredients: Array<{ name: string; quantity: number }>): string | null {
    // Logique simple de déduction du plat basée sur les ingrédients
    const ingredientNames = ingredients.map(ing => ing.name.toLowerCase());
    
    // Exemple de règles simples pour identifier des plats
    if (ingredientNames.includes('tomato') && ingredientNames.includes('cheese')) {
      return 'Pizza';
    }
    if (ingredientNames.includes('rice') && ingredientNames.includes('fish')) {
      return 'Sushi';
    }
    if (ingredientNames.includes('lettuce') && ingredientNames.includes('tomato')) {
      return 'Salade';
    }

    return null;
  }
}