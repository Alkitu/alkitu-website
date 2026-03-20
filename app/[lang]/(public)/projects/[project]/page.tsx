import { Metadata } from 'next';
import { Locale } from '@/i18n.config';
import { createClient } from '@/lib/supabase/server';
import ProjectPageClient from './ProjectPageClient';

// Fetch project data server-side for metadata
async function getProject(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('projects')
    .select('slug, title_en, title_es, description_en, description_es, image')
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
    title, // Uses template from layout: "%s | Alkitu"
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
  };
}

export default function ProjectPage() {
  return <ProjectPageClient />;
}
