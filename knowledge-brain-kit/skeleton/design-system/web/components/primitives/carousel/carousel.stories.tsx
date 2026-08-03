import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "./carousel"
import { Card, CardContent } from "~/components/primitives/card"

const meta: Meta<typeof Carousel> = {
    title: "Primitives/Carousel",
    component: Carousel,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
}

export default meta
type Story = StoryObj<typeof Carousel>

export const Default: Story = {
    render: () => (
        <Carousel className="w-full max-w-xs">
            <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <span className="text-4xl font-semibold">{index + 1}</span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    ),
}

export const MultipleItems: Story = {
    render: () => (
        <Carousel
            opts={{ align: "start" }}
            className="w-full max-w-sm"
        >
            <CarouselContent className="-ml-1">
                {Array.from({ length: 8 }).map((_, index) => (
                    <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <span className="text-2xl font-semibold">{index + 1}</span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    ),
}

export const WithContent: Story = {
    render: () => {
        const slides = [
            {
                title: "Mountain Retreat",
                subtitle: "Explore the highlands",
                bg: "from-blue-500 to-indigo-600",
            },
            {
                title: "Ocean Views",
                subtitle: "Sail into the sunset",
                bg: "from-cyan-500 to-blue-600",
            },
            {
                title: "Desert Sands",
                subtitle: "Feel the warmth",
                bg: "from-orange-400 to-amber-600",
            },
            {
                title: "Forest Path",
                subtitle: "Walk among the trees",
                bg: "from-green-500 to-emerald-700",
            },
        ]
        return (
            <Carousel className="w-full max-w-md">
                <CarouselContent>
                    {slides.map((slide, index) => (
                        <CarouselItem key={index}>
                            <div
                                className={`h-52 rounded-xl bg-gradient-to-br ${slide.bg} flex flex-col items-center justify-center text-white p-6`}
                            >
                                <h3 className="text-2xl font-bold mb-1">{slide.title}</h3>
                                <p className="text-sm opacity-80">{slide.subtitle}</p>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        )
    },
}
