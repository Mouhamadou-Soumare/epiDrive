"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

type Product = { 
    id: number; 
    name: string; 
    prix: number;          
    imageSrc: string; 
    imageAlt: string; 
    slug: string;  
    description: string; 
};

export default function UpdateProductPage() {
    const { slug } = useParams(); 
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitResult, setSubmitResult] = useState<string>('');

    useEffect(() => {    
        async function fetchProduct() {
            const productSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
            const formattedSlug = productSlug ? productSlug.replace('/update', '') : '';
            console.log('Fetching product for slug:', productSlug);

            try {
                const res = await fetch(`/api/products/${formattedSlug}`);
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

    if (loading) return <div className="lg:pl-72">Chargement...</div>;
    if (!product) return <div className="lg:pl-72">Produit non trouvé</div>;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (product) {
            setProduct({ ...product, [name]: name === "prix" ? parseFloat(value) : value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (product) {
            try {
                console.log('Updating product:', product);
                const res = await fetch(`/api/products/${product.slug}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...product,
                        prix: product.prix, 
                    }),
                });

                const data = await res.json();
                if (res.ok) {
                    setSubmitResult('200');
                } else {
                    console.error('Error updating product:', data.error);
                    setSubmitResult(res.status.toString());
                }
            } catch (error) {
                console.error('Error updating product:', error);
                setSubmitResult('500');
            }
        }
    };

    return (
        <>
            {
                submitResult === '200' && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="font-bold">Success!</span>
                    <span className="block sm:inline"> Product updated successfully</span>
                </div>
            }
            {
                submitResult === '404' && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline">Product not found</span>
                </div>
            }
            <h1 className='text-3xl font-extrabold leading-tight text-gray-900'>Update Product</h1>
            <form onSubmit={handleSubmit} className="my-6">
                <div className="mb-5">
                    <label htmlFor="name" 
                        className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={product.name}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={product.description}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="prix" 
                        className="block mb-2 text-sm font-medium text-gray-900">Prix</label>
                    <input
                        type="number"
                        min="0" max="1000" step="0.01"
                        id="prix"
                        name="prix"
                        value={product.prix}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit" 
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Update Product</button>
            </form>
        </>
    );
}
