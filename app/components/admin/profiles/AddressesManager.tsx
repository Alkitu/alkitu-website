/**
 * Addresses Manager Component
 *
 * Manages array of addresses with type selection (office/home) and privacy toggles.
 * Allows adding, editing, and removing addresses.
 * Max 5 addresses per profile.
 */

'use client';

import { useState } from 'react';
import { Plus, X, MapPin, ChevronUp, ChevronDown } from 'lucide-react';
import { PrivacyToggle } from './PrivacyToggle';
import type { ProfileAddress, AddressType } from '@/lib/types/profiles';

interface AddressesManagerProps {
  addresses: ProfileAddress[];
  onChange: (addresses: ProfileAddress[]) => void;
  maxAddresses?: number;
}

export function AddressesManager({
  addresses,
  onChange,
  maxAddresses = 5,
}: AddressesManagerProps) {
  /**
   * Sort addresses by display_order
   */
  const sortedAddresses = [...addresses].sort((a, b) => a.display_order - b.display_order);

  /**
   * Add new address with next display_order
   */
  const handleAdd = () => {
    if (addresses.length >= maxAddresses) return;

    const maxOrder = addresses.length > 0
      ? Math.max(...addresses.map(a => a.display_order))
      : -1;

    const newAddress: ProfileAddress = {
      type: 'office',
      address: '',
      display_order: maxOrder + 1,
      is_public: false,
    };

    onChange([...addresses, newAddress]);
  };

  /**
   * Update address at index
   */
  const handleUpdate = (
    index: number,
    field: keyof ProfileAddress,
    value: string | boolean | AddressType
  ) => {
    const updated = sortedAddresses.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  /**
   * Remove address at index and reorder remaining
   */
  const handleRemove = (index: number) => {
    const remaining = sortedAddresses.filter((_, i) => i !== index);
    // Reorder display_order to be consecutive
    const reordered = remaining.map((address, i) => ({
      ...address,
      display_order: i,
    }));
    onChange(reordered);
  };

  /**
   * Move address up in order
   */
  const handleMoveUp = (index: number) => {
    if (index === 0) return; // Already at top

    const updated = [...sortedAddresses];
    // Swap display_order with previous item
    const temp = updated[index - 1].display_order;
    updated[index - 1] = { ...updated[index - 1], display_order: updated[index].display_order };
    updated[index] = { ...updated[index], display_order: temp };

    onChange(updated);
  };

  /**
   * Move address down in order
   */
  const handleMoveDown = (index: number) => {
    if (index === sortedAddresses.length - 1) return; // Already at bottom

    const updated = [...sortedAddresses];
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
          Direcciones
          <span className="ml-2 text-xs text-muted-foreground">
            ({addresses.length}/{maxAddresses})
          </span>
        </label>

        <button
          type="button"
          onClick={handleAdd}
          disabled={addresses.length >= maxAddresses}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-3 w-3" />
          Agregar Dirección
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-8 text-center">
          <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            No hay direcciones agregadas. Haz clic en &quot;Agregar Dirección&quot; para comenzar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedAddresses.map((addressItem, index) => (
            <div
              key={addressItem.display_order}
              className="rounded-md border border-border bg-background p-4 space-y-3"
            >
              {/* Type Selector */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Tipo
                </label>
                <select
                  value={addressItem.type}
                  onChange={(e) =>
                    handleUpdate(index, 'type', e.target.value as AddressType)
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="office">Oficina</option>
                  <option value="home">Casa</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Dirección
                </label>
                <textarea
                  value={addressItem.address}
                  onChange={(e) => handleUpdate(index, 'address', e.target.value)}
                  placeholder="ej. 123 Main St, Ciudad, País"
                  maxLength={300}
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
                <div className="mt-1 text-xs text-muted-foreground text-right">
                  {addressItem.address.length}/300
                </div>
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
                    disabled={index === sortedAddresses.length - 1}
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
                    isPublic={addressItem.is_public}
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
