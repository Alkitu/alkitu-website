# Theme Persistence — MongoDB + Prisma

> **Verificado contra el código:** 2026-04-29 01:39 CEST.
> **Stack real:** Prisma 6 + MongoDB v7 (replica set en local; MongoDB Atlas en producción).
> **Schema:** `packages/api/prisma/schema.prisma` — modelo `Theme`.

Este documento describe cómo se persisten las preferencias de tema en Alkimia Core. **No es un instructivo genérico**: se documenta lo que el código actualmente hace.

---

## 1. Arquitectura — un solo tema activo por plataforma

Alkimia Core usa un modelo **platform-wide single active theme** (no es por usuario, es por instancia). En una organización white-label, eso significa que el admin elige el tema y todos los usuarios lo ven; las preferencias personales del usuario (modo claro/oscuro) viven separadas.

```text
┌────────────────┐    tRPC theme.getActive    ┌──────────┐    Prisma     ┌─────────┐
│  Browser       │ ◄────────────────────────  │  API     │ ◄──────────── │ MongoDB │
│  GlobalTheme   │                            │  NestJS  │               │  themes │
│  Provider      │ ─────────────────────────► │          │ ─────────────►│  coll.  │
│                │   theme.update / activate  │          │   updateOne   │         │
└────────────────┘                            └──────────┘               └─────────┘
       │
       ▼
  localStorage (cache opcional para evitar flash en SSR)
```

Flujo:

1. La página carga → `GlobalThemeProvider` lee la cookie/cache local para hidratar el `<html>` antes del paint.
2. En paralelo, llama a `theme.getActive()` (tRPC) para obtener el tema activo.
3. Cuando se reciben los datos, `ThemeEditorContext` despacha `SET_DS_CONFIG` y `SET_ACTIVE_OVERRIDES`. `DSConfigSync` propaga al `ThemeProvider` del DS.
4. Al editar desde Theme Forge, los cambios se persisten vía `theme.update` con debounce.

---

## 2. Modelo Prisma — `Theme`

Definido en `packages/api/prisma/schema.prisma` (líneas 584–631):

```prisma
model Theme {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  description String?
  version     String   @default("3.0.0")
  author      String?

  // Auditoría (no propiedad)
  createdById String?  @db.ObjectId
  // Multi-tenant futuro
  companyId   String?  @db.ObjectId

  // Configuración de color por modo
  lightModeConfig Json?
  darkModeConfig  Json?
  typography      Json?

  // Estructura legacy completa (lightColors, darkColors, typography,
  // brand, spacing, borders, shadows, scroll)
  themeData   Json?

  // Fuente de verdad para presets del DS
  dsThemeConfig  Json?  // ThemeConfig: { baseColor, brandColor, font, radius, spacing, shadow, transition }
  colorOverrides Json?  // { light: Record<string,string>, dark: Record<string,string> }

  // Metadatos y flags
  tags        String[]
  isPublic    Boolean  @default(false)
  isFavorite  Boolean  @default(false)
  isActive    Boolean  @default(false) // Sólo UNO puede ser true
  isDefault   Boolean  @default(false) // DEPRECATED — kept for backward compatibility

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("themes")
  @@index([createdById])
  @@index([companyId])
  @@index([isActive])
  @@index([isDefault])
}
```

Notas operativas:

- Colección MongoDB: `themes` (`@@map("themes")`).
- `_id` es `ObjectId`, mapeado a `id: String` en TypeScript.
- Todos los blobs de tema viven como `Json` (`Json?` en MongoDB se serializa como `BsonDocument`/`null`).
- `isActive` es la bandera que define el tema activo de plataforma. La invariante "sólo uno es `true`" se enforce en el servicio (no a nivel de schema).
- `dsThemeConfig` es la **fuente de verdad** para los presets del DS (baseColor, brandColor, font, radius, spacing, shadow, transition). Lo demás es contenido derivado o overrides.

---

## 3. Forma de `dsThemeConfig`

```ts
type ThemeConfig = {
  baseColor: 'neutral' | 'slate' | 'gray' | 'zinc' | 'stone' | 'black';
  brandColor: 'neutral' | 'red' | 'orange' | /* … */ 'rose' | 'personalized';
  font: string;        // p. ej. 'Geist', 'Inter', 'Poppins'
  radius: number;      // rem base
  spacing: number;     // rem base
  shadow: string;      // 'none' | 'sm' | 'md' | 'lg' | 'xl'
  transition: number;  // ms
  customBrandHex?: string; // sólo si brandColor === 'personalized'
};
```

Tamaño en BSON: ≈ 200 bytes. Cabe sin esfuerzo en un solo documento.

---

## 4. Por qué MongoDB y no SQL

- El monorepo ya estaba sobre MongoDB para el resto del dominio (ver `schema.prisma` completo y la decisión documentada en los ADR del repo).
- Los blobs de tema son JSON arbitrario y no se consultan por sub-campos en SQL — un documento BSON es una caja perfecta.
- La replica set local (`docker-compose.dev.yml` con `mongo:7`) habilita transacciones cuando se necesita activar/desactivar temas atómicamente (`{ isActive: true }` cambia uno y sólo uno).

---

## 5. Conexión y entorno

```env
# packages/api/.env
DATABASE_URL=mongodb://localhost:27017/app?replicaSet=rs0
```

Producción usa MongoDB Atlas (cluster con replica set por defecto). El `provider = "mongodb"` está fijo en `packages/api/prisma/schema.prisma`.

---

## 6. Cliente — cómo se consume desde la web

`packages/web/src/context/GlobalThemeProvider.tsx` envuelve la app con:

1. `DSThemeProvider` (del DS) — controla el `ThemeConfig` de presets.
2. `ThemeEditorProvider` — guarda el state local (overrides, último config recibido).
3. `DSConfigSync` — observa `state.dsThemeConfig` y llama `setThemeConfig()` del DS cuando cambia.

`localStorage` se usa **sólo** como cache anti-flash. La fuente de verdad es el documento `Theme` activo en MongoDB.

---

## 7. Resumen

| Aspecto | Implementación |
|---------|----------------|
| DB | MongoDB v7 (Atlas en prod / replica set en dev) |
| ORM | Prisma 6 (`provider = "mongodb"`) |
| Modelo | `Theme` (`@@map("themes")`) |
| Tema activo | bandera `isActive` (única en la colección) |
| Source of truth | `dsThemeConfig` + `colorOverrides` |
| API | tRPC (router `theme`) |
| Cache cliente | `localStorage` + cookie para evitar flash en SSR |
| Auth | JWT + cookies HttpOnly (`auth-token`, `refresh-token`) |

Sin pasos genéricos de migración: el modelo `Theme` ya existe en producción y los flujos de Theme Forge ya leen y escriben sobre él.
