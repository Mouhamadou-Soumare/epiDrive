import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "" });
    const urlPath = req.nextUrl.pathname;

    const isBackOfficeRoute = urlPath.startsWith("/backoffice");
    const protectedRoutes = ["/api/auth", "/api/profile", "/api/backoffice"];
    const isProtectedRoute = protectedRoutes.some((route) => urlPath.startsWith(route));

    const isAdmin = token?.id === "ADMIN";  // ✅ Correction ici
    const isAuthenticated = !!token;

    // Debug uniquement en développement
    if (process.env.NODE_ENV === "development") {
      console.log("Middleware check:", { urlPath, isAuthenticated, isAdmin });
    }

    if (isBackOfficeRoute && !isAdmin) {
      return NextResponse.redirect("/auth/signin");
    }

    if (isProtectedRoute && !isAuthenticated) {
      return NextResponse.json({ message: "Accès non autorisé" }, { status: 401 });
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Erreur dans le middleware :", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
}

// 🎯 Configuration des routes protégées
export const config = {
  matcher: ["/backoffice/:path*", "/api/auth/:path*", "/api/profile/:path*", "/api/backoffice/:path*"],
};
