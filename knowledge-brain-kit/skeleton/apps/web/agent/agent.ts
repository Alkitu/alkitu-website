import { defineAgent } from "eve";

/**
 * Agente experto del cerebro de conocimiento (PRD-web-agentica, E1).
 * Modelo vía AI Gateway (string `proveedor/modelo`) — en Vercel autentica por
 * OIDC, sin API keys. Ajusta el modelo por instancia: las tools hacen el
 * trabajo pesado, así que un modelo pequeño suele bastar (NFR-1 coste).
 */
export default defineAgent({
  model: "anthropic/claude-haiku-4.5",
});
