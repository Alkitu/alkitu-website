"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Home,
  LayoutDashboard,
  Menu,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  hint: string;
  icon: LucideIcon;
};

const ITEMS: NavItem[] = [
  { href: "/admin", label: "Resumen", hint: "Inventario del sitio", icon: LayoutDashboard },
  { href: "/admin/inicio", label: "Inicio", hint: "Casos en portada", icon: Home },
  { href: "/admin/analiticas", label: "Analíticas", hint: "Visitas, países, tops", icon: BarChart3 },
  { href: "/admin/seo", label: "SEO · GEO", hint: "KPIs y checklist", icon: Search },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={[
              "group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors",
              active
                ? "bg-foreground/[0.06] text-foreground"
                : "text-neutral-600 hover:bg-foreground/[0.03] hover:text-foreground",
            ].join(" ")}
          >
            <Icon
              className={`mt-0.5 h-[18px] w-[18px] shrink-0 ${active ? "text-primary" : "text-neutral-400 group-hover:text-foreground"}`}
              strokeWidth={1.75}
            />
            <span className="min-w-0">
              <span className="block text-[15px] font-medium leading-tight">{item.label}</span>
              <span className="block text-xs text-neutral-400">{item.hint}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

/** Barra lateral del panel (solo desktop). Debe ir DENTRO de la fila flex del layout. */
export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-16 hidden h-[calc(100svh-4rem)] w-64 shrink-0 border-r border-neutral-300/70 px-4 py-8 md:block">
      <p className="px-3 pb-4 text-xs uppercase tracking-[0.18em] text-neutral-400">Panel</p>
      <NavList pathname={pathname} />
    </aside>
  );
}

/**
 * Navegación móvil del panel: barra superior (ancho completo, ARRIBA de la fila
 * flex — no un hermano que aplaste el contenido) con botón hamburguesa que abre
 * un cajón (drawer) deslizante con los enlaces.
 */
export function AdminMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const activo = ITEMS.find((i) => isActive(pathname, i.href));

  // Bloquea el scroll del fondo mientras el drawer está abierto.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <div className="sticky top-16 z-30 flex items-center justify-between border-b border-neutral-300/70 bg-background/90 px-4 py-3 backdrop-blur-md">
        <span className="min-w-0 truncate text-sm font-medium text-neutral-700">
          <span className="text-neutral-400">Panel · </span>
          {activo?.label ?? "Admin"}
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú del panel"
          className="flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700"
        >
          <Menu className="h-4 w-4" strokeWidth={2} />
          Menú
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-background p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">Panel</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="rounded-lg p-1 text-neutral-500 hover:bg-foreground/[0.05]"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
            <NavList pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
