/**
 * Public Profile Page
 *
 * Displays user profile information based on username, styled after the CV template
 * (dark sidebar, categorized skills, bulleted experience). Only shows fields and array
 * items marked as public. Accessible without authentication. Supports i18n (en/es) via
 * bilingual { en, es } content fields.
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Mail,
  Phone,
  Briefcase,
  Building2,
  MapPin,
  Globe,
  Languages,
  Home,
  Clock,
  GraduationCap,
} from 'lucide-react';
import { createAnalyticsClient } from '@/lib/supabase/analytics';
import { getDictionary } from '@/lib/dictionary';
import { getSeoAlternates } from '@/lib/seo';
import type { Locale } from '@/i18n.config';
import {
  localizeText,
  type PublicUserProfile,
  type ProfileUrl,
  type ProfileRole,
  type ProfilePhoneNumber,
  type ProfileEmail,
  type ProfileSkill,
  type ProfileLanguage,
  type ProfileAddress,
  type ProfileExperience,
  type ProfileEducation,
  type SkillCategory,
} from '@/lib/types/profiles';

interface ProfilePageProps {
  params: Promise<{
    lang: Locale;
    username: string;
  }>;
}

const SIDEBAR_BG = '#101315';

const SKILL_CATEGORY_ORDER: SkillCategory[] = [
  'ai_consulting',
  'engineering',
  'testing_cicd',
  'design_marketing',
  'other',
];

/**
 * Filter array items based on is_public flag
 */
function filterPublicItems<T extends { is_public: boolean }>(items: T[]): T[] {
  return items.filter((item) => item.is_public);
}

function sortByOrder<T extends { display_order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.display_order - b.display_order);
}

/**
 * Localized display name for a language: prefers Intl.DisplayNames from language_code,
 * falls back to the free-text `language` value.
 */
function localizedLanguageName(item: ProfileLanguage, lang: Locale): string {
  if (item.language_code) {
    try {
      const displayNames = new Intl.DisplayNames([lang], { type: 'language' });
      const name = displayNames.of(item.language_code);
      if (name) return name.charAt(0).toUpperCase() + name.slice(1);
    } catch {
      // Unsupported/invalid code — fall through to free-text label
    }
  }
  return item.language;
}

function formatMonthYear(dateStr: string, lang: Locale): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric' }).format(date);
}

function formatDateRange(
  item: { start_date: string; end_date: string | null; is_current?: boolean },
  lang: Locale,
  presentLabel: string
): string {
  const start = formatMonthYear(item.start_date, lang);
  const end = item.end_date ? formatMonthYear(item.end_date, lang) : presentLabel;
  return `${start} - ${item.is_current || !item.end_date ? presentLabel : end}`;
}

/**
 * Fetch public profile directly from database
 */
