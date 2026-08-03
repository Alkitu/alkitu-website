#!/usr/bin/env python3
"""
Grafo UNIFICADO del monorepo (las 3 capas en uno):
  - design-system + apps/web  → extracción AST (código, determinista, sin LLM)
  - Context (blueprint)        → se fusiona el grafo ya construido en Context/graphify-out/graph.json
Salida: graphify-out/ en la raíz (graph.json + graph.html + GRAPH_REPORT.md).
Ejecutar: bash scripts/graph.sh   (o: pnpm graph)
"""
import json
from pathlib import Path
from graphify.detect import detect
from graphify.extract import collect_files, extract
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_json

ROOT = Path(".").resolve()
OUT = ROOT / "graphify-out"
OUT.mkdir(exist_ok=True)

det = detect(ROOT)  # excluye node_modules automáticamente
(OUT / ".graphify_detect.json").write_text(json.dumps(det, ensure_ascii=False))

# --- Capa código: AST sobre apps/web + design-system ---
# Excluir ruido de tooling (skills de Figma con type-defs del plugin API, .claude, etc.)
NOISE = ("/.agents/", "/.claude/", "/skills/")
code_files = []
for f in det.get("files", {}).get("code", []):
    if any(n in f for n in NOISE):
        continue
    p = Path(f)
    code_files.extend(collect_files(p) if p.is_dir() else [p])
ast = extract(code_files, cache_root=ROOT) if code_files else {"nodes": [], "edges": [], "hyperedges": []}

# --- Capa blueprint: reutiliza el grafo ya construido del Context ---
ctx_path = ROOT / "Context" / "graphify-out" / "graph.json"
ctx = json.loads(ctx_path.read_text()) if ctx_path.exists() else {"nodes": [], "links": [], "hyperedges": []}

nodes = list(ast["nodes"])
seen = {n["id"] for n in nodes}
for n in ctx.get("nodes", []):
    if n.get("id") and n["id"] not in seen:
        nodes.append(n)
        seen.add(n["id"])
edges = ast["edges"] + [dict(l) for l in ctx.get("links", [])]
hyper = ast.get("hyperedges", []) + ctx.get("hyperedges", [])

extraction = {"nodes": nodes, "edges": edges, "hyperedges": hyper, "input_tokens": 0, "output_tokens": 0}

G = build_from_json(extraction)
comm = cluster(G)
coh = score_all(G, comm)
labels = {c: "Community " + str(c) for c in comm}
report = generate(G, comm, coh, labels, god_nodes(G), surprising_connections(G, comm),
                  det, {"input": 0, "output": 0}, ".",
                  suggested_questions=suggest_questions(G, comm, labels))
(OUT / "GRAPH_REPORT.md").write_text(report)
to_json(G, comm, str(OUT / "graph.json"), force=True)

# limpieza de temporales
(OUT / ".graphify_detect.json").unlink(missing_ok=True)
print(f"Grafo unificado: {G.number_of_nodes()} nodos, {G.number_of_edges()} aristas, {len(comm)} comunidades")
print(f"AST (DS+web): {len(ast['nodes'])} · Context: {len(ctx.get('nodes', []))}")
