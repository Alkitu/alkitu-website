import "../../styles/globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Alkitu Portfolio',
  description: 'Analytics and visitor tracking dashboard',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <body className="bg-background text-foreground" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
