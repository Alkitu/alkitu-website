import type { Meta, StoryObj } from "@storybook/react";
import { AutosizeTextarea } from "./autosize-textarea";

const meta: Meta<typeof AutosizeTextarea> = {
  title: "Primitives/Autosize Textarea",
  component: AutosizeTextarea,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    minRows: { control: "number" },
    maxRows: { control: "number" },
  },
  args: {
    placeholder: "Type something...",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof AutosizeTextarea>;

export const Default: Story = {};

export const WithMinRows: Story = {
  args: {
    minRows: 4,
    placeholder: "At least 4 rows tall",
  },
};

export const WithMaxRows: Story = {
  args: {
    minRows: 2,
    maxRows: 6,
    placeholder: "Grows up to 6 rows",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "This textarea is disabled",
  },
};
