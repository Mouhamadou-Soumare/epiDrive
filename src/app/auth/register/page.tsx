// src/app/auth/register/page.tsx

'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      window.location.href = '/auth/signin';
    } else {
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-black mb-6">Inscription</h1>
        
        {error && (
          <p className="text-center text-red-500 bg-red-100 rounded-lg py-2 mb-4">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            placeholder="Votre adresse email"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-2">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            placeholder="Votre mot de passe"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg hover:from-purple-600 hover:to-indigo-700 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}