async function getPublicProfile(username: string): Promise<PublicUserProfile | null> {
  try {
    const supabase = createAnalyticsClient();

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !profile) {
      return null;
    }

    const emptyLocalized = { en: '', es: '' };

    // Apply privacy filtering
    const publicProfile: PublicUserProfile = {
      username: profile.username,
      photo_url: profile.photo_url,
      banner_url: profile.banner_url,
      first_name: profile.first_name_is_public ? profile.first_name : null,
      last_name: profile.last_name_is_public ? profile.last_name : null,
      display_name: profile.display_name,
      pronouns: profile.pronouns_is_public ? profile.pronouns : null,
      date_of_birth: profile.date_of_birth_is_public ? profile.date_of_birth : null,
      bio: profile.bio_is_public ? profile.bio || emptyLocalized : emptyLocalized,
      job_title: profile.job_title_is_public ? profile.job_title || emptyLocalized : emptyLocalized,
      department: profile.department_is_public ? profile.department : null,
      location: profile.location_is_public ? profile.location : null,
      remote_work: profile.remote_work || false,
      timezone: profile.timezone || 'America/New_York',
      urls: filterPublicItems<ProfileUrl>(profile.urls || []),
      roles: filterPublicItems<ProfileRole>(profile.roles || []),
      phone_numbers: filterPublicItems<ProfilePhoneNumber>(profile.phone_numbers || []),
      emails: filterPublicItems<ProfileEmail>(profile.emails || []),
      hard_skills: filterPublicItems<ProfileSkill>(profile.hard_skills || []),
      soft_skills: filterPublicItems<ProfileSkill>(profile.soft_skills || []),
      languages: filterPublicItems<ProfileLanguage>(profile.languages || []),
      addresses: filterPublicItems<ProfileAddress>(profile.addresses || []),
      experience: filterPublicItems<ProfileExperience>(profile.experience || []),
      education: filterPublicItems<ProfileEducation>(profile.education || []),
      profile_color: profile.profile_color || '#00BB31',
      theme_preference: profile.theme_preference || 'system',
    };

    return publicProfile;
  } catch (error) {
    console.error('[ProfilePage] Fetch error:', error);
    return null;
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { lang, username } = await params;
  const text = await getDictionary(lang);
  const profile = await getPublicProfile(username);

  if (!profile) {
    return {
      title: text.profile.public.notFound.title,
      description: text.profile.public.notFound.description,
    };
  }

  const bio = localizeText(profile.bio, lang);
  const title = `${username} - ${text.profile.public.professionalProfile}`;
  const description = bio || `${text.profile.public.professionalProfile} - ${username}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.photo_url ? [profile.photo_url] : [],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: profile.photo_url ? [profile.photo_url] : [],
    },
    alternates: getSeoAlternates(lang, `/profile/${username}`),
  };
}

/**
 * Public Profile Page Component
 */
export default async function ProfilePage({ params }: ProfilePageProps) {
  const { lang, username } = await params;
  const text = await getDictionary(lang);
  const profile = await getPublicProfile(username);
  const t = text.profile.public;

  if (!profile) {
    notFound();
  }

  const accent = profile.profile_color || '#00BB31';
  const presentLabel = t.present;

  // Build display name
  const displayName =
    profile.display_name ||
    (profile.first_name && profile.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile.first_name || profile.last_name || `@${username}`);

  const bio = localizeText(profile.bio, lang);
  const jobTitle = localizeText(profile.job_title, lang);

  const skillsByCategory = sortByOrder(profile.hard_skills).reduce<Record<string, ProfileSkill[]>>(
    (acc, skill) => {
      const key = skill.category || 'other';
      (acc[key] ||= []).push(skill);
      return acc;
    },
    {}
  );

  const sortedExperience = sortByOrder(profile.experience);
  const sortedEducation = sortByOrder(profile.education);
  const sortedLanguages = sortByOrder(profile.languages);

  const hasSidebarContent =
    profile.emails.length > 0 ||
    profile.phone_numbers.length > 0 ||
    profile.addresses.length > 0 ||
    profile.hard_skills.length > 0 ||
    profile.soft_skills.length > 0 ||
    sortedLanguages.length > 0 ||
    sortedEducation.length > 0;

  const hasMainContent = !!bio || sortedExperience.length > 0 || profile.roles.length > 0 || profile.urls.length > 0;

  const isEmpty = !hasSidebarContent && !hasMainContent && !jobTitle;

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section */}
      {profile.banner_url && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image src={profile.banner_url} alt="Profile banner" fill className="object-cover" priority />
        </div>
      )}

      {isEmpty ? (
        <div className="container mx-auto max-w-3xl px-4 py-24 text-center">
          <p className="text-muted-foreground">{t.emptyState}</p>
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl grid-cols-1 shadow-sm md:grid-cols-[300px_1fr]">
          {/* ---- Sidebar ---- */}
          <aside className="px-6 py-10 text-neutral-200" style={{ backgroundColor: SIDEBAR_BG }}>
            {/* Photo */}
            <div
              className="relative mx-auto mb-6 h-32 w-32 shrink-0 overflow-hidden rounded-full"
              style={{ border: `3px solid ${accent}` }}
            >
              {profile.photo_url ? (
                <Image
                  src={profile.photo_url}
                  alt={`${displayName} profile photo`}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-4xl font-bold text-white"
                  style={{ backgroundColor: accent }}
                >
                  {username[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* Contact */}
            {(profile.emails.length > 0 ||
              profile.phone_numbers.length > 0 ||
              profile.addresses.length > 0 ||
              profile.location) && (
              <div className="mb-6">
                <h2
                  className="mb-3 border-b pb-1.5 text-xs font-semibold tracking-wide uppercase"
                  style={{ color: accent, borderColor: 'rgba(255,255,255,0.12)' }}
                >
                  {t.sections.contact}
                </h2>
                <div className="space-y-2.5 text-sm">
                  {profile.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
                      <span>
                        {profile.location}
                        {profile.remote_work && <span className="text-xs"> ({t.remote})</span>}
                      </span>
                    </div>
                  )}
                  {profile.phone_numbers.map((p, i) => (
                    <div key={`phone-${i}`} className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
                      <a href={`tel:${p.number}`} className="hover:underline">
                        {p.number}
                      </a>
                    </div>
                  ))}
                  {profile.emails.map((e, i) => (
                    <div key={`email-${i}`} className="flex items-start gap-2">
                      <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
                      <a href={`mailto:${e.email}`} className="break-all hover:underline">
                        {e.email}
                      </a>
                    </div>
                  ))}
                  {profile.addresses.map((a, i) => (
                    <div key={`address-${i}`} className="flex items-start gap-2">
                      {a.type === 'office' ? (
                        <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
                      ) : (
                        <Home className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
                      )}
                      <span>{a.address}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {profile.urls.length > 0 && (
              <div className="mb-6">
                <h2
                  className="mb-3 border-b pb-1.5 text-xs font-semibold tracking-wide uppercase"
                  style={{ color: accent, borderColor: 'rgba(255,255,255,0.12)' }}
                >
                  {t.sections.links}
                </h2>
                <div className="space-y-2.5 text-sm">
                  {sortByOrder(profile.urls).map((u, i) => (
                    <Link
                      key={i}
                      href={u.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:underline"
                    >
                      <Globe className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
                      <span className="truncate">{u.urlName}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Skills (categorized) */}
            {profile.hard_skills.length > 0 && (
              <div className="mb-6">
                <h2
                  className="mb-3 border-b pb-1.5 text-xs font-semibold tracking-wide uppercase"
                  style={{ color: accent, borderColor: 'rgba(255,255,255,0.12)' }}
                >
                  {t.sections.hardSkills}
                </h2>
                {SKILL_CATEGORY_ORDER.filter((cat) => skillsByCategory[cat]?.length).map((cat) => (
                  <div key={cat} className="mb-3 last:mb-0">
                    <div className="mb-1 text-[11px] font-bold tracking-wide uppercase" style={{ color: accent }}>
                      {t.skillCategories[cat as keyof typeof t.skillCategories]}
                    </div>
                    <ul className="space-y-1 pl-4 text-sm text-neutral-300">
                      {skillsByCategory[cat].map((s, i) => (
                        <li key={i} className="list-disc">
                          {localizeText(s.skill, lang)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Soft Skills */}
            {profile.soft_skills.length > 0 && (
              <div className="mb-6">
                <h2
                  className="mb-3 border-b pb-1.5 text-xs font-semibold tracking-wide uppercase"
                  style={{ color: accent, borderColor: 'rgba(255,255,255,0.12)' }}
                >
                  {t.sections.softSkills}
                </h2>
                <ul className="space-y-1 pl-4 text-sm text-neutral-300">
                  {sortByOrder(profile.soft_skills).map((s, i) => (
                    <li key={i} className="list-disc">
                      {localizeText(s.skill, lang)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Languages */}
            {sortedLanguages.length > 0 && (
              <div className="mb-6">
                <h2
                  className="mb-3 flex items-center gap-1.5 border-b pb-1.5 text-xs font-semibold tracking-wide uppercase"
                  style={{ color: accent, borderColor: 'rgba(255,255,255,0.12)' }}
                >
                  <Languages className="h-3.5 w-3.5" />
                  {t.sections.languages}
                </h2>
                <div className="space-y-1.5 text-sm">
                  {sortedLanguages.map((l, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span>{localizedLanguageName(l, lang)}</span>
                      <span className="text-xs" style={{ color: accent }}>
                        {t.proficiency[l.proficiency as keyof typeof t.proficiency]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {sortedEducation.length > 0 && (
              <div>
                <h2
                  className="mb-3 flex items-center gap-1.5 border-b pb-1.5 text-xs font-semibold tracking-wide uppercase"
                  style={{ color: accent, borderColor: 'rgba(255,255,255,0.12)' }}
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  {t.sections.education}
                </h2>
                <div className="space-y-3">
                  {sortedEducation.map((edu, i) => (
                    <div key={i} className="text-sm">
                      <div className="font-semibold" style={{ color: accent }}>
                        {localizeText(edu.degree, lang)}
                      </div>
                      <div className="text-neutral-300">
                        {edu.school}
                        {edu.location ? `, ${edu.location}` : ''}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {formatDateRange(edu, lang, presentLabel)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* ---- Main content ---- */}
          <main className="bg-card px-6 py-10 sm:px-10">
            <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>
            {jobTitle && (
              <p className="mt-1 text-base font-semibold" style={{ color: accent }}>
                {jobTitle}
              </p>
            )}
            {profile.pronouns && <p className="mt-1 text-sm text-muted-foreground">({profile.pronouns})</p>}
            <p className="text-sm text-muted-foreground">@{username}</p>

            {/* Summary */}
            {bio && (
              <section className="mt-6">
                <h2 className="mb-2 border-b pb-1 text-sm font-semibold tracking-wide text-foreground uppercase">
                  {t.sections.about}
                </h2>
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">{bio}</p>
              </section>
            )}

            {/* Experience */}
            {sortedExperience.length > 0 && (
              <section className="mt-6">
                <h2 className="mb-3 border-b pb-1 text-sm font-semibold tracking-wide text-foreground uppercase">
                  {t.sections.experience}
                </h2>
                <div className="space-y-5">
                  {sortedExperience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <span className="font-bold text-foreground">
                          {exp.company}
                          {exp.location ? ` — ${exp.location}` : ''}
                        </span>
                        <span className="text-xs whitespace-nowrap text-muted-foreground">
                          {formatDateRange(exp, lang, presentLabel)}
                        </span>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: accent }}>
                        {localizeText(exp.role, lang)}
                      </p>
                      {(exp.bullets[lang]?.length > 0 || exp.bullets.en.length > 0) && (
                        <ul className="mt-1 space-y-1 pl-5 text-sm text-muted-foreground">
                          {(exp.bullets[lang]?.length ? exp.bullets[lang] : exp.bullets.en).map((bullet, bi) => (
                            <li key={bi} className="list-disc">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                      {exp.tech && exp.tech.length > 0 && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          <span className="font-semibold">Tech:</span> {exp.tech.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Roles */}
            {profile.roles.length > 0 && (
              <section className="mt-6">
                <h2 className="mb-3 flex items-center gap-2 border-b pb-1 text-sm font-semibold tracking-wide text-foreground uppercase">
                  <Briefcase className="h-4 w-4" />
                  {t.sections.roles}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {sortByOrder(profile.roles).map((r, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                      style={{ backgroundColor: `${accent}20`, color: accent }}
                    >
                      {r.role}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Additional Info */}
            {(profile.department || profile.timezone) && (
              <section className="mt-6">
                <h2 className="mb-3 border-b pb-1 text-sm font-semibold tracking-wide text-foreground uppercase">
                  {t.sections.information}
                </h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {profile.department && (
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      <span>{profile.department}</span>
                    </div>
                  )}
                  {profile.timezone && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{profile.timezone}</span>
                    </div>
                  )}
                </div>
              </section>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
