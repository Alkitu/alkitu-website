#!/usr/bin/env python3
"""
build-glosario.py — materializa el glosario del concepto en un JSON versionado.

La fuente de ingesta es una *Connection* (no se ingiere en runtime): aquí tomamos un
snapshot estructurado del vault y lo dejamos en apps/web/content/wiki/glosario.json,
que es lo que consumen /wiki y /wiki/[termino]. Re-ejecutar cuando cambie el vault:

    pnpm glosario:build   (o:  python3 scripts/build-glosario.py)

Resuelve relaciones de verdad:
  - hiperónimos: del frontmatter `hiperónimo` (1, hacia el concepto más general)
  - hipónimos:   del frontmatter `hipónimos` + INVERSA (todo término cuyo
                 hiperónimo apunta a este) — así nunca es-su-propio-hiperónimo
  - relacionados: del frontmatter `relacionado`
Todas las relaciones se filtran contra términos que existen y se excluyen
auto-referencias y duplicados entre ejes.
"""
import json
import re
import unicodedata
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "apps" / "web" / "content" / "wiki" / "glosario.json"
WIKI = REPO / "Context" / "03-Wiki"

# Fuentes del glosario: cada SUBCARPETA de Context/03-Wiki es un dominio (su
# nombre, capitalizado). Este es el arranque agnóstico del kit — los términos
# viven como notas .md en Context/03-Wiki/<dominio>/.
#
# Al instanciar un concepto puedes, además, conectar una FUENTE EXTERNA de
# ingesta (una vault Obsidian, una DB, una API): añade sus rutas a FUENTES aquí,
# igual que una vault Obsidian o una DB de dominio. Ejemplo:
#   VAULT = REPO.parent / "mi-vault"
#   FUENTES.append((VAULT / "carpeta", "MiDominio"))
FUENTES = []
if WIKI.exists():
    for sub in sorted(p for p in WIKI.iterdir() if p.is_dir()):
        FUENTES.append((sub, sub.name.capitalize()))

# Kit recién clonado: sin dominios en Context/03-Wiki y sin fuente externa → NO
# sobrescribir el stub del glosario con un JSON vacío. Conecta primero una fuente
# (subcarpetas de dominio en 03-Wiki, o una vault/DB en FUENTES). Ver SETUP.md.
if not FUENTES:
    import sys
    print("⚠ Sin fuentes de glosario (Context/03-Wiki no tiene subcarpetas de dominio).")
    print("  Conecta una fuente antes de regenerar; se conserva el glosario.json actual.")
    sys.exit(0)


def slugify(texto: str) -> str:
    t = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode("ascii")
    t = t.lower().strip()
    t = re.sub(r"[^a-z0-9]+", "-", t)
    return t.strip("-")


def split_frontmatter(raw: str):
    """Devuelve (dict_frontmatter, cuerpo). Parser mínimo para el formato del vault."""
    if not raw.startswith("---"):
        return {}, raw
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n?(.*)$", raw, re.DOTALL)
    if not m:
        return {}, raw
    fm_text, body = m.group(1), m.group(2)
    fm = {}
    lines = fm_text.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip() or line.lstrip().startswith("#"):
            i += 1
            continue
        km = re.match(r"^([A-Za-zÀ-ÿ0-9_\-]+):\s*(.*)$", line)
        if not km:
            i += 1
            continue
        key, val = km.group(1), km.group(2).strip()
        if val == "":
            # ¿lista en bloque (líneas siguientes con '- ')?
            items = []
            j = i + 1
            while j < len(lines) and re.match(r"^\s*-\s+", lines[j]):
                items.append(re.sub(r"^\s*-\s+", "", lines[j]).strip())
                j += 1
            fm[key] = items
            i = j
        elif val.startswith("[") and val.endswith("]"):
            inner = val[1:-1].strip()
            fm[key] = [x.strip() for x in inner.split(",") if x.strip()] if inner else []
        else:
            if len(val) >= 2 and val[0] in "\"'" and val[-1] == val[0]:
                val = val[1:-1]
            fm[key] = val
        i += 1
    return fm, body


def clean_inline(text: str) -> str:
    text = re.sub(r"\[\[([^\]|]+)\|([^\]]+)\]\]", r"\2", text)  # [[A|B]] -> B
    text = re.sub(r"\[\[([^\]]+)\]\]", r"\1", text)              # [[A]] -> A
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)         # [t](u) -> t
    text = text.replace("**", "").replace("__", "").replace("`", "")
    return re.sub(r"\s+", " ", text).strip()


