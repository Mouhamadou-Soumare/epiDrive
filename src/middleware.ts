import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || "",
    });

    const urlPath = req.nextUrl.pathname;
    const isApiRoute = urlPath.startsWith("/api/");
    const isAuthRoute = urlPath.startsWith("/api/auth"); 
    const isBackOfficeRoute = urlPath.startsWith("/backoffice");
    const isBackOfficeApiRoute = urlPath.startsWith("/api/backoffice");

    const isAdmin = token?.role === "ADMIN";
    const isAuthenticated = !!token;

   

    // 🔐 Protéger toutes les routes `/api/*` sauf `/api/auth`
    if (isApiRoute && !isAuthRoute && !isAuthenticated) {
      console.log(" Accès refusé: utilisateur non authentifié.");
      return NextResponse.json(
        { message: "Accès non autorisé" },
        { status: 401 }
      );
    }

    // 🔐 Bloquer l'accès au back-office sauf pour les ADMIN
    if (isBackOfficeRoute || isBackOfficeApiRoute) {
      if (!isAdmin) {
        console.log("Accès refusé: utilisateur non admin.");
        return NextResponse.json(
          { message: "Accès interdit - Admin uniquement" },
          { status: 403 }
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error(" Erreur dans le middleware :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: ["/backoffice/:path*"],
};
