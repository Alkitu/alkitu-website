import { Metadata } from 'next';
import { GlossaryManager } from '@/app/components/admin/glossary/GlossaryManager';

export const metadata: Metadata = {
  title: 'Glosario - Admin',
  description: 'Gestiona los términos del glosario y el interlinking automático',
};

export default function AdminGlossaryPage() {
  return <GlossaryManager />;
}
