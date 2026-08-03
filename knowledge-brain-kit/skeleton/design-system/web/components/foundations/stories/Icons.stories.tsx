import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Input } from '~/components/primitives/input';
import { Button } from '~/components/primitives/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Load custom SVGs from components/foundations/icons
// Vite glob import for SVGR
const customIconsGlob = import.meta.glob('../icons/*.svg', {
    query: '?react',
    eager: true
});

const customIcons = Object.entries(customIconsGlob).map(([path, mod]: [string, any]) => {
    const name = path.split('/').pop()?.replace('.svg', '') || 'unknown';
    const Component = mod.default || mod;
    return { name, component: Component as React.ElementType };
});

const IconSample = ({ name, icon: Icon, isCustom = false }: { name: string; icon: any; isCustom?: boolean }) => (
    <div className={`flex flex-col items-center justify-center gap-3 p-4 rounded-lg border bg-card transition-colors h-32 relative group ${isCustom ? 'border-primary/20 bg-primary/5 hover:bg-primary/10' : 'border-border hover:bg-muted/50'}`}>
        <Icon className="h-8 w-8 text-foreground" />
        <span className="text-[10px] text-muted-foreground font-mono text-center break-all px-1">
            {name}
        </span>
        {isCustom && <span className="absolute top-2 right-2 text-[8px] font-bold text-primary opacity-50">CUSTOM</span>}
    </div>
);

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void
}) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 py-4">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground font-mono">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};

const AllIcons = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 100;

    // Filter Lucide icons
    const filteredLucideIcons = useMemo(() => {
        const iconList = Object.entries(LucideIcons)
            .filter(([name, component]: [string, any]) => {
                if (!/^[A-Z]/.test(name)) return false;
                if (name === 'createLucideIcon' || name === 'Icon' || name === 'LucideIcon') return false;
                return typeof component === 'function' || (typeof component === 'object' && component !== null);
            })
            .sort(([a], [b]) => a.localeCompare(b));

        if (!search) return iconList;
        return iconList.filter(([name]) => name.toLowerCase().includes(search.toLowerCase()));
    }, [search]);

    // Filter Custom icons
    const filteredCustomIcons = useMemo(() => {
        if (!search) return customIcons;
        return customIcons.filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()));
    }, [search]);

    // Reset pagination on search
    useMemo(() => setPage(1), [search]);

    // Pagination Logic for Lucide
    const totalPages = Math.ceil(filteredLucideIcons.length / ITEMS_PER_PAGE);
    const displayedLucideIcons = filteredLucideIcons.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Header & Instructions */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Icon System</h2>
                    <p className="text-muted-foreground">
                        Unified directory of <strong>Custom Assets</strong> and <strong>Lucide React</strong> icons.
                    </p>
                </div>

                <div className="p-4 bg-muted/30 border border-border rounded-lg space-y-2">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        How to add Custom Icons
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                        <li>
                            Drop your SVG files into: <code className="bg-muted px-1 py-0.5 rounded font-mono text-foreground">components/foundations/icons/</code>
                        </li>
                        <li>
                            <strong>Requirements:</strong> 24x24px viewBox (recommended), <code className="text-xs">currentColor</code> for fill/stroke to inherit theme colors.
                        </li>
                        <li>
                            <strong>Usage:</strong> The system automatically registers the file. Use filename as component name (e.g., <code className="text-xs">logo-brand.svg</code> → <code className="text-xs">LogoBrand</code>).
                        </li>
                    </ul>
                </div>

                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b border-border">
                    <Input
                        placeholder="Search all icons..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                </div>
            </div>

            {/* Custom Icons Section */}
            {filteredCustomIcons.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground border-b border-border pb-2 flex items-center justify-between">
                        Custom Icons
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-mono">
                            {filteredCustomIcons.length}
                        </span>
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                        {filteredCustomIcons.map(({ name, component }) => (
                            <IconSample key={name} name={name} icon={component} isCustom />
                        ))}
                    </div>
                </div>
            )}

            {/* Lucide Icons Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground border-b border-border pb-2 flex items-center justify-between">
                    Lucide Library
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full font-mono">
                        {filteredLucideIcons.length}
                    </span>
                </h3>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 min-h-[500px]">
                    {displayedLucideIcons.map(([name, Icon]) => (
                        <IconSample key={name} name={name} icon={Icon} />
                    ))}
                    {displayedLucideIcons.length === 0 && (
                        <div className="col-span-full py-12 text-center text-muted-foreground">
                            No Lucide icons found for "{search}"
                        </div>
                    )}
                </div>

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
};

const meta: Meta = {
    title: 'Foundations/Icons',
    component: AllIcons,
    parameters: {
        layout: 'padded',
        controls: { hideNoControlsWarning: true },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Library: Story = {
    render: () => <AllIcons />,
};
