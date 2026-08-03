import { NextResponse, type NextRequest } from "next/server";

import { enPathFor, esPathForEn } from "@/lib/i18n/routes";
import { mintSessionValue, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

/**
 * Middleware compuesto:
 *
 * 1. `/admin` — gate rápido y edge-safe: solo comprueba PRESENCIA de cookie de
 *    sesión. La validación real (sesión válida + es admin) la hace
 *    app/(private)/admin/layout.tsx con `await auth()` en runtime Node.
 * 2. Locale (Historia 7-1 / FR-41) — ES vive en la raíz sin prefijo y EN bajo
 *    /en/ con slugs traducidos (route-map.json):
 *    · `/blog`        → rewrite  → `/es/blog`        (URL pública intacta)
 *    · `/en/about`    → rewrite  → `/en/sobre-mi`    (segmento interno ES)
 *    · `/en/sobre-mi` → redirect → `/en/about`       (solo la URL pública EN es válida)
 *    · `/es/blog`     → redirect → `/blog`           (el prefijo interno no se expone)
 *    `/admin`, `/login`, `/api`, archivos con extensión y `/opengraph-image`
 *    quedan fuera del juego de locales (ver matcher).
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Superficie de participante `/p/<code>`: anónima, FUERA del árbol de locales.
  // Acuña una cookie de sesión FIRMADA (httpOnly) si falta — es la identidad
  // anónima no falsificable del participante (AD-14). No reescribe.
  if (pathname === "/p" || pathname.startsWith("/p/")) {
    const res = NextResponse.next();
    if (!req.cookies.has(SESSION_COOKIE)) {
      res.cookies.set(SESSION_COOKIE, await mintSessionValue(), sessionCookieOptions());
    }
    return res;
  }

  if (pathname.startsWith("/admin")) {
    const hasSession =
      req.cookies.has("authjs.session-token") ||
      req.cookies.has("__Secure-authjs.session-token");

    if (!hasSession) {
      const url = new URL("/login", req.url);
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const internal = esPathForEn(pathname);
    const canonical = enPathFor(internal);
    if (canonical !== pathname) {
      const url = req.nextUrl.clone();
      url.pathname = canonical;
      return NextResponse.redirect(url, 308);
    }
    const url = req.nextUrl.clone();
    url.pathname = internal === "/" ? "/en" : `/en${internal}`;
    return NextResponse.rewrite(url);
  }

  if (pathname === "/es" || pathname.startsWith("/es/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/es/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = req.nextUrl.clone();
  url.pathname = pathname === "/" ? "/es" : `/es${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/admin/:path*",
    // Todo lo demás menos: api, assets de Next, admin/login (fuera del árbol
    // de locales), una ruta oculta literal (sin
    // locale), la imagen OG raíz y cualquier ruta con extensión (archivos).
    "/((?!api|_next|admin|login|037|opengraph-image|.*\\..*).*)",
  ],
};
