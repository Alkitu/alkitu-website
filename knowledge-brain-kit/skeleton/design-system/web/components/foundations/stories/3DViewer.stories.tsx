import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useMemo } from 'react';
import ModelViewer from '~/components/integrations/model-staging/model-viewer/model-viewer';
import { Input } from '~/components/primitives/input';

const meta: Meta = {
    title: 'Foundations/3D Viewer Gallery',
    parameters: {
        layout: 'padded',
    },
};

export default meta;

// Extraemos las rutas de los modelos 3D directamente usando Vite.
// Retorna las URLs que el navegador puede cargar para Three.js.
const customModelsGlob = import.meta.glob('../model-viewer/*.{glb,gltf}', {
    eager: true,
    query: '?url',
    import: 'default'
}) as Record<string, string>;

const allModels = Object.entries(customModelsGlob).map(([path, url]) => {
    const name = path.split('/').pop()?.replace(/\.(glb|gltf)$/, '') || 'unknown';
    return { name, url };
});

const ModelSample = ({ name, url, environment }: { name: string, url: string, environment: any }) => (
    <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors h-[250px] relative group border-border overflow-hidden">
        {/* Usamos el ModelViewer real pero con controles limitados para no sobrecargar la galería y en una escala menor */}
        <div className="w-full h-full pointer-events-none group-hover:pointer-events-auto">
            <ModelViewer
                modelPath={url}
                scale={1}
                autoRotate={true}
                autoRotateSpeed={1}
                environment={environment}
                shadows={false}
                className="min-h-0"
            />
        </div>

        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-background to-transparent pt-6">
            <span className="block text-xs text-foreground font-mono text-center truncate px-1">
                {name}
            </span>
        </div>
    </div>
);

const AllModels = () => {
    const [search, setSearch] = useState('');
    const [environment, setEnvironment] = useState<string>('studio');

    const filteredModels = useMemo(() => {
        if (!search) return allModels;
        return allModels.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }, [search]);

    return (
        <div className="space-y-8 w-full max-w-6xl mx-auto py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">3D Model Gallery</h1>
                    <p className="text-muted-foreground mt-2 text-sm leading-snug max-w-2xl">
                        Estos modelos 3D se **auto-descubren** en tiempo real al soltar archivos `.glb` o `.gltf` en la carpeta `components/foundations/model-viewer`.<br />
                        <span className="text-primary font-medium">Nota:</span> Se renderizan en vivo usando `@react-three/fiber`. Haz hover sobre ellos para poder rotarlos manualmente.
                    </p>
                </div>
                <div className="flex gap-4 items-center shrink-0">
                    <select
                        className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
                        value={environment}
                        onChange={(e) => setEnvironment(e.target.value)}
                    >
                        <option value="studio">Entorno: Studio</option>
                        <option value="city">Entorno: City</option>
                        <option value="warehouse">Entorno: Warehouse</option>
                        <option value="dawn">Entorno: Dawn</option>
                        <option value="night">Entorno: Night</option>
                    </select>
                    <Input
                        type="search"
                        placeholder="Buscar modelo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-[250px]"
                    />
                </div>
            </div>

            <div className="flex justify-between items-center text-sm text-muted-foreground border-b pb-4">
                <p>Mostrando {filteredModels.length} modelos</p>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-primary/20 border border-primary/50"></span>
                        <span>Auto-descubiertos</span>
                    </div>
                </div>
            </div>

            {filteredModels.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredModels.map(item => (
                        <ModelSample key={item.name} name={item.name} url={item.url} environment={environment as any} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                    No se encontraron modelos 3D en la carpeta o que coincidan con "{search}"
                </div>
            )}
        </div>
    );
};

export const Gallery: StoryObj = {
    render: () => <AllModels />
};
