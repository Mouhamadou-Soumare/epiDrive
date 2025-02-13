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
export function useGetUser(userId: number | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchUser() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération de l'utilisateur");

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError("Impossible de récupérer les informations utilisateur.");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

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

  const updateUser = async (userId: number, updates: { username: string; email: string }) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour de l'utilisateur");
      
      return await response.json();
    } catch (err) {
      setError("Impossible de mettre à jour l'utilisateur.");
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
