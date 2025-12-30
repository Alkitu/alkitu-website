import type { Metadata } from 'next';
import Dashboard from '@/app/components/admin/Dashboard';
import { UpdateLastLogin } from '@/app/components/admin';
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
    redirect('/es/auth/login');
  }

  // Check admin status
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!adminUser) {
    redirect('/es/auth/login?error=unauthorized');
  }

  return (
    <>
      <UpdateLastLogin />
      <Dashboard
        userEmail={adminUser.email}
        userName={adminUser.full_name}
      >
        {children}
      </Dashboard>
    </>
  );
}
