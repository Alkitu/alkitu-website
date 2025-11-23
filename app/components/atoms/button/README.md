# Button Component

Sistema de botones atómicos usando Tailwind CSS puro.

## Importación

```tsx
import { Button } from "@/app/components/button";
```

## Variantes disponibles

### 1. Primary (default)

Botón principal con fondo verde

```tsx
<Button variant='primary'>Contáctame</Button>
```

### 2. Secondary

Botón con borde y fondo transparente que cambia en hover

```tsx
<Button variant='secondary'>Proyectos</Button>
```

### 3. Outline

Botón con borde verde y fondo transparente

```tsx
<Button variant='outline'>Ver más</Button>
```

### 4. Ghost

Botón transparente sin borde

```tsx
<Button variant='ghost'>Cancelar</Button>
```

### 5. Link

Estilo de enlace con subrayado en hover

```tsx
<Button variant='link'>Leer más</Button>
```

## Tamaños

```tsx
<Button size="sm">Pequeño</Button>
<Button size="md">Mediano</Button>  {/* default */}
<Button size="lg">Grande</Button>
```

## Con iconos

```tsx
import Image from 'next/image';

<Button
  variant="primary"
  iconBefore={<Image src="/icon.svg" width={20} height={20} alt="" />}
>
  Descargar CV
</Button>

<Button
  variant="secondary"
  iconAfter={<span>→</span>}
>
  Siguiente
</Button>
```

## Ancho completo

```tsx
<Button fullWidth>Botón de ancho completo</Button>
```

## Deshabilitado

```tsx
<Button disabled>Botón deshabilitado</Button>
```

## Props personalizadas

```tsx
<Button
  variant='primary'
  onClick={() => console.log("Clicked!")}
  className='rounded-full'
>
  Custom
</Button>
```

## Animaciones incluidas

Todas las variantes incluyen:

- **Hover**: `scale-105` + efectos específicos de cada variante
- **Active/Click**: `scale-95`
- **Transiciones suaves**: `transition-all`
- **Estados disabled**: Opacidad reducida y sin animaciones

## Ejemplos de uso en el proyecto

### Navbar

```tsx
<Button variant='primary' size='sm'>
  Contáctame
</Button>
```

### Hero Section

```tsx
<Button variant="primary" size="lg" fullWidth>
  Descargar CV
</Button>

<Button variant="secondary" size="lg" fullWidth>
  Proyectos
</Button>
```

### Footer

```tsx
<Button variant='primary' className='rounded-3xl'>
  Contáctame
</Button>
```

## Migración desde componentes antiguos

### Desde PrimaryButton

```tsx
// Antes
<PrimaryButton text="Descargar CV" icon="download" />

// Después
<Button variant="primary" iconAfter={<DownloadIcon />}>
  Descargar CV
</Button>
```

### Desde SecondaryButton

```tsx
// Antes
<SecondaryButton>Proyectos</SecondaryButton>

// Después
<Button variant="secondary">Proyectos</Button>
```

### Desde ContactModalButton

```tsx
// Antes
<ContactModalButton className="..." />

// Después
<Button variant="primary" onClick={openModal}>
  Contáctame
</Button>
```
