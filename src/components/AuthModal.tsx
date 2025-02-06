'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  onClose: () => void;
  onAuthenticate?: () => Promise<void>; // ✅ Ajout de onAuthenticate comme prop optionnelle
}

const AuthModal = ({ onClose, onAuthenticate }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const endpoint = isSigningUp ? '/api/auth/signup' : '/api/auth/signin';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        if (!isSigningUp) {
          // ✅ Connexion avec NextAuth après authentification réussie
          const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
          });
  
          if (result?.error) {
            setError(result.error);
            return;
          }
        }
  
        // ✅ Exécuter onAuthenticate s'il est défini
        if (onAuthenticate) {
          await onAuthenticate();
        }

        // ✅ Fermer la modal après l'authentification
        onClose();
      } else {
        setError(data.message || 'Erreur lors de l\'authentification');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {isSigningUp ? 'Créer un compte' : 'Se connecter'}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isSigningUp ? 'S\'inscrire' : 'Se connecter'}
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          {isSigningUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
          <button
            type="button"
            className="text-blue-500 underline"
            onClick={() => setIsSigningUp(!isSigningUp)}
          >
            {isSigningUp ? 'Se connecter' : 'S\'inscrire'}
          </button>
        </p>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
