'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Product = { name: string; price: number; description: string };

export default function ProductDetailPage() {
  const { slug } = useParams(); 
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const productSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
      console.log('Fetching product for slug:', productSlug);

      try {
        const res = await fetch(`/api/products/${productSlug}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data);
        } else {
          console.error('Error fetching product:', data.error);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) return <div>Chargement...</div>;
  if (!product) return <div>Produit non trouvé</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Prix : {product.price}€</p>
      <p>Description : {product.description}</p>
    </div>
  );
}
