// src/app/auth/edit-profile/page.tsx

'use client';

import { useSession, SessionProvider } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../../../components/LoadingSpinner';

function EditProfilePageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
      setPreviewImage(session.user.image ? session.user.image : '/default-avatar.png');
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);

      if (profileImage) {
        formData.append('file', profileImage);
      }

      const res = await fetch('/api/profile/update', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/profile');
      } else {
        setErrorMessage(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      setErrorMessage('Une erreur s\'est produite');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Modifier le profil</h1>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-6">
            <label htmlFor="profileImage" className="cursor-pointer">
              <img
                src={previewImage || '/default-avatar.png'}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full mx-auto object-cover shadow-lg"
              />
              <span className="text-indigo-600 block mt-2">Changer l'image</span>
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-gray-700">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-full ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <SessionProvider>
      <EditProfilePageContent />
    </SessionProvider>
  );
}
