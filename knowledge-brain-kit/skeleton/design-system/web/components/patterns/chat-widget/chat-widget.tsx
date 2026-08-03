"use client";

import * as React from "react";

import { ChatInput } from "../chat-input/chat-input";

/** Mensaje plano que el widget sabe pintar (el contenedor lo proyecta desde su fuente). */
export type ChatWidgetMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export interface ChatWidgetLabels {
  title: string;
  placeholder: string;
  send: string;
  thinking: string;
  error: string;
  open: string;
  close: string;
  /** Mensaje de bienvenida cuando aún no hay conversación. */
  empty: string;
}

export interface ChatWidgetProps {
  messages: ChatWidgetMessage[];
  /** ready | submitted | streaming | error (mismo léxico que el hook del agente). */
  status: "ready" | "submitted" | "streaming" | "error";
  onSend: (text: string) => void;
  labels: ChatWidgetLabels;
  className?: string;
}

/**
 * ChatWidget — burbuja flotante + panel de conversación con el agente del sitio.
 * Presentacional puro: no sabe de eve ni de red; recibe mensajes/estado y emite
 * `onSend` (el contenedor de la app hace el wiring). Compone ds:patterns/chat-input.
 * Piel desde tokens (primary/card/border). ds:patterns/chat-widget.
 */
export function ChatWidget({ messages, status, onSend, labels, className = "" }: ChatWidgetProps) {
  const [open, setOpen] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const pending = status === "submitted" || status === "streaming";

  // Auto-scroll al último mensaje mientras llega el stream.
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, status]);

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 ${className}`}>
      {open && (
        <div className="flex h-[28rem] w-[min(92vw,24rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3">
            <p className="text-sm font-semibold text-white">{labels.title}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={labels.close}
              className="rounded p-1 text-white/80 transition-colors hover:text-white"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3" aria-live="polite">
            {messages.length === 0 && <p className="text-sm text-muted-foreground">{labels.empty}</p>}
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-white"
                      : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-accent px-3 py-2 text-sm text-foreground"
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {pending && <p className="text-xs text-muted-foreground">{labels.thinking}</p>}
            {status === "error" && <p className="text-xs text-red-600">{labels.error}</p>}
          </div>

          <div className="border-t border-border p-2">
            <ChatInput onSubmit={onSend} pending={pending} placeholder={labels.placeholder} submitLabel={labels.send} />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? labels.close : labels.open}
        aria-expanded={open}
        className="flex h-13 w-13 items-center justify-center rounded-full bg-primary p-3.5 text-white shadow-lg transition-transform hover:scale-105"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
