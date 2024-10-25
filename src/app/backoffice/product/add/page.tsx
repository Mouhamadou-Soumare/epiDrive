"use client";

import { useEffect, useState } from 'react';

type Product = { 
    id: number; 
    name: string; 
    price: number; 
    imageSrc: string; 
    imageAlt: string; 
    slug: string;  
    description: string; 
    categoryId: number; // Ajout de la catégorie
};
type SubCategory = { id: number, name: string; slug: string };

export default function AddProductPage() {
    const [categories, setCategories] = useState<SubCategory[]>([]);
    const [product, setProduct] = useState<Product>({
        id: 0,
        name: '',
        price: 0,
        imageSrc: '',
        imageAlt: '',
        slug: '',
        description: '',
        categoryId: 0 // Initialisation de la catégorie
    });
    const [submitResult, setSubmitResult] = useState<string>('');

    useEffect(() => {
        fetch("http://localhost:3000/api/categories")
            .then((response) => response.json())
            .then((data) => {
                setCategories(data)
            });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('Adding product:', product);
            const res = await fetch(`/api/products/${product.slug}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });

            const data = await res.json();
            if (res.ok) {
                setSubmitResult('200');
                setTimeout(() => {
                    window.location.assign(`/backoffice/products/${product.slug}`);
                }, 2000);
            } else {
                console.error('Error adding product:', data.error);
                setSubmitResult(res.status.toString());
            }
        } catch (error) {
            console.error('Error adding product:', error);
            setSubmitResult('500');
        }
    };

    return (
        <>
            {
                submitResult === '200' && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="font-bold">Success!</span>
                    <span className="block sm:inline"> Product added successfully</span>
                </div>
            }
            {
                submitResult === '500' && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline">Error during adding product</span>
                </div>
            }
            <h1 className='text-3xl font-extrabold leading-tight text-gray-900'>Add Product</h1>
            <form onSubmit={handleSubmit} className="my-6">
                <div className="mb-5">
                    <label htmlFor="name" 
                        className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
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
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="price" 
                        className="block mb-2 text-sm font-medium text-gray-900">Price</label>
                    <input
                        type="number"
                        min="0" max="1000" step="0.01"
                        id="price"
                        name="price"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="imageSrc" 
                        className="block mb-2 text-sm font-medium text-gray-900">Image Source</label>
                    <input
                        type="text"
                        id="imageSrc"
                        name="imageSrc"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="imageAlt" 
                        className="block mb-2 text-sm font-medium text-gray-900">Image Alt Text</label>
                    <input
                        type="text"
                        id="imageAlt"
                        name="imageAlt"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="categoryId" 
                        className="block mb-2 text-sm font-medium text-gray-900">Category</label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleInputChange}
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" 
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Add Product</button>
            </form>
        </>
    );
};
