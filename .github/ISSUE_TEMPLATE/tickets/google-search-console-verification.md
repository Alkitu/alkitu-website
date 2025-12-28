# [TASK] Verify sitemap.xml in Google Search Console

**Labels:** `task`, `seo`, `P1`
**Type:** 🔧 Configuration
**Priority:** 🟠 High (P1)

---

## 📝 Descripción

**Qué:**
Verificar y registrar el sitemap.xml generado dinámicamente en Google Search Console para mejorar la indexación del sitio.

**Por qué:**
- El sitemap fue implementado en `app/sitemap.ts` y genera dinámicamente URLs de proyectos
- Google Search Console necesita conocer la existencia del sitemap para indexar correctamente el sitio
- Actualmente el sitemap está disponible en `https://alkitu.com/sitemap.xml` pero no está registrado en GSC
- La correcta indexación impacta directamente el SEO y visibilidad del portfolio

---

## ✅ Criterios de Aceptación

- [ ] Acceso verificado a Google Search Console para el dominio `alkitu.com`
- [ ] Sitemap `https://alkitu.com/sitemap.xml` enviado en GSC
- [ ] Validación exitosa del sitemap (sin errores de formato o acceso)
- [ ] Confirmación de que Google puede acceder al sitemap (status HTTP 200)
- [ ] Verificar que todas las URLs del sitemap son indexables:
  - [ ] Root route (`/`)
  - [ ] Static routes (`/en/*`, `/es/*`)
  - [ ] Dynamic project routes (`/{locale}/projects/{slug}`)
- [ ] Revisar Coverage Report en GSC para detectar problemas
- [ ] Configurar alertas de errores de indexación (opcional pero recomendado)

---

## 🔧 Enfoque Técnico

**Pasos:**

1. **Acceder a Google Search Console**
   - URL: https://search.google.com/search-console
   - Verificar propiedad del dominio `alkitu.com` (si no está verificado)

2. **Enviar Sitemap**
   - Navegar a "Sitemaps" en el menú lateral
   - Ingresar URL: `sitemap.xml`
   - Click en "Submit"

3. **Validación del Sitemap**
   ```bash
   # Verificar acceso público al sitemap
   curl -I https://alkitu.com/sitemap.xml
   # Debe retornar HTTP/2 200

   # Verificar formato XML válido
   curl https://alkitu.com/sitemap.xml | head -50
   ```

4. **Revisar Coverage**
   - Esperar 24-48 horas para que Google procese el sitemap
   - Revisar "Coverage" report en GSC
   - Identificar URLs excluidas o con errores

5. **Verificar robots.txt**
   - Confirmar que `robots.txt` apunta al sitemap
   - URL: https://alkitu.com/robots.txt
   - Debe contener: `Sitemap: https://alkitu.com/sitemap.xml`

**Archivos relacionados:**
- `app/sitemap.ts` - Generador de sitemap dinámico
- `app/robots.ts` - Configuración de robots.txt
- `lib/sitemap-utils.ts` - Utilidades para generación de sitemap

**Documentación relevante:**
- [Google Search Console - Sitemaps Guide](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Next.js Sitemap Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

---

## 🔗 Dependencias

**Bloqueado por:**
- Ninguna (sitemap ya está implementado)

**Bloquea:**
- SEO optimization tasks
- Indexación de nuevos proyectos
- Analytics de búsqueda orgánica

---

## ⏱️ Estimación

**Complejidad:** Baja
**Esfuerzo estimado:** 30 minutos - 1 hora

**Breakdown:**
- Acceso y configuración GSC: 15 min
- Envío y validación del sitemap: 15 min
- Revisión de coverage (post-indexación): 30 min (en 24-48h)

---

## 📊 Métricas de Éxito

**Indicadores inmediatos:**
- Sitemap submitted sin errores en GSC
- Status "Success" en sitemap submission

**Indicadores a mediano plazo (1-2 semanas):**
- Aumento de páginas indexadas en GSC Coverage Report
- Reducción de "Discovered - not indexed" URLs
- Aparición de URLs de proyectos dinámicos en índice de Google

---

## 📝 Notas Adicionales

**Consideraciones:**
- El sitemap se genera dinámicamente en build time con Next.js 16
- Incluye rutas estáticas (home, about, projects, blog, contact) en ambos idiomas
- Incluye rutas dinámicas de proyectos activos desde Supabase
- Blog routes están comentadas (TODO) hasta que el blog sea database-driven

**Post-verificación:**
- Monitorear GSC regularmente para nuevos errores de indexación
- Cuando se implemente el blog database-driven, actualizar sitemap y re-enviar
- Considerar crear sitemaps separados por idioma si el sitio crece significativamente (>50k URLs)
