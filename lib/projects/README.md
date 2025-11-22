# Projects Module

Este módulo maneja toda la lógica relacionada con proyectos del portfolio.

## Estructura

```
lib/projects/
├── index.ts           # Exportaciones públicas del módulo
├── types.ts           # Tipos TypeScript
├── data-access.ts     # Funciones de acceso a datos
└── README.md          # Esta documentación

app/data/projects/
└── seed.json          # Datos de proyectos (seed data)
```

## Uso actual

```typescript
import { getProjects, getProjectByUrl, getCategories } from '@/lib/projects';

// Obtener todos los proyectos de un idioma
const projects = getProjects('en');

// Obtener un proyecto por su URL
const project = getProjectByUrl('proyect_1', 'es');

// Obtener categorías
const categories = getCategories('en');

// Obtener proyectos paginados
const { projects, total, totalPages } = getPaginatedProjects('en', 1, 6, 'Web_Development');
```

## Migración a Prisma + MongoDB

Cuando estés listo para migrar a Prisma, sigue estos pasos:

### 1. Instalar dependencias

```bash
npm install prisma @prisma/client
npm install -D prisma
```

### 2. Inicializar Prisma

```bash
npx prisma init
```

### 3. Configurar el schema de Prisma

Edita `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Project {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  projectId   Int      @unique
  title       String
  categories  String[]
  description String
  about       String
  tags        String[]
  image       String
  gallery     String[]
  url         String   @unique
  locale      String
  urls        ProjectUrl[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([locale])
  @@index([url])
}

type ProjectUrl {
  name     String
  url      String
  fallback String?
  active   Boolean?
}

model Category {
  id     String @id @default(auto()) @map("_id") @db.ObjectId
  name   String @unique
  locale String

  @@index([locale])
}
```

### 4. Crear script de seed

Crea `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import seedData from '../app/data/projects/seed.json';

const prisma = new PrismaClient();

async function main() {
  // Limpiar datos existentes
  await prisma.project.deleteMany();
  await prisma.category.deleteMany();

  // Seed proyectos en inglés
  for (const project of seedData.en.projects) {
    await prisma.project.create({
      data: {
        projectId: project.id,
        title: project.title,
        categories: project.categories,
        description: project.description,
        about: project.about,
        tags: project.tags,
        image: project.image,
        gallery: project.gallery,
        url: project.url,
        locale: 'en',
        urls: project.urls || []
      }
    });
  }

  // Seed proyectos en español
  for (const project of seedData.es.projects) {
    await prisma.project.create({
      data: {
        projectId: project.id,
        title: project.title,
        categories: project.categories,
        description: project.description,
        about: project.about,
        tags: project.tags,
        image: project.image,
        gallery: project.gallery,
        url: project.url,
        locale: 'es',
        urls: project.urls || []
      }
    });
  }

  console.log('✅ Seed completado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 5. Actualizar data-access.ts

Reemplaza el contenido de `lib/projects/data-access.ts` con queries de Prisma:

```typescript
import { PrismaClient } from '@prisma/client';
import { Project, Category, Locale } from './types';

const prisma = new PrismaClient();

export async function getProjects(locale: Locale): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    where: { locale }
  });
  return projects as Project[];
}

export async function getProjectByUrl(url: string, locale: Locale): Promise<Project | null> {
  const project = await prisma.project.findFirst({
    where: { url, locale }
  });
  return project as Project | null;
}

export async function getProjectById(id: number, locale: Locale): Promise<Project | null> {
  const project = await prisma.project.findFirst({
    where: { projectId: id, locale }
  });
  return project as Project | null;
}

export async function getCategories(locale: Locale): Promise<Category[]> {
  const projects = await getProjects(locale);
  const categoriesSet = new Set<string>();

  projects.forEach(project => {
    project.categories.forEach(category => {
      categoriesSet.add(category);
    });
  });

  return Array.from(categoriesSet).map(category => ({
    id: category.toLowerCase().replace(/_/g, ''),
    name: category
  }));
}

export async function getProjectsByCategory(category: string, locale: Locale): Promise<Project[]> {
  if (category === 'All') {
    return getProjects(locale);
  }

  const projects = await prisma.project.findMany({
    where: {
      locale,
      categories: {
        has: category
      }
    }
  });

  return projects as Project[];
}

export async function getPaginatedProjects(
  locale: Locale,
  page: number = 1,
  pageSize: number = 6,
  category?: string
): Promise<{
  projects: Project[];
  total: number;
  totalPages: number;
  currentPage: number;
}> {
  const where = {
    locale,
    ...(category && category !== 'All' && {
      categories: { has: category }
    })
  };

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.project.count({ where })
  ]);

  return {
    projects: projects as Project[],
    total,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page
  };
}
```

### 6. Ejecutar migración

```bash
# Generar cliente de Prisma
npx prisma generate

# Ejecutar seed
npx prisma db seed
```

### 7. Actualizar componentes

Los componentes no necesitan cambios, ya que solo importan desde `@/lib/projects`.
Las funciones ahora retornarán Promises, así que asegúrate de usar `async/await`:

```typescript
// Antes (con seed.json)
const projects = getProjects('en');

// Después (con Prisma)
const projects = await getProjects('en');
```

## Ventajas de esta arquitectura

1. **Separación de responsabilidades**: Datos, tipos y lógica están separados
2. **Fácil migración**: Solo hay que actualizar `data-access.ts`
3. **Type-safe**: TypeScript garantiza consistencia
4. **Escalable**: Preparado para crecer con la aplicación
5. **Testeable**: Funciones puras fáciles de testear
