import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useSignIn() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateInputs = (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return false;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return false;
    }
    return true;
  };

  const signInUser = async (email: string, password: string) => {
    setError('');
    setLoading(true);

    if (!validateInputs(email, password)) {
      setLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (result?.error) {
        setError("Identifiants incorrects. Veuillez réessayer.");
      } else {
        router.push('/');
      }
    } catch (err) {
      setError("Une erreur est survenue. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, signInUser };
}
