import type { ComponentType } from "react";

// slug del término → widget interactivo. Carga diferida: cada página de término
// solo descarga el widget que necesita (o ninguno).
//
// PLANTILLA: sin widgets por defecto. Para añadir uno, crea el componente en
// esta carpeta (puedes componer los primitivos `_Stepper` / `_RevealGrid`) y
// mapéalo aquí por el slug de su término, p. ej.:
//   "mi-termino": dynamic(() => import("./MiWidget")),
export const INTERACTIVE: Record<string, ComponentType> = {};
