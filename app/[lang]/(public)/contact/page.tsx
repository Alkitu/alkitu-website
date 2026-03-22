import { Metadata } from 'next';
import { Locale } from '@/i18n.config';
import ContactPage from './ContactPage';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'es' ? 'Contacto' : 'Contact',
    description: lang === 'es'
      ? 'Contacta con Alkitu para tu próximo proyecto digital'
      : 'Contact Alkitu for your next digital project',
  };
}

export default function Page() {
  return <ContactPage />;
}
