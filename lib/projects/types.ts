/**
 * Project URL - represents a link associated with a project
 */
export interface ProjectUrl {
  name: string;
  url: string;
  fallback?: string;
  active?: boolean;
}

/**
 * Project - Main project entity
 */
export interface Project {
  id: number;
  title: string;
  categories: string[];
  description: string;
  about: string;
  tags: string[];
  image: string;
  gallery: string[];
  urls?: ProjectUrl[];
  url: string; // Slug for the project page
  titleTags?: string;
}

/**
 * Category - Project category entity
 */
export interface Category {
  id: string;
  name: string;
}

/**
 * Projects Data - Structure of the seed data file
 */
export interface ProjectsData {
  en: {
    projects: Project[];
  };
  es: {
    projects: Project[];
  };
}

/**
 * Locale type for i18n
 */
export type Locale = 'en' | 'es';
