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
      subjectLabel: string;
      subjectPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      submitButton: string;
      submittingButton: string;
      successMessage: string;
      successSubtext: string;
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
