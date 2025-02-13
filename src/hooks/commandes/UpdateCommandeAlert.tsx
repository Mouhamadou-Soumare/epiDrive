import { useState, useCallback } from "react";

interface UseUpdateCommandeAlertProps {
  initialMessage: string;
  user: { username: string };
  commandeId: number;
  setOpen: (open: boolean) => void;
}

export function useUpdateCommandeAlert({ initialMessage, user, commandeId, setOpen }: UseUpdateCommandeAlertProps) {
  const [message, setMessage] = useState(initialMessage);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Met à jour le message
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  }, []);

  // Envoi de l'email
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const payload = {
        subject: `Mise à jour de la commande #${commandeId}`,
        message: message.trim(),
        userName: user.username,
        commandeId,
      };

      console.log("📩 Payload envoyé :", payload);

      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de l'email");
      }

      setSuccessMessage("✅ Email envoyé avec succès !");
      setTimeout(() => setOpen(false), 5000);
    } catch (error) {
      setErrorMessage("❌ Une erreur s'est produite lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  }, [message, commandeId, user, setOpen]);

  return {
    message,
    loading,
    successMessage,
    errorMessage,
    handleInputChange,
    handleSubmit,
  };
}
