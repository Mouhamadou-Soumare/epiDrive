// src/pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '@/services/userService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Méthode non autorisée
  }

  const { email, password, username } = req.body;

  try {
    const newUser = await createUser(email, password, username);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
