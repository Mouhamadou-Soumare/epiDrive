"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { Categorie } from "../../../../types"

export default function UpdateCategoryPage() {
    const { slug } = useParams(); 
    const [category, setCategory] = useState<Categorie | null>(null);
    const [categories, setCategories] = useState<Categorie[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitResult, setSubmitResult] = useState<string>('');

    useEffect(() => {    
        async function fetchCategory() {
            const categorySlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
            const formattedSlug = categorySlug ? categorySlug.replace('/update', '') : '';
            console.log('Fetching category for slug:', categorySlug);

            try {
                const res = await fetch(`/api/categories/${formattedSlug}`);
                const data = await res.json();
                if (res.ok) {
                    setCategory(data);
                } else {
                    console.error('Error fetching category:', data.error);
                }
            } catch (error) {
                console.error('Error fetching category:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchCategory();

        fetch("http://localhost:3000/api/categories")
        .then((response) => response.json())
        .then((data) => {
            setCategories(data);
        });
    }, [slug]);

    if (loading) return <div className="lg:pl-72">Chargement...</div>;
    if (!category) return <div className="lg:pl-72">Catégorie non trouvée</div>;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (category) {
            setCategory({ ...category, [name]: name === "imageId" || name === "parentId" ? parseInt(value) : value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (category) {
            try {
                console.log('Updating category:', category);
                const res = await fetch(`/api/categories/${category.slug}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...category,
                    }),
                });

                const data = await res.json();
                if (res.ok) {
                    setSubmitResult('200');
                } else {
                    console.error('Error updating category:', data.error);
                    setSubmitResult(res.status.toString());
                }
            } catch (error) {
                console.error('Error updating category:', error);
                setSubmitResult('500');
            }
        }
    };

    return (
        <>
            {
                submitResult === '200' && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="font-bold">Success!</span>
                    <span className="block sm:inline"> Category updated successfully</span>
                </div>
            }
            {
                submitResult === '404' || submitResult === '500' && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline">Category not found</span>
                </div>
            }
            <h1 className='text-3xl font-extrabold leading-tight text-gray-900'>Update Category</h1>
            <form onSubmit={handleSubmit} className="my-6">
                <div className="mb-5">
                    <label htmlFor="name" 
                        className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={category.name}
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
                        value={category.description}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="imageId" 
                        className="block mb-2 text-sm font-medium text-gray-900">Image ID</label>
                    <input
                        type="number"
                        id="imageId"
                        name="imageId"
                        value={category.imageId || ''}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="parentId" 
                        className="block mb-2 text-sm font-medium text-gray-900">Parent Category</label>
                    <select
                        id="parentId"
                        name="parentId"
                        value={category.parentId || ''}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleInputChange}
                    >
                        <option value="">Select a parent category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" 
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Update Category</button>
            </form>
        </>
    );
}
