import { useState, useEffect } from 'react';

const API_BASE_URL = '/api/users';

// Hook pour récupérer tous les utilisateurs
export function useGetUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch users');
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
}

// Hook pour récupérer un utilisateur spécifique
export function useGetUser(id) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch user');
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  return { user, loading, error };
}

// Hook pour ajouter un utilisateur
export function useAddUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addUser = async ({ username, email, password, role, imagePath }) => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role, imagePath }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add user');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addUser, loading, error };
}

// Hook pour mettre à jour un utilisateur
export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateUser = async (id, { username, email, role, imageId }) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, role, imageId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update user');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
}

// Hook pour supprimer un utilisateur
export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteUser = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete user');
      return data.message;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
}
