"use client";

import { useEveAgent } from "eve/react";
import { ChatWidget, type ChatWidgetMessage } from "@brain/design-system-web/patterns/chat-widget";

import type { Locale } from "@/lib/i18n/config";

// Copy del widget por locale (el agente responde en el idioma de la pregunta;
// esto es solo el chrome del panel).
const LABELS = {
  es: {
    title: "Pregunta al experto",
    placeholder: "Pregunta sobre [concepto]…",
    send: "Enviar",
    thinking: "Consultando la base de conocimiento…",
    error: "Algo falló. Vuelve a intentarlo.",
    open: "Abrir chat",
    close: "Cerrar chat",
    empty: "Hola — respondo solo con la base de conocimiento de este sitio, citando la fuente.",
  },
  en: {
    title: "Ask the expert",
    placeholder: "Ask about [concept]…",
    send: "Send",
    thinking: "Checking the knowledge base…",
    error: "Something failed. Try again.",
    open: "Open chat",
    close: "Close chat",
    empty: "Hi — I answer only from this site's knowledge base, citing the source.",
  },
} as const;

/**
 * AgentChat — contenedor del agente del sitio (PRD-web-agentica E3): hace el
 * wiring eve (useEveAgent → sesión /eve/v1/* montada por withEve) y proyecta
 * los mensajes al ChatWidget presentacional del DS. La lógica de conocimiento
 * vive en el agente (agent/ + lib/agent/), no aquí.
 */
export function AgentChat({ lang }: { lang: Locale }) {
  const { data, status, send } = useEveAgent();

  // Proyección: EveMessage.parts[] → texto plano concatenado (solo parts de texto).
  const messages: ChatWidgetMessage[] = data.messages.map((m, i) => ({
    id: m.id ?? String(i),
    role: m.role,
    text: m.parts
      .filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
      .map((p) => p.text)
      .join(""),
  }));

  return (
    <ChatWidget
      messages={messages.filter((m) => m.text.length > 0)}
      status={status}
      onSend={(text) => void send({ message: text })}
      labels={LABELS[lang]}
    />
  );
}
