export interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  companySize: string;
  budget: string;
  productCategories: string[];
  functionalities: string[];
  message: string;
  files: File[];
}

export interface ContactFormProps {
  onSuccess?: (data: ContactFormData) => void;
  onError?: (error: string) => void;
}

export type FormErrors = Partial<Record<keyof ContactFormData, string>>;

export type FormState = 'idle' | 'editing' | 'validating' | 'submitting' | 'success' | 'error';

export const PROJECT_TYPES = [
  'Branding',
  'Mobile App',
  'Web App',
  'Website',
  'Google Ads',
  'SEO/GEO',
] as const;

export const COMPANY_SIZES = [
  'solo_founder',
  'small_startup',
  'medium_company',
  'enterprise',
] as const;

export const BUDGETS = [
  'under_2k',
  '2k_5k',
  '8k_12k',
  '12k_15k',
  '15k_20k',
  'over_20k',
] as const;

export const PRODUCT_CATEGORIES = [
  'saas',
  'on_demand',
  'project_management',
  'ecommerce',
  'marketplace',
  'social_media',
  'internal_tool',
  'crm',
  'job_board',
  'productivity',
  'marketing_site',
  'data_management',
  'hospitality_gastronomy',
  'other',
] as const;

export const FUNCTIONALITIES = [
  'payments',
  'memberships',
  'email_delivery',
  'google_maps',
  'video',
  'social_logins',
  'audio',
  'internal_analytics',
  'dashboard',
  'other',
] as const;

// Project types that show the functionalities question
export const TECH_PROJECT_TYPES = ['Mobile App', 'Web App', 'Website'];
