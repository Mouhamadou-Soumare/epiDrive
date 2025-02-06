import { useState, useEffect } from 'react';
import { User, Role } from 'types';


interface FetchError {
  message: string;
}

const API_BASE_URL = '/api/users';

// Hook pour récupérer tous les utilisateurs
export function useGetUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        const data: User[] = await response.json();
        if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to fetch users');
        setUsers(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
}

// Hook pour récupérer un utilisateur spécifique
export function useGetUser(id: number | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error("Failed to fetch user");

        const data: Partial<User> = await response.json();

        // Vérification et conversion de role en Enum
        const normalizedUser: User = {
          id: data.id || 0,
          username: data.username || "Unknown",
          email: data.email || "",
          password: "", // Le mot de passe n'est pas retourné par l'API
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
          updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
          role: typeof data.role === "string" ? (Role[data.role as keyof typeof Role] ?? Role.USER) : Role.USER,
          imageId: data.imageId || null,
          image: data.image || undefined,
          commandes: data.commandes || [],
          recettes: data.recettes || [],
          panier: data.panier || undefined,
          livraisons: data.livraisons || [],
          logs: data.logs || [],
        };

        setUser(normalizedUser);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return { user, loading, error };
}


// Hook pour ajouter un utilisateur
export function useAddUser() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addUser = async (newUser: Omit<User, 'id'> & { password: string }): Promise<User> => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data: User = await response.json();
      if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to add user');
      return data;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addUser, loading, error };
}

// Hook pour mettre à jour un utilisateur
export function useUpdateUser() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (id: number, updatedUser: Partial<Omit<User, 'id'>>): Promise<User> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      const data: User = await response.json();
      if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to update user');
      return data;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
}

// Hook pour supprimer un utilisateur
export function useDeleteUser() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (id: number): Promise<string> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error((data as unknown as FetchError).message || 'Failed to delete user');
      return data.message;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
}
