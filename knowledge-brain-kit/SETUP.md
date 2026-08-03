# SETUP — arrancar un cerebro nuevo desde el kit

Receta para instanciar el kit en un concepto concreto (ejemplo corriente: **conceptos legales**).

## 0 · Requisitos

- pnpm, Node 20+, Python 3 (para el pipeline de ingesta).
- Una fuente de contenido del concepto: vault Obsidian, DB, API o carpeta de markdown.

## 1 · Fork del esqueleto

```bash
cp -R knowledge-brain-kit/skeleton  ../mi-concepto.com
cd ../mi-concepto.com
pnpm install
```

> `skeleton/` = resultado de aplicar `EXTRACTION-MAP.md` (COPY + ADAPT vaciados). Se genera en fase 2.

## 2 · Parametrizar marca

- `leonelkrea-ds/tokens/` → reemplaza el brand color (`#85283F`) y tipografías por los del concepto.
- `package.json` / `pnpm-workspace.yaml` → renombra `@leonelkrea/web` → `@mi-concepto/web`.
- `CLAUDE.md` → reescribe posicionamiento (quién es, audiencia, autoridad de contenido).
- `.env.example` → copia a `.env.local`, rellena (Mongo, Resend, etc.).

## 3 · Definir la taxonomía raíz (siembra el grafo)

En `Context/`:

1. Edita `00-Index/🏠 Context — Índice.md` → nuevo árbol del sitio del concepto.
2. Crea el **MOC raíz** del concepto y sus hiperónimos de nivel 1.
   - Legal: `Derecho` → `Civil · Penal · Mercantil · Laboral` → subtemas → términos.
3. Decide **secciones activas** (`dominio[]` del contrato). Legal candidato:
   `Glosario Jurídico · Jurisprudencia · Casos · FAQ · About · Contacto`.
   Apaga las que no apliquen (borra su carpeta `Context/0X-*` y su ruta en `apps/web`).
4. Rellena 1 nodo real de ejemplo por tipo con las **5 capas** (usa los nodos-plantilla).

## 4 · Conectar la fuente de ingesta

Único trabajo a medida por concepto:

- Copia `scripts/build-glosario.py` → `scripts/build-<concepto>.py`.
- Cambia el **origen** (lectura de la vault/DB/API del concepto).
- Mantén el **destino**: `content/wiki/glosario.json` con el mismo schema (lo valida el loader).
- Alternativa sin código: escribe los nodos a mano en `content/` si el volumen es bajo.

## 5 · Ensamblar y validar

```bash
pnpm validate:context   # frontmatter + ds:* + rutas-codigo resuelven
pnpm graph              # regenera Context/graphify-out/ (god nodes, comunidades)
pnpm build              # la web se ensambla desde los nodos
pnpm dev                # arrancar en local
```

**Done when:**
- `validate:context` pasa (0 drift).
- `pnpm build` verde.
- Grafo generado muestra el MOC raíz del concepto como god node.
- La web sirve al menos 1 nodo por sección activa, ES + EN.

## 6 · Deploy

Mismo patrón que el repo origen: rama `desarrollo` (trabajo) → `main` (Vercel). El gate (`build` + `validate:context`) corre solo.

## 7 · Finalizar el setup (estado actual del skeleton → tu proyecto)

El skeleton ya está **verificado**: `pnpm build` ✅ y `pnpm validate:context` ✅ con datos-plantilla. Lo que queda es tuyo, por concepto:

1. **Git propio.** El skeleton no es repo: `git init && git add -A && git commit -m "chore: fork knowledge-brain-kit"`. Crea rama `desarrollo` para el trabajo diario.
2. **Variables de entorno.** `cp apps/web/.env.example apps/web/.env.local` y rellena:
   - `MONGODB_URI` + `AUTH_SECRET` — solo para admin/analytics/login (el build NO los necesita; `lib/mongodb.ts` es lazy y degrada sin DB).
   - `RESEND_API_KEY` + `RESEND_FROM` — formulario de contacto.
   - `BLOB_READ_WRITE_TOKEN` — solo si usas subida de imágenes.
3. **Assets `public/`.** Está vacío a propósito. Mínimo: `apps/web/public/hero/portada.jpg` (hero de la home) y favicon/OG si personalizas. Sin ellos el build pasa; las imgs dan 404 en runtime.
4. **Placeholders.** Busca y reemplaza: `[Concepto]`, `[concepto]`, `[Concept]`, `tuconcepto.com`, `[titular]`, `[email de contacto]`, `[Brand]`. `rg -l "\[Concepto\]|tuconcepto"` te da la lista.
5. **Marca.** `design-system/tokens/primitives/colors.css` → ramp `--brand-primary*` (hoy azul placeholder). Opcional: renombrar scope `@brain` y dir `design-system/` (actualiza `pnpm-workspace.yaml` + tsconfig + globals.css `@source` + scripts).
6. **Semilla de contenido.** El sitio sirve 1 plantilla por sección (`termino-ejemplo`, `plantilla-articulo`, `plantilla-review`, `plantilla-caso`). Reemplázalas por contenido real (pasos 3-4 de arriba) y borra las plantillas cuando tengas ≥1 real por sección activa.
7. **Grafo.** `pnpm graph` para regenerar `Context/graphify-out/` con tu taxonomía (requiere graphify instalado).
8. **Gate en verde antes de cada deploy:** `pnpm validate:context && pnpm build`.
9. **Tests.** `pnpm test` corre unit; e2e parity necesita `--update-snapshots` la primera vez (los baselines del origen se retiraron).

## 8 · Activar el agente experto (web agéntica)

El kit trae el agente ya montado (PRD-web-agentica, E1+E2 hechos):

- `apps/web/agent/` — `instructions.md` (identidad + regla solo-desde-tools + orden de lookup) · `agent.ts` (modelo vía AI Gateway) · `tools/` (6 tools de lectura).
- `apps/web/lib/agent/` — la lógica como **funciones puras** (portables si eve cambia). Tests: `npx vitest run lib/agent/agent.test.ts`.
- `next.config.mjs` envuelto con `withEve` → sesiones en `/eve/v1/*` (dev y Vercel).

Para activarlo en tu instancia:

1. **Identidad**: edita `agent/instructions.md` — reemplaza `[Concepto]` (2 líneas).
2. **Modelo**: ajusta el string `proveedor/modelo` en `agent/agent.ts` si quieres otro.
3. **Auth de modelo**: en Vercel = OIDC automático (AI Gateway). En local exporta la API key que pida eve (`pnpm dev` te lo indica).
4. **Probar**: `pnpm dev` y

```bash
curl -X POST http://127.0.0.1:3000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"message":"¿qué es [un término de tu glosario]?"}'
```

5. El agente responde SOLO desde la base del sitio, citando `/wiki/<slug>` etc. Grafo sin generar → la tool `query_graph` degrada avisando (corre `pnpm graph`).

Pendiente de fase 2 (ver PRD): widget de chat en la web (E3) y tools de escritura validada (E5).

---

## Checklist de instanciación

- [ ] Fork del `skeleton/`, `pnpm install` OK
- [ ] Brand tokens reemplazados
- [ ] Paquetes renombrados
- [ ] Árbol del sitio + MOC raíz definidos
- [ ] Secciones activas decididas (resto borrado)
- [ ] 1 nodo real por tipo con 5 capas
- [ ] Adaptador de ingesta conectado (o nodos a mano)
- [ ] `validate:context` + `build` verdes
- [ ] Grafo regenerado
- [ ] Deploy configurado
