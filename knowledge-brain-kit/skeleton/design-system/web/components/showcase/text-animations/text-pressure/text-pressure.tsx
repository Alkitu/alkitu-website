"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "~/lib/utils"

interface TextPressureProps {
    /**
     * The text to display
     */
    text: string

    /**
     * Custom Tailwind classes
     */
    className?: string

    /**
     * Maximum font weight to reach based on distance
     */
    weightSpan?: [number, number]

    /**
     * The distance threshold in pixels where weight begins to change
     */
    proximity?: number

    /**
     * Defines if the effect applies to characters or words
     */
    applyTo?: "characters" | "words"
}

export function TextPressure({
    text = "",
    className,
    weightSpan = [300, 900],
    proximity = 150,
    applyTo = "characters",
}: TextPressureProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [points, setPoints] = useState<{ x: number; y: number; id: string }[]>([])
    const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })

    useEffect(() => {
        // Collect bounding boxes and centers for every sub-element
        if (!containerRef.current) return

        const spans = Array.from(containerRef.current.children) as HTMLElement[]
        const newPoints = spans.map((span, i) => {
            const rect = span.getBoundingClientRect()
            return {
                id: `el-${i}`,
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            }
        })
        setPoints(newPoints)
    }, [text])

    const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY })
    }

    const handleMouseLeave = () => {
        setMousePos({ x: -1000, y: -1000 })
    }

    useEffect(() => {
        // Attach global listener so the pressure works even slightly outside the container
        window.addEventListener("mousemove", handleMouseMove)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
        }
    }, [])

    const elements = applyTo === "characters" ? text.split("") : text.split(" ")
    const [minWeight, maxWeight] = weightSpan

    return (
        <div
            ref={containerRef}
            onMouseLeave={handleMouseLeave}
            className={cn("flex flex-wrap cursor-crosshair m-0", className)}
        >
            {elements.map((el, i) => {
                const point = points[i]
                let currentWeight = minWeight

                if (point) {
                    const distanceX = mousePos.x - point.x
                    const distanceY = mousePos.y - point.y
                    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

                    if (distance < proximity) {
                        const factor = 1 - distance / proximity
                        currentWeight = minWeight + factor * (maxWeight - minWeight)
                    }
                }

                return (
                    <motion.span
                        key={i}
                        className={cn("inline-block font-[var(--weight)] transition-all duration-75", applyTo === "characters" && el === " " ? "w-2" : "")}
                        style={{
                            // @ts-ignore
                            "--weight": Math.round(currentWeight),
                            fontVariationSettings: `"wght" ${Math.round(currentWeight)}`,
                            transformOrigin: "bottom center"
                        }}
                        animate={{
                            scaleY: Math.round(currentWeight) > 600 ? 1.05 : 1
                        }}
                    >
                        {el}
                        {applyTo === "words" && i < elements.length - 1 && "\u00A0"}
                    </motion.span>
                )
            })}
        </div>
    )
}
