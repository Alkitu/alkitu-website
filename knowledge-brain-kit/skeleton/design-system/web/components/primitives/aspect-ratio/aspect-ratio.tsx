"use client"

import { AspectRatio as AspectRatioPrimitive } from "radix-ui"
import { cn } from "~/lib/utils"

function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" className={cn(props.className)} {...props} />
}

export { AspectRatio }
