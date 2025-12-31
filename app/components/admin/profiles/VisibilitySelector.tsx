/**
 * Visibility Selector Component
 *
 * Allows selecting profile visibility level: public, private, or team_only.
 * Displays clear descriptions for each visibility option.
 */

'use client';

import { Globe, Lock, Users } from 'lucide-react';
import { ProfileVisibility } from '@/lib/types/profiles';

interface VisibilitySelectorProps {
  currentVisibility: ProfileVisibility;
  onChange: (visibility: ProfileVisibility) => void;
}

const VISIBILITY_OPTIONS: {
  value: ProfileVisibility;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: 'public',
    label: 'Público',
    description: 'Visible para todos. Tu perfil aparecerá en búsquedas y será accesible por cualquier persona.',
    icon: Globe,
  },
  {
    value: 'team_only',
    label: 'Solo Equipo',
    description: 'Visible solo para miembros de tu equipo u organización.',
    icon: Users,
  },
  {
    value: 'private',
    label: 'Privado',
    description: 'Solo visible para ti. Nadie más podrá ver tu perfil.',
    icon: Lock,
  },
];

export function VisibilitySelector({
  currentVisibility,
  onChange,
}: VisibilitySelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Visibilidad del Perfil
        </label>
        <p className="text-xs text-muted-foreground mb-4">
          Controla quién puede ver tu perfil y tu información.
        </p>

        {/* Visibility Options */}
        <div className="space-y-3">
          {VISIBILITY_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = currentVisibility === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-secondary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Radio Circle */}
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground bg-background'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                      )}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon
                      className={`h-5 w-5 ${
                        isSelected ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {option.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-4 p-3 rounded-md bg-secondary/30 border border-border">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Nota:</strong> Independientemente de esta configuración, los campos individuales con toggle de privacidad seguirán respetando su configuración específica.
          </p>
        </div>
      </div>
    </div>
  );
}
