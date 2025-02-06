import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // ✅ On importe authOptions du fichier dédié

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
