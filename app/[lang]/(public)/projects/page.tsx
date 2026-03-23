import { Metadata } from 'next';
import { Locale } from '@/i18n.config';
import { getSeoAlternates } from '@/lib/seo';
import { Breadcrumbs } from '@/app/components/molecules/breadcrumbs';
import ProjectsPage from './ProjectsPage';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'es' ? 'Proyectos' : 'Projects',
    description: lang === 'es'
      ? 'Portfolio de proyectos digitales de Alkitu'
      : 'Alkitu digital projects portfolio',
    alternates: getSeoAlternates(lang, '/projects'),
  };
}

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return (
    <>
      <Breadcrumbs
        locale={lang}
        items={[
          { label: lang === 'es' ? 'Inicio' : 'Home', href: '' },
          { label: lang === 'es' ? 'Proyectos' : 'Projects' },
        ]}
      />
      <ProjectsPage />
    </>
  );
}