def extract_definicion(body: str) -> str:
    lines = body.split("\n")
    # 1) callout > [!definition] ... (captura líneas '>' siguientes)
    for idx, ln in enumerate(lines):
        if re.search(r">\s*\[!\s*(definition|define|definición)\s*\]", ln, re.IGNORECASE):
            buf = []
            for nxt in lines[idx + 1:]:
                if nxt.lstrip().startswith(">"):
                    buf.append(re.sub(r"^\s*>\s?", "", nxt))
                else:
                    break
            txt = clean_inline(" ".join(buf))
            if txt:
                return txt
    # 2) fallback: primer párrafo de prosa tras el H1
    started = False
    buf = []
    for ln in lines:
        s = ln.strip()
        if s.startswith("# "):
            started = True
            continue
        if not started:
            continue
        if s.startswith("#") or s.startswith(">") or s.startswith("-") or s.startswith("|"):
            if buf:
                break
            continue
        if s == "":
            if buf:
                break
            continue
        buf.append(s)
    return clean_inline(" ".join(buf))


def wikilink_target(val: str) -> str:
    """'[[ADN de Marca]]' o '[[A|B]]' -> 'ADN de Marca' (target sin alias de visualización)."""
    m = re.search(r"\[\[([^\]|]+)", val or "")
    return m.group(1).strip() if m else ""


# ── 1) Recolectar notas ───────────────────────────────────────────────
notas = []
for base, dominio in FUENTES:
    if not base.exists():
        continue
    for md in sorted(base.rglob("*.md")):
        raw = md.read_text(encoding="utf-8", errors="replace")
        fm, body = split_frontmatter(raw)
        titulo = (fm.get("title") or md.stem).strip()
        if not titulo:
            continue
        notas.append({
            "_src": str(md.relative_to(REPO.parent)),
            "titulo": titulo,
            "slug": slugify(titulo),
            "dominio": dominio,
            "dominios": fm.get("dominio") if isinstance(fm.get("dominio"), list) else ([fm["dominio"]] if fm.get("dominio") else [dominio]),
            "pilar": fm.get("pilar", ""),
            "nivel": fm.get("nivel", ""),
            "aliases": fm.get("aliases", []) if isinstance(fm.get("aliases"), list) else [],
            "campo": fm.get("campo-semántico", []) if isinstance(fm.get("campo-semántico"), list) else [],
            "definicion": extract_definicion(body),
            "_hiper": wikilink_target(fm.get("hiperónimo", "") or fm.get("hiperonimo", "")),
            "_hipo": [wikilink_target(x) for x in (fm.get("hipónimos", []) or fm.get("hiponimos", []))],
            "_rel": [wikilink_target(x) for x in (fm.get("relacionado", []) or [])],
            # EN opcional declarado en el propio nodo (titulo-en / definicion-en)
            "_tituloEn": (fm.get("titulo-en") or "").strip(),
            "_defEn": (fm.get("definicion-en") or "").strip(),
        })

# dedupe por slug (gana el primero) — con DENUNCIA: una nota que pierde contra
# otra del mismo slug es una SOMBRA silenciosa (agujero #3 de Arquitectura de
# agentes). Sombra detectada = error, no aviso: renombra o fusiona.
vistos = {}
sombras = []
for n in notas:
    prev_n = vistos.get(n["slug"])
    if prev_n is None:
        vistos[n["slug"]] = n
    else:
        sombras.append((n["slug"], prev_n["_src"], n["_src"]))
notas = list(vistos.values())
if sombras:
    print("✗ SOMBRAS de slug (la 2ª nota se perdería en silencio):")
    for s, kept, dropped in sombras:
        print(f"  - {s}: gana {kept} · pierde {dropped}")
    import sys; sys.exit(1)

# ── 2) Índices de resolución (título y alias -> slug) ─────────────────
por_titulo = {}
for n in notas:
    por_titulo[n["titulo"].lower()] = n["slug"]
    for a in n["aliases"]:
        por_titulo.setdefault(a.strip().lower(), n["slug"])

slug_set = {n["slug"] for n in notas}
slug_a_nombre = {n["slug"]: n["titulo"] for n in notas}


def resolver(nombre: str):
    if not nombre:
        return None
    return por_titulo.get(nombre.strip().lower()) or (slugify(nombre) if slugify(nombre) in slug_set else None)


