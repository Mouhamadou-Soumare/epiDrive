'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAddCommande } from '@/hooks/commandes/useCommandes';
import { randomBytes } from 'crypto';

type CartItem = {
  id: number;
  produit: {
    id: number;
    name: string;
    prix: number;
    description: string;
    image: { path: string };
  };
  quantite: number;
  prix: number;
};


export default function SearchResultsPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { addCommande, loading: addingCommande, error: addError } = useAddCommande();

  const [formData, setFormData] = useState({
    adresse: '',
    ville: '',
    codePostal: '',
    pays: '',
  });

  const [errors, setErrors] = useState({
    adresse: '',
    ville: '',
    codePostal: '',
    pays: '',
  });

  const router = useRouter();

  function getOrCreateSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('sessionId', sessionId);
    }

    setSessionId(sessionId);
    return sessionId;
  }

  useEffect(() => {
    async function fetchCart() {
      const sessionId = getOrCreateSessionId();
      try {
        const res = await fetch(`/api/cart?sessionId=${sessionId}`);
        const data = await res.json();
        if (res.ok) {
          setCartItems(data);
        } else {
          console.error('Erreur de récupération du panier:', data.error);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du panier:", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchCart();
  }, []);

  useEffect(() => {
    console.log("CartItems updated:", cartItems);
  }, [cartItems]);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.prix * item.quantite, 0);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {
      adresse: formData.adresse ? '' : 'Adresse est requise.',
      ville: formData.ville ? '' : 'Ville est requise.',
      codePostal: /^[0-9]{5}$/.test(formData.codePostal) ? '' : 'Code postal invalide.',
      pays: formData.pays ? '' : 'Pays est requis.',
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Données soumises :', formData);

      var produits = cartItems.map((item) => ({
        id: item.produit.id,
        quantite: item.quantite,
        prix: item.prix,
      }));

      addCommande({
        status: 'EN_ATTENTE',
        paymentId: randomBytes(16).toString('hex'),
        userId: 1,
        infosAdresse: {
          adresse: formData.adresse,
          ville: formData.ville,
          codePostal: formData.codePostal,
          pays: formData.pays,
        },
        produits : produits
      });

      alert('Formulaire soumis avec succès !');
      localStorage.removeItem('sessionId');
      router.push('/');
    } else {
      alert('Veuillez corriger les erreurs du formulaire.');
    }
  };

  if (loading || addingCommande) return <div>Chargement ...</div>;
  if (addError) return <div>Erreur lors de la soumission de la commande</div>;
  if (cartItems.length === 0) return <div>Votre panier est vide</div>;

  return (
    <div className="bg-white p-8">
      <h2 className="text-2xl font-bold mb-4">Informations de Livraison</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">Adresse</label>
          <input
            type="text"
            id="adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleInputChange}
            className={`mt-1 block w-full border rounded-md p-2 focus:ring focus:ring-blue-500 focus:border-blue-500 ${errors.adresse ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.adresse && <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="ville" className="block text-sm font-medium text-gray-700">Ville</label>
          <input
            type="text"
            id="ville"
            name="ville"
            value={formData.ville}
            onChange={handleInputChange}
            className={`mt-1 block w-full border rounded-md p-2 focus:ring focus:ring-blue-500 focus:border-blue-500 ${errors.ville ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.ville && <p className="text-red-500 text-sm mt-1">{errors.ville}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="codePostal" className="block text-sm font-medium text-gray-700">Code Postal</label>
          <input
            type="text"
            id="codePostal"
            name="codePostal"
            value={formData.codePostal}
            onChange={handleInputChange}
            className={`mt-1 block w-full border rounded-md p-2 focus:ring focus:ring-blue-500 focus:border-blue-500 ${errors.codePostal ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.codePostal && <p className="text-red-500 text-sm mt-1">{errors.codePostal}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="pays" className="block text-sm font-medium text-gray-700">Pays</label>
          <input
            type="text"
            id="pays"
            name="pays"
            value={formData.pays}
            onChange={handleInputChange}
            className={`mt-1 block w-full border rounded-md p-2 focus:ring focus:ring-blue-500 focus:border-blue-500 ${errors.pays ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.pays && <p className="text-red-500 text-sm mt-1">{errors.pays}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Soumettre
        </button>
      </form>
    </div>
  );
}
