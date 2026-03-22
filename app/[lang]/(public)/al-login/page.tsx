import { Metadata } from 'next';
import { Locale } from '@/i18n.config';
import LoginPage from './LoginPage';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'es' ? 'Iniciar Sesión' : 'Login',
    robots: { index: false },
  };
}

export default function Page() {
  return <LoginPage />;
}
