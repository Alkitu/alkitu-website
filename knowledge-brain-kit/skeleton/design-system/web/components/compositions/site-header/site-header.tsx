"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import GlassSurface from "~/components/showcase/bit-components/glass-surface/glass-surface";

/**
 * Traducción de slugs ES↔EN por prefijo de segmento más largo, a partir del
 * `route-map` (ES→EN) que la app inyecta como dato. Réplica de la lógica de
 * `apps/web/lib/i18n/routes.ts`: aquí vive en cliente para que el selector de
 * idioma pueda navegar sin acoplar el DS a módulos de la app.
 */
function translateSegments(path: string, entries: ReadonlyArray<[string, string]>): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  if (!clean) return "/";
  let best: [string, string] | undefined;
  for (const entry of entries) {
    const [from] = entry;
    if ((clean === from || clean.startsWith(`${from}/`)) && (!best || from.length > best[0].length)) {
      best = entry;
    }
  }
  return `/${best ? best[1] + clean.slice(best[0].length) : clean}`;
}

/** Ruta pública EN para una ruta ES: "/" → "/en", "/sobre-mi" → "/en/about". */
function toEnPath(esPath: string, map: Record<string, string>): string {
  const t = translateSegments(esPath, Object.entries(map));
  return t === "/" ? "/en" : `/en${t}`;
}

/** Ruta pública ES para una URL EN: "/en/about" → "/sobre-mi", "/en" → "/". */
function toEsPath(enPublicPath: string, map: Record<string, string>): string {
  const rest = enPublicPath.replace(/^\/en(?=\/|$)/, "");
  const entries = Object.entries(map).map(([es, en]) => [en, es] as [string, string]);
  return translateSegments(rest || "/", entries);
}

/**
 * ¿El navegador renderiza el filtro SVG en `backdrop-filter`? (Chromium sí;
 * Safari/Firefox no → el header conserva su fondo sólido actual). Refleja la
 * misma detección interna de GlassSurface para decidir el fallback del header.
 */
function useGlassSupported(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const ua = navigator.userAgent;
    if ((/Safari/.test(ua) && !/Chrome/.test(ua)) || /Firefox/.test(ua)) {
      setOk(false);
      return;
    }
    const el = document.createElement("div");
    el.style.backdropFilter = "url(#__glass_probe__)";
    setOk(el.style.backdropFilter !== "");
  }, []);
  return ok;
}

export type SiteHeaderNavItem = { href: string; label: string };

export type LangSwitcherCode = "es" | "en" | "et";

export type LangSwitcherOption = {
  code: LangSwitcherCode;
  /** Emoji de bandera/símbolo (🇪🇸 · 🇺🇸 · 🛸). */
  flag: string;
  /** Etiqueta corta (ES · EN · ET). */
  label: string;
  /** Texto accesible / tooltip. */
  title: string;
  /** EN queda deshabilitado hasta que exista traducción. */
  disabled?: boolean;
};

export type LangSwitcherDictionary = {
  ariaLabel: string;
  options: LangSwitcherOption[];
};

export type SiteHeaderProps = {
  nav?: SiteHeaderNavItem[];
  /** Destino del logotipo (raíz del locale actual). */
  homeHref?: string;
  /** CTA de contacto (desktop y sidebar). */
  contact?: { href: string; label: string };
  menuLabel?: string;
  openMenuLabel?: string;
  closeMenuLabel?: string;
  /** Selector de idioma (🇪🇸 ES · 🇺🇸 EN · 🛸 ET). */
  langSwitcher?: LangSwitcherDictionary;
  /** Locale de contenido actual (para marcar ES/EN como activo). */
  currentLocale?: "es" | "en";
  /**
   * Mapa de slugs ES→EN (route-map de la app) para que el selector navegue
   * entre locales manteniendo la sección actual. Si no se pasa, ES/EN no navegan.
   */
  routeMap?: Record<string, string>;
};

const DEFAULT_NAV: SiteHeaderNavItem[] = [
  { href: "/", label: "Inicio" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/blog", label: "Blog" },
  { href: "/wiki", label: "Wiki" },
  { href: "/casos-de-estudio", label: "Casos" },
  { href: "/reviews", label: "Reviews" },
];

const DEFAULT_LANG_SWITCHER: LangSwitcherDictionary = {
  ariaLabel: "Selector de idioma",
  options: [
    { code: "es", flag: "🇪🇸", label: "ES", title: "Español" },
    { code: "en", flag: "🇺🇸", label: "EN", title: "English" },
    { code: "et", flag: "🛸", label: "ET", title: "Modo Eari" },
  ],
};

/** Clave de persistencia — debe coincidir con apps/web/lib/typeface.ts. */
const TYPEFACE_KEY = "lk-typeface";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 4.5 6 7.5 9 4.5" />
    </svg>
  );
}

