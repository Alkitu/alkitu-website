import type {
  BlogPost,
  BlogPostRaw,
  BlogPostTranslation,
  Category,
} from '@/app/schemas/blog.schema';

export type { BlogPost, BlogPostRaw, BlogPostTranslation, Category };

// Additional derived types for components
export interface BlogContentProps {
  posts: BlogPostRaw[];
  categories: Category[];
  locale: string;
  title: string;
  description?: string;
  translations: {
    all: string;
    recent: string;
    emprendimiento: string;
    desarrolloWeb: string;
    publicidad: string;
    disenoGrafico: string;
    socialMedia: string;
    marketing: string;
    otrasPublicaciones: string;
  };
}

export interface BlogGridProps {
  posts: BlogPost[];
  locale: string;
  categoryTitle?: string;
  columns?: 2 | 3 | 4;
}

export interface BlogHeroProps {
  featuredPost: BlogPost;
  recentPosts: BlogPost[];
  locale: string;
}

export interface BlogListProps {
  posts: BlogPost[];
  locale: string;
}
