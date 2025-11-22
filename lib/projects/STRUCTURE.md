# Estructura Modular de Proyectos

## 📁 Organización de archivos

```
alkitu-website/
├── app/
│   ├── data/
│   │   └── projects/
│   │       └── seed.json          # 📊 Datos de proyectos (única fuente de verdad)
│   │
│   ├── dictionaries/
│   │   ├── en.json                # Sincronizado con seed.json
│   │   └── es.json                # Sincronizado con seed.json
│   │
│   └── [lang]/
│       └── projects/
│           ├── page.tsx           # Lista de proyectos
│           └── [project]/
│               └── page.tsx       # Detalle de proyecto
│
└── lib/
    └── projects/
        ├── index.ts               # 📦 Exportaciones públicas
        ├── types.ts               # 📝 Tipos TypeScript
        ├── data-access.ts         # 🔌 Acceso a datos (futuro Prisma)
        ├── sync-to-dictionaries.js  # 🔄 Script de sincronización
        ├── README.md              # 📖 Documentación de migración
        ├── USAGE.md               # 💡 Ejemplos de uso
        └── STRUCTURE.md           # Este archivo
```

## 🎯 Flujo de datos

```
┌─────────────────────────────────────────────────────────────┐
│                    seed.json                                 │
│              (Única fuente de verdad)                        │
│                                                              │
│  {                                                           │
│    "en": { "projects": [...] },                             │
│    "es": { "projects": [...] }                              │
│  }                                                           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ npm run sync:projects
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              lib/projects/data-access.ts                     │
│                                                              │
│  • getProjects(locale)                                       │
│  • getProjectByUrl(url, locale)                             │
│  • getCategories(locale)                                     │
│  • getPaginatedProjects(...)                                │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ import { getProjects } from '@/lib/projects'
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                  Componentes React                           │
│                                                              │
│  • ProjectsPage                                              │
│  • ProjectDetail                                             │
│  • ProjectCard                                               │
│  • FilterCategories                                          │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Sincronización

### Actualizar proyectos:

1. **Editar datos**: Modifica `app/data/projects/seed.json`
2. **Sincronizar**: Ejecuta `npm run sync:projects`
3. **Verificar**: Los cambios se reflejan automáticamente

### Comando de sincronización:

```bash
npm run sync:projects
```

Este comando:
- Lee `seed.json`
- Extrae categorías únicas
- Actualiza `en.json` y `es.json`
- Mantiene la consistencia

## 🚀 Preparación para Prisma

La estructura actual está diseñada para facilitar la migración a Prisma + MongoDB:

### Cambios necesarios:

1. **Instalar Prisma**
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

2. **Definir schema**
   - Crear `prisma/schema.prisma`
   - Definir modelo `Project`

3. **Actualizar data-access.ts**
   - Reemplazar lecturas de JSON con queries de Prisma
   - Mantener la misma interfaz de funciones
   - Solo agregar `async/await`

4. **Seed inicial**
   - Usar `seed.json` para poblar MongoDB
   - Ejecutar `npx prisma db seed`

### Ventajas:

- ✅ **Cero cambios en componentes**: Solo agregar async/await
- ✅ **Tipos consistentes**: TypeScript valida todo
- ✅ **Fácil rollback**: Puedes volver a JSON si es necesario
- ✅ **Testing**: Fácil mockear data-access.ts

## 📝 Correcciones realizadas

### Errores corregidos en esta sesión:

1. ✅ **Missing key prop**: Agregado `key={category}` en map de categorías
2. ✅ **Invalid HTML**: Cambiado `<p>` a `<div>` para evitar nesting inválido
3. ✅ **Empty href**: Cambiado `<div href="">` a `<a href="#">` en Twitter icon
4. ✅ **Typo**: Corregido "ursor-pointer" a "cursor-pointer"

### Archivos modificados:

- `app/[lang]/projects/[project]/page.tsx`
- `app/components/ui/contact/SocialButtons.jsx`

## 🎨 Ventajas de esta arquitectura

1. **Separación de responsabilidades**
   - Datos: `seed.json`
   - Tipos: `types.ts`
   - Lógica: `data-access.ts`
   - UI: Componentes React

2. **Mantenibilidad**
   - Una sola fuente de verdad
   - Sincronización automática
   - Scripts documentados

3. **Escalabilidad**
   - Preparado para MongoDB
   - Fácil agregar nuevos campos
   - Type-safe

4. **Developer Experience**
   - Autocompletado TypeScript
   - Errores en tiempo de compilación
   - Documentación clara

## 📚 Recursos

- [README.md](./README.md) - Guía completa de migración a Prisma
- [USAGE.md](./USAGE.md) - Ejemplos de uso en componentes
- [types.ts](./types.ts) - Definición de tipos TypeScript
