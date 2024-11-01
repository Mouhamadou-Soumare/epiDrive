"use client";

import { useEffect, useState } from 'react';

import { Categorie } from "../../../types"

export default function AddCategoryPage() {
    const [categories, setCategories] = useState<Categorie[]>([]);
    const [category, setCategory] = useState<Categorie>({
        id: 0,
        name: '',
        slug: '',
        description: '',
        imageId: 0,
        parentId: undefined,
        subcategories: []
    });
    const [submitResult, setSubmitResult] = useState<string>('');

    useEffect(() => {
        fetch("http://localhost:3000/api/categories")
        .then((response) => response.json())
        .then((data) => {
            setCategories(data);
        })
        .catch((error) => {
            console.error('Error fetching categories:', error);
        });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting category:', category);
        if (!category.name || !category.description || !category.imageId) {
            setSubmitResult('400');
            return;
        }
        try {
            console.log('Adding category:', category);
            const res = await fetch(`/api/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(category),
            });

            const data = await res.json();
            if (res.ok) {
                setSubmitResult('201');
                setTimeout(() => {
                    const slug = category.name.toLowerCase().replace(/ /g, '-');
                    window.location.assign(`/backoffice/categories/${slug}`);
                }, 2000);
            } else {
                console.error('Error adding category:', data.error);
                setSubmitResult(res.status.toString());
            }
        } catch (error) {
            console.error('Error adding category:', error);
            setSubmitResult('500');
        }
    };

    return (
        <>
            {
                submitResult === '201' && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="font-bold">Success!</span>
                    <span className="block sm:inline"> Category added successfully</span>
                </div>
            }
            {
                submitResult === '500' && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline">Error during adding category</span>
                </div>
            }
            {
                submitResult === '400' && <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Warning!</strong>
                    <span className="block sm:inline">Please fill in all required fields</span>
                </div>
            }
            <h1 className='text-3xl font-extrabold leading-tight text-gray-900'>Add Category</h1>
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
                        required
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
                        required
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="imageId" 
                        className="block mb-2 text-sm font-medium text-gray-900">Image ID</label>
                    <input
                        type="number"
                        id="imageId"
                        name="imageId"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="parentId" 
                        className="block mb-2 text-sm font-medium text-gray-900">Parent Category</label>
                    <select
                        id="parentId"
                        name="parentId"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleInputChange}
                    >
                        <option value="">Select a parent category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" 
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Add Category</button>
            </form>
        </>
    );
};
