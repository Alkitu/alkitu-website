---
title: Login
aliases: [Acceso, Iniciar Sesión, Sign in, Admin Login]
tipo: page
nivel: hipónimo
dominio: [Meta]
hiperónimo: "[[🏠 Context — Índice]]"
campo-semántico: [login, acceso, autenticación, auth.js, resend, admin]
relacionado:
  - "[[Estadisticas.es]]"
  - "[[🔌 Connections]]"

titulo: "Acceso: Panel de [Concepto]"
metadescripcion: "Página de acceso al panel privado de administración de tuconcepto.com. Solo para el administrador del sitio."
slug: /login                          # alternativa considerada: /acceso
keyword-principal: ""                 # página privada, sin objetivo SEO
keywords-secundarias: []
tags: [login, admin, auth]
intencion-busqueda: navegacional
og-image: ""
dominio-raiz: tuconcepto.com
subdominio: ""                        # apex + ruta (private); candidato a admin.tuconcepto.com si crece
query-params: [redirectTo, error]     # redirectTo = ruta a la que volver tras login; error = código de error
canonical: https://tuconcepto.com/login

# ── Capa 3: GEO ──
geo-preguntas: []
geo-respuesta-corta: ""
geo-entidades: ["[Concepto]"]
geo-datos-citables: []
geo-formato: []
schema-tipo: WebPage                   # noindex (robots.index = false)

# ── Capa 4: Sitemap técnico ──
prioridad: 0.0                         # fuera del sitemap (noindex)
frecuencia-cambio: yearly
idiomas: [es, en]
hreflang-alt: /en/login

# ── Capa 5: Implementación (sincronía con el código) ──
estado-implementacion: construido
rutas-codigo:
  - "apps/web/app/(private)/login/page.tsx"          # server: lee searchParams (error, redirectTo)
  - "apps/web/app/(private)/login/login-form.tsx"    # client: form + estados + signIn
  - "apps/web/auth.ts"                      # config Auth.js: provider Resend + adapter DB + gate signIn
  - "apps/web/lib/mongodb.ts"                    # cliente de base de datos (singleton)
  - "apps/web/app/api/auth/[...nextauth]/route.ts"  # handlers GET/POST
  - "apps/web/middleware.ts"                # redirect edge-safe por cookie en /admin/*
  - "apps/web/app/(private)/admin/layout.tsx"         # gate real: await auth() en runtime Node
componentes: []                            # estilo inline (markup propio); sin componentes ds: por ahora
datos:
  - "db:admins         # gate de acceso (1 doc: el email del administrador)"
  - "db:users,sessions,verification_tokens  # los crea el adapter de Auth.js"
fuentes:
  - "Auth.js v5 (next-auth beta) + adapter de base de datos  (motor de sesión)"
  - "Resend  (envío del código de acceso)"
depende-de:
  - "[[Estadisticas.es]]"              # destino tras login (panel admin)
---

# Login: `/login`

> [!definition] Propósito
> Página **privada de acceso** para administrar la web: publicar entradas y ver estadísticas. Con **Auth.js + base de datos** (código/enlace de acceso enviado por **Resend**). No tiene valor SEO: es `noindex` y queda fuera del sitemap.

## Secciones

1. **Tarjeta de acceso**: logo/brand + título ("Acceso") + formulario centrado.
2. **Formulario de login**: **email + código/enlace de acceso**: el admin introduce su email y recibe un código o enlace de acceso (sin password que gestionar). Estados: enviando · "revisa tu email" · error inline. Tras verificar → sesión y redirige a `redirectTo` (por defecto `/admin` → [[Estadisticas.es]]).
3. **Errores**: mensaje claro si el email no corresponde al admin o si el usuario **no es admin** (gate por colección `admins`: si autentica pero no está, `signOut` + "No tienes acceso de administrador").

## Flujo de autenticación (Auth.js v5 · single-admin)

1. El form llama **`signIn`** → Auth.js genera un token de verificación (en la DB) y **Resend** envía el código/enlace de acceso al email. UI muestra "revisa tu correo".
2. Al verificar, el callback **`signIn`** de `auth.ts` comprueba que `user.email` existe en la colección **`admins`** (1 doc, el del administrador); si no, devuelve `false` → Auth.js redirige a `/login?error=AccessDenied`.
3. Sesión creada (estrategia *database*: el adapter guarda `sessions`). `redirect(redirectTo)` → `/admin`.
4. **Doble capa en `/admin/*`**: `middleware.ts` hace un redirect rápido *edge-safe* si falta la cookie de sesión; el **gate real** es `app/admin/layout.tsx` con `await auth()` en runtime Node.

## Componentes

| Elemento | Componente DS | Notas |
|---|---|---|
| Contenedor | `ds:patterns/auth-card-wrapper` | tarjeta centrada, full-height, brand |
| Formulario | `ds:patterns/dynamic-form` (o `form-*`) | solo **email**; valida y muestra error inline |
| Campos | `ds:primitives/input` | `type=email`; autocomplete correcto |
| Acción | `ds:primitives/button` | "Enviarme el código de acceso", estado loading |

> [!note] Responsividad y dispositivos
> Mobile-first; tarjeta centrada. Pensado para móvil/desktop.

## Notas SEO / privacidad
- `robots: { index: false }` (noindex, nofollow). No entra al `sitemap.xml` ni a `llms.txt`.
- Vive bajo grupo de rutas **`(private)`** o tras `/login`; candidato a subdominio **`admin.tuconcepto.com`** si el panel crece.

## Decisiones de diseño
- **Single-admin**: un solo administrador. El gate arranca con **un solo doc** (sin roles por ahora).
- **Método = email + código/enlace de acceso**: sin password que gestionar. (OAuth queda como alternativa futura.)
- **`noindex`**: la página queda fuera del sitemap y de `llms.txt` (ya en frontmatter).
- **Auth = Auth.js v5 + base de datos**: la DB es solo el almacén; el motor de sesión lo pone Auth.js. El código/enlace lo envía **Resend**.
- **Gate por colección `admins`** (1 doc con el email del administrador) en el callback `signIn`.

## Pendiente / Bloqueos
- **2FA**: ¿segundo factor? Para single-admin con código/enlace, probablemente innecesario al inicio.
- **Slug**: `/login` vs `/acceso` (ES). Decidir y fijar `canonical`.
- **Subdominio**: ¿`(private)` en apex o `admin.tuconcepto.com`?
