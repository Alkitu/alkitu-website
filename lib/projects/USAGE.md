# Uso del Módulo de Proyectos

## Configuración actual (JSON)

Actualmente, los proyectos se cargan desde `app/data/projects/seed.json` y se sincronizan con los diccionarios.

### Actualizar proyectos

1. Edita `app/data/projects/seed.json`
2. Ejecuta el comando de sincronización:

```bash
npm run sync:projects
```

3. Los cambios se aplicarán automáticamente a los diccionarios

## Ejemplos de uso en componentes

### Obtener todos los proyectos

```typescript
import { getProjects } from '@/lib/projects';

function ProjectsList({ locale }) {
  const projects = getProjects(locale);

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  );
}
```

### Obtener un proyecto por URL

```typescript
import { getProjectByUrl } from '@/lib/projects';

function ProjectDetail({ url, locale }) {
  const project = getProjectByUrl(url, locale);

  if (!project) return <div>Proyecto no encontrado</div>;

  return <div>{project.title}</div>;
}
```

### Obtener categorías

```typescript
import { getCategories } from '@/lib/projects';

function CategoryFilter({ locale }) {
  const categories = getCategories(locale);

  return (
    <select>
      <option value="All">Todas</option>
      {categories.map(cat => (
        <option key={cat.id} value={cat.name}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
```

### Paginación de proyectos

```typescript
import { getPaginatedProjects } from '@/lib/projects';

function ProjectsPaginated({ locale, page, category }) {
  const { projects, total, totalPages, currentPage } = getPaginatedProjects(
    locale,
    page,
    6, // pageSize
    category
  );

  return (
    <div>
      <div>Total: {total} proyectos</div>
      <div>Página {currentPage} de {totalPages}</div>

      {projects.map(project => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  );
}
```

## Estructura del archivo seed.json

```json
{
  "en": {
    "projects": [
      {
        "id": 1,
        "title": "Project Title",
        "categories": ["Web_Development", "Web_Design"],
        "description": "Project description...",
        "about": "Brief description",
        "tags": ["NextJS", "React"],
        "image": "https://...",
        "gallery": ["https://...", "https://..."],
        "urls": [
          {
            "name": "Website",
            "url": "https://...",
            "fallback": "",
            "active": true
          }
        ],
        "url": "project-slug"
      }
    ]
  },
  "es": {
    "projects": [
      // Same structure with Spanish content
    ]
  }
}
```

## Ventajas de este enfoque

1. **Única fuente de verdad**: Los proyectos solo se editan en `seed.json`
2. **Fácil de mantener**: Un solo archivo para actualizar
3. **Type-safe**: TypeScript valida la estructura
4. **Preparado para migración**: Cuando uses Prisma, solo cambias `data-access.ts`
5. **Sincronización automática**: Script mantiene diccionarios actualizados

## Próximos pasos (Migración a Prisma)

Cuando estés listo para usar MongoDB + Prisma:

1. Sigue las instrucciones en `lib/projects/README.md`
2. Las funciones mantendrán la misma interfaz (solo serán async)
3. Los componentes seguirán funcionando igual (agregando async/await)
