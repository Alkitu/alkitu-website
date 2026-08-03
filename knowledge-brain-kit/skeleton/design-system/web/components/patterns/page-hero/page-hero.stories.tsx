import type { Meta, StoryObj } from "@storybook/react";
import { PageHero } from "./page-hero";

const meta: Meta<typeof PageHero> = {
  title: "Patterns/PageHero",
  component: PageHero,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof PageHero>;

export const Blog: Story = {
  args: {
    title: "Blog",
    titleClassName: "leading-[0.9] tracking-[-0.03em] text-[clamp(3rem,9vw,7rem)] md:col-span-7",
    leadClassName: "md:col-span-5 md:pb-3",
    lead: "Notas sobre marca, especificación y diseño de producto.",
  },
};

export const Casos: Story = {
  args: {
    title: "Casos de estudio",
    className: "pb-24 pt-32 md:pb-32 md:pt-44",
    gridClassName: "gap-12",
    titleClassName: "leading-[0.95] tracking-[-0.035em] text-[clamp(2.6rem,8vw,7rem)] md:col-span-9",
    leadClassName: "md:col-span-3 md:pb-4",
    lead: "Proyectos donde marca, especificación y código se comportan como un solo sistema.",
  },
};
