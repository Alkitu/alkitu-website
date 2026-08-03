"use client";

import { Heart, Mail, Plus, Settings, Trash2, User } from "lucide-react";

import { Button } from "~/components/primitives/button";
import { LinkButton } from "~/components/primitives/link-button";
import { Input } from "~/components/primitives/input";
import { Textarea } from "~/components/primitives/textarea";
import { Label } from "~/components/primitives/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/primitives/card";
import { Badge } from "~/components/primitives/badge";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/primitives/avatar";
import { Separator } from "~/components/primitives/separator";
import { Spinner } from "~/components/primitives/spinner";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl space-y-12 p-8 pb-24">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Design System — Phase 1
        </h1>
        <p className="text-lg text-muted-foreground">
          [Brand] Component Library • 12 Core Components
        </p>
      </header>

      <Separator />

      {/* ===== BUTTON ===== */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><Plus /></Button>
        </div>
        <div className="flex items-center gap-3">
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <Separator />

      {/* ===== ICON BUTTON ===== */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Icon Button</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="icon"><Settings /></Button>
          <Button size="icon" variant="outline"><Heart /></Button>
          <Button size="icon" variant="ghost"><Mail /></Button>
          <Button size="icon" variant="secondary"><User /></Button>
          <Button size="icon" variant="destructive"><Trash2 /></Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="icon" className="h-8 w-8"><Settings /></Button>
          <Button size="icon"><Settings /></Button>
          <Button size="icon" className="h-12 w-12"><Settings /></Button>
        </div>
      </section>

      <Separator />

      {/* ===== LINK BUTTON ===== */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Link Button</h2>
        <div className="flex flex-wrap items-center gap-3">
          <LinkButton href="#">Internal Link</LinkButton>
          <LinkButton href="https://example.com" external>
            External Link
          </LinkButton>
          <LinkButton href="#" variant="outline">
            Outline Link
          </LinkButton>
        </div>
      </section>

      <Separator />

      {/* ===== INPUT ===== */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Input</h2>
        <div className="grid max-w-md gap-4">
          <Input type="text" placeholder="Default input" />
          <Input type="email" placeholder="Email input" />
          <Input type="password" placeholder="Password input" />
          <Input disabled placeholder="Disabled input" />
        </div>
      </section>

      <Separator />

      {/* ===== TEXTAREA ===== */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Textarea</h2>
        <div className="max-w-md">
          <Textarea placeholder="Type your message here..." />
        </div>
      </section>

      <Separator />

      {/* ===== LABEL ===== */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Label</h2>
        <div className="grid max-w-md gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Tell us about yourself" />
          </div>
        </div>
      </section>

      <Separator />

      {/* ===== CARD ===== */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Card</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Card content with some example text.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                You have 3 unread messages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge>New</Badge>
                <span className="text-sm">Meeting at 2pm</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Update</Badge>
                <span className="text-sm">System updated</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* ===== BADGE ===== */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Badge</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      <Separator />

      {/* ===== AVATAR ===== */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Avatar</h2>
        <div className="flex items-center gap-4">
          <Avatar size="sm">
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>LK</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>LG</AvatarFallback>
          </Avatar>
          <Avatar size="xl">
            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
            <AvatarFallback>XL</AvatarFallback>
          </Avatar>
        </div>
      </section>

      <Separator />

      {/* ===== SEPARATOR ===== */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Separator</h2>
        <div>
          <p className="text-sm">Above separator</p>
          <Separator className="my-4" />
          <p className="text-sm">Below separator</p>
        </div>
        <div className="flex h-5 items-center gap-4 text-sm">
          <span>Left</span>
          <Separator orientation="vertical" />
          <span>Center</span>
          <Separator orientation="vertical" />
          <span>Right</span>
        </div>
      </section>

      <Separator />

      {/* ===== SPINNER ===== */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Spinner</h2>
        <div className="flex items-center gap-6">
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
          <Spinner size="xl" />
        </div>
      </section>
    </main>
  );
}
