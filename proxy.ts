import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
  const { pathname } = req.nextUrl;

  // Vérifier si l'utilisateur tente d'accéder à /maintenance
  const isAccessingMaintenancePage = pathname.startsWith("/maintenance");

  // Si mode maintenance ACTIVÉ
  if (isMaintenanceMode) {
    // Autoriser l'accès à la page maintenance et aux assets statiques
    if (
      isAccessingMaintenancePage ||
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/favicon.ico") ||
      pathname.startsWith("/robots.txt") ||
      pathname.startsWith("/manifest.json") ||
      pathname.endsWith(".png") ||
      pathname.endsWith(".jpg") ||
      pathname.endsWith(".jpeg") ||
      pathname.endsWith(".svg")
    ) {
      return NextResponse.next();
    }

    // Rediriger toutes les autres pages vers /maintenance
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }

  // Si mode maintenance DÉSACTIVÉ
  else {
    // Bloquer l'accès à /maintenance et rediriger vers la racine
    if (isAccessingMaintenancePage) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Autoriser toutes les autres pages
    return NextResponse.next();
  }
}

// Appliquer le middleware à toutes les routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
