import { Project, Category, Locale, ProjectsData } from './types';
import seedData from '@/app/data/projects/seed.json';

/**
 * Get all projects for a specific locale
 * This function will be replaced with Prisma query in the future
 */
export function getProjects(locale: Locale): Project[] {
  const data = seedData as ProjectsData;
  return data[locale]?.projects || [];
}

/**
 * Get a single project by its URL slug and locale
 * This function will be replaced with Prisma query in the future
 */
export function getProjectByUrl(url: string, locale: Locale): Project | null {
  const projects = getProjects(locale);
  return projects.find(project => project.url === url) || null;
}

/**
 * Get a single project by its ID and locale
 * This function will be replaced with Prisma query in the future
 */
export function getProjectById(id: number, locale: Locale): Project | null {
  const projects = getProjects(locale);
  return projects.find(project => project.id === id) || null;
}

/**
 * Get all unique categories from projects
 * This function will be replaced with Prisma query in the future
 */
export function getCategories(locale: Locale): Category[] {
  const projects = getProjects(locale);
  const categoriesSet = new Set<string>();

  projects.forEach(project => {
    project.categories.forEach(category => {
      categoriesSet.add(category);
    });
  });

  return Array.from(categoriesSet).map(category => ({
    id: category.toLowerCase().replace(/_/g, ''),
    name: category
  }));
}

/**
 * Get projects filtered by category
 * This function will be replaced with Prisma query in the future
 */
export function getProjectsByCategory(category: string, locale: Locale): Project[] {
  if (category === 'All') {
    return getProjects(locale);
  }

  const projects = getProjects(locale);
  return projects.filter(project =>
    project.categories.includes(category)
  );
}

/**
 * Get paginated projects
 * This function will be replaced with Prisma query in the future
 */
export function getPaginatedProjects(
  locale: Locale,
  page: number = 1,
  pageSize: number = 6,
  category?: string
): {
  projects: Project[];
  total: number;
  totalPages: number;
  currentPage: number;
} {
  let allProjects = category && category !== 'All'
    ? getProjectsByCategory(category, locale)
    : getProjects(locale);

  const total = allProjects.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const projects = allProjects.slice(start, end);

  return {
    projects,
    total,
    totalPages,
    currentPage: page
  };
}
