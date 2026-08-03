import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BlogEditor, type BlogFormState } from '@/app/components/admin/blog/BlogEditor';

export const metadata: Metadata = {
  title: 'Editar post - Admin',
};

/**
 * Loads the post server-side so the editor mounts already populated, rather
 * than flashing an empty form while a client fetch resolves.
 *
 * Uses the cookie-bound client on purpose: this is an admin route, and the
 * `admin_all_blog_posts` policy is what allows drafts to be read here.
 */
export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) notFound();

  const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

  const initial: BlogFormState = {
    id: data.id,
    title: data.title ?? '',
    slug: data.slug ?? '',
    locale: data.locale,
    categoria: data.categoria ?? '',
    categoria_slug: data.categoria_slug ?? undefined,
    canonical: data.canonical,
    titulo_seo: data.titulo_seo,
    metadescripcion: data.metadescripcion,
    keyword_principal: data.keyword_principal,
    keywords_secundarias: arr<string>(data.keywords_secundarias),
    tags: arr<string>(data.tags),
    intencion_busqueda: data.intencion_busqueda,
    geo_preguntas: arr<string>(data.geo_preguntas),
    geo_respuestas: arr<string>(data.geo_respuestas),
    geo_respuesta_corta: data.geo_respuesta_corta,
    geo_entidades: arr<string>(data.geo_entidades),
    schema_tipo: data.schema_tipo ?? 'Article',
    prioridad: data.prioridad ?? 0.7,
    frecuencia_cambio: data.frecuencia_cambio ?? 'yearly',
    body_mdx: data.body_mdx ?? '',
    extracto: data.extracto,
    portada: data.portada,
    portada_alt: data.portada_alt,
    portada_credito: data.portada_credito,
    lectura: data.lectura,
    autor: data.autor,
    autor_rol: data.autor_rol,
    author_username: data.author_username,
    aliases: arr<string>(data.aliases),
    campo_semantico: arr<string>(data.campo_semantico),
    relacionado: arr<string>(data.relacionado),
    featured: data.featured ?? false,
    estado: data.estado ?? 'borrador',
    published: data.published ?? false,
  };

  return <BlogEditor initial={initial} />;
}
