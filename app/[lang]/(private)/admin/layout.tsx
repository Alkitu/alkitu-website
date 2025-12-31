import type { Metadata } from 'next';
import Dashboard from '@/app/components/admin/Dashboard';
import { UpdateLastLogin } from '@/app/components/admin';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Alkitu Portfolio',
  description: 'Analytics and visitor tracking dashboard',
};

/**
 * Admin Root Layout
 *
 * SECURITY: This layout does NOT perform authentication checks.
 * All /admin/* routes are protected by withAuthMiddleware in proxy.ts.
 *
 * This layout:
 * - Fetches admin user data for UI display only
 * - Renders Dashboard wrapper component
 * - Uses fallback values for edge cases
 */
export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Fetch user data for UI display (trust middleware for authentication)
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch admin user data for UI display (trust middleware for auth)
  let adminUser: {
    id: string;
    email: string;
    full_name: string | null;
    name: string;
    role: string;
  } | null = null;

  if (user) {
    const { data } = await supabase
      .from('admin_users')
      .select('id, email, full_name, name, role')
      .eq('id', user.id)
      .single();
    adminUser = data;
  }

  return (
    <>
      <UpdateLastLogin />
      <Dashboard
        userEmail={adminUser?.email || user?.email || 'Unknown User'}
        userName={adminUser?.full_name || adminUser?.name || 'Admin'}
      >
        {children}
      </Dashboard>
    </>
  );
}
