"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Tracker de analítica propia (montado en el layout público). En cada cambio de
 * ruta registra una page_view (/api/analytics/hit) y, al abandonar la página,
 * envía el tiempo en página con sendBeacon (/api/analytics/leave). No renderiza
 * nada. Excluye /admin y /login (además el servidor los vuelve a filtrar).
 */
export function VisitTracker() {
  const pathname = usePathname();
  const pvId = useRef<string | null>(null);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/login")) {
      return;
    }

    // Opt-out de auto-conteo (para tus propios dispositivos): visitar
    // cualquier página con ?notrack=1 marca este navegador y deja de contarse;
    // ?notrack=0 lo revierte. Mientras el flag esté puesto, no se registra nada.
    try {
      const nt = new URLSearchParams(window.location.search).get("notrack");
      if (nt === "1") localStorage.setItem("lk-no-track", "1");
      else if (nt === "0") localStorage.removeItem("lk-no-track");
      if (localStorage.getItem("lk-no-track") === "1") return;
    } catch {
      /* localStorage no disponible: seguir con el tracking normal */
    }

    let cancelled = false;
    pvId.current = null;
    startedAt.current = Date.now();

    fetch("/api/analytics/hit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
        locale: document.documentElement.lang || null,
      }),
      keepalive: true,
    })
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        if (j?.pvId) pvId.current = j.pvId;
        // sessionId disponible para atribuir el formulario de contacto.
        if (j?.sessionId) {
          try {
            sessionStorage.setItem("lk-sid", j.sessionId);
          } catch {}
        }
      })
      .catch(() => {});

    const flush = () => {
      if (!pvId.current) return;
      const seconds = Math.round((Date.now() - startedAt.current) / 1000);
      const blob = new Blob(
        [JSON.stringify({ pvId: pvId.current, timeOnPage: seconds })],
        { type: "application/json" },
      );
      navigator.sendBeacon("/api/analytics/leave", blob);
      pvId.current = null;
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      flush();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pathname]);

  return null;
}
