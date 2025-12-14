'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from '@/app/context/TranslationContext';
import { DashboardRoutes, DashboardRoute, ProcessedNavItem, Locale } from '@/app/types/dashboard';
import { dashboardRoutesData } from '@/app/routes/dashboard-routes';
import {
  Home,
  BarChart3,
  FileText,
  Settings2,
  Users,
  Folder,
} from 'lucide-react';

// Icon mapping
const iconMap = {
  Home,
  BarChart3,
  FileText,
  Settings2,
  Users,
  Folder,
} as const;

interface UseDashboardRoutesOptions {
  locale?: Locale;
  userRole?: string;
}

export function useDashboardRoutes({
  locale = 'es',
  userRole = 'admin',
}: UseDashboardRoutesOptions = {}) {
  const [routes] = useState<DashboardRoutes>(dashboardRoutesData);

  // Filter routes based on user role
  const getRoutesForRole = useCallback(
    (role: string): DashboardRoute[] => {
      return routes.routes.filter((route) => route.access.roles.includes(role));
    },
    [routes]
  );

  // Convert routes to navigation items with translations
  const createNavItems = useCallback(
    (routesToProcess: DashboardRoute[]): ProcessedNavItem[] => {
      return routesToProcess.map((route) => {
        const icon = iconMap[route.icon as keyof typeof iconMap];
        const title = route.label[locale] || route.label.es;

        // Check if route should be direct link
        const isDirectLink = routes.directLinkRoutes.includes(route.id);

        if (isDirectLink || route.type === 'direct') {
          return {
            title,
            url: route.href,
            icon,
            items: [],
          };
        }

        // Create accordion with subitems
        const subItems =
          route.subItems?.map((subItem) => ({
            title: subItem.label[locale] || subItem.label.es,
            url: subItem.href,
          })) || [];

        return {
          title,
          url: route.href,
          icon,
          items: subItems,
          isActive: false,
        };
      });
    },
    [locale, routes.directLinkRoutes]
  );

  // Get current user routes
  const currentRoutes = useMemo(() => {
    return getRoutesForRole(userRole);
  }, [userRole, getRoutesForRole]);

  // Get processed navigation items
  const navItems = useMemo(() => {
    return createNavItems(currentRoutes);
  }, [currentRoutes, createNavItems]);

  // Check if user can access route
  const canAccessRoute = useCallback(
    (routeId: string): boolean => {
      const route = routes.routes.find((r) => r.id === routeId);
      if (!route) return false;

      return route.access.roles.includes(userRole);
    },
    [routes.routes, userRole]
  );

  // Get route by ID with translations
  const getRoute = useCallback(
    (routeId: string): DashboardRoute | null => {
      return routes.routes.find((r) => r.id === routeId) || null;
    },
    [routes.routes]
  );

  // Get translated route label
  const getRouteLabel = useCallback(
    (routeId: string): string => {
      const route = getRoute(routeId);
      if (!route) return routeId;
      return route.label[locale] || route.label.es;
    },
    [getRoute, locale]
  );

  return {
    // Data
    routes: currentRoutes,
    navItems,

    // Actions
    canAccessRoute,
    getRoute,
    getRouteLabel,

    // Utilities
    isDirectLink: (routeId: string) => routes.directLinkRoutes.includes(routeId),
  };
}

// Hook específico para obtener datos transformados para el sidebar
export function useSidebarData(options: UseDashboardRoutesOptions = {}) {
  const dashboardRoutes = useDashboardRoutes(options);

  const sidebarData = useMemo(
    () => ({
      navMain: dashboardRoutes.navItems,
    }),
    [dashboardRoutes]
  );

  return {
    ...sidebarData,
    ...dashboardRoutes,
  };
}
