import * as React from "react"

/**
 * useReducedMotion — ¿el usuario pidió menos movimiento en su SO?
 *
 * Espejo en JS de la media query `prefers-reduced-motion: reduce` (la capa CSS
 * global vive en app/globals.css). Úsalo en componentes con motion controlado
 * por JS (framer-motion, WebGL del showcase) para degradar el movimiento —
 * criterio Emil Kowalski: reducir, no eliminar (conserva opacity/color, quita
 * translate/scale). SSR-safe: arranca en `false` hasta el primer efecto.
 *
 * @example
 * const reduce = useReducedMotion()
 * const y = reduce ? 0 : "-100%"
 */
export function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduced(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return reduced
}
