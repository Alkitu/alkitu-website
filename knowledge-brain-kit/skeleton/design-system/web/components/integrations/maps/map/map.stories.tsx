import type { Meta, StoryObj } from "@storybook/react";
import { Map, MapMarker, MarkerContent, MarkerPopup, MarkerTooltip, MapPopup } from "./map";

const meta: Meta<typeof Map> = {
  title: "Integrations/Maps/Map",
  component: Map,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark"],
    },
    zoom: {
      control: { type: "range", min: 1, max: 18, step: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Map>;

export const Default: Story = {
  args: {
    center: [-3.7038, 40.4168] as [number, number],
    zoom: 12,
  },
  render: (args) => (
    <div style={{ height: "500px", width: "100%" }}>
      <Map {...args} />
    </div>
  ),
};

export const WithMarker: Story = {
  args: {
    center: [-3.7038, 40.4168] as [number, number],
    zoom: 13,
  },
  render: (args) => (
    <div style={{ height: "500px", width: "100%" }}>
      <Map {...args}>
        <MapMarker longitude={-3.7038} latitude={40.4168}>
          <MarkerContent />
          <MarkerTooltip>Madrid, Spain</MarkerTooltip>
        </MapMarker>
      </Map>
    </div>
  ),
};

export const WithPopup: Story = {
  args: {
    center: [-3.7038, 40.4168] as [number, number],
    zoom: 13,
  },
  render: (args) => (
    <div style={{ height: "500px", width: "100%" }}>
      <Map {...args}>
        <MapMarker longitude={-3.7038} latitude={40.4168}>
          <MarkerContent>
            <div className="size-5 rounded-full border-2 border-white bg-primary shadow-lg" />
          </MarkerContent>
          <MarkerPopup>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">[Brand] HQ</h3>
              <p className="text-sm text-muted-foreground">Main Office</p>
            </div>
          </MarkerPopup>
        </MapMarker>
      </Map>
    </div>
  ),
};

export const DarkTheme: Story = {
  args: {
    center: [-3.7038, 40.4168] as [number, number],
    zoom: 12,
    theme: "dark" as const,
  },
  render: (args) => (
    <div style={{ height: "500px", width: "100%" }}>
      <Map {...args}>
        <MapMarker longitude={-3.7038} latitude={40.4168}>
          <MarkerContent />
          <MarkerTooltip>Madrid, Spain</MarkerTooltip>
        </MapMarker>
      </Map>
    </div>
  ),
};
