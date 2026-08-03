import type { ReactNode } from "react";

import glosario from "../content/wiki/glosario.json";

// ── Fuente de verdad del glosario (la consume /wiki, /wiki/[termino] y el blog) ──
export type Relacion = { nombre: string; slug: string };
export type Termino = {
  slug: string;
  titulo: string;
  dominio: string;
  pilar: string;
  aliases?: string[];
  campoSemantico: string[];
  definicion: string;
  hiperonimos: Relacion[];
  hiponimos: Relacion[];
  relacionados: Relacion[];
  // Par EN (Historia 7-5 / FR-45): mismo slug, título y definición en inglés.
  tituloEn?: string;
  definicionEn?: string;
};

export type Lang = "es" | "en";

export const TERMINOS = glosario.terminos as Termino[];
export const POR_SLUG = new Map(TERMINOS.map((t) => [t.slug, t]));

// Etiquetas de dominio por locale (conjunto cerrado en el glosario).
const DOMINIO_EN: Record<string, string> = {
  Producto: "Product",
  Productos: "Products",
  Marketing: "Marketing",
  Branding: "Branding",
  Método: "Method",
};
export function dominioLabel(dominio: string, lang: Lang): string {
  return lang === "en" ? DOMINIO_EN[dominio] ?? dominio : dominio;
}

// Accesores idioma-conscientes: EN cae a ES si el término aún no está traducido.
export function tituloDe(t: Termino, lang: Lang): string {
  return lang === "en" ? t.tituloEn?.trim() || t.titulo : t.titulo;
}
export function definicionDe(t: Termino, lang: Lang): string {
  return lang === "en" ? t.definicionEn?.trim() || t.definicion : t.definicion;
}

// Base de rutas de la Wiki por locale (ES en raíz, EN bajo /en/wiki).
const wikiBase = (lang: Lang) => (lang === "en" ? "/en/wiki" : "/wiki");

// ── Índice de auto-enlazado (por idioma) ─────────────────────────────────
// Cada término (y sus alias en ES) es una frase enlazable hacia la Wiki. Se
// ordena de la frase más larga a la más corta para que «Context Driven
// Development» gane a «Context» en una misma posición.
// Palabras demasiado genéricas que coinciden con el alias de algún término de
// nicho y producen enlaces erróneos en prosa normal (p. ej. «error» → Bug,
// «continuidad» → Ley de Continuidad). No se auto-enlazan. Ampliar si aparecen más.
const STOPLIST = new Set(["error", "continuidad", "papelería", "papeleria"]);

type Enlazable = { phrase: string; slug: string; esTitulo: boolean };
type Indice = { re: RegExp | null; slugPorTexto: Map<string, string> };

function construirIndice(lang: Lang): Indice {
  const enlazables: Enlazable[] = TERMINOS.flatMap((t) => {
    // En ES enlazamos título + alias; en EN solo el título traducido (no hay
    // alias EN), evitando que aliases en español ensucien la prosa inglesa.
    const frases: Enlazable[] =
      lang === "en"
        ? [{ phrase: tituloDe(t, "en"), slug: t.slug, esTitulo: true }]
        : [
            { phrase: t.titulo, slug: t.slug, esTitulo: true },
            ...(t.aliases ?? []).map((a) => ({ phrase: a, slug: t.slug, esTitulo: false })),
          ];
    return frases.filter(
      (e) => e.phrase && e.phrase.length >= 3 && !e.phrase.includes("(") && !STOPLIST.has(e.phrase.toLowerCase()),
    );
  }).sort((a, b) => b.phrase.length - a.phrase.length);

  // En una colisión de texto, el término cuyo TÍTULO es esa frase gana sobre el
  // que solo la tiene como alias. Por eso los títulos se escriben después.
  const slugPorTexto = new Map<string, string>();
  for (const e of enlazables) if (!e.esTitulo) slugPorTexto.set(e.phrase.toLowerCase(), e.slug);
  for (const e of enlazables) if (e.esTitulo) slugPorTexto.set(e.phrase.toLowerCase(), e.slug);

  const ESC = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
  const re =
    enlazables.length > 0
      ? new RegExp(
          `(?<![\\p{L}\\p{N}])(${enlazables.map((e) => ESC(e.phrase)).join("|")})(?![\\p{L}\\p{N}])`,
          "giu",
        )
      : null;
  return { re, slugPorTexto };
}

