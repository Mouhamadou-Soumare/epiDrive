// src/hooks/snapAndCook/useSnapAndCook.ts
import { useState } from "react";
import useAddCart from "@/hooks/cart/useAddCart";

type Ingredient = {
  id: number;
  name: string;
  description: string;
  prix: number;
  categorie: string;
};

type Product = { id: number; name: string; prix: number };
type Recette = { id: number; title: string; description: string; instructions: string; image: string };

export function useSnapAndCook() {
    const [dish, setDish] = useState<Recette | null>(null);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<{ [productId: number]: number }>({});
    const [loadingImage, setLoadingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToCart } = useAddCart();
  
    const handleImageCaptured = async (imageData: string) => {
      setLoadingImage(true);
      setError(null);
  
      try {
        const response = await fetch("/api/jimmy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageData }),
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.error?.message || result.error || "Erreur lors de l'analyse.");
        }
  
        setDish(result.dish);
        setIngredients(result.dish?.ingredients || []);
        setProducts(result.dish?.produits || []);
      } catch (err: any) {
        setError(err.message || "Une erreur s'est produite.");
      } finally {
        setLoadingImage(false);
      }
    };
  
    const handleBatchAddToCart = (productId: number, quantity: number) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        addToCart({ productId: product.id, quantity, price: product.prix });
        setCart((prevCart) => ({
          ...prevCart,
          [productId]: (prevCart[productId] || 0) + quantity,
        }));
      }
    };
  
    const handleRemoveFromCart = (productId: number) => {
      setCart((prevCart) => {
        const updatedCart = { ...prevCart };
        if (updatedCart[productId] > 1) {
          updatedCart[productId] -= 1;
        } else {
          delete updatedCart[productId];
        }
        return updatedCart;
      });
    };
  
    const handleCloseModal = () => {
      setCart({});
      setIsModalOpen(false);
    };
  
    return {
      dish,
      ingredients,
      products,
      cart,
      setCart, 
      loadingImage,
      error,
      isModalOpen,
      handleImageCaptured,
      handleBatchAddToCart,
      handleRemoveFromCart,
      handleCloseModal,
      setIsModalOpen,
    };
  }
  