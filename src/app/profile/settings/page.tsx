"use client";

import { useEditProfile } from "@/hooks/users/useEditProfile";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EditProfilePage() {
  return <EditProfileContent />;
}

function EditProfileContent() {
  const {
    name,
    setName,
    email,
    setEmail,
    previewImage,
    isSubmitting,
    errorMessage,
    handleImageChange,
    handleSubmit,
  } = useEditProfile();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Modifier le profil
        </h1>

        {/* 🔹 Affichage d'erreur */}
        {errorMessage && (
          <div className="text-center text-red-500 text-sm font-medium mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 🔹 Avatar */}
          <div className="text-center">
            <label htmlFor="profileImage" className="cursor-pointer block">
              <img
          src={
            // prefer a persisted data URL (stored under 'avatar') if present,
            // otherwise use previewImage or default
            typeof window !== "undefined"
              ? localStorage.getItem("avatar") || previewImage || "/default-avatar.png"
              : previewImage || "/default-avatar.png"
          }
          alt="Avatar Preview"
          className="w-24 h-24 rounded-full mx-auto object-cover shadow-md border border-gray-300"
              />
              <span className="text-orange-600 text-sm block mt-2">
          Changer l'image
              </span>
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={(e) => {
          // keep existing hook behavior
          handleImageChange(e);

          // also persist the chosen image as a data URL so it survives refresh
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            try {
              // store as data URL under the same key that the profile page reads
              localStorage.setItem("avatar", String(reader.result));
            } catch {
              // ignore localStorage failures (quota, privacy mode, etc.)
            }
          };
          reader.readAsDataURL(file);
              }}
              className="hidden"
            />
          </div>

          {/* 🔹 Champ Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          {/* 🔹 Champ Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          {/* 🔹 Bouton Enregistrer */}
          <button
            type="submit"
            className={`w-full py-2 px-4 text-white rounded-full transition ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoadingSpinner /> : "Enregistrer les modifications"}
          </button>
        </form>
      </div>
    </div>
  );
}
