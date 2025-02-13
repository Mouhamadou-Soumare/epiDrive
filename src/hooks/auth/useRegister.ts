import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * Hook personnalisé pour gérer l'inscription des utilisateurs
 */
export function useRegister() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Valide les champs du formulaire avant l'envoi
   */
  const validateInputs = (name: string, email: string, password: string) => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Tous les champs sont obligatoires.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Veuillez entrer une adresse email valide.");
      return false;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.");
      return false;
    }
    return true;
  };

  /**
   * Gère l'inscription de l'utilisateur
   */
  const registerUser = async (name: string, email: string, password: string) => {
    setError('');
    setLoading(true);

    if (!validateInputs(name, email, password)) {
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
      console.error("Erreur lors de l'inscription :", error);
      setError("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, registerUser };
}