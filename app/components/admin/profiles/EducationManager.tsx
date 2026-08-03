/**
 * Education Manager Component
 *
 * Manages the education array: school, bilingual degree, location, date range,
 * and per-item privacy/ordering — same conventions as ExperienceManager.
 */

'use client';

import { Plus, X, GraduationCap, ChevronUp, ChevronDown } from 'lucide-react';
import { PrivacyToggle } from './PrivacyToggle';
import type { ProfileEducation } from '@/lib/types/profiles';

interface EducationManagerProps {
  education: ProfileEducation[];
  onChange: (education: ProfileEducation[]) => void;
}

export function EducationManager({ education, onChange }: EducationManagerProps) {
  const sorted = [...education].sort((a, b) => a.display_order - b.display_order);

  const handleAdd = () => {
    const maxOrder = education.length > 0 ? Math.max(...education.map((e) => e.display_order)) : -1;
    const newItem: ProfileEducation = {
      school: '',
      degree: { en: '', es: '' },
      location: null,
      start_date: '',
      end_date: null,
      display_order: maxOrder + 1,
      is_public: true,
    };
    onChange([...education, newItem]);
  };

  const handleUpdate = <K extends keyof ProfileEducation>(
    index: number,
    field: K,
    value: ProfileEducation[K]
  ) => {
    const updated = sorted.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const remaining = sorted.filter((_, i) => i !== index);
    onChange(remaining.map((item, i) => ({ ...item, display_order: i })));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...sorted];
    const temp = updated[index - 1].display_order;
    updated[index - 1] = { ...updated[index - 1], display_order: updated[index].display_order };
    updated[index] = { ...updated[index], display_order: temp };
    onChange(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === sorted.length - 1) return;
    const updated = [...sorted];
    const temp = updated[index + 1].display_order;
    updated[index + 1] = { ...updated[index + 1], display_order: updated[index].display_order };
    updated[index] = { ...updated[index], display_order: temp };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">
          Educación
          <span className="ml-2 text-xs text-muted-foreground">
            ({sorted.length} {sorted.length === 1 ? 'entrada' : 'entradas'})
          </span>
        </label>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-3 w-3" />
          Agregar
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-8 text-center">
          <GraduationCap className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            No hay educación agregada. Haz clic en &quot;Agregar&quot; para comenzar.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((item, index) => (
            <div key={index} className="rounded-md border border-border bg-background p-4 space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Institución</label>
                  <input
                    type="text"
                    value={item.school}
                    onChange={(e) => handleUpdate(index, 'school', e.target.value)}
                    placeholder="ej. Universidad Simón Bolívar"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Ubicación</label>
                  <input
                    type="text"
                    value={item.location || ''}
                    onChange={(e) => handleUpdate(index, 'location', e.target.value || null)}
                    placeholder="ej. Spain"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Título (EN)</label>
                  <input
                    type="text"
                    value={item.degree.en}
                    onChange={(e) => handleUpdate(index, 'degree', { ...item.degree, en: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Título (ES)</label>
                  <input
                    type="text"
                    value={item.degree.es}
                    onChange={(e) => handleUpdate(index, 'degree', { ...item.degree, es: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Inicio</label>
                  <input
                    type="date"
                    value={item.start_date}
                    onChange={(e) => handleUpdate(index, 'start_date', e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Fin (vacío = en curso)
                  </label>
                  <input
                    type="date"
                    value={item.end_date || ''}
                    onChange={(e) => handleUpdate(index, 'end_date', e.target.value || null)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
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
                    disabled={index === sorted.length - 1}
                    className="inline-flex items-center rounded-md p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover abajo"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-muted-foreground ml-2">#{index + 1}</span>
                </div>

                <div className="flex items-center gap-3">
                  <PrivacyToggle
                    isPublic={item.is_public}
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
