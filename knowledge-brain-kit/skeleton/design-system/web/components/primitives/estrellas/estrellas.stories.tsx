import type { Meta, StoryObj } from "@storybook/react";
import { Estrellas } from "./estrellas";

const meta: Meta<typeof Estrellas> = {
  title: "Primitives/Estrellas",
  component: Estrellas,
  tags: ["autodocs"],
  args: { rating: 4.5 },
};
export default meta;
type Story = StoryObj<typeof Estrellas>;

export const Media: Story = { args: { rating: 4.5 } };
export const Completa: Story = { args: { rating: 5 } };
export const Baja: Story = { args: { rating: 2.5 } };
export const Grande: Story = { args: { rating: 4, size: "md" } };
