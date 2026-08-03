"use client";

import * as React from "react"
import Lottie, { LottieRefCurrentProps } from "lottie-react"
import { lottieRegistry, type LottieAnimationName } from "~/components/foundations/lottie"
import { cn } from "~/lib/utils"

export interface LottieAnimationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "name"> {
    /**
     * Identificador estricto de la animación basado en el registro (ej. 'bounce', 'bell')
     */
    name?: LottieAnimationName

    /**
     * Data en duro de la animación. Si se provee, ignora 'name'. Útil para inyectar JSONs dinámicos 
     * directo como en las galerías de Storybook mediante imports glob.
     */
    animationData?: any

    /**
     * Playback trigger
     * - 'loop': Se reproduce infinitamente y automáticamente.
     * - 'autoplay': Se reproduce sola cuando monta, pero solo una vez.
     * - 'scroll': Se reproduce en sincronía con el scroll cuando el elemento entra en viewport.
     * - 'controlled': Tú mismo le pasas el estado desde fuera con ref o controlando `loop` o `autoplay`.
     */
    trigger?: "hover" | "click" | "loop" | "autoplay" | "scroll" | "controlled"

    /** 
     * Animation speed
     */
    speed?: number

    /**
     * Optionally override strict loop option
     */
    loop?: boolean

    /**
     * If true, it reverses the animation when hovering out (only valid for trigger="hover")
     */
    reverseOnMouseLeave?: boolean
}

export const LottieAnimation = React.forwardRef<LottieRefCurrentProps, LottieAnimationProps>(
    (
        {
            name,
            animationData: externalAnimationData,
            trigger = "loop",
            className,
            speed = 1,
            loop,
            reverseOnMouseLeave = false,
            onClick,
            onMouseEnter,
            onMouseLeave,
            ...props
        },
        ref
    ) => {

        // Local ref to control playback
        const internalRef = React.useRef<LottieRefCurrentProps>(null)

        // Forward ref natively
        React.useImperativeHandle(ref, () => internalRef.current as LottieRefCurrentProps)

        const animationData = externalAnimationData || (name ? lottieRegistry[name] : null)

        React.useEffect(() => {
            if (internalRef.current?.setSpeed) {
                internalRef.current.setSpeed(speed)
            }
        }, [speed])

        // Interaction handlers
        const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
            if (onMouseEnter) onMouseEnter(e)
            if (trigger === "hover" && internalRef.current) {
                internalRef.current.setDirection(1)
                internalRef.current.play()
            }
        }

        const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
            if (onMouseLeave) onMouseLeave(e)
            if (trigger === "hover" && internalRef.current) {
                if (reverseOnMouseLeave) {
                    internalRef.current.setDirection(-1)
                    internalRef.current.play()
                } else {
                    internalRef.current.stop()
                }
            }
        }

        const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
            if (onClick) onClick(e)
            if (trigger === "click" && internalRef.current) {
                internalRef.current.goToAndPlay(0, true)
            }
        }

        // Default configuration based on triggers
        const isAutoplay = trigger === "loop" || trigger === "autoplay"
        const isLoop = loop !== undefined ? loop : (trigger === "loop" || trigger === "hover")

        // Lottie Scroll Interactivity
        const interactivity = trigger === "scroll" ? {
            mode: "scroll" as const,
            actions: [
                {
                    visibility: [0, 1] as [number, number],
                    type: "seek" as const,
                    frames: [0, 100] as [number, number], // 0-100% representation
                }
            ]
        } : undefined;

        return (
            <div
                className={cn("inline-block w-16 h-16 cursor-pointer", className)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                {...props}
            >
                <Lottie
                    lottieRef={internalRef}
                    animationData={animationData}
                    autoplay={isAutoplay}
                    loop={isLoop}
                    interactivity={interactivity}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
        )
    }
)

LottieAnimation.displayName = "LottieAnimation"
