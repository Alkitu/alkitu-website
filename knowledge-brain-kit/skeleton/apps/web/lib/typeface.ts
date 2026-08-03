/**
 * Modo ET (🛸) — persistencia y anti-flash.
 *
 * ET es el tercer "idioma" del selector del header: no traduce, cambia la
 * tipografía del sitio (español) a la fuente Eari en minúscula (ver globals.css
 * y ds:compositions/site-header). El estado se guarda en localStorage; este
 * script inline se inyecta al inicio del <body> de los layouts raíz y fija
 * `[data-typeface]` en <html> ANTES del primer paint para que no parpadee.
 *
 * La clave debe coincidir con la del selector en el DS (site-header.tsx).
 */
export const TYPEFACE_STORAGE_KEY = "lk-typeface";

export const TYPEFACE_INIT_SCRIPT = `(function(){try{if(localStorage.getItem("${TYPEFACE_STORAGE_KEY}")==="eari"){document.documentElement.setAttribute("data-typeface","eari");}}catch(e){}})();`;
