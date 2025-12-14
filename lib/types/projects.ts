// =====================================================
// Project Management Types
// =====================================================

/**
 * Database table types
 */

export interface Category {
  id: string;
  name_en: string;
  name_es: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  legacy_id: number | null;
  slug: string;

  // Localized content
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  about_en: string | null;
  about_es: string | null;

  // Media
  image: string;
  gallery: string[];

  // Metadata
  tags: string[];
  urls: ProjectUrl[];

  // Status
  is_active: boolean;
  display_order: number;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface ProjectCategory {
  id: string;
  project_id: string;
  category_id: string;
  created_at: string;
}

export interface ProjectUrl {
  name: string;
  url: string;
  active?: boolean;
  fallback?: string;
}

/**
 * Extended types with relationships
 */

export interface ProjectWithCategories extends Project {
  categories: Category[];
}

export interface CategoryWithProjectCount extends Category {
  project_count: number;
}

/**
 * Form and API types
 */

export interface CreateProjectInput {
  slug: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  about_en?: string | null;
  about_es?: string | null;
  image: string;
  gallery?: string[];
  tags?: string[];
  urls?: ProjectUrl[];
  is_active?: boolean;
  display_order?: number;
  category_ids: string[];
}

export interface UpdateProjectInput {
  slug?: string;
  title_en?: string;
  title_es?: string;
  description_en?: string;
  description_es?: string;
  about_en?: string | null;
  about_es?: string | null;
  image?: string;
  gallery?: string[];
  tags?: string[];
  urls?: ProjectUrl[];
  is_active?: boolean;
  display_order?: number;
  category_ids?: string[];
}

export interface CreateProjectCategoryInput {
  name_en: string;
  name_es: string;
  slug?: string; // Auto-generated from name_en if not provided
}

export interface UpdateProjectCategoryInput {
  name_en?: string;
  name_es?: string;
  slug?: string;
}

/**
 * Filter and query types
 */

export interface ProjectFilters {
  category_id?: string;
  is_active?: boolean;
  search?: string;
  tags?: string[];
}

export interface ProjectsListParams extends ProjectFilters {
  page?: number;
  limit?: number;
  sort_by?: 'created_at' | 'updated_at' | 'display_order' | 'title_en' | 'title_es';
  sort_order?: 'asc' | 'desc';
}

/**
 * API response types
 */

export interface ProjectsListResponse {
  projects: ProjectWithCategories[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface CategoriesListResponse {
  categories: CategoryWithProjectCount[];
}