/**
 * Selector de idioma reutilizable (desktop y sidebar móvil): dropdown con el
 * idioma activo en el trigger y las 3 opciones (🇪🇸 · 🇺🇸 · 🛸) en el panel.
 * Presentacional — el estado del modo tipográfico vive en `SiteHeader` para
 * que ambas instancias queden sincronizadas. Cierra con click-fuera o Escape.
 */
function LangSelector({
  ariaLabel,
  options,
  activeCode,
  onSelect,
  variant,
}: {
  ariaLabel: string;
  options: LangSwitcherOption[];
  activeCode: LangSwitcherCode;
  onSelect: (code: LangSwitcherCode) => void;
  variant: "desktop" | "mobile";
}) {
  const isMobile = variant === "mobile";
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Cierre por click-fuera y Escape (dropdown no nativo → lo gestionamos).
  useEffect(() => {
    if (!open) return;
    setEntered(true);
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = options.find((o) => o.code === activeCode) ?? options[0];

  function pick(o: LangSwitcherOption) {
    if (o.disabled) return;
    onSelect(o.code);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={`relative flex items-stretch ${isMobile ? "" : "hidden lg:flex"}`}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => {
          setEntered(false);
          setOpen((v) => !v);
        }}
        className={[
          "flex items-center gap-1.5 transition-colors",
          isMobile
            ? "rounded-full border border-neutral-300 px-4 py-2 text-body text-foreground"
            : "px-5 text-body text-neutral-600 hover:text-foreground",
        ].join(" ")}
      >
        <span aria-hidden className="leading-none">
          {active.flag}
        </span>
        <span className="font-medium">{active.label}</span>
        <Chevron open={open} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={ariaLabel}
          className={[
            "absolute right-0 z-10 min-w-[10rem] rounded-2xl border border-neutral-200 bg-background p-1.5 shadow-xl shadow-black/5",
            isMobile ? "bottom-full mb-2" : "top-full mt-2",
            "origin-top transition duration-150 ease-out",
            "motion-reduce:transition-none",
            entered ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0 motion-reduce:translate-y-0",
          ].join(" ")}
        >
          {options.map((o) => {
            const isActive = o.code === activeCode;
            return (
              <button
                key={o.code}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                disabled={o.disabled}
                onClick={() => pick(o)}
                title={o.title}
                className={[
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-body transition-colors",
                  o.disabled
                    ? "cursor-not-allowed text-neutral-400"
                    : isActive
                      ? "bg-foreground/[0.06] text-foreground"
                      : "text-neutral-600 hover:bg-foreground/[0.04] hover:text-foreground",
                ].join(" ")}
              >
                <span aria-hidden className="text-[1.1em] leading-none">
                  {o.flag}
                </span>
                <span className={isActive ? "font-semibold" : undefined}>{o.label}</span>
                <span className="ml-auto flex items-center">
                  {o.disabled ? (
                    <span className="text-[11px] uppercase tracking-wide text-neutral-400">
                      {o.title.includes("soon") ? "soon" : "pronto"}
                    </span>
                  ) : isActive ? (
                    <svg aria-hidden viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3 7.5 2.5 2.5L11 4" />
                    </svg>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Header editorial claro (estilo Tresmares). Menú sidebar en móvil/tablet.
 * Piel 100% desde tokens del brand (foreground/primary/background). Chrome global
 * de tuconcepto.com. ds:compositions/site-header.
 * Todo el texto llega por props (diccionarios por locale — Historia 7-2 / FR-42);
 * los defaults ES existen solo para Storybook y usos sueltos.
 */
export function SiteHeader({
  nav = DEFAULT_NAV,
  homeHref = "/",
  contact = { href: "/contacto", label: "Contacto" },
  menuLabel = "MENÚ",
  openMenuLabel = "Abrir menú",
  closeMenuLabel = "Cerrar menú",
  langSwitcher = DEFAULT_LANG_SWITCHER,
  currentLocale = "es",
  routeMap,
}: SiteHeaderProps = {}) {
  const [open, setOpen] = useState(false);
  const [typeface, setTypeface] = useState<"normal" | "eari">("normal");
  const pathname = usePathname();
  const router = useRouter();

  // El script anti-flash ya fijó [data-typeface] en <html>; sincronizamos el
  // estado del selector tras montar (evita mismatch de hidratación).
  useEffect(() => {
    setTypeface(
      document.documentElement.getAttribute("data-typeface") === "eari"
        ? "eari"
        : "normal",
    );
  }, []);

  const applyTypeface = useCallback((next: "normal" | "eari") => {
    setTypeface(next);
    const root = document.documentElement;
    try {
      if (next === "eari") {
        root.setAttribute("data-typeface", "eari");
        localStorage.setItem(TYPEFACE_KEY, "eari");
      } else {
        root.removeAttribute("data-typeface");
        localStorage.removeItem(TYPEFACE_KEY);
      }
    } catch {
      // localStorage no disponible (modo privado): el toggle sigue vivo en DOM.
    }
  }, []);

  const onSelectLang = useCallback(
    (code: LangSwitcherCode) => {
      // ET es un modo tipográfico de ES (no cambia de URL).
      if (code === "et") {
        applyTypeface("eari");
        return;
      }
      const path = pathname ?? "/";
      const enIngles = path === "/en" || path.startsWith("/en/");
      if (code === "en") {
        // ES → EN: navega a la sección equivalente bajo /en/ (slugs traducidos).
        if (!enIngles && routeMap) router.push(toEnPath(path, routeMap));
        return;
      }
      // code === "es": desde EN vuelve a la raíz ES; desde ES apaga la tipografía ET.
      if (enIngles && routeMap) {
        router.push(toEsPath(path, routeMap));
        return;
      }
      applyTypeface("normal");
    },
    [applyTypeface, pathname, router, routeMap],
  );

  const activeCode: LangSwitcherCode =
    typeface === "eari" ? "et" : currentLocale === "en" ? "en" : "es";

  // Cristal líquido (ReactBits GlassSurface) solo en navegadores que renderizan el
  // filtro SVG en backdrop-filter (Chromium). En Safari/Firefox el hook devuelve
  // false → el header conserva su fondo actual (bg-background/85 + blur medio).
  //
  // ⏸️ v2 EN PAUSA: el glass está desactivado para todos (header default) hasta
  // terminar de ajustarlo. Reactivar = poner GLASS_ENABLED = true. El hook se
  // sigue llamando siempre (rules-of-hooks) para no perder la detección.
  const GLASS_ENABLED = false;
  const glassSupported = useGlassSupported();
  const glass = GLASS_ENABLED && glassSupported;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 ${
          glass
            ? ""
            : "border-b border-neutral-300/70 bg-background/85 backdrop-blur-md"
        }`}
      >
        {glass ? (
          <GlassSurface
            className="border-b border-white/25"
            style={{ position: "absolute", inset: 0 }}
            width="100%"
            height="100%"
            borderRadius={0}
            backgroundOpacity={0.9}
            saturation={1.4}
            brightness={70}
            blur={11}
            displace={6}
            distortionScale={-110}
          />
        ) : null}
        <div className="relative z-10 mx-auto flex h-16 max-w-page items-stretch justify-between">
          <a
            href={homeHref}
            className="flex items-center gap-2 px-6 text-body font-medium tracking-[0.14em] text-foreground"
          >
            {/* Isotipo: mask sobre currentColor → hereda la tinta del wordmark (light-mode). */}
            <span
              aria-hidden="true"
              className="block flex-none"
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: "currentColor",
                WebkitMask: 'url("/logo-dark.svg") center / contain no-repeat',
                mask: 'url("/logo-dark.svg") center / contain no-repeat',
              }}
            />
            [BRAND]
          </a>

          <nav className="hidden items-center gap-9 px-6 text-body text-neutral-600 lg:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="transition-colors hover:text-foreground">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-stretch">
            <LangSelector
              ariaLabel={langSwitcher.ariaLabel}
              options={langSwitcher.options}
              activeCode={activeCode}
              onSelect={onSelectLang}
              variant="desktop"
            />
            <a href={contact.href} className="hidden items-center bg-foreground px-8 text-body text-background transition-colors hover:opacity-90 lg:flex">
              {contact.label}
            </a>

            {/* Hamburguesa (móvil/tablet) — mismo bloque negro que el CTA de contacto en desktop */}
            <button onClick={() => setOpen(true)} className="flex items-center bg-foreground px-6 text-background lg:hidden" aria-label={openMenuLabel}>
              <span className="flex flex-col gap-[5px]">
                <span className="block h-[2px] w-6 bg-background" />
                <span className="block h-[2px] w-6 bg-background" />
                <span className="block h-[2px] w-6 bg-background" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar desplegable (móvil/tablet) */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute inset-y-0 right-0 flex w-[82%] max-w-sm flex-col bg-background shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex h-16 items-center justify-between border-b border-neutral-300/70 px-6">
            <span className="text-small font-bold tracking-[0.2em] text-neutral-600">{menuLabel}</span>
            <button onClick={() => setOpen(false)} aria-label={closeMenuLabel} className="text-3xl leading-none text-foreground">
              ×
            </button>
          </div>
          <nav className="flex flex-col px-6 pt-2 text-[26px] font-medium text-foreground">
            {nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="border-b border-neutral-200 py-4">
                {n.label}
              </a>
            ))}
            {/* Contacto como una opción más de la lista (no un pill pequeño abajo). */}
            <a href={contact.href} onClick={() => setOpen(false)} className="border-b border-neutral-200 py-4">
              {contact.label}
            </a>
          </nav>
          <div className="mt-auto flex items-center gap-4 border-t border-neutral-300/70 px-6 py-5">
            <LangSelector
              ariaLabel={langSwitcher.ariaLabel}
              options={langSwitcher.options}
              activeCode={activeCode}
              onSelect={onSelectLang}
              variant="mobile"
            />
          </div>
        </aside>
      </div>
    </>
  );
}
