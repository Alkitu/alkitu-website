import { LucideIcon } from 'lucide-react';

export type Locale = 'en' | 'es';

export interface LocalizedLabel {
  en: string;
  es: string;
}

export interface DashboardSubItem {
  id: string;
  label: LocalizedLabel;
  href: string;
  icon: string;
}

export interface DashboardRoute {
  id: string;
  label: LocalizedLabel;
  href: string;
  icon: string;
  type: 'direct' | 'accordion';
  access: {
    roles: string[];
  };
  subItems?: DashboardSubItem[];
}

export interface DashboardRoutes {
  version: string;
  lastUpdated: string;
  routes: DashboardRoute[];
  directLinkRoutes: string[];
}

export interface ProcessedNavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: {
    title: string;
    url: string;
  }[];
  isActive?: boolean;
}