# ── 3) Resolver relaciones (con inversa de hiperónimo) ────────────────
hipo_inverso = {}  # slug_padre -> set(slug_hijo)
for n in notas:
    padre = resolver(n["_hiper"])
    if padre and padre != n["slug"]:
        hipo_inverso.setdefault(padre, set()).add(n["slug"])


def rel_obj(slug):
    return {"nombre": slug_a_nombre[slug], "slug": slug}


terminos = []
for n in notas:
    s = n["slug"]
    hiper = []
    p = resolver(n["_hiper"])
    if p and p != s:
        hiper.append(p)

    hipo = set()
    for h in n["_hipo"]:
        r = resolver(h)
        if r and r != s:
            hipo.add(r)
    hipo |= hipo_inverso.get(s, set())
    hipo.discard(s)

    rel = set()
    for r in n["_rel"]:
        rr = resolver(r)
        if rr and rr != s:
            rel.add(rr)
    # no repetir en varios ejes
    rel -= hipo
    rel -= set(hiper)

    terminos.append({
        "slug": s,
        "titulo": n["titulo"],
        "dominio": n["dominio"],
        "dominios": n["dominios"],
        "pilar": n["pilar"],
        "aliases": n["aliases"],
        "campoSemantico": n["campo"],
        "definicion": n["definicion"],
        "hiperonimos": [rel_obj(x) for x in hiper],
        "hiponimos": sorted((rel_obj(x) for x in hipo), key=lambda o: o["nombre"]),
        "relacionados": sorted((rel_obj(x) for x in rel), key=lambda o: o["nombre"]),
        "tituloEn": n["_tituloEn"],
        "definicionEn": n["_defEn"],
    })

terminos.sort(key=lambda t: t["titulo"].lower())

# ── Preservar traducciones EN existentes (el EN vive en el JSON versionado:
# commit 33077ea tradujo los 427 términos directamente ahí). Un rebuild NUNCA
# debe perderlas: si el nodo no declara titulo-en/definicion-en, se conserva
# lo que ya hubiera en el glosario.json anterior (merge por slug).
if OUT.exists():
    previo = {t["slug"]: t for t in json.loads(OUT.read_text(encoding="utf-8")).get("terminos", [])}
    for t in terminos:
        antes = previo.get(t["slug"], {})
        if not t["tituloEn"]:
            t["tituloEn"] = antes.get("tituloEn", "")
        if not t["definicionEn"]:
            t["definicionEn"] = antes.get("definicionEn", "")

# ── Auto-verificación pre-escritura (agujero #10): comparar con el JSON previo.
# (a) PROHIBIDO perder traducciones EN: si un slug tenía definicionEn y ahora no,
#     se aborta sin escribir. (b) Desapariciones de términos se listan en alto
#     (legítimas si su nota se borró a propósito; sospechosas si no).
if OUT.exists():
    _prev = {t["slug"]: t for t in json.loads(OUT.read_text(encoding="utf-8")).get("terminos", [])}
    _new = {t["slug"]: t for t in terminos}
    _en_perdidos = [s for s, t in _prev.items() if t.get("definicionEn") and s in _new and not _new[s].get("definicionEn")]
    if _en_perdidos:
        print(f"✗ ABORTADO sin escribir: se perderían {len(_en_perdidos)} traducciones EN:")
        for s in _en_perdidos[:10]:
            print(f"  - {s}")
        import sys; sys.exit(1)
    _desaparecidos = sorted(set(_prev) - set(_new))
    if _desaparecidos:
        print(f"⚠ {len(_desaparecidos)} término(s) desaparecen respecto al JSON previo (¿nota borrada a propósito?):")
        for s in _desaparecidos[:10]:
            print(f"  - {s}")

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps({
    "fuente": "Context/03-Wiki (+ fuente de ingesta del concepto)",
    "total": len(terminos),
    "terminos": terminos,
}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

# ── stats ──
sin_def = [t["slug"] for t in terminos if not t["definicion"]]
por_dom = {}
for t in terminos:
    por_dom[t["dominio"]] = por_dom.get(t["dominio"], 0) + 1
print(f"✓ {len(terminos)} términos → {OUT.relative_to(REPO)}")
print(f"  por dominio: {por_dom}")
print(f"  sin definición: {len(sin_def)}")
if sin_def[:8]:
    print("   p.ej.:", ", ".join(sin_def[:8]))
