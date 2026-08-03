#!/usr/bin/env bash
# Gate de calidad versionado (Historia 1-5 / FR-33). Reproduce en cualquier
# máquina las comprobaciones que la CI ejecuta y que el hook global
# ~/.claude/hooks/gate-merge-deploy.sh corre localmente. Ejecutar antes de
# merge/deploy. Sale != 0 si algo falla.
#
# Uso: bash scripts/gate.sh
set -uo pipefail
cd "$(dirname "$0")/.."

fail=0
run() {
  echo ""
  echo "▶ $1"
  shift
  if "$@"; then
    echo "  ✓ ok"
  else
    echo "  ✗ FALLO"
    fail=1
  fi
}

# Gates duros (deben pasar):
run "build"            pnpm build
run "typecheck"        pnpm typecheck
run "validate:context" pnpm validate:context
run "check:tokens"     pnpm check:tokens
run "check:links"      pnpm check:links
run "test (unit)"      pnpm test

# Gate blando (reportado, no bloquea hasta cerrar la Épica 2 — deuda de lint
# preexistente: react-hooks e <img>). Ver PRD FR-35 / Historia 2-8.
echo ""
echo "▶ lint (informativo, no bloquea todavía)"
pnpm lint || echo "  ⚠ lint con hallazgos (deuda preexistente; se endurece en Épica 2)"

echo ""
if [ "$fail" -ne 0 ]; then
  echo "❌ GATE ROJO — no shippear."
  exit 1
fi
echo "✅ GATE VERDE."
