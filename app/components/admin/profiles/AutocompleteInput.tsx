/**
 * Autocomplete Input Component
 *
 * Combo input with suggestions (combobox pattern).
 * Users can select from suggestions or enter custom values.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: readonly string[];
  placeholder?: string;
  label?: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
}

export function AutocompleteInput({
  value,
  onChange,
  suggestions,
  placeholder = 'Escribe o selecciona...',
  label,
  maxLength = 100,
  required = false,
  disabled = false,
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<readonly string[]>(suggestions);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Filter suggestions based on input value
   */
  useEffect(() => {
    if (!value) {
      setFilteredSuggestions(suggestions);
      return;
    }

    const filtered = suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredSuggestions(filtered);
    setHighlightedIndex(-1);
  }, [value, suggestions]);

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Handle input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  /**
   * Handle suggestion selection
   */
  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;

      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
          handleSelect(filteredSuggestions[highlightedIndex]);
        } else {
          setIsOpen(false);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          className="w-full rounded-md border border-border bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="autocomplete-dropdown"
        />

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:cursor-not-allowed"
          aria-label="Toggle suggestions"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && filteredSuggestions.length > 0 && (
        <div
          ref={dropdownRef}
          id="autocomplete-dropdown"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-background shadow-lg"
          role="listbox"
        >
          {filteredSuggestions.map((suggestion, index) => {
            const isHighlighted = index === highlightedIndex;
            const isSelected = suggestion === value;

            return (
              <div
                key={suggestion}
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`
                  flex cursor-pointer items-center justify-between px-3 py-2 text-sm
                  ${isHighlighted ? 'bg-secondary' : ''}
                  ${isSelected ? 'bg-primary/10' : ''}
                  hover:bg-secondary
                `}
                role="option"
                aria-selected={isSelected}
              >
                <span className="text-foreground">{suggestion}</span>
                {isSelected && <Check className="h-4 w-4 text-primary" />}
              </div>
            );
          })}
        </div>
      )}

      {isOpen && filteredSuggestions.length === 0 && value && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-background p-3 text-center text-sm text-muted-foreground shadow-lg">
          No se encontraron sugerencias. Presiona Enter para usar &quot;{value}&quot;
        </div>
      )}
    </div>
  );
}
