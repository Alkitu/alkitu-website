export type SiteFooterNavItem = { href: string; label: string };

const DEFAULT_NAV: SiteFooterNavItem[] = [
  { href: "/blog", label: "Blog" },
  { href: "/wiki", label: "Wiki" },
  { href: "/reviews", label: "Reviews" },
  { href: "/casos-de-estudio", label: "Casos" },
  { href: "/contacto", label: "Contacto" },
];

/**
 * Footer editorial de tuconcepto.com. Piel desde tokens (primary para el punto
 * de marca). Chrome global. ds:compositions/site-footer.
 */
export function SiteFooter({ nav = DEFAULT_NAV }: { nav?: SiteFooterNavItem[] } = {}) {
  return (
    <footer className="border-t border-neutral-300/70">
      <div className="mx-auto flex max-w-page flex-col items-center justify-between gap-6 px-6 py-12 text-sm text-neutral-600 md:flex-row">
        <span className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          © 2026 [Brand]
        </span>
        <nav className="flex flex-wrap justify-center gap-7">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="transition-colors hover:text-neutral-800">
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
