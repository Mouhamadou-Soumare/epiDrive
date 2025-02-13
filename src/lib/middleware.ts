import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "" });
    const urlPath = req.nextUrl.pathname;

    const isBackOfficeRoute = urlPath.startsWith("/backoffice");
    const isAuthRoute = urlPath.startsWith("/api/auth");
    const isProfileRoute = urlPath.startsWith("/api/profile");
    const isBackOfficeApiRoute = urlPath.startsWith("/api/backoffice");

    const isAdmin = token?.id === "ADMIN"; 
    const isAuthenticated = !!token;

    if (process.env.NODE_ENV === "development") {
      console.log("Middleware check:", { urlPath, isAuthenticated, isAdmin });
    }


    if (isBackOfficeRoute) {
      if (!isAdmin) {
        console.log("Redirection vers /auth/signin car utilisateur non admin");
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    if (isAuthRoute || isProfileRoute || isBackOfficeApiRoute) {
      if (!isAuthenticated) {
        console.log("Blocage: Accès non autorisé aux API sensibles");
        return NextResponse.json({ message: "Accès non autorisé" }, { status: 401 });
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Erreur dans le middleware :", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
}

// Configuration des routes protégées

export const config = {
  matcher: [
    "/backoffice/:path*", 
    "/api/auth/:path*", 
    "/api/profile/:path*", 
    "/api/backoffice/:path*"
  ],
};
