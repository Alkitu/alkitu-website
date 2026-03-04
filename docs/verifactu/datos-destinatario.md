# Módulo de Facturación (VeriFactu) - Análisis de Interfaz de Destinatario

Documento consolidado con todos los campos, catálogos y comportamientos de la interfaz relativas al destinatario de la factura extraídos del análisis visual.

---

## 1. Datos del destinatario

### 1.1 Tipo de persona
Menú desplegable para seleccionar la naturaleza jurídica del destinatario de la factura.
* **Persona Jurídica** (Seleccionada por defecto en la imagen)
* **Persona Física**

### 1.2 Razón social *
Campo de texto libre y obligatorio (indicado por el asterisco).
El nombre de la empresa, autónomo o particular a quien va dirigida la factura.

### 1.3 Tipo de identificación
Menú de selección con botones de radio (radio buttons) y un icono de ayuda contextual (`?`).
* **NIF** (Seleccionado por defecto en la imagen, Número de Identificación Fiscal español).
* **Otro** (Probablemente despliegue opciones adicionales para identificación extranjera, como pasaporte o identificador intracomunitario).

### 1.4 Nif del cliente
Campo de entrada de texto corto alfanumérico donde va el NIF de la empresa o persona, que debería estar alineado con la opción seleccionada en "Tipo de identificación".

---

## 2. Domicilio

### 2.1 País *
Menú desplegable (obligatorio) para seleccionar el país de residencia fiscal del destinatario.

### 2.2 Vía *
Campo de entrada de texto largo (obligatorio) para indicar el nombre de la calle, avenida, etc. del domicilio.

### 2.3 Código postal
Campo de entrada para el código postal, junto con un icono de buscar con una lupa, lo que sugiere una función de autocompletado para buscar combinaciones de provincia y población en base al código introducido.

### 2.4 Población *
Campo de entrada de texto libre (obligatorio) para indicar la localidad, pueblo o ciudad.

### 2.5 Provincia
Campo de entrada de texto libre para indicar la provincia.

---

## 3. Otros datos de contacto

### 3.1 Dirección de email
Campo de entrada de texto (probablemente validado como email) para el contacto digital y posible envío de la factura electrónica.

### 3.2 Teléfono
Campo de entrada con un icono de ayuda contextual (`?`).

### 3.3 Página web
Campo de texto libre para introducir la URL del sitio web de la empresa o profesional destinatario.
