// src/app/auth/signin/page.tsx

'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


import { ArrowLeftIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import AuthenticatorCards from '@/components/AuthenticatorCards';
export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/profile');
    }
  };

  return (
    <>
    <div className="bg-auth flex flex-column h-screen pb-0	">
      <div className="mx-auto max-w-7xl px-24  items-center	content-center	flex-auth-form">
        
      <div className='text-left pb-8'> 
         <div className='flex flex-row align-baseline items-stretch	 gap-4 a-primary'><ArrowLeftIcon className='max-w-6 font-black'/> <a className='' href="/">Retour à la page d'accueil </a></div>   
          </div>
          <div className='flex flex-row align-baseline items-baseline	 gap-4
        '><h2 className="text-6xl pb-12">Se connecter </h2><ArrowRightEndOnRectangleIcon className='max-w-10'/> </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div></div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className='pb-4'>
            <label
              htmlFor="email"
              className="block text-md font-medium leading-6 text-gray-900 pb-2"
            >
              Identifiant
            </label>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full bg-slate-200	pt-4 pb-4 px-3 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className='pb-8'>
            <label
              htmlFor="password"
              className="block text-md font-medium leading-6 text-gray-900 pb-2"
            >
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
              className="block bg-slate-200	pt-4 pb-4 px-3 mb-3 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <a className='pt-3 a-primary'> Mot de passe oublié ? </a>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 mb-4 border border-transparent rounded-md shadow-sm text-2xl font-medium text-white button-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
             Connexion
            </button>

          </div>
          <div className='text-center a-primary'> 
            <a href='/auth/register'>Pas de compte ? Créez-en un. </a>
          </div>
        </form>
      </div>

      <AuthenticatorCards />


    </div>
  </>
  );
}
