import type { Meta, StoryObj } from "@storybook/react";
import { BubbleMenu } from "./bubble-menu";
import { Home, Settings, User, Mail, Plus, X } from "lucide-react";

const meta: Meta<typeof BubbleMenu> = {
  title: "Showcase/Animations/Bubble Menu",
  component: BubbleMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    menuRadius: {
      control: { type: "range", min: 40, max: 150, step: 10 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BubbleMenu>;

const defaultItems = [
  { icon: <Home className="h-5 w-5" />, label: "Home" },
  { icon: <User className="h-5 w-5" />, label: "Profile" },
  { icon: <Mail className="h-5 w-5" />, label: "Messages" },
  { icon: <Settings className="h-5 w-5" />, label: "Settings" },
];

export const Default: Story = {
  args: {
    items: defaultItems,
    icon: <Plus className="h-6 w-6" />,
    closeIcon: <X className="h-6 w-6" />,
  },
};

export const SmallRadius: Story = {
  args: {
    items: defaultItems,
    icon: <Plus className="h-6 w-6" />,
    closeIcon: <X className="h-6 w-6" />,
    menuRadius: 50,
  },
};

export const LargeRadius: Story = {
  args: {
    items: defaultItems,
    icon: <Plus className="h-6 w-6" />,
    closeIcon: <X className="h-6 w-6" />,
    menuRadius: 130,
  },
};

export const TwoItems: Story = {
  args: {
    items: [
      { icon: <Home className="h-5 w-5" />, label: "Home" },
      { icon: <Settings className="h-5 w-5" />, label: "Settings" },
    ],
    icon: <Plus className="h-6 w-6" />,
    closeIcon: <X className="h-6 w-6" />,
  },
};
