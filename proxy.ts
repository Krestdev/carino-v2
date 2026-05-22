import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const isMaintenanceMode =
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  const { pathname } = req.nextUrl;

  const isAccessingMaintenancePage =
    pathname.startsWith("/maintenance");

  let response: NextResponse;

  // =========================
  // MAINTENANCE
  // =========================

  if (isMaintenanceMode) {
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
      response = NextResponse.next();
    } else {
      response = NextResponse.redirect(
        new URL("/maintenance", req.url)
      );
    }
  } else {
    if (isAccessingMaintenancePage) {
      response = NextResponse.redirect(
        new URL("/", req.url)
      );
    } else {
      response = NextResponse.next();
    }
  }

  // =========================
  // CORS
  // =========================

  response.headers.set(
    "Access-Control-Allow-Origin",
    "*"
  );

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};