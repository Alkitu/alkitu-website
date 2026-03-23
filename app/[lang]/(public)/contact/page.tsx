import { Metadata } from 'next';
import { Locale } from '@/i18n.config';
import { getSeoAlternates } from '@/lib/seo';
import { Breadcrumbs } from '@/app/components/molecules/breadcrumbs';
import ContactPage from './ContactPage';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'es' ? 'Contacto' : 'Contact',
    description: lang === 'es'
      ? 'Contacta con Alkitu para tu próximo proyecto digital'
      : 'Contact Alkitu for your next digital project',
    alternates: getSeoAlternates(lang, '/contact'),
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
          { label: lang === 'es' ? 'Contacto' : 'Contact' },
        ]}
      />
      <ContactPage />
    </>
  );
}
