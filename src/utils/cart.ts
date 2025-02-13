export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export function addToCart(cart: CartItem[], product: Product): CartItem[] {
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    return cart.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    );
  }

  return [...cart, { ...product, quantity: 1 }];
}

export function removeFromCart(
  cart: CartItem[],
  productId: number
): CartItem[] {
  return cart.filter((item) => item.id !== productId);
}

export function calculateTotalWithTax(
  cart: CartItem[],
  taxRate: number
): { subtotal: number; total: number } {
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return { subtotal, total };
}
export function updateQuantity(
  cart: CartItem[],
  productId: number,
  quantity: number
): CartItem[] {
  if (quantity <= 0) {
    return removeFromCart(cart, productId);
  }
  return cart.map((item) =>
    item.id === productId ? { ...item, quantity } : item
  );
}
