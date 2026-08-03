'use client';

import * as React from 'react';
import { SendHorizontal } from 'lucide-react';
import { cn } from '~/lib/utils';
import { AutosizeTextarea } from '~/components/primitives/autosize-textarea';
import { Button } from '~/components/primitives/button';

/**
 * ChatInput Component Props
 *
 * Molécula del design system: textarea autoexpandible + botón de envío,
 * pensada como entrada de comandos/chat. El valor se gestiona internamente
 * y se limpia tras enviar.
 */
export interface ChatInputProps {
  /** Se invoca con el texto (ya recortado, no vacío) al enviar. */
  onSubmit: (text: string) => void;
  /** Deshabilita el envío y muestra spinner mientras hay una acción en curso. */
  pending?: boolean;
  /** Placeholder del textarea. */
  placeholder?: string;
  /** aria-label del botón de envío. */
  submitLabel?: string;
  /** Clases extra para el contenedor. */
  className?: string;
}

/**
 * ChatInput – Design System Molecule
 *
 * Compone `AutosizeTextarea` + `Button` (icon). Enter envía; Shift+Enter
 * inserta un salto de línea. No conoce red ni estado del servidor: solo
 * emite el texto por `onSubmit` y refleja `pending`.
 */
export const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ onSubmit, pending = false, placeholder, submitLabel = 'Enviar', className }, ref) => {
    const [value, setValue] = React.useState('');
    const trimmed = value.trim();
    const canSend = trimmed.length > 0 && !pending;

    const send = () => {
      if (!canSend) return;
      onSubmit(trimmed);
      setValue('');
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // No enviar si hay una composición IME activa (tildes/acentos, dictado):
      // el Enter que confirma la composición no debe disparar el envío.
      if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        send();
      }
    };

    return (
      <div
        className={cn(
          'flex items-end gap-2 rounded-[var(--radius-input)] border border-input bg-background p-2 transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ring-offset-background',
          className,
        )}
        data-slot="chat-input"
      >
        <AutosizeTextarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={pending}
          maxRows={8}
          className="min-h-[40px] flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
          data-testid="chat-input-textarea"
        />
        <Button
          type="button"
          size="icon"
          onClick={send}
          disabled={!canSend}
          loading={pending}
          aria-label={submitLabel}
          data-testid="chat-input-send"
        >
          {!pending && <SendHorizontal />}
        </Button>
      </div>
    );
  },
);

ChatInput.displayName = 'ChatInput';
