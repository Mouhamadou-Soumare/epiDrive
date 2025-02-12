import { useState } from 'react';

export function useChatIA() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async (message: string) => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const res = await fetch('/api/chatIA', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });

            const data = await res.json();

            if (res.ok) {
                setResponse(data.reply);
            } else {
                setError(data.error || 'Erreur inconnue');
            }
        } catch (err) {
            setError('Erreur réseau');
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, response, loading, error };
}
