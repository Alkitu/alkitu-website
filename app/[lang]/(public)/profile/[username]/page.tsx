/**
 * Public Profile Page
 *
 * Displays user profile information based on username.
 * Only shows fields and array items marked as public.
 * Accessible without authentication.
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Mail,
  Phone,
  ExternalLink,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Globe,
  Award,
  Languages,
  Home,
  Clock,
} from 'lucide-react';
import type { PublicUserProfile } from '@/lib/types/profiles';

interface ProfilePageProps {
  params: Promise<{
    lang: string;
    username: string;
  }>;
}

/**
 * Fetch public profile from API
 */
async function getPublicProfile(username: string): Promise<PublicUserProfile | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/profiles/${username}`, {
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.success ? result.data : null;
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
  const { username } = await params;
  const profile = await getPublicProfile(username);

  if (!profile) {
    return {
      title: 'Perfil no encontrado',
      description: 'Este perfil no existe o no está disponible públicamente.',
    };
  }

  const title = `${username} - Perfil Profesional`;
  const description = profile.bio || `Perfil profesional de ${username}`;

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
  };
}

/**
 * Public Profile Page Component
 */
export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const profile = await getPublicProfile(username);

  if (!profile) {
    notFound();
  }

  // Build display name
  const displayName =
    profile.display_name ||
    (profile.first_name && profile.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile.first_name || profile.last_name || `@${username}`);

  return (
    <div className="min-h-screen bg-background border my-8">
      {/* Banner Section */}
      {profile.banner_url && (
        <div className="relative h-64 w-full overflow-hidden bg-linear-to-r from-primary/20 to-primary/10 ">
          <Image
            src={profile.banner_url}
            alt="Profile banner"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto max-w-5xl px-4  ">
        {/* Header Section - Overlaps banner */}
        <div className={`${profile.banner_url ? 'mt-0' : 'pt-12'} mb-8 `}/>
         <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end mb-8 ">
            {/* Profile Photo */}
            <div
              className="relative h-32 w-32 shrink-0 rounded-full ring-4 ring-background"
              style={{
                borderColor: profile.profile_color || '#00BB31',
                borderWidth: '4px',
                borderStyle: 'solid',
              }}
            >
              {profile.photo_url ? (
                <Image
                  src={profile.photo_url}
                  alt={`${displayName} profile photo`}
                  fill
                  className="rounded-full object-cover"
                  priority
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center rounded-full text-4xl font-bold text-white"
                  style={{ backgroundColor: profile.profile_color || '#00BB31' }}
                >
                  {username[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* Name & Title */}
            <div className="flex-1 text-center sm:text-left z-10">
              <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>



              {profile.pronouns && (
                <p className="mt-1 text-sm text-muted-foreground">({profile.pronouns})</p>
              )}
              <p className="text-sm text-muted-foreground">@{username}</p>

              {/* Job Info */}
              {(profile.job_title || profile.location) && (
                <div className="mt-3 flex flex-col gap-1 text-sm">
                  {profile.job_title && (
                    <div className="flex items-center justify-center gap-2 text-foreground sm:justify-start">
                      <Briefcase className="h-4 w-4" />
                      <span>{profile.job_title}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground sm:justify-start">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                      {profile.remote_work && (
                        <span className="text-xs">(Remoto)</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        {/* Content Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="space-y-6 md:col-span-2">
            {/* Bio */}
            {profile.bio && (
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-3 text-lg font-semibold text-foreground">Acerca de</h2>
                <p className="whitespace-pre-wrap text-muted-foreground">{profile.bio}</p>
              </div>
            )}

            {/* Hard Skills */}
            {profile.hard_skills.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Award className="h-5 w-5" />
                  Hard Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {[...profile.hard_skills]
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((skillItem, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                      >
                        {skillItem.skill}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Soft Skills */}
            {profile.soft_skills.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Award className="h-5 w-5" />
                  Soft Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {[...profile.soft_skills]
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((skillItem, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-secondary/50 px-3 py-1 text-sm font-medium text-foreground"
                      >
                        {skillItem.skill}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {profile.languages.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Languages className="h-5 w-5" />
                  Idiomas
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[...profile.languages]
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((langItem, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border border-border bg-background p-3"
                      >
                        <span className="font-medium text-foreground">{langItem.language}</span>
                        <span
                          className={`text-xs rounded-full px-2 py-0.5 ${
                            langItem.proficiency === 'native'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                              : langItem.proficiency === 'fluent'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : langItem.proficiency === 'intermediate'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          {langItem.proficiency === 'native'
                            ? 'Nativo'
                            : langItem.proficiency === 'fluent'
                            ? 'Fluido'
                            : langItem.proficiency === 'intermediate'
                            ? 'Intermedio'
                            : 'Básico'}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Roles */}
            {profile.roles.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Briefcase className="h-5 w-5" />
                  Roles
                </h2>
                <div className="flex flex-wrap gap-2">
                  {[...profile.roles]
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((roleItem, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                        style={{
                          backgroundColor: `${profile.profile_color}20`,
                          color: profile.profile_color,
                        }}
                      >
                        {roleItem.role}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* URLs/Links */}
            {profile.urls.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Globe className="h-5 w-5" />
                  Enlaces
                </h2>
                <div className="space-y-2">
                  {[...profile.urls]
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((urlItem, index) => (
                      <Link
                        key={index}
                        href={urlItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-md border border-border p-3 transition-colors hover:bg-secondary"
                      >
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground">{urlItem.urlName}</div>
                          <div className="truncate text-sm text-muted-foreground">
                            {urlItem.url}
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact & Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            {(profile.emails.length > 0 || profile.phone_numbers.length > 0 || profile.addresses.length > 0) && (
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Contacto</h2>
                <div className="space-y-3">
                  {/* Emails */}
                  {profile.emails.map((emailItem, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {emailItem.type === 'work' ? 'Trabajo' : 'Personal'}
                        </span>
                      </div>
                      <a
                        href={`mailto:${emailItem.email}`}
                        className="block break-all text-sm text-primary hover:underline"
                      >
                        {emailItem.email}
                      </a>
                    </div>
                  ))}

                  {/* Phone Numbers */}
                  {profile.phone_numbers.map((phoneItem, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {phoneItem.type === 'work' ? 'Trabajo' : 'Personal'}
                        </span>
                      </div>
                      <a
                        href={`tel:${phoneItem.number}`}
                        className="block text-sm text-primary hover:underline"
                      >
                        {phoneItem.number}
                      </a>
                    </div>
                  ))}

                  {/* Addresses */}
                  {profile.addresses.map((addressItem, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center gap-2">
                        {addressItem.type === 'office' ? (
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Home className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {addressItem.type === 'office' ? 'Oficina' : 'Casa'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {addressItem.address}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {(profile.department || profile.timezone) && (
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Información</h2>
                <div className="space-y-3 text-sm">
                  {profile.department && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Home className="h-4 w-4" />
                      <span>{profile.department}</span>
                    </div>
                  )}
                  {profile.timezone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{profile.timezone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {!profile.bio &&
          !profile.department &&
          !profile.job_title &&
          profile.roles.length === 0 &&
          profile.emails.length === 0 &&
          profile.phone_numbers.length === 0 &&
          profile.addresses.length === 0 &&
          profile.urls.length === 0 &&
          profile.hard_skills.length === 0 &&
          profile.soft_skills.length === 0 &&
          profile.languages.length === 0 && (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">
                Este usuario no ha compartido información pública todavía.
              </p>
            </div>
          )}

        {/* Spacing at bottom */}
        <div className="h-12" />
      </div>
    </div>
  );
}
