/**
 * All Profiles Page (Super Admin Only)
 *
 * Allows Super Admins to view and manage all user profiles.
 * Can create profiles for users who don't have one yet.
 */

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Users, UserPlus, Shield, Building2, Briefcase } from 'lucide-react';
import type { UserProfile } from '@/lib/types/profiles';

export const metadata: Metadata = {
  title: 'Gestión de Perfiles - Super Admin',
  description: 'Administra los perfiles de todos los usuarios',
};

/**
 * Get all user profiles
 */
async function getAllProfiles(): Promise<UserProfile[]> {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[ProfilesPage] Fetch error:', error);
    return [];
  }

  return profiles || [];
}

/**
 * Get admin users without profiles
 */
async function getAdminsWithoutProfiles() {
  const supabase = await createClient();

  // Get all admin users
  const { data: allAdmins } = await supabase
    .from('admin_users')
    .select('id, email, name, role')
    .order('created_at', { ascending: false });

  // Get all profiles
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('user_id');

  const profileUserIds = new Set(profiles?.map((p) => p.user_id) || []);

  // Filter admins without profiles
  return (
    allAdmins?.filter((admin) => !profileUserIds.has(admin.id)) || []
  );
}

/**
 * All Profiles Page Component
 */
export default async function AllProfilesPage() {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/es/auth/login');
  }

  // Verify user is super admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, role')
    .eq('id', user.id)
    .single();

  if (!adminUser || adminUser.role !== 'super_admin') {
    redirect('/admin/dashboard');
  }

  // Fetch data
  const profiles = await getAllProfiles();
  const adminsWithoutProfiles = await getAdminsWithoutProfiles();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Perfiles</h1>
          <p className="mt-2 text-muted-foreground">
            Administra los perfiles de todos los miembros del equipo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">Super Admin</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Perfiles Totales</p>
              <p className="text-2xl font-bold text-foreground">{profiles.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <UserPlus className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-sm text-muted-foreground">Sin Perfil</p>
              <p className="text-2xl font-bold text-foreground">
                {adminsWithoutProfiles.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-emerald-500" />
            <div>
              <p className="text-sm text-muted-foreground">Perfiles Públicos</p>
              <p className="text-2xl font-bold text-foreground">
                {
                  profiles.filter(
                    (p) =>
                      p.bio_is_public ||
                      p.department_is_public ||
                      (p.urls && p.urls.length > 0)
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admins Without Profiles */}
      {adminsWithoutProfiles.length > 0 && (
        <div className="rounded-lg border border-amber-500/50 bg-amber-50 dark:bg-amber-950/20 p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <UserPlus className="h-5 w-5 text-amber-500" />
            Usuarios sin Perfil ({adminsWithoutProfiles.length})
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Los siguientes administradores aún no tienen un perfil asignado:
          </p>
          <div className="mt-4 space-y-2">
            {adminsWithoutProfiles.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between rounded-md border border-border bg-background p-3"
              >
                <div>
                  <p className="font-medium text-foreground">{admin.name}</p>
                  <p className="text-sm text-muted-foreground">{admin.email}</p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                  {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Nota: La creación de perfiles desde esta interfaz estará disponible próximamente.
            Por ahora, los perfiles deben crearse mediante la base de datos.
          </p>
        </div>
      )}

      {/* Profiles List */}
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-semibold text-foreground">Todos los Perfiles</h2>
        </div>

        {profiles.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              No hay perfiles creados todavía.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center gap-4 p-6 hover:bg-secondary/50 transition-colors"
              >
                {/* Photo */}
                <div className="relative h-16 w-16 flex-shrink-0">
                  {profile.photo_url ? (
                    <Image
                      src={profile.photo_url}
                      alt={profile.username}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-xl font-bold text-muted-foreground">
                      {profile.username[0].toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      @{profile.username}
                    </h3>
                    {profile.bio_is_public && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        Público
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                    {profile.department && (
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {profile.department}
                      </div>
                    )}
                    {profile.roles && profile.roles.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {profile.roles.length} {profile.roles.length === 1 ? 'rol' : 'roles'}
                      </div>
                    )}
                  </div>

                  {profile.bio && profile.bio_is_public && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {profile.bio}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/es/profile/${profile.username}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
                  >
                    Ver Público
                  </Link>
                  <Link
                    href={`/admin/profile`}
                    className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
