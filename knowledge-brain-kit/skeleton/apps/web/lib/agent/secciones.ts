import { totalTerminos } from "./glosario";

/**
 * Mapa del sitio para el agente (mismo espíritu que /llms.txt): qué secciones
 * existen y para qué sirve cada una. Estático + conteo real del glosario.
 */
export function listSecciones() {
  return [
    { seccion: "wiki", url: "/wiki", que: `Glosario del concepto (${totalTerminos()} términos con definición citable).` },
    { seccion: "blog", url: "/blog", que: "Artículos y notas que desarrollan los temas en profundidad." },
    { seccion: "casos", url: "/casos-de-estudio", que: "Casos de estudio explicados de principio a fin." },
    { seccion: "reviews", url: "/reviews", que: "Reseñas de herramientas y recursos del concepto." },
    { seccion: "about", url: "/sobre-mi", que: "Quién está detrás y por qué existe este cerebro." },
    { seccion: "contacto", url: "/contacto", que: "Cómo ponerse en contacto." },
  ];
}
