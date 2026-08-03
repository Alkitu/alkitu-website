import { CASOS, SLUGS_CASOS } from "@/app/[lang]/casos-de-estudio/_data/casos";
import { getAllPosts } from "@/lib/content/blog";
import {
  BLOG_HOME_MAX,
  CASOS_HOME_MAX,
  getHomeBlogSlugs,
  getHomeCasosSlugs,
} from "@/lib/home/config";
import { AdminPageHeader } from "@brain/design-system-web/patterns/admin-page-header";

import { guardarBlogHome, guardarCasosHome } from "./_actions";
import { ListaOrdenable, type ItemOrden } from "./_components/ListaOrdenable";

export const dynamic = "force-dynamic";

export default async function AdminInicioPage() {
  const [ordenCasos, ordenBlog, posts] = await Promise.all([
    getHomeCasosSlugs(),
    getHomeBlogSlugs(),
    getAllPosts(),
  ]);

  const casos: ItemOrden[] = SLUGS_CASOS.map((slug) => ({ id: slug, titulo: CASOS[slug].titulo }));
  const blog: ItemOrden[] = posts.map((p) => ({ id: p.slug, titulo: p.frontmatter.title }));
  // Blog sin config previa → se siembra con el orden por defecto (reciente→antiguo).
  const ordenBlogInicial = ordenBlog.length ? ordenBlog : blog.map((b) => b.id);

  return (
    <>
      <AdminPageHeader
        title="Inicio"
        description="Elige qué casos, experimentos y artículos aparecen en la portada y en qué orden."
      />

      <div className="flex flex-col gap-14">
        <section>
          <h2 className="mb-1 text-xl font-semibold tracking-tight">Casos de estudio</h2>
          <p className="mb-5 text-sm text-neutral-500">
            Se apilan en la portada; se muestran los primeros {CASOS_HOME_MAX}.
          </p>
          <ListaOrdenable
            items={casos}
            ordenInicial={ordenCasos}
            guardar={guardarCasosHome}
            maxHome={CASOS_HOME_MAX}
            ayuda={`Se muestran los primeros ${CASOS_HOME_MAX} · ordena con las flechas`}
          />
        </section>

        <section>
          <h2 className="mb-1 text-xl font-semibold tracking-tight">Blog</h2>
          <p className="mb-5 text-sm text-neutral-500">
            Galería de artículos en la portada; se muestran los primeros {BLOG_HOME_MAX}.
          </p>
          <ListaOrdenable
            items={blog}
            ordenInicial={ordenBlogInicial}
            guardar={guardarBlogHome}
            maxHome={BLOG_HOME_MAX}
            ayuda={`Se muestran los primeros ${BLOG_HOME_MAX} · ordena con las flechas`}
          />
        </section>
      </div>
    </>
  );
}
