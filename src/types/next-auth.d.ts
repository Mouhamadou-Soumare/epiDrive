// next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import "next-auth/jwt";

// 🔹 Étendre l'interface User pour inclure `role`
declare module "next-auth" {
  interface User extends DefaultUser {
    role: "USER" | "ADMIN" | "MAGASINIER";
  }

  interface Session {
    user: {
      id: string;
      role: User["role"];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "USER" | "ADMIN" | "MAGASINIER";
  }
}
