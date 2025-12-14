import type { Metadata } from 'next';
import { AdminLayout } from '@/app/components/admin/AdminLayout';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Alkitu Portfolio',
  description: 'Analytics and visitor tracking dashboard',
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Check authentication
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user || error) {
    redirect('/admin/login');
  }

  // Check admin status
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!adminUser) {
    redirect('/admin/login?error=unauthorized');
  }

  return (
    <AdminLayout
      userEmail={adminUser.email}
      userName={adminUser.full_name}
    >
      {children}
    </AdminLayout>
  );
}
