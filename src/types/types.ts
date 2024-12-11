export type Ingredient = {
    name: string;
    quantity: number;
  };
  
  export type Product = {
    id: number;
    name: string;
    prix: number;
    imageSrc: string;
    slug: string;
  };
  
  export type Cart = {
    [productId: number]: number;
  };