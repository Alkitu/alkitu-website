/**
 * My Profile Page (Admin)
 *
 * Allows logged-in admin users to view and edit their own profile.
 * Creates profile if it doesn't exist yet.
 */

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProfileEditor } from '@/app/components/admin/profiles/ProfileEditor';
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mi Perfil - Admin',
  description: 'Administra tu perfil profesional',
};

/**
 * Get or create user profile
 */
async function getUserProfile(userId: string) {
  const supabase = await createClient();

  // Try to get existing profile
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found", which is expected for new users
    console.error('[ProfilePage] Fetch error:', error);
    throw error;
  }

  return profile;
}

/**
 * My Profile Page Component
 *
 * SECURITY: This page does NOT perform authentication checks.
 * All /admin/* routes are protected by withAuthMiddleware in proxy.ts.
 */
export default async function MyProfilePage() {
  const supabase = await createClient();

  // Get authenticated user (trust middleware for authentication)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defensive: if no user (should never happen due to middleware), show error
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-8">
          <div className="mx-auto max-w-md text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">
              Error de autenticación
            </h2>
            <p className="mt-2 text-muted-foreground">
              No se pudo obtener la información del usuario.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get user profile
  const profile = await getUserProfile(user.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
        <p className="mt-2 text-muted-foreground">
          Administra tu información profesional y controla tu privacidad.
        </p>
      </div>

      {/* Profile Exists */}
      {profile && (
        <div className="rounded-lg border border-border bg-card p-6">
          <ProfileEditor profileId={profile.id} initialData={profile} />
        </div>
      )}

      {/* No Profile Yet - Show Creation Prompt */}
      {!profile && (
        <div className="rounded-lg border border-border bg-card p-8">
          <div className="mx-auto max-w-md text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">
              Aún no tienes un perfil
            </h2>
            <p className="mt-2 text-muted-foreground">
              Tu perfil te permite compartir información profesional con tu equipo y el público.
            </p>

            <div className="mt-6 rounded-md border border-dashed border-border bg-secondary/50 p-4">
              <h3 className="text-sm font-medium text-foreground">
                Para crear tu perfil:
              </h3>
              <ol className="mt-2 space-y-1 text-left text-sm text-muted-foreground">
                <li>1. Un Super Admin debe asignarte un nombre de usuario único</li>
                <li>2. Una vez asignado, podrás editar tu perfil desde esta página</li>
              </ol>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Contacta a un Super Admin para solicitar tu nombre de usuario.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
