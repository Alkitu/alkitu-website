# SEO para Páginas de Proyectos — generateMetadata + Open Graph

## Resumen

Las páginas de proyectos individuales (`/[lang]/projects/[project]`) ahora generan metadata dinámico server-side para SEO y redes sociales.

**Commit:** `feat: add generateMetadata + Open Graph SEO for project pages`

---

## Problema

El archivo `page.tsx` era 100% client-side (`"use client"`), lo que significaba:

- Google y crawlers solo veían el `<title>` genérico del layout root ("Alkitu | Ingeniería de Software")
- Al compartir en LinkedIn/Twitter no aparecía la imagen ni descripción del proyecto
- Todos los proyectos compartían el mismo metadata estático

---

## Solución: Server Component Wrapper

Se separó el page en dos archivos:

### `page.tsx` — Server Component

- Exporta `generateMetadata()` que hace fetch a Supabase server-side
- Consulta solo los campos necesarios: `slug`, `title_en/es`, `description_en/es`, `image`
- Genera metadata dinámico con título, descripción, og:image, twitter card
- Usa el template del layout (`"%s | Alkitu"`) para el `<title>`
- Renderiza `<ProjectPageClient />` para la UI

### `ProjectPageClient.tsx` — Client Component

- Contiene el mismo código de UI que antes existía en `page.tsx`
- Mantiene `"use client"`, `useParams()`, fetch client-side, carousel, animaciones
- Sin cambios funcionales respecto al código original

---

## Metadata Generado

Para un proyecto con slug `tangle` visitado en `/es/projects/tangle`:

```html
<title>TANGLE | Alkitu</title>
<meta name="description" content="Descripción del proyecto en español..." />
<meta property="og:title" content="TANGLE" />
<meta property="og:description" content="Descripción del proyecto en español..." />
<meta property="og:image" content="https://...imagen-del-proyecto.jpg" />
<meta property="og:type" content="article" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="TANGLE" />
<meta name="twitter:description" content="Descripción del proyecto en español..." />
<meta name="twitter:image" content="https://...imagen-del-proyecto.jpg" />
```

Para slug inexistente: `<title>Project Not Found | Alkitu</title>`

---

## Archivos Modificados

| Archivo | Cambio |
|---|---|
| `app/[lang]/(public)/projects/[project]/page.tsx` | Reescrito como Server Component con `generateMetadata` |
| `app/[lang]/(public)/projects/[project]/ProjectPageClient.tsx` | **Nuevo** — UI client-side extraída aquí |

---

## Verificación

1. View Source en `/es/projects/{slug}` → `<title>` muestra nombre del proyecto
2. Buscar `og:image` en source → URL de la imagen del proyecto
3. Probar `/en/projects/{slug}` → metadata en inglés
4. Slug inexistente → "Project Not Found" como title
5. UI interactiva (carousel, animaciones) funciona igual
6. Validar con https://www.opengraph.xyz/ en producción
