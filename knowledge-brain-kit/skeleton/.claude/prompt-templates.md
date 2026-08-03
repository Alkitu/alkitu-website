# Plantillas de prompt — "apunta antes de disparar"

Derivadas del informe de AI Fluency. Objetivo: subir `constraint_rate` (5%→) e
`intent_rate` (0,6%→) front-loadeando **una restricción** y **un acceptance test**
en los prompts que disparas. Copia, rellena `<...>`, envía.

---

## 1) Feature / cambio

```
<Qué quiero, en una frase>.

Contexto: <por qué / dónde encaja>.
Restricción: no toques <archivos/módulos fuera de X>. Si el scope crece, párate y pregunta.
Done when: <resultado observable y testeable — qué debo poder hacer/ver al terminar>.
```

**Ejemplo**
```
Quita el botón "Exportar" de la cabecera del glosario.
Contexto: ya no usamos la exportación manual.
Restricción: no toques el layout del resto de la cabecera ni otras páginas.
Done when: el botón ya no se renderiza y la búsqueda del glosario sigue funcionando.
```

---

## 2) Merge / deploy (con gate)

```
Haz el merge de <rama> a main y despliega.
Restricción: solo main; no toques env/secrets ni el pipeline de CI.
Gate: despliega SOLO si `pnpm build` y `pnpm validate:context` pasan.
Si algo falla: no despliegues, dime la causa y espera mi OK.
Done when: main contiene <X> y el deploy está live y verificado.
```

> Nota: el hook `.claude/hooks/gate-merge-deploy.sh` ya bloquea el merge/deploy
> si el gate falla, aunque olvides escribir la línea "Gate:".

---

## 3) Rechazo / corrección (síntoma → diagnóstico)

En vez de "no funciona" o "no aparece":

```
<Síntoma concreto>: tras <acción>, <qué pasa> donde yo esperaba <qué debería pasar>.
Antes de tocar nada: revisa <primer sitio probable> y dime si la causa es A, B o C.
No cambies código hasta confirmar la causa conmigo.
```

**Ejemplo**
```
No se refleja: tras guardar el término, la vista no se actualiza donde espero verlo.
Antes de tocar nada: revisa si el dato llega al backend (log de la request) y dime
si la causa es el fetch, el estado del cliente o el render.
```

---

## 4) Hand-off grande (pipeline)

```
<Pipeline completo, con rutas de assets y herramientas si las sabes>.
Plan primero: dame el plan por pasos y espera mi OK antes de ejecutar.
Restricción: <qué no tocar>. Si una herramienta falla (p. ej. Whisper), avisa, no asumas.
Done when: <entregable final concreto>.
```
