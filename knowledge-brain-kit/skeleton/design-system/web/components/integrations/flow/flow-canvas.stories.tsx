import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FlowCanvas } from "./flow-canvas";
import type { Node, Edge } from "@xyflow/react";

const meta = {
  title: "Integrations/Flow/FlowCanvas",
  component: FlowCanvas,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    showBackground: { control: "boolean" },
    showControls: { control: "boolean" },
    showMiniMap: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ height: "80vh", width: "100%" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FlowCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 100, y: 100 },
    data: { label: "Trigger" },
    type: "input",
  },
  {
    id: "2",
    position: { x: 350, y: 100 },
    data: { label: "Transform" },
  },
  {
    id: "3",
    position: { x: 600, y: 100 },
    data: { label: "Output" },
    type: "output",
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3" },
];

export const Default: Story = {
  args: {
    defaultNodes: initialNodes,
    defaultEdges: initialEdges,
    showBackground: true,
    showControls: true,
    showMiniMap: false,
  },
};

export const WithMiniMap: Story = {
  args: {
    ...Default.args,
    showMiniMap: true,
  },
};

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    nodesDraggable: false,
    nodesConnectable: false,
    elementsSelectable: false,
  },
};
