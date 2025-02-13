'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AuthenticatorCards from '@/components/AuthenticatorCards';
import { useSignIn } from '@/hooks/auth/useSignIn';

export default function SignInPage() {
  const { status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateInputs = () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return false;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateInputs()) return;

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (result?.error) {
        setError("Identifiants incorrects. Veuillez réessayer.");
      } else {
        router.push('/profile');
      }
    } catch (err) {
      setError("Une erreur est survenue. Réessayez plus tard.");
    }
  };


  // Redirige l'utilisateur s'il est déjà connecté
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Gestion de la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signInUser(email, password);
  };
  return (
    <div className="bg-auth h-screen flex flex-wrap pb-0">
      <div className="w-full md:w-1/2 lg:w-1/2 px-8 py-4 items-center content-center flex-auth-form">

        {/* Retour à l'accueil */}
        <div className='text-left pb-8'> 
          <div className='flex flex-row align-baseline items-stretch gap-4 a-primary'>
            <ArrowLeftIcon className='max-w-6 font-black' /> 
            <Link href="/">Retour à la page d'accueil</Link>  
          </div>   
        </div>

        {/* Titre */}
        <div className='flex flex-row align-baseline items-baseline gap-4'>
          <h2 className="text-6xl pb-12">Se connecter</h2>
          <ArrowRightEndOnRectangleIcon className='max-w-10'/> 
        </div>

        {/* Message d'erreur */}
        {error && <div className="text-red-600 font-medium">{error}</div>}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className='pb-4'>
            <label htmlFor="email" className="block text-md font-medium leading-6 text-gray-900 pb-2">
              Identifiant
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full bg-slate-200 pt-4 pb-4 px-3 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className='pb-8'>
            <label htmlFor="password" className="block text-md font-medium leading-6 text-gray-900 pb-2">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block bg-slate-200 pt-4 pb-4 px-3 mb-3 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <Link href="/auth/reset-password" className='pt-3 a-primary'>
              Mot de passe oublié ?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 mb-4 border border-transparent rounded-md shadow-sm text-2xl font-medium text-white button-primary hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Connexion
            </button>
          </div>

          <div className='text-center a-primary'> 
            <Link href='/auth/register'>Pas de compte ? Créez-en un.</Link>
          </div>
        </form>
      </div>

      {/* Cartes d'authentification supplémentaires */}
      <AuthenticatorCards />
    </div>
  );
}
