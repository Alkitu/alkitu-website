/**
 * Profile Languages Manager Component
 *
 * Manages a list of languages with proficiency levels and privacy toggles.
 * Each language can be marked as public or private individually.
 */

'use client';

import { useState } from 'react';
import { Plus, X as XIcon, Lock, Unlock, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { ProfileLanguage, LanguageProficiency } from '@/lib/types/profiles';

interface ProfileLanguagesManagerProps {
  languages: ProfileLanguage[];
  onChange: (languages: ProfileLanguage[]) => void;
}

const PROFICIENCY_LEVELS: { value: LanguageProficiency; label: string }[] = [
  { value: 'native', label: 'Nativo' },
  { value: 'fluent', label: 'Fluido' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'basic', label: 'Básico' },
];

const LANGUAGE_SUGGESTIONS = [
  'Español',
  'English',
  'Français',
  'Deutsch',
  'Italiano',
  'Português',
  '中文',
  '日本語',
  '한국어',
  'العربية',
  'Русский',
  'हिन्दी',
  'Nederlands',
  'Svenska',
  'Norsk',
  'Dansk',
  'Polski',
  'Čeština',
  'Ελληνικά',
  'עברית',
];

export function ProfileLanguagesManager({
  languages,
  onChange,
}: ProfileLanguagesManagerProps) {
  const [newLanguage, setNewLanguage] = useState('');
  const [newProficiency, setNewProficiency] =
    useState<LanguageProficiency>('intermediate');
  const [showSuggestions, setShowSuggestions] = useState(false);

  /**
   * Sort languages by display_order
   */
  const sortedLanguages = [...languages].sort((a, b) => a.display_order - b.display_order);

  /**
   * Add new language to the list with next display_order
   */
  const handleAdd = () => {
    const trimmed = newLanguage.trim();

    if (!trimmed) {
      toast.error('El nombre del idioma no puede estar vacío');
      return;
    }

    // Check for duplicates
    if (
      languages.some((l) => l.language.toLowerCase() === trimmed.toLowerCase())
    ) {
      toast.error('Este idioma ya existe en tu perfil');
      return;
    }

    const maxOrder = languages.length > 0
      ? Math.max(...languages.map(l => l.display_order))
      : -1;

    const newLanguageEntry: ProfileLanguage = {
      language: trimmed,
      proficiency: newProficiency,
      display_order: maxOrder + 1,
      is_public: true, // Default to public
    };

    onChange([...languages, newLanguageEntry]);
    setNewLanguage('');
    setNewProficiency('intermediate');
    setShowSuggestions(false);
    toast.success('Idioma agregado');
  };

  /**
   * Remove language from the list and reorder remaining
   */
  const handleRemove = (index: number) => {
    const remaining = sortedLanguages.filter((_, i) => i !== index);
    // Reorder display_order to be consecutive
    const reordered = remaining.map((lang, i) => ({
      ...lang,
      display_order: i,
    }));
    onChange(reordered);
    toast.success('Idioma eliminado');
  };

  /**
   * Move language up in order
   */
  const handleMoveUp = (index: number) => {
    if (index === 0) return; // Already at top

    const updated = [...sortedLanguages];
    // Swap display_order with previous item
    const temp = updated[index - 1].display_order;
    updated[index - 1] = { ...updated[index - 1], display_order: updated[index].display_order };
    updated[index] = { ...updated[index], display_order: temp };

    onChange(updated);
  };

  /**
   * Move language down in order
   */
  const handleMoveDown = (index: number) => {
    if (index === sortedLanguages.length - 1) return; // Already at bottom

    const updated = [...sortedLanguages];
    // Swap display_order with next item
    const temp = updated[index + 1].display_order;
    updated[index + 1] = { ...updated[index + 1], display_order: updated[index].display_order };
    updated[index] = { ...updated[index], display_order: temp };

    onChange(updated);
  };

  /**
   * Toggle privacy for a language
   */
  const handleTogglePrivacy = (index: number) => {
    const updated = sortedLanguages.map((lang, i) =>
      i === index ? { ...lang, is_public: !lang.is_public } : lang
    );
    onChange(updated);
  };

  /**
   * Update language proficiency
   */
  const handleUpdateProficiency = (
    index: number,
    proficiency: LanguageProficiency
  ) => {
    const updated = sortedLanguages.map((lang, i) =>
      i === index ? { ...lang, proficiency } : lang
    );
    onChange(updated);
  };

  /**
   * Select language from suggestions
   */
  const handleSelectSuggestion = (suggestion: string) => {
    setNewLanguage(suggestion);
    setShowSuggestions(false);
  };

  /**
   * Filter suggestions based on input
   */
  const filteredSuggestions = LANGUAGE_SUGGESTIONS.filter(
    (s) =>
      s.toLowerCase().includes(newLanguage.toLowerCase()) &&
      !languages.some((lang) => lang.language.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Idiomas
        </label>
        <p className="text-xs text-muted-foreground mb-4">
          Agrega los idiomas que hablas y tu nivel de competencia en cada uno.
        </p>

        {/* Add New Language */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => {
                setNewLanguage(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Ej: Español, English, Français..."
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-background shadow-lg max-h-48 overflow-auto">
                {filteredSuggestions.slice(0, 10).map((suggestion) => (
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
              value={newProficiency}
              onChange={(e) =>
                setNewProficiency(e.target.value as LanguageProficiency)
              }
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {PROFICIENCY_LEVELS.map((level) => (
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

      {/* Languages List */}
      {languages.length > 0 && (
        <div className="space-y-2">
          {sortedLanguages.map((lang, index) => (
            <div
              key={index}
              className="rounded-md border border-border bg-card p-3 space-y-3"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {lang.language}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    lang.proficiency === 'native'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                      : lang.proficiency === 'fluent'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : lang.proficiency === 'intermediate'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {
                    PROFICIENCY_LEVELS.find((l) => l.value === lang.proficiency)
                      ?.label
                  }
                </span>
              </div>

              {/* Proficiency Selector */}
              <select
                value={lang.proficiency}
                onChange={(e) =>
                  handleUpdateProficiency(
                    index,
                    e.target.value as LanguageProficiency
                  )
                }
                className="w-full text-xs rounded border border-border bg-background px-2 py-1 text-muted-foreground focus:border-primary focus:outline-none"
              >
                {PROFICIENCY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>

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
                    disabled={index === sortedLanguages.length - 1}
                    className="inline-flex items-center rounded-md p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover abajo"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-muted-foreground ml-2">
                    #{index + 1}
                  </span>
                </div>

                {/* Right side: Privacy toggle and remove */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleTogglePrivacy(index)}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    {lang.is_public ? (
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

                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {languages.length === 0 && (
        <div className="rounded-md border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No has agregado idiomas aún. Agrega los idiomas que hablas para
            mostrar tu versatilidad.
          </p>
        </div>
      )}
    </div>
  );
}
