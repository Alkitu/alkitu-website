import { Metadata } from 'next';
import { Locale } from '@/i18n.config';
import ProjectsPage from './ProjectsPage';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'es' ? 'Proyectos' : 'Projects',
    description: lang === 'es'
      ? 'Portfolio de proyectos digitales de Alkitu'
      : 'Alkitu digital projects portfolio',
  };
}

export default function Page() {
  return <ProjectsPage />;
}
