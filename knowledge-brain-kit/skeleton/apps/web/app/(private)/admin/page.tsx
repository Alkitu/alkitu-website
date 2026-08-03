import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getAllPosts } from "@/lib/content/blog";
import { TERMINOS } from "@/lib/glosario";
import { getReviewSlugs } from "../../[lang]/reviews/_data/reviews";
import { SLUGS_CASOS } from "../../[lang]/casos-de-estudio/_data/casos";
import { AdminPageHeader } from "@brain/design-system-web/patterns/admin-page-header";

// Resumen del panel (Historia 5-2 / FR-28): cada cifra es un dato REAL. El
// inventario sale del contenido y de Mongo; la analítica de tráfico vive ahora
// en su propia sección (/admin/analiticas), ya con pipeline real.
export const dynamic = "force-dynamic";

const publicar = [
  { titulo: "Blog", descripcion: "Artículos y notas de campo." },
  { titulo: "Wiki", descripcion: "Glosario y conocimiento evergreen." },
  { titulo: "Review", descripcion: "Reseñas de herramientas y libros." },
  { titulo: "Caso", descripcion: "Casos de estudio de producto." },
];

/** Cuenta real de una colección de Mongo; "sin datos" si la conexión/consulta falla. */
async function cuentaMongo(coleccion: string): Promise<string> {
  try {
    const { default: clientPromise } = await import("@/lib/mongodb");
    const client = await clientPromise;
    // BD explícita "knowledge_brain" (la que usa Auth.js); client.db() sin nombre
    // apuntaba a la BD por defecto del URI → contaba 0 usuarios.
    const n = await client.db("knowledge_brain").collection(coleccion).countDocuments();
    return String(n);
  } catch {
    return "sin datos";
  }
}

export default async function AdminPage() {
  const posts = await getAllPosts();
  const usuarios = await cuentaMongo("users");

  const inventario = [
    { value: String(posts.length), label: "Artículos", nota: "en el blog" },
    { value: String(TERMINOS.length), label: "Términos", nota: "en la wiki" },
    { value: String(getReviewSlugs().length), label: "Reviews", nota: "publicadas" },
    { value: String(SLUGS_CASOS.length), label: "Casos", nota: "de estudio" },
    { value: usuarios, label: "Usuarios", nota: "registrados (Mongo)" },
  ];

  return (
    <>
      <AdminPageHeader
        title="Resumen"
        description="Inventario real del sitio y accesos rápidos. Sin cifras de muestra."
      />

      {/* INVENTARIO (datos reales) */}
      <section>
        <div className="mb-6 flex items-baseline justify-between gap-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
            Inventario
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {inventario.map((kpi) => (
            <div key={kpi.label} className="border-t border-neutral-300/70 pt-5">
              <p className="font-bold leading-none tracking-[-0.04em] text-primary text-[clamp(1.9rem,4vw,3rem)]">
                {kpi.value}
              </p>
              <p className="mt-4 text-[15px] font-medium text-foreground">{kpi.label}</p>
              <p className="mt-1 text-sm text-neutral-400">{kpi.nota}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ACCESO A ANALÍTICAS */}
      <section className="mt-14">
        <Link
          href="/admin/analiticas"
          className="group flex items-center justify-between gap-6 rounded-2xl border border-neutral-300/70 p-7 transition-colors hover:border-foreground/40 md:p-9"
        >
          <div>
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
              Analíticas de tráfico
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">
              Visitas, visitantes únicos, países y las páginas más abiertas por sección.
            </p>
          </div>
          <ArrowRight
            className="h-6 w-6 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-foreground"
            strokeWidth={1.75}
          />
        </Link>
      </section>

      {/* PUBLICAR (mini-CMS — pendiente) */}
      <section className="mt-14">
        <div className="mb-6 flex items-baseline justify-between gap-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
            Publicar
          </h2>
          <span className="text-sm text-neutral-400">Mini-CMS · próximamente</span>
        </div>
        <div className="grid gap-x-12 sm:grid-cols-2">
          {publicar.map((item) => (
            <div
              key={item.titulo}
              className="flex items-start justify-between gap-6 border-t border-neutral-300/70 py-7"
            >
              <div>
                <h3 className="mb-1.5 text-xl font-semibold tracking-tight">
                  {item.titulo}
                </h3>
                <p className="text-[15px] leading-relaxed text-neutral-500">
                  {item.descripcion}
                </p>
              </div>
              <span className="mt-1 shrink-0 text-sm text-neutral-400">Próximamente</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
