"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useGetUser, useUpdateUser } from "@/hooks/users/useUsers";
import { useRouter } from "next/navigation";

const UpdateUserPage = () => {
  const { data: session, status } = useSession(); 
  const userId = session?.user?.id ? Number(session.user.id) : null;
  const { user, loading: loadingUser, error: errorUser } = useGetUser(userId);
  const { updateUser, loading: loadingUpdate, error: errorUpdate } = useUpdateUser();
  const router = useRouter();

  const [formData, setFormData] = useState<{ username: string; email: string }>({
    username: "",
    email: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (!userId) {
      console.error("Utilisateur non connecté");
      return;
    }

    try {
      await updateUser(userId, { username: formData.username, email: formData.email });
      setSuccessMessage("Votre profil a été mis à jour avec succès !");
      setTimeout(() => router.refresh(), 2000);
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
    }
  };

  if (status === "loading" || loadingUser) {
    return <div className="text-center text-lg font-medium">Chargement des informations...</div>;
  }

  if (!session || !userId) {
    return <div className="text-center text-red-500 font-medium">Vous devez être connecté pour modifier votre profil.</div>;
  }

  if (errorUser) {
    return <div className="text-center text-red-500 font-medium">Erreur : {errorUser}</div>;
  }

  return (
    <div className="max-w-lg mx-auto m-10 bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">Modifier votre profil</h1>

      {errorUpdate && <p className="text-red-500">{errorUpdate}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        {/* Champ Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 p-2"
            required
          />
        </div>

        {/* Champ Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 p-2"
            required
          />
        </div>

        {/* Bouton de mise à jour */}
        <div className="mt-4 flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50"
            disabled={loadingUpdate}
          >
            {loadingUpdate ? "Mise à jour..." : "Mettre à jour"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserPage;
