export default function NotFound() {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 px-6">
        <h1 className="text-9xl font-extrabold text-gray-800">404</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-700 md:text-3xl">
          Oops! Page non trouvée
        </p>
        <p className="mt-2 text-gray-600">
          La page que vous recherchez semble introuvable.
        </p>
        
        <a
          href="/"
          className="mt-6 inline-block rounded-lg button-primary px-6 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-orange-700"
        >
          Retour à l'accueil
        </a>
      </div>
    );
  }
  