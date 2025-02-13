import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // Utilisation de Prisma pour la gestion des utilisateurs
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER, // Serveur SMTP pour l'authentification par email
      from: process.env.EMAIL_FROM, // Adresse email utilisée pour envoyer les liens d'authentification
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Redirection vers une page personnalisée de connexion
  },
  session: {
    strategy: "jwt", // Utilisation de JWT pour les sessions (meilleure scalabilité)
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id; 
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, 
};

export default NextAuth(authOptions);
