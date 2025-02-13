import {
    addToCart,
    removeFromCart,
    calculateTotalWithTax,
    updateQuantity,
    CartItem,
    Product,
  } from './cart';
  
  describe('addToCart', () => {
    it('should add a new product to the cart', () => {
      const cart: CartItem[] = [];
      const product: Product = { id: 1, name: 'Apple', price: 1.5 };
  
      const updatedCart = addToCart(cart, product);
  
      expect(updatedCart).toEqual([
        { id: 1, name: 'Apple', price: 1.5, quantity: 1 },
      ]);
    });
  
    it('should increase the quantity if the product is already in the cart', () => {
      const cart: CartItem[] = [
        { id: 1, name: 'Apple', price: 1.5, quantity: 1 },
      ];
      const product: Product = { id: 1, name: 'Apple', price: 1.5 };
  
      const updatedCart = addToCart(cart, product);
  
      expect(updatedCart).toEqual([
        { id: 1, name: 'Apple', price: 1.5, quantity: 2 },
      ]);
    });
  
    it('should handle adding a product to an empty cart', () => {
      const cart: CartItem[] = [];
      const product: Product = { id: 2, name: 'Banana', price: 1.0 };
  
      const updatedCart = addToCart(cart, product);
  
      expect(updatedCart).toEqual([
        { id: 2, name: 'Banana', price: 1.0, quantity: 1 },
      ]);
    });
  });
  
  describe('removeFromCart', () => {
    it('should remove a product from the cart by its ID', () => {
      const cart: CartItem[] = [
        { id: 1, name: 'Apple', price: 1.5, quantity: 2 },
        { id: 2, name: 'Banana', price: 1.0, quantity: 3 },
      ];
  
      const updatedCart = removeFromCart(cart, 1);
  
      expect(updatedCart).toEqual([
        { id: 2, name: 'Banana', price: 1.0, quantity: 3 },
      ]);
    });
  
    it('should do nothing if the product ID does not exist in the cart', () => {
      const cart: CartItem[] = [
        { id: 1, name: 'Apple', price: 1.5, quantity: 2 },
        { id: 2, name: 'Banana', price: 1.0, quantity: 3 },
      ];
  
      const updatedCart = removeFromCart(cart, 3);
  
      expect(updatedCart).toEqual(cart);
    });
  
    it('should return an empty cart if the last product is removed', () => {
      const cart: CartItem[] = [
        { id: 1, name: 'Apple', price: 1.5, quantity: 1 },
      ];
  
      const updatedCart = removeFromCart(cart, 1);
  
      expect(updatedCart).toEqual([]);
    });
  });
  
  describe('calculateTotalWithTax', () => {
    it('should calculate the subtotal and total price including tax', () => {
      const cart: CartItem[] = [
        { id: 1, name: 'Apple', price: 1.5, quantity: 2 },
        { id: 2, name: 'Banana', price: 1.0, quantity: 3 },
      ];
  
      const { subtotal, total } = calculateTotalWithTax(cart, 0.2); 
  
      expect(subtotal).toBe(6.0); 
      expect(total).toBe(7.2); 
    });
  
    it('should return 0 for both subtotal and total if the cart is empty', () => {
      const cart: CartItem[] = [];
  
      const { subtotal, total } = calculateTotalWithTax(cart, 0.2);
  
      expect(subtotal).toBe(0);
      expect(total).toBe(0);
    });
  });
  
  describe('updateQuantity', () => {
    it('should update the quantity of a product in the cart', () => {
      const cart: CartItem[] = [
        { id: 1, name: 'Apple', price: 1.5, quantity: 1 },
      ];
  
      const updatedCart = updateQuantity(cart, 1, 3);
  
      expect(updatedCart).toEqual([
        { id: 1, name: 'Apple', price: 1.5, quantity: 3 },
      ]);
    });
  
    it('should remove the product if the quantity is set to 0 or less', () => {
      const cart: CartItem[] = [
        { id: 1, name: 'Apple', price: 1.5, quantity: 1 },
      ];
  
      const updatedCart = updateQuantity(cart, 1, 0);
  
      expect(updatedCart).toEqual([]);
    });
  
    it('should do nothing if the product does not exist in the cart', () => {
      const cart: CartItem[] = [
        { id: 1, name: 'Apple', price: 1.5, quantity: 1 },
      ];
  
      const updatedCart = updateQuantity(cart, 2, 3);
  
      expect(updatedCart).toEqual(cart);
    });
  });
  