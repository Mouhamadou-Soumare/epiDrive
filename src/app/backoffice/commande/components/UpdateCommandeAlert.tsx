'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface UpdateCommandeAlertProps {
  message: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  user: { username: string }; // L'utilisateur avec son username
  commandeId: number; // L'ID de la commande
}

export const UpdateCommandeAlert = ({ message: initialMessage, open, setOpen, user, commandeId }: UpdateCommandeAlertProps) => {
  const [message, setMessage] = useState(initialMessage);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        subject: `Mise à jour de la commande #${commandeId}`,
        message: message.trim(),
        userName: user.username,
        commandeId,
      };

      console.log('Payload envoyé :', payload);

      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de l'email");
      }

      console.log("✅ Email envoyé avec succès");
      setOpen(false);
    } catch (error) {
      console.error("❌ Erreur lors de la notification à l'utilisateur", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="fixed inset-0 z-50 flex justify-center items-center lg:pl-72">
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

      <div className="flex min-h-full w-full items-center justify-center p-4 text-center sm:p-0">
        <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-6 pb-6 pt-5 text-left shadow-xl drop-shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          {/* Bouton Fermer */}
          <div className="absolute right-0 top-0 pr-4 pt-4 sm:block">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Fermer</span>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Titre et icône */}
          <div className="sm:flex sm:items-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                Envoyer une mise à jour à {user.username}
              </DialogTitle>
              <p className="text-sm text-gray-500">
                Vous êtes sur le point d'envoyer une notification concernant la commande <strong>#{commandeId}</strong>.
              </p>
            </div>
          </div>

          {/* Champ de texte */}
          <div className="mt-4">
            <textarea
              name="message"
              value={message}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              placeholder="Entrez votre message ici..."
              rows={4}
            />
          </div>

          {/* Boutons */}
          <div className="mt-5 sm:mt-6 sm:flex sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`inline-flex w-full sm:w-auto justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition duration-200 ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white"
              }`}
            >
              {loading ? "Envoi en cours..." : "Envoyer"}
              <PaperAirplaneIcon className="ml-2 h-5 w-5 text-white" />
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
