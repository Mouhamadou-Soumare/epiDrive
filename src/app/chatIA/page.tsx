'use client';

import { useState } from 'react';
import { useChatIA } from '@/hooks/chat/useChatIA';

export default function ChatIA() {
    const { sendMessage, response, loading, error } = useChatIA();
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="bg-white min-h-screen flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold mb-4">Chat Cuisine </h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Pose ta question..."
                    className="flex-1 p-2 border rounded-l-md"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
                    disabled={loading}
                >
                    Envoyer
                </button>
            </form>

            {loading && <p className="mt-4">Chargement...</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {response && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md w-full max-w-md">
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
}
