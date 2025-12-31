/**
 * Color Picker Component
 *
 * Allows selecting a profile color from presets or custom hex input.
 * Shows live preview of selected color.
 */

'use client';

import { useState } from 'react';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  currentColor: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  { name: 'Alkitu Verde', value: '#00BB31' },
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Morado', value: '#8B5CF6' },
  { name: 'Rosa', value: '#EC4899' },
  { name: 'Rojo', value: '#EF4444' },
  { name: 'Naranja', value: '#F97316' },
  { name: 'Amarillo', value: '#EAB308' },
  { name: 'Verde Oscuro', value: '#10B981' },
  { name: 'Turquesa', value: '#14B8A6' },
  { name: 'Índigo', value: '#6366F1' },
  { name: 'Gris', value: '#6B7280' },
  { name: 'Negro', value: '#000000' },
];

export function ColorPicker({ currentColor, onChange }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(currentColor);
  const [isCustomMode, setIsCustomMode] = useState(
    !PRESET_COLORS.some((c) => c.value.toLowerCase() === currentColor.toLowerCase())
  );

  /**
   * Validate hex color format
   */
  const isValidHex = (hex: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(hex);
  };

  /**
   * Handle preset color selection
   */
  const handlePresetSelect = (color: string) => {
    setCustomColor(color);
    setIsCustomMode(false);
    onChange(color);
  };

  /**
   * Handle custom color input
   */
  const handleCustomColorChange = (value: string) => {
    let formattedValue = value.trim();

    // Add # if missing
    if (formattedValue && !formattedValue.startsWith('#')) {
      formattedValue = '#' + formattedValue;
    }

    setCustomColor(formattedValue);

    // Only update parent if valid
    if (isValidHex(formattedValue)) {
      onChange(formattedValue.toUpperCase());
    }
  };

  /**
   * Enable custom mode
   */
  const handleCustomModeClick = () => {
    setIsCustomMode(true);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Color de Perfil
        </label>
        <p className="text-xs text-muted-foreground mb-4">
          Selecciona un color para personalizar tu perfil.
        </p>

        {/* Color Preview */}
        <div className="mb-4 p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-16 rounded-lg border-2 border-border shadow-sm"
              style={{ backgroundColor: currentColor }}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Color Actual</p>
              <p className="text-xs text-muted-foreground font-mono">{currentColor.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Preset Colors Grid */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Colores Predefinidos</p>
          <div className="grid grid-cols-6 gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => handlePresetSelect(color.value)}
                className={`group relative h-12 rounded-lg border-2 transition-all hover:scale-110 ${
                  currentColor.toLowerCase() === color.value.toLowerCase() && !isCustomMode
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {currentColor.toLowerCase() === color.value.toLowerCase() && !isCustomMode && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full border-2 border-gray-800" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color Input */}
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-foreground">Color Personalizado</p>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                onFocus={handleCustomModeClick}
                placeholder="#00BB31"
                maxLength={7}
                className={`w-full rounded-md border px-3 py-2 text-sm font-mono uppercase placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
                  isCustomMode && isValidHex(customColor)
                    ? 'border-primary bg-background text-foreground focus:border-primary focus:ring-primary'
                    : isCustomMode && customColor
                    ? 'border-destructive bg-destructive/5 text-destructive focus:border-destructive focus:ring-destructive'
                    : 'border-border bg-background text-foreground focus:border-primary focus:ring-primary'
                }`}
              />
              <Palette className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Native Color Picker */}
            <input
              type="color"
              value={currentColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                setIsCustomMode(true);
                onChange(e.target.value.toUpperCase());
              }}
              className="w-12 h-10 rounded-md border border-border cursor-pointer"
              title="Selector de color nativo"
            />
          </div>

          {isCustomMode && customColor && !isValidHex(customColor) && (
            <p className="text-xs text-destructive">
              Formato inválido. Usa formato hexadecimal (#RRGGBB)
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Ingresa un color hexadecimal (ej: #00BB31) o usa el selector de color
          </p>
        </div>
      </div>
    </div>
  );
}
