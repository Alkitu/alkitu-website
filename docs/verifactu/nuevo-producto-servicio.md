# Módulo de Facturación (VeriFactu) - Análisis de Interfaz

Documento consolidado con todos los campos, catálogos y comportamientos de la interfaz para la configuración de la factura y adición de "Nuevo producto/servicio", extraídos del análisis visual.

---

## 1. Configuración General de la Factura

### 1.1 Tipos de Impuesto Principales
* Impuesto sobre el Valor Añadido (IVA)
* Impuesto sobre la Producción, los Servicios y la Importación (IPSI) de Ceuta y Melilla
* Impuesto General Indirecto Canario (IGIC)

### 1.2 Categorías de Factura y Subtipos (Tipo de factura *)
* **Factura ordinaria:**
  * Factura - Art. 6, 7.2 y 7.3 del RD 1619/2012 (F1)
* **Factura rectificativa:**
  * Factura Rectificativa - Error fundado en derecho y Art. 80 Uno Dos y Seis LIVA (R1)
  * Factura Rectificativa - Art. 80.3 (R2)
  * Factura Rectificativa - Art. 80.4 (R3)
  * Factura Rectificativa - Resto (R4)
* **Factura sustitutiva de factura simplificada:** 
  * Factura emitida en sustitución de facturas simplificadas facturadas y declaradas (F3)

---

## 2. Formulario "Nuevo Producto/Servicio"

### 2.1 Campos Principales (Entrada de Datos)
* **Aviso legal:** Recordatorio informativo sobre la introducción de datos sensibles conforme a la normativa de protección de datos (RGPD).
* **Descripción:** Campo de texto amplio (textarea) para detallar el concepto del producto o servicio.
* **Cantidad:** Valor numérico que representa las unidades a facturar.
* **Importe unitario:** Precio individual por cada unidad introducida.
* **Clave régimen:** Campo de texto con botón de ayuda (`?`) adjunto, que despliega el catálogo de claves disponibles.
* **Calificación de operación:** Menú desplegable (`select`).
* **Tipo impositivo (%):** Menú desplegable para seleccionar el porcentaje de impuesto a aplicar sobre la base imponible.

### 2.2 Controles Dinámicos (Interruptores / Toggles)
* **Añadir descuento:** Por defecto apagado. Al activarse, permite consignar descuentos a la línea de detalle.
* **Exenta:** Por defecto apagado. Al activarse, revela el menú desplegable "Causa operación exenta".
* **Añadir recargo equivalencia:** Por defecto apagado. Al activarse, muestra el desplegable "Tipo de recargo de equivalencia (%)" y un campo calculado para la cuota correspondiente.

### 2.3 Campos Calculados Automáticamente (Solo Lectura)
* **Base imponible ó importe no sujeto:** Se calcula automáticamente. Su fórmula es `(Cantidad x Importe unitario) - Descuentos`.
* **Cuota repercutida:** Importe impositivo calculado automáticamente aplicando el "Tipo impositivo (%)" seleccionado a la "Base imponible".
* **Cuota de recargo de equivalencia:** Importe calculado multiplicando la "Base imponible" por el "Tipo de recargo de equivalencia (%)" (visible únicamente si el recargo está activado).

---

## 3. Catálogos y Listados Extraídos

### Calificación de Operación
* Operación Sujeta y No exenta - Sin inversión del sujeto pasivo (S1)
* Operación Sujeta y No exenta - Con inversión del sujeto pasivo (S2)
* Operación No sujeta Artículo 7, 14, otros (N1)
* Operación No sujeta por reglas de localización (N2)

### Clave de Régimen
* `01`: Operación de régimen general
* `02`: Exportación
* `04`: Régimen especial del oro de inversión
* `07`: Régimen especial del criterio de caja
* `08`: Operaciones sujetas al IPSI / IGIC (Impuesto sobre la Producción, los Servicios y la Importación / Impuesto General Indirecto Canario)
* `10`: Cobros por cuenta de terceros de honorarios profesionales o de derechos derivados de la propiedad industrial, de autor u otros por cuenta de sus socios, asociados o colegiados efectuados por sociedades, asociaciones, colegios profesionales u otras entidades que realicen estas funciones de cobro
* `11`: Operaciones de arrendamiento de local de negocio
* `14`: Factura con IVA pendiente de devengo en certificaciones de obra cuyo destinatario sea una Administración Pública.
* `15`: Factura con IVA pendiente de devengo en operaciones de tracto sucesivo.
* `17`: Operación acogida a alguno de los regímenes previstos en el Capítulo XI del Título IX (OSS e IOSS)
* `18`: Recargo de equivalencia.
* `19`: Operaciones de actividades incluidas en el Régimen Especial de Agricultura, Ganadería y Pesca (REAGYP)
* `20`: Régimen simplificado

### Causa Operación Exenta
*(Opciones disponibles al activar el toggle "Exenta")*
* Exenta por el artículo 20 (E1)
* Exenta por el artículo 21 (E2)
* Exenta por el artículo 22 (E3)
* Exenta por los artículos 23 y 24 (E4)
* Exenta por el artículo 25 (E5)
* Exenta por otros (E6)

### Tipos Impositivos (%)
* 0%
* 4%
* 10%
* 21%
* *Añadir tipos no vigentes* (Acción disponible al final del menú, probablemente utilizada para facturas antiguas o casos transitorios de la normativa).

### Tipos de Recargo de Equivalencia (%)
*(Opciones disponibles al activar el toggle "Añadir recargo equivalencia")*
* 1,75%
* 5,20%

> **Nota sobre recargos:** En la normativa fiscal española, los recargos de equivalencia suelen estar directamente vinculados a un tipo de IVA específico (Ej. 5,20% para el IVA General del 21%; 1,4% para el IVA Reducido del 10%; 0,5% para el IVA Superreducido del 4%).
