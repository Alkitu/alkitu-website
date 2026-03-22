import { z } from 'zod';

export type Locale = 'en' | 'es';

// Zod schema for runtime validation (flexible for dynamic keys)
export const translationsSchema = z.record(z.string(), z.unknown());

// TypeScript interface for compile-time type safety
// This provides autocomplete and type checking while allowing dynamic access
export interface Translations {
  menu: {
    id: string;
    currentLanguage: string;
    routes: Array<{
      name: string;
      pathname: string;
      iconLight: string;
      iconDark: string;
    }>;
    contact: string;
    languages: string;
    theme: string;
    languagesOptions: Array<{
      name: string;
      pathname: string;
    }>;
  };
  footer: {
    website: string;
    rights: string;
    adminAccess?: string;
    routes: Array<{
      name: string;
      pathname: string;
    }>;
    socials: Array<{
      name: string;
      icon: string;
      url: string;
      hidden: boolean;
    }>;
  };
  home: Record<string, any>;
  portfolio: {
    title: string;
    description: string;
    categories: Array<{ id: string; name: string }>;
    projects: Array<any>; // Can be further typed if needed
    [key: string]: any;
  };
  contact: {
    title: string;
    socialNetworksParagraph: string;
    emailAddressParagraph: string;
    email: string;
    copied: string;
    socialNetwoks: { // Note: Matching existing typo in codebase 'socialNetwoks' to avoid breaking changes
      whatsApp: { url: string; hidden: boolean };
      linkedIn: { url: string; hidden: boolean };
      instagram: { url: string; hidden: boolean };
      twitter: { url: string; hidden: boolean };
      telegram: { url: string; hidden: boolean };
    };
    [key: string]: any;
  };
  blog: Record<string, any>;
  settings: Record<string, any>;
  navigation: Record<string, any>;
  page: Record<string, any>;
  common: {
    language: string;
    loading: string;
    previous: string;
    next: string;
  };
  contactPage: {
    header: {
      title: string;
      subtitle: string;
      text: string;
    };
    sections: Array<{
      id: string;
      name: string;
    }>;
    form: {
      title: string;
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      projectTypeTitle: string;
      companySizeTitle: string;
      companySize_solo_founder: string;
      companySize_small_startup: string;
      companySize_medium_company: string;
      companySize_enterprise: string;
      budgetTitle: string;
      budget_under_2k: string;
      budget_2k_5k: string;
      budget_8k_12k: string;
      budget_12k_15k: string;
      budget_15k_20k: string;
      budget_over_20k: string;
      categoriesTitle: string;
      categoriesSubtitle: string;
      category_saas: string;
      category_on_demand: string;
      category_project_management: string;
      category_ecommerce: string;
      category_marketplace: string;
      category_social_media: string;
      category_internal_tool: string;
      category_crm: string;
      category_job_board: string;
      category_productivity: string;
      category_marketing_site: string;
      category_data_management: string;
      category_hospitality_gastronomy: string;
      category_other: string;
      functionalitiesTitle: string;
      functionalitiesSubtitle: string;
      func_payments: string;
      func_memberships: string;
      func_email_delivery: string;
      func_google_maps: string;
      func_video: string;
      func_social_logins: string;
      func_audio: string;
      func_internal_analytics: string;
      func_dashboard: string;
      func_other: string;
      messageLabel: string;
      messagePlaceholder: string;
      filesLabel: string;
      filesDragText: string;
      submitButton: string;
      submittingButton: string;
      successMessage: string;
      successSubtext: string;
      [key: string]: string;
    };
    communityBanner: {
      titlePart1: string;
      titleHighlight: string;
      contactBox: {
        title: string;
        text: string;
      };
      socialBox: {
        title: string;
        text: string;
      };
    };
  };
  newsletterSection: {
    titleLine1: string;
    titleLine2: string;
    titleHighlight: string;
    subtitle: string;
    placeholder: string;
    button: string;
    subscribingButton: string;
    subscribedButton: string;
    privacy: string;
    privacyLink: string;
    success: string;
    checkEmail: string;
    error: string;
    invalidEmail: string;
    alreadySubscribed: string;
    subscribeFailed: string;
  };
  [key: string]: unknown; // Allow dynamic access for nested keys
}

export interface TranslationsProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
  initialTranslations: Translations;
}
