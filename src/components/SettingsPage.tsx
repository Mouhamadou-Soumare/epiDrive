'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState<string>(session?.user?.name || '');
  const [email, setEmail] = useState<string>(session?.user?.email || '');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // État pour gérer les erreurs

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null); // Réinitialise les erreurs précédentes

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (profileImage) {
      formData.append('file', profileImage);
    }

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        router.push('/profile');
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Une erreur est survenue.');
      }
    } catch (error) {
      console.error('Erreur de requête:', error);
      setErrorMessage('Erreur de connexion au serveur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Vous devez être connecté pour accéder à cette page.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="max-w-lg w-full bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Paramètres du Profil</h1>

        {errorMessage && (
          <div className="mb-4 text-red-500 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <Image
                src={previewImage || session?.user?.image || '/default-avatar.png'}
                alt="Image de profil"
                width={120}
                height={120}
                className="rounded-full border border-gray-700"
              />
            </div>

            <label className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-full cursor-pointer">
              <span>Choisir un fichier</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-full"
          >
            {isSubmitting ? 'Enregistrement...' : 'Sauvegarder les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
}
