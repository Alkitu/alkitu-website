/**
 * Profile Editor Component
 *
 * Main form for editing user profiles.
 * Integrates all profile sub-components with tabbed interface.
 * Handles form state, validation, and API communication.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, X as XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PhotoUpload } from './PhotoUpload';
import { BannerUpload } from './BannerUpload';
import { PrivacyToggle } from './PrivacyToggle';
import { AutocompleteInput } from './AutocompleteInput';
import { ProfileURLManager } from './ProfileURLManager';
import { ProfileRolesManager } from './ProfileRolesManager';
import { ProfilePhoneManager } from './ProfilePhoneManager';
import { ProfileEmailManager } from './ProfileEmailManager';
import { SkillsManager } from './SkillsManager';
import { ProfileLanguagesManager } from './ProfileLanguagesManager';
import { AddressesManager } from './AddressesManager';
import { ColorPicker } from './ColorPicker';
import { VisibilitySelector } from './VisibilitySelector';
import {
  DEPARTMENT_SUGGESTIONS,
  type UserProfile,
  type UpdateProfileInput,
  type ThemePreference,
  type ProfileVisibility,
} from '@/lib/types/profiles';

interface ProfileEditorProps {
  profileId?: string; // If provided, fetch and edit existing profile
  initialData?: UserProfile; // Or pass initial data directly
  onSave?: (profile: UserProfile) => void;
  onCancel?: () => void;
}

type TabId = 'basic' | 'personal' | 'professional' | 'social' | 'preferences';

const TABS: { id: TabId; label: string }[] = [
  { id: 'basic', label: 'Información Básica' },
  { id: 'personal', label: 'Personal' },
  { id: 'professional', label: 'Contacto' },
  { id: 'social', label: 'Social y Habilidades' },
  { id: 'preferences', label: 'Preferencias' },
];

export function ProfileEditor({
  profileId,
  initialData,
  onSave,
  onCancel,
}: ProfileEditorProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<UpdateProfileInput>({
    // Photos & Banner
    photo_url: null,
    banner_url: null,

    // Basic Info
    bio: null,
    bio_is_public: false,
    department: null,
    department_is_public: false,

    // Personal Information
    first_name: null,
    first_name_is_public: false,
    last_name: null,
    last_name_is_public: false,
    display_name: null,
    pronouns: null,
    pronouns_is_public: false,
    date_of_birth: null,
    date_of_birth_is_public: false,
    timezone: 'America/New_York',

    // Professional Information
    job_title: null,
    job_title_is_public: false,
    location: null,
    location_is_public: false,
    remote_work: false,

    // JSONB Arrays
    urls: [],
    roles: [],
    phone_numbers: [],
    emails: [],
    hard_skills: [],
    soft_skills: [],
    languages: [],
    addresses: [],

    // Preferences
    language_preference: 'es',
    theme_preference: 'system' as ThemePreference,
    profile_color: '#00BB31',
    profile_visibility: 'public' as ProfileVisibility,
    show_activity_status: true,
  });

  // Readonly fields (not editable)
  const [username, setUsername] = useState<string>('');

  /**
   * Fetch profile data on mount if profileId provided
   */
  useEffect(() => {
    if (initialData) {
      populateForm(initialData);
    } else if (profileId) {
      fetchProfile(profileId);
    }
  }, [profileId, initialData]);

  /**
   * Fetch profile from API
   */
  const fetchProfile = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/profiles/${id}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error al cargar el perfil');
      }

      populateForm(result.data);
    } catch (error) {
      console.error('[ProfileEditor] Fetch error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Error al cargar el perfil'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Populate form with profile data
   */
  const populateForm = (profile: UserProfile) => {
    setUsername(profile.username);
    setFormData({
      // Photos & Banner
      photo_url: profile.photo_url,
      banner_url: profile.banner_url,

      // Basic Info
      bio: profile.bio,
      bio_is_public: profile.bio_is_public,
      department: profile.department,
      department_is_public: profile.department_is_public,

      // Personal Information
      first_name: profile.first_name,
      first_name_is_public: profile.first_name_is_public,
      last_name: profile.last_name,
      last_name_is_public: profile.last_name_is_public,
      display_name: profile.display_name,
      pronouns: profile.pronouns,
      pronouns_is_public: profile.pronouns_is_public,
      date_of_birth: profile.date_of_birth,
      date_of_birth_is_public: profile.date_of_birth_is_public,
      timezone: profile.timezone,

      // Professional Information
      job_title: profile.job_title,
      job_title_is_public: profile.job_title_is_public,
      location: profile.location,
      location_is_public: profile.location_is_public,
      remote_work: profile.remote_work,

      // JSONB Arrays
      urls: profile.urls || [],
      roles: profile.roles || [],
      phone_numbers: profile.phone_numbers || [],
      emails: profile.emails || [],
      hard_skills: profile.hard_skills || [],
      soft_skills: profile.soft_skills || [],
      languages: profile.languages || [],
      addresses: profile.addresses || [],

      // Preferences
      language_preference: profile.language_preference,
      theme_preference: profile.theme_preference,
      profile_color: profile.profile_color,
      profile_visibility: profile.profile_visibility,
      show_activity_status: profile.show_activity_status,
    });
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileId) {
      toast.error('No se puede guardar: ID de perfil no especificado');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/admin/profiles/${profileId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error al guardar el perfil');
      }

      toast.success('Perfil actualizado exitosamente');

      if (onSave) {
        onSave(result.data);
      } else {
        router.push('/admin/profile');
        router.refresh();
      }
    } catch (error) {
      console.error('[ProfileEditor] Save error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Error al guardar el perfil'
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  /**
   * Update form field
   */
  const updateField = <K extends keyof UpdateProfileInput>(
    field: K,
    value: UpdateProfileInput[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header with username */}
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-bold text-foreground">
          Editar Perfil
          {username && (
            <span className="ml-2 text-base font-normal text-muted-foreground">
              @{username}
            </span>
          )}
        </h2>

      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            {/* Photo */}
            <PhotoUpload
              currentPhotoUrl={formData.photo_url ?? null}
              onPhotoChange={(url) => updateField('photo_url', url)}
            />

            {/* Bio */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-foreground">
                  Biografía
                </label>
                <PrivacyToggle
                  isPublic={formData.bio_is_public ?? false}
                  onChange={(isPublic) => updateField('bio_is_public', isPublic)}
                  size="sm"
                />
              </div>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder="Cuéntanos sobre ti..."
                rows={4}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {formData.bio?.length || 0} caracteres
              </p>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-foreground">
                  Departamento
                </label>
                <PrivacyToggle
                  isPublic={formData.department_is_public ?? false}
                  onChange={(isPublic) =>
                    updateField('department_is_public', isPublic)
                  }
                  size="sm"
                />
              </div>
              <AutocompleteInput
                value={formData.department || ''}
                onChange={(value) => updateField('department', value)}
                suggestions={DEPARTMENT_SUGGESTIONS}
                placeholder="ej. Engineering, Design, Marketing"
              />
            </div>
          </div>
        )}

        {/* Personal Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            {/* First Name */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-foreground">
                  Nombre
                </label>
                <PrivacyToggle
                  isPublic={formData.first_name_is_public ?? false}
                  onChange={(isPublic) => updateField('first_name_is_public', isPublic)}
                  size="sm"
                />
              </div>
              <input
                type="text"
                value={formData.first_name || ''}
                onChange={(e) => updateField('first_name', e.target.value)}
                placeholder="Tu nombre"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-foreground">
                  Apellido
                </label>
                <PrivacyToggle
                  isPublic={formData.last_name_is_public ?? false}
                  onChange={(isPublic) => updateField('last_name_is_public', isPublic)}
                  size="sm"
                />
              </div>
              <input
                type="text"
                value={formData.last_name || ''}
                onChange={(e) => updateField('last_name', e.target.value)}
                placeholder="Tu apellido"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Nombre de Visualización
              </label>
              <input
                type="text"
                value={formData.display_name || ''}
                onChange={(e) => updateField('display_name', e.target.value)}
                placeholder="Cómo quieres que te llamen (opcional)"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground">
                Si está vacío, se usará tu nombre y apellido
              </p>
            </div>

            {/* Pronouns */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-foreground">
                  Pronombres
                </label>
                <PrivacyToggle
                  isPublic={formData.pronouns_is_public ?? false}
                  onChange={(isPublic) => updateField('pronouns_is_public', isPublic)}
                  size="sm"
                />
              </div>
              <input
                type="text"
                value={formData.pronouns || ''}
                onChange={(e) => updateField('pronouns', e.target.value)}
                placeholder="ej. él/him, ella/her, elle/they"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-foreground">
                  Fecha de Nacimiento
                </label>
                <PrivacyToggle
                  isPublic={formData.date_of_birth_is_public ?? false}
                  onChange={(isPublic) => updateField('date_of_birth_is_public', isPublic)}
                  size="sm"
                />
              </div>
              <input
                type="date"
                value={formData.date_of_birth || ''}
                onChange={(e) => updateField('date_of_birth', e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Zona Horaria
              </label>
              <select
                value={formData.timezone || 'America/New_York'}
                onChange={(e) => updateField('timezone', e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="America/New_York">Este (ET) - Nueva York</option>
                <option value="America/Chicago">Central (CT) - Chicago</option>
                <option value="America/Denver">Montaña (MT) - Denver</option>
                <option value="America/Los_Angeles">Pacífico (PT) - Los Ángeles</option>
                <option value="America/Caracas">Caracas (VET)</option>
                <option value="America/Mexico_City">Ciudad de México (CST)</option>
                <option value="America/Bogota">Bogotá (COT)</option>
                <option value="America/Lima">Lima (PET)</option>
                <option value="America/Santiago">Santiago (CLT)</option>
                <option value="America/Argentina/Buenos_Aires">Buenos Aires (ART)</option>
                <option value="Europe/London">Londres (GMT)</option>
                <option value="Europe/Paris">París (CET)</option>
                <option value="Europe/Madrid">Madrid (CET)</option>
                <option value="Asia/Tokyo">Tokio (JST)</option>
                <option value="Asia/Shanghai">Shanghai (CST)</option>
                <option value="Australia/Sydney">Sídney (AEDT)</option>
              </select>
            </div>
          </div>
        )}

        {/* Professional Tab */}
        {activeTab === 'professional' && (
          <div className="space-y-6">
            {/* Job Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-foreground">
                  Título del Trabajo
                </label>
                <PrivacyToggle
                  isPublic={formData.job_title_is_public ?? false}
                  onChange={(isPublic) => updateField('job_title_is_public', isPublic)}
                  size="sm"
                />
              </div>
              <input
                type="text"
                value={formData.job_title || ''}
                onChange={(e) => updateField('job_title', e.target.value)}
                placeholder="ej. Senior Software Engineer"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-foreground">
                  Ubicación
                </label>
                <PrivacyToggle
                  isPublic={formData.location_is_public ?? false}
                  onChange={(isPublic) => updateField('location_is_public', isPublic)}
                  size="sm"
                />
              </div>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="ej. Madrid, España o Remote"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Remote Work */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remote_work"
                checked={formData.remote_work ?? false}
                onChange={(e) => updateField('remote_work', e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="remote_work" className="text-sm text-foreground cursor-pointer">
                Trabajo remoto
              </label>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Información de Contacto
              </h3>

              <div className="space-y-6">
                <ProfilePhoneManager
                  phoneNumbers={formData.phone_numbers || []}
                  onChange={(phones) => updateField('phone_numbers', phones)}
                />

                <ProfileEmailManager
                  emails={formData.emails || []}
                  onChange={(emails) => updateField('emails', emails)}
                />

                <AddressesManager
                  addresses={formData.addresses || []}
                  onChange={(addresses) => updateField('addresses', addresses)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Social & Skills Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <ProfileURLManager
              urls={formData.urls || []}
              onChange={(urls) => updateField('urls', urls)}
            />

            <ProfileRolesManager
              roles={formData.roles || []}
              onChange={(roles) => updateField('roles', roles)}
            />

            <SkillsManager
              skills={formData.hard_skills || []}
              onChange={(skills) => updateField('hard_skills', skills)}
              type="hard"
              title="Hard Skills"
            />

            <SkillsManager
              skills={formData.soft_skills || []}
              onChange={(skills) => updateField('soft_skills', skills)}
              type="soft"
              title="Soft Skills"
            />

            <ProfileLanguagesManager
              languages={formData.languages || []}
              onChange={(languages) => updateField('languages', languages)}
            />
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            {/* Banner */}
            <BannerUpload
              currentBannerUrl={formData.banner_url ?? null}
              onBannerChange={(url) => updateField('banner_url', url)}
            />

            {/* Profile Color */}
            <ColorPicker
              currentColor={formData.profile_color ?? '#00BB31'}
              onChange={(color) => updateField('profile_color', color)}
            />

            {/* Theme Preference */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Tema de Interfaz
              </label>
              <select
                value={formData.theme_preference || 'system'}
                onChange={(e) => updateField('theme_preference', e.target.value as ThemePreference)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="system">Sistema (Automático)</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Elige el tema de color de la interfaz
              </p>
            </div>

            {/* Profile Visibility */}
            <VisibilitySelector
              currentVisibility={formData.profile_visibility ?? 'public'}
              onChange={(visibility) => updateField('profile_visibility', visibility)}
            />

            {/* Language Preference */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Idioma de Interfaz
              </label>
              <select
                value={formData.language_preference || 'es'}
                onChange={(e) => updateField('language_preference', e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Idioma preferido para la interfaz de usuario
              </p>
            </div>

            {/* Show Activity Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="show_activity_status"
                checked={formData.show_activity_status ?? true}
                onChange={(e) => updateField('show_activity_status', e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="show_activity_status" className="text-sm text-foreground cursor-pointer">
                Mostrar estado de actividad (en línea/desconectado)
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
        <button
          type="button"
          onClick={handleCancel}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <XIcon className="h-4 w-4" />
          Cancelar
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </button>
      </div>
    </form>
  );
}
