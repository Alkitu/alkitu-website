import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { useThemeEngine } from '../../theme-provider';

// Primitives
import { Button } from '../../primitives/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../primitives/card';
import { Badge } from '../../primitives/badge';
import { Input } from '../../primitives/input';
import { Label } from '../../primitives/label';
import { Switch } from '../../primitives/switch';
import { Separator } from '../../primitives/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../../primitives/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../primitives/tabs';
import { Progress } from '../../primitives/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../primitives/tooltip';
import { Checkbox } from '../../primitives/checkbox';
import { Slider } from '../../primitives/slider';
import { Typography } from '../../primitives/typography';

// Compositions
import { AlertCard } from '../../compositions/alert-card';
import { KpiCard } from '../../compositions/kpi-card';
import { PasswordStrengthIndicator } from '../../compositions/password-strength';

// Icons
import {
    Copy, Check, Layers, Palette, Type, RectangleHorizontal, Moon, Sun,
    ArrowRight, TrendingUp, Users, ShoppingCart, Activity, Star,
    Bell, Search, Settings, Mail, Heart, Zap, Shield, Globe
} from 'lucide-react';

// ─── Hero Section ─────────────────────────────────────────────────────────────
const HeroSection = () => (
    <section className="text-center space-y-4 pb-8">
        <Badge variant="outline" className="text-xs tracking-wider uppercase">
            v0.1.0
        </Badge>
        <h1 className="text-5xl font-black tracking-tight text-foreground">
            [Brand] Design System
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A unified component library with <strong>290+ components</strong> across primitives,
            compositions, patterns, showcase effects, and integrations — all controlled by a
            single theme configuration.
        </p>
        <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
            <Badge>67 Primitives</Badge>
            <Badge variant="secondary">14 Compositions</Badge>
            <Badge variant="outline">31 Patterns</Badge>
            <Badge variant="outline">119+ Showcase</Badge>
            <Badge variant="outline">28 Integrations</Badge>
        </div>
    </section>
);

