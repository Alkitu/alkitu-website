import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AnalyticsDashboard } from '@/app/components/admin/AnalyticsDashboard';

export default async function AdminDashboard() {
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

  return <AnalyticsDashboard user={adminUser} />;
}
