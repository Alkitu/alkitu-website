import { Metadata } from 'next';
import { Locale } from '@/i18n.config';
import { createClient } from '@/lib/supabase/server';
import { getSeoAlternates } from '@/lib/seo';
import ProjectPageClient from './ProjectPageClient';

// Fetch project data server-side for metadata + JSON-LD
async function getProject(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('projects')
    .select('slug, title_en, title_es, description_en, description_es, image, tags')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; project: string }>;
}): Promise<Metadata> {
  const { lang, project: slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  const title = lang === 'es' ? project.title_es : project.title_en;
  const description = lang === 'es' ? project.description_es : project.description_en;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: project.image ? [{ url: project.image }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: project.image ? [project.image] : [],
    },
    alternates: getSeoAlternates(lang, `/projects/${slug}`),
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ lang: Locale; project: string }>;
}) {
  const { lang, project: slug } = await params;
  const project = await getProject(slug);

  // Server-side JSON-LD so bots without JS can see structured data
  const jsonLd = project ? {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": lang === 'es' ? project.title_es : project.title_en,
    "description": lang === 'es' ? project.description_es : project.description_en,
    "image": project.image,
    "url": `https://alkitu.com/${lang}/projects/${slug}`,
    "creator": { "@type": "Organization", "name": "Alkitu" },
    "keywords": project.tags?.join(', '),
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProjectPageClient />
    </>
  );
}
