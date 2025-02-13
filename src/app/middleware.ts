import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const isProduction = process.env.NODE_ENV === "production";

  // Récupération du token NextAuth en fonction de l'environnement
  const token = cookies.get(isProduction ? "__Secure-next-auth.session-token" : "next-auth.session-token");

  if (nextUrl.pathname.startsWith("/backoffice")) {
    // Si aucun token n'est trouvé, bloquer immédiatement l'accès (403 Forbidden)
    if (!token) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    try {
      // Vérification et décodage du token avec NEXTAUTH_SECRET
      const decodedToken = jwt.verify(token.value, process.env.NEXTAUTH_SECRET!) as { role?: string };

      // Si l'utilisateur n'est pas admin, renvoyer une erreur 403
      if (!decodedToken || decodedToken.role !== "ADMIN") {
        return new NextResponse("Forbidden", { status: 403 });
      }

    } catch (error) {
      console.error("Erreur de vérification du token:", error);
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return NextResponse.next();
}

// Appliquer le middleware uniquement aux routes du back-office
export const config = {
  matcher: ["/backoffice/:path*"],
};
