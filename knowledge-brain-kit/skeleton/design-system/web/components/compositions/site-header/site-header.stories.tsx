import type { Meta, StoryObj } from "@storybook/react";
import { SiteHeader } from "./site-header";

const meta: Meta<typeof SiteHeader> = {
  title: "Compositions/SiteHeader",
  component: SiteHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof SiteHeader>;

export const Default: Story = {};

export const NavPersonalizada: Story = {
  args: {
    nav: [
      { href: "/blog", label: "Blog" },
      { href: "/wiki", label: "Wiki" },
    ],
  },
};
