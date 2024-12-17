import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user) {
          const isValidPassword =
            credentials.password && user.password
              ? await bcrypt.compare(credentials.password, user.password)
              : false;

          if (isValidPassword) {
            return {
              id: user.id.toString(),
              name: user.username,
              email: user.email,
              createdAt: user.createdAt,
            };
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub; // Assure que l'ID est bien une chaîne de caractères
      return session;
    },
  },
});

export { handler as GET, handler as POST };
