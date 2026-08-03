#!/usr/bin/env bash
# Grafo UNIFICADO del monorepo (Context + design-system + apps/web) → graphify-out/ en la raíz.
# Código por AST (gratis); el Context se reutiliza de Context/graphify-out/graph.json.
#
# El grafo del BLUEPRINT (Context/graphify-out/) se regenera aparte: su extracción es
# semántica (LLM), no AST, así que la hace el skill graphify —o `graphify Context --update`
# con una API key LLM en el entorno—. Este script NO la dispara solo, para no incurrir en
# coste LLM sorpresa; solo avisa si el grafo del blueprint quedó desfasado.
# Uso: bash scripts/graph.sh   (o: pnpm graph)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# 1) Aviso de frescura del grafo del blueprint (no lo regenera: eso es trabajo del skill).
CTX_GRAPH="$ROOT/Context/graphify-out/graph.json"
if [ -f "$CTX_GRAPH" ]; then
  STALE="$(find "$ROOT/Context" -name '*.md' -not -path '*/graphify-out/*' -newer "$CTX_GRAPH" -print -quit 2>/dev/null || true)"
  if [ -n "$STALE" ]; then
    echo "⚠ Context/graphify-out/graph.json está desfasado (hay notas .md más nuevas que el grafo)."
    echo "  Regenéralo con el skill graphify (o 'graphify Context --update' con una API key LLM) y re-ejecuta pnpm graph."
  fi
else
  echo "⚠ No existe Context/graphify-out/graph.json — el grafo unificado saldrá solo con la capa de código."
fi

# 2) Construir el grafo unificado (determinista: AST de DS+web + merge del grafo del Context).
#    Sin '|| true': si esto falla, el script falla y se ve el error.
PY="$(cat "$ROOT/graphify-out/.graphify_python" 2>/dev/null || echo python3)"
"$PY" "$ROOT/scripts/build-graph.py"

echo "→ grafo unificado en $ROOT/graphify-out/ (GRAPH_REPORT.md + graph.json)"
