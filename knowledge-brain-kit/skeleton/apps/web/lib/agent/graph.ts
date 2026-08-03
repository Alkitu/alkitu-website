import { readFileSync } from "node:fs";

import { resolveAsset } from "./paths";

/** Nodo/arista del grafo graphify (Context/graphify-out/graph.json, formato node-link). */
interface GraphNode {
  id: string;
  label: string;
  norm_label?: string;
  community?: number;
}
interface GraphLink {
  source: string;
  target: string;
  relation?: string;
  weight?: number;
}

let cache: { nodes: GraphNode[]; links: GraphLink[] } | null = null;

function loadGraph() {
  if (cache) return cache;
  const p = resolveAsset("Context/graphify-out/graph.json", "../../Context/graphify-out/graph.json");
  if (!p) return null;
  try {
    const d = JSON.parse(readFileSync(p, "utf8"));
    cache = { nodes: d.nodes ?? [], links: d.links ?? [] };
    return cache;
  } catch {
    return null;
  }
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/**
 * Vecindario de un concepto en el grafo de conocimiento: el nodo, sus
 * relaciones directas y los nodos de su comunidad. null = grafo no generado
 * (correr `pnpm graph`); el agente lo comunica honestamente.
 */
export function queryGraph(concepto: string, maxVecinos = 12) {
  const g = loadGraph();
  if (!g) return null;
  const nq = norm(concepto);
  const nodo =
    g.nodes.find((n) => norm(n.label) === nq || (n.norm_label && norm(n.norm_label) === nq)) ??
    g.nodes.find((n) => norm(n.label).includes(nq));
  if (!nodo) return { encontrado: false as const, sugerencias: g.nodes.slice(0, 10).map((n) => n.label) };

  const vecinos = g.links
    .filter((l) => l.source === nodo.id || l.target === nodo.id)
    .map((l) => {
      const otherId = l.source === nodo.id ? l.target : l.source;
      const other = g.nodes.find((n) => n.id === otherId);
      return other ? { label: other.label, relacion: l.relation ?? "relacionado" } : null;
    })
    .filter(Boolean)
    .slice(0, maxVecinos);

  const comunidad =
    nodo.community !== undefined
      ? g.nodes
          .filter((n) => n.community === nodo.community && n.id !== nodo.id)
          .slice(0, 10)
          .map((n) => n.label)
      : [];

  return { encontrado: true as const, nodo: nodo.label, vecinos, comunidad };
}
