/**
 * Profile Roles Manager Component
 *
 * Manages array of user roles with privacy toggles.
 * Allows adding, editing, and removing roles.
 * Includes autocomplete suggestions.
 */

'use client';

import { useState } from 'react';
import { Plus, X, Briefcase, ChevronUp, ChevronDown } from 'lucide-react';
import { PrivacyToggle } from './PrivacyToggle';
import { AutocompleteInput } from './AutocompleteInput';
import { ROLE_SUGGESTIONS } from '@/lib/types/profiles';
import type { ProfileRole } from '@/lib/types/profiles';

interface ProfileRolesManagerProps {
  roles: ProfileRole[];
  onChange: (roles: ProfileRole[]) => void;
  maxRoles?: number;
}

export function ProfileRolesManager({
  roles,
  onChange,
  maxRoles = 5,
}: ProfileRolesManagerProps) {
  /**
   * Sort roles by display_order
   */
  const sortedRoles = [...roles].sort((a, b) => a.display_order - b.display_order);

  /**
   * Add new role with next display_order
   */
  const handleAdd = () => {
    if (roles.length >= maxRoles) return;

    const maxOrder = roles.length > 0
      ? Math.max(...roles.map(r => r.display_order))
      : -1;

    const newRole: ProfileRole = {
      role: '',
      display_order: maxOrder + 1,
      is_public: false,
    };

    onChange([...roles, newRole]);
  };

  /**
   * Update role at index
   */
  const handleUpdate = (
    index: number,
    field: keyof ProfileRole,
    value: string | boolean | number
  ) => {
    const updated = sortedRoles.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  /**
   * Remove role at index and reorder remaining
   */
  const handleRemove = (index: number) => {
    const remaining = sortedRoles.filter((_, i) => i !== index);
    // Reorder display_order to be consecutive
    const reordered = remaining.map((role, i) => ({
      ...role,
      display_order: i,
    }));
    onChange(reordered);
  };

  /**
   * Move role up in order
   */
  const handleMoveUp = (index: number) => {
    if (index === 0) return; // Already at top

    const updated = [...sortedRoles];
    // Swap display_order with previous item
    const temp = updated[index - 1].display_order;
    updated[index - 1] = { ...updated[index - 1], display_order: updated[index].display_order };
    updated[index] = { ...updated[index], display_order: temp };

    onChange(updated);
  };

  /**
   * Move role down in order
   */
  const handleMoveDown = (index: number) => {
    if (index === sortedRoles.length - 1) return; // Already at bottom

    const updated = [...sortedRoles];
    // Swap display_order with next item
    const temp = updated[index + 1].display_order;
    updated[index + 1] = { ...updated[index + 1], display_order: updated[index].display_order };
    updated[index] = { ...updated[index], display_order: temp };

    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">
          Roles
          <span className="ml-2 text-xs text-muted-foreground">
            ({sortedRoles.length} {sortedRoles.length === 1 ? 'rol' : 'roles'})
          </span>
        </label>

        <button
          type="button"
          onClick={handleAdd}
          disabled={roles.length >= maxRoles}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-3 w-3" />
          Agregar Rol
        </button>
      </div>

      {roles.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-8 text-center">
          <Briefcase className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            No hay roles agregados. Haz clic en &quot;Agregar Rol&quot; para comenzar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedRoles.map((roleItem, index) => (
            <div
              key={roleItem.display_order}
              className="rounded-md border border-border bg-background p-4 space-y-3"
            >
              {/* Role Name with Autocomplete */}
              <AutocompleteInput
                value={roleItem.role}
                onChange={(value) => handleUpdate(index, 'role', value)}
                suggestions={ROLE_SUGGESTIONS}
                placeholder="ej. Frontend Developer, Product Manager"
                maxLength={100}
              />

              {/* Actions Row */}
              <div className="flex items-center justify-between gap-2">
                {/* Left side: Ordering buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="inline-flex items-center rounded-md p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover arriba"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === sortedRoles.length - 1}
                    className="inline-flex items-center rounded-md p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover abajo"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-muted-foreground ml-2">
                    #{index + 1}
                  </span>
                </div>

                {/* Right side: Privacy toggle and delete */}
                <div className="flex items-center gap-3">
                  <PrivacyToggle
                    isPublic={roleItem.is_public}
                    onChange={(isPublic) => handleUpdate(index, 'is_public', isPublic)}
                    size="sm"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="inline-flex items-center gap-1 rounded-md text-xs font-medium text-destructive hover:bg-destructive/10 px-2 py-1"
                  >
                    <X className="h-3 w-3" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
