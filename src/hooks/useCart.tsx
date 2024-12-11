import { useState } from 'react';
import { Cart } from '@/types/types';

export const useCart = () => {
  const [cart, setCart] = useState<Cart>({});

  const addToCart = (productId: number, quantity: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + quantity,
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[productId]) {
        updatedCart[productId] -= 1;
        if (updatedCart[productId] === 0) delete updatedCart[productId];
      }
      return updatedCart;
    });
  };

  return { cart, addToCart, removeFromCart };
};