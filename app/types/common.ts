// Common types used across the application

export type Locale = 'en' | 'es';

export interface PageParams {
  lang: Locale;
}

export interface PageProps<T = {}> {
  params: Promise<PageParams & T>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}
