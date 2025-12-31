/**
 * Profile Skills Manager Component
 *
 * Manages a list of skills with proficiency levels and privacy toggles.
 * Each skill can be marked as public or private individually.
 */

'use client';

import { useState } from 'react';
import { Plus, X as XIcon, Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';
import { ProfileSkill, SkillLevel } from '@/lib/types/profiles';

interface ProfileSkillsManagerProps {
  skills: ProfileSkill[];
  onChange: (skills: ProfileSkill[]) => void;
}

const SKILL_LEVELS: { value: SkillLevel; label: string }[] = [
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'expert', label: 'Experto' },
];

const SKILL_SUGGESTIONS = [
  'React',
  'TypeScript',
  'Next.js',
  'Node.js',
  'Python',
  'JavaScript',
  'HTML',
  'CSS',
  'Tailwind CSS',
  'GraphQL',
  'REST API',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'AWS',
  'Git',
  'Figma',
  'UI/UX Design',
  'Agile',
  'Team Leadership',
];

export function ProfileSkillsManager({
  skills,
  onChange,
}: ProfileSkillsManagerProps) {
  const [newSkill, setNewSkill] = useState('');
  const [newLevel, setNewLevel] = useState<SkillLevel>('intermediate');
  const [showSuggestions, setShowSuggestions] = useState(false);

  /**
   * Add new skill to the list
   */
  const handleAdd = () => {
    const trimmed = newSkill.trim();

    if (!trimmed) {
      toast.error('El nombre de la habilidad no puede estar vacío');
      return;
    }

    // Check for duplicates
    if (skills.some((s) => s.skill.toLowerCase() === trimmed.toLowerCase())) {
      toast.error('Esta habilidad ya existe en tu perfil');
      return;
    }

    const newSkillEntry: ProfileSkill = {
      skill: trimmed,
      level: newLevel,
      display_order: skills.length, // Next in sequence
      is_public: true, // Default to public
    };

    onChange([...skills, newSkillEntry]);
    setNewSkill('');
    setNewLevel('intermediate');
    setShowSuggestions(false);
    toast.success('Habilidad agregada');
  };

  /**
   * Remove skill from the list
   */
  const handleRemove = (index: number) => {
    const updated = skills.filter((_, i) => i !== index);
    onChange(updated);
    toast.success('Habilidad eliminada');
  };

  /**
   * Toggle privacy for a skill
   */
  const handleTogglePrivacy = (index: number) => {
    const updated = skills.map((skill, i) =>
      i === index ? { ...skill, is_public: !skill.is_public } : skill
    );
    onChange(updated);
  };

  /**
   * Update skill level
   */
  const handleUpdateLevel = (index: number, level: SkillLevel) => {
    const updated = skills.map((skill, i) =>
      i === index ? { ...skill, level } : skill
    );
    onChange(updated);
  };

  /**
   * Select skill from suggestions
   */
  const handleSelectSuggestion = (suggestion: string) => {
    setNewSkill(suggestion);
    setShowSuggestions(false);
  };

  /**
   * Filter suggestions based on input
   */
  const filteredSuggestions = SKILL_SUGGESTIONS.filter(
    (s) =>
      s.toLowerCase().includes(newSkill.toLowerCase()) &&
      !skills.some((skill) => skill.skill.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Habilidades
        </label>
        <p className="text-xs text-muted-foreground mb-4">
          Agrega tus habilidades técnicas y profesionales con su nivel de
          competencia.
        </p>

        {/* Add New Skill */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => {
                setNewSkill(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Ej: React, Python, UI Design..."
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-background shadow-lg max-h-48 overflow-auto">
                {filteredSuggestions.slice(0, 8).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-secondary transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <select
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value as SkillLevel)}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {SKILL_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Skills List */}
      {skills.length > 0 && (
        <div className="space-y-2">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-md border border-border bg-card p-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {skill.skill}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      skill.level === 'expert'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : skill.level === 'intermediate'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {SKILL_LEVELS.find((l) => l.value === skill.level)?.label}
                  </span>
                </div>

                {/* Level Selector */}
                <select
                  value={skill.level}
                  onChange={(e) =>
                    handleUpdateLevel(index, e.target.value as SkillLevel)
                  }
                  className="mt-2 text-xs rounded border border-border bg-background px-2 py-1 text-muted-foreground focus:border-primary focus:outline-none"
                >
                  {SKILL_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Privacy Toggle */}
              <button
                type="button"
                onClick={() => handleTogglePrivacy(index)}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors"
              >
                {skill.is_public ? (
                  <>
                    <Unlock className="h-3 w-3" />
                    Público
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3" />
                    Privado
                  </>
                )}
              </button>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {skills.length === 0 && (
        <div className="rounded-md border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No has agregado habilidades aún. Agrega tus habilidades para que
            otros sepan en qué eres experto.
          </p>
        </div>
      )}
    </div>
  );
}
