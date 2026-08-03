// Rutas públicas para smoke e2e y baseline de paridad visual (Historia 1-4 / NFR-1).
// Un representante por plantilla dinámica (blog/wiki/reviews/casos) + estáticas.
export const PUBLIC_ROUTES: { path: string; name: string }[] = [
  { path: "/", name: "landing" },
  { path: "/sobre-mi", name: "sobre-mi" },
  { path: "/wiki", name: "wiki-index" },
  { path: "/wiki/termino-ejemplo", name: "wiki-termino" },
  { path: "/blog", name: "blog-index" },
  { path: "/blog/plantilla-articulo", name: "blog-post" },
  { path: "/reviews", name: "reviews-index" },
  { path: "/reviews/plantilla-review", name: "reviews-detalle" },
  { path: "/casos-de-estudio", name: "casos-index" },
  { path: "/casos-de-estudio/plantilla-caso", name: "casos-detalle" },
  { path: "/contacto", name: "contacto" },
  { path: "/login", name: "login" },
];
