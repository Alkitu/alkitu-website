import type { Metadata } from 'next';
import Dashboard from '@/app/components/admin/Dashboard';
import { UpdateLastLogin } from '@/app/components/admin';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Providers from '@/app/context/Providers';
import es from '@/app/dictionaries/es.json';
import '@/styles/globals.css';

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
    redirect('/auth/login');
  }

  // Check admin status
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!adminUser) {
    redirect('/auth/login?error=unauthorized');
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const getCookie = (name) => {
                    const value = document.cookie.match('(^|;)\\\\s*' + name + '\\\\s*=\\\\s*([^;]+)');
                    return value ? value.pop() : null;
                  };

                  let theme = getCookie('theme');

                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    document.cookie = 'theme=' + theme + '; path=/; max-age=31536000; SameSite=Strict';
                  }

                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground font-body" suppressHydrationWarning>
        <Providers locale="es" initialTranslations={es}>
            <UpdateLastLogin />
            <Dashboard
              userEmail={adminUser.email}
              userName={adminUser.full_name}
            >
              {children}
            </Dashboard>
        </Providers>
      </body>
    </html>
  );
}
