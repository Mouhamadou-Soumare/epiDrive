// src/lib/auth.ts
import { getUserByEmail } from "@/services/userService"; 
import bcrypt from "bcrypt";

export async function verifyUserCredentials(email: string, password: string) {
  const user = await getUserByEmail(email); 

  if (!user) {
    return null; 
  }

  return null; 
}
