'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeftIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import AuthenticatorCards from '@/components/AuthenticatorCards';
import { useRegister } from '@/hooks/auth/useRegister';
export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { error, loading, registerUser } = useRegister();
  const router = useRouter();
  const { status } = useSession();

  // Redirige l'utilisateur s'il est déjà authentifié
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Envoi du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      if (res.ok) {
        // Connexion automatique après inscription réussie
        const signInResult = await signIn('credentials', {
          redirect: false,
          email: email.trim(),
          password,
        });

        if (signInResult?.error) {
          setError("Inscription réussie, mais échec de la connexion automatique.");
        } else {
          router.push('/profile');
        }
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Erreur lors de l'inscription.");
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      setError("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }

  };
  
  return (
    <div className="bg-auth h-screen flex flex-wrap pb-0">
      <div className="w-full md:w-1/2 lg:w-1/2 px-8 py-4 items-center content-center flex-auth-form">
        
        {/* Retour à l'accueil */}
        <div className="text-left pb-8">
          <div className="flex flex-row align-baseline items-stretch gap-4 a-primary">
            <ArrowLeftIcon className="max-w-6" />
            <Link href="/">Retour à la page d'accueil</Link>
          </div>
        </div>

        {/* Titre */}
        <div className="flex flex-row align-baseline items-baseline gap-4">
          <h2 className="text-6xl pb-12">S'inscrire</h2>
          <ArrowRightOnRectangleIcon className="max-w-10" />
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="text-red-500 bg-red-100 rounded-lg py-2 px-4 mb-4">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="pb-4">
            <label htmlFor="name" className="block text-md font-medium text-gray-900 pb-2">
              Nom
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full bg-slate-200 pt-4 pb-4 px-3 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="pb-4">
            <label htmlFor="email" className="block text-md font-medium text-gray-900 pb-2">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full bg-slate-200 pt-4 pb-4 px-3 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="pb-8">
            <label htmlFor="password" className="block text-md font-medium text-gray-900 pb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full bg-slate-200 pt-4 pb-4 px-3 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              className={`w-full flex justify-center py-3 px-4 mb-4 border border-transparent rounded-md shadow-sm text-2xl font-medium text-white button-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Chargement...' : "S'inscrire"}
            </button>
          </div>

          <div className="text-center a-primary">
            <Link href="/auth/signin">Déjà un compte ? Connectez-vous.</Link>
          </div>
        </form>
      </div>

      {/* Composant AuthenticatorCards */}
      <AuthenticatorCards />
    </div>
  );
}
