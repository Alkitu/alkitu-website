import { DashboardRoutes } from '@/app/types/dashboard';

export const dashboardRoutesData: DashboardRoutes = {
  version: '1.0.0',
  lastUpdated: '2025-01-14T00:00:00Z',
  routes: [
    {
      id: 'dashboard',
      label: {
        en: 'Dashboard',
        es: 'Dashboard',
      },
      href: '/admin/dashboard',
      icon: 'Home',
      type: 'direct',
      access: {
        roles: ['admin'],
      },
    },
    {
      id: 'analytics',
      label: {
        en: 'Analytics',
        es: 'Analytics',
      },
      href: '/admin/analytics',
      icon: 'BarChart3',
      type: 'accordion',
      access: {
        roles: ['admin'],
      },
      subItems: [
        {
          id: 'analytics-overview',
          label: {
            en: 'Overview',
            es: 'Resumen',
          },
          href: '/admin/dashboard#analytics',
          icon: 'BarChart3',
        },
        {
          id: 'analytics-sessions',
          label: {
            en: 'Sessions',
            es: 'Sesiones',
          },
          href: '/admin/dashboard#sessions',
          icon: 'Users',
        },
        {
          id: 'analytics-pages',
          label: {
            en: 'Pages',
            es: 'Páginas',
          },
          href: '/admin/dashboard#pages',
          icon: 'FileText',
        },
      ],
    },
    {
      id: 'content',
      label: {
        en: 'Content',
        es: 'Contenido',
      },
      href: '/admin/content',
      icon: 'FileText',
      type: 'accordion',
      access: {
        roles: ['admin'],
      },
      subItems: [
        {
          id: 'content-blog',
          label: {
            en: 'Blog',
            es: 'Blog',
          },
          href: '/admin/content/blog',
          icon: 'FileText',
        },
        {
          id: 'content-projects',
          label: {
            en: 'Projects',
            es: 'Proyectos',
          },
          href: '/admin/content/projects',
          icon: 'Folder',
        },
      ],
    },
    {
      id: 'settings',
      label: {
        en: 'Settings',
        es: 'Configuración',
      },
      href: '/admin/settings',
      icon: 'Settings2',
      type: 'direct',
      access: {
        roles: ['admin'],
      },
    },
  ],
  directLinkRoutes: ['dashboard', 'settings'],
};
