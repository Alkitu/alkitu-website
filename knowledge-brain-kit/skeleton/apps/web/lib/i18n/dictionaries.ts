import type {
  SiteHeaderNavItem,
  LangSwitcherDictionary,
} from "@brain/design-system-web/compositions/site-header";
import type { SiteFooterNavItem } from "@brain/design-system-web/compositions/site-footer";
import type { PaginacionLabels } from "@brain/design-system-web/compositions/paginacion";

import type { Locale } from "./config";
import { enPathFor } from "./routes";

/**
 * Diccionarios del chrome (Historia 7-2 / FR-42): header, footer y labels de UI
 * por locale. El chrome del DS no lleva texto propio: [lang]/layout.tsx y
 * (private)/layout.tsx pasan SIEMPRE estos valores. Los href EN salen de
 * enPathFor() (mapa route-map.json) para que no haya drift con el routing.
 */
export type ChromeDictionary = {
  header: {
    homeHref: string;
    nav: SiteHeaderNavItem[];
    contact: { href: string; label: string };
    menuLabel: string;
    openMenuLabel: string;
    closeMenuLabel: string;
    langSwitcher: LangSwitcherDictionary;
  };
  footer: {
    nav: SiteFooterNavItem[];
  };
  paginacion: PaginacionLabels;
};

const es: ChromeDictionary = {
  header: {
    homeHref: "/",
    nav: [
      { href: "/", label: "Inicio" },
      { href: "/sobre-mi", label: "Sobre mí" },
      { href: "/blog", label: "Blog" },
      { href: "/wiki", label: "Wiki" },
      { href: "/casos-de-estudio", label: "Casos" },
      { href: "/reviews", label: "Reviews" },
    ],
    contact: { href: "/contacto", label: "Contacto" },
    menuLabel: "MENÚ",
    openMenuLabel: "Abrir menú",
    closeMenuLabel: "Cerrar menú",
    langSwitcher: {
      ariaLabel: "Selector de idioma",
      options: [
        { code: "es", flag: "🇪🇸", label: "ES", title: "Español" },
        { code: "en", flag: "🇺🇸", label: "EN", title: "English" },
        { code: "et", flag: "🛸", label: "ET", title: "Modo ET: tipografía de otro planeta" },
      ],
    },
  },
  footer: {
    nav: [
      { href: "/blog", label: "Blog" },
      { href: "/wiki", label: "Wiki" },
      { href: "/reviews", label: "Reviews" },
      { href: "/casos-de-estudio", label: "Casos" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
  paginacion: {
    mostrando: "Mostrando",
    de: "de",
    porPagina: "Por página",
    todos: "Todos",
    pagina: "Página",
    porPaginaAria: "Elementos por página",
    anteriorAria: "Página anterior",
    siguienteAria: "Página siguiente",
  },
};

const en: ChromeDictionary = {
  header: {
    homeHref: enPathFor("/"),
    nav: [
      { href: enPathFor("/"), label: "Home" },
      { href: enPathFor("/sobre-mi"), label: "About" },
      { href: enPathFor("/blog"), label: "Blog" },
      { href: enPathFor("/wiki"), label: "Wiki" },
      { href: enPathFor("/casos-de-estudio"), label: "Case studies" },
      { href: enPathFor("/reviews"), label: "Reviews" },
    ],
    contact: { href: enPathFor("/contacto"), label: "Contact" },
    menuLabel: "MENU",
    openMenuLabel: "Open menu",
    closeMenuLabel: "Close menu",
    langSwitcher: {
      ariaLabel: "Language selector",
      options: [
        { code: "es", flag: "🇪🇸", label: "ES", title: "Spanish" },
        { code: "en", flag: "🇺🇸", label: "EN", title: "English" },
        { code: "et", flag: "🛸", label: "ET", title: "ET mode — out-of-this-world type" },
      ],
    },
  },
  footer: {
    nav: [
      { href: enPathFor("/blog"), label: "Blog" },
      { href: enPathFor("/wiki"), label: "Wiki" },
      { href: enPathFor("/reviews"), label: "Reviews" },
      { href: enPathFor("/casos-de-estudio"), label: "Case studies" },
      { href: enPathFor("/contacto"), label: "Contact" },
    ],
  },
  paginacion: {
    mostrando: "Showing",
    de: "of",
    porPagina: "Per page",
    todos: "All",
    pagina: "Page",
    porPaginaAria: "Items per page",
    anteriorAria: "Previous page",
    siguienteAria: "Next page",
  },
};

const DICTIONARIES: Record<Locale, ChromeDictionary> = { es, en };

export function getDictionary(lang: Locale): ChromeDictionary {
  return DICTIONARIES[lang];
}
