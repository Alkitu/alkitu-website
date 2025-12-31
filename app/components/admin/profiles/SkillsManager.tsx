/**
 * Skills Manager Component
 *
 * Generic component for managing both hard skills and soft skills
 * Allows adding, editing, removing, and reordering skills with privacy toggles
 * No limit on the number of skills
 */

'use client';

import { Plus, X, Award, ChevronUp, ChevronDown } from 'lucide-react';
import { PrivacyToggle } from './PrivacyToggle';
import type { ProfileSkill } from '@/lib/types/profiles';

interface SkillsManagerProps {
  skills: ProfileSkill[];
  onChange: (skills: ProfileSkill[]) => void;
  type: 'hard' | 'soft';
  title: string;
}

export function SkillsManager({
  skills,
  onChange,
  type,
  title,
}: SkillsManagerProps) {
  /**
   * Sort skills by display_order
   */
  const sortedSkills = [...skills].sort((a, b) => a.display_order - b.display_order);

  /**
   * Add new skill with next display_order
   */
  const handleAdd = () => {
    const maxOrder = skills.length > 0
      ? Math.max(...skills.map(s => s.display_order))
      : -1;

    const newSkill: ProfileSkill = {
      skill: '',
      level: 'intermediate', // Default level
      display_order: maxOrder + 1,
      is_public: true,
    };

    onChange([...skills, newSkill]);
  };

  /**
   * Update skill at index
   */
  const handleUpdate = (
    index: number,
    field: keyof ProfileSkill,
    value: string | boolean | number
  ) => {
    const updated = sortedSkills.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  /**
   * Remove skill at index and reorder remaining
   */
  const handleRemove = (index: number) => {
    const remaining = sortedSkills.filter((_, i) => i !== index);
    // Reorder display_order to be consecutive
    const reordered = remaining.map((skill, i) => ({
      ...skill,
      display_order: i,
    }));
    onChange(reordered);
  };

  /**
   * Move skill up in order
   */
  const handleMoveUp = (index: number) => {
    if (index === 0) return; // Already at top

    const updated = [...sortedSkills];
    // Swap display_order with previous item
    const temp = updated[index - 1].display_order;
    updated[index - 1] = { ...updated[index - 1], display_order: updated[index].display_order };
    updated[index] = { ...updated[index], display_order: temp };

    onChange(updated);
  };

  /**
   * Move skill down in order
   */
  const handleMoveDown = (index: number) => {
    if (index === sortedSkills.length - 1) return; // Already at bottom

    const updated = [...sortedSkills];
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
          {title}
          <span className="ml-2 text-xs text-muted-foreground">
            ({sortedSkills.length} {sortedSkills.length === 1 ? 'habilidad' : 'habilidades'})
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

      {sortedSkills.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-8 text-center">
          <Award className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            No hay {type === 'hard' ? 'hard skills' : 'soft skills'} agregadas. Haz clic en "Agregar" para comenzar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedSkills.map((skillItem, index) => (
            <div
              key={skillItem.display_order}
              className="rounded-md border border-border bg-background p-4 space-y-3"
            >
              {/* Skill Name */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Habilidad
                </label>
                <input
                  type="text"
                  value={skillItem.skill}
                  onChange={(e) => handleUpdate(index, 'skill', e.target.value)}
                  placeholder={type === 'hard' ? 'ej. React, TypeScript, SQL' : 'ej. Comunicación, Liderazgo, Trabajo en equipo'}
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
                    disabled={index === sortedSkills.length - 1}
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
                    isPublic={skillItem.is_public}
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
