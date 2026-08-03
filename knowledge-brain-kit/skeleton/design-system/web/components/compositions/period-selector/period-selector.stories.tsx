import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PeriodSelector } from "./period-selector";

const meta: Meta<typeof PeriodSelector> = {
  title: "Compositions/Period Selector",
  component: PeriodSelector,
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    placeholder: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof PeriodSelector>;

const dashboardOptions = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

const analyticsOptions = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "365d", label: "Last year" },
];

export const Dashboard: Story = {
  render: () => {
    const [value, setValue] = useState("month");
    return (
      <PeriodSelector
        value={value}
        onValueChange={setValue}
        options={dashboardOptions}
        placeholder="Select period"
      />
    );
  },
};

export const Analytics: Story = {
  render: () => {
    const [value, setValue] = useState("30d");
    return (
      <PeriodSelector
        value={value}
        onValueChange={setValue}
        options={analyticsOptions}
        placeholder="Select range"
      />
    );
  },
};

export const CustomWidth: Story = {
  render: () => {
    const [value, setValue] = useState("month");
    return (
      <PeriodSelector
        value={value}
        onValueChange={setValue}
        options={dashboardOptions}
        triggerClassName="w-[240px]"
        placeholder="Select period"
      />
    );
  },
};
