import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_HOST = "admin.shehryar-raza.dev";

/**
 * Serves the admin portal on its own subdomain.
 *
 * `admin.shehryar-raza.dev/*` is rewritten onto the `/admin` route, so the
 * portal keeps a clean URL without needing a second Vercel project. Requests
 * to `/admin` on the main domain are redirected to the subdomain so there is
 * only ever one address for it.
 *
 * This is routing only — it is not the access control. Authentication happens
 * in the page, and the real boundary is the email check in `firestore.rules`.
 */
export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? "";
  const { pathname } = request.nextUrl;

  if (host === ADMIN_HOST) {
    // Static assets and the report endpoint stay where they are.
    if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.rewrite(url);
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return NextResponse.redirect(new URL(`https://${ADMIN_HOST}/`));
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals and static files; everything else passes through.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
