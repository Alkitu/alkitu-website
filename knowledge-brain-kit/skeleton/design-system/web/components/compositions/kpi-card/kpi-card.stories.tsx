import type { Meta, StoryObj } from "@storybook/react";
import { KpiCard } from "./kpi-card";

const meta: Meta<typeof KpiCard> = {
  title: "Compositions/KPI Card",
  component: KpiCard,
  tags: ["autodocs"],
  argTypes: {
    trend: {
      control: "select",
      options: ["up", "down", "stable"],
      description: "Direction of the trend indicator",
    },
    changePercent: {
      control: "number",
      description: "Percentage change to display",
    },
    label: {
      control: "text",
      description: "Label text above the value",
    },
    value: {
      control: "text",
      description: "The metric value",
    },
    periodComparison: {
      control: "text",
      description: "Comparison period text",
    },
  },
  args: {
    label: "Total Revenue",
    value: "12,450.00 EUR",
    trend: "up",
    changePercent: 12,
    periodComparison: "vs previous month",
  },
};

export default meta;
type Story = StoryObj<typeof KpiCard>;

export const Default: Story = {};

export const TrendUp: Story = {
  args: {
    label: "Total Sales",
    value: "8,320.00 EUR",
    trend: "up",
    changePercent: 15,
    periodComparison: "vs previous month",
  },
};

export const TrendDown: Story = {
  args: {
    label: "Cancellations",
    value: "23",
    trend: "down",
    changePercent: -8,
    periodComparison: "vs previous week",
  },
};

export const Stable: Story = {
  args: {
    label: "Average Ticket",
    value: "45.00 EUR",
    trend: "stable",
    changePercent: 0,
    periodComparison: "vs previous month",
  },
};

export const SimpleNoTrend: Story = {
  args: {
    label: "Active Franchises",
    value: "24",
    trend: undefined,
    changePercent: undefined,
    periodComparison: undefined,
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Average Ticket"
        value="45.00 EUR"
        trend="up"
        changePercent={12}
        periodComparison="vs previous month"
      />
      <KpiCard
        label="Total Sales"
        value="8,320.00 EUR"
        trend="up"
        changePercent={8}
        periodComparison="vs previous month"
      />
      <KpiCard
        label="Top Service"
        value="Interior Cleaning"
        trend="stable"
        changePercent={0}
        periodComparison="no change"
      />
      <KpiCard
        label="New vs Recurring"
        value="156"
        trend="down"
        changePercent={-3}
        periodComparison="42 New / 114 Recurring"
      />
    </div>
  ),
};
