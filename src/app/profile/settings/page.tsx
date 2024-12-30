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

    try {
      // Préparer les données JSON
      const payload = {
        action: 'updateProfile',
        userId: session?.user?.id, // Assurez-vous que l'ID utilisateur est accessible via la session
        username: name,
        email: email,
        imagePath: profileImage?.name || null, // Exemple : nom du fichier image
      };

      console.log('Payload envoyé:', payload); // Ajouter un log du payload

      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Indique que le payload est au format JSON
        },
        body: JSON.stringify(payload), // Envoyer les données JSON
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Réponse API:', data); // Ajouter un log de la réponse
        router.push('/profile');
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de la mise à jour du profil:', errorData.message || 'Erreur inconnue');
      }
    } catch (error) {
      console.error('Erreur de requête:', error);
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
    <div className="min-h-screen flex items-center justify-center bg-white text-black p-4">
      <div className="max-w-lg w-full bg-gray-200 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Paramètres du Profil</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <Image
                src={previewImage || session?.user?.image || '/default-avatar.png'}
                alt="Image de profil"
                width={120}
                height={120}
                className="rounded-full border border-gray-300"
              />
            </div>

            <label className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer">
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
            <label className="block text-gray-600 mb-1">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-white rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-white rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isSubmitting ? 'Enregistrement...' : 'Sauvegarder les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
}
