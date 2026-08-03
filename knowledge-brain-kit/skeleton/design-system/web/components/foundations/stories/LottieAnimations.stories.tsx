import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useMemo } from 'react';
import { LottieAnimation } from '~/components/integrations/lottie/lottie-animation/lottie-animation';
import { Input } from '~/components/primitives/input';

const meta: Meta = {
    title: 'Foundations/Lottie Animations',
    parameters: {
        layout: 'padded',
    },
};

export default meta;

// Extraemos los JSON directamente usando Vite, esto hace auto-HMR en Storybook sin reiniciar!
const customLottiesGlob = import.meta.glob('../lottie/animations/*.json', {
    eager: true,
    import: 'default'
});

const allLotties = Object.entries(customLottiesGlob).map(([path, data]) => {
    const name = path.split('/').pop()?.replace('.json', '') || 'unknown';
    return { name, animationData: data };
});

const LottieSample = ({ name, animationData, trigger = "hover" }: { name: string, animationData: any, trigger: "hover" | "loop" }) => (
    <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors h-40 relative group border-border">
        <LottieAnimation animationData={animationData} trigger={trigger} className="w-16 h-16" reverseOnMouseLeave={true} />
        <span className="text-[10px] text-muted-foreground font-mono text-center break-all px-1">
            {name}
        </span>
    </div>
);

const AllAnimations = () => {
    const [search, setSearch] = useState('');
    const [triggerMode, setTriggerMode] = useState<"hover" | "loop">("hover");

    const filteredAnimations = useMemo(() => {
        if (!search) return allLotties;
        return allLotties.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }, [search]);

    return (
        <div className="space-y-8 w-full max-w-6xl mx-auto py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Custom Lottie Animations</h1>
                    <p className="text-muted-foreground mt-2 text-sm leading-snug max-w-2xl">
                        Estas animaciones se **auto-descubren** en tiempo real al soltar `.json` en `components/foundations/lottie/animations` (gracias al Vite HMR en Storybook).<br />
                        <span className="text-primary font-medium">Nota:</span> Para usar estos nombres (ej. `name="bola"`) en tu código Next.js y obtener autocompletado, recuerda ejecutar `npm run sync:lotties` en tu terminal.
                    </p>
                </div>
                <div className="flex gap-4 items-center shrink-0">
                    <select
                        className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
                        value={triggerMode}
                        onChange={(e) => setTriggerMode(e.target.value as "hover" | "loop")}
                    >
                        <option value="hover">Modo Hover</option>
                        <option value="loop">Modo Loop Infinito</option>
                    </select>
                    <Input
                        type="search"
                        placeholder="Buscar animación..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-[250px]"
                    />
                </div>
            </div>

            <div className="flex justify-between items-center text-sm text-muted-foreground border-b pb-4">
                <p>Showing {filteredAnimations.length} animations</p>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-primary/20 border border-primary/50"></span>
                        <span>Auto-descubiertos</span>
                    </div>
                </div>
            </div>

            {filteredAnimations.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {filteredAnimations.map(item => (
                        <LottieSample key={item.name} name={item.name} animationData={item.animationData} trigger={triggerMode} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                    No se encontraron animaciones que coincidan con "{search}"
                </div>
            )}
        </div>
    );
};

export const Gallery: StoryObj = {
    render: () => <AllAnimations />
};