// Memoiza el índice por idioma (se construye una sola vez por locale).
const INDICES: Partial<Record<Lang, Indice>> = {};
function indice(lang: Lang): Indice {
  return (INDICES[lang] ??= construirIndice(lang));
}

// ── React: enlaza la 1ª aparición de cada término en un texto plano (wiki) ──
export function linkifyToReact(texto: string, slugActual: string, lang: Lang = "es"): ReactNode[] {
  const { re, slugPorTexto } = indice(lang);
  if (!re) return [texto];
  const base = wikiBase(lang);
  const out: ReactNode[] = [];
  const usados = new Set<string>([slugActual]); // primera aparición; nunca a sí mismo
  let ultimo = 0;
  let k = 0;
  re.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(texto)) !== null) {
    const txt = m[1];
    const slug = slugPorTexto.get(txt.toLowerCase());
    if (!slug || usados.has(slug)) continue; // se queda como texto plano
    usados.add(slug);
    if (m.index > ultimo) out.push(texto.slice(ultimo, m.index));
    out.push(
      <a
        key={k++}
        href={`${base}/${slug}`}
        className="text-primary decoration-1 underline-offset-[3px] decoration-primary transition-colors hover:underline"
      >
        {txt}
      </a>,
    );
    ultimo = m.index + txt.length;
  }
  if (ultimo < texto.length) out.push(texto.slice(ultimo));
  return out;
}

// ── remark (mdast): enlaza la 1ª aparición de cada término en un artículo MDX ──
type MdNode = {
  type: string;
  value?: string;
  url?: string;
  children?: MdNode[];
  [k: string]: unknown;
};

// No enlazar dentro de estos nodos: ya son enlaces, código, títulos o citas.
const SKIP_PADRES = new Set([
  "link",
  "linkReference",
  "code",
  "inlineCode",
  "heading",
  "definition",
  "blockquote",
]);

function partirTexto(value: string, usados: Set<string>, idx: Indice, base: string): MdNode[] {
  if (!idx.re) return [{ type: "text", value }];
  const out: MdNode[] = [];
  let ultimo = 0;
  idx.re.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = idx.re.exec(value)) !== null) {
    const txt = m[1];
    const slug = idx.slugPorTexto.get(txt.toLowerCase());
    if (!slug || usados.has(slug)) continue;
    usados.add(slug);
    if (m.index > ultimo) out.push({ type: "text", value: value.slice(ultimo, m.index) });
    out.push({ type: "link", url: `${base}/${slug}`, children: [{ type: "text", value: txt }] });
    ultimo = m.index + txt.length;
  }
  if (ultimo < value.length) out.push({ type: "text", value: value.slice(ultimo) });
  return out.length ? out : [{ type: "text", value }];
}

/** Plugin remark: recorre el árbol y convierte la 1ª mención de cada término
 *  del glosario en un enlace a su entrada (Wiki del `lang`). Estado `usados`
 *  compartido por todo el artículo, así cada término enlaza una sola vez. */
export function remarkGlosarioLinks(lang: Lang = "es") {
  const idx = indice(lang);
  const base = wikiBase(lang);
  return (tree: MdNode) => {
    const usados = new Set<string>();
    const visitar = (node: MdNode) => {
      if (!node.children) return;
      const nuevos: MdNode[] = [];
      for (const hijo of node.children) {
        if (hijo.type === "text" && typeof hijo.value === "string") {
          nuevos.push(...partirTexto(hijo.value, usados, idx, base));
        } else {
          if (!SKIP_PADRES.has(hijo.type)) visitar(hijo);
          nuevos.push(hijo);
        }
      }
      node.children = nuevos;
    };
    visitar(tree);
  };
}
