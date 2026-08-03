import type { Meta, StoryObj } from "@storybook/react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../card"
import { Button } from "../button"
import { Input } from "../input"
import { Label } from "../label"
import { AppWindowIcon, CodeIcon, HomeIcon, SearchIcon, SettingsIcon, MoreHorizontalIcon } from "lucide-react"

const meta: Meta<typeof Tabs> = {
    title: "Primitives/Tabs",
    component: Tabs,
    tags: ["autodocs"],
    argTypes: {
        orientation: {
            control: "radio",
            options: ["horizontal", "vertical"],
        },
    },
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
    render: (args) => (
        <Tabs defaultValue="account" className="w-[400px]" {...args}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>
                            Make changes to your account here. Click save when you're done.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" defaultValue="Pedro Duarte" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" defaultValue="@peduarte" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save changes</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="password">
                <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>
                            Change your password here. After saving, you'll be logged out.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="current">Current password</Label>
                            <Input id="current" type="password" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="new">New password</Label>
                            <Input id="new" type="password" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save password</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    ),
}

export const LineVariant: Story = {
    render: (args) => (
        <Tabs defaultValue="account" className="w-[400px]" {...args}>
            <TabsList variant="line" className="w-full justify-start border-b rounded-none px-0">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="p-4 pt-6">
                Account content goes here.
            </TabsContent>
            <TabsContent value="password" className="p-4 pt-6">
                Password content goes here.
            </TabsContent>
            <TabsContent value="settings" className="p-4 pt-6">
                Settings content goes here.
            </TabsContent>
        </Tabs>
    ),
}

export const WithIcons: Story = {
    render: (args) => (
        <Tabs defaultValue="preview" className="w-[300px]" {...args}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview" className="gap-2">
                    <AppWindowIcon className="size-4" />
                    Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="gap-2">
                    <CodeIcon className="size-4" />
                    Code
                </TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="p-4 pt-6 text-sm text-muted-foreground border rounded-lg mt-2">
                Preview mode active.
            </TabsContent>
            <TabsContent value="code" className="p-4 pt-6 text-sm text-muted-foreground border rounded-lg mt-2 font-mono">
                {'<CodeBlock />'}
            </TabsContent>
        </Tabs>
    ),
}

export const IconOnly: Story = {
    render: (args) => (
        <Tabs defaultValue="home" className="w-fit" {...args}>
            <TabsList>
                <TabsTrigger value="home" className="px-3" aria-label="Home">
                    <HomeIcon className="size-4" />
                </TabsTrigger>
                <TabsTrigger value="search" className="px-3" aria-label="Search">
                    <SearchIcon className="size-4" />
                </TabsTrigger>
                <TabsTrigger value="settings" className="px-3" aria-label="Settings">
                    <SettingsIcon className="size-4" />
                </TabsTrigger>
            </TabsList>
            <TabsContent value="home" className="p-4 pt-6 text-sm text-muted-foreground border rounded-lg mt-2">
                Home content
            </TabsContent>
            <TabsContent value="search" className="p-4 pt-6 text-sm text-muted-foreground border rounded-lg mt-2">
                Search content
            </TabsContent>
            <TabsContent value="settings" className="p-4 pt-6 text-sm text-muted-foreground border rounded-lg mt-2">
                Settings content
            </TabsContent>
        </Tabs>
    ),
}

export const LineDisabled: Story = {
    render: (args) => (
        <Tabs defaultValue="overview" className="w-[400px]" {...args}>
            <TabsList variant="line" className="w-full justify-start border-b rounded-none px-0 gap-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="p-4 pt-6 text-sm text-muted-foreground">
                Overview metrics
            </TabsContent>
            <TabsContent value="analytics" className="p-4 pt-6 text-sm text-muted-foreground">
                Detailed analytics
            </TabsContent>
            <TabsContent value="reports" className="p-4 pt-6 text-sm text-muted-foreground">
                Available reports
            </TabsContent>
        </Tabs>
    ),
}

export const WithDropdown: Story = {
    render: (args) => (
        <div className="w-[500px]">
            <Tabs defaultValue="overview" {...args}>
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                    </TabsList>
                    <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon className="size-4" />
                    </Button>
                </div>
                <TabsContent value="overview" className="p-4 mt-2 text-sm border rounded-lg">
                    View your dashboard metrics and key performance indicators.
                </TabsContent>
                <TabsContent value="analytics" className="p-4 mt-2 text-sm border rounded-lg">
                    Dive deep into your traffic and conversion data.
                </TabsContent>
                <TabsContent value="reports" className="p-4 mt-2 text-sm border rounded-lg">
                    Download and schedule customized reports.
                </TabsContent>
            </Tabs>
        </div>
    ),
}

export const Vertical: Story = {
    render: (args) => (
        <div className="w-[500px]">
            <Tabs defaultValue="account" orientation="vertical" className="flex gap-4" {...args}>
                <TabsList className="flex flex-col h-auto bg-muted p-1 items-stretch justify-start min-w-[120px]">
                    <TabsTrigger value="account" className="justify-start px-3 py-1.5 whitespace-nowrap">Account</TabsTrigger>
                    <TabsTrigger value="password" className="justify-start px-3 py-1.5 whitespace-nowrap">Password</TabsTrigger>
                    <TabsTrigger value="notifications" className="justify-start px-3 py-1.5 whitespace-nowrap">Notifications</TabsTrigger>
                </TabsList>
                <div className="flex-1">
                    <TabsContent value="account" className="mt-0 border rounded-lg p-6 text-sm h-full">
                        Manage your account preferences and profile information.
                    </TabsContent>
                    <TabsContent value="password" className="mt-0 border rounded-lg p-6 text-sm h-full">
                        Update your password and security settings.
                    </TabsContent>
                    <TabsContent value="notifications" className="mt-0 border rounded-lg p-6 text-sm h-full">
                        Configure how you receive alerts and emails.
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
