/**
 * Profile Email Manager Component
 *
 * Manages array of email addresses with type selection and privacy toggles.
 * Allows adding, editing, and removing emails.
 * Max 3 emails per profile.
 */

'use client';

import { useState } from 'react';
import { Plus, X, Mail, ChevronUp, ChevronDown } from 'lucide-react';
import { PrivacyToggle } from './PrivacyToggle';
import type { ProfileEmail, ContactType } from '@/lib/types/profiles';

interface ProfileEmailManagerProps {
  emails: ProfileEmail[];
  onChange: (emails: ProfileEmail[]) => void;
  maxEmails?: number;
}

export function ProfileEmailManager({
  emails,
  onChange,
  maxEmails = 3,
}: ProfileEmailManagerProps) {
  /**
   * Sort emails by display_order
   */
  const sortedEmails = [...emails].sort((a, b) => a.display_order - b.display_order);

  /**
   * Add new email with next display_order
   */
  const handleAdd = () => {
    if (emails.length >= maxEmails) return;

    const maxOrder = emails.length > 0
      ? Math.max(...emails.map(e => e.display_order))
      : -1;

    const newEmail: ProfileEmail = {
      type: 'work',
      email: '',
      display_order: maxOrder + 1,
      is_public: false,
    };

    onChange([...emails, newEmail]);
  };

  /**
   * Update email at index
   */
  const handleUpdate = (
    index: number,
    field: keyof ProfileEmail,
    value: string | boolean | ContactType
  ) => {
    const updated = sortedEmails.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  /**
   * Remove email at index and reorder remaining
   */
  const handleRemove = (index: number) => {
    const remaining = sortedEmails.filter((_, i) => i !== index);
    // Reorder display_order to be consecutive
    const reordered = remaining.map((email, i) => ({
      ...email,
      display_order: i,
    }));
    onChange(reordered);
  };

  /**
   * Move email up in order
   */
  const handleMoveUp = (index: number) => {
    if (index === 0) return; // Already at top

    const updated = [...sortedEmails];
    // Swap display_order with previous item
    const temp = updated[index - 1].display_order;
    updated[index - 1] = { ...updated[index - 1], display_order: updated[index].display_order };
    updated[index] = { ...updated[index], display_order: temp };

    onChange(updated);
  };

  /**
   * Move email down in order
   */
  const handleMoveDown = (index: number) => {
    if (index === sortedEmails.length - 1) return; // Already at bottom

    const updated = [...sortedEmails];
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
          Correos Electrónicos
          <span className="ml-2 text-xs text-muted-foreground">
            ({emails.length}/{maxEmails})
          </span>
        </label>

        <button
          type="button"
          onClick={handleAdd}
          disabled={emails.length >= maxEmails}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-3 w-3" />
          Agregar Email
        </button>
      </div>

      {emails.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-8 text-center">
          <Mail className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            No hay emails agregados. Haz clic en &quot;Agregar Email&quot; para comenzar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedEmails.map((emailItem, index) => (
            <div
              key={index}
              className="rounded-md border border-border bg-background p-4 space-y-3"
            >
              {/* Type Selector */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Tipo
                </label>
                <select
                  value={emailItem.type}
                  onChange={(e) =>
                    handleUpdate(index, 'type', e.target.value as ContactType)
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="work">Trabajo</option>
                  <option value="personal">Personal</option>
                </select>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={emailItem.email}
                  onChange={(e) => handleUpdate(index, 'email', e.target.value)}
                  placeholder="ej. usuario@ejemplo.com"
                  maxLength={100}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

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
                    disabled={index === sortedEmails.length - 1}
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
                    isPublic={emailItem.is_public}
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