// ─── Theme Config JSON ────────────────────────────────────────────────────────
const ThemeConfigSection = () => {
    const { themeConfig } = useThemeEngine();
    const [copied, setCopied] = React.useState(false);
    const configString = JSON.stringify(themeConfig, null, 2);

    const handleCopy = () => {
        navigator.clipboard.writeText(configString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="space-y-3">
            <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight">Active Theme Configuration</h2>
            </div>
            <p className="text-sm text-muted-foreground">
                Use the Storybook toolbar above to change the theme in real time. Copy the JSON to apply it in your app.
            </p>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">ThemeConfig JSON</CardTitle>
                        <Button variant="outline" size="sm" onClick={handleCopy} iconLeft={copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}>
                            {copied ? 'Copied' : 'Copy'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <pre className="p-4 rounded-md bg-muted font-mono text-xs overflow-auto leading-relaxed">
                        {configString}
                    </pre>
                </CardContent>
            </Card>
        </section>
    );
};

// ─── Semantic Tokens ──────────────────────────────────────────────────────────
const SemanticTokensSection = () => {
    const tokens = [
        { name: 'Background', bg: 'bg-background', fg: 'text-foreground' },
        { name: 'Card', bg: 'bg-card', fg: 'text-card-foreground' },
        { name: 'Muted', bg: 'bg-muted', fg: 'text-muted-foreground' },
        { name: 'Primary', bg: 'bg-primary', fg: 'text-primary-foreground' },
        { name: 'Secondary', bg: 'bg-secondary', fg: 'text-secondary-foreground' },
        { name: 'Accent', bg: 'bg-accent', fg: 'text-accent-foreground' },
        { name: 'Destructive', bg: 'bg-destructive', fg: 'text-destructive-foreground' },
    ];

    return (
        <section className="space-y-3">
            <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight">Semantic Color Tokens</h2>
            </div>
            <p className="text-sm text-muted-foreground">
                Every component references these tokens. Change the brand color in the toolbar and watch them all update.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {tokens.map((t) => (
                    <div key={t.name} className={`p-4 rounded-md border ${t.bg} ${t.fg} text-center text-sm font-medium`}>
                        {t.name}
                    </div>
                ))}
            </div>
        </section>
    );
};

// ─── Button Variants ──────────────────────────────────────────────────────────
const ButtonsSection = () => (
    <section className="space-y-3">
        <div className="flex items-center gap-2">
            <RectangleHorizontal className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Buttons</h2>
        </div>
        <p className="text-sm text-muted-foreground">
            All variants respect <code className="text-xs bg-muted px-1 py-0.5 rounded">rounded-md</code> from your radius setting and <code className="text-xs bg-muted px-1 py-0.5 rounded">bg-primary</code> from your brand color.
        </p>
        <Card>
            <CardContent className="pt-6 space-y-4">
                <div className="flex flex-wrap gap-3">
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="link">Link</Button>
                </div>
                <Separator />
                <div className="flex flex-wrap gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon" iconOnly><Heart className="h-4 w-4" /></Button>
                </div>
                <Separator />
                <div className="flex flex-wrap gap-3">
                    <Button iconLeft={<Zap className="h-4 w-4" />}>With Icon</Button>
                    <Button loading>Loading</Button>
                    <Button disabled>Disabled</Button>
                    <Button fullWidth iconLeft={<ArrowRight className="h-4 w-4" />}>Full Width</Button>
                </div>
            </CardContent>
        </Card>
    </section>
);

// ─── Form Elements ────────────────────────────────────────────────────────────
const FormsSection = () => {
    const [password, setPassword] = React.useState('Str0ng!');
    const [progress, setProgress] = React.useState(65);

    return (
        <section className="space-y-3">
            <div className="flex items-center gap-2">
                <Type className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight">Form Elements & Inputs</h2>
            </div>
            <p className="text-sm text-muted-foreground">
                Inputs, labels, switches, checkboxes, sliders — all inherit the active radius and color tokens.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Text Inputs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="you@company.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pw">Password</Label>
                            <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <PasswordStrengthIndicator password={password} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="flex items-center justify-between">
                            <Label>Enable notifications</Label>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="terms" defaultChecked />
                            <Label htmlFor="terms" className="text-sm">Accept terms and conditions</Label>
                        </div>
                        <div className="space-y-2">
                            <Label>Progress ({progress}%)</Label>
                            <Progress value={progress} />
                            <Slider defaultValue={[progress]} max={100} step={1} onValueChange={(v) => setProgress(v[0])} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

// ─── Cards & Compositions ─────────────────────────────────────────────────────
const CompositionsSection = () => (
    <section className="space-y-3">
        <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Cards & Compositions</h2>
        </div>
        <p className="text-sm text-muted-foreground">
            Compositions combine multiple primitives into higher-level UI. KPI cards, alerts, and data patterns all respond to the theme.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardDescription>Total Revenue</CardDescription>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-2xl tabular-nums">$45,231</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardDescription>Active Users</CardDescription>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-2xl tabular-nums">+2,350</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">+180 since last hour</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardDescription>Sales</CardDescription>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-2xl tabular-nums">+12,234</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">+19% from last month</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardDescription>Active Now</CardDescription>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-2xl tabular-nums">+573</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">+201 since last hour</p>
                </CardContent>
            </Card>
        </div>
    </section>
);

// ─── Tabs & Interactive ───────────────────────────────────────────────────────
const InteractiveSection = () => (
    <section className="space-y-3">
        <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Interactive Patterns</h2>
        </div>
        <p className="text-sm text-muted-foreground">
            Tabs, avatars, tooltips, badges — all adapt to the current configuration.
        </p>
        <Card>
            <CardContent className="pt-6">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="team">Team</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4 pt-4">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                <Avatar className="border-2 border-background h-9 w-9">
                                    <AvatarImage src="/gallery/avatar-01-woman.png" />
                                    <AvatarFallback>AK</AvatarFallback>
                                </Avatar>
                                <Avatar className="border-2 border-background h-9 w-9">
                                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">JD</AvatarFallback>
                                </Avatar>
                                <Avatar className="border-2 border-background h-9 w-9">
                                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">MR</AvatarFallback>
                                </Avatar>
                            </div>
                            <span className="text-sm text-muted-foreground">3 members online</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge className="cursor-help"><Star className="h-3 w-3 mr-1" />Featured</Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>This is a tooltip</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Badge variant="secondary"><Bell className="h-3 w-3 mr-1" />3 Notifications</Badge>
                            <Badge variant="outline"><Shield className="h-3 w-3 mr-1" />Secure</Badge>
                            <Badge variant="destructive"><Mail className="h-3 w-3 mr-1" />2 Unread</Badge>
                        </div>
                    </TabsContent>
                    <TabsContent value="team" className="pt-4">
                        <div className="space-y-3">
                            {[
                                { name: 'Sarah Johnson', role: 'Lead Designer', initials: 'SJ' },
                                { name: 'Alex Rivera', role: 'Frontend Dev', initials: 'AR' },
                                { name: 'Jordan Chen', role: 'Backend Dev', initials: 'JC' },
                            ].map((m) => (
                                <div key={m.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="text-xs">{m.initials}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{m.name}</p>
                                            <p className="text-xs text-muted-foreground">{m.role}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">View</Button>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="settings" className="pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Dark mode</p>
                                <p className="text-xs text-muted-foreground">Toggle via the toolbar above</p>
                            </div>
                            <div className="flex gap-1">
                                <Sun className="h-4 w-4 text-muted-foreground" />
                                <Moon className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Email notifications</p>
                                <p className="text-xs text-muted-foreground">Receive weekly digests</p>
                            </div>
                            <Switch />
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </section>
);

// ─── Architecture Summary ─────────────────────────────────────────────────────
const ArchitectureSection = () => (
    <section className="space-y-3">
        <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Architecture</h2>
        </div>
        <p className="text-sm text-muted-foreground">
            A strict layered hierarchy. Dependencies only flow downward — primitives never import from compositions.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
                { layer: 'Capa 1', name: 'Primitives', count: 67, desc: 'Button, Input, Card, Dialog, Select, Table...', color: 'border-primary/50 bg-primary/5' },
                { layer: 'Capa 2', name: 'Compositions', count: 14, desc: 'DataTable, Combobox, DatePicker, Sidebar...', color: 'border-primary/30 bg-primary/5' },
                { layer: 'Capa 3', name: 'Patterns', count: 31, desc: 'SidebarApp, AuthCard, DynamicForm...', color: 'border-primary/20 bg-primary/5' },
                { layer: 'Aislados', name: 'Showcase + Integrations', count: 147, desc: 'Animations, Maps, 3D, Video, Email...', color: 'border-border bg-muted/50' },
            ].map((l) => (
                <Card key={l.name} className={l.color}>
                    <CardHeader>
                        <CardDescription className="text-xs uppercase tracking-wider">{l.layer}</CardDescription>
                        <CardTitle className="text-lg">{l.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-black tabular-nums text-primary">{l.count}</p>
                        <p className="text-xs text-muted-foreground mt-1">{l.desc}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    </section>
);

// ─── Footer ───────────────────────────────────────────────────────────────────
const FooterSection = () => (
    <footer className="text-center py-8 border-t border-border space-y-2">
        <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">@brain/design-system</strong> &middot; Next.js 16 &middot; React 19 &middot; Tailwind v4 &middot; TypeScript 5
        </p>
        <p className="text-xs text-muted-foreground">
            Radix UI &middot; Framer Motion &middot; GSAP &middot; Three.js &middot; MapLibre &middot; Remotion &middot; React Email
        </p>
    </footer>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const DesignSystemOverview = () => (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <HeroSection />
        <Separator />
        <ThemeConfigSection />
        <Separator />
        <SemanticTokensSection />
        <Separator />
        <ButtonsSection />
        <Separator />
        <FormsSection />
        <Separator />
        <CompositionsSection />
        <Separator />
        <InteractiveSection />
        <Separator />
        <ArchitectureSection />
        <FooterSection />
    </div>
);

// ─── Storybook Meta ───────────────────────────────────────────────────────────
const meta: Meta = {
    title: 'Foundations/Design System Overview',
    component: DesignSystemOverview,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
    render: () => <DesignSystemOverview />,
};
