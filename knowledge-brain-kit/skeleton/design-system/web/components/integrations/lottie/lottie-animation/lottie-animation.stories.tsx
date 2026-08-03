import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { LottieAnimation } from "./lottie-animation"

const meta: Meta<typeof LottieAnimation> = {
    title: "Integrations/Lottie/Lottie Animation",
    component: LottieAnimation,
    tags: ["autodocs"],
    argTypes: {
        name: {
            control: "select",
            options: ["Loading sand clock", "Cat playing animation"],
        },
        trigger: {
            control: "select",
            options: ["hover", "click", "loop", "autoplay", "scroll", "controlled"],
        },
        speed: {
            control: { type: "range", min: 0.1, max: 5, step: 0.1 },
        },
        reverseOnMouseLeave: {
            control: "boolean",
        },
    },
}

export default meta
type Story = StoryObj<typeof LottieAnimation>

export const DefaultLoop: Story = {
    args: {
        name: "Loading sand clock",
        trigger: "loop",
        speed: 1,
    },
    render: (args) => (
        <div className="flex flex-col items-center gap-4">
            <h3 className="text-sm text-muted-foreground w-full">Infinite Loop (Default)</h3>
            <div className="p-8 border border-border rounded-xl  flex items-center justify-center">
                <LottieAnimation {...args} className="w-24 h-24" />
            </div>
        </div>
    )
}

export const HoverInteraction: Story = {
    args: {
        name: "Loading sand clock",
        trigger: "hover",
        speed: 1.5,
        reverseOnMouseLeave: true,
    },
    render: (args) => (
        <div className="flex flex-col items-center gap-4">
            <h3 className="text-sm text-muted-foreground w-full">Hover to animate (Reverses on leave)</h3>
            <div className="p-8 border border-border rounded-xl flex items-center justify-center bg-muted/20">
                <LottieAnimation {...args} className="w-24 h-24" />
            </div>
            <p className="text-xs text-muted-foreground">Pasa el ratón por encima del componente.</p>
        </div>
    )
}

export const ClickInteraction: Story = {
    args: {
        name: "Loading sand clock",
        trigger: "click",
        speed: 1,
    },
    render: (args) => (
        <div className="flex flex-col items-center gap-4">
            <h3 className="text-sm text-muted-foreground w-full">Click to play once</h3>
            <div className="p-8 border border-border rounded-xl flex items-center justify-center">
                <LottieAnimation {...args} className="w-24 h-24" />
            </div>
            <p className="text-xs text-muted-foreground">Haz clic en la animación para reproducirla.</p>
        </div>
    )
}

export const ScrollInteraction: Story = {
    args: {
        name: "Loading sand clock",
        trigger: "scroll",
    },
    render: (args) => (
        <div className="flex flex-col items-center gap-4 w-full">
            <h3 className="text-sm text-muted-foreground w-full">Scroll to animate</h3>
            <p className="text-xs text-muted-foreground mb-8">
                Haz scroll hacia abajo para revelar la animación y ver cómo retrocede/avanza con el movimiento.
            </p>

            {/* Spacer para forzar el scroll */}
            <div className="h-[60vh] w-full border border-dashed border-border flex items-center justify-center rounded-xl bg-muted/10">
                <span className="text-muted-foreground text-sm">Contenido de relleno (Haz scroll) ↓</span>
            </div>

            <div className="p-8 border border-border rounded-xl flex items-center justify-center bg-muted/20 my-16">
                <LottieAnimation {...args} className="w-48 h-48" />
            </div>

            <div className="h-[60vh] w-full border border-dashed border-border flex items-center justify-center rounded-xl bg-muted/10">
                <span className="text-muted-foreground text-sm">Fin del contenido</span>
            </div>
        </div>
    )
}
