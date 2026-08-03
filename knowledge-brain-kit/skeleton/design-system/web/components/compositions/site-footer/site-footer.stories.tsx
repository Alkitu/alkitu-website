import type { Meta, StoryObj } from "@storybook/react";
import { SiteFooter } from "./site-footer";

const meta: Meta<typeof SiteFooter> = {
  title: "Compositions/SiteFooter",
  component: SiteFooter,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Default: StoryObj<typeof SiteFooter> = {};
