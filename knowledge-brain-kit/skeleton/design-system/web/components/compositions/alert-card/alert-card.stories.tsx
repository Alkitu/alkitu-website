import type { Meta, StoryObj } from "@storybook/react";
import { AlertCard } from "./alert-card";

const meta: Meta<typeof AlertCard> = {
  title: "Compositions/Alert Card",
  component: AlertCard,
  tags: ["autodocs"],
  argTypes: {
    severity: {
      control: "select",
      options: ["urgent", "warning", "info"],
      description: "Severity level of the alert",
    },
    title: { control: "text" },
    description: { control: "text" },
    timestamp: { control: "text" },
  },
  args: {
    severity: "warning",
    title: "Pending invoice",
    description: "Invoice #1234 is overdue by 3 days",
    timestamp: "2 hours ago",
  },
};

export default meta;
type Story = StoryObj<typeof AlertCard>;

export const Default: Story = {};

export const Urgent: Story = {
  args: {
    severity: "urgent",
    title: "Vehicle not collected",
    description: "BMW X3 has been ready for pickup for 48+ hours",
    timestamp: "5 min ago",
  },
};

export const Warning: Story = {
  args: {
    severity: "warning",
    title: "Pending invoice",
    description: "Invoice #1234 is overdue by 3 days",
    timestamp: "2 hours ago",
  },
};

export const Info: Story = {
  args: {
    severity: "info",
    title: "New booking",
    description: "Customer scheduled a full detail for tomorrow",
    timestamp: "1 hour ago",
  },
};

export const List: Story = {
  render: () => (
    <div className="flex flex-col gap-2 max-w-lg">
      <AlertCard
        severity="urgent"
        title="Vehicle not collected"
        description="BMW X3 has been ready for pickup for 48+ hours"
        timestamp="5 min ago"
        onClick={() => alert("Navigate to vehicle details")}
      />
      <AlertCard
        severity="warning"
        title="Pending invoice"
        description="Invoice #1234 is overdue by 3 days"
        timestamp="2 hours ago"
        onClick={() => alert("Navigate to invoice")}
      />
      <AlertCard
        severity="info"
        title="New booking received"
        description="Customer scheduled a full detail service"
        timestamp="1 hour ago"
        onClick={() => alert("Navigate to booking")}
      />
    </div>
  ),
};
