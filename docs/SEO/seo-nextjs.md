A continuación, presento el manual estructurado en formato **Markdown profesional**. Puedes copiar y pegar este contenido directamente en un archivo `.md` (como un `README.md` o una Wiki interna) para que tu equipo lo utilice como estándar de ingeniería.

---

# 📘 Manual de Ingeniería: Next.js SEO para Expertos

> **Propósito:** Protocolo de arquitectura y auditoría para lograr puntuaciones 100/100 en Core Web Vitals y visibilidad máxima en SERP.

---

## 1. Arquitectura de Infraestructura (Pre-Vuelo)

*Antes de publicar el primer artículo, el motor debe estar optimizado.*

### 1.1 Estrategia de Renderizado (The Golden Rule)

* **Contenido Editorial:** Debe usar **SSG (Static Site Generation)** o **ISR (Incremental Static Regeneration)**.
* **Prohibición de CSR:** El cuerpo del artículo y los metadatos **nunca** deben depender de `use client`.
* **Validación:** Ejecuta `npm run build`. Si las páginas de blog muestran el círculo hueco (λ - Server) en lugar del círculo lleno (○ - Static) o el rayo (⚡ - ISR), la arquitectura es incorrecta.

### 1.2 Configuración Crítica en `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Asegura consistencia en las URLs para evitar contenido duplicado
  trailingSlash: true, 
  // Optimización de imágenes de dominios externos (CMS)
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'tu-cms.com' }],
    formats: ['image/avif', 'image/webp'],
  },
}

```

---

## 2. Generación de la "Publicación Perfecta"

*Protocolo paso a paso para la creación de contenido.*

### 2.1 Ingeniería del Título (CTR Maximization)

El título HTML debe seguir la regla **80/20**: La palabra clave principal debe estar en el primer 20% del texto.

* **Longitud:** 50-60 caracteres.
* **Power Words:** Incluir obligatoriamente un disparador psicológico.
* *Seducción:* "Gratis", "Paso a paso", "Nuevo".
* *Emoción:* "Secreto", "Prohibido", "Impactante".
* *Confianza:* "Guía Definitiva", "Certificado", "Oficial".



### 2.2 Metadatos Dinámicos (`generateMetadata`)

Implementar siempre en `page.tsx` para inyectar datos reales del CMS o Markdown:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://tusitio.com/blog/${params.slug}` },
    openGraph: {
      type: 'article',
      publishedTime: post.date,
      images: [{ url: post.mainImage }],
    },
  };
}

```

### 2.3 Datos Estructurados (JSON-LD)

No confíes en plugins externos. Inyecta el esquema `BlogPosting` manualmente para habilitar **Rich Snippets**.

* **Requisito Google Discover:** Debes declarar un array de imágenes en proporciones 16:9, 4:3 y 1:1.

---

## 3. Protocolo de Auditoría Técnica (Deep Dive)

*Cómo auditar una URL de Next.js como un Arquitecto de Software.*

### 3.1 Verificación de Hidratación y Código Fuente

1. Abre la página en el navegador.
2. Presiona `CTRL + U` (Ver código fuente).
3. **Búsqueda Crítica:** Busca el texto del primer párrafo.
* **Pasa:** El texto está en el HTML crudo (Indexable).
* **Falla:** El texto no aparece (Indica que se renderizó en el cliente; el SEO es nulo).



### 3.2 Auditoría de Core Web Vitals (CWV)

| Métrica | Target | Acción en Next.js |
| --- | --- | --- |
| **LCP** (Largest Contentful Paint) | < 2.5s | Usa `priority` en el componente `<Image>` del Hero. |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Define `width` y `height` o `aspect-ratio` en todas las imágenes. |
| **INP** (Interaction to Next Paint) | < 200ms | Mueve scripts pesados (GTM, Chat) a Web Workers con `next/script` y `strategy="worker"`. |

---

## 4. Checklist de Validación Final

*Antes de mover a producción, marca cada casilla:*

* [ ] **Canonical:** Etiqueta `<link rel="canonical">` presente y autorreferencial.
* [ ] **Imágenes:** Todas tienen atributo `alt` descriptivo y no usan etiquetas `<img>` nativas.
* [ ] **Sitemap:** Localizado en `/sitemap.xml` y generado dinámicamente mediante `sitemap.ts`.
* [ ] **Robots:** Archivo `/robots.txt` permite el rastreo de `/blog/` y apunta al sitemap.
* [ ] **Heading Hierarchy:** Un solo `<h1>`, seguido de `<h2>` y `<h3>` en orden lógico.
* [ ] **Links:** Todos los enlaces internos usan el componente `next/link`.
* [ ] **Mobile Friendly:** Puntuación superior a 90 en Lighthouse Mobile.

---

## 5. Glosario de "Power Words" para Titulares

Utiliza esta tabla para auditar la calidad de los títulos del equipo editorial:

| Categoría | Ejemplo de Palabra | Efecto |
| --- | --- | --- |
| **Urgencia** | "Hoy", "Ahora", "Limitado" | Reduce el tiempo de decisión. |
| **Curiosidad** | "Secreto", "Pocos conocen", "Verdad" | Aumenta el CTR por brecha de información. |
| **Facilidad** | "Simple", "Guía rápida", "En 5 min" | Atrae a usuarios que buscan soluciones rápidas. |

---

