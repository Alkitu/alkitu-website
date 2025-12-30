import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/dictionary";
import { BlogContent } from "@/app/components/organisms/blog-content";
import blogData from "@/app/data/blog-posts.json";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);

  // Prepare translations for BlogContent
  const translations = {
    all: text.blog?.all || (lang === 'es' ? 'Todos' : 'All'),
    recent: text.blog?.recent || (lang === 'es' ? 'Recientes' : 'Recent'),
    emprendimiento: text.blog?.emprendimiento || 'Emprendimiento',
    desarrolloWeb: text.blog?.desarrolloWeb || 'Desarrollo Web',
    publicidad: text.blog?.publicidad || 'Publicidad',
    disenoGrafico: text.blog?.disenoGrafico || 'Diseño Gráfico',
    socialMedia: text.blog?.socialMedia || 'Social Media',
    marketing: text.blog?.marketing || 'Marketing',
    otrasPublicaciones: text.blog?.otrasPublicaciones || (lang === 'es' ? 'Otras Publicaciones' : 'Other Publications'),
  };

  return (
    <BlogContent
      posts={blogData.posts}
      categories={blogData.categories}
      locale={lang}
      title={text.blog?.title || (lang === 'es' ? 'BLOG' : 'BLOG')}
      description={text.blog?.description}
      translations={translations}
    />
  );
}
